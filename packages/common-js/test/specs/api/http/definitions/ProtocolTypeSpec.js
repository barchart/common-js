import ProtocolType from './../../../../../api/http/definitions/ProtocolType.js';

describe('When ProtocolType values are used', () => {
	'use strict';

	it('should expose HTTP default port', () => {
		expect(ProtocolType.HTTP.defaultPort).toEqual(80);
	});

	it('should expose HTTP prefix', () => {
		expect(ProtocolType.HTTP.prefix).toEqual('http://');
	});

	it('should expose HTTPS default port', () => {
		expect(ProtocolType.HTTPS.defaultPort).toEqual(443);
	});

	it('should expose HTTPS prefix', () => {
		expect(ProtocolType.HTTPS.prefix).toEqual('https://');
	});

	it('should parse HTTP protocol code', () => {
		expect(ProtocolType.parse('HTTP')).toBe(ProtocolType.HTTP);
	});

	it('should parse HTTPS protocol code', () => {
		expect(ProtocolType.parse('HTTPS')).toBe(ProtocolType.HTTPS);
	});

	it('should return null for unknown protocol codes', () => {
		expect(ProtocolType.parse('FTP')).toBeNull();
	});

	it('should allow valid constructor arguments', () => {
		expect(() => new ProtocolType('CUSTOM', 1234, 'custom://')).not.toThrow();
	});

	it('should reject negative port numbers', () => {
		expect(() => new ProtocolType('CUSTOM', -1, 'custom://')).toThrow();
	});

	it('should reject null prefix', () => {
		expect(() => new ProtocolType('CUSTOM', 1234, null)).toThrow();
	});
});
