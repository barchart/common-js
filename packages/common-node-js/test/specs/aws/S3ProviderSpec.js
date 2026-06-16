import S3Provider from './../../../aws/S3Provider.js';

describe('When creating a qualified filename for s3', () => {
	'use strict';

	it('using multiple path strings, the correct path should be generated', () => {
		expect(S3Provider.getQualifiedFilename('\\a\\', '\\b\\', '/c/', '/d/')).toEqual('a/b/c/d');
	});

	it('using strings and an array, the correct path should be generated', () => {
		expect(S3Provider.getQualifiedFilename('\\a\\', [ '\\b\\', '/c/' ], '/d/')).toEqual('a/b/c/d');
	});

	it('using a string with repeated forward slashes, the correct path should be generated', () => {
		expect(S3Provider.getQualifiedFilename('//a/b/c/d')).toEqual('a/b/c/d');
	});

	it('using a string with backslashes, the correct path should be generated', () => {
		expect(S3Provider.getQualifiedFilename('\\a\\b\\c\\d')).toEqual('a/b/c/d');
	});

	it('using a local prefix and absolute path, the correct path should be generated', () => {
		expect(S3Provider.getQualifiedFilename('local', '/trading-overview/report/21fa0303-45b9-41df-996e-b04192f100b6.html')).toEqual('local/trading-overview/report/21fa0303-45b9-41df-996e-b04192f100b6.html');
	});
});
