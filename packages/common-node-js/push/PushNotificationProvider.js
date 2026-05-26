const log4js = require('log4js');

const assert = require('@barchart/common-js/lang/assert'),
	Enum = require('@barchart/common-js/lang/Enum'),
	Disposable = require('@barchart/common-js/lang/Disposable');

const EndpointBuilder = require('@barchart/common-js/api/http/builders/EndpointBuilder'),
	ErrorInterceptor = require('@barchart/common-js/api/http/interceptors/ErrorInterceptor'),
	FailureReason = require('@barchart/common-js/api/failures/FailureReason'),
	FailureType = require('@barchart/common-js/api/failures/FailureType'),
	Gateway = require('@barchart/common-js/api/http/Gateway'),
	ProtocolType = require('@barchart/common-js/api/http/definitions/ProtocolType'),
	RequestInterceptor = require('@barchart/common-js/api/http/interceptors/RequestInterceptor'),
	ResponseInterceptor = require('@barchart/common-js/api/http/interceptors/ResponseInterceptor'),
	VerbType = require('@barchart/common-js/api/http/definitions/VerbType');

const JwtProvider = require('./security/JwtProvider');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('common-node/push/PushNotificationProvider');

	/**
	 * A wrapper for the Push Notification Service.
	 *
	 * @public
	 * @param {String} protocol - The protocol of the of the Push Notification service (either http or https).
	 * @param {String} host - The hostname of the Push Notification service.
	 * @param {Number} port - The TCP port number of the Push Notification service.
	 */
	class PushNotificationProvider extends Disposable {
		constructor(protocol, host, port) {
			super();

			assert.argumentIsRequired(protocol, 'protocol', String);
			assert.argumentIsRequired(host, 'host', String);
			assert.argumentIsRequired(port, 'port', Number);

			const protocolType = Enum.fromCode(ProtocolType, protocol.toUpperCase());

			const requestInterceptorForRegister = getRequestInterceptorForJwtForRegister.call(this);
			const requestInterceptorForSend = getRequestInterceptorForJwtForSend.call(this);
			
			this._protocol = protocol;
			this._host = host;
			this._port = port;
			
			this._jwtProviderRegister = null;
			this._jwtProviderSend = null;
			this._started = true;
			
			this._sendNotificationEndpoint = EndpointBuilder.for('send-notification', 'send notification')
				.withVerb(VerbType.POST)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) =>
					pb.withLiteralParameter('version', 'v2')
						.withLiteralParameter('send', 'send')
				)
				.withBody()
				.withRequestInterceptor(requestInterceptorForSend)
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._registerDeviceEndpoint = EndpointBuilder.for('register-device', 'register device')
				.withVerb(VerbType.POST)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) =>
					pb.withLiteralParameter('version', 'v2')
						.withLiteralParameter('register', 'register')
				)
				.withBody()
				.withRequestInterceptor(requestInterceptorForRegister)
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._unregisterDeviceEndpoint = EndpointBuilder.for('unregister-device', 'unregister device')
				.withVerb(VerbType.POST)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) =>
					pb.withLiteralParameter('version', 'v2')
						.withLiteralParameter('unregister', 'unregister')
				)
				.withBody()
				.withRequestInterceptor(requestInterceptorForRegister)
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;
		}
		
		/**
		 * Attempts to establish a connection to the backend. This function should be invoked
		 * immediately following instantiation. Once the resulting promise resolves, a
		 * connection has been established and other instance methods can be used.
		 *
		 * @public
		 * @param {JwtProvider=} jwtProviderRegister - Your implementation of {@link JwtProvider} for {@link registerDevice} and {@link unregisterDevice} functions.
		 * @param {JwtProvider=} jwtProviderSend - Your implementation of {@link JwtProvider} for {@link send} function.
		 * @returns {Promise<PushNotificationProvider>}
		 */
		start(jwtProviderRegister, jwtProviderSend) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsOptional(jwtProviderRegister, 'jwtProviderRegister', JwtProvider, 'JwtProvider');
					assert.argumentIsOptional(jwtProviderSend, 'jwtProviderSend', JwtProvider, 'JwtProvider');

					this._jwtProviderRegister = jwtProviderRegister;
					this._jwtProviderSend = jwtProviderSend;
					this._started = true;

					return Promise.resolve(true)
						.then(() => {
							return Promise.resolve(this);
						}).catch((e) => {
							return Promise.reject(`Unable to connect to server using HTTP adapter [ ${this._host} ] [ ${this._port} ] [ ${this._protocol} ]`);
						});
				});
		}

		/**
		 * Registers a device.
		 *
		 * @public
		 * @param {Object} query - The query object
		 * @param {Object} query.user - An object contains user data
		 * @param {String} query.user.id - A user id
		 * @param {String} query.user.context - A user context
		 * @param {Object?} query.apns - An object contains APNS data
		 * @param {String} query.apns.device - Unique device token
		 * @param {String} query.apns.bundle - An application bundle name
		 * @param {Object?} query.fcm - An object contains FCM data
		 * @param {String} query.fcm.token - Unique device token
		 * @param {String} query.fcm.package - An application package name
		 * @param {String} query.fcm.iid - Firebase IID of device
		 * @param {String} query.provider - Provider name
		 * @returns {Promise<Object>}
		 */
		registerDevice(query) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'registerDevice');

					return Promise.resolve()
						.then(() => {
							assert.argumentIsRequired(query, 'query', Object);
							assert.argumentIsRequired(query.user, 'query.user', Object);
							assert.argumentIsRequired(query.user.id, 'query.user.id', String);
							assert.argumentIsRequired(query.user.context, 'query.user.context', String);
							assert.argumentIsRequired(query.provider, 'query.provider', String);

							if (!query.apns && !query.fcm) {
								throw new Error('One of the arguments [ query.apns, query.fcm ] must be provided');
							}

							if (query.apns) {
								assert.argumentIsRequired(query.apns, 'query.apns', Object);
								assert.argumentIsRequired(query.apns.device, 'query.apns.device', String);
								assert.argumentIsRequired(query.apns.bundle, 'query.apns.bundle', String);
							}

							if (query.fcm) {
								assert.argumentIsRequired(query.fcm, 'query.fcm', Object);
								assert.argumentIsRequired(query.fcm.iid, 'query.fcm.iid', String);
								assert.argumentIsRequired(query.fcm.package, 'query.fcm.package', String);
								assert.argumentIsRequired(query.fcm.token, 'query.fcm.token', String);
							}

							return Gateway.invoke(this._registerDeviceEndpoint, query);
						});
				});
		}

		/**
		 * Unregisters a device.
		 *
		 * @public
		 * @param {Object} query - The query object
		 * @param {Object} query.user - An object contains user data
		 * @param {String} query.user.id - A user id
		 * @param {String} query.user.context - A user context
		 * @param {Object} query.device - An object contains APNS or FCM data
		 * @param {String} query.device.device - APNS device token or FCM IID
		 * @param {String} query.device.bundle - Bundle or Package name of the application
		 * @returns {Promise<Object>}
		 */
		unregisterDevice(query) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'unregisterDevice');

					return Promise.resolve()
						.then(() => {
							assert.argumentIsRequired(query, 'query', Object);
							assert.argumentIsRequired(query.user, 'query.user', Object);
							assert.argumentIsRequired(query.user.id, 'query.user.id', String);
							assert.argumentIsRequired(query.user.context, 'query.user.context', String);
							assert.argumentIsRequired(query.device, 'query.device', Object);
							assert.argumentIsRequired(query.device.device, 'query.device.device', String);
							assert.argumentIsRequired(query.device.bundle, 'query.device.bundle', String);

							return Gateway.invoke(this._unregisterDeviceEndpoint, {
								user: query.user.id,
								context: query.user.context,
								device: query.device.device,
								bundle: query.device.bundle,
							});
						});
				});
		}

		/**
		 * Sends a Push Notifications by application bundle or package name.
		 *
		 * @public
		 * @param {Object} query - The query object
		 * @param {String} query.bundle - An application bundle or package name
		 * @param {Object} query.notification - An notification object
		 * @param {Boolean?} query.development - Forces APNS to send notifications in the development mode
		 * @returns {Promise<Object>}
		 */
		sendByBundle(query) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'sendByBundle');
					return Promise.resolve()
						.then(() => {
							assert.argumentIsRequired(query, 'query', Object);
							assert.argumentIsRequired(query.bundle, 'query.bundle', String);

							return send.call(this, {
								bundle: query.bundle,
								notification: query.notification,
								development: query.development
							});
						});
				});
		}

		/**
		 * Sends a Push Notifications by user.
		 *
		 * @public
		 * @param {Object} query - The query object
		 * @param {Object} query.user - A user object
		 * @param {String} query.user.id - A user id
		 * @param {String} query.user.context - A user context
		 * @param {String} query.bundle - An application bundle or package name
		 * @param {Object} query.notification - An notification object
		 * @param {Boolean?} query.development - Forces APNS to send notifications in the development mode
		 * @returns {Promise<Object>}
		 */
		sendByUser(query) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'sendByUser');
					return Promise.resolve()
						.then(() => {
							assert.argumentIsRequired(query, 'query', Object);
							assert.argumentIsRequired(query.bundle, 'query.bundle', String);
							assert.argumentIsRequired(query.user.id, 'query.user.id', String);
							assert.argumentIsRequired(query.user.context, 'query.user.context', String);

							return send.call(this, {
								bundle: query.bundle,
								user: query.user.id,
								context: query.user.context,
								notification: query.notification,
								development: query.development
							});
						});
				});
		}

		/**
		 * Sends a Push Notifications by device.
		 *
		 * @public
		 * @param {Object} query - The query object
		 * @param {String} query.device - An APNS device token or FCM IID
		 * @param {Object} query.notification - An notification object
		 * @param {Boolean?} query.development - Forces APNS to send notifications in the development mode
		 * @returns {Promise<Object>}
		 */
		sendByDevice(query) {
			return Promise.resolve()
				.then(() => {
					checkStatus(this, 'sendByDevice');
					return Promise.resolve()
						.then(() => {
							assert.argumentIsRequired(query, 'query', Object);
							assert.argumentIsRequired(query.device, 'query.device', String);

							return send.call(this, {
								device: query.device,
								notification: query.notification,
								development: query.development
							});
						});
				});
		}

		_onDispose() {
			logger.debug('Push Notification provider disposed');
			
			this._jwtProviderRegister = null;
			this._started = false;
		}

		toString() {
			return '[PushNotificationProvider]';
		}
	}

	function getRequestInterceptorForJwtForRegister() {
		return RequestInterceptor.fromDelegate((options, endpoint) => {
			const getFailure = (e) => {
				return FailureReason.forRequest({endpoint: endpoint})
					.addItem(FailureType.REQUEST_IDENTITY_FAILURE)
					.format();
			};

			if (this._jwtProviderRegister === null) {
				return Promise.reject(getFailure());
			}

			return this._jwtProviderRegister.getToken()
				.then((token) => {
					options.headers = options.headers || {};
					options.headers.Authorization = `Bearer ${token}`;

					return options;
				}).catch((e) => {
					return Promise.reject(getFailure(e));
				});
		});
	}

	function getRequestInterceptorForJwtForSend() {
		return RequestInterceptor.fromDelegate((options, endpoint) => {
			const getFailure = (e) => {
				return FailureReason.forRequest({endpoint: endpoint})
					.addItem(FailureType.REQUEST_IDENTITY_FAILURE)
					.format();
			};

			if (this._jwtProviderSend === null) {
				return Promise.reject(getFailure());
			}

			return this._jwtProviderSend.getToken()
				.then((token) => {
					options.headers = options.headers || {};
					options.headers.Authorization = `Bearer ${token}`;

					return options;
				}).catch((e) => {
					return Promise.reject(getFailure(e));
				});
		});
	}

	function send(query) {
		return Promise.resolve().then(() => {
			assert.argumentIsRequired(query.notification, 'notification', Object);
			assert.argumentIsRequired(query.notification.title, 'notification.title', String);
			assert.argumentIsRequired(query.notification.body, 'notification.body', String);
			assert.argumentIsOptional(query.development, 'query.development', Boolean);

			return Gateway.invoke(this._sendNotificationEndpoint, {
				...query,
				development: query.development === true
			});
		});
	}

	function checkDispose(provider, operation) {
		if (provider.disposed) {
			throw new Error(`Unable to perform ${operation}, the Push Notification Provider has been disposed`);
		}
	}

	function checkStatus(provider, operation) {
		checkDispose(provider, operation);

		if (provider._started !== true) {
			throw new Error(`Unable to perform ${operation}, the Push Notification Provider has not connected to the server`);
		}
	}

	return PushNotificationProvider;
})();
