import AwsOptions from './../../../aws/AwsOptions.js';
import LambdaProvider from './../../../aws/LambdaProvider.js';

describe('When AWS options are used', () => {
	'use strict';

	beforeEach(() => {
		AwsOptions.setOptions({ });
	});

	it('should expose a singleton instance', () => {
		expect(AwsOptions.instance).toBe(AwsOptions.instance);
	});

	it('should activate the default AWS client configuration', () => {
		AwsOptions.useDefaultOptions();

		expect(AwsOptions.instance.options).toEqual({
			maxAttempts: 3,
			region: 'us-east-1',
			requestHandler: {
				connectionTimeout: 1500,
				socketTimeout: 5000
			}
		});
	});

	it('should activate custom shared options', () => {
		AwsOptions.setOptions({
			maxAttempts: 6,
			region: 'eu-west-1'
		});

		expect(AwsOptions.instance.options).toEqual({
			maxAttempts: 6,
			region: 'eu-west-1'
		});
	});

	it('should retain the active shared options reference', () => {
		const options = { maxAttempts: 3 };

		AwsOptions.setOptions(options);

		expect(AwsOptions.instance.options).toBe(options);
	});

	it('should not update shared options with provider-specific client configuration', () => {
		AwsOptions.setOptions({ region: 'us-east-1' });

		new LambdaProvider({ region: 'eu-west-1' });

		expect(AwsOptions.instance.options.region).toEqual('us-east-1');
	});
});
