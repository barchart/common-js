import * as promise from '@barchart/common-js/lang/promise.js';

import Disposable from '@barchart/common-js/lang/Disposable.js';

import Router from './Router.js';

import log4js from 'log4js';

const logger = log4js.getLogger('common-node/messaging/routers/LocalRouter');

/**
 * Provides local router behavior.
 *
 * @public
 */
export default class LocalRouter extends Router {
	#requestHandlers;

	/**
	 * @param {*} suppressExpressions - The suppress expressions.
	 */
	constructor(suppressExpressions) {
		super(suppressExpressions);

		this.#requestHandlers = { };
	}

	/**
	 * @protected
	 * @override
	 * @param {string} messageType
	 * @returns {boolean}
	 */
	_canRoute(messageType) {
		return this.#requestHandlers.hasOwnProperty(messageType);
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
		const responsePromise = promise.timeout((async () => {
			const handler = this.#requestHandlers[messageType];

			return handler(payload, messageType);
		})(), timeout);

		if (forget) {
			return null;
		}

		return responsePromise;
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
		this.#requestHandlers[messageType] = handler;

		return Disposable.fromAction(() => {
			delete this.#requestHandlers[messageType];
		});
	}

	/**
	 * @protected
	 * @override
	 */
	_onDispose() {
		this.#requestHandlers = null;

		logger.debug('Local router disposed');
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[LocalRouter]';
	}
}
