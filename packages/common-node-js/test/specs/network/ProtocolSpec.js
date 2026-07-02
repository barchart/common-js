import Protocol from './../../../network/Protocol.js';

describe('When network protocols are used', () => {
	'use strict';

	it('should expose standard and secure URL prefixes', () => {
		expect({
			description: Protocol.HyperText.getDescription(),
			standard: Protocol.HyperText.getStandard(),
			secure: Protocol.HyperText.getSecure(),
			standardPrefix: Protocol.HyperText.getUrlPrefix(false),
			securePrefix: Protocol.HyperText.getUrlPrefix(true)
		}).toEqual({
			description: 'HyperText',
			standard: 'http',
			secure: 'https',
			standardPrefix: 'http://',
			securePrefix: 'https://'
		});
	});
});
