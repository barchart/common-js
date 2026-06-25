import * as assert from '@barchart/common-js/lang/assert.js';

import Disposable from '@barchart/common-js/lang/Disposable.js';
import DisposableStack from '@barchart/common-js/collections/specialized/DisposableStack.js';
import Event from '@barchart/common-js/messaging/Event.js';

import MessageProvider from './../../cluster/MessageProvider.js';
import Publisher from './Publisher.js';

import log4js from 'log4js';
import * as uuid from 'uuid';

const logger = log4js.getLogger('common-node/messaging/publishers/ClusterPublisher');

const SUBSCRIBE = 'p.s';
const UNSUBSCRIBE = 'p.u';
const PUBLISH = 'p.p';

/**
 * Provides cluster publisher behavior.
 *
 * @public
 */
export default class ClusterPublisher extends Publisher {
	#disposeStack;
	#messageProvider;
	#subscriberBindings;
	#subscribers;
	#subscriptions;

	/**
	 * @param {*} messageProvider - The message provider.
	 * @param {*} suppressExpressions - The suppress expressions.
	 */
	constructor(messageProvider, suppressExpressions) {
		super();

		assert.argumentIsRequired(messageProvider, 'messageProvider', MessageProvider);

		this.#subscribers = {};
		this.#subscriptions = {};

		this.#messageProvider = messageProvider;

		this.#disposeStack = new DisposableStack();
	}

	/**
	 * @protected
	 * @override
	 * @async
	 * @returns {Promise<boolean>}
	 */
	async _start() {
		await this.#messageProvider.start();

		this.#disposeStack.push(
			this.#messageProvider.registerPeerConnectedObserver((source) => {
				const messageTypes = Object.keys(this.#subscribers);

				if (messageTypes.length !== 0) {
					logger.debug('Sending subscriptions to newly connected IPC peer', source);

					messageTypes.forEach((messageType) => {
						this.#subscribers[messageType].refresh(this.#messageProvider, source);
					});
				}
			})
		);

		this.#disposeStack.push(
			this.#messageProvider.handle(SUBSCRIBE, (source, type, payload) => {
				const subscriptionId = payload.id;
				const messageType = payload.t;

				if (!this.#subscriptions.hasOwnProperty(messageType)) {
					this.#subscriptions[messageType] = new SubscriptionData(messageType);
				}

				const subscriptionData = this.#subscriptions[messageType];

				subscriptionData.addSubscriber(subscriptionId, source);
			})
		);

		this.#disposeStack.push(
			this.#messageProvider.handle(UNSUBSCRIBE, (source, type, payload) => {
				const subscriptionId = payload.id;
				const messageType = payload.t;

				if (this.#subscriptions.hasOwnProperty(messageType)) {
					const subscriptionData = this.#subscriptions[messageType];

					subscriptionData.removeSubscriber(subscriptionId);

					if (subscriptionData.getSources().length === 0) {
						delete this.#subscriptions[messageType];
					}
				}
			})
		);

		this.#disposeStack.push(
			this.#messageProvider.handle(PUBLISH, (source, type, payload) => {
				const messageType = payload.t;

				if (this.#subscribers.hasOwnProperty(messageType)) {
					this.#subscribers[messageType].publish(payload.p);
				}
			})
		);

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
		if (this.#subscriptions.hasOwnProperty(messageType)) {
			const envelope = getPublishEnvelope(messageType, payload);
			const sources = this.#subscriptions[messageType].getSources();

			sources.forEach((source) => {
				this.#messageProvider.send(PUBLISH, envelope, source);
			});
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
		if (!this.#subscribers.hasOwnProperty(messageType)) {
			this.#subscribers[messageType] = new SubscriberData(messageType);
		}

		return this.#subscribers[messageType].handle(handler, this.#messageProvider);
	}

	/**
	 * Runs disposal logic.
	 *
	 * @protected
	 */
	_onDispose() {
		this.#disposeStack.dispose();
		this.#disposeStack = null;

		Object.keys(this.#subscriberBindings).forEach((key) => {
			const subscriberBinding = this.#subscriberBindings[key];

			subscriberBinding.dispose();
		});

		this.#subscriberBindings = null;
		this.#subscribers = null;
		this.#subscriptions = null;

		logger.debug('Cluster publisher disposed');
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[ClusterPublisher]';
	}
}

/**
 * Provides subscriber data behavior.
 */
class SubscriberData extends Disposable {
	#handlers;
	#messageType;
	#publish;

	/**
	 * @param {string} messageType - The message type.
	 */
	constructor(messageType) {
		super();

		this.#messageType = messageType;

		this.#handlers = { };

		this.#publish = new Event(this);
	}

	/**
	 * Returns the message type.
	 *
	 * @public
	 * @returns {*}
	 */
	getMessageType() {
		return this.#messageType;
	}

	/**
	 * Registers a handler.
	 *
	 * @public
	 * @param {Function} handler - The handler.
	 * @param {string} sender - The sender.
	 * @returns {*}
	 */
	handle(handler, sender) {
		const handlerId = uuid.v4();

		this.#handlers[handlerId] = this.#publish.register(getEventHandlerForSubscription(handler));

		sender.broadcast(SUBSCRIBE, getSubscriptionEnvelope(handlerId, this.#messageType));

		return Disposable.fromAction(() => {
			if (this.#handlers.hasOwnProperty(handlerId)) {
				sender.broadcast(UNSUBSCRIBE, getSubscriptionEnvelope(handlerId, this.#messageType));

				this.#handlers[handlerId].dispose();

				delete this.#handlers[handlerId];
			}
		});
	}

	/**
	 * Refreshes the stored state.
	 *
	 * @public
	 * @param {string} sender - The sender.
	 * @param {string} source - The source.
	 */
	refresh(sender, source) {
		Object.keys(this.#handlers).forEach((handlerId) => {
			sender.send(SUBSCRIBE, getSubscriptionEnvelope(handlerId, this.#messageType), source);
		});
	}

	/**
	 * Publishes a message.
	 *
	 * @public
	 * @param {object} payload - The payload.
	 */
	publish(payload) {
		this.#publish.fire(payload);
	}

	/**
	 * @protected
	 * @override
	 */
	_onDispose() {
		this.#publish.dispose();

		this.#publish = null;
		this.#handlers = null;
	}
}

/**
 * Provides subscription data behavior.
 */
class SubscriptionData {
	#messageType;
	#sources;
	#subscribers;

	/**
	 * @param {string} messageType - The message type.
	 */
	constructor(messageType) {
		this.#messageType = messageType;

		this.#subscribers = { };
		this.#sources = [ ];
	}

	/**
	 * Returns the message type.
	 *
	 * @public
	 * @returns {*}
	 */
	getMessageType() {
		return this.#messageType;
	}

	/**
	 * Adds the subscriber.
	 *
	 * @public
	 * @param {number} id - The id.
	 * @param {string} source - The source.
	 * @returns {*}
	 */
	addSubscriber(id, source) {
		this.#subscribers[id] = source;

		if (!this.#sources.some((candidate) => candidate === source)) {
			this.#sources.push(source);
		}
	}

	/**
	 * Runs the remove subscriber operation.
	 *
	 * @public
	 * @param {number} id - The id.
	 * @returns {*}
	 */
	removeSubscriber(id) {
		if (this.#subscribers.hasOwnProperty(id)) {
			const source = this.#subscribers[id];

			delete this.#subscribers[id];

			if (!Object.keys(this.#subscribers).some((key) => this.#subscribers[key] === source)) {
				this.#sources = this.#sources.filter((candidate) => candidate !== source);
			}
		}
	}

	/**
	 * Returns the sources.
	 *
	 * @public
	 * @returns {*}
	 */
	getSources() {
		return this.#sources;
	}
}

function getEventHandlerForSubscription(handler) {
	return (data, ignored) => {
		handler(data);
	};
}

function getSubscriptionEnvelope(id, type) {
	return {
		id: id,
		t: type
	};
}

function getPublishEnvelope(type, payload) {
	return {
		t: type,
		p: payload
	};
}
