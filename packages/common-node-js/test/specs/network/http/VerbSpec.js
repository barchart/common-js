import Verb from './../../../../network/http/Verb.js';

describe('When HTTP verbs are used', () => {
	'use strict';

	it('should expose HTTP verb codes', () => {
		expect([
			Verb.DELETE.getCode(),
			Verb.GET.getCode(),
			Verb.OPTIONS.getCode(),
			Verb.POST.getCode(),
			Verb.PUT.getCode()
		]).toEqual([
			'DELETE',
			'GET',
			'OPTIONS',
			'POST',
			'PUT'
		]);
	});
});
