const bodyParser = require('body-parser'),
	clientSessions = require('client-sessions'),
	express = require('express'),
	expressHandlebars = require('express-handlebars'),
	http = require('http'),
	https = require('https'),
	log4js = require('log4js'),
	multer = require('multer'),
	path = require('path'),
	proxy = require('express-http-proxy'),
	querystring = require('querystring'),
	socketIO = require('socket.io');

const assert = require('@barchart/common-js/lang/assert'),
	CommandHandler = require('@barchart/common-js/commands/CommandHandler'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
	DisposableStack = require('@barchart/common-js/collections/specialized/DisposableStack'),
	Event = require('@barchart/common-js/messaging/Event'),
	is = require('@barchart/common-js/lang/is'),
	promise = require('@barchart/common-js/lang/promise');

const Container = require('./../endpoints/Container'),
	PageContainer = require('./../endpoints/html/PageContainer'),
	RelayContainer = require('./../endpoints/html/RelayContainer'),
	RestContainer = require('./../endpoints/rest/RestContainer'),
	ServerFactory = require('./../ServerFactory'),
	SocketRequestContainer = require('./../endpoints/socket/specialized/SocketRequestContainer'),
	SocketEmitterContainer = require('./../endpoints/socket/specialized/SocketEmitterContainer'),
	SocketSubscriptionContainer = require('./../endpoints/socket/specialized/SocketSubscriptionContainer'),
	Verb = require('./../../http/Verb');

const S3Provider = require('./../../../aws/S3Provider');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('common-node/network/server/express/ExpressServerFactory');

	class ExpressServerFactory extends ServerFactory {
		constructor() {
			super();
		}

		_build(containers, staticPaths, templatePath) {
			const serverContainer = new ExpressServerContainer(staticPaths, templatePath);
			const containerBindingStrategies = ContainerBindingStrategy.getStrategies();

			return Promise.all(containers.map((container) => {
				const containerBindingStrategy = containerBindingStrategies.find((candidate) => {
					return candidate.canBind(container);
				});

				let bindingPromise;

				if (containerBindingStrategy) {
					bindingPromise = containerBindingStrategy.bind(container, serverContainer);
				} else {
					logger.warn('Unable to find appropriate binding strategy for container');

					bindingPromise = Promise.resolve(null);
				}

				return bindingPromise;
			})).then((ignored) => {
				return serverContainer.start();
			});
		}

		toString() {
			return '[ExpressServerFactory]';
		}
	}

	class ExpressServer {
		constructor(port, secure, staticPaths, templatePath) {
			assert.argumentIsRequired(port, 'port', Number);
			assert.argumentIsRequired(secure, 'secure', Boolean);
			assert.argumentIsOptional(staticPaths, 'staticPaths', Object);
			assert.argumentIsOptional(templatePath, 'templatePath', String);

			this._port = port;
			this._secure = secure;

			this._useSessions = false;

			this._staticPaths = staticPaths;
			this._templatePath = templatePath;

			this._pageMap = {};
			this._relayMap = {};
			this._serviceMap = {};
			this._socketRequestMap = {};
			this._socketSubscriptionMap = {};

			this._socketEmitters = [ ];

			this._started = false;
		}

		getPort() {
			return this._port;
		}

		getIsSecure() {
			return this._secure;
		}

		addPage(basePath, pagePath, template, verb, command, cache, useSession, acceptFile, secureRedirect) {
			assert.argumentIsRequired(basePath, 'basePath', String);
			assert.argumentIsRequired(pagePath, 'pagePath', String);
			assert.argumentIsRequired(template, 'template', String);
			assert.argumentIsRequired(verb, 'verb', Verb, 'Verb');
			assert.argumentIsRequired(command, 'command', CommandHandler, 'CommandHandler');
			assert.argumentIsRequired(cache, 'cache', Boolean);
			assert.argumentIsRequired(useSession, 'useSession', Boolean);
			assert.argumentIsRequired(useSession, 'acceptFile', Boolean);
			assert.argumentIsRequired(secureRedirect, 'secureRedirect', Boolean);

			this._useSessions = this._useSessions || useSession;

			if (!this._pageMap.hasOwnProperty(basePath)) {
				this._pageMap[basePath] = {
					path: basePath,
					handlers: []
				};
			}

			const handlerData = {
				verb: verb,
				path: pagePath,
				template: template,
				handlers: buildPageHandlers(verb, basePath, pagePath, template, command, cache, useSession, acceptFile, secureRedirect)
			};

			this._pageMap[basePath].handlers.push(handlerData);
		}

		addRelay(basePath, acceptPath, forwardHost, forwardPath, verb, headerOverrides, parameterOverrides) {
			assert.argumentIsRequired(basePath, 'basePath', String);
			assert.argumentIsRequired(acceptPath, 'acceptPath', String);
			assert.argumentIsRequired(forwardHost, 'forwardHost', String);
			assert.argumentIsRequired(forwardPath, 'forwardPath', String);
			assert.argumentIsRequired(verb, 'verb', Verb, 'Verb');
			assert.argumentIsRequired(headerOverrides, 'headerOverrides', Object);
			assert.argumentIsRequired(parameterOverrides, 'parameterOverrides', Object);

			if (!this._relayMap.hasOwnProperty(basePath)) {
				this._relayMap[basePath] = {
					path: basePath,
					relays: [ ]
				};
			}

			this._relayMap[basePath].relays.push({
				verb: verb,
				acceptPath: acceptPath,
				forwardHost: forwardHost,
				forwardPath: forwardPath,
				handler: buildRelayHandler(basePath, acceptPath, forwardHost, forwardPath, verb, headerOverrides, parameterOverrides)
			});
		}

		addService(basePath, routePath, verb, command, validationCommand) {
			assert.argumentIsRequired(basePath, 'basePath', String);
			assert.argumentIsRequired(routePath, 'routePath', String);
			assert.argumentIsRequired(verb, 'verb', Verb, 'Verb');
			assert.argumentIsRequired(command, 'command', CommandHandler, 'CommandHandler');
			assert.argumentIsRequired(validationCommand, 'validationCommand', CommandHandler, 'CommandHandler');

			if (this._started) {
				throw new Error('Unable to add route, the server has already been started.');
			}

			if (!this._serviceMap.hasOwnProperty(basePath)) {
				this._serviceMap[basePath] = {
					path: basePath,
					handlers: []
				};
			}

			const handlerData = {
				verb: verb,
				path: routePath,
				handler: buildRestHandler(verb, basePath, routePath, command, validationCommand)
			};

			this._serviceMap[basePath].handlers.push(handlerData);
		}

		addChannel(path, channel, executionCommand, validationCommand) {
			assert.argumentIsRequired(path, 'path', String);
			assert.argumentIsRequired(channel, 'channel', String);
			assert.argumentIsRequired(executionCommand, 'executionCommand', CommandHandler, 'CommandHandler');
			assert.argumentIsRequired(validationCommand, 'validationCommand', CommandHandler, 'CommandHandler');

			if (this._started) {
				throw new Error('Unable to add request handler for socket.io channel, the server has already been started.');
			}

			const completePath = 'request' + path + channel;

			if (this._socketRequestMap.hasOwnProperty(completePath)) {
				throw new Error('Unable to add handler for socket.io channel, another handler is already using this channel.');
			}

			this._socketRequestMap[completePath] = {
				commands: {
					execution: executionCommand,
					validation: validationCommand
				}
			};
		}

		addEmitter(path, channel, event, eventType, roomCommand) {
			assert.argumentIsRequired(path, 'path', String);
			assert.argumentIsRequired(channel, 'channel', String);
			assert.argumentIsRequired(event, 'event', Event, 'Event');
			assert.argumentIsRequired(eventType, 'eventType', String);
			assert.argumentIsRequired(roomCommand, 'roomCommand', CommandHandler, 'CommandHandler');

			if (this._started) {
				throw new Error('Unable to add emitter for socket.io channel, the server has already been started.');
			}

			this._socketEmitters.push({
				room: {
					base: path + channel,
					command: roomCommand
				},
				event: event,
				eventType: eventType
			});
		}

		addSubscription(path, channel, roomsCommand, responseCommand, responseEventType, validationCommand) {
			assert.argumentIsRequired(path, 'path', String);
			assert.argumentIsRequired(channel, 'channel', String);
			assert.argumentIsRequired(roomsCommand, 'roomsCommand', CommandHandler, 'CommandHandler');
			assert.argumentIsRequired(responseCommand, 'responseCommand', CommandHandler, 'CommandHandler');
			assert.argumentIsRequired(responseEventType, 'responseEventType', String);
			assert.argumentIsRequired(validationCommand, 'validationCommand', CommandHandler, 'CommandHandler');

			if (this._started) {
				throw new Error('Unable to add subscription handler for socket.io channel, the server has already been started.');
			}

			const completePath = 'subscribe' + path + channel;

			if (this._socketSubscriptionMap.hasOwnProperty(completePath)) {
				throw new Error('Unable to add subscription handler for socket.io channel, another handler is already using this channel.');
			}

			const subscriptionInfo = {
				commands: {
					rooms: roomsCommand,
					response: responseCommand,
					validation: validationCommand
				},
				room: {
					base: path + channel
				},
				response: {
					eventType: responseEventType
				}
			};

			this._socketSubscriptionMap[completePath] = subscriptionInfo;
		}

		start() {
			if (this._started) {
				throw new Error('Unable to start server, the has already been started.');
			}

			this._started = true;

			let startPromise = Promise.resolve();

			const startStack = new DisposableStack();

			const secure = this.getIsSecure();
			const port = this.getPort();

			const app = new express();

			app.use(bodyParser.urlencoded({extended: true, limit: '1mb'}));
			app.use(bodyParser.json({limit: '1mb'}));

			app.use((req, res, next) => {
				logger.debug('Applying HTTP headers for ' + req.originalUrl);

				res.header('Access-Control-Allow-Origin', '*');
				res.header('Access-Control-Allow-Headers', 'Accept,Access-Control-Allow-Headers,Access-Control-Request-Method,Access-Control-Request-Headers,Access-Control-Allow-Origin,Content-Type,Authorization,Origin,X-Requested-With');
				res.header('Access-Control-Allow-Methods', 'PUT,GET,POST,DELETE,OPTIONS');

				next();
			});

			if (this._useSessions) {
				app.use(clientSessions({
					cookieName: 'session',
					secret: 'barchart-session-secret-1234567890',
					duration: 24 * 60 * 60 * 1000
				}));
			}

			if (this._staticPaths !== null) {
				Object.keys(this._staticPaths).forEach((serverPath) => {
					const staticPathItem = this._staticPaths[serverPath];

					if (staticPathItem.type === 'local') {
						logger.info('Bound static path', serverPath, 'on', (secure ? 'HTTPS' : 'HTTP'), 'port', port, 'to file system at', staticPathItem.filePath);

						app.use(serverPath, express.static(staticPathItem.filePath));
					} else if (staticPathItem.type === 's3') {
						startPromise = startPromise
							.then(() => {
								const s3 = new S3Provider(staticPathItem.s3);

								return s3.start()
									.then(() => {
										logger.info('Bound static path', serverPath, 'on', (secure ? 'HTTPS' : 'HTTP'), 'port', port, 'to s3 bucket', staticPathItem.s3.bucket);

										const router = express.Router();

										router.get(new RegExp('^[\\/\]*' + serverPath + '(.*)$'), (request, response) => {
											const requestPath = request.params[0];

											if (is.string(requestPath) && requestPath.length > 0) {
												return s3.download(staticPathItem.keyPrefix + requestPath)
													.then((data) => {
														response.send(data);
													}).catch((e) => {
														response.status(404);
														response.json(generateRestResponse('file not found'));
													});
											} else {
												response.status(404);
												response.json(generateRestResponse('no data'));
											}
										});

										app.use(router);
									});
							});
					} else {
						logger.warn('Unable to configure static path', staticPathItem);
					}
				});
			}

			const routeBindingStrategies = ExpressRouteBindingStrategy.getStrategies();

			const pageKeys = Object.keys(this._pageMap);

			if (is.string(this._templatePath) && pageKeys.some(() => true)) {
				app.set('views', this._templatePath);
				app.engine('.hbs', expressHandlebars({extname: '.hbs'}));
				app.set('view engine', '.hbs');

				pageKeys.forEach((key) => {
					const pageData = this._pageMap[key];

					const basePath = pageData.path;
					const router = express.Router();

					pageData.handlers.forEach((handlerData) => {
						const verb = handlerData.verb;
						const handlers = handlerData.handlers;
						const pagePath = handlerData.path;
						const template = handlerData.template;

						const routeBindingStrategy = routeBindingStrategies.find((candidate) => {
							return candidate.canBind(verb);
						});

						if (routeBindingStrategy) {
							routeBindingStrategy.bind(router, verb, pagePath, handlers);

							logger.info('Bound page handler for', (secure ? 'HTTPS' : 'HTTP'), verb.getCode(), 'on port', port, 'at', path.join(basePath, pagePath), 'to', template + '.hbs');
						} else {
							logger.warn('Unable to find appropriate binding strategy for endpoint using HTTP verb (' + verb.getCode() + ')');
						}
					});

					app.use(basePath, router);
				});
			}

			const relayKeys = Object.keys(this._relayMap);

			relayKeys.forEach((key) => {
				const rootData = this._relayMap[key];

				const basePath = rootData.path;
				const router = express.Router();

				rootData.relays.forEach((relayData) => {
					const verb = relayData.verb;
					const handler = relayData.handler;
					const acceptPath = relayData.acceptPath;
					const forwardHost = relayData.forwardHost;
					const forwardPath = relayData.forwardPath;

					const routeBindingStrategy = routeBindingStrategies.find((candidate) => {
						return candidate.canBind(verb);
					});

					if (routeBindingStrategy) {
						routeBindingStrategy.bind(router, verb, acceptPath, [ handler ]);

						logger.info('Bound relay for', (secure ? 'HTTPS' : 'HTTP'), verb.getCode(), 'on port', port, 'at', path.join(basePath, acceptPath), 'to', path.join(forwardHost, forwardPath));
					} else {
						logger.warn('Unable to find appropriate binding strategy for endpoint using HTTP verb (' + verb.getCode() + ')');
					}
				});

				app.use(basePath, router);
			});

			const serviceKeys = Object.keys(this._serviceMap);

			serviceKeys.forEach((key) => {
				const routeData = this._serviceMap[key];

				const basePath = routeData.path;
				const router = express.Router();

				routeData.handlers.forEach((handlerData) => {
					const verb = handlerData.verb;
					const handler = handlerData.handler;
					const routePath = handlerData.path;

					const routeBindingStrategy = routeBindingStrategies.find((candidate) => {
						return candidate.canBind(verb);
					});

					if (routeBindingStrategy) {
						routeBindingStrategy.bind(router, verb, routePath, [ handler ]);

						logger.info('Bound REST handler for', (secure ? 'HTTPS' : 'HTTP'), verb.getCode(), 'on port', port, 'at', path.join(basePath, routePath));
					} else {
						logger.warn('Unable to find appropriate binding strategy for endpoint using HTTP verb (' + verb.getCode() + ')');
					}
				});

				app.use(basePath, router);
			});

			let server;

			if (secure) {
				server = https.createServer(app);
			} else {
				server = http.createServer(app);
			}

			const socketRequestKeys = Object.keys(this._socketRequestMap);
			const socketSubscriptionKeys = Object.keys(this._socketSubscriptionMap);

			if (socketRequestKeys.some(() => true) || socketSubscriptionKeys.some(() => true) || this._socketEmitters.some(() => true)) {
				const io = socketIO.listen(server);

				this._socketEmitters.forEach((emitterData) => {
					startStack.push(
						emitterData.event.register((data) => {
							Promise.resolve()
								.then(() => {
									return emitterData.room.command.process(data);
								}).then((qualifier) => {
									let room = emitterData.room.base;

									if (qualifier) {
										room = room + qualifier;
									}

									logger.debug('Socket.io emitter on port', port, 'emitting to', room);

									io.to(room).emit(emitterData.eventType, data);
								});
						})
					);

					logger.info('Bound socket.io emitter on port', port, 'for base room', emitterData.room.base);
				});

				socketRequestKeys.forEach((channel) => {
					logger.info('Bound socket.io request handler on port', port, 'to channel', channel);
				});

				socketSubscriptionKeys.forEach((channel) => {
					logger.info('Bound socket.io subscription handler port', port, 'to channel', channel);
				});

				io.on('connection', (socket) => {
					if (logger.isInfoEnabled()) {
						logger.info('Socket.io client [', socket.id, '] at', socket.conn.remoteAddress, 'connected on port', port);
						logger.info('Socket.io now has', Object.keys(socket.adapter.sids).length, 'connections');
					}

					socket.on('disconnect', () => {
						if (logger.isInfoEnabled()) {
							logger.info('Socket.io client [', socket.id, '] at', socket.conn.remoteAddress, 'on port', port, 'disconnected');
							logger.info('Socket.io now has', Object.keys(socket.adapter.sids).length, 'connections');
						}
					});

					socketRequestKeys.forEach((channel) => {
						const requestInfo = this._socketRequestMap[channel];

						socket.on(channel, buildSocketRequestHandler(channel, requestInfo, socket));
					});

					socketSubscriptionKeys.forEach((channel) => {
						const subscriptionInfo = this._socketSubscriptionMap[channel];

						socket.on(channel, buildSocketSubscriptionHandler(channel, subscriptionInfo, socket));
					});

					logger.info('Socket.io client [', socket.id, '] at', socket.conn.remoteAddress, 'on port', port, 'is ready to accept messages');
				});
			}

			server.listen(port);

			startStack.push(Disposable.fromAction(() => {
				server.close();
			}));

			return startPromise.then(() => {
				return startStack;
			});
		}
	}

	class ExpressServerContainer {
		constructor(staticPaths, templatePath) {
			this._serverMap = {};

			this._staticPaths = staticPaths || null;
			this._templatePath = templatePath || null;

			this._started = false;
		}

		getServer(port, secure) {
			if (this._started) {
				throw new Error('Unable to manipulate servers, the server container has already started.');
			}

			if (!this._serverMap.hasOwnProperty(port)) {
				this._serverMap[port] = new ExpressServer(port, secure, this._staticPaths, this._templatePath);
			}

			const returnRef = this._serverMap[port];

			if (returnRef.getIsSecure() !== secure) {
				throw new Error('Unable to bind HTTP and HTTPS protocol to the same port (' + port + ').');
			}

			return returnRef;
		}

		start() {
			if (this._started) {
				throw new Error('Unable to start servers, the server container has already started.');
			}

			this._started = true;

			Promise.all(
				Object.keys(this._serverMap).map((port) => {
					const server = this._serverMap[port];

					logger.info('Starting new ' + (server.getIsSecure() ? 'secure ' : '') + 'server on port ' + server.getPort());

					return server.start();
				})
			).then((disposables) => {
				return disposables.reduce((stack, disposable) => {
					stack.push(disposable);

					return stack;
				}, new DisposableStack());
			});
		}
	}

	class ExpressRouteBindingStrategy {
		constructor(verb, action) {
			assert.argumentIsRequired(verb, 'verb', Verb, 'Verb');
			assert.argumentIsRequired(action, 'action', Function);

			this._verb = verb;
			this._action = action;
		}

		canBind(verb) {
			return this._verb === verb;
		}

		bind(router, verb, path, handlers) {
			assert.argumentIsRequired(router, router);
			assert.argumentIsRequired(verb, 'verb', Verb, 'Verb');
			assert.argumentIsRequired(path, 'path', String);

			assert.argumentIsArray(handlers, 'handlers', Function, 'Function');

			if (!this.canBind(verb)) {
				logger.warn('Unable to bind endpoint. The strategy does not support the HTTP verb (' + verb.getCode() + ')');
			}

			return this._action(router, path, handlers);
		}
	}

	ExpressRouteBindingStrategy.getStrategies = () => {
		return [
			new ExpressRouteBindingStrategy(Verb.GET, (router, path, handlers) => {
				router.get.apply(router, [path].concat(handlers));
			}),
			new ExpressRouteBindingStrategy(Verb.POST, (router, path, handlers) => {
				router.post.apply(router, [path].concat(handlers));
			}),
			new ExpressRouteBindingStrategy(Verb.PUT, (router, path, handlers) => {
				router.put.apply(router, [path].concat(handlers));
			}),
			new ExpressRouteBindingStrategy(Verb.DELETE, (router, path, handlers) => {
				router.delete.apply(router, [path].concat(handlers));
			})
		];
	};

	class ExpressArgumentExtractionStrategy {
		constructor(verb, action) {
			assert.argumentIsRequired(verb, 'verb', Verb, 'Verb');
			assert.argumentIsRequired(action, 'action', Function);

			this._verb = verb;
			this._action = action;
		}

		canProcess(verb) {
			return this._verb === verb;
		}

		getCommandArguments(verb, request, useSession, acceptFile) {
			assert.argumentIsRequired(request, 'request');

			if (!this.canProcess(verb)) {
				logger.warn('Unable to extract arguments from HTTP request.');
			}

			const returnRef = this._action(request);

			if (useSession) {
				returnRef.session = request.session || { };
			}

			if (acceptFile) {
				returnRef.file = request.file;
			}

			return returnRef;
		}
	}

	ExpressArgumentExtractionStrategy.getStrategies = () => {
		return [
			new ExpressArgumentExtractionStrategy(Verb.GET, (req) => {
				return Object.assign({}, req.query || {}, req.params || {});
			}),
			new ExpressArgumentExtractionStrategy(Verb.POST, (req) => {
				return Object.assign({}, req.params || {}, req.body || {});
			}),
			new ExpressArgumentExtractionStrategy(Verb.PUT, (req) => {
				return Object.assign({}, req.params || {}, req.body || {});
			}),
			new ExpressArgumentExtractionStrategy(Verb.DELETE, (req) => {
				return Object.assign({}, req.query || {}, req.params || {});
			})
		];
	};

	class ContainerBindingStrategy {
		constructor() {

		}

		canBind(container) {
			return this._canBind(container);
		}

		_canBind(container) {
			return false;
		}

		bind(container, serverContainer) {
			assert.argumentIsRequired(container, 'container', Container, 'Container');
			assert.argumentIsRequired(serverContainer, 'serverContainer', ExpressServerContainer, 'ExpressServerContainer');

			if (!this.canBind(container)) {
				throw new Error('Unable to bind container, the strategy does not support the container.');
			}

			return Promise.resolve(this._bind(container, serverContainer));
		}

		_bind(container, serverContainer) {
			return false;
		}
	}

	class RestContainerBindingStrategy extends ContainerBindingStrategy {
		constructor() {
			super();
		}

		_canBind(container) {
			return container instanceof RestContainer;
		}

		_bind(container, serverContainer) {
			const endpoints = container.getEndpoints();

			const server = serverContainer.getServer(container.getPort(), container.getIsSecure(), false);

			endpoints.forEach((endpoint) => {
				server.addService(container.getPath(), endpoint.getPath(), endpoint.getRestAction().getVerb(), endpoint.getExecutionCommand(), endpoint.getValidationCommand());
			});

			return true;
		}
	}

	class SocketRequestContainerBindingStrategy extends ContainerBindingStrategy {
		constructor() {
			super();
		}

		_canBind(container) {
			return container instanceof SocketRequestContainer;
		}

		_bind(container, serverContainer) {
			const endpoints = container.getEndpoints();

			const server = serverContainer.getServer(container.getPort(), container.getIsSecure());

			endpoints.forEach((endpoint) => {
				server.addChannel(container.getPath(), endpoint.getChannel(), endpoint.getExecutionCommand(), endpoint.getValidationCommand());
			});

			return true;
		}
	}

	class SocketEmitterContainerBindingStrategy extends ContainerBindingStrategy {
		constructor() {
			super();
		}

		_canBind(container) {
			return container instanceof SocketEmitterContainer;
		}

		_bind(container, serverContainer) {
			const endpoints = container.getEndpoints();

			const server = serverContainer.getServer(container.getPort(), container.getIsSecure());

			endpoints.forEach((endpoint) => {
				server.addEmitter(container.getPath(), endpoint.getChannel(), endpoint.getEvent(), endpoint.getEventType(), endpoint.getRoomCommand());
			});

			return true;
		}
	}

	class SocketSubscriptionContainerBindingStrategy extends ContainerBindingStrategy {
		constructor() {
			super();
		}

		_canBind(container) {
			return container instanceof SocketSubscriptionContainer;
		}

		_bind(container, serverContainer) {
			const endpoints = container.getEndpoints();

			const server = serverContainer.getServer(container.getPort(), container.getIsSecure());

			endpoints.forEach((endpoint) => {
				server.addSubscription(container.getPath(), endpoint.getChannel(), endpoint.getRoomsCommand(), endpoint.getResponseCommand(), endpoint.getResponseEventType(), endpoint.getValidationCommand());
			});

			return true;
		}
	}

	class HtmlContainerBindingStrategy extends ContainerBindingStrategy {
		constructor() {
			super();
		}

		_canBind(container) {
			return container instanceof PageContainer;
		}

		_bind(container, serverContainer) {
			const endpoints = container.getEndpoints();

			const server = serverContainer.getServer(container.getPort(), container.getIsSecure());

			endpoints.forEach((endpoint) => {
				server.addPage(container.getPath(), endpoint.getPath(), endpoint.getTemplate(), endpoint.getVerb(), endpoint.getExecutionCommand(), endpoint.getCache(), container.getUsesSession(), endpoint.getAcceptFile(), container.getSecureRedirect() || endpoint.getSecureRedirect());
			});

			return true;
		}
	}

	class RelayContainerBindingStrategy extends ContainerBindingStrategy {
		constructor() {
			super();
		}

		_canBind(container) {
			return container instanceof RelayContainer;
		}

		_bind(container, serverContainer) {
			const endpoints = container.getEndpoints();

			const server = serverContainer.getServer(container.getPort(), container.getIsSecure());

			endpoints.forEach((endpoint) => {
				server.addRelay(container.getPath(), endpoint.getAcceptPath(), endpoint.getForwardHost(), endpoint.getForwardPath(), endpoint.getVerb(), endpoint.getHeaderOverrides(), endpoint.getParameterOverrides());
			});

			return true;
		}
	}

	ContainerBindingStrategy.getStrategies = () => {
		return [
			new RestContainerBindingStrategy(),
			new SocketRequestContainerBindingStrategy(),
			new SocketEmitterContainerBindingStrategy(),
			new SocketSubscriptionContainerBindingStrategy(),
			new HtmlContainerBindingStrategy(),
			new RelayContainerBindingStrategy()
		];
	};

	function buildPageHandlers(verb, basePath, routePath, template, command, cache, useSession, acceptFile, secureRedirect) {
		const handlers = [ ];

		if (acceptFile) {
			const uploader = multer({ storage: multer.memoryStorage(), limits: { files: 1, fileSize: 10485760 } });

			handlers.push(uploader.single('file'));
		}

		let sequencer = 0;

		let argumentExtractionStrategy = ExpressArgumentExtractionStrategy.getStrategies().find((candidate) => {
			return candidate.canProcess(verb);
		});

		if (!argumentExtractionStrategy) {
			logger.warn('Unable to find appropriate argument extraction strategy for HTTP ' + verb.getCode() + ' requests');

			argumentExtractionStrategy = () => {
				return {};
			};
		}

		handlers.push((request, response) => {
			const sequence = sequencer++;

			logger.debug('Processing starting for', verb.getCode(), 'at', path.join(basePath, routePath), '(' + sequence + ')');

			let handlerPromise;

			if (secureRedirect && request.headers['x-forwarded-proto'] === 'http') {
				handlerPromise = promise.build((resolveCallback, rejectCallback) => {
					if (verb === Verb.GET) {
						logger.warn('Redirecting HTTP ', verb.getCode(), 'at', path.join(basePath, routePath), ' to HTTPS (' + sequence + ')');

						response.redirect('https://' + request.headers.host + request.url);

						resolveCallback();
					} else {
						logger.error('Unable to redirect HTTP ', verb.getCode(), 'at', path.join(basePath, routePath), ' to HTTPS (' + sequence + ')');

						rejectCallback('Unable to redirect HTTP ', verb.getCode(), 'at', path.join(basePath, routePath), ' to HTTPS (' + sequence + ')');
					}
				});
			} else {
				handlerPromise = Promise.resolve()
					.then(() => {
						const commandArguments = argumentExtractionStrategy.getCommandArguments(verb, request, useSession, acceptFile);

						return command.process(commandArguments);
					}).then((result) => {
						if (!cache) {
							response.setHeader('Cache-Control', 'private, max-age=0, no-cache');
						}

						response.render(template, result);

						logger.debug('Processing completed for', verb.getCode(), 'at', path.join(basePath + routePath), '(' + sequence + ')');
					});
			}

			return handlerPromise
				.catch((error) => {
					logger.error('Processing failed for', verb.getCode(), 'at', path.join(basePath, routePath), '(' + sequence + ')');
					logger.error(error);

					response.status(500);
					response.json(generateRestResponse(error.message || error.toString() || 'internal server error'));
				});
		});

		return handlers;
	}

	function buildRelayHandler(basePath, acceptPath, forwardHost, forwardPath, verb, headerOverrides, parameterOverrides) {
		return proxy(forwardHost, {
			filter: (request, response) => {
				return request.method == verb.getCode();
			},
			forwardPath: (request, response) => {
				let returnRef = forwardPath;

				if (Verb.GET === verb) {
					Object.assign(request.query || { }, parameterOverrides);

					if (Object.keys(request.query).some(() => true)) {
						returnRef = returnRef + '?' + querystring.stringify(request.query);
					}
				}

				return returnRef;
			},
			decorateRequest: (request) => {
				Object.assign(request.headers, headerOverrides);

				if (Verb.GET !== verb) {
					Object.assign(request.body || { }, parameterOverrides);
				}

				return request;
			}
		});
	}

	let sequencer = 0;

	function buildRestHandler(verb, basePath, routePath, command, validationCommand) {
		let argumentExtractionStrategy = ExpressArgumentExtractionStrategy.getStrategies().find((candidate) => {
			return candidate.canProcess(verb);
		});

		if (!argumentExtractionStrategy) {
			logger.warn('Unable to find appropriate argument extraction strategy for HTTP ' + verb.getCode() + ' requests');

			argumentExtractionStrategy = () => {
				return {};
			};
		}

		return (request, response) => {
			const sequence = sequencer++;

			logger.debug('Processing starting for', verb.getCode(), 'at', path.join(basePath, routePath), '(' + sequence + ')');

			return Promise.resolve()
				.then(() => {
					const validationData = {
						payload: argumentExtractionStrategy.getCommandArguments(verb, request) || { }
					};

					const authorization = request.get('authorization');

					if (is.string(authorization) && authorization.length > 0) {
						validationData.context = { };
						validationData.context.token = request.headers.authorization;
					} else {
						validationData.context = null;
					}

					logger.trace('Validating command (' + sequence + ') with the following arguments:', validationData);

					return Promise.resolve(validationCommand.process(validationData))
						.then((result) => {
							if (result) {
								logger.trace('Validated command (' + sequence + ')');

								 return validationData.payload;
							} else {
								logger.info('Validate failed (' + sequence + ')');

								return null;
							}
						}).catch((e) => {
							logger.error('Validate error (' + sequence + ')', e);

							return null;
						});
				}).then((commandArguments) => {
					if (commandArguments === null) {
						response.status(401);
						response.json(generateRestResponse('unauthorized'));
					} else {
						logger.trace('Processing command (' + sequence + ') with the following arguments:', commandArguments);

						return Promise.resolve(command.process(commandArguments))
							.then((result) => {
								if (is.object(result) || is.array(result)) {
									response.json(result);
								} else if (verb === Verb.GET && (is.null(result) || is.undefined(result))) {
									response.status(404);
									response.json(generateRestResponse('no data'));
								} else {
									response.status(200);
									response.json(generateRestResponse('success'));
								}

								logger.debug('Processing completed for', verb.getCode(), 'at', path.join(basePath, routePath), '(' + sequence + ')');
							});
					}
				}).catch((error) => {
					logger.error('Processing failed for', verb.getCode(), 'at', path.join(basePath, routePath), '(' + sequence + ')');
					logger.error(error);

					response.status(500);
					response.json(generateRestResponse(error.message || error.toString() || 'internal server error'));
				});
		};
	}

	function buildSocketRequestHandler(channel, requestInfo, socket) {
		return (request) => {
			const sequence = sequencer++;

			const requestId = request.requestId;

			if (!is.string(requestId)) {
				throw new Error('Unable to process socket.io request. A "requestId" property is expected.');
			}

			logger.debug('Processing starting for socket.io request from [', socket.id ,'] on', channel, '(', sequence, ')');

			return Promise.resolve()
				.then(() => {
					let validationData;

					if (request.context) {
						validationData = {
							context: request.context,
							payload: request.request
						};
					} else {
						validationData = null;
					}

					return requestInfo.commands.validation.process(validationData);
				}).then((valid) => {
					if (!valid) {
						throw new Error('Unable to process request, validation failed.');
					}

					return requestInfo.commands.execution.process(request.request);
				}).then((result) => {
					const envelope = {
						requestId: request.requestId,
						response: result || {}
					};

					socket.emit('response', envelope);

					logger.debug('Processing completed for socket.io request on', channel, '(', sequence, ')');
				}).catch((error) => {
					logger.error('Processing failed for socket.io request on', channel, '(', sequence, ')');
					logger.error(error);
				});
		};
	}

	function buildSocketSubscriptionHandler(channel, subscriptionInfo, socket) {
		return (request) => {
			const sequence = sequencer++;

			logger.debug('Processing starting for socket.io subscription request from [', socket.id ,'] on', channel, '(', sequence, ')');

			return Promise.resolve()
				.then(() => {
					let validationData;

					if (request.context) {
						const context = request.context;
						const payload = request;

						delete request.context;

						validationData = {
							context: context,
							payload: payload
						};
					} else {
						validationData = null;
					}

					return subscriptionInfo.commands.validation.process(validationData);
				}).then((valid) => {
					if (!valid) {
						throw new Error('Unable to process subscription, validation failed.');
					}

					return subscriptionInfo.commands.rooms.process(request);
				}).then((qualifiers) => {
					let qualifiersToJoin;

					if (is.array(qualifiers)) {
						qualifiersToJoin = qualifiers;
					} else if (is.string(qualifiers)) {
						qualifiersToJoin = [ qualifiers ];
					} else {
						qualifiersToJoin = [ ];
					}

					const roomsToJoin = qualifiersToJoin.map((qualifierToJoin) => {
						return subscriptionInfo.room.base + qualifierToJoin;
					});

					roomsToJoin.forEach((roomToJoin) => {
						socket.join(roomToJoin);
					});

					logger.debug('Socket.io client [', socket.id, '] joined [', roomsToJoin.join(','), ']');

					let responsePromise;

					if (subscriptionInfo.response.eventType) {
						responsePromise = subscriptionInfo.commands.response.process(request)
							.then((response) => {
								if (response) {
									socket.emit(subscriptionInfo.response.eventType, response);

									logger.debug('Socket.io client [', socket.id, '] sent immediate response after joining [', roomsToJoin.join(','), ']');
								}
							});
					} else {
						responsePromise = Promise.resolve();
					}

					return responsePromise;
				}).then(() => {
					logger.debug('Processing completed for socket.io subscription request on', channel, '(', sequence, ')');
				}).catch((error) => {
					logger.error('Processing failed for socket.io subscription request on', channel, '(', sequence, ')');
					logger.error(error);
				});
		};
	}

	function generateRestResponse(message) {
		return {
			message: message
		};
	}

	return ExpressServerFactory;
})();
