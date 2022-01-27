const Changes = require('./../../../specifications/Changes');

describe('When a Changes specification is used to evaluate strings', () => {
	'use strict';

	describe('and the first string is evaluated', () => {
		let specification;
		let r1;

		beforeEach(() => {
			specification = new Changes();

			r1 = specification.evaluate('abc');
		});

		it('should not pass', () => {
			expect(r1).toEqual(false);
		});

		describe('and a second string, different from the first, is evaluated', () => {
			let r2;

			beforeEach(() => {
				r2 = specification.evaluate('def');
			});

			it('should pass', () => {
				expect(r2).toEqual(true);
			});
		});

		describe('and a second string, same as the first, is evaluated', () => {
			let r2;

			beforeEach(() => {
				r2 = specification.evaluate('abc');
			});

			it('should not pass', () => {
				expect(r2).toEqual(false);
			});
		});
	});
});

describe('When a Changes specification is used to evaluate numbers', () => {
	'use strict';

	describe('and the first number is evaluated', () => {
		let specification;
		let r1;

		beforeEach(() => {
			specification = new Changes();

			r1 = specification.evaluate(1);
		});

		it('should not pass', () => {
			expect(r1).toEqual(false);
		});

		describe('and a second number, different from the first, is evaluated', () => {
			let r2;

			beforeEach(() => {
				r2 = specification.evaluate(0);
			});

			it('should pass', () => {
				expect(r2).toEqual(true);
			});
		});

		describe('and a second number, same as the first, is evaluated', () => {
			let r2;

			beforeEach(() => {
				r2 = specification.evaluate(1);
			});

			it('should not pass', () => {
				expect(r2).toEqual(false);
			});
		});
	});
});