import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';

import CommandHandler from '@barchart/common-js/commands/CommandHandler.js';
import Disposable from '@barchart/common-js/lang/Disposable.js';
import DisposableStack from '@barchart/common-js/collections/specialized/DisposableStack.js';
import Event from '@barchart/common-js/messaging/Event.js';

import Container from './../endpoints/Container.js';
import PageContainer from './../endpoints/html/PageContainer.js';
import RelayContainer from './../endpoints/html/RelayContainer.js';
import RestContainer from './../endpoints/rest/RestContainer.js';
import ServerFactory from './../ServerFactory.js';
import SocketRequestContainer from './../endpoints/socket/specialized/SocketRequestContainer.js';
import SocketEmitterContainer from './../endpoints/socket/specialized/SocketEmitterContainer.js';
import SocketSubscriptionContainer from './../endpoints/socket/specialized/SocketSubscriptionContainer.js';
import Verb from './../../http/Verb.js';
import S3Provider from './../../../aws/S3Provider.js';

import bodyParser from 'body-parser';
import clientSessions from 'client-sessions';
import express from 'express';
import expressHandlebars from 'express-handlebars';
import http from 'http';
import https from 'https';
import log4js from 'log4js';
import multer from 'multer';
import path from 'path';
import proxy from 'express-http-proxy';
import querystring from 'querystring';
import { Server as SocketIOServer } from 'socket.io';

const logger = log4js.getLogger('common-node/network/server/express/ExpressServerFactory');

export default class ExpressServerFactory extends ServerFactory {
	constructor() {
		super();
	}

	/**
	 * @protected
	 * @override
	 * @async
	 * @param containers
	 * @param staticPaths
	 * @param templatePath
	 * @return {Promise<*>}
	 */
	async _build(containers, staticPaths, templatePath) {
		const serverContainer = new ExpressServerContainer(staticPaths, templatePath);
		const containerBindingStrategies = ContainerBindingStrategy.getStrategies();

		await Promise.all(containers.map((container) => {
			const containerBindingStrategy = containerBindingStrategies.find((candidate) => {
				return candidate.canBind(container);
			});

			if (containerBindingStrategy) {
				return containerBindingStrategy.bind(container, serverContainer);
			}

			logger.warn('Unable to find appropriate binding strategy for container');

			return null;
		}));

		return serverContainer.start();
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[ExpressServerFactory]';
	}
}

class ExpressServer {
	#pageMap;
	#port;
	#relayMap;
	#secure;
	#serviceMap;
	#socketEmitters;
	#socketRequestMap;
	#socketSubscriptionMap;
	#started;
	#staticPaths;
	#templatePath;
	#useSessions;

	constructor(port, secure, staticPaths, templatePath) {
		assert.argumentIsRequired(port, 'port', Number);
		assert.argumentIsRequired(secure, 'secure', Boolean);
		assert.argumentIsOptional(staticPaths, 'staticPaths', Object);
		assert.argumentIsOptional(templatePath, 'templatePath', String);

		this.#port = port;
		this.#secure = secure;

		this.#useSessions = false;

		this.#staticPaths = staticPaths;
		this.#templatePath = templatePath;

		this.#pageMap = {};
		this.#relayMap = {};
		this.#serviceMap = {};
		this.#socketRequestMap = {};
		this.#socketSubscriptionMap = {};

		this.#socketEmitters = [ ];

		this.#started = false;
	}

	getPort() {
		return this.#port;
	}

	getIsSecure() {
		return this.#secure;
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

		this.#useSessions = this.#useSessions || useSession;

		if (!this.#pageMap.hasOwnProperty(basePath)) {
			this.#pageMap[basePath] = {
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

		this.#pageMap[basePath].handlers.push(handlerData);
	}

	addRelay(basePath, acceptPath, forwardHost, forwardPath, verb, headerOverrides, parameterOverrides) {
		assert.argumentIsRequired(basePath, 'basePath', String);
		assert.argumentIsRequired(acceptPath, 'acceptPath', String);
		assert.argumentIsRequired(forwardHost, 'forwardHost', String);
		assert.argumentIsRequired(forwardPath, 'forwardPath', String);
		assert.argumentIsRequired(verb, 'verb', Verb, 'Verb');
		assert.argumentIsRequired(headerOverrides, 'headerOverrides', Object);
		assert.argumentIsRequired(parameterOverrides, 'parameterOverrides', Object);

		if (!this.#relayMap.hasOwnProperty(basePath)) {
			this.#relayMap[basePath] = {
				path: basePath,
				relays: [ ]
			};
		}

		this.#relayMap[basePath].relays.push({
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

		if (this.#started) {
			throw new Error('Unable to add route, the server has already been started.');
		}

		if (!this.#serviceMap.hasOwnProperty(basePath)) {
			this.#serviceMap[basePath] = {
				path: basePath,
				handlers: []
			};
		}

		const handlerData = {
			verb: verb,
			path: routePath,
			handler: buildRestHandler(verb, basePath, routePath, command, validationCommand)
		};

		this.#serviceMap[basePath].handlers.push(handlerData);
	}

	addChannel(path, channel, executionCommand, validationCommand) {
		assert.argumentIsRequired(path, 'path', String);
		assert.argumentIsRequired(channel, 'channel', String);
		assert.argumentIsRequired(executionCommand, 'executionCommand', CommandHandler, 'CommandHandler');
		assert.argumentIsRequired(validationCommand, 'validationCommand', CommandHandler, 'CommandHandler');

		if (this.#started) {
			throw new Error('Unable to add request handler for socket.io channel, the server has already been started.');
		}

		const completePath = 'request' + path + channel;

		if (this.#socketRequestMap.hasOwnProperty(completePath)) {
			throw new Error('Unable to add handler for socket.io channel, another handler is already using this channel.');
		}

		this.#socketRequestMap[completePath] = {
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

		if (this.#started) {
			throw new Error('Unable to add emitter for socket.io channel, the server has already been started.');
		}

		this.#socketEmitters.push({
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

		if (this.#started) {
			throw new Error('Unable to add subscription handler for socket.io channel, the server has already been started.');
		}

		const completePath = 'subscribe' + path + channel;

		if (this.#socketSubscriptionMap.hasOwnProperty(completePath)) {
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

		this.#socketSubscriptionMap[completePath] = subscriptionInfo;
	}

	/**
	 * @async
	 * @returns {Promise<DisposableStack>}
	 */
	async start() {
		if (this.#started) {
			throw new Error('Unable to start server, the has already been started.');
		}

		this.#started = true;

		const startPromises = [ ];

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

		if (this.#useSessions) {
			app.use(clientSessions({
				cookieName: 'session',
				secret: 'barchart-session-secret-1234567890',
				duration: 24 * 60 * 60 * 1000
			}));
		}

		if (this.#staticPaths !== null) {
			Object.keys(this.#staticPaths).forEach((serverPath) => {
				const staticPathItem = this.#staticPaths[serverPath];

				if (staticPathItem.type === 'local') {
					logger.info('Bound static path', serverPath, 'on', (secure ? 'HTTPS' : 'HTTP'), 'port', port, 'to file system at', staticPathItem.filePath);

					app.use(serverPath, express.static(staticPathItem.filePath));
					} else if (staticPathItem.type === 's3') {
						startPromises.push((async () => {
							const s3 = new S3Provider(staticPathItem.s3);

							await s3.start();

							logger.info('Bound static path', serverPath, 'on', (secure ? 'HTTPS' : 'HTTP'), 'port', port, 'to s3 bucket', staticPathItem.s3.bucket);

							const router = express.Router();

							router.get(new RegExp('^[\\/\]*' + serverPath + '(.*)$'), async (request, response) => {
								const requestPath = request.params[0];

								if (is.string(requestPath) && requestPath.length > 0) {
									try {
										const data = await s3.download(staticPathItem.keyPrefix + requestPath);

										response.send(data);
									} catch (e) {
										response.status(404);
										response.json(generateRestResponse('file not found'));
									}
								} else {
									response.status(404);
									response.json(generateRestResponse('no data'));
								}
							});

							app.use(router);
						})());
					} else {
						logger.warn('Unable to configure static path', staticPathItem);
					}
			});
		}

		const routeBindingStrategies = ExpressRouteBindingStrategy.getStrategies();

		const pageKeys = Object.keys(this.#pageMap);

		if (is.string(this.#templatePath) && pageKeys.some(() => true)) {
			app.set('views', this.#templatePath);
			app.engine('.hbs', expressHandlebars({extname: '.hbs'}));
			app.set('view engine', '.hbs');

			pageKeys.forEach((key) => {
				const pageData = this.#pageMap[key];

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

		const relayKeys = Object.keys(this.#relayMap);

		relayKeys.forEach((key) => {
			const rootData = this.#relayMap[key];

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

		const serviceKeys = Object.keys(this.#serviceMap);

		serviceKeys.forEach((key) => {
			const routeData = this.#serviceMap[key];

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

		const socketRequestKeys = Object.keys(this.#socketRequestMap);
		const socketSubscriptionKeys = Object.keys(this.#socketSubscriptionMap);

		if (socketRequestKeys.some(() => true) || socketSubscriptionKeys.some(() => true) || this.#socketEmitters.some(() => true)) {
			const io = new SocketIOServer(server);

				this.#socketEmitters.forEach((emitterData) => {
					startStack.push(
						emitterData.event.register(async (data) => {
							const qualifier = await emitterData.room.command.process(data);

							let room = emitterData.room.base;

							if (qualifier) {
								room = room + qualifier;
							}

							logger.debug('Socket.io emitter on port', port, 'emitting to', room);

							io.to(room).emit(emitterData.eventType, data);
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
					const requestInfo = this.#socketRequestMap[channel];

					socket.on(channel, buildSocketRequestHandler(channel, requestInfo, socket));
				});

				socketSubscriptionKeys.forEach((channel) => {
					const subscriptionInfo = this.#socketSubscriptionMap[channel];

					socket.on(channel, buildSocketSubscriptionHandler(channel, subscriptionInfo, socket));
				});

				logger.info('Socket.io client [', socket.id, '] at', socket.conn.remoteAddress, 'on port', port, 'is ready to accept messages');
			});
		}

		server.listen(port);

		startStack.push(Disposable.fromAction(() => {
			server.close();
		}));

		await Promise.all(startPromises);

		return startStack;
	}
}

class ExpressServerContainer {
	#serverMap;
	#started;
	#staticPaths;
	#templatePath;

	constructor(staticPaths, templatePath) {
		this.#serverMap = {};

		this.#staticPaths = staticPaths || null;
		this.#templatePath = templatePath || null;

		this.#started = false;
	}

	getServer(port, secure) {
		if (this.#started) {
			throw new Error('Unable to manipulate servers, the server container has already started.');
		}

		if (!this.#serverMap.hasOwnProperty(port)) {
			this.#serverMap[port] = new ExpressServer(port, secure, this.#staticPaths, this.#templatePath);
		}

		const returnRef = this.#serverMap[port];

		if (returnRef.getIsSecure() !== secure) {
			throw new Error('Unable to bind HTTP and HTTPS protocol to the same port (' + port + ').');
		}

		return returnRef;
	}

	/**
	 * @async
	 * @returns {Promise<DisposableStack>}
	 */
	async start() {
		if (this.#started) {
			throw new Error('Unable to start servers, the server container has already started.');
		}

		this.#started = true;

		const disposables = await Promise.all(
			Object.keys(this.#serverMap).map((port) => {
				const server = this.#serverMap[port];

			logger.info('Starting new ' + (server.getIsSecure() ? 'secure ' : '') + 'server on port ' + server.getPort());

				return server.start();
			})
		);

		return disposables.reduce((stack, disposable) => {
			stack.push(disposable);

			return stack;
		}, new DisposableStack());
	}
}

class ExpressRouteBindingStrategy {
	#action;
	#verb;

	constructor(verb, action) {
		assert.argumentIsRequired(verb, 'verb', Verb, 'Verb');
		assert.argumentIsRequired(action, 'action', Function);

		this.#verb = verb;
		this.#action = action;
	}

	canBind(verb) {
		return this.#verb === verb;
	}

	bind(router, verb, path, handlers) {
		assert.argumentIsRequired(router, router);
		assert.argumentIsRequired(verb, 'verb', Verb, 'Verb');
		assert.argumentIsRequired(path, 'path', String);

		assert.argumentIsArray(handlers, 'handlers', Function, 'Function');

		if (!this.canBind(verb)) {
			logger.warn('Unable to bind endpoint. The strategy does not support the HTTP verb (' + verb.getCode() + ')');
		}

		return this.#action(router, path, handlers);
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
	#action;
	#verb;

	constructor(verb, action) {
		assert.argumentIsRequired(verb, 'verb', Verb, 'Verb');
		assert.argumentIsRequired(action, 'action', Function);

		this.#verb = verb;
		this.#action = action;
	}

	canProcess(verb) {
		return this.#verb === verb;
	}

	getCommandArguments(verb, request, useSession, acceptFile) {
		assert.argumentIsRequired(request, 'request');

		if (!this.canProcess(verb)) {
			logger.warn('Unable to extract arguments from HTTP request.');
		}

		const returnRef = this.#action(request);

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

		return this._bind(container, serverContainer);
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
			return { };
		};
	}

	handlers.push(async (request, response) => {
		const sequence = sequencer++;

		logger.debug('Processing starting for', verb.getCode(), 'at', path.join(basePath, routePath), '(' + sequence + ')');

		try {
			if (secureRedirect && request.headers['x-forwarded-proto'] === 'http') {
				if (verb === Verb.GET) {
					logger.warn('Redirecting HTTP ', verb.getCode(), 'at', path.join(basePath, routePath), ' to HTTPS (' + sequence + ')');

					response.redirect('https://' + request.headers.host + request.url);

					return;
				} else {
					logger.error('Unable to redirect HTTP ', verb.getCode(), 'at', path.join(basePath, routePath), ' to HTTPS (' + sequence + ')');

					throw 'Unable to redirect HTTP ';
				}
			}

			const commandArguments = argumentExtractionStrategy.getCommandArguments(verb, request, useSession, acceptFile);
			const result = await command.process(commandArguments);

			if (!cache) {
				response.setHeader('Cache-Control', 'private, max-age=0, no-cache');
			}

			response.render(template, result);

			logger.debug('Processing completed for', verb.getCode(), 'at', path.join(basePath + routePath), '(' + sequence + ')');
		} catch (error) {
			logger.error('Processing failed for', verb.getCode(), 'at', path.join(basePath, routePath), '(' + sequence + ')');
			logger.error(error);

			response.status(500);
			response.json(generateRestResponse(error.message || error.toString() || 'internal server error'));
		}
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
			return { };
		};
	}

	return async (request, response) => {
		const sequence = sequencer++;

		logger.debug('Processing starting for', verb.getCode(), 'at', path.join(basePath, routePath), '(' + sequence + ')');

		try {
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

			let commandArguments;

			try {
				const result = await validationCommand.process(validationData);

				if (result) {
					logger.trace('Validated command (' + sequence + ')');

					commandArguments = validationData.payload;
				} else {
					logger.info('Validate failed (' + sequence + ')');

					commandArguments = null;
				}
			} catch (e) {
				logger.error('Validate error (' + sequence + ')', e);

				commandArguments = null;
			}

			if (commandArguments === null) {
				response.status(401);
				response.json(generateRestResponse('unauthorized'));

				return;
			}

			logger.trace('Processing command (' + sequence + ') with the following arguments:', commandArguments);

			const result = await command.process(commandArguments);

			if (is.object(result) || is.array(result)) {
				response.json(result);
			} else if (verb === Verb.GET && (is.nil(result) || is.undef(result))) {
				response.status(404);
				response.json(generateRestResponse('no data'));
			} else {
				response.status(200);
				response.json(generateRestResponse('success'));
			}

			logger.debug('Processing completed for', verb.getCode(), 'at', path.join(basePath, routePath), '(' + sequence + ')');
		} catch (error) {
			logger.error('Processing failed for', verb.getCode(), 'at', path.join(basePath, routePath), '(' + sequence + ')');
			logger.error(error);

			response.status(500);
			response.json(generateRestResponse(error.message || error.toString() || 'internal server error'));
		}
	};
}

function buildSocketRequestHandler(channel, requestInfo, socket) {
	return async (request) => {
		const sequence = sequencer++;

		const requestId = request.requestId;

		if (!is.string(requestId)) {
			throw new Error('Unable to process socket.io request. A "requestId" property is expected.');
		}

		logger.debug('Processing starting for socket.io request from [', socket.id ,'] on', channel, '(', sequence, ')');

		try {
			let validationData;

			if (request.context) {
				validationData = {
					context: request.context,
					payload: request.request
				};
			} else {
				validationData = null;
			}

			const valid = await requestInfo.commands.validation.process(validationData);

			if (!valid) {
				throw new Error('Unable to process request, validation failed.');
			}

			const result = await requestInfo.commands.execution.process(request.request);

			const envelope = {
				requestId: request.requestId,
				response: result || {}
			};

			socket.emit('response', envelope);

			logger.debug('Processing completed for socket.io request on', channel, '(', sequence, ')');
		} catch (error) {
			logger.error('Processing failed for socket.io request on', channel, '(', sequence, ')');
			logger.error(error);
		}
	};
}

function buildSocketSubscriptionHandler(channel, subscriptionInfo, socket) {
	return async (request) => {
		const sequence = sequencer++;

		logger.debug('Processing starting for socket.io subscription request from [', socket.id ,'] on', channel, '(', sequence, ')');

		try {
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

			const valid = await subscriptionInfo.commands.validation.process(validationData);

			if (!valid) {
				throw new Error('Unable to process subscription, validation failed.');
			}

			const qualifiers = await subscriptionInfo.commands.rooms.process(request);

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

			if (subscriptionInfo.response.eventType) {
				const response = await subscriptionInfo.commands.response.process(request);

				if (response) {
					socket.emit(subscriptionInfo.response.eventType, response);

					logger.debug('Socket.io client [', socket.id, '] sent immediate response after joining [', roomsToJoin.join(','), ']');
				}
			}

			logger.debug('Processing completed for socket.io subscription request on', channel, '(', sequence, ')');
		} catch (error) {
			logger.error('Processing failed for socket.io subscription request on', channel, '(', sequence, ')');
			logger.error(error);
		}
	};
}

function generateRestResponse(message) {
	return {
		message: message
	};
}
