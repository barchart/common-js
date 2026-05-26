const SqsProvider = require('./../../../aws/SqsProvider');

describe('When an SQS Provider created', () => {
	'use strict';

	let provider;
	let configuration;

	beforeEach(() => {
		provider = new SqsProvider(configuration = {
			region: 'somewhere',
			prefix: 'suffix'
		});
	});

	describe('and it is disposed', () => {
		beforeEach(() => {
			provider.dispose();
		});

		it('should be disposed', () => {
			expect(provider.getIsDisposed()).toEqual(true);
		});
	});
});