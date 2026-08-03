import * as assert from '@barchart/common-js/lang/assert.js';
import * as promise from '@barchart/common-js/lang/promise.js';
import * as random from '@barchart/common-js/lang/random.js';

import Disposable from '@barchart/common-js/lang/Disposable.js';
import DisposableStack from '@barchart/common-js/collections/specialized/DisposableStack.js';

import MessageProvider from './../../cluster/MessageProvider.js';
import Router from './Router.js';

import log4js from 'log4js';
import * as uuid from 'uuid';

const logger = log4js.getLogger('common-node/messaging/routers/ClusterRouter');

const REGISTER = 'r.r';
const UNREGISTER = 'r.u';
const REQUEST = 'r.q';
const RESPONSE = 'r.s';

/**
 * Provides cluster router behavior.
 *
 * @public
 */
export default class ClusterRouter extends Router {
	#disposeStack;
	#messageProvider;
	#pendingCallbacks;
	#requestHandlers;
	#requestRegistrations;

	/**
	 * @param {*} messageProvider - The message provider.
	 * @param {*} suppressExpressions - The suppress expressions.
	 */
	constructor(messageProvider, suppressExpressions) {
		super(suppressExpressions);

		assert.argumentIsRequired(messageProvider, 'messageProvider', MessageProvider);

		this.#requestHandlers = { };
		this.#requestRegistrations = { };
		this.#pendingCallbacks = { };

		this.#messageProvider = messageProvider;

		this.#disposeStack = new DisposableStack();
	}

	/**
	 * @protected
	 * @override
	 * @async
	 * @returns {Promise<boolean>}
	 */
	async _start() {
		await this.#messageProvider.start();

		this.#disposeStack.push(
			this.#messageProvider.registerPeerConnectedObserver((source) => {
				const messageTypes = Object.keys(this.#requestHandlers);

				if (messageTypes.length !== 0) {
					logger.debug('Sending registrations to newly connected IPC peer', source);

					messageTypes.forEach((messageTypes) => {
						this.#messageProvider.send(REGISTER, getRegistrationEnvelope(messageTypes), source);
					});
				}
			})
		);

		this.#disposeStack.push(
			this.#messageProvider.handle(REGISTER, (source, type, payload) => {
				const messageType = payload.t;

				logger.debug('Processing registration to', messageType, 'from IPC peer', source);

				if (!Object.hasOwn(this.#requestRegistrations, messageType)) {
					this.#requestRegistrations[messageType] = [ ];
				}

				const registrations = this.#requestRegistrations[messageType];

				if (!registrations.some((registration) => registration === source)) {
					registrations.push(source);
				} else {
					logger.warn('A registration for', messageType, 'already exists for worker', source);
				}
			})
		);

		this.#disposeStack.push(
			this.#messageProvider.handle(UNREGISTER, (source, type, payload) => {
				const messageType = payload.t;

				logger.debug('Processing registration cancel to', messageType, 'from IPC peer', source);

				if (Object.hasOwn(this.#requestRegistrations, messageType)) {
					this.#requestRegistrations[messageType] = this.#requestRegistrations[messageType].filter((item) => {
						return item !== source;
					});

					if (this.#requestRegistrations[messageType].length === 0) {
						delete this.#requestRegistrations[messageType];
					}
				}
			})
		);

		this.#disposeStack.push(
			this.#messageProvider.handle(REQUEST, async (source, type, payload) => {
				const messageId = payload.id;
				const messageType = payload.t;
				const messagePayload = payload.p;

				let envelope;

				try {
					const handler = this.#requestHandlers[messageType];

					const result = await handler(messagePayload);

					envelope = getResponseEnvelope(payload, true, result);
				} catch (e) {
					logger.error('Request', messageId, 'failed. Sending reject message.', e);

					envelope = getResponseEnvelope(payload, false, null);
				}

				this.#messageProvider.send(RESPONSE, envelope, source);
			})
		);

		this.#disposeStack.push(
			this.#messageProvider.handle(RESPONSE, (source, type, payload) => {
				const requestId = payload.id;
				const callbacks = this.#pendingCallbacks[requestId];

				if (callbacks) {
					const responseSuccess = payload.s;
					const responsePayload = payload.p;

					if (responseSuccess) {
						callbacks.resolve(responsePayload);
					} else {
						callbacks.reject();
					}

					delete this.#pendingCallbacks[requestId];
				}
			})
		);

		return true;
	}

	/**
	 * @protected
	 * @override
	 * @param {string} messageType
	 * @returns {boolean}
	 */
	_canRoute(messageType) {
		return Object.hasOwn(this.#requestRegistrations, messageType);
	}

	/**
	 * @protected
	 * @override
	 * @async
	 * @param {string} messageType
	 * @param {*} payload
	 * @param {number} timeout
	 * @param {boolean} forget
	 * @returns {Promise<*>}
	 */
	async _route(messageType, payload, timeout, forget) {
		return promise.build((resolveCallback, rejectCallback) => {
			const envelope = getRequestEnvelope(messageType, payload);
			const messageId = envelope.id;

			this.#pendingCallbacks[messageId] = {
				resolve: resolveCallback,
				reject: rejectCallback
			};

			const registrations = this.#requestRegistrations[messageType];

			let index;

			if (registrations.length === 1) {
				index = 0;
			} else {
				index = random.range(0, registrations.length);
			}

			this.#messageProvider.send(REQUEST, envelope, registrations[index]);
		});
	}

	/**
	 * @protected
	 * @override
	 * @async
	 * @param {string} messageType
	 * @param {Function} handler
	 * @returns {Promise<Disposable>}
	 */
	async _register(messageType, handler) {
		logger.debug('Registering', messageType,'request handler over cluster IPC');

		this.#requestHandlers[messageType] = handler;

		this.#messageProvider.broadcast(REGISTER, getRegistrationEnvelope(messageType));

		return Disposable.fromAction(() => {
			this.#messageProvider.broadcast(UNREGISTER, getRegistrationEnvelope(messageType));

			delete this.#requestHandlers[messageType];
		});
	}

	/**
	 * @protected
	 * @override
	 */
	_onDispose() {
		this.#disposeStack.dispose();
		this.#disposeStack = null;

		this.#requestHandlers = null;
		this.#requestRegistrations = null;
		this.#pendingCallbacks = null;

		logger.debug('Cluster router disposed');
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[ClusterRouter]';
	}
}

function getRegistrationEnvelope(type) {
	return {
		t: type
	};
}

function getRequestEnvelope(type, payload) {
	return {
		id: uuid.v4(),
		t: type,
		p: payload || null
	};
}

function getResponseEnvelope(request, success, response) {
	return {
		id: request.id,
		s: success,
		p: response || null
	};
}
