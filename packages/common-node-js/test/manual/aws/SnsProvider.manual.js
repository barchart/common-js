import * as utils from '../utils/ManualTestUtils.js';

import SnsProvider from '../../../aws/SnsProvider.js';
import SqsProvider from '../../../aws/SqsProvider.js';

utils.run('SnsProvider manual test', async () => {
	const region = utils.region();
	const prefix = utils.prefix();

	const topicName = 'manual-topic';
	const directTopicName = 'manual-topic-direct';
	const queueName = 'sns-subscription-target';
	const qualifiedQueueName = `${prefix}-${queueName}`;

	const provider = new SnsProvider({ region, prefix });
	const sqsProvider = new SqsProvider({ region, prefix });

	let queueUrl = null;
	let subscription = null;
	let directTopicArn = null;

	const started = await provider.start();
	utils.assertEqual(started, true, 'SNS provider should start');

	const sqsStarted = await sqsProvider.start();
	utils.assertEqual(sqsStarted, true, 'SQS provider should start');

	console.log('Configuration:', provider.getConfiguration());
	utils.assertEqual(provider.getConfiguration().prefix, prefix, 'getConfiguration should return configured prefix');

	try {
		queueUrl = await utils.step('setup create SQS queue for subscribe', () => sqsProvider.getQueueUrl(queueName));
		utils.assertString(queueUrl, 'setup SQS queue should return QueueUrl');

		const queueArn = await utils.step('setup get SQS queue ARN', () => sqsProvider.getQueueArn(queueName));
		utils.assertString(queueArn, 'setup SQS queue should return QueueArn');

		const topicArn = await utils.step('getTopicArn/createTopic', () => provider.getTopicArn(topicName, { tags: { ManualTest: 'true' } }));
		utils.assert(topicArn.includes(`:${prefix}-${topicName}`), 'getTopicArn should return ARN for created topic');

		await utils.step('setup SQS policy for SNS delivery', () => sqsProvider.setQueuePolicy(queueName, SqsProvider.getPolicyForSnsDelivery(queueArn, topicArn)));

		subscription = await utils.step('subscribe', () => provider.subscribe(topicName, queueArn));
		utils.assertObject(subscription, 'subscribe should return Disposable');
		utils.assertEqual(typeof subscription.dispose, 'function', 'subscribe result should have dispose function');

		const subscriptions = await utils.step('getSubscriptions', () => provider.getSubscriptions());
		utils.assert(subscriptions.some(item => item.topicArn === topicArn && item.queueArn === queueArn), 'getSubscriptions should include created subscription');

		const topics = await utils.step('getTopics', () => provider.getTopics('-manual'));
		utils.assertIncludes(topics, topicArn, 'getTopics should include created topic ARN');

		await utils.step('publish', () => provider.publish(topicName, { source: 'SnsProvider.manual', createdAt: new Date().toISOString() }));

		const delivered = await utils.step('verify SNS delivery through SQS', async () => {
			const messages = await sqsProvider.receive(queueName, 10000, 1, true);

			utils.assert(messages.length === 1, 'SQS should receive one SNS notification');

			const envelope = messages[0];
			const message = JSON.parse(envelope.Message);

			return message;
		});
		utils.assertEqual(delivered.source, 'SnsProvider.manual', 'Published SNS payload should be delivered to SQS');

		directTopicArn = await utils.step('createTopic direct', () => provider.createTopic(directTopicName));
		utils.assert(directTopicArn.includes(`:${prefix}-${directTopicName}`), 'createTopic direct should return direct topic ARN');

		console.log('Primary topic ARN was:', topicArn);
	} finally {
		await utils.pauseBeforeCleanup(`Inspect SNS topics with prefix [ ${prefix} ] and SQS queue [ ${qualifiedQueueName} ], then press Enter to cleanup.`);

		if (subscription) {
			await utils.cleanup('unsubscribe disposable', () => subscription.dispose());
		}

		await utils.cleanup('deleteTopic', () => provider.deleteTopic(topicName));
		await utils.cleanup('deleteTopicArn', () => directTopicArn ? provider.deleteTopicArn(directTopicArn) : Promise.resolve());
		await utils.cleanup('delete SQS queue', () => queueUrl ? sqsProvider.deleteQueue(queueName) : Promise.resolve());
	}
});
