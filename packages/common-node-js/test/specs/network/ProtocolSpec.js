import Protocol from './../../../network/Protocol.js';

describe('When network protocols are used', () => {
	'use strict';

	it('should return the standard URL prefix when secure mode is disabled', () => {
		const protocol = new Protocol('Test', 'standard', 'secure');

		expect(protocol.getUrlPrefix(false)).toEqual('standard://');
	});

	it('should return the secure URL prefix when secure mode is enabled', () => {
		const protocol = new Protocol('Test', 'standard', 'secure');

		expect(protocol.getUrlPrefix(true)).toEqual('secure://');
	});
});
