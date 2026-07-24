import * as array from '@barchart/common-js/lang/array.js';
import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';
import * as object from '@barchart/common-js/lang/object.js';

import Disposable from '@barchart/common-js/lang/Disposable.js';

import AwsOptions from './AwsOptions.js';

import { CreateQueueCommand, DeleteMessageBatchCommand, DeleteQueueCommand, GetQueueAttributesCommand, ListQueuesCommand, PurgeQueueCommand, ReceiveMessageCommand, SendMessageBatchCommand, SendMessageCommand, SetQueueAttributesCommand, SQSClient } from '@aws-sdk/client-sqs';

import log4js from 'log4js';

const logger = log4js.getLogger('common-node/aws/SqsProvider');

/**
 * AWS SDK client configuration for the SQS provider.
 *
 * @typedef {import('@aws-sdk/client-sqs').SQSClientConfig} SqsProviderOptions
 */

/**
 * A facade for Amazon's Simple Queue Service (SQS). The constructor
 * accepts configuration options. The promise-based instance functions
 * abstract knowledge of the AWS API.
 *
 * @public
 * @extends Disposable
 */
export default class SqsProvider extends Disposable {
	#configuration;
	#counter;
	#knownQueues;
	#options;
	#queueArnPromises;
	#queueObservers;
	#queueUrlPromises;
	#sqs;
	#startPromise;
	#started;

	/**
	 * @param {object} configuration - The configuration.
	 * @param {string} configuration.prefix - The prefix that is prepended to any queue name.
	 * @param {SqsProviderOptions=} options - The AWS SDK client configuration.
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

		this.#sqs = null;

		this.#queueUrlPromises = { };
		this.#queueArnPromises = { };

		this.#queueObservers = { };
		this.#knownQueues = { };

		this.#startPromise = null;
		this.#started = false;

		this.#counter = 0;
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
			throw new Error('Unable to start, the SQS provider has been disposed.');
		}

		if (this.#startPromise === null) {
			this.#startPromise = (async () => {
				try {
					this.#sqs = new SQSClient(this.#options);

					logger.info('The SQS provider has started');

					this.#started = true;

					return this.#started;
				} catch (e) {
					logger.error('The SQS provider failed to start', e);

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
			throw new Error('The SQS provider has been disposed.');
		}

		return object.clone(this.#configuration);
	}

	/**
	 * Returns a list of queue URLs where the queue names start with a
	 * given prefix.
	 *
	 * @public
	 * @async
	 * @param {string=} queueNamePrefix - The prefix a queue name must have to be returned.
	 * @returns {Promise<string[]>}
	 */
	async getQueues(queueNamePrefix) {
		assert.argumentIsOptional(queueNamePrefix, 'queueNamePrefix', String);

		let queuePrefixToUse = this.#configuration.prefix;

		if (queueNamePrefix) {
			queuePrefixToUse = queuePrefixToUse + queueNamePrefix;
		}

		logger.info('Listing queues with name prefix [', queuePrefixToUse, ']');

		let data;

		try {
			data = await this.#sqs.send(new ListQueuesCommand({ QueueNamePrefix: queuePrefixToUse }));
		} catch (e) {
			logger.error('Listing of queues with name prefix [', queuePrefixToUse, '] failed');
			logger.error(e);

			throw e;
		}

		const queueUrls = data.QueueUrls || [ ];

		logger.debug('Listing of [', queueUrls.length, '] queues with name prefix [', queuePrefixToUse, '] complete');

		return queueUrls;
	}

	/**
	 * Given a queue's name, return the queue's URL. If no queue with the given
	 * name exists, it will be created.
	 *
	 * @public
	 * @async
	 * @param {string} queueName - The name of the queue to find.
	 * @param {object=} createOptions - Options to use when queue does not exist and must be created.
	 * @returns {Promise<string>}
	 */
	async getQueueUrl(queueName, createOptions) {
		assert.argumentIsRequired(queueName, 'queueName', String);

		this.#checkReady();

		const qualifiedQueueName = getQualifiedQueueName(this.#configuration.prefix, queueName);

		if (!Object.prototype.hasOwnProperty.call(this.#queueUrlPromises, qualifiedQueueName)) {
			logger.debug('The SQS provider has not cached the queue URL. Issuing request to create queue.');

			let retentionTime = null;

			if (createOptions && is.number(createOptions.retentionTime)) {
				retentionTime = createOptions.retentionTime;
			}

			let tags = null;

			if (createOptions && is.object(createOptions.tags)) {
				tags = createOptions.tags;
			}

			this.#queueUrlPromises[qualifiedQueueName] = this.createQueue(queueName, retentionTime, tags);
		}

		return this.#queueUrlPromises[qualifiedQueueName];
	}

	/**
	 * Given a queue's name, return the queue's attributes.
	 *
	 * @public
	 * @async
	 * @param {string} queueUrl - The url of the queue to find.
	 * @param {array=} attributes - The names of attributes to return. By default set to 'All'.
	 * @returns {Promise<object>}
	 */
	async getQueueAttributes(queueUrl, attributes) {
		assert.argumentIsRequired(queueUrl, 'queueName', String);

		if (attributes) {
			assert.argumentIsArray(attributes, 'attributes');
		}

		this.#checkReady();

		const payload = { };

		payload.QueueUrl = queueUrl;

		if (!attributes || attributes.length === 0) {
			payload.AttributeNames = [ 'All' ];
		} else {
			payload.AttributeNames = attributes;
		}

		let data;

		try {
			data = await this.#sqs.send(new GetQueueAttributesCommand(payload));
		} catch (e) {
			logger.error('Queue attribute lookup failed [', queueUrl, ']');
			logger.error(e);

			throw e;
		}

		logger.info('Queue attribute lookup complete [', queueUrl, ']');

		return data.Attributes;
	}

	/**
	 * Given a queue's name, return Amazon's unique identifier for the queue
	 * (i.e. the ARN). If no queue with the given name exists, it will be created.
	 *
	 * @public
	 * @async
	 * @param {string} queueName - The name of the queue to find.
	 * @param {object=} createOptions - Options to use when queue does not exist and must be created.
	 * @returns {Promise<string>}
	 */
	async getQueueArn(queueName, createOptions) {
		assert.argumentIsRequired(queueName, 'queueName', String);

		this.#checkReady();

		const qualifiedQueueName = getQualifiedQueueName(this.#configuration.prefix, queueName);

		if (Object.prototype.hasOwnProperty.call(this.#queueArnPromises, qualifiedQueueName)) {
			return this.#queueArnPromises[qualifiedQueueName];
		}

		this.#queueArnPromises[qualifiedQueueName] = (async () => {
			const queueUrl = await this.getQueueUrl(queueName, createOptions);

			logger.debug('Getting queue attributes [', qualifiedQueueName, ']');

			let data;

			try {
				data = await this.#sqs.send(new GetQueueAttributesCommand({ QueueUrl: queueUrl, AttributeNames: ['QueueArn'] }));
			} catch (e) {
				logger.error('Queue attribute lookup failed [', qualifiedQueueName, ']');
				logger.error(e);

				throw e;
			}

			logger.info('Queue attribute lookup complete [', qualifiedQueueName, ']');

			return data.Attributes.QueueArn;
		})();

		return this.#queueArnPromises[qualifiedQueueName];
	}

	/**
	 * Creates a queue having the given name (and other options) and returns
	 * the queue's URL. If the queue already exists, the URL of the existing
	 * queue is returned.
	 *
	 * @public
	 * @async
	 * @param {string} queueName - The name of the queue to create.
	 * @param {number=} retentionTime - The length of time a queue will retain a message in seconds.
	 * @param {object=} tags - Tags to assign to the queue.
	 * @returns {Promise<string>}
	 */
	async createQueue(queueName, retentionTime, tags) {
		assert.argumentIsRequired(queueName, 'queueName', String);
		assert.argumentIsOptional(retentionTime, 'retentionTime', Number);
		assert.argumentIsOptional(tags, 'tags', Object);

		this.#checkReady();

		const qualifiedQueueName = getQualifiedQueueName(this.#configuration.prefix, queueName);

		logger.debug('Creating queue [', qualifiedQueueName, ']');

		const payload = {
			QueueName: qualifiedQueueName,
		};

		if (is.number(retentionTime)) {
			payload.Attributes = {
				MessageRetentionPeriod: retentionTime.toString()
			};
		}

		if (is.object(tags)) {
			const keys = object.keys(tags);

			if (keys.length > 0) {
				payload.Tags = tags;
			}
		}

		let data;

		try {
			data = await this.#sqs.send(new CreateQueueCommand(payload));
		} catch (e) {
			logger.error('Queue creation failed [', qualifiedQueueName, ']');
			logger.error(e);

			throw e;
		}

		logger.info('Queue created [', qualifiedQueueName, ']');

		const queueUrl = data.QueueUrl;

		this.#knownQueues[qualifiedQueueName] = queueUrl;

		return queueUrl;
	}

	/**
	 * Deletes a queue having the given name.
	 *
	 * @public
	 * @async
	 * @param {string} queueName - The name of the queue to delete.
	 * @returns {Promise}
	 */
	async deleteQueue(queueName) {
		assert.argumentIsRequired(queueName, 'queueName', String);

		this.#checkReady();

		const qualifiedQueueName = getQualifiedQueueName(this.#configuration.prefix, queueName);

		let queueUrl;

		if (Object.prototype.hasOwnProperty.call(this.#knownQueues, qualifiedQueueName)) {
			queueUrl = this.#knownQueues[qualifiedQueueName];
		} else {
			queueUrl = await this.getQueueUrl(queueName);
		}

		return this.#executeQueueDelete(qualifiedQueueName, queueUrl);
	}

	/**
	 * Deletes a queue having the given URL.
	 *
	 * @public
	 * @async
	 * @param {string} queueUrl - The URL of the queue to delete.
	 * @returns {Promise}
	 */
	async deleteQueueUrl(queueUrl) {
		assert.argumentIsRequired(queueUrl, 'queueUrl', String);

		return this.#executeQueueDelete('name not specified', queueUrl);
	}

	/**
	 * Enqueues a message in the queue. If the queue doesn't exist, it will
	 * be created.
	 *
	 * @public
	 * @async
	 * @param {string} queueName - The name of the queue to add the message to.
	 * @param {object} payload - The message to enqueue (will be serialized to JSON).
	 * @param {number=} delaySeconds - The number of seconds to prevent message from being retrieved from the queue.
	 * @param {object=} createOptions - Options to use when queue does not exist and must be created.
	 * @returns {Promise}
	 */
	async send(queueName, payload, delaySeconds, createOptions) {
		assert.argumentIsRequired(queueName, 'queueName', String);
		assert.argumentIsRequired(payload, 'payload', Object);
		assert.argumentIsOptional(delaySeconds, 'delaySeconds', Number);

		this.#checkReady();

		const queueUrl = await this.getQueueUrl(queueName, createOptions);
		const qualifiedQueueName = getQualifiedQueueName(this.#configuration.prefix, queueName);

		const counter = ++this.#counter;

		logger.debug('Sending message [', counter, '] to queue [', qualifiedQueueName, ']');
		logger.trace(payload);

		const message = { };

		message.QueueUrl = queueUrl;
		message.MessageBody = JSON.stringify(payload);

		if (is.number(delaySeconds)) {
			message.DelaySeconds = delaySeconds;
		}

		try {
			await this.#sqs.send(new SendMessageCommand(message));
		} catch (e) {
			logger.error('Queue send [', counter, '] failed:', qualifiedQueueName, ']');
			logger.error(e);

			throw e;
		}

		logger.info('Sent message [', counter, '] to queue [', qualifiedQueueName, ']');
	}

	/**
	 * Enqueues a batch of messages (up to 10) in the queue. If the queue doesn't exist, it will
	 * be created.
	 *
	 * @public
	 * @async
	 * @param {string} queueName - The name of the queue to add the message to.
	 * @param {object[]} batch - The messages to enqueue (each will be serialized to JSON).
	 * @param {object=} createOptions - Options to use when queue does not exist and must be created.
	 * @returns {Promise}
	 */
	async sendBatch(queueName, batch, createOptions) {
		assert.argumentIsRequired(queueName, 'queueName', String);
		assert.argumentIsArray(batch, 'batch');

		this.#checkReady();

		if (batch.length === 0) {
			return;
		}

		if (batch.length > 10) {
			throw new Error('The SQS provider is unable to enqueue more than 10 messages at once.');
		}

		const queueUrl = await this.getQueueUrl(queueName, createOptions);
		const qualifiedQueueName = getQualifiedQueueName(this.#configuration.prefix, queueName);

		this.#counter += batch.length;

		const start = this.#counter - batch.length + 1;
		const end = this.#counter;

		logger.debug('Sending messages [', start, '] through [', end, '] to queue [', qualifiedQueueName, ']');
		logger.trace(batch);

		const payload = {
			QueueUrl: queueUrl,
			Entries: batch.map((item, i) => {
				return {
					Id: i.toString(),
					MessageBody: JSON.stringify(item)
				};
			})
		};

		let data;

		try {
			data = await this.#sqs.send(new SendMessageBatchCommand(payload));
		} catch (e) {
			logger.error('Queue send [', start, '] through [', end, '] failed, [', batch.length, '] messages could not be enqueued [', qualifiedQueueName, ']');
			logger.error(e);

			throw e;
		}

		const failed = data.Failed || [ ];

		if (failed.length !== 0) {
			logger.error('Queue send [', start, '] through [', end, '] failed, [', failed.length, '] messages could not be enqueued [', qualifiedQueueName, ']');

			throw new Error(`Some [ ${failed.length} ] of [ ${batch.length} ] messages could not be enqueued [ ${qualifiedQueueName} ]`);
		}

		logger.info('Sent messages [', start, '] through [', end, '] to queue [', qualifiedQueueName, ']');
	}

	/**
	 * Reads from the queue and deletes any messages that are read. After
	 * the operation, the queue will not necessarily be empty.
	 *
	 * @public
	 * @async
	 * @param {string} queueName - The name of the queue to read.
	 * @param {number=} waitDuration - The maximum amount of time the server-side long-poll will wait for messages to become available.
	 * @param {number=} maximumMessages - The maximum number of messages to read (cannot be more than 10).
	 * @param {boolean=} synchronousDelete - If true, the promise won't resolve until new messages have been read *and deleted* from the queue.
	 * @returns {Promise<object[]>}
	 */
	async receive(queueName, waitDuration, maximumMessages, synchronousDelete) {
		assert.argumentIsRequired(queueName, 'queueName', String);
		assert.argumentIsOptional(waitDuration, 'waitDuration', Number);
		assert.argumentIsOptional(maximumMessages, 'maximumMessages', Number);
		assert.argumentIsOptional(synchronousDelete, 'synchronousDelete', Boolean);

		this.#checkReady();

		const qualifiedQueueName = getQualifiedQueueName(this.#configuration.prefix, queueName);

		if (Object.prototype.hasOwnProperty.call(this.#queueObservers, qualifiedQueueName)) {
			throw new Error('The queue is being observed.');
		}

		return this.#receiveMessages(queueName, waitDuration, maximumMessages, synchronousDelete);
	}

	/**
	 * Reads all messages from queue (perhaps requiring multiple calls to the
	 * AWS SDK) and returns an array of messages (use with caution).
	 *
	 * @public
	 * @async
	 * @param {string} queueName - The name of the queue to read.
	 * @param {Function=} mapper - A function that can be used to map messages into something else.
	 * @param {boolean=} synchronousDelete - If true, the promise won't resolve until new messages have been read *and deleted* from the queue.
	 * @param {number=} maximumMessages - If positive, the maximum number of messages to read before stopping. This logic is approximate, you may receive a few more messages (up to ten more).
	 * @returns {Promise<object[]>}
	 */
	async drain(queueName, mapper, synchronousDelete, maximumMessages) {
		assert.argumentIsRequired(queueName, 'queueName', String);
		assert.argumentIsOptional(mapper, 'mapper', Function);
		assert.argumentIsOptional(synchronousDelete, 'synchronousDelete', Boolean);
		assert.argumentIsOptional(maximumMessages, 'maximumMessages', Number);

		const mapperToUse = mapper || (m => m);

		const batches = [ ];
		const batchSize = 10;

		let count = 0;

		const executeDrain = async () => {
			const messages = await this.receive(queueName, 0, batchSize, synchronousDelete);

			if (messages.length === 0) {
				return;
			}

			batches.push(messages.map(mapperToUse));

			count = count + messages.length;

			if (is.positive(maximumMessages) && count >= maximumMessages) {
				return;
			}

			return executeDrain();
		};

		await executeDrain();

		return array.flatten(batches);
	}

	/**
	 * Purges all messages from an SQS queue.
	 *
	 * @public
	 * @async
	 * @param {string} queueName - The name of the queue to purge.
	 * @returns {Promise<boolean>}
	 */
	async purge(queueName) {
		assert.argumentIsRequired(queueName, 'queueName', String);

		this.#checkReady();

		const queueUrl = await this.getQueueUrl(queueName);

		const qualifiedQueueName = getQualifiedQueueName(this.#configuration.prefix, queueName);

		logger.debug(`Queue purge beginning [ ${qualifiedQueueName} ]`);

		try {
			await this.#sqs.send(new PurgeQueueCommand({ QueueUrl: queueUrl }));
		} catch (e) {
			logger.error(`Queue purge failed [ ${qualifiedQueueName} ]`);
			logger.error(e);

			throw e;
		}

		logger.info(`Queue purge complete [ ${qualifiedQueueName} ]`);

		return true;
	}

	/**
	 * Makes repeated reads from a queue until canceled and returns messages
	 * using the callback provided.
	 *
	 * @public
	 * @param {string} queueName - The name of the queue to read.
	 * @param {Function} callback - Invoked with a messages as they become available.
	 * @param {number=} pollInterval - The milliseconds to wait between polling the queue.
	 * @param {number=} pollDuration - The maximum amount of time the server-side long-poll will wait for messages to become available.
	 * @param {number=} batchSize - The maximum number of messages to read per request (cannot be more than 10).
	 * @param {object=} createOptions - Options to use when queue does not exist and must be created.
	 * @returns {Disposable}
	 */
	observe(queueName, callback, pollInterval, pollDuration, batchSize, createOptions) {
		assert.argumentIsRequired(queueName, 'queueName', String);
		assert.argumentIsRequired(callback, 'callback', Function);
		assert.argumentIsOptional(pollInterval, 'pollInterval', Number);
		assert.argumentIsOptional(pollDuration, 'pollDuration', Number);
		assert.argumentIsOptional(batchSize, 'batchSize', Number);

		this.#checkReady();

		const qualifiedQueueName = getQualifiedQueueName(this.#configuration.prefix, queueName);

		if (Object.prototype.hasOwnProperty.call(this.#queueObservers, qualifiedQueueName)) {
			throw new Error('The queue is already being observed.');
		}

		logger.debug('Creating observer for queue [', qualifiedQueueName, ']');

		let disposed = false;

		this.#queueObservers[qualifiedQueueName] = Disposable.fromAction(() => {
			logger.info('Disposing observer of queue [', qualifiedQueueName, ']');

			disposed = true;

			delete this.#queueObservers[qualifiedQueueName];
		});

		const checkQueue = async () => {
			if (disposed) {
				logger.warn(`The queue observer for [ ${qualifiedQueueName} ] has been disposed. Aborting processing.`);

				return;
			}

			let messages;

			try {
				messages = await this.#receiveMessages(queueName, pollDuration, batchSize, false, createOptions);
			} catch (e) {
				logger.error(`An error occurred while receiving messages from queue [ ${qualifiedQueueName} ]`);
				logger.error(e);

				messages = null;
			}

			const executors = (messages || [ ]).map((message, i) => {
				return async () => {
					if (disposed) {
						return;
					}

					let result;

					try {
						result = callback(message);
					} catch (e) {
						logger.error(`An error occurred while processing message [ ${i} ] from queue [ ${qualifiedQueueName} ]`);

						logger.error(message);
						logger.error(e);

						return;
					}

					return result;
				};
			});

			try {
				for (const executor of executors) {
					await executor();
				}
			} catch (e) {
				logger.error(`An error occurred while processing queue messages in sequence. This should not happen. Continuing.`);
				logger.error(e);
			}

			if (disposed) {
				logger.warn(`The queue observer for [ ${qualifiedQueueName} ] has been disposed. Aborting processing.`);

				return;
			}

			let delay;

			if (messages === null) {
				delay = Math.max(pollInterval || 2000, 5000);
			} else if (messages.length === 0) {
				delay = pollInterval || 2000;
			} else {
				delay = 0;
			}

			setTimeout(checkQueue, delay);
		};

		checkQueue();

		return this.#queueObservers[qualifiedQueueName];
	}

	/**
	 * Changes the policy on a Queue. The "policy" must conform to Amazon's schema.
	 *
	 * @public
	 * @async
	 * @param {string} queueName - The name of the queue to adjust.
	 * @param {object} policy - The Amazon schema-compliant policy.
	 * @returns {Promise}
	 */
	async setQueuePolicy(queueName, policy) {
		assert.argumentIsRequired(queueName, 'queueName', String);
		assert.argumentIsRequired(policy, 'policy', Object);

		this.#checkReady();

		const queueUrl = await this.getQueueUrl(queueName);

		const qualifiedQueueName = getQualifiedQueueName(this.#configuration.prefix, queueName);

		logger.debug('Updating queue policy [', qualifiedQueueName, ']');
		logger.trace(policy);

		try {
			await this.#sqs.send(new SetQueueAttributesCommand({ QueueUrl: queueUrl, Attributes: { Policy: JSON.stringify(policy) } }));
		} catch (e) {
			logger.error('Queue policy update failed [', qualifiedQueueName, ']');
			logger.error(e);

			throw e;
		}

		logger.info('Queue policy updated for [', qualifiedQueueName, ']');
	}

	/**
	 * @protected
	 * @override
	 */
	_onDispose() {
		Object.keys(this.#queueObservers).forEach((key) => {
			this.#queueObservers[key].dispose();
		});

		this.#queueUrlPromises = null;
		this.#queueArnPromises = null;

		this.#queueObservers = null;
	}

	/**
	 * Returns the policy for SNS delivery.
	 *
	 * @public
	 * @static
	 * @param {string} queueArn
	 * @param {string} topicArn
	 * @returns {object}
	 */
	static getPolicyForSnsDelivery(queueArn, topicArn) {
		const currentDate = new Date();

		return {
			Version: '2008-10-17',
			Id: queueArn + '/SQSDefaultPolicy',
			Statement: [{
				Sid: 'Sid' + currentDate.getTime(),
				Effect: 'Allow',
				Principal: {
					AWS: '*'
				},
				Action: 'SQS:SendMessage',
				Resource: queueArn,
				Condition: {
					ArnEquals: {
						'aws:SourceArn': topicArn
					}
				}
			}]
		};
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[SqsProvider]';
	}

	async #receiveMessages(queueName, waitTime, maximumMessages, synchronousDelete, createOptions) {
		let waitTimeToUse;

		if (is.number(waitTime)) {
			waitTimeToUse = Math.round(waitTime / 1000);
		} else {
			waitTimeToUse = 20;
		}

		let maximumMessagesToUse;

		if (is.number(maximumMessages)) {
			maximumMessagesToUse = Math.max(Math.min(10, maximumMessages), 1);
		} else {
			maximumMessagesToUse = 1;
		}

		const queueUrl = await this.getQueueUrl(queueName, createOptions);
		const qualifiedQueueName = getQualifiedQueueName(this.#configuration.prefix, queueName);

		logger.debug('Receiving message(s) from queue [', qualifiedQueueName, ']');

		let data;

		try {
			data = await this.#sqs.send(new ReceiveMessageCommand({ QueueUrl: queueUrl, MaxNumberOfMessages: maximumMessagesToUse, WaitTimeSeconds: waitTimeToUse }));
		} catch (e) {
			logger.error('SQS receive messages failed [', qualifiedQueueName, ']');
			logger.error(e);

			throw e;
		}

		if (is.array(data.Messages) && data.Messages.length !== 0) {
			logger.info('Received [', data.Messages.length, '] message(s) from queue [', qualifiedQueueName, ']');

			logger.trace(data.Messages);
		} else {
			logger.debug('Received [ 0 ] message(s) from queue [', qualifiedQueueName, ']');

			return [ ];
		}

		let messages;

		try {
			messages = data.Messages.map(message => JSON.parse(message.Body));
		} catch (e) {
			logger.error('Failed to parse message(s) received from queue.', e);

			messages = null;
		}

		const deletePromise = this.#deleteMessages(qualifiedQueueName, queueUrl, data.Messages).catch((e) => {
			logger.error('Failed to delete message(s) received from queue [', qualifiedQueueName, '], continuing.', e);
		});

		if (synchronousDelete) {
			await deletePromise;
		}

		if (messages === null) {
			throw new Error(`Failed to parse message(s) received from queue [ ${qualifiedQueueName} ].`);
		}

		return messages;
	}

	async #deleteMessages(qualifiedQueueName, queueUrl, messages) {
		const messageCount = messages.length;

		if (messageCount === 0) {
			return;
		}

		logger.debug('Deleting [', messageCount, '] message(s) from queue [', qualifiedQueueName, ']');

		const payload = {
			QueueUrl: queueUrl,
			Entries: messages.map((message, index) => {
				return {
					Id: index.toString(),
					ReceiptHandle: message.ReceiptHandle
				};
			})
		};

		let data;

		try {
			data = await this.#sqs.send(new DeleteMessageBatchCommand(payload));
		} catch (e) {
			logger.error('SQS message delete failed [', qualifiedQueueName, ']');
			logger.error(e);

			throw e;
		}

		let deletedCount;

		if (is.array(data.Failed)) {
			deletedCount = messageCount - data.Failed.length;
		} else {
			deletedCount = messageCount;
		}

		logger.info('Deleted [', deletedCount, '] message(s) from queue [', qualifiedQueueName, ']');

		if (deletedCount !== messageCount) {
			logger.error(`Failed to delete [ ${data.Failed.length} ] message(s) from queue [ ${qualifiedQueueName} ]`);

			throw new Error(`Failed to delete [ ${data.Failed.length} ] message(s) from queue [ ${qualifiedQueueName} ]`);
		}
	}

	async #executeQueueDelete(qualifiedQueueName, queueUrl) {
		logger.debug('Deleting queue [', qualifiedQueueName, '] at URL [', queueUrl, ']');

		try {
			await this.#sqs.send(new DeleteQueueCommand({ QueueUrl: queueUrl }));
		} catch (e) {
			logger.error('Queue delete failed [', qualifiedQueueName, '] at URL [', queueUrl, ']');
			logger.error(e);

			throw e;
		}

		logger.info('Queue deleted [', qualifiedQueueName, '] at URL [', queueUrl, ']');
	}

	#checkReady() {
		if (this.disposed) {
			throw new Error('The SQS provider has been disposed.');
		}

		if (!this.#started) {
			throw new Error('The SQS provider has not been started.');
		}
	}
}

const finalStarRegex = new RegExp('(\\*)$');
const finalHatRegex = new RegExp('(\\^)$');
const finalDotRegex = new RegExp('(\\.)$');
const finalDollarRegex = new RegExp('(\\$)$');

const starRegex = new RegExp('\\*', 'g');
const hatRegex = new RegExp('\\^', 'g');
const dotRegex = new RegExp('\\*', 'g');
const dollarRegex = new RegExp('\\*', 'g');

function getQualifiedQueueName(prefix, queueName) {
	return sanitizedName(prefix + '-' + queueName);
}

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
