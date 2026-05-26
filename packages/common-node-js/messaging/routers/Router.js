const log4js = require('log4js');

const assert = require('@barchart/common-js/lang/assert'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
	is = require('@barchart/common-js/lang/is');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('common-node/messaging/routers/Router');

	/**
	 * A {@link Bus} component that processes request-response
	 * semantics, where the exact implementation is up to the
	 * inheritor.
	 *
	 * @public
	 * @extends Disposable
	 * @abstract
	 * @param {RegExp[]=} suppressExpressions
	 */
	class Router extends Disposable {
		constructor(suppressExpressions) {
			super();

			if (suppressExpressions) {
				assert.argumentIsArray(suppressExpressions, 'suppressExpressions', RegExp, 'RegExp');
			}

			this._suppressExpressions = suppressExpressions || [ ];

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
				throw new Error('The message publisher has been disposed');
			}

			if (this._startPromise === null) {
				this._startPromise = Promise.resolve()
					.then(() => {
						return this._start();
					}).then(() => {
						this._started = true;

						return this._started;
					});
			}

			return this._startPromise;
		}

		_start() {
			return;
		}

		/**
		 * Determines if this router can handle a request (of a certain type).
		 *
		 * @public
		 * @param {String} messageType
		 * @returns {boolean}
		 */
		canRoute(messageType) {
			assert.argumentIsRequired(messageType, 'messageType', String);

			if (!this._started) {
				throw new Error('The router has not started.');
			}

			if (this.disposed) {
				throw new Error('The message router has been disposed');
			}

			return !checkSuppression(messageType, this._suppressExpressions) && this._canRoute(messageType);
		}

		_canRoute(messageType) {
			return false;
		}

		/**
		 * Sends a request (where the response is returned as a promise).
		 *
		 * @public
		 * @async
		 * @param {String} messageType
		 * @param {*} payload
		 * @param {Number} timeout
		 * @param {Boolean} forget
		 * @returns {Promise<*>}
		 */
		async route(messageType, payload, timeout, forget) {
			assert.argumentIsRequired(messageType, 'messageType', String);
			assert.argumentIsValid(timeout, 'timeout', x => is.positive(x), 'is positive');
			assert.argumentIsRequired(forget, 'forget', Boolean);

			if (!this._started) {
				throw new Error('The router has not started.');
			}

			if (this.disposed) {
				throw new Error('The message router has been disposed');
			}

			if (!this.canRoute(messageType)) {
				throw new Error('The message router does not support the message type.');
			}

			return Promise.resolve()
				.then(() => {
					return this._route(messageType, payload, timeout, forget);
				});
		}

		_route(messageType, payload, timeout, forget) {
			return;
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
				throw new Error('The router has not started.');
			}

			if (this.disposed) {
				throw new Error('The message router has been disposed');
			}

			let registerPromise;

			if (checkSuppression(messageType, this._suppressExpressions)) {
				logger.debug('Suppressing registration for to', messageType);

				registerPromise = Promise.resolve(Disposable.getEmpty());
			} else {
				registerPromise = Promise.resolve()
					.then(() => {
						return this._register(messageType, handler);
					});
			}

			return registerPromise;
		}

		_register(messageType, handler) {
			return Disposable.getEmpty();
		}

		_onDispose() {
			return;
		}

		toString() {
			return '[Router]';
		}
	}

	function checkSuppression(messageType, suppressExpressions) {
		return suppressExpressions.length !== 0 && suppressExpressions.some((suppressExpression) => {
			return suppressExpression.test(messageType);
		});
	}

	return Router;
})();
