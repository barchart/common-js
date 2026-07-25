import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';

import Disposable from '@barchart/common-js/lang/Disposable.js';
import Scheduler from '@barchart/common-js/timing/Scheduler.js';

import AwsOptions from './AwsOptions.js';

import { CloudWatchLogsClient, DeleteLogGroupCommand, DeleteLogStreamCommand, DeleteRetentionPolicyCommand, DescribeLogGroupsCommand, DescribeLogStreamsCommand, GetQueryResultsCommand, PutRetentionPolicyCommand, StartQueryCommand, TagResourceCommand, UntagResourceCommand } from '@aws-sdk/client-cloudwatch-logs';

import log4js from 'log4js';

const logger = log4js.getLogger('common-node/aws/CloudWatchLogsProvider');

/**
 * AWS SDK client configuration for the CloudWatch Logs provider.
 *
 * @typedef {import('@aws-sdk/client-cloudwatch-logs').CloudWatchLogsClientConfig} CloudWatchLogsProviderOptions
 */

/**
 * A facade for Amazon's CloudWatchLogs Service. The constructor
 * accepts configuration options. The promise-based instance functions
 * abstract knowledge of the AWS API.
 *
 * @public
 * @extends {Disposable}
 */
export default class CloudWatchLogsProvider extends Disposable {
	#cloudWatchLogs;

	#options;

	#scheduler;

	#startPromise;
	#started;

	/**
	 * @param {CloudWatchLogsProviderOptions=} options - The AWS SDK client configuration.
	 */
	constructor(options) {
		super();

		assert.argumentIsOptional(options, 'options', Object);

		this.#cloudWatchLogs = null;

		this.#options = { ...AwsOptions.instance.options, ...options };

		this.#scheduler = new Scheduler();

		this.#startPromise = null;
		this.#started = false;
	}

	/**
	 * Connects to Amazon. Must be called once before using other instance
	 * functions.
	 *
	 * @public
	 * @async
	 * @returns {Promise<boolean>}
	 */
	async start() {
		if (this.disposed) {
			throw 'Unable to start, the CloudWatchLogsProvider has been disposed.';
		}

		if (this.#startPromise === null) {
			this.#startPromise = (async () => {
				try {
					this.#cloudWatchLogs = new CloudWatchLogsClient(this.#options);

					logger.info('The CloudWatchLogsProvider has started');

					this.#started = true;

					return this.#started;
				} catch (e) {
					logger.error('The CloudWatchLogsProvider failed to start', e);

					throw e;
				}
			})();
		}

		return this.#startPromise;
	}

	/**
	 * Starts a query.
	 *
	 * @public
	 * @async
	 * @param {string} name - The name of log group to query.
	 * @param {string} query - The query string.
	 * @param {number} startTime - The beginning of the time range to query. The number of seconds since January 1, 1970, 00:00:00 UTC.
	 * @param {number} endTime - The end of the time range to query. The number of seconds since January 1, 1970, 00:00:00 UTC.
	 * @param {number=} limit - The maximum number of log events to return.
	 * @returns {Promise<object>}
	 */
	async startQuery(name, query, startTime, endTime, limit) {
		assert.argumentIsRequired(name, 'name', String);
		assert.argumentIsRequired(query, 'query', String);
		assert.argumentIsRequired(startTime, 'startTime', Number);
		assert.argumentIsRequired(endTime, 'endTime', Number);
		assert.argumentIsOptional(limit, 'limit', Number);

		this.#checkReady();

		const params = {
			logGroupName: name,
			queryString: query,
			startTime: startTime,
			endTime: endTime,
			limit: limit
		};

		try {
			const data = await this.#cloudWatchLogs.send(new StartQueryCommand(params));

			logger.debug(`Started query on [ ${name} ]`);

			return data;
		} catch (e) {
			logger.error(`Failed to start query on [ ${name} ]`);
			logger.error(e);

			throw e;
		}
	}

	/**
	 * Gets a result for query.
	 *
	 * @public
	 * @async
	 * @param {string} queryId - The identifier returned from {@link CloudWatchLogsProvider#startQuery}
	 * @returns {Promise<object>}
	 */
	async getQueryResults(queryId) {
		assert.argumentIsRequired(queryId, 'queryId', String);

		this.#checkReady();

		try {
			return await this.#cloudWatchLogs.send(new GetQueryResultsCommand({queryId: queryId}));
		} catch (e) {
			logger.error(e);

			throw e;
		}
	}

	/**
	 * Lists the specified log groups by prefix.
	 *
	 * @public
	 * @async
	 * @param {string} logGroupNamePrefix
	 * @returns {Promise<object>}
	 */
	async describeLogGroups(logGroupNamePrefix) {
		assert.argumentIsRequired(logGroupNamePrefix, 'logGroupNamePrefix', String);

		this.#checkReady();

		try {
			return await this.#cloudWatchLogs.send(new DescribeLogGroupsCommand({ logGroupNamePrefix: logGroupNamePrefix }));
		} catch (e) {
			logger.error(e);

			throw e;
		}
	}

	/**
	 * Lists all log groups.
	 *
	 * @public
	 * @async
	 * @param {object} options
	 * @param {string} options.logGroupNamePrefix
	 * @param {string} options.nextToken
	 * @param {number} options.limit
	 * @returns {Promise<Array>}
	 */
	async getLogGroups(options = {}) {
		this.#checkReady();

		assert.argumentIsRequired(options, 'options', Object);
		assert.argumentIsOptional(options.logGroupNamePrefix, 'options.logGroupNamePrefix', String);
		assert.argumentIsOptional(options.nextToken, 'options.nextToken', String);
		assert.argumentIsOptional(options.limit, 'options.limit', Number);

		let logGroups = [];

		const readLogGroups = async (options) => {
			try {
				const data = await this.#cloudWatchLogs.send(new DescribeLogGroupsCommand(options));

				if (data.logGroups) {
					logGroups = [ ...logGroups, ...data.logGroups ];
				}

				if (data.nextToken) {
					const newOptions = { ...options };

					newOptions.nextToken = data.nextToken;

					await readLogGroups(newOptions);
				}
			} catch (e) {
				logger.error(e);

				throw e;
			}
		};

		await readLogGroups(options);

		return logGroups;
	}

	/**
	 * Indicates if the log group has at least one log stream.
	 *
	 * @public
	 * @async
	 * @param {string} logGroupName
	 * @returns {Promise<boolean>}
	 */
	async getLogStreamExists(logGroupName) {
		assert.argumentIsRequired(logGroupName, 'logGroupName', String);

		this.#checkReady();

		try {
			const results = await this.#describeLogStreams(logGroupName, 1);

			return results.logStreams.length !== 0;
		} catch (e) {
			return false;
		}
	}

	/**
	 * Lists all log streams by LogGroup name.
	 *
	 * @public
	 * @async
	 * @param {object} options
	 * @param {string} options.logGroupName - The name of the log group.
	 * @param {string} options.logStreamNamePrefix - The log stream prefix to match.
	 * @param {string} options.orderBy - If the value is LogStreamName, the results are ordered by log stream name. If the value is LastEventTime, the results are ordered by the event time. The default value is LogStreamName.
	 * @param {boolean} options.descending - If the value is true, results are returned in descending order. If the value is false, results are returned in ascending order. The default value is false.
	 * @param {string} options.nextToken - The token for the next set of items to return.
	 * @param {number} options.limit - The maximum number of items returned. If you don't specify a value, the default is up to 50 items.
	 * @returns {Promise<Array<Array>>}
	 */
	async getLogStreams(options) {
		this.#checkReady();

		assert.argumentIsRequired(options, 'options', Object);
		assert.argumentIsRequired(options.logGroupName, 'options.logGroupName', String);
		assert.argumentIsOptional(options.logStreamNamePrefix, 'options.logStreamNamePrefix', String);
		assert.argumentIsOptional(options.orderBy, 'options.orderBy', String);
		assert.argumentIsOptional(options.descending, 'options.descending', Boolean);
		assert.argumentIsOptional(options.nextToken, 'options.nextToken', String);
		assert.argumentIsOptional(options.limit, 'options.limit', Number);

		let logStreams = [];

		const readLogStreams = async (options) => {
			try {
				const data = await this.#cloudWatchLogs.send(new DescribeLogStreamsCommand(options));

				if (data.logStreams && data.logStreams.length > 0) {
					logStreams.push(data.logStreams);
				}

				if (data.nextToken) {
					const newOptions = { ...options };

					newOptions.nextToken = data.nextToken;

					await this.#scheduler.backoff(readLogStreams.bind(this, newOptions));
				}
			} catch (e) {
				logger.error(e);

				throw e;
			}
		};

		await this.#scheduler.backoff(readLogStreams.bind(this, options));

		return logStreams;
	}

	/**
	 * Deletes a log group
	 *
	 * @public
	 * @async
	 * @param {string} logGroupName - The name of the log group.
	 * @returns {Promise}
	 */
	async deleteLogGroup(logGroupName) {
		this.#checkReady();

		assert.argumentIsRequired(logGroupName, 'logGroupName', String);

		try {
			await this.#cloudWatchLogs.send(new DeleteLogGroupCommand({ logGroupName }));

			return true;
		} catch (e) {
			logger.error(e);

			throw e;
		}
	}

	/**
	 * Deletes a log stream
	 *
	 * @public
	 * @async
	 * @param {string} logGroupName - The name of the log group.
	 * @param {string} logStreamName - The name of the log stream.
	 * @returns {Promise}
	 */
	async deleteLogStream(logGroupName, logStreamName) {
		this.#checkReady();

		assert.argumentIsRequired(logGroupName, 'logGroupName', String);
		assert.argumentIsRequired(logStreamName, 'logStreamName', String);

		try {
			await this.#cloudWatchLogs.send(new DeleteLogStreamCommand({ logGroupName, logStreamName }));

			return true;
		} catch (e) {
			logger.error(e);

			throw e;
		}
	}

	/**
	 * Creates tags for a CloudWatch Logs resource.
	 *
	 * @public
	 * @async
	 * @param {string} resourceArn - The ARN of the CloudWatch Logs resource.
	 * @param {object} tags - The key-value pairs to use for the tags.
	 * @returns {Promise}
	 */
	async tagResource(resourceArn, tags) {
		this.#checkReady();

		assert.argumentIsRequired(resourceArn, 'resourceArn', String);
		assert.argumentIsRequired(tags, 'tags', Object);

		try {
			await this.#cloudWatchLogs.send(new TagResourceCommand({ resourceArn, tags }));

			return true;
		} catch (e) {
			logger.error(e);

			throw e;
		}
	}

	/**
	 * Deletes tags for a CloudWatch Logs resource.
	 *
	 * @public
	 * @async
	 * @param {string} resourceArn - The ARN of the CloudWatch Logs resource.
	 * @param {Array<string>} tagKeys - The tag keys. The corresponding tags are removed from the resource.
	 * @returns {Promise}
	 */
	async untagResource(resourceArn, tagKeys) {
		this.#checkReady();

		assert.argumentIsRequired(resourceArn, 'resourceArn', String);
		assert.argumentIsRequired(tagKeys, 'tagKeys', Array);

		try {
			await this.#cloudWatchLogs.send(new UntagResourceCommand({ resourceArn, tagKeys }));

			return true;
		} catch (e) {
			logger.error(e);

			throw e;
		}
	}

	/**
	 * Sets retention in days for a log group
	 *
	 * @public
	 * @async
	 * @param {string} logGroupName - The name of the log group.
	 * @param {number} retentionInDays - The number of days to retain the log events in the specified log group. Possible values are: 1, 3, 5, 7, 14, 30, 60, 90, 120, 150, 180, 365, 400, 545, 731, 1827, and 3653.
	 * @returns {Promise}
	 */
	async putRetentionPolicy(logGroupName, retentionInDays) {
		this.#checkReady();

		assert.argumentIsRequired(logGroupName, 'logGroupName', String);
		assert.argumentIsRequired(retentionInDays, 'retentionInDays', Number);

		try {
			await this.#cloudWatchLogs.send(new PutRetentionPolicyCommand({ logGroupName, retentionInDays }));

			return true;
		} catch (e) {
			logger.error(e);

			throw e;
		}
	}

	/**
	 * Deletes the specified retention policy.
	 *
	 * @public
	 * @async
	 * @param {string} logGroupName - The name of the log group.
	 * @returns {Promise}
	 */
	async deleteRetentionPolicy(logGroupName) {
		this.#checkReady();

		assert.argumentIsRequired(logGroupName, 'logGroupName', String);

		try {
			await this.#cloudWatchLogs.send(new DeleteRetentionPolicyCommand({ logGroupName }));

			return true;
		} catch (e) {
			logger.error(e);

			throw e;
		}
	}

	/**
	 * @protected
	 * @override
	 */
	_onDispose() {
		logger.debug('CloudWatchLogsProvider disposed');
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[CloudWatchLogsProvider]';
	}

	#checkReady() {
		if (this.disposed) {
			throw new Error('The CloudWatchLogsProvider has been disposed.');
			}

			if (!this.#started) {
				throw new Error('The CloudWatchLogsProvider has not been started.');
			}
		}

	async #describeLogStreams(logGroupName, limit) {
		const payload = { };

		payload.logGroupName = logGroupName;

		if (is.integer(limit)) {
			payload.limit = limit;
			}

			try {
				return await this.#cloudWatchLogs.send(new DescribeLogStreamsCommand(payload));
			} catch (e) {
				logger.error(e);

				throw e;
			}
		}
}
