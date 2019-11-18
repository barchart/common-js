const random = require('./../../../lang/random');

describe('When generating a random number, restricting the range to one integer', () => {
	'use strict';

	let result;
	let value;

	beforeEach(() => {
		result = random.range(value = 42, value);
	});

	it('should be the value', () => {
		expect(result).toEqual(value);
	});
});

describe('When generating a random number with a range of multiple values', () => {
	'use strict';

	let result;
	let minimum;
	let maximum;

	beforeEach(() => {
		minimum = -2;
		maximum = 1;
	});

	it('should generate a value within the range', () => {
		let range = maximum - minimum;

		for (let i = 0; i < range * 10; i++) {
			let result = random.range(minimum, maximum);

			expect(result < minimum).toEqual(false);
			expect(result > maximum).toEqual(false);
		}
	});
});