const log4js = require('log4js');

const assert = require('@barchart/common-js/lang/assert'),
	date = require('@barchart/common-js/lang/date'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
	is = require('@barchart/common-js/lang/is');

const Publisher = require('./publishers/Publisher'),
	Router = require('./routers/Router');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('common-node/messaging/Bus');

	const DEFAULT_TIMEOUT_MILLISECONDS = 20000;

	/**
	 * A central mechanism for publish-subscribe and request-response processing.
	 *
	 * @public
	 * @extends {Disposable}
	 * @param {Publisher} publisher
	 * @param {Router} router
	 */
	class Bus extends Disposable {
		constructor(publisher, router) {
			super();

			assert.argumentIsRequired(publisher, 'publisher', Publisher, 'Publisher');
			assert.argumentIsRequired(router, 'router', Router, 'Router');

			this._publisher = publisher;
			this._router = router;

			this._startPromise = null;
			this._started = false;
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

			if (this._startPromise === null) {
				this._startPromise = Promise.all([ this._publisher.start(), this._router.start() ])
					.then((ignored) => {
						this._started = true;

						return this._started;
					});
			}

			return this._startPromise;
		}

		/**
		 * Publishes a message.
		 *
		 * @public
		 * @async
		 * @param {String} messageType
		 * @param {*} payload
		 * @returns {Promise}
		 */
		async publish(messageType, payload) {
			assert.argumentIsRequired(messageType, 'messageType', String);

			if (!this._started) {
				throw new Error('The bus has not started.');
			}

			if (this.disposed) {
				throw new Error('The message bus has been disposed');
			}

			return this._publisher.publish(messageType, payload);
		}

		/**
		 * Subscribes to messages by type and returns a {@link Disposable} that
		 * can be used to terminate the subscription.
		 *
		 * @public
		 * @async
		 * @param {String} messageType
		 * @param {Function} handler
		 * @returns {Promise<Disposable>}
		 */
		async subscribe(messageType, handler) {
			assert.argumentIsRequired(messageType, 'messageType', String);
			assert.argumentIsRequired(handler, 'handler', Function);

			if (!this._started) {
				throw new Error('The bus has not started.');
			}

			if (this.disposed) {
				throw new Error('The message bus has been disposed');
			}

			return this._publisher.subscribe(messageType, handler);
		}

		/**
		 * Sends a request (where the response is returned as a promise).
		 *
		 * @public
		 * @async
		 * @param {String} messageType
		 * @param {*} payload
		 * @param {Number=} timeout
		 * @param {Boolean=} forget
		 * @returns {Promise<*>}
		 */
		async request(messageType, payload, timeout, forget) {
			assert.argumentIsRequired(messageType, 'messageType', String);
			assert.argumentIsOptional(timeout, 'timeout', Number);
			assert.argumentIsOptional(forget, 'forget', Boolean);

			if (!this._started) {
				throw new Error('The bus has not started.');
			}

			if (this.disposed) {
				throw new Error('The message bus has been disposed');
			}

			const start = date.getTimestamp();

			let requestPromise;

			if (this._router.canRoute(messageType)) {
				let timeoutToUse;

				if (is.number(timeout) && timeout > 0) {
					timeoutToUse = timeout;
				} else {
					timeoutToUse = DEFAULT_TIMEOUT_MILLISECONDS;
				}

				requestPromise = this._router.route(messageType, payload, timeoutToUse, forget || false)
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
		 * @param {String} messageType
		 * @param {Function} handler
		 * @returns {Promise<Disposable>}
		 */
		async register(messageType, handler) {
			assert.argumentIsRequired(messageType, 'messageType', String);
			assert.argumentIsRequired(handler, 'handler', Function);

			if (!this._started) {
				throw new Error('The bus has not started.');
			}

			if (this.disposed) {
				throw new Error('The message bus has been disposed');
			}

			return this._router.register(messageType, handler);
		}

		_onDispose() {
			this._publisher.dispose();
			this._router.dispose();

			this._publisher = null;
			this._router = null;
		}

		toString() {
			return '[Bus]';
		}
	}

	return Bus;
})();
