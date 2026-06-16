import * as utils from '../utils/ManualTestUtils.js';

import CloudWatchLogsProvider from '../../../aws/CloudWatchLogsProvider.js';

import { CloudWatchLogsClient, CreateLogGroupCommand, CreateLogStreamCommand, ListTagsForResourceCommand, PutLogEventsCommand } from '@aws-sdk/client-cloudwatch-logs';

utils.run('CloudWatchLogsProvider manual test', async () => {
	const region = utils.region();

	const name = utils.env('CLOUDWATCH_LOG_GROUP_NAME', `/common-node-js/manual-${Date.now()}`);
	const streamName = utils.env('CLOUDWATCH_LOG_STREAM_NAME', `stream-${Date.now()}`);

	const client = new CloudWatchLogsClient({ region });
	const provider = new CloudWatchLogsProvider({ region });

	const started = await provider.start();
	utils.assertEqual(started, true, 'CloudWatch Logs provider should start');

	try {
		const createLogGroupResponse = await utils.step('setup create log group', () => client.send(new CreateLogGroupCommand({ logGroupName: name })));
		utils.assertObject(createLogGroupResponse, 'CreateLogGroup should return an AWS response object');

		const createLogStreamResponse = await utils.step('setup create log stream', () => client.send(new CreateLogStreamCommand({ logGroupName: name, logStreamName: streamName })));
		utils.assertObject(createLogStreamResponse, 'CreateLogStream should return an AWS response object');

		const putLogEventResponse = await utils.step('setup put log event', () => client.send(new PutLogEventsCommand({
			logGroupName: name,
			logStreamName: streamName,
			logEvents: [{ timestamp: Date.now(), message: 'CloudWatchLogsProvider.manual' }]
		})));
		utils.assertObject(putLogEventResponse, 'PutLogEvents should return an AWS response object');

		const described = await utils.step('describeLogGroups', () => provider.describeLogGroups(name));
		utils.assert(described.logGroups.some(logGroup => logGroup.logGroupName === name), 'describeLogGroups should include created log group');

		const groups = await utils.step('getLogGroups', () => provider.getLogGroups({ logGroupNamePrefix: name }));
		const logGroup = groups.find(logGroup => logGroup.logGroupName === name);

		utils.assertObject(logGroup, 'getLogGroups should include created log group');

		const logGroupArn = logGroup.logGroupArn || (logGroup.arn ? logGroup.arn.replace(/:\*$/, '') : null);

		utils.assertString(logGroupArn, 'getLogGroups should return a log group ARN');

		const exists = await utils.step('getLogStreamExists', () => provider.getLogStreamExists(name));
		utils.assertEqual(exists, true, 'getLogStreamExists should find the created stream');

		const streams = await utils.step('getLogStreams', () => provider.getLogStreams({ logGroupName: name, logStreamNamePrefix: streamName }));
		utils.assert(streams.flat().some(stream => stream.logStreamName === streamName), 'getLogStreams should include created stream');

		utils.assertEqual(await utils.step('tagResource', () => provider.tagResource(logGroupArn, { ManualTest: 'true' })), true, 'tagResource should return true');

		const tagsAfterTag = await utils.step('verify tagResource', () => client.send(new ListTagsForResourceCommand({ resourceArn: logGroupArn })));
		utils.assertEqual(tagsAfterTag.tags.ManualTest, 'true', 'tagResource should create ManualTest tag');

		utils.assertEqual(await utils.step('untagResource', () => provider.untagResource(logGroupArn, ['ManualTest'])), true, 'untagResource should return true');

		const tagsAfterUntag = await utils.step('verify untagResource', () => client.send(new ListTagsForResourceCommand({ resourceArn: logGroupArn })));
		utils.assert(tagsAfterUntag.tags.ManualTest === undefined, 'untagResource should remove ManualTest tag');

		utils.assertEqual(await utils.step('putRetentionPolicy', () => provider.putRetentionPolicy(name, 1)), true, 'putRetentionPolicy should return true');
		utils.assertEqual(await utils.step('deleteRetentionPolicy', () => provider.deleteRetentionPolicy(name)), true, 'deleteRetentionPolicy should return true');

		const query = await utils.step('startQuery', () => provider.startQuery(name, 'fields @timestamp, @message | limit 1', Math.floor((Date.now() - 60000) / 1000), Math.floor((Date.now() + 60000) / 1000), 1));
		utils.assertString(query.queryId, 'startQuery should return a queryId');

		const queryResults = await utils.step('getQueryResults', () => provider.getQueryResults(query.queryId));
		utils.assertString(queryResults.status, 'getQueryResults should return query status');

	} finally {
		await utils.pauseBeforeCleanup(`Inspect CloudWatch log group [ ${name} ], then press Enter to cleanup.`);

		await utils.cleanup('deleteLogStream', async () => {
			utils.assertEqual(await provider.deleteLogStream(name, streamName), true, 'deleteLogStream should return true');
		});

		await utils.cleanup('deleteLogGroup', () => provider.deleteLogGroup(name));
	}
});
