import * as assert from '@barchart/common-js/lang/assert.js';
import * as utils from '../utils/InteractiveTestUtils.js';

import SnsProvider from '../../../aws/SnsProvider.js';
import SqsProvider from '../../../aws/SqsProvider.js';

utils.run('SnsProvider interactive test', async () => {
	const region = utils.region();
	const prefix = utils.prefix();

	const topicName = 'interactive-topic';
	const directTopicName = 'interactive-topic-direct';
	const queueName = 'sns-subscription-target';
	const qualifiedQueueName = `${prefix}-${queueName}`;

	const provider = new SnsProvider({ region, prefix });
	const sqsProvider = new SqsProvider({ region, prefix });

	let queueUrl = null;
	let subscription = null;
	let directTopicArn = null;

	const started = await provider.start();
	assert.areEqual(started, true, 'SNS provider should start');

	const sqsStarted = await sqsProvider.start();
	assert.areEqual(sqsStarted, true, 'SQS provider should start');

	console.log('Configuration:', provider.getConfiguration());
	assert.areEqual(provider.getConfiguration().prefix, prefix, 'getConfiguration should return configured prefix');

	try {
		queueUrl = await utils.step('setup create SQS queue for subscribe', () => sqsProvider.getQueueUrl(queueName));
		assert.argumentIsValid(queueUrl, 'value', value => typeof value === 'string' && value.length > 0, 'setup SQS queue should return QueueUrl');

		const queueArn = await utils.step('setup get SQS queue ARN', () => sqsProvider.getQueueArn(queueName));
		assert.argumentIsValid(queueArn, 'value', value => typeof value === 'string' && value.length > 0, 'setup SQS queue should return QueueArn');

		const topicArn = await utils.step('getTopicArn/createTopic', () => provider.getTopicArn(topicName, { tags: { interactiveTest: 'true' } }));
		assert.argumentIsValid(topicArn.includes(`:${prefix}-${topicName}`), 'condition', value => value === true, 'getTopicArn should return ARN for created topic');

		await utils.step('setup SQS policy for SNS delivery', () => sqsProvider.setQueuePolicy(queueName, SqsProvider.getPolicyForSnsDelivery(queueArn, topicArn)));

		subscription = await utils.step('subscribe', () => provider.subscribe(topicName, queueArn));
		assert.argumentIsValid(subscription, 'value', value => value !== null && typeof value === 'object' && !Array.isArray(value), 'subscribe should return Disposable');
		assert.areEqual(typeof subscription.dispose, 'function', 'subscribe result should have dispose function');

		const subscriptions = await utils.step('getSubscriptions', () => provider.getSubscriptions());
		assert.argumentIsValid(subscriptions.some(item => item.topicArn === topicArn && item.queueArn === queueArn), 'condition', value => value === true, 'getSubscriptions should include created subscription');

		const topics = await utils.step('getTopics', () => provider.getTopics('-interactive'));
		assert.argumentIsValid(topics, 'values', value => Array.isArray(value) && value.includes(topicArn), 'getTopics should include created topic ARN');

		await utils.step('publish', () => provider.publish(topicName, { source: 'SnsProvider.interactive', createdAt: new Date().toISOString() }));

		const delivered = await utils.step('verify SNS delivery through SQS', async () => {
			const messages = await sqsProvider.receive(queueName, 10000, 1, true);

			assert.argumentIsValid(messages.length === 1, 'condition', value => value === true, 'SQS should receive one SNS notification');

			const envelope = messages[0];
			const message = JSON.parse(envelope.Message);

			return message;
		});
		assert.areEqual(delivered.source, 'SnsProvider.interactive', 'Published SNS payload should be delivered to SQS');

		directTopicArn = await utils.step('createTopic direct', () => provider.createTopic(directTopicName));
		assert.argumentIsValid(directTopicArn.includes(`:${prefix}-${directTopicName}`), 'condition', value => value === true, 'createTopic direct should return direct topic ARN');

		console.log('Primary topic ARN was:', topicArn);
	} finally {
		await utils.pauseBeforeCleanup(`Inspect SNS topics with prefix [ ${prefix} ] and SQS queue [ ${qualifiedQueueName} ], then press Enter to cleanup.`);

		if (subscription) {
			await utils.cleanup('unsubscribe disposable', () => subscription.dispose());
		}

		await utils.cleanup('deleteTopic', () => provider.deleteTopic(topicName));

		await utils.cleanup('deleteTopicArn', async () => {
			if (directTopicArn) {
				await provider.deleteTopicArn(directTopicArn);
			}
		});

		await utils.cleanup('delete SQS queue', async () => {
			if (queueUrl) {
				await sqsProvider.deleteQueue(queueName);
			}
		});
	}
});
