import * as assert from '@barchart/common-js/lang/assert.js';
import * as utils from '../utils/InteractiveTestUtils.js';

import ApiGatewayManagementProvider from '../../../aws/ApiGatewayManagementProvider.js';

utils.run('ApiGatewayManagementProvider interactive test', async () => {
	const endpoint = utils.requireEnv('APIGW_MANAGEMENT_ENDPOINT');
	const connectionId = utils.requireEnv('APIGW_CONNECTION_ID');

	const provider = new ApiGatewayManagementProvider({
		region: utils.region(),
		endpoint
	});

	const started = await utils.step('start', () => provider.start());
	assert.areEqual(started, true, 'API Gateway provider should start');

	const response = await utils.step('postToConnection', () => provider.postToConnection(connectionId, JSON.stringify({ source: 'ApiGatewayManagementProvider.interactive', createdAt: new Date().toISOString() })));
	assert.argumentIsValid(response, 'value', value => value !== null && typeof value === 'object' && !Array.isArray(value), 'postToConnection should return an AWS response object');

	await utils.pauseBeforeCleanup('ApiGatewayManagementProvider created no cleanup resources. Press Enter to finish.');
});
