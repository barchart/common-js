const Crosses = require('./../../../specifications/Crosses');

describe('When a Crosses specification is initialized with a threshold of 1000', () => {
	'use strict';

	let specification;

	beforeEach(() => {
		specification = new Crosses(1000);
	});

	describe('and the first value evaluated is 900', () => {
		let r1;

		beforeEach(() => {
			r1 = specification.evaluate(900);
		});

		it('should not pass', () => {
			expect(r1).toEqual(false);
		});

		describe('and the second value evaluated is 1100', () => {
			let r2;

			beforeEach(() => {
				r2 = specification.evaluate(1100);
			});

			it('should pass', () => {
				expect(r2).toEqual(true);
			});

			describe('and the third value evaluated is 999', () => {
				let r3;

				beforeEach(() => {
					r3 = specification.evaluate(999);
				});

				it('should pass', () => {
					expect(r3).toEqual(true);
				});
			});

			describe('and the third value evaluated is 1001', () => {
				let r3;

				beforeEach(() => {
					r3 = specification.evaluate(1001);
				});

				it('should not pass', () => {
					expect(r3).toEqual(false);
				});
			});
		});

		describe('and the second value evaluated is 950', () => {
			let r2;

			beforeEach(() => {
				r2 = specification.evaluate(950);
			});

			it('should not pass', () => {
				expect(r2).toEqual(false);
			});
		});
	});

	describe('and the first value evaluated is 1200', () => {
		let r1;

		beforeEach(() => {
			r1 = specification.evaluate(1200);
		});

		it('should not pass', () => {
			expect(r1).toEqual(false);
		});

		describe('and the second value evaluated is 1100', () => {
			let r2;

			beforeEach(() => {
				r2 = specification.evaluate(1100);
			});

			it('should not pass', () => {
				expect(r2).toEqual(false);
			});
		});

		describe('and the second value evaluated is 950', () => {
			let r2;

			beforeEach(() => {
				r2 = specification.evaluate(950);
			});

			it('should pass', () => {
				expect(r2).toEqual(true);
			});
		});
	});
});

describe('When a Crosses specification is initialized with a threshold of zero', () => {
	'use strict';

	let specification;

	beforeEach(() => {
		specification = new Crosses(0);
	});

	describe('and the first value evaluated is 1', () => {
		let r1;

		beforeEach(() => {
			r1 = specification.evaluate(1);
		});

		it('should not pass', () => {
			expect(r1).toEqual(false);
		});

		describe('and the second value evaluated is -1', () => {
			let r2;

			beforeEach(() => {
				r2 = specification.evaluate(-1);
			});

			it('should pass', () => {
				expect(r2).toEqual(true);
			});
		});

		describe('and the second value evaluated is 0.5', () => {
			let r2;

			beforeEach(() => {
				r2 = specification.evaluate(0.5);
			});

			it('should not pass', () => {
				expect(r2).toEqual(false);
			});
		});
	});

	describe('and the first value evaluated is -1', () => {
		let r1;

		beforeEach(() => {
			r1 = specification.evaluate(-1);
		});

		it('should not pass', () => {
			expect(r1).toEqual(false);
		});

		describe('and the second value evaluated is -0.5', () => {
			let r2;

			beforeEach(() => {
				r2 = specification.evaluate(-0.5);
			});

			it('should not pass', () => {
				expect(r2).toEqual(false);
			});
		});

		describe('and the second value evaluated is 1', () => {
			let r2;

			beforeEach(() => {
				r2 = specification.evaluate(1);
			});

			it('should pass', () => {
				expect(r2).toEqual(true);
			});
		});
	});
});
