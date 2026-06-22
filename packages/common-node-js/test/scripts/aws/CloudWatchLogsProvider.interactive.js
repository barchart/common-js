import * as assert from '@barchart/common-js/lang/assert.js';
import * as utils from '../utils/InteractiveTestUtils.js';

import CloudWatchLogsProvider from '../../../aws/CloudWatchLogsProvider.js';

import { CloudWatchLogsClient, CreateLogGroupCommand, CreateLogStreamCommand, ListTagsForResourceCommand, PutLogEventsCommand } from '@aws-sdk/client-cloudwatch-logs';

utils.run('CloudWatchLogsProvider interactive test', async () => {
	const region = utils.region();

	const name = utils.env('CLOUDWATCH_LOG_GROUP_NAME', `/common-node-js/interactive-${Date.now()}`);
	const streamName = utils.env('CLOUDWATCH_LOG_STREAM_NAME', `stream-${Date.now()}`);

	const client = new CloudWatchLogsClient({ region });
	const provider = new CloudWatchLogsProvider({ region });

	const started = await provider.start();
	assert.areEqual(started, true, 'CloudWatch Logs provider should start');

	try {
		const createLogGroupResponse = await utils.step('setup create log group', () => client.send(new CreateLogGroupCommand({ logGroupName: name })));
		assert.argumentIsValid(createLogGroupResponse, 'value', value => value !== null && typeof value === 'object' && !Array.isArray(value), 'CreateLogGroup should return an AWS response object');

		const createLogStreamResponse = await utils.step('setup create log stream', () => client.send(new CreateLogStreamCommand({ logGroupName: name, logStreamName: streamName })));
		assert.argumentIsValid(createLogStreamResponse, 'value', value => value !== null && typeof value === 'object' && !Array.isArray(value), 'CreateLogStream should return an AWS response object');

		const putLogEventResponse = await utils.step('setup put log event', () => client.send(new PutLogEventsCommand({
			logGroupName: name,
			logStreamName: streamName,
			logEvents: [{ timestamp: Date.now(), message: 'CloudWatchLogsProvider.interactive' }]
		})));
		assert.argumentIsValid(putLogEventResponse, 'value', value => value !== null && typeof value === 'object' && !Array.isArray(value), 'PutLogEvents should return an AWS response object');

		const described = await utils.step('describeLogGroups', () => provider.describeLogGroups(name));
		assert.argumentIsValid(described.logGroups.some(logGroup => logGroup.logGroupName === name), 'condition', value => value === true, 'describeLogGroups should include created log group');

		const groups = await utils.step('getLogGroups', () => provider.getLogGroups({ logGroupNamePrefix: name }));
		const logGroup = groups.find(logGroup => logGroup.logGroupName === name);

		assert.argumentIsValid(logGroup, 'value', value => value !== null && typeof value === 'object' && !Array.isArray(value), 'getLogGroups should include created log group');

		const logGroupArn = logGroup.logGroupArn || (logGroup.arn ? logGroup.arn.replace(/:\*$/, '') : null);

		assert.argumentIsValid(logGroupArn, 'value', value => typeof value === 'string' && value.length > 0, 'getLogGroups should return a log group ARN');

		const exists = await utils.step('getLogStreamExists', () => provider.getLogStreamExists(name));
		assert.areEqual(exists, true, 'getLogStreamExists should find the created stream');

		const streams = await utils.step('getLogStreams', () => provider.getLogStreams({ logGroupName: name, logStreamNamePrefix: streamName }));
		assert.argumentIsValid(streams.flat().some(stream => stream.logStreamName === streamName), 'condition', value => value === true, 'getLogStreams should include created stream');

		assert.areEqual(await utils.step('tagResource', () => provider.tagResource(logGroupArn, { interactiveTest: 'true' })), true, 'tagResource should return true');

		const tagsAfterTag = await utils.step('verify tagResource', () => client.send(new ListTagsForResourceCommand({ resourceArn: logGroupArn })));
		assert.areEqual(tagsAfterTag.tags.interactiveTest, 'true', 'tagResource should create interactiveTest tag');

		assert.areEqual(await utils.step('untagResource', () => provider.untagResource(logGroupArn, ['interactiveTest'])), true, 'untagResource should return true');

		const tagsAfterUntag = await utils.step('verify untagResource', () => client.send(new ListTagsForResourceCommand({ resourceArn: logGroupArn })));
		assert.argumentIsValid(tagsAfterUntag.tags.interactiveTest === undefined, 'condition', value => value === true, 'untagResource should remove interactiveTest tag');

		assert.areEqual(await utils.step('putRetentionPolicy', () => provider.putRetentionPolicy(name, 1)), true, 'putRetentionPolicy should return true');
		assert.areEqual(await utils.step('deleteRetentionPolicy', () => provider.deleteRetentionPolicy(name)), true, 'deleteRetentionPolicy should return true');

		const query = await utils.step('startQuery', () => provider.startQuery(name, 'fields @timestamp, @message | limit 1', Math.floor((Date.now() - 60000) / 1000), Math.floor((Date.now() + 60000) / 1000), 1));
		assert.argumentIsValid(query.queryId, 'value', value => typeof value === 'string' && value.length > 0, 'startQuery should return a queryId');

		const queryResults = await utils.step('getQueryResults', () => provider.getQueryResults(query.queryId));
		assert.argumentIsValid(queryResults.status, 'value', value => typeof value === 'string' && value.length > 0, 'getQueryResults should return query status');

	} finally {
		await utils.pauseBeforeCleanup(`Inspect CloudWatch log group [ ${name} ], then press Enter to cleanup.`);

		await utils.cleanup('deleteLogStream', async () => {
			assert.areEqual(await provider.deleteLogStream(name, streamName), true, 'deleteLogStream should return true');
		});

		await utils.cleanup('deleteLogGroup', () => provider.deleteLogGroup(name));
	}
});
