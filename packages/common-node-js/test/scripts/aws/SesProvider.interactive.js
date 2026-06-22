import * as assert from '@barchart/common-js/lang/assert.js';
import * as utils from '../utils/InteractiveTestUtils.js';

import SesProvider from '../../../aws/SesProvider.js';

utils.run('SesProvider interactive test', async () => {
	const senderAddress = utils.requireEnv('SES_TEST_SENDER');
	const recipientAddress = utils.requireEnv('SES_TEST_RECIPIENT');
	const suppressionEmail = utils.env('SES_TEST_SUPPRESSION_EMAIL', recipientAddress);

	const provider = new SesProvider({ region: utils.region(), rateLimitPerSecond: 2 });
	let suppressionAdded = false;

	await utils.step('start', () => provider.start());

	console.log('Configuration:', provider.getConfiguration());
	assert.areEqual(provider.getConfiguration().region, utils.region(), 'getConfiguration should return configured region');

	try {
		await utils.step('sendEmail', () => provider.sendEmail(senderAddress, recipientAddress, 'SesProvider interactive sendEmail', '<b>Hello</b>', 'Hello', [
			{ filename: 'interactive-test.txt', content: 'interactive SES attachment', contentType: 'text/plain' }
		], { 'X-interactive-Test': 'SesProvider' }));

		await utils.step('send', () => provider.send({
			senderAddress,
			recipientAddress,
			subject: 'SesProvider interactive send',
			htmlBody: '<p>Hello from send()</p>',
			textBody: 'Hello from send()'
		}));

		const suppressedItems = await utils.step('getSuppressedItems', () => provider.getSuppressedItems());
		assert.argumentIsValid(suppressedItems, 'value', Array.isArray, 'getSuppressedItems should return an array');

		const added = await utils.step('addSuppressedItem', () => provider.addSuppressedItem(suppressionEmail));
		suppressionAdded = true;
		assert.areEqual(added.email, suppressionEmail, 'addSuppressedItem should return added email');

		const item = await utils.step('getSuppressedItem', () => provider.getSuppressedItem(suppressionEmail));
		assert.areEqual(item.email, suppressionEmail, 'getSuppressedItem should return suppressed email');

		const streamCount = await utils.step('getSuppressedItemStream', () => new Promise((resolve, reject) => {
			let count = 0;

			const stream = provider.getSuppressedItemStream(true);

			stream.on('data', () => {
				count = count + 1;
			});
			stream.on('end', () => resolve(count));
			stream.on('error', reject);
		}));
		assert.argumentIsValid(streamCount > 0, 'condition', value => value === true, 'getSuppressedItemStream should read at least one suppressed item after add');
	} finally {
		await utils.pauseBeforeCleanup(`Inspect SES suppression item [ ${suppressionEmail} ], then press Enter to cleanup.`);

		await utils.cleanup('removeSuppressedItem', async () => {
			if (suppressionAdded) {
				await provider.removeSuppressedItem(suppressionEmail);
			}
		});
	}
});
