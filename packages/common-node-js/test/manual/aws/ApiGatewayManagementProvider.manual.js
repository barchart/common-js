const ApiGatewayManagementProvider = require('../../../aws/ApiGatewayManagementProvider');
const utils = require('../utils/ManualTestUtils');

utils.run('ApiGatewayManagementProvider manual test', async () => {
	const endpoint = utils.requireEnv('APIGW_MANAGEMENT_ENDPOINT');
	const connectionId = utils.requireEnv('APIGW_CONNECTION_ID');

	const provider = new ApiGatewayManagementProvider({
		region: utils.region(),
		endpoint
	});

	const started = await utils.step('start', () => provider.start());
	utils.assertEqual(started, true, 'API Gateway provider should start');

	const response = await utils.step('postToConnection', () => provider.postToConnection(connectionId, JSON.stringify({ source: 'ApiGatewayManagementProvider.manual', createdAt: new Date().toISOString() })));
	utils.assertObject(response, 'postToConnection should return an AWS response object');

	await utils.pauseBeforeCleanup('ApiGatewayManagementProvider created no cleanup resources. Press Enter to finish.');
});
