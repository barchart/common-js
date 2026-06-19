import * as assert from '@barchart/common-js/lang/assert.js';

import Disposable from '@barchart/common-js/lang/Disposable.js';

import log4js from 'log4js';

const logger = log4js.getLogger('common-node/messaging/publishers/Publisher');

/**
 * A {@link Bus} component that processes publish-subscribe
 * semantics, where the exact implementation is up to the
 * inheritor.
 *
 * @public
 * @abstract
 * @extends {Disposable}
 */
export default class Publisher extends Disposable {
	#startPromise;
	#started;
	#suppressExpressions;

	/**
	 * @param {RegExp[]=} suppressExpressions
	 */
	constructor(suppressExpressions) {
		super();

		if (suppressExpressions) {
			assert.argumentIsArray(suppressExpressions, 'suppressExpressions', RegExp, 'RegExp');
		}

		this.#suppressExpressions = suppressExpressions || [ ];

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
			throw new Error('The message publisher has been disposed');
		}

		if (this.#startPromise === null) {
			this.#startPromise = Promise.resolve()
				.then(() => {
					return this._start();
				}).then(() => {
					this.#started = true;

					return this.#started;
				});
		}

		return this.#startPromise;
	}

	/**
	 * @protected
	 * @async
	 * @returns {Promise<boolean>}
	 */
	async _start() {
		return;
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
			throw new Error('The publisher has not started.');
		}

		if (this.disposed) {
			throw new Error('The message publisher has been disposed');
		}

		let publishPromise;

		if (checkSuppression(messageType, this.#suppressExpressions)) {
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

	/**
	 * @protected
	 * @async
	 * @param {string} messageType
	 * @param {*} payload
	 * @returns {Promise}
	 */
	async _publish(messageType, payload) {
		return;
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
			throw new Error('The publisher has not started.');
		}

		if (this.disposed) {
			throw new Error('The message publisher has been disposed');
		}

		let subscribePromise;

		if (checkSuppression(messageType, this.#suppressExpressions)) {
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

	/**
	 * @protected
	 * @async
	 * @param {string} messageType
	 * @param {Function} handler
	 * @returns {Promise<Disposable>}
	 */
	async _subscribe(messageType, handler) {
		return Disposable.getEmpty();
	}

	/**
	 * @protected
	 * @override
	 */
	_onDispose() {
		return;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Publisher]';
	}
}

function checkSuppression(messageType, suppressExpressions) {
	return suppressExpressions.length !== 0 && suppressExpressions.some((suppressExpression) => {
		return suppressExpression.test(messageType);
	});
}
