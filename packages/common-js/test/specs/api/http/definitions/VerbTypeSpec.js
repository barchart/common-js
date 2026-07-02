import VerbType from './../../../../../api/http/definitions/VerbType.js';

describe('When VerbType values are used', () => {
	'use strict';

	const verbs = [
		[ 'DELETE', () => VerbType.DELETE ],
		[ 'GET', () => VerbType.GET ],
		[ 'POST', () => VerbType.POST ],
		[ 'PUT', () => VerbType.PUT ],
		[ 'PATCH', () => VerbType.PATCH ]
	];

	verbs.forEach(([ description, getVerb ]) => {
		it(`should expose ${description}`, () => {
			expect({
				description: getVerb().description,
				code: getVerb().code
			}).toEqual({
				description,
				code: description
			});
		});
	});
});
