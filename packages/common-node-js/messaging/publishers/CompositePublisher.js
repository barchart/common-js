import * as assert from '@barchart/common-js/lang/assert.js';

import DisposableStack from '@barchart/common-js/collections/specialized/DisposableStack.js';

import Publisher from './Publisher.js';

import log4js from 'log4js';

const logger = log4js.getLogger('common-node/messaging/publishers/CompositePublisher');

/**
 * @typedef {import('@barchart/common-js/lang/Disposable.js').default} Disposable
 */

export default class CompositePublisher extends Publisher {
	#publishers;

	/**
	 * @param {*} publishers - The publishers.
	 * @param {*} suppressExpressions - The suppress expressions.
	 */
	constructor(publishers, suppressExpressions) {
		super(suppressExpressions);

		assert.argumentIsArray(publishers, 'publishers', Publisher, 'Publisher');

		this.#publishers = publishers;
	}

	/**
	 * @protected
	 * @override
	 * @async
	 * @returns {Promise<boolean>}
	 */
	async _start() {
		await Promise.all(this.#publishers.map((publisher) => {
			return publisher.start();
		}));

		return true;
	}

	/**
	 * @protected
	 * @override
	 * @async
	 * @param {string} messageType
	 * @param {*} payload
	 * @returns {Promise}
	 */
	async _publish(messageType, payload) {
		const publishPromises = this.#publishers.map((publisher) => {
			return publisher.publish(messageType, payload);
		});

		await Promise.all(publishPromises);
	}

	/**
	 * @protected
	 * @override
	 * @async
	 * @param {string} messageType
	 * @param {Function} handler
	 * @returns {Promise<Disposable>}
	 */
	async _subscribe(messageType, handler) {
		const subscribePromises = this.#publishers.map((publisher) => {
			return publisher.subscribe(messageType, handler);
		});

		const subscriptions = await Promise.all(subscribePromises);

		const disposableStack = new DisposableStack();

		subscriptions.forEach((subscription) => {
			disposableStack.push(subscription);
		});

		return disposableStack;
	}

	/**
	 * @protected
	 * @override
	 */
	_onDispose() {
		this.#publishers.forEach((publisher) => {
			publisher.dispose();
		});

		this.#publishers = null;

		logger.debug('Composite publisher disposed');
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[CompositePublisher]';
	}
}
