import * as assert from '@barchart/common-js/lang/assert.js';
import * as utils from '../utils/InteractiveTestUtils.js';

import SqsProvider from '../../../aws/SqsProvider.js';

utils.run('SqsProvider interactive test', async () => {
	const region = utils.region();
	const prefix = utils.prefix();

	const queueName = 'interactive-queue';
	const queueNameByUrl = 'interactive-queue-url';
	const observeQueueName = 'interactive-observe-queue';

	const provider = new SqsProvider({ prefix }, { region });

	let queueUrl = null;
	let queueUrlByUrl = null;
	let observeDisposable = null;

	const started = await provider.start();
	assert.areEqual(started, true, 'SQS provider should start');

	console.log('Configuration:', provider.getConfiguration());
	assert.areEqual(provider.getConfiguration().prefix, prefix, 'getConfiguration should return configured prefix');

	try {
		queueUrl = await utils.step('getQueueUrl/createQueue', () => provider.getQueueUrl(queueName, { retentionTime: 120, tags: { interactiveTest: 'true' } }));
		assert.argumentIsValid(queueUrl, 'value', value => typeof value === 'string' && value.length > 0, 'getQueueUrl should return QueueUrl');

		const queues = await utils.step('getQueues', () => provider.getQueues('-interactive'));
		assert.argumentIsValid(queues, 'values', value => Array.isArray(value) && value.includes(queueUrl), 'getQueues should include created queue URL');

		const queueAttributes = await utils.step('getQueueAttributes', () => provider.getQueueAttributes(queueUrl));
		assert.argumentIsValid(queueAttributes.QueueArn, 'value', value => typeof value === 'string' && value.length > 0, 'getQueueAttributes should include QueueArn');

		const queueArn = await utils.step('getQueueArn', () => provider.getQueueArn(queueName));
		assert.areEqual(queueArn, queueAttributes.QueueArn, 'getQueueArn should match QueueArn attribute');

		console.log('Generated SNS policy:', SqsProvider.getPolicyForSnsDelivery(queueArn, `arn:aws:sns:${region}:000000000000:interactive-topic`));

		await utils.step('setQueuePolicy', () => provider.setQueuePolicy(queueName, SqsProvider.getPolicyForSnsDelivery(queueArn, `arn:aws:sns:${region}:000000000000:interactive-topic`)));
		await utils.step('send', () => provider.send(queueName, { type: 'single', createdAt: new Date().toISOString() }));

		const received = await utils.step('receive', () => provider.receive(queueName, 0, 1, true));

		assert.areEqual(received.length, 1, 'receive should return one message');
		assert.areEqual(received[0].type, 'single', 'receive should return sent message payload');

		await utils.step('sendBatch', () => provider.sendBatch(queueName, [{ type: 'batch-1' }, { type: 'batch-2' }]));

		const drained = await utils.step('drain', () => provider.drain(queueName, message => ({ mapped: true, message }), true, 10));

		assert.argumentIsValid(drained.some(item => item.message.type === 'batch-1'), 'condition', value => value === true, 'drain should include first batch message');
		assert.argumentIsValid(drained.some(item => item.message.type === 'batch-2'), 'condition', value => value === true, 'drain should include second batch message');

		const purged = await utils.step('purge', () => provider.purge(queueName));
		assert.areEqual(purged, true, 'purge should return true');

		queueUrlByUrl = await utils.step('createQueue direct', () => provider.createQueue(queueNameByUrl, 120));
		assert.argumentIsValid(queueUrlByUrl, 'value', value => typeof value === 'string' && value.length > 0, 'createQueue should return QueueUrl');

		const observed = await utils.step('observe', () => new Promise((resolve, reject) => {
			const timeout = setTimeout(() => reject(new Error('Timed out waiting for observed message')), 30000);

			observeDisposable = provider.observe(observeQueueName, (message) => {
				clearTimeout(timeout);

				resolve(message);
			}, 500, 0, 1, { retentionTime: 120 });

			(async () => {
				try {
					await provider.send(observeQueueName, { type: 'observed', createdAt: new Date().toISOString() });
				} catch (error) {
					reject(error);
				}
			})();
		}));

		assert.areEqual(observed.type, 'observed', 'observe should receive sent message');

		if (observeDisposable) {
			observeDisposable.dispose();
			observeDisposable = null;
		}

	} finally {
		await utils.pauseBeforeCleanup(`Inspect SQS queues with prefix [ ${prefix} ], then press Enter to cleanup.`);

		if (observeDisposable) {
			observeDisposable.dispose();
		}

		await utils.cleanup('deleteQueue cleanup', () => provider.deleteQueue(queueName));

		await utils.cleanup('deleteQueueUrl cleanup', async () => {
			if (queueUrlByUrl) {
				await provider.deleteQueueUrl(queueUrlByUrl);
			}
		});

		await utils.cleanup('delete observed queue cleanup', () => provider.deleteQueue(observeQueueName));
	}
});
