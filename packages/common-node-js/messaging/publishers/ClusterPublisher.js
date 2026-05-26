const log4js = require('log4js'),
	uuid = require('uuid');

const assert = require('@barchart/common-js/lang/assert'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
	DisposableStack = require('@barchart/common-js/collections/specialized/DisposableStack'),
	Event = require('@barchart/common-js/messaging/Event');

const MessageProvider = require('./../../cluster/MessageProvider'),
	Publisher = require('./Publisher');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('common-node/messaging/publishers/ClusterPublisher');

	const SUBSCRIBE = 'p.s';
	const UNSUBSCRIBE = 'p.u';
	const PUBLISH = 'p.p';

	class ClusterPublisher extends Publisher {
		constructor(messageProvider, suppressExpressions) {
			super();

			assert.argumentIsRequired(messageProvider, 'messageProvider', MessageProvider);

			this._subscribers = {};
			this._subscriptions = {};

			this._messageProvider = messageProvider;

			this._disposeStack = new DisposableStack();
		}

		_start() {
			return this._messageProvider.start()
				.then(() => {
					this._disposeStack.push(
						this._messageProvider.registerPeerConnectedObserver((source) => {
							const messageTypes = Object.keys(this._subscribers);

							if (messageTypes.length !== 0) {
								logger.debug('Sending subscriptions to newly connected IPC peer', source);

								messageTypes.forEach((messageType) => {
									this._subscribers[messageType].refresh(this._messageProvider, source);
								});
							}
						})
					);
				}).then(() => {
					this._disposeStack.push(
						this._messageProvider.handle(SUBSCRIBE, (source, type, payload) => {
							const subscriptionId = payload.id;
							const messageType = payload.t;

							if (!this._subscriptions.hasOwnProperty(messageType)) {
								this._subscriptions[messageType] = new SubscriptionData(messageType);
							}

							const subscriptionData = this._subscriptions[messageType];

							subscriptionData.addSubscriber(subscriptionId, source);
						})
					);

					this._disposeStack.push(
						this._messageProvider.handle(UNSUBSCRIBE, (source, type, payload) => {
							const subscriptionId = payload.id;
							const messageType = payload.t;

							if (this._subscriptions.hasOwnProperty(messageType)) {
								const subscriptionData = this._subscriptions[messageType];

								subscriptionData.removeSubscriber(subscriptionId);

								if (subscriptionData.getSources().length === 0) {
									delete this._subscriptions[messageType];
								}
							}
						})
					);

					this._disposeStack.push(
						this._messageProvider.handle(PUBLISH, (source, type, payload) => {
							const messageType = payload.t;

							if (this._subscribers.hasOwnProperty(messageType)) {
								this._subscribers[messageType].publish(payload.p);
							}
						})
					);
				});
		}

		_publish(messageType, payload) {
			if (this._subscriptions.hasOwnProperty(messageType)) {
				const envelope = getPublishEnvelope(messageType, payload);
				const sources = this._subscriptions[messageType].getSources();

				sources.forEach((source) => {
					this._messageProvider.send(PUBLISH, envelope, source);
				});
			}
		}

		_subscribe(messageType, handler) {
			if (!this._subscribers.hasOwnProperty(messageType)) {
				this._subscribers[messageType] = new SubscriberData(messageType);
			}

			return this._subscribers[messageType].handle(handler, this._messageProvider);
		}

		_onDispose() {
			this._disposeStack.dispose();
			this._disposeStack = null;

			Object.keys(this._subscriberBingings).forEach((key) => {
				const subscriberBinding = this._subscriberBingings[key];

				subscriberBinding.dispose();
			});

			this._subscriberBingings = null;
			this._subscribers = null;
			this._subscriptions = null;

			logger.debug('Cluster publisher disposed');
		}

		toString() {
			return '[ClusterPublisher]';
		}
	}

	class SubscriberData extends Disposable {
		constructor(messageType) {
			super();

			this._messageType = messageType;

			this._handlers = { };

			this._publish = new Event(this);
		}

		getMessageType() {
			return this._messageType;
		}

		handle(handler, sender) {
			const handlerId = uuid.v4();

			this._handlers[handlerId] = this._publish.register(getEventHandlerForSubscription(handler));

			sender.broadcast(SUBSCRIBE, getSubscriptionEnvelope(handlerId, this._messageType));

			return Disposable.fromAction(() => {
				if (this._handlers.hasOwnProperty(handlerId)) {
					sender.broadcast(UNSUBSCRIBE, getSubscriptionEnvelope(handlerId, this._messageType));

					this._handlers[handlerId].dispose();

					delete this._handlers[handlerId];
				}
			});
		}

		refresh(sender, source) {
			Object.keys(this._handlers).forEach((handlerId) => {
				sender.send(SUBSCRIBE, getSubscriptionEnvelope(handlerId, this._messageType), source);
			});
		}

		publish(payload) {
			this._publish.fire(payload);
		}

		_onDispose() {
			this._publish.dispose();

			this._publish = null;
			this._handlers = null;
		}
	}

	class SubscriptionData {
		constructor(messageType) {
			this._messageType = messageType;

			this._subscribers = { };
			this._sources = [ ];
		}

		getMessageType() {
			return this._messageType;
		}

		addSubscriber(id, source) {
			this._subscribers[id] = source;

			if (!this._sources.some((candidate) => candidate === source)) {
				this._sources.push(source);
			}
		}

		removeSubscriber(id) {
			if (this._subscribers.hasOwnProperty(id)) {
				const source = this._subscribers[id];

				delete this._subscribers[id];

				if (!Object.keys(this._subscribers).some((key) => this._subscribers[key] === source)) {
					this._sources = this._sources.filter((candidate) => candidate !== source);
				}
			}
		}

		getSources() {
			return this._sources;
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

	return ClusterPublisher;
})();