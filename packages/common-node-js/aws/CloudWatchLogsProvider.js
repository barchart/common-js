const aws = require('aws-sdk'),
	log4js = require('log4js');

const assert = require('@barchart/common-js/lang/assert'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
	is = require('@barchart/common-js/lang/is'),
	promise = require('@barchart/common-js/lang/promise'),
	Scheduler = require('@barchart/common-js/timing/Scheduler');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('common-node/aws/CloudWatchLogsProvider');

	/**
	 * A facade for Amazon's CloudWatchLogs Service. The constructor
	 * accepts configuration options. The promise-based instance functions
	 * abstract knowledge of the AWS API.
	 *
	 * @public
	 * @extends {Disposable}
	 * @param {object} configuration
	 * @param {String} configuration.region - The AWS region (e.g. "us-east-1").
	 * @param {String=} configuration.apiVersion - The CloudWatchLogs version (defaults to "2014-03-28").
	 */
	class CloudWatchLogsProvider extends Disposable {
		constructor(configuration) {
			super();

			assert.argumentIsRequired(configuration, 'configuration');
			assert.argumentIsRequired(configuration.region, 'configuration.region', String);
			assert.argumentIsOptional(configuration.apiVersion, 'configuration.apiVersion', String);

			this._configuration = configuration;

			this._scheduler = new Scheduler();

			this._cloudWatchLogs = null;

			this._startPromise = null;
			this._started = false;
		}

		/**
		 * Connects to Amazon. Must be called once before using other instance
		 * functions.
		 *
		 * @public
		 * @async
		 * @returns {Promise<Boolean>}
		 */
		async start() {
			if (this.disposed) {
				return Promise.reject('Unable to start, the CloudWatchLogsProvider has been disposed.');
			}

			if (this._startPromise === null) {
				this._startPromise = Promise.resolve()
					.then(() => {
						aws.config.update({region: this._configuration.region});

						this._cloudWatchLogs = new aws.CloudWatchLogs({apiVersion: this._configuration.apiVersion || '2014-03-28'});
					}).then(() => {
						logger.info('The CloudWatchLogsProvider has started');

						this._started = true;

						return this._started;
					}).catch((e) => {
						logger.error('The CloudWatchLogsProvider failed to start', e);

						throw e;
					});
			}

			return this._startPromise;
		}

		/**
		 * Starts a query.
		 *
		 * @public
		 * @async
		 * @param {String} name - The name of log group to query.
		 * @param {String} query - The query string.
		 * @param {Number} startTime - The beginning of the time range to query. The number of seconds since January 1, 1970, 00:00:00 UTC.
		 * @param {Number} endTime - The end of the time range to query. The number of seconds since January 1, 1970, 00:00:00 UTC.
		 * @param {Number=} limit - The maximum number of log events to return.
		 * @returns {Promise<Object>}
		 */
		async startQuery(name, query, startTime, endTime, limit) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(name, 'name', String);
					assert.argumentIsRequired(query, 'query', String);
					assert.argumentIsRequired(startTime, 'startTime', Number);
					assert.argumentIsRequired(endTime, 'endTime', Number);
					assert.argumentIsOptional(limit, 'limit', Number);

					checkReady.call(this);

					return promise.build((resolve, reject) => {
						const params = {
							logGroupName: name,
							queryString: query,
							startTime: startTime,
							endTime: endTime,
							limit: limit
						};

						this._cloudWatchLogs.startQuery(params, (e, data) => {
							if (e) {
								logger.error(`Failed to start query on [ ${name} ]`);
								logger.error(e);

								reject(e);
							} else {
								logger.debug(`Started query on [ ${name} ]`);

								resolve(data);
							}
						});
					});
				});
		}

		/**
		 * Gets a result for query.
		 *
		 * @public
		 * @async
		 * @param {String} queryId - The identifier returned from {@link CloudWatchLogsProvider#startQuery}
		 * @returns {Promise<Object>}
		 */
		async getQueryResults(queryId) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(queryId, 'queryId', String);

					checkReady.call(this);

					return promise.build((resolve, reject) => {
						this._cloudWatchLogs.getQueryResults({queryId: queryId}, (e, data) => {
							if (e) {
								logger.error(e);

								reject(e);
							} else {
								resolve(data);
							}
						});
					});
				});
		}

		/**
		 * Lists the specified log groups by prefix.
		 *
		 * @public
		 * @async
		 * @param {String} logGroupNamePrefix
		 * @returns {Promise<Object>}
		 */
		async describeLogGroups(logGroupNamePrefix) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(logGroupNamePrefix, 'logGroupNamePrefix', String);

					checkReady.call(this);

					return promise.build((resolve, reject) => {
						this._cloudWatchLogs.describeLogGroups({logGroupNamePrefix: logGroupNamePrefix}, (e, data) => {
							if (e) {
								logger.error(e);

								reject(e);
							} else {
								resolve(data);
							}
						});
					});
				});
		}

		/**
		 * Lists all log groups.
		 *
		 * @public
		 * @async
		 * @param {Object} options
		 * @param {String} options.logGroupNamePrefix
		 * @param {String} options.nextToken
		 * @param {Number} options.limit
		 * @returns {Promise<Array>}
		 */
		async getLogGroups(options = {}) {
			return Promise.resolve()
				.then(() => {
					checkReady.call(this);

					assert.argumentIsRequired(options, 'options', Object);
					assert.argumentIsOptional(options.logGroupNamePrefix, 'options.logGroupNamePrefix', String);
					assert.argumentIsOptional(options.nextToken, 'options.nextToken', String);
					assert.argumentIsOptional(options.limit, 'options.limit', Number);

					let logGroups = [];

					const readLogGroups = (options) => {
						return promise.build((resolve, reject) => {
							return this._cloudWatchLogs.describeLogGroups(options, (e, data) => {
								if (e) {
									logger.error(e);

									reject(e);
								} else {
									if (data.logGroups) {
										logGroups = [ ...logGroups, ...data.logGroups ];
									}

									if (data.nextToken) {
										const newOptions = { ...options };

										newOptions.nextToken = data.nextToken;

										readLogGroups(newOptions).then(() => {
											resolve();
										});
									} else {
										return resolve();
									}
								}
							});
						});
					};

					return readLogGroups(options).then(() => {
						return logGroups;
					});
				});
		}

		/**
		 * Indicates if the log group has at least one log stream.
		 *
		 * @public
		 * @async
		 * @param {String} logGroupName
		 * @returns {Promise<Boolean>}
		 */
		async getLogStreamExists(logGroupName) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(logGroupName, 'logGroupName', String);

					checkReady.call(this);

					return describeLogStreams.call(this, logGroupName, 1)
						.then((results) => {
							return results.logStreams.length !== 0;
						}).catch((e) => {
							return false;
						});
				});
		}

		/**
		 * Lists all log streams by LogGroup name.
		 *
		 * @public
		 * @async
		 * @param {Object} options
		 * @param {String} options.logGroupName - The name of the log group.
		 * @param {String} options.logStreamNamePrefix - The log stream prefix to match.
		 * @param {String} options.orderBy - If the value is LogStreamName, the results are ordered by log stream name. If the value is LastEventTime, the results are ordered by the event time. The default value is LogStreamName.
		 * @param {Boolean} options.descending - If the value is true, results are returned in descending order. If the value is false, results are returned in ascending order. The default value is false.
		 * @param {Number} options.limit - The maximum number of items returned. If you don't specify a value, the default is up to 50 items.
		 * @returns {Promise<Array<Array>>}
		 */
		async getLogStreams(options) {
			return Promise.resolve()
				.then(() => {
					checkReady.call(this);

					assert.argumentIsRequired(options, 'options', Object);
					assert.argumentIsRequired(options.logGroupName, 'options.logGroupName', String);
					assert.argumentIsOptional(options.logStreamNamePrefix, 'options.logStreamNamePrefix', String);
					assert.argumentIsOptional(options.orderBy, 'options.orderBy', String);
					assert.argumentIsOptional(options.descending, 'options.descending', Boolean);
					assert.argumentIsOptional(options.nextToken, 'options.nextToken', String);
					assert.argumentIsOptional(options.limit, 'options.limit', Number);

					let logStreams = [];

					const readLogStreams = (options) => {
						return promise.build((resolve, reject) => {
							this._cloudWatchLogs.describeLogStreams(options, (e, data) => {
								if (e) {
									logger.error(e);

									reject(e);
								} else {
									if (data.logStreams && data.logStreams.length > 0) {
										logStreams.push(data.logStreams);
									}

									if (data.nextToken) {
										const newOptions = { ...options };

										newOptions.nextToken = data.nextToken;

										return this._scheduler.backoff(readLogStreams.bind(this, newOptions)).then(() => {
											resolve();
										});
									} else {
										return resolve();
									}
								}
							});
						});
					};

					return this._scheduler.backoff(readLogStreams.bind(this, options)).then(() => {
						return logStreams;
					});
				});
		}

		/**
		 * Deletes a log group
		 *
		 * @public
		 * @async
		 * @param {String} logGroupName - The name of the log group.
		 * @returns {Promise}
		 */
		async deleteLogGroup(logGroupName) {
			return Promise.resolve()
				.then(() => {
					checkReady.call(this);

					assert.argumentIsRequired(logGroupName, 'logGroupName', String);

					return promise.build((resolve, reject) => {
						this._cloudWatchLogs.deleteLogGroup({ logGroupName }, (e) => {
							if (e) {
								logger.error(e);

								reject(e);
							} else {
								resolve(true);
							}
						});
					});
				});
		}

		/**
		 * Deletes a log stream
		 *
		 * @public
		 * @async
		 * @param {String} logGroupName - The name of the log group.
		 * @param {String} logStreamName - The name of the log stream.
		 * @returns {Promise}
		 */
		async deleteLogStream(logGroupName, logStreamName) {
			return Promise.resolve()
				.then(() => {
					checkReady.call(this);

					assert.argumentIsRequired(logGroupName, 'logGroupName', String);
					assert.argumentIsRequired(logStreamName, 'logStreamName', String);

					return promise.build((resolve, reject) => {
						this._cloudWatchLogs.deleteLogStream({ logGroupName, logStreamName }, (e) => {
							if (e) {
								logger.error(e);

								reject(e);
							} else {
								resolve(true);
							}
						});
					});
				});
		}

		/**
		 * Creates tags for a log group
		 *
		 * @public
		 * @async
		 * @param {String} logGroupName - The name of the log group.
		 * @param {Object} tags - The key-value pairs to use for the tags.
		 * @returns {Promise}
		 */
		async tagLogGroup(logGroupName, tags) {
			return Promise.resolve()
				.then(() => {
					checkReady.call(this);

					assert.argumentIsRequired(logGroupName, 'logGroupName', String);
					assert.argumentIsRequired(tags, 'tags', Object);

					return promise.build((resolve, reject) => {
						this._cloudWatchLogs.tagLogGroup({ logGroupName, tags }, (e) => {
							if (e) {
								logger.error(e);

								reject(e);
							} else {
								resolve(true);
							}
						});
					});
				});
		}

		/**
		 * Deletes tags for a log group
		 *
		 * @public
		 * @async
		 * @param {String} logGroupName - The name of the log group.
		 * @param {Array<String>} tags - The tag keys. The corresponding tags are removed from the log group.
		 * @returns {Promise}
		 */
		async untagLogGroup(logGroupName, tags) {
			return Promise.resolve()
				.then(() => {
					checkReady.call(this);

					assert.argumentIsRequired(logGroupName, 'logGroupName', String);
					assert.argumentIsRequired(tags, 'tags', Array);

					return promise.build((resolve, reject) => {
						this._cloudWatchLogs.untagLogGroup({ logGroupName, tags }, (e) => {
							if (e) {
								logger.error(e);

								reject(e);
							} else {
								resolve(true);
							}
						});
					});
				});
		}

		/**
		 * Sets retention in days for a log group
		 *
		 * @public
		 * @async
		 * @param {String} logGroupName - The name of the log group.
		 * @param {Number} retentionInDays - The number of days to retain the log events in the specified log group. Possible values are: 1, 3, 5, 7, 14, 30, 60, 90, 120, 150, 180, 365, 400, 545, 731, 1827, and 3653.
		 * @returns {Promise}
		 */
		async putRetentionPolicy(logGroupName, retentionInDays) {
			return Promise.resolve()
				.then(() => {
					checkReady.call(this);

					assert.argumentIsRequired(logGroupName, 'logGroupName', String);
					assert.argumentIsRequired(retentionInDays, 'retentionInDays', Number);

					return promise.build((resolve, reject) => {
						this._cloudWatchLogs.putRetentionPolicy({ logGroupName, retentionInDays }, (e) => {
							if (e) {
								logger.error(e);

								reject(e);
							} else {
								resolve(true);
							}
						});
					});
				});
		}

		/**
		 * Deletes the specified retention policy.
		 *
		 * @public
		 * @async
		 * @param {String} logGroupName - The name of the log group.
		 * @returns {Promise}
		 */
		async deleteRetentionPolicy(logGroupName) {
			return Promise.resolve()
				.then(() => {
					checkReady.call(this);

					assert.argumentIsRequired(logGroupName, 'logGroupName', String);

					return promise.build((resolve, reject) => {
						this._cloudWatchLogs.deleteRetentionPolicy({ logGroupName }, (e) => {
							if (e) {
								logger.error(e);

								reject(e);
							} else {
								resolve(true);
							}
						});
					});
				});
		}

		_onDispose() {
			logger.debug('CloudWatchLogsProvider disposed');
		}

		toString() {
			return '[CloudWatchLogsProvider]';
		}
	}

	function checkReady() {
		if (this.disposed) {
			throw new Error('The CloudWatchLogsProvider has been disposed.');
		}

		if (!this._started) {
			throw new Error('The CloudWatchLogsProvider has not been started.');
		}
	}

	async function describeLogStreams(logGroupName, limit) {
		return promise.build((resolve, reject) => {
			const payload = {};

			payload.logGroupName = logGroupName;

			if (is.integer(limit)) {
				payload.limit = limit;
			}

			this._cloudWatchLogs.describeLogStreams(payload, (e, data) => {
				if (e) {
					logger.error(e);

					reject(e);
				} else {
					resolve(data);
				}
			});
		});
	}

	return CloudWatchLogsProvider;
})();
