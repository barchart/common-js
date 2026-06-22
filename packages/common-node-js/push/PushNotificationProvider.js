import * as assert from '@barchart/common-js/lang/assert.js';

import Disposable from '@barchart/common-js/lang/Disposable.js';
import EndpointBuilder from '@barchart/common-js/api/http/builders/EndpointBuilder.js';
import ErrorInterceptor from '@barchart/common-js/api/http/interceptors/ErrorInterceptor.js';
import FailureReason from '@barchart/common-js/api/failures/FailureReason.js';
import FailureType from '@barchart/common-js/api/failures/FailureType.js';
import Gateway from '@barchart/common-js/api/http/Gateway.js';
import ProtocolType from '@barchart/common-js/api/http/definitions/ProtocolType.js';
import RequestInterceptor from '@barchart/common-js/api/http/interceptors/RequestInterceptor.js';
import ResponseInterceptor from '@barchart/common-js/api/http/interceptors/ResponseInterceptor.js';
import VerbType from '@barchart/common-js/api/http/definitions/VerbType.js';

import JwtProvider from './security/JwtProvider.js';

import log4js from 'log4js';

const logger = log4js.getLogger('common-node/push/PushNotificationProvider');


/**
 * A wrapper for the Push Notification Service.
 *
 * @public
 */
export default class PushNotificationProvider extends Disposable {
	#host;
	#jwtProviderRegister;
	#jwtProviderSend;
	#port;
	#protocol;
	#registerDeviceEndpoint;
	#sendNotificationEndpoint;
	#started;
	#unregisterDeviceEndpoint;

	/**
	 * @param {string} protocol - The protocol of the Push Notification service (either http or https).
	 * @param {string} host - The hostname of the Push Notification service.
	 * @param {number} port - The TCP port number of the Push Notification service.
	 */
	constructor(protocol, host, port) {
		super();

		assert.argumentIsRequired(protocol, 'protocol', String);
		assert.argumentIsRequired(host, 'host', String);
		assert.argumentIsRequired(port, 'port', Number);

		const protocolType = ProtocolType.parse(protocol.toUpperCase());

		if (protocolType === null) {
			throw new Error(`The argument [ protocol ] must be a [ ProtocolType ]`);
		}

		const requestInterceptorForRegister = this.#getRequestInterceptorForJwtForRegister();
		const requestInterceptorForSend = this.#getRequestInterceptorForJwtForSend();

		this.#protocol = protocol;
		this.#host = host;
		this.#port = port;

		this.#jwtProviderRegister = null;
		this.#jwtProviderSend = null;
		this.#started = true;

		this.#sendNotificationEndpoint = EndpointBuilder.for('send-notification', 'send notification')
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

		this.#registerDeviceEndpoint = EndpointBuilder.for('register-device', 'register device')
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

		this.#unregisterDeviceEndpoint = EndpointBuilder.for('unregister-device', 'unregister device')
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
	 * @async
	 * @param {JwtProvider=} jwtProviderRegister - Your implementation of {@link JwtProvider} for {@link registerDevice} and {@link unregisterDevice} functions.
	 * @param {JwtProvider=} jwtProviderSend - Your implementation of {@link JwtProvider} for {@link send} function.
	 * @returns {Promise<PushNotificationProvider>}
	 */
	async start(jwtProviderRegister, jwtProviderSend) {
		assert.argumentIsOptional(jwtProviderRegister, 'jwtProviderRegister', JwtProvider, 'JwtProvider');
		assert.argumentIsOptional(jwtProviderSend, 'jwtProviderSend', JwtProvider, 'JwtProvider');

		try {
			this.#jwtProviderRegister = jwtProviderRegister;
			this.#jwtProviderSend = jwtProviderSend;
			this.#started = true;

			return this;
		} catch {
			throw `Unable to connect to server using HTTP adapter [ ${this.#host} ] [ ${this.#port} ] [ ${this.#protocol} ]`;
		}
	}

	/**
	 * Registers a device.
	 *
	 * @public
	 * @async
	 * @param {RegisterDeviceQuery} query - The query object
	 * @returns {Promise<object>}
	 */
	async registerDevice(query) {
		this.#checkStatus('registerDevice');

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

		return Gateway.invoke(this.#registerDeviceEndpoint, query);
	}

	/**
	 * Unregisters a device.
	 *
	 * @public
	 * @async
	 * @param {object} query - The query object
	 * @param {object} query.user - An object contains user data
	 * @param {string} query.user.id - A user id
	 * @param {string} query.user.context - A user context
	 * @param {object} query.device - An object contains APNS or FCM data
	 * @param {string} query.device.device - APNS device token or FCM IID
	 * @param {string} query.device.bundle - Bundle or Package name of the application
	 * @returns {Promise<object>}
	 */
	async unregisterDevice(query) {
		this.#checkStatus('unregisterDevice');

		assert.argumentIsRequired(query, 'query', Object);
		assert.argumentIsRequired(query.user, 'query.user', Object);
		assert.argumentIsRequired(query.user.id, 'query.user.id', String);
		assert.argumentIsRequired(query.user.context, 'query.user.context', String);
		assert.argumentIsRequired(query.device, 'query.device', Object);
		assert.argumentIsRequired(query.device.device, 'query.device.device', String);
		assert.argumentIsRequired(query.device.bundle, 'query.device.bundle', String);

		return Gateway.invoke(this.#unregisterDeviceEndpoint, {
			user: query.user.id,
			context: query.user.context,
			device: query.device.device,
			bundle: query.device.bundle,
		});
	}

	/**
	 * Sends a Push Notifications by application bundle or package name.
	 *
	 * @public
	 * @async
	 * @param {object} query - The query object
	 * @param {string} query.bundle - An application bundle or package name
	 * @param {object} query.notification - An notification object
	 * @param {boolean?} query.development - Forces APNS to send notifications in the development mode
	 * @returns {Promise<object>}
	 */
	async sendByBundle(query) {
		this.#checkStatus('sendByBundle');

		assert.argumentIsRequired(query, 'query', Object);
		assert.argumentIsRequired(query.bundle, 'query.bundle', String);

		return this.#send({
			bundle: query.bundle,
			notification: query.notification,
			development: query.development
		});
	}

	/**
	 * Sends a Push Notifications by user.
	 *
	 * @public
	 * @async
	 * @param {object} query - The query object
	 * @param {object} query.user - A user object
	 * @param {string} query.user.id - A user id
	 * @param {string} query.user.context - A user context
	 * @param {string} query.bundle - An application bundle or package name
	 * @param {object} query.notification - An notification object
	 * @param {boolean?} query.development - Forces APNS to send notifications in the development mode
	 * @returns {Promise<object>}
	 */
	async sendByUser(query) {
		this.#checkStatus('sendByUser');

		assert.argumentIsRequired(query, 'query', Object);
		assert.argumentIsRequired(query.bundle, 'query.bundle', String);
		assert.argumentIsRequired(query.user.id, 'query.user.id', String);
		assert.argumentIsRequired(query.user.context, 'query.user.context', String);

		return this.#send({
			bundle: query.bundle,
			user: query.user.id,
			context: query.user.context,
			notification: query.notification,
			development: query.development
		});
	}

	/**
	 * Sends a Push Notifications by device.
	 *
	 * @public
	 * @async
	 * @param {object} query - The query object
	 * @param {string} query.device - An APNS device token or FCM IID
	 * @param {object} query.notification - An notification object
	 * @param {boolean?} query.development - Forces APNS to send notifications in the development mode
	 * @returns {Promise<object>}
	 */
	async sendByDevice(query) {
		this.#checkStatus('sendByDevice');

		assert.argumentIsRequired(query, 'query', Object);
		assert.argumentIsRequired(query.device, 'query.device', String);

		return this.#send({
			device: query.device,
			notification: query.notification,
			development: query.development
		});
	}

	/**
	 * @protected
	 * @override
	 */
	_onDispose() {
		logger.debug('Push Notification provider disposed');

		this.#jwtProviderRegister = null;
		this.#started = false;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[PushNotificationProvider]';
	}

	#getRequestInterceptorForJwtForRegister() {
		return RequestInterceptor.fromDelegate(async (options, endpoint) => {
			const getFailure = () => {
				return FailureReason.forRequest({ endpoint: endpoint })
					.addItem(FailureType.REQUEST_IDENTITY_FAILURE)
					.format();
			};

			if (this.#jwtProviderRegister === null) {
				throw getFailure();
			}

			try {
				const token = await this.#jwtProviderRegister.getToken();

				options.headers = options.headers || {};
				options.headers.Authorization = `Bearer ${token}`;

				return options;
			} catch {
				throw getFailure();
			}
		});
	}

	#getRequestInterceptorForJwtForSend() {
		return RequestInterceptor.fromDelegate(async (options, endpoint) => {
			const getFailure = () => {
				return FailureReason.forRequest({endpoint: endpoint})
					.addItem(FailureType.REQUEST_IDENTITY_FAILURE)
					.format();
			};

			if (this.#jwtProviderSend === null) {
				throw getFailure();
			}

			try {
				const token = await this.#jwtProviderSend.getToken();

				options.headers = options.headers || {};
				options.headers.Authorization = `Bearer ${token}`;

				return options;
			} catch {
				throw getFailure();
			}
		});
	}

	async #send(query) {
		assert.argumentIsRequired(query.notification, 'notification', Object);
		assert.argumentIsRequired(query.notification.title, 'notification.title', String);
		assert.argumentIsRequired(query.notification.body, 'notification.body', String);
		assert.argumentIsOptional(query.development, 'query.development', Boolean);

		return Gateway.invoke(this.#sendNotificationEndpoint, {
			...query,
			development: query.development === true
		});
	}

	#checkStatus(operation) {
		checkDispose(this, operation);

		if (this.#started !== true) {
			throw new Error(`Unable to perform ${operation}, the Push Notification Provider has not connected to the server`);
		}
	}
}

function checkDispose(provider, operation) {
	if (provider.disposed) {
		throw new Error(`Unable to perform ${operation}, the Push Notification Provider has been disposed`);
	}
}


/**
 * @typedef {object} RegisterDeviceUser
 * @property {string} id
 * @property {string} context
 */

/**
 * @typedef {object} RegisterDeviceApns
 * @property {string} device
 * @property {string} bundle
 */

/**
 * @typedef {object} RegisterDeviceFcm
 * @property {string} token
 * @property {string} package
 * @property {string} iid
 */

/**
 * @typedef {object} RegisterDeviceQuery
 * @property {RegisterDeviceUser} user
 * @property {RegisterDeviceApns=} apns
 * @property {RegisterDeviceFcm=} fcm
 * @property {string} provider
 */
