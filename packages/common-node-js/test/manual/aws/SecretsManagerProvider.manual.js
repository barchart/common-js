import * as utils from '../utils/ManualTestUtils.js';

import SecretsManagerProvider from '../../../aws/SecretsManagerProvider.js';

utils.run('SecretsManagerProvider manual test', async () => {
	const secretId = utils.requireEnv('SECRETS_MANAGER_TEST_SECRET_ID');
	const provider = new SecretsManagerProvider({ region: utils.region() });

	const started = await utils.step('start', () => provider.start());
	utils.assertEqual(started, true, 'Secrets Manager provider should start');

	const secretSummary = await utils.step('getSecretValue', async () => {
		const value = await provider.getSecretValue(secretId);

		utils.assertString(value, 'Secret value should be a non-empty string');

		return `Secret retrieved, length [ ${value.length} ]`;
	});
	utils.assertString(secretSummary, 'Secret summary should be printed');

	await utils.pauseBeforeCleanup('SecretsManagerProvider created no cleanup resources. Press Enter to finish.');
});
