import * as assert from '@barchart/common-js/lang/assert.js';
import * as date from '@barchart/common-js/lang/date.js';
import * as is from '@barchart/common-js/lang/is.js';

import Disposable from '@barchart/common-js/lang/Disposable.js';

import Publisher from './publishers/Publisher.js';
import Router from './routers/Router.js';

import log4js from 'log4js';

const logger = log4js.getLogger('common-node/messaging/Bus');

const DEFAULT_TIMEOUT_MILLISECONDS = 20000;

/**
 * A central mechanism for publish-subscribe and request-response processing.
 *
 * @public
 * @extends {Disposable}
 */
export default class Bus extends Disposable {
	#publisher;
	#router;
	#startPromise;
	#started;

	/**
	 * @param {Publisher} publisher
	 * @param {Router} router
	 */
	constructor(publisher, router) {
		super();

		assert.argumentIsRequired(publisher, 'publisher', Publisher, 'Publisher');
		assert.argumentIsRequired(router, 'router', Router, 'Router');

		this.#publisher = publisher;
		this.#router = router;

		this.#startPromise = null;
		this.#started = false;
	}

	/**
	 * Initializes the instance. Invoke before using other instance functions.
	 *
	 * @public
	 * @async
	 * @returns {Promise<boolean>}
	 */
	async start() {
		if (this.disposed) {
			throw new Error('The message bus has been disposed');
		}

		if (this.#startPromise === null) {
			this.#startPromise = Promise.all([ this.#publisher.start(), this.#router.start() ])
				.then((ignored) => {
					this.#started = true;

					return this.#started;
				});
		}

		return this.#startPromise;
	}

	/**
	 * Publishes a message.
	 *
	 * @public
	 * @async
	 * @param {string} messageType
	 * @param {*} payload
	 * @returns {Promise}
	 */
	async publish(messageType, payload) {
		assert.argumentIsRequired(messageType, 'messageType', String);

		if (!this.#started) {
			throw new Error('The bus has not started.');
		}

		if (this.disposed) {
			throw new Error('The message bus has been disposed');
		}

		return this.#publisher.publish(messageType, payload);
	}

	/**
	 * Subscribes to messages by type and returns a {@link Disposable} that
	 * can be used to terminate the subscription.
	 *
	 * @public
	 * @async
	 * @param {string} messageType
	 * @param {Function} handler
	 * @returns {Promise<Disposable>}
	 */
	async subscribe(messageType, handler) {
		assert.argumentIsRequired(messageType, 'messageType', String);
		assert.argumentIsRequired(handler, 'handler', Function);

		if (!this.#started) {
			throw new Error('The bus has not started.');
		}

		if (this.disposed) {
			throw new Error('The message bus has been disposed');
		}

		return this.#publisher.subscribe(messageType, handler);
	}

	/**
	 * Sends a request (where the response is returned as a promise).
	 *
	 * @public
	 * @async
	 * @param {string} messageType
	 * @param {*} payload
	 * @param {number=} timeout
	 * @param {boolean=} forget
	 * @returns {Promise<*>}
	 */
	async request(messageType, payload, timeout, forget) {
		assert.argumentIsRequired(messageType, 'messageType', String);
		assert.argumentIsOptional(timeout, 'timeout', Number);
		assert.argumentIsOptional(forget, 'forget', Boolean);

		if (!this.#started) {
			throw new Error('The bus has not started.');
		}

		if (this.disposed) {
			throw new Error('The message bus has been disposed');
		}

		const start = date.getTimestamp();

		let requestPromise;

		if (this.#router.canRoute(messageType)) {
			let timeoutToUse;

			if (is.number(timeout) && timeout > 0) {
				timeoutToUse = timeout;
			} else {
				timeoutToUse = DEFAULT_TIMEOUT_MILLISECONDS;
			}

			requestPromise = this.#router.route(messageType, payload, timeoutToUse, forget || false)
				.then((response) => {
					const end = date.getTimestamp();

					logger.debug('Request [', messageType, '] completed after [', (end - start), '] milliseconds');

					return response;
				}).catch((e) => {
					const end = date.getTimestamp();

					logger.warn('Request [', messageType, '] failed after [', (end - start), '] milliseconds');

					throw e;
				});
		} else {
			requestPromise = Promise.reject(`Router is unable to handle request [ ${messageType} ].`);
		}

		return requestPromise;
	}

	/**
	 * Registers a handler for requests (of a certain type) and returns
	 * a {@link Disposable} that can be used to unregister the handler.
	 *
	 * @public
	 * @async
	 * @param {string} messageType
	 * @param {Function} handler
	 * @returns {Promise<Disposable>}
	 */
	async register(messageType, handler) {
		assert.argumentIsRequired(messageType, 'messageType', String);
		assert.argumentIsRequired(handler, 'handler', Function);

		if (!this.#started) {
			throw new Error('The bus has not started.');
		}

		if (this.disposed) {
			throw new Error('The message bus has been disposed');
		}

		return this.#router.register(messageType, handler);
	}

	/**
	 * @protected
	 * @override
	 */
	_onDispose() {
		this.#publisher.dispose();
		this.#router.dispose();

		this.#publisher = null;
		this.#router = null;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Bus]';
	}
}
