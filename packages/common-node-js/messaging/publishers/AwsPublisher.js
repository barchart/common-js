import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';

import Event from '@barchart/common-js/messaging/Event.js';
import EventMap from '@barchart/common-js/messaging/EventMap.js';
import Disposable from '@barchart/common-js/lang/Disposable.js';
import DisposableStack from '@barchart/common-js/collections/specialized/DisposableStack.js';

import Publisher from './Publisher.js';
import SnsProvider from './../../aws/SnsProvider.js';
import SqsProvider from './../../aws/SqsProvider.js';

import log4js from 'log4js';
import * as uuid from 'uuid';

const logger = log4js.getLogger('common-node/messaging/publishers/AwsPublisher');

/**
 * A {@link Publisher} that provides publish-subscribe messaging via AWS SNS and AWS SQS.
 *
 * @public
 * @extends {Publisher}
 */
export default class AwsPublisher extends Publisher {
	#createOptions;
	#publisherId;
	#snsProvider;
	#sqsProvider;
	#subscriptionPromises;
	#suppressEcho;

	/**
	 * @param {SnsProvider} snsProvider - The sns provider.
	 * @param {SqsProvider} sqsProvider - The sqs provider.
	 * @param {boolean[]=} suppressEcho - The suppress echo.
	 * @param {RegExp[]=} suppressExpressions - The suppress expressions.
	 * @param {object=} tags - The tags.
	 * @param {string=} identifier - The identifier.
	 */
	constructor(snsProvider, sqsProvider, suppressEcho, suppressExpressions, tags, identifier) {
		super(suppressExpressions);

		assert.argumentIsRequired(snsProvider, 'snsProvider', SnsProvider, 'SnsProvider');
		assert.argumentIsRequired(sqsProvider, 'sqsProvider', SqsProvider, 'SqsProvider');
		assert.argumentIsOptional(suppressEcho, 'suppressEcho', Boolean);
		assert.argumentIsOptional(tags, 'tags', Object);
		assert.argumentIsOptional(identifier, 'identifier', String);

		this.#snsProvider = snsProvider;
		this.#sqsProvider = sqsProvider;

		this.#suppressEcho = suppressEcho || false;

		this.#publisherId = identifier || uuid.v4();

		this.#subscriptionPromises = {};

		this.#createOptions = null;

		if (tags) {
			this.#createOptions = { };
			this.#createOptions.tags = tags;
		}
	}

	/**
	 * @protected
	 * @override
	 * @async
	 * @returns {Promise<boolean>}
	 */
	async _start() {
		logger.debug('AWS publisher starting');

		await Promise.all([ this.#snsProvider.start(), this.#sqsProvider.start() ]);

		logger.debug('AWS publisher started');

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
		const envelope = {
			publisher: this.#publisherId,
			payload: payload
		};

		const topic = getTopic(messageType);
		const qualifier = getQualifier(messageType);

		if (qualifier !== null) {
			envelope.qualifier = qualifier;
		}

		logger.debug('Publishing message to AWS [', topic, ']');
		logger.trace(payload);

		return this.#snsProvider.publish(topic, envelope, this.#createOptions);
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
		const topic = getTopic(messageType);
		const qualifier = getQualifier(messageType);

		logger.debug('Subscribing to AWS messages [', topic, ']');

		if (!this.#subscriptionPromises.hasOwnProperty(topic)) {
			const subscriptionStack = new DisposableStack();

			const subscriptionEvent = new Event(this);
			const subscriptionEvents = new EventMap();

			const subscriptionQueueName = this.#getSubscriptionQueue(topic);

			subscriptionStack.push(subscriptionEvent);

			this.#subscriptionPromises[topic] = (async () => {
				const resultGroup = await Promise.all([
					this.#snsProvider.getTopicArn(topic, this.#createOptions),
					this.#sqsProvider.getQueueArn(subscriptionQueueName, this.#createOptions)
				]);

				const topicArn = resultGroup[0];
				const queueArn = resultGroup[1];

				subscriptionStack.push(Disposable.fromAction(() => {
					this.#sqsProvider.deleteQueue(subscriptionQueueName);
				}));

				await this.#sqsProvider.setQueuePolicy(subscriptionQueueName, SqsProvider.getPolicyForSnsDelivery(queueArn, topicArn));

				const queueBinding = await this.#snsProvider.subscribe(topic, queueArn);

				subscriptionStack.push(queueBinding);

				const queueObserver = await this.#sqsProvider.observe(subscriptionQueueName, (envelope) => {
					if (!is.object(envelope) || !is.string(envelope.Message)) {
						return;
					}

					const message = JSON.parse(envelope.Message);

					let content;
					let echo;

					if (is.string(message.publisher) && is.object(message.payload)) {
						content = message.payload;
						echo = message.publisher === this.#publisherId;
					} else {
						content = message;
						echo = false;
					}

					if (!echo || !this.#suppressEcho) {
						subscriptionEvent.fire(content);

						if (is.string(message.qualifier)) {
							subscriptionEvents.fire(message.qualifier, content);
						}
					} else {
						logger.debug('AWS publisher dropped an "echo" message for [', topic, ']');
					}
				}, 100, 20000, 10);

				subscriptionStack.push(queueObserver);

				subscriptionStack.push(Disposable.fromAction(() => {
					delete this.#subscriptionPromises[topic];
				}));

				return {
					binding: subscriptionStack,
					event: subscriptionEvent,
					events: subscriptionEvents
				};
			})();
		}

		const subscriberData = await this.#subscriptionPromises[topic];

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
	}

	/**
	 * @protected
	 * @override
	 */
	_onDispose() {
		const subscriptionPromises = Object.assign(this.#subscriptionPromises);
		this.#subscriptionPromises = null;

		Object.keys(subscriptionPromises).forEach((key) => {
			const subscriptionPromise = subscriptionPromises[key];

			(async () => {
				const subscriptionData = await subscriptionPromise;

				subscriptionData.binding.dispose();
			})();
		});

		logger.debug('AWS publisher disposed');
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[AwsPublisher]';
	}


	#getSubscriptionQueue(topic) {
		if (topic.endsWith(this.#publisherId)) {
			return topic;
			}

			return `${topic}-${this.#publisherId}`;
		}
}

const messageTypeRegex = /(.*)#(.*)$/;

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
