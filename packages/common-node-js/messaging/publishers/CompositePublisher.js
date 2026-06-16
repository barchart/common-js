import * as assert from '@barchart/common-js/lang/assert.js';

import DisposableStack from '@barchart/common-js/collections/specialized/DisposableStack.js';

import Publisher from './Publisher.js';

import log4js from 'log4js';

const logger = log4js.getLogger('common-node/messaging/publishers/CompositePublisher');

export default class CompositePublisher extends Publisher {
	constructor(publishers, suppressExpressions) {
		super(suppressExpressions);

		assert.argumentIsArray(publishers, 'publishers', Publisher, 'Publisher');

		this._publishers = publishers;
	}

	_start() {
		return Promise.all(this._publishers.map((publisher) => {
			return publisher.start();
		})).then(() => {
			return true;
		});
	}

	_publish(messageType, payload) {
		const publishPromises = this._publishers.map((publisher) => {
			return publisher.publish(messageType, payload);
		});

		return Promise.all(publishPromises)
			.then((ignored) => {
				return;
			});
	}

	_subscribe(messageType, handler) {
		const subscribePromises = this._publishers.map((publisher) => {
			return publisher.subscribe(messageType, handler);
		});

		return Promise.all(subscribePromises)
			.then((subscriptions) => {
				const disposableStack = new DisposableStack();

				subscriptions.forEach((subscription) => {
					disposableStack.push(subscription);
				});

				return disposableStack;
			});
	}

	_onDispose() {
		this._publishers.forEach((publisher) => {
			publisher.dispose();
		});

		this._publishers = null;

		logger.debug('Composite publisher disposed');
	}

	toString() {
		return '[CompositePublisher]';
	}
}
