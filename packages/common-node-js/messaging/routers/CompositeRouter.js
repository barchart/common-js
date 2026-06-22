import * as assert from '@barchart/common-js/lang/assert.js';

import DisposableStack from '@barchart/common-js/collections/specialized/DisposableStack.js';

import Router from './Router.js';

import log4js from 'log4js';

const logger = log4js.getLogger('common-node/messaging/routers/CompositeRouter');

/**
 * @typedef {import('@barchart/common-js/lang/Disposable.js').default} Disposable
 */

export default class CompositeRouter extends Router {
	#routers;

	/**
	 * @param {*} routers
	 * @param {*} suppressExpressions
	 */
	constructor(routers, suppressExpressions) {
		super(suppressExpressions);

		assert.argumentIsArray(routers, 'routers', Router, 'Router');

		this.#routers = routers;
	}

	/**
	 * @protected
	 * @override
	 * @async
	 * @returns {Promise<boolean>}
	 */
	async _start() {
		await Promise.all(this.#routers.map((router) => {
			return router.start();
		}));

		return true;
	}

	/**
	 * @protected
	 * @override
	 * @param {string} messageType
	 * @returns {boolean}
	 */
	_canRoute(messageType) {
		return this.#routers.some((router) => {
			return router.canRoute(messageType);
		});
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
		const router = this.#routers.find((router) => {
			return router.canRoute(messageType);
		});

		return router.route(messageType, payload, timeout, forget);
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
		const registerPromises = this.#routers.map((router) => {
			return router.register(messageType, handler);
		});

		const registrations = await Promise.all(registerPromises);

		const disposableStack = new DisposableStack();

		registrations.forEach((registration) => {
			disposableStack.push(registration);
		});

		return disposableStack;
	}

	/**
	 * @protected
	 * @override
	 */
	_onDispose() {
		this.#routers.forEach((router) => {
			router.dispose();
		});

		this.#routers = null;

		logger.debug('Composite router disposed');
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[CompositeRouter]';
	}
}
