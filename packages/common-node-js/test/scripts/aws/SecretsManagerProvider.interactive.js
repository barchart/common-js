import * as assert from '@barchart/common-js/lang/assert.js';
import * as utils from '../utils/InteractiveTestUtils.js';

import SecretsManagerProvider from '../../../aws/SecretsManagerProvider.js';

utils.run('SecretsManagerProvider interactive test', async () => {
	const secretId = utils.requireEnv('SECRETS_MANAGER_TEST_SECRET_ID');
	const provider = new SecretsManagerProvider({ region: utils.region() });

	const started = await utils.step('start', () => provider.start());
	assert.areEqual(started, true, 'Secrets Manager provider should start');

	const secretSummary = await utils.step('getSecretValue', async () => {
		const value = await provider.getSecretValue(secretId);

		assert.argumentIsValid(value, 'value', value => typeof value === 'string' && value.length > 0, 'Secret value should be a non-empty string');

		return `Secret retrieved, length [ ${value.length} ]`;
	});

	assert.argumentIsValid(secretSummary, 'value', value => typeof value === 'string' && value.length > 0, 'Secret summary should be printed');

	await utils.pauseBeforeCleanup('SecretsManagerProvider created no cleanup resources. Press Enter to finish.');
});
