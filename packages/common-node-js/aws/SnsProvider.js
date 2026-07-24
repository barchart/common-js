import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';
import * as object from '@barchart/common-js/lang/object.js';

import Disposable from '@barchart/common-js/lang/Disposable.js';

import AwsOptions from './AwsOptions.js';

import { CreateTopicCommand, DeleteTopicCommand, ListSubscriptionsCommand, ListTopicsCommand, PublishCommand, SNSClient, SubscribeCommand, UnsubscribeCommand } from '@aws-sdk/client-sns';

import log4js from 'log4js';

const logger = log4js.getLogger('common-node/aws/SnsProvider');

/**
 * AWS SDK client configuration for the SNS provider.
 *
 * @typedef {import('@aws-sdk/client-sns').SNSClientConfig} SnsProviderOptions
 */

/**
 * A facade for Amazon's Notification Service (SNS). The constructor
 * accepts configuration options. The promise-based instance functions
 * abstract knowledge of the AWS API.
 *
 * @public
 * @extends Disposable
 */
export default class SnsProvider extends Disposable {
	#configuration;
	#options;
	#sns;
	#startPromise;
	#started;
	#subscriptionPromises;
	#topicPromises;

	/**
	 * @param {object} configuration - The configuration.
	 * @param {string} configuration.prefix - The prefix that is prepended to any topic name.
	 * @param {SnsProviderOptions=} options - The AWS SDK client configuration.
	 */
	constructor(configuration, options) {
		super();

		assert.argumentIsRequired(configuration, 'configuration', Object);
		assert.argumentIsRequired(configuration.prefix, 'configuration.prefix', String);
		assert.argumentIsOptional(options, 'options', Object);

		this.#configuration = configuration;
		this.#options = {
			...AwsOptions.instance.options,
			...options
		};

		this.#sns = null;

		this.#startPromise = null;
		this.#started = false;

		this.#topicPromises = {};
		this.#subscriptionPromises = {};
	}

	/**
	 * Initializes the Amazon SDK. Call this before invoking any other instance
	 * functions.
	 *
	 * @public
	 * @async
	 * @returns {Promise<boolean>}
	 */
	async start() {
		if (this.disposed) {
			throw 'Unable to start, the SNS provider has been disposed.';
		}

		if (this.#startPromise === null) {
			this.#startPromise = (async () => {
				try {
					this.#sns = new SNSClient(this.#options);

					logger.info('The SNS provider has started');

					this.#started = true;

					return this.#started;
				} catch (e) {
					logger.error('The SNS provider failed to start', e);

					throw e;
				}
			})();
		}

		return this.#startPromise;
	}

	/**
	 * Returns a clone of the configuration object originally passed
	 * to the constructor.
	 *
	 * @public
	 * @returns {object}
	 */
	getConfiguration() {
		if (this.disposed) {
			throw new Error('The SNS provider has been disposed.');
		}

		return object.clone(this.#configuration);
	}

	/**
	 * Given a topic's name, return Amazon's unique identifier for the topic
	 * (i.e. the ARN). If no topic with the given name exists, it will be created.
	 *
	 * @public
	 * @async
	 * @param {string} topicName - The name of the topic to find (or create).
	 * @param {object=} createOptions - Options to use when topic does not exist and must be created.
	 * @returns {Promise<string>}
	 */
	async getTopicArn(topicName, createOptions) {
		assert.argumentIsRequired(topicName, 'topicName', String);

		this.#checkReady();

		const qualifiedTopicName = getQualifiedTopicName(this.#configuration.prefix, topicName);

		if (!this.#topicPromises.hasOwnProperty(qualifiedTopicName)) {
			logger.debug('The SNS provider has not cached the topic. Issuing request to create topic.');

			let tags = null;

			if (createOptions && createOptions.tags) {
				tags = createOptions.tags;
			}

			this.#topicPromises[qualifiedTopicName] = this.createTopic(topicName, tags);
		}

		return this.#topicPromises[qualifiedTopicName];
	}

	/**
	 * Creates a topic with the given name and returns the topic's ARN. If the topic already
	 * exists, the ARN of the existing topic is returned.
	 *
	 * @public
	 * @async
	 * @param {string} topicName - The name of the topic to create.
	 * @param {object=} tags - Tags to assign to the topic.
	 * @returns {Promise<string>}
	 */
	async createTopic(topicName, tags) {
		assert.argumentIsRequired(topicName, 'topicName', String);
		assert.argumentIsOptional(tags, 'tags', Object);

		this.#checkReady();

		const qualifiedTopicName = getQualifiedTopicName(this.#configuration.prefix, topicName);

		logger.debug('Creating SNS topic [', qualifiedTopicName, ']');

		const payload = {
			Name: qualifiedTopicName
		};

		if (is.object(tags)) {
			const keys = object.keys(tags);

			const t = keys.reduce((accumulator, key) => {
				const tag = { };

				tag.Key = key;
				tag.Value = tags[key];

				accumulator.push(tag);

				return accumulator;
			}, [ ]);

			if (t.length > 0) {
				payload.Tags = t;
			}
		}

		try {
			const data = await this.#sns.send(new CreateTopicCommand(payload));

			logger.info('SNS topic created [', qualifiedTopicName, ']');

			return data.TopicArn;
		} catch (error) {
			logger.error('SNS topic creation failed [', qualifiedTopicName, ']');
			logger.error(error);

			throw 'Failed to create SNS topic.';
		}
	}

	/**
	 * Deletes a topic having the given name.
	 *
	 * @public
	 * @async
	 * @param {string} topicName - The name of the topic to delete.
	 * @returns {Promise}
	 */
	async deleteTopic(topicName) {
		assert.argumentIsRequired(topicName, 'topicName', String);

		this.#checkReady();

		const topicArn = await this.getTopicArn(topicName);
		const qualifiedTopicName = getQualifiedTopicName(this.#configuration.prefix, topicName);

		logger.info('Deleting SNS topic [', qualifiedTopicName, '] at topic ARN [', topicArn, ']');

		return this.deleteTopicArn(topicArn);
	}

	/**
	 * Deletes a topic having the given URL.
	 *
	 * @public
	 * @async
	 * @param {string} topicArn - The ARN the topic to delete.
	 * @returns {Promise}
	 */
	async deleteTopicArn(topicArn) {
		assert.argumentIsRequired(topicArn, 'topicArn', String);

		this.#checkReady();

		logger.debug('Deleting SNS topic at ARN [', topicArn, ']');

		try {
			await this.#sns.send(new DeleteTopicCommand({
				TopicArn: topicArn
			}));

			logger.info('SNS topic deleted at ARN [', topicArn, ']');
		} catch (error) {
			logger.error('SNS topic deletion failed at ARN [', topicArn, ']');
			logger.error(error);

			throw 'Failed to delete SNS topic.';
		}
	}

	/**
	 * Publishes a message to a topic. The message will be serialized as JSON.
	 *
	 * @public
	 * @async
	 * @param {string} topicName - The name of the topic to publish to.
	 * @param {object} payload - The message to publish (which will be serialized as JSON).
	 * @param {object=} createOptions - Options to use when topic does not exist and must be created.
	 * @returns {Promise}
	 */
	async publish(topicName, payload, createOptions) {
		assert.argumentIsRequired(topicName, 'topicName', String);
		assert.argumentIsRequired(payload, 'payload', Object);

		this.#checkReady();

		const topicArn = await this.getTopicArn(topicName, createOptions);
		const qualifiedTopicName = getQualifiedTopicName(this.#configuration.prefix, topicName);

		logger.debug('Publishing to SNS topic [', qualifiedTopicName, ']');
		logger.trace(payload);

		try {
			await this.#sns.send(new PublishCommand({
				TopicArn: topicArn,
				Message: JSON.stringify(payload)
			}));

			logger.info('Published to SNS topic [', qualifiedTopicName, ']');
		} catch (error) {
			logger.error(error);

			throw 'Failed to publish message to SNS topic.';
		}
	}

	/**
	 * Subscribes an SQS queue to an SNS topic. Once the subscription
	 * has been established the queue can be monitored (see
	 * {@link SqsProvider#receive} or {@link SqsProvider#observe}).
	 *
	 * The promise will return a Disposable instance. Call the
	 * dispose method to delete the subscription.
	 *
	 * @public
	 * @async
	 * @param {string} topicName - The name of the topic to subscribe to.
	 * @param {object} queueArn - The ARN of the queue to receive notifications (see {@link SqsProvider#getQueueArn}).
	 * @returns {Promise<Disposable>}
	 */
	async subscribe(topicName, queueArn) {
		assert.argumentIsRequired(topicName, 'topicName', String);
		assert.argumentIsRequired(queueArn, 'queueArn', String);

		this.#checkReady();

		const qualifiedTopicName = getQualifiedTopicName(this.#configuration.prefix, topicName);

		if (!this.#subscriptionPromises.hasOwnProperty(qualifiedTopicName)) {
			this.#subscriptionPromises[qualifiedTopicName] = (async () => {
				const topicArn = await this.getTopicArn(topicName);

				logger.debug('Subscribing SQS queue to SNS topic [', qualifiedTopicName, ']');

				let data;

				try {
					data = await this.#sns.send(new SubscribeCommand({
						'TopicArn': topicArn,
						'Endpoint': queueArn,
						'Protocol': 'sqs'
					}));
				} catch (error) {
					logger.error('SNS subscription to SQS topic failed [', qualifiedTopicName, ']');
					logger.error(error);

					throw 'Failed to subscribe to SNS topic.';
				}

				logger.info('SNS subscription to SQS topic complete [', qualifiedTopicName, ']');

				return Disposable.fromAction(() => {
					if (this.disposed) {
						return;
					}

					logger.debug('Unsubscribing SQS queue from SNS topic [', qualifiedTopicName, ']');

					delete this.#subscriptionPromises[qualifiedTopicName];

					(async () => {
						try {
							await this.#sns.send(new UnsubscribeCommand({
								SubscriptionArn: data.SubscriptionArn
							}));

							logger.info('SQS unsubscribe from SNS topic complete [', qualifiedTopicName, ']');
						} catch (error) {
							logger.error('SQS unsubscribe from SNS topic failed [', qualifiedTopicName, ']');
							logger.error(error);
						}
					})();
				});
			})();
		}

		return this.#subscriptionPromises[qualifiedTopicName];
	}

	/**
	 * Returns a list of all subscriptions to SNS topics from SQS queues. This includes "zombie"
	 * subscriptions (where the SQS queue no longer exists).
	 *
	 * @public
	 * @async
	 * @returns {Promise<object>}
	 */
	async getSubscriptions() {
		this.#checkReady();

		let counts = { };

		counts.queries = 0;
		counts.total = 0;
		counts.matches = 0;

		const region = await this.#sns.config.region();
		const topicArnRegex = new RegExp(`^(arn:aws:sns):(${region}):(.*):(${this.#configuration.prefix})-(.*)$`);

		const listSubscriptionsRecursive = async (nextToken) => {
			const payload = { };

			if (nextToken) {
				payload.NextToken = nextToken;
			}

			const query = ++counts.queries;

			logger.debug('Executing subscription query [', query, '] for prefix [', this.#configuration.prefix, ']');

			let data;

			try {
				data = await this.#sns.send(new ListSubscriptionsCommand(payload));
			} catch (error) {
				logger.warn('Encountered error [', error.name, '] while executing subscription query [', query, ']');

				throw { error };
			}

			logger.debug('Finished subscription query [', query, '] for prefix [', this.#configuration.prefix, '] with [', data.Subscriptions.length, '] results');

			const matches = data.Subscriptions.filter(s => s.Protocol === 'sqs')
				.filter(s => topicArnRegex.test(s.TopicArn));

			counts.total = counts.total + data.Subscriptions.length;
			counts.matches = counts.matches + matches.length;

			const currentResults = matches.map((m) => {
				const result = { };

				result.topicArn = m.TopicArn;
				result.queueArn = m.Endpoint;
				result.subscriptionArn = m.SubscriptionArn;

				return result;
			});

			let continuationResults;

			if (data.NextToken) {
				continuationResults = await listSubscriptionsRecursive(data.NextToken);
			} else {
				continuationResults = [ ];
			}

			return currentResults.concat(continuationResults);
		};

		const results = await listSubscriptionsRecursive();

		logger.debug('Completed [', counts.queries, '] queries for subscriptions to SNS topics with prefix [', this.#configuration.prefix, '] yielding [', counts.matches, '] matching subscriptions out of [', counts.total, '] total subscriptions');

		return results;
	}

	/**
	 * Deletes a subscription to an SNS topic.
	 *
	 * @public
	 * @async
	 * @param {string} subscriptionArn
	 * @returns {Promise}
	 */
	async unsubscribe(subscriptionArn) {
		assert.argumentIsRequired(subscriptionArn, 'subscriptionArn', String);

		this.#checkReady();

		logger.debug('Deleting SNS subscription at ARN [', subscriptionArn, ']');

		try {
			await this.#sns.send(new UnsubscribeCommand({
				SubscriptionArn: subscriptionArn
			}));

			logger.info('SNS subscription deleted at ARN [', subscriptionArn, ']');
		} catch (error) {
			logger.error('SNS subscription deletion failed at ARN [', subscriptionArn, ']');
			logger.error(error);

			throw 'Failed to delete SNS subscription.';
		}
	}

	/**
	 * Returns a list of topic ARN's that match a given prefix.
	 *
	 * @public
	 * @async
	 * @param {string=} topicNamePrefix - The prefix a topic name must have to be returned.
	 * @returns {Promise<string[]>}
	 */
	async getTopics(topicNamePrefix) {
		assert.argumentIsOptional(topicNamePrefix, 'topicNamePrefix', String);

		this.#checkReady();

		let batchCount = 0;

		const getTopicBatch = async (token) => {
			logger.debug('Requesting batch of SNS topics');

			const params = { };

			if (token) {
				params.NextToken = token;
			}

			try {
				const data = await this.#sns.send(new ListTopicsCommand(params));

				logger.info('SNS topic list batch [', ++batchCount, '] received');

				return data;
			} catch (error) {
				logger.info('SNS topic list batch [', ++batchCount, '] failed', error);

				throw 'Failed to retrieve list of SNS topics.';
			}
		};

		const getTopicBatches = async (topics, token) => {
			const data = await getTopicBatch(token || null);

			const previousTopics = topics || [ ];
			const nextTopics = previousTopics.concat(data.Topics || [ ]);

			if (data.NextToken) {
				return getTopicBatches(nextTopics, data.NextToken);
			}

			logger.info('Final SNS topic batch complete, [', nextTopics.length, '] topics received');

			return nextTopics;
		};

		const topics = await getTopicBatches();
		const topicArnRegex = new RegExp(`^arn:aws:sns:.*:[0-9]*:${this.#configuration.prefix}${(topicNamePrefix || '')}`);

		return topics.reduce((accumulator, topic) => {
			if (topicArnRegex.test(topic.TopicArn)) {
				accumulator.push(topic.TopicArn);
			}

			return accumulator;
		}, [ ]);
	}

	/**
	 * @protected
	 * @override
	 */
	_onDispose() {
		this.#topicPromises = null;
		this.#subscriptionPromises = null;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[SnsProvider]';
	}


	#checkReady() {
		if (this.disposed) {
			throw new Error('The SNS provider has been disposed.');
			}

			if (!this.#started) {
				throw new Error('The SNS provider has not been started.');
			}
		}
}

function getQualifiedTopicName(prefix, topicName) {
	return sanitizedName(prefix + '-' + topicName);
}

const finalStarRegex = new RegExp('(\\*)$');
const finalHatRegex = new RegExp('(\\^)$');
const finalDotRegex = new RegExp('(\\.)$');
const finalDollarRegex = new RegExp('(\\$)$');

const starRegex = new RegExp('\\*', 'g');
const hatRegex = new RegExp('\\^', 'g');
const dotRegex = new RegExp('\\*', 'g');
const dollarRegex = new RegExp('\\*', 'g');

function sanitizedName(messageType) {
	return messageType.replace(finalStarRegex, '_star')
		.replace(finalHatRegex, '_hat')
		.replace(finalDotRegex, '_dot')
		.replace(finalDollarRegex, '_dollar')
		.replace(starRegex, '_star_')
		.replace(hatRegex, '_hat_')
		.replace(dotRegex, '_dot_')
		.replace(dollarRegex, '_dollar_');
}
