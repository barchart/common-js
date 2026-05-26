const log4js = require('log4js'),
	uuid = require('uuid');

const assert = require('@barchart/common-js/lang/assert'),
	Event = require('@barchart/common-js/messaging/Event'),
	EventMap = require('@barchart/common-js/messaging/EventMap'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
	DisposableStack = require('@barchart/common-js/collections/specialized/DisposableStack'),
	is = require('@barchart/common-js/lang/is');

const Publisher = require('./Publisher'),
	SnsProvider = require('./../../aws/SnsProvider'),
	SqsProvider = require('./../../aws/SqsProvider');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('common-node/messaging/publishers/AwsPublisher');

	/**
	 * A {@link Publisher} that provides publish-subscribe messaging via AWS SNS and AWS SQS.
	 *
	 * @public
	 * @extends {Publisher}
	 * @param {SnsProvider} snsProvider
	 * @param {SqsProvider} sqsProvider
	 * @param {Boolean[]=} suppressEcho
	 * @param {RexExp[]=} suppressExpressions
	 * @param {Object=} tags
	 * @param {String=} identifier
	 */
	class AwsPublisher extends Publisher {
		constructor(snsProvider, sqsProvider, suppressEcho, suppressExpressions, tags, identifier) {
			super(suppressExpressions);

			assert.argumentIsRequired(snsProvider, 'snsProvider', SnsProvider, 'SnsProvider');
			assert.argumentIsRequired(sqsProvider, 'sqsProvider', SqsProvider, 'SqsProvider');
			assert.argumentIsOptional(suppressEcho, 'suppressEcho', Boolean);
			assert.argumentIsOptional(tags, 'tags', Object);
			assert.argumentIsOptional(identifier, 'identifier', String);

			this._snsProvider = snsProvider;
			this._sqsProvider = sqsProvider;

			this._suppressEcho = suppressEcho || false;

			this._publisherId = identifier || uuid.v4();

			this._subscriptionPromises = {};

			this._createOptions = null;

			if (tags) {
				this._createOptions = { };
				this._createOptions.tags = tags;
			}
		}

		_start() {
			logger.debug('AWS publisher starting');

			return Promise.all([ this._snsProvider.start(), this._sqsProvider.start() ])
				.then((ignored) => {
					logger.debug('AWS publisher started');
				});
		}

		_publish(messageType, payload) {
			const envelope = {
				publisher: this._publisherId,
				payload: payload
			};

			const topic = getTopic(messageType);
			const qualifier = getQualifier(messageType);

			if (qualifier !== null) {
				envelope.qualifier = qualifier;
			}

			logger.debug('Publishing message to AWS [', topic, ']');
			logger.trace(payload);

			return this._snsProvider.publish(topic, envelope, this._createOptions);
		}

		_subscribe(messageType, handler) {
			const topic = getTopic(messageType);
			const qualifier = getQualifier(messageType);

			logger.debug('Subscribing to AWS messages [', topic, ']');

			if (!this._subscriptionPromises.hasOwnProperty(topic)) {
				const subscriptionStack = new DisposableStack();

				const subscriptionEvent = new Event(this);
				const subscriptionEvents = new EventMap(this);

				const subscriptionQueueName = getSubscriptionQueue.call(this, topic);

				subscriptionStack.push(subscriptionEvent);

				this._subscriptionPromises[topic] = Promise.all([
					this._snsProvider.getTopicArn(topic, this._createOptions),
					this._sqsProvider.getQueueArn(subscriptionQueueName, this._createOptions)
				]).then((resultGroup) => {
					const topicArn = resultGroup[0];
					const queueArn = resultGroup[1];

					subscriptionStack.push(Disposable.fromAction(() => {
						this._sqsProvider.deleteQueue(subscriptionQueueName);
					}));

					return this._sqsProvider.setQueuePolicy(subscriptionQueueName, SqsProvider.getPolicyForSnsDelivery(queueArn, topicArn))
						.then(() => {
							return this._snsProvider.subscribe(topic, queueArn);
						});
				}).then((queueBinding) => {
					subscriptionStack.push(queueBinding);

					return this._sqsProvider.observe(subscriptionQueueName, (envelope) => {
						if (!is.object(envelope) || !is.string(envelope.Message)) {
							return;
						}

						const message = JSON.parse(envelope.Message);

						let content;
						let echo;

						if (is.string(message.publisher) && is.object(message.payload)) {
							content = message.payload;
							echo = message.publisher === this._publisherId;
						} else {
							content = message;
							echo = false;
						}

						if (!echo || !this._suppressEcho) {
							subscriptionEvent.fire(content);

							if (is.string(message.qualifier)) {
								subscriptionEvents.fire(message.qualifier, content);
							}
						} else {
							logger.debug('AWS publisher dropped an "echo" message for [', topic, ']');
						}
					}, 100, 20000, 10);
				}).then((queueObserver) => {
					subscriptionStack.push(queueObserver);

					subscriptionStack.push(Disposable.fromAction(() => {
						delete this._subscriptionPromises[topic];
					}));

					return {
						binding: subscriptionStack,
						event: subscriptionEvent,
						events: subscriptionEvents
					};
				});
			}

			return this._subscriptionPromises[topic]
				.then((subscriberData) => {
					const h = (data, ignored) => {
						handler(data);
					};

					let binding;

					if (qualifier) {
						binding = subscriberData.events.register(qualifier, h);
					} else {
						binding = subscriberData.event.register(h);
					}

					return binding;
				});
		}

		_onDispose() {
			const subscriptionPromises = Object.assign(this._subscriptionPromises);
			this._subscriptionPromises = null;

			Object.keys(subscriptionPromises).forEach((key) => {
				const subscriptionPromise = subscriptionPromises[key];

				return subscriptionPromise.then((subscriptionData) => {
					subscriptionData.binding.dispose();
				});
			});

			logger.debug('AWS publisher disposed');
		}

		toString() {
			return '[AwsPublisher]';
		}
	}

	const messageTypeRegex = /(.*)#(.*)$/;

	function getSubscriptionQueue(topic) {
		if (topic.endsWith(this._publisherId)) {
			return topic;
		}

		return `${topic}-${this._publisherId}`;
	}

	function getTopic(messageType) {
		const matches = messageType.match(messageTypeRegex);

		if (matches !== null) {
			return matches[1];
		} else {
			return messageType;
		}
	}

	function getQualifier(messageType) {
		const matches = messageType.match(messageTypeRegex);

		if (matches !== null) {
			return matches[2];
		} else {
			return null;
		}
	}

	return AwsPublisher;
})();