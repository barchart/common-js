import Event from '@barchart/common-js/messaging/Event.js';

import Publisher from './Publisher.js';

import log4js from 'log4js';

const logger = log4js.getLogger('common-node/messaging/publishers/LocalPublisher');

/**
 * @typedef {import('@barchart/common-js/lang/Disposable.js').default} Disposable
 */

export default class LocalPublisher extends Publisher {
	#subscriptions;

	/**
	 * @param {*} suppressExpressions - The suppress expressions.
	 */
	constructor(suppressExpressions) {
		super(suppressExpressions);

		this.#subscriptions = {};
	}

	/**
	 * @protected
	 * @override
	 * @async
	 * @param {string} messageType
	 * @param {*} payload
	 */
	async _publish(messageType, payload) {
		if (Object.hasOwn(this.#subscriptions, messageType)) {
			this.#subscriptions[messageType].fire(payload);
		}
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
		if (!Object.hasOwn(this.#subscriptions, messageType)) {
			this.#subscriptions[messageType] = new Event(this);
		}

		return this.#subscriptions[messageType].register(getEventHandlerForSubscription(handler));
	}

	/**
	 * @protected
	 * @override
	 */
	_onDispose() {
		Object.keys(this.#subscriptions).forEach((key) => {
			const event = this.#subscriptions[key];

			event.dispose();
		});

		this.#subscriptions = null;

		logger.debug('Local publisher disposed');
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[LocalPublisher]';
	}
}

function getEventHandlerForSubscription(handler) {
	return (data, ignored) => {
		handler(data);
	};
}
