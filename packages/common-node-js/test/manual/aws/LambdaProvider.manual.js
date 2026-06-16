import * as utils from '../utils/ManualTestUtils.js';

import LambdaProvider from '../../../aws/LambdaProvider.js';

utils.run('LambdaProvider manual test', async () => {
	const functionName = utils.requireEnv('LAMBDA_TEST_FUNCTION_NAME');
	const provider = new LambdaProvider({ region: utils.region() });

	const started = await utils.step('start', () => provider.start());
	utils.assertEqual(started, true, 'Lambda provider should start');

	const asyncResponse = await utils.step('invoke async', () => provider.invoke(functionName, { source: 'LambdaProvider.manual', mode: 'async' }, false));
	utils.assertEqual(asyncResponse.StatusCode, 202, 'Async invoke should return 202');

	const syncResponse = await utils.step('invoke sync', async () => {
		const response = await provider.invoke(functionName, { source: 'LambdaProvider.manual', mode: 'sync' }, true);

		return {
			StatusCode: response.StatusCode,
			FunctionError: response.FunctionError,
			Payload: response.Payload ? Buffer.from(response.Payload).toString('utf8') : null
		};
	});
	utils.assertEqual(syncResponse.StatusCode, 200, 'Sync invoke should return 200');

	await utils.pauseBeforeCleanup('LambdaProvider created no cleanup resources. Press Enter to finish.');
});
