const aws = require('aws-sdk'),
	log4js = require('log4js');

const assert = require('@barchart/common-js/lang/assert'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
	is = require('@barchart/common-js/lang/is'),
	object = require('@barchart/common-js/lang/object'),
	promise = require('@barchart/common-js/lang/promise');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('common-node/aws/SnsProvider');

	/**
	 * A facade for Amazon's Notification Service (SNS). The constructor
	 * accepts configuration options. The promise-based instance functions
	 * abstract knowledge of the AWS API.
	 *
	 * @public
	 * @extends Disposable
	 * @param {object} configuration
	 * @param {string} configuration.region - The AWS region (e.g. "us-east-1").
	 * @param {string} configuration.prefix - The prefix that is prepended to any topic name.
	 * @param {string=} configuration.apiVersion - The SES version (defaults to "2010-03-31").
	 */
	class SnsProvider extends Disposable {
		constructor(configuration) {
			super();

			assert.argumentIsRequired(configuration, 'configuration', Object);
			assert.argumentIsRequired(configuration.region, 'configuration.region', String);
			assert.argumentIsRequired(configuration.prefix, 'configuration.prefix', String);
			assert.argumentIsOptional(configuration.apiVersion, 'configuration.apiVersion', String);

			this._configuration = configuration;

			this._sns = null;

			this._startPromise = null;
			this._started = false;

			this._topicPromises = {};
			this._subscriptionPromises = {};
		}

		/**
		 * Initializes the Amazon SDK. Call this before invoking any other instance
		 * functions.
		 *
		 * @public
		 * @async
		 * @returns {Promise<Boolean>}
		 */
		async start() {
			if (this.disposed) {
				return Promise.reject('Unable to start, the SNS provider has been disposed.');
			}

			if (this._startPromise === null) {
				this._startPromise = Promise.resolve()
					.then(() => {
						aws.config.update({region: this._configuration.region});

						this._sns = new aws.SNS({apiVersion: this._configuration.apiVersion || '2010-03-31'});
					}).then(() => {
						logger.info('The SNS provider has started');

						this._started = true;

						return this._started;
					}).catch((e) => {
						logger.error('The SNS provider failed to start', e);

						throw e;
					});
			}

			return this._startPromise;
		}

		/**
		 * Returns a clone of the configuration object originally passed
		 * to the constructor.
		 *
		 * @public
		 * @returns {Object}
		 */
		getConfiguration() {
			if (this.disposed) {
				throw new Error('The SNS provider has been disposed.');
			}

			return object.clone(this._configuration);
		}

		/**
		 * Given a topic's name, return Amazon's unique identifier for the topic
		 * (i.e. the ARN). If no topic with the given name exists, it will be created.
		 *
		 * @public
		 * @async
		 * @param {string} topicName - The name of the topic to find (or create).
		 * @param {Object=} createOptions - Options to use when topic does not exist and must be created.
		 * @returns {Promise<String>}
		 */
		async getTopicArn(topicName, createOptions) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(topicName, 'topicName', String);

					checkReady.call(this);

					const qualifiedTopicName = getQualifiedTopicName(this._configuration.prefix, topicName);

					if (!this._topicPromises.hasOwnProperty(qualifiedTopicName)) {
						logger.debug('The SNS provider has not cached the topic. Issuing request to create topic.');

						let tags = null;

						if (createOptions && createOptions.tags) {
							tags = createOptions.tags;
						}

						this._topicPromises[qualifiedTopicName] = this.createTopic(topicName, tags);
					}

					return this._topicPromises[qualifiedTopicName];
				});
		}

		/**
		 * Creates a topic with the given name and returns the topic's ARN. If the topic already
		 * exists, the ARN of the existing topic is returned.
		 *
		 * @public
		 * @async
		 * @param {string} topicName - The name of the topic to create.
		 * @param {Object=} tags - Tags to assign to the topic.
		 * @returns {Promise<String>}
		 */
		async createTopic(topicName, tags) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(topicName, 'topicName', String);
					assert.argumentIsOptional(tags, 'tags', Object);

					checkReady.call(this);

					return promise.build(
						(resolveCallback, rejectCallback) => {
							const qualifiedTopicName = getQualifiedTopicName(this._configuration.prefix, topicName);

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

							this._sns.createTopic(payload, (error, data) => {
								if (error === null) {
									logger.info('SNS topic created [', qualifiedTopicName, ']');

									resolveCallback(data.TopicArn);
								} else {
									logger.error('SNS topic creation failed [', qualifiedTopicName, ']');
									logger.error(error);

									rejectCallback('Failed to create SNS topic.');
								}
							});
						}
					);
				});
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
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(topicName, 'topicName', String);

					checkReady.call(this);

					return this.getTopicArn(topicName)
						.then((topicArn) => {
							const qualifiedTopicName = getQualifiedTopicName(this._configuration.prefix, topicName);

							logger.info('Deleting SNS topic [', qualifiedTopicName, '] at topic ARN [', topicArn, ']');

							return this.deleteTopicArn(topicArn);
						});
				});
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
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(topicArn, 'topicArn', String);

					checkReady.call(this);

					return promise.build(
						(resolveCallback, rejectCallback) => {
							logger.debug('Deleting SNS topic at ARN [', topicArn, ']');

							this._sns.deleteTopic({
								TopicArn: topicArn
							}, (error, data) => {
								if (error === null) {
									logger.info('SNS topic deleted at ARN [', topicArn, ']');

									resolveCallback();
								} else {
									logger.error('SNS topic deletion failed at ARN [', topicArn, ']');
									logger.error(error);

									rejectCallback('Failed to delete SNS topic.');
								}
							});
						}
					);
				});
		}

		/**
		 * Publishes a message to a topic. The message will be serialized as JSON.
		 *
		 * @public
		 * @async
		 * @param {string} topicName - The name of the topic to publish to.
		 * @param {Object} payload - The message to publish (which will be serialized as JSON).
		 * @param {Object=} createOptions - Options to use when topic does not exist and must be created.
		 * @returns {Promise}
		 */
		async publish(topicName, payload, createOptions) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(topicName, 'topicName', String);
					assert.argumentIsRequired(payload, 'payload', Object);

					checkReady.call(this);

					return this.getTopicArn(topicName, createOptions)
						.then((topicArn) => {
							const qualifiedTopicName = getQualifiedTopicName(this._configuration.prefix, topicName);

							return promise.build(
								(resolveCallback, rejectCallback) => {
									logger.debug('Publishing to SNS topic [', qualifiedTopicName, ']');
									logger.trace(payload);

									this._sns.publish({
										TopicArn: topicArn,
										Message: JSON.stringify(payload)
									}, (error, data) => {
										if (error === null) {
											logger.info('Published to SNS topic [', qualifiedTopicName, ']');

											resolveCallback();
										} else {
											logger.error(error);

											rejectCallback('Failed to publish message to SNS topic.');
										}
									});
								}
							);
						});
				});
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
		 * @param {Object} queueArn - The ARN of the queue to receive notifications (see {@link SqsProvider#getQueueArn}).
		 * @returns {Promise<Disposable>}
		 */
		async subscribe(topicName, queueArn) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(topicName, 'topicName', String);
					assert.argumentIsRequired(queueArn, 'queueArn', String);

					checkReady.call(this);

					const qualifiedTopicName = getQualifiedTopicName(this._configuration.prefix, topicName);

					if (!this._subscriptionPromises.hasOwnProperty(qualifiedTopicName)) {
						this._subscriptionPromises[qualifiedTopicName] = this.getTopicArn(topicName)
							.then((topicArn) => {
								return promise.build(
									(resolveCallback, rejectCallback) => {
										logger.debug('Subscribing SQS queue to SNS topic [', qualifiedTopicName, ']');

										this._sns.subscribe({
											'TopicArn': topicArn,
											'Endpoint': queueArn,
											'Protocol': 'sqs'
										}, (error, data) => {
											if (error === null) {
												logger.info('SNS subscription to SQS topic complete [', qualifiedTopicName, ']');

												resolveCallback(Disposable.fromAction(() => {
													if (this.disposed) {
														return;
													}

													logger.debug('Unsubscribing SQS queue from SNS topic [', qualifiedTopicName, ']');

													delete this._subscriptionPromises[qualifiedTopicName];

													this._sns.unsubscribe({
														SubscriptionArn: data.SubscriptionArn
													}, (error, data) => {
														if (error === null) {
															logger.info('SQS unsubscribe from SNS topic complete [', qualifiedTopicName, ']');
														} else {
															logger.error('SQS unsubscribe from SNS topic failed [', qualifiedTopicName, ']');
															logger.error(error);
														}
													});
												}));
											} else {
												logger.error('SNS subscription to SQS topic failed [', qualifiedTopicName, ']');
												logger.error(error);

												rejectCallback('Failed to subscribe to SNS topic.');
											}
										});
									}
								);
							});
					}

					return this._subscriptionPromises[qualifiedTopicName];
				});
		}

		/**
		 * Returns a list of all subscriptions to SNS topics from SQS queues. This includes "zombie"
		 * subscriptions (where the SQS queue no longer exists).
		 *
		 * @public
		 * @async
		 * @returns {Promise<Object>}
		 */
		async getSubscriptions() {
			return Promise.resolve()
				.then(() => {
					checkReady.call(this);

					let counts = { };

					counts.queries = 0;
					counts.total = 0;
					counts.matches = 0;

					const topicArnRegex = new RegExp(`^(arn:aws:sns):(${this._configuration.region}):(.*):(${this._configuration.prefix})-(.*)$`);

					const listSubscriptionsRecursive = (nextToken) => {
						return promise.build((resolveCallback, rejectCallback) => {
							const payload = { };

							if (nextToken) {
								payload.NextToken = nextToken;
							}

							const query = ++counts.queries;

							logger.debug('Executing subscription query [', query, '] for prefix [', this._configuration.prefix, ']');

							this._sns.listSubscriptions(payload, (error, data) => {
								if (error) {
									logger.warn('Encountered error [', error.code, '] while executing subscription query [', query, ']');

									rejectCallback({ error });

									return;
								}

								logger.debug('Finished subscription query [', query, '] for prefix [', this._configuration.prefix, '] with [', data.Subscriptions.length, '] results');

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

								const continuationPromise = Promise.resolve()
									.then(() => {
										if (data.NextToken) {
											return listSubscriptionsRecursive(data.NextToken);
										} else {
											return Promise.resolve([ ]);
										}
									});

								return continuationPromise
									.then((continuationResults) => {
										resolveCallback(currentResults.concat(continuationResults));
									});
							});
						});
					};

					return listSubscriptionsRecursive()
						.then((results) => {
							logger.debug('Completed [', counts.queries, '] queries for subscriptions to SNS topics with prefix [', this._configuration.prefix, '] yielding [', counts.matches, '] matching subscriptions out of [', counts.total, '] total subscriptions');

							return results;
						});
				});
		}

		/**
		 * Deletes a subscription to an SNS topic.
		 *
		 * @public
		 * @async
		 * @param {String} subscriptionArn
		 * @returns {Promise}
		 */
		async unsubscribe(subscriptionArn) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(subscriptionArn, 'subscriptionArn', String);

					checkReady.call(this);

					return promise.build(
						(resolveCallback, rejectCallback) => {
							logger.debug('Deleting SNS subscription at ARN [', subscriptionArn, ']');

							this._sns.unsubscribe({
								SubscriptionArn: subscriptionArn
							}, (error, data) => {
								if (error === null) {
									logger.info('SNS subscription deleted at ARN [', subscriptionArn, ']');

									resolveCallback();
								} else {
									logger.error('SNS subscription deletion failed at ARN [', subscriptionArn, ']');
									logger.error(error);

									rejectCallback('Failed to delete SNS subscription.');
								}
							});
						}
					);
				});
		}

		/**
		 * Returns a list of topic ARN's that match a given prefix.
		 *
		 * @public
		 * @async
		 * @param {string=} topicNamePrefix - The prefix a topic name must have to be returned.
		 * @returns {Promise<String[]>}
		 */
		async getTopics(topicNamePrefix) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsOptional(topicNamePrefix, 'topicNamePrefix', String);

					checkReady.call(this);

					let batchCount = 0;

					const getTopicBatch = (token) => {
						return promise.build((resolveCallback, rejectCallback) => {
							logger.debug('Requesting batch of SNS topics');

							const params = { };

							if (token) {
								params.NextToken = token;
							}

							this._sns.listTopics(params, (error, data) => {
								if (error === null) {
									logger.info('SNS topic list batch [', ++batchCount, '] received');

									resolveCallback(data);
								} else {
									logger.info('SNS topic list batch [', ++batchCount, '] failed', error);

									rejectCallback('Failed to retrieve list of SNS topics.');
								}
							});
						});
					};

					const getTopicBatches = (topics, token) => {
						return getTopicBatch(token || null)
							.then((data) => {
								const previousTopics = topics || [ ];

								let nextTopics = previousTopics.concat(data.Topics || [ ]);
								let nextPromise = null;

								if (data.NextToken) {
									nextPromise = getTopicBatches(nextTopics, data.NextToken);
								} else {
									logger.info('Final SNS topic batch complete, [', nextTopics.length, '] topics received');

									nextPromise = Promise.resolve(nextTopics);
								}

								return nextPromise;
							});
					};

					return getTopicBatches()
						.then((topics) => {
							const topicArnRegex = new RegExp(`^arn:aws:sns:.*:[0-9]*:${this._configuration.prefix}${(topicNamePrefix || '')}`);

							return topics.reduce((accumulator, topic) => {
								if (topicArnRegex.test(topic.TopicArn)) {
									accumulator.push(topic.TopicArn);
								}

								return accumulator;
							}, [ ]);
						});
				});
		}

		_onDispose() {
			this._topicPromises = null;
			this._subscriptionPromises = null;
		}

		toString() {
			return '[SnsProvider]';
		}
	}

	function checkReady() {
		if (this.disposed) {
			throw new Error('The SNS provider has been disposed.');
		}

		if (!this._started) {
			throw new Error('The SNS provider has not been started.');
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

	return SnsProvider;
})();
