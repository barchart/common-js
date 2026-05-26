const log4js = require('log4js');

const assert = require('@barchart/common-js/lang/assert'),
	Disposable = require('@barchart/common-js/lang/Disposable');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('common-node/messaging/publishers/Publisher');

	/**
	 * A {@link Bus} component that processes publish-subscribe
	 * semantics, where the exact implementation is up to the
	 * inheritor.
	 *
	 * @public
	 * @abstract
	 * @extends {Disposable}
	 * @param {RegExp[]=} suppressExpressions
	 */
	class Publisher extends Disposable {
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
				throw new Error('The publisher has not started.');
			}

			if (this.disposed) {
				throw new Error('The message publisher has been disposed');
			}

			let publishPromise;

			if (checkSuppression(messageType, this._suppressExpressions)) {
				logger.trace('Suppressing publish for [', messageType, ']');

				publishPromise = Promise.resolve();
			} else {
				publishPromise = Promise.resolve()
					.then(() => {
						return this._publish(messageType, payload);
					});
			}

			return publishPromise;
		}

		_publish(messageType, payload) {
			return;
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
				throw new Error('The publisher has not started.');
			}

			if (this.disposed) {
				throw new Error('The message publisher has been disposed');
			}

			let subscribePromise;

			if (checkSuppression(messageType, this._suppressExpressions)) {
				logger.debug('Suppressing subscription to [', messageType, ']');

				subscribePromise = Promise.resolve(Disposable.getEmpty());
			} else {
				subscribePromise = Promise.resolve()
					.then(() => {
						return this._subscribe(messageType, handler);
					});
			}

			return subscribePromise;
		}

		_subscribe(messageType, handler) {
			return Disposable.getEmpty();
		}

		_onDispose() {
			return;
		}

		toString() {
			return '[Publisher]';
		}
	}

	function checkSuppression(messageType, suppressExpressions) {
		return suppressExpressions.length !== 0 && suppressExpressions.some((suppressExpression) => {
			return suppressExpression.test(messageType);
		});
	}

	return Publisher;
})();
