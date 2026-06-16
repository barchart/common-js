import * as assert from '@barchart/common-js/lang/assert.js';

import DisposableStack from '@barchart/common-js/collections/specialized/DisposableStack.js';

import Router from './Router.js';

import log4js from 'log4js';

const logger = log4js.getLogger('common-node/messaging/routers/CompositeRouter');

export default class CompositeRouter extends Router {
	constructor(routers, suppressExpressions) {
		super(suppressExpressions);

		assert.argumentIsArray(routers, 'routers', Router, 'Router');

		this._routers = routers;
	}

	_start() {
		return Promise.all(this._routers.map((router) => {
			return router.start();
		})).then(() => {
			return true;
		});
	}

	_canRoute(messageType) {
		return this._routers.some((router) => {
			return router.canRoute(messageType);
		});
	}

	_route(messageType, payload, timeout, forget) {
		const router = this._routers.find((router) => {
			return router.canRoute(messageType);
		});

		return router.route(messageType, payload, timeout, forget);
	}

	_register(messageType, handler) {
		const registerPromises = this._routers.map((router) => {
			return router.register(messageType, handler);
		});

		return Promise.all(registerPromises)
			.then((registrations) => {
				const disposableStack = new DisposableStack();

				registrations.forEach((registration) => {
					disposableStack.push(registration);
				});

				return disposableStack;
			});
	}

	_onDispose() {
		this._routers.forEach((router) => {
			router.dispose();
		});

		this._routers = null;

		logger.debug('Composite router disposed');
	}

	toString() {
		return '[CompositeRouter]';
	}
}
