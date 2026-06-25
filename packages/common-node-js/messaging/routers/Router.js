import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';

import Disposable from '@barchart/common-js/lang/Disposable.js';

import log4js from 'log4js';

const logger = log4js.getLogger('common-node/messaging/routers/Router');

/**
 * A {@link Bus} component that processes request-response
 * semantics, where the exact implementation is up to the
 * inheritor.
 *
 * @public
 * @extends Disposable
 * @abstract
 */
export default class Router extends Disposable {
	#startPromise;
	#started;
	#suppressExpressions;

	/**
	 * @param {RegExp[]=} suppressExpressions - The suppress expressions.
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
			this.#startPromise = (async () => {
				await this._start();

				this.#started = true;

				return this.#started;
			})();
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
	 * Determines if this router can handle a request (of a certain type).
	 *
	 * @public
	 * @param {string} messageType
	 * @returns {boolean}
	 */
	canRoute(messageType) {
		assert.argumentIsRequired(messageType, 'messageType', String);

		if (!this.#started) {
			throw new Error('The router has not started.');
		}

		if (this.disposed) {
			throw new Error('The message router has been disposed');
		}

		return !checkSuppression(messageType, this.#suppressExpressions) && this._canRoute(messageType);
	}

	/**
	 * @protected
	 * @param {string} messageType - The message type.
	 * @returns {boolean}
	 */
	_canRoute(messageType) {
		return false;
	}

	/**
	 * Sends a request (where the response is returned as a promise).
	 *
	 * @public
	 * @async
	 * @param {string} messageType
	 * @param {*} payload
	 * @param {number} timeout
	 * @param {boolean} forget
	 * @returns {Promise<*>}
	 */
	async route(messageType, payload, timeout, forget) {
		assert.argumentIsRequired(messageType, 'messageType', String);
		assert.argumentIsValid(timeout, 'timeout', x => is.positive(x), 'is positive');
		assert.argumentIsRequired(forget, 'forget', Boolean);

		if (!this.#started) {
			throw new Error('The router has not started.');
		}

		if (this.disposed) {
			throw new Error('The message router has been disposed');
		}

		if (!this.canRoute(messageType)) {
			throw new Error('The message router does not support the message type.');
		}

		return this._route(messageType, payload, timeout, forget);
	}

	/**
	 * @protected
	 * @async
	 * @param {string} messageType - The message type.
	 * @param {object} payload - The payload.
	 * @param {number} timeout - The timeout.
	 * @param {boolean} forget - The forget.
	 */
	async _route(messageType, payload, timeout, forget) {
		return;
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
			throw new Error('The router has not started.');
		}

		if (this.disposed) {
			throw new Error('The message router has been disposed');
		}

		if (checkSuppression(messageType, this.#suppressExpressions)) {
			logger.debug('Suppressing registration for to', messageType);

			return Disposable.getEmpty();
		}

		return this._register(messageType, handler);
	}

	/**
	 * @protected
	 * @async
	 * @param {string} messageType
	 * @param {Function} handler
	 * @returns {Promise<Disposable>}
	 */
	async _register(messageType, handler) {
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
		return '[Router]';
	}
}

function checkSuppression(messageType, suppressExpressions) {
	return suppressExpressions.length !== 0 && suppressExpressions.some((suppressExpression) => {
		return suppressExpression.test(messageType);
	});
}
