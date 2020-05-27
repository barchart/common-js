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

describe('When generating a random number with a range of values', () => {
	'use strict';

	let minimum;
	let maximum;

	beforeEach(() => {
		minimum = -2;
		maximum = 1;
	});

	it('should generate a value within the range', () => {
		for (let i = 0; i < 100; i++) {
			const result = random.range(minimum, maximum);

			expect(result < minimum).toEqual(false);
			expect(result < maximum).toEqual(true);
		}
	});

	it('should generate an integer', () => {
		for (let i = 0; i < 100; i++) {
			const result = random.range(minimum, maximum);

			expect(result | 0).toEqual(result);
		}
	});
});

describe('When generating a random number using an invalid range, the range is automatically corrected', () => {
	'use strict';

	let minimum;
	let maximum;

	beforeEach(() => {
		minimum = 9;
		maximum = 4;
	});

	it('should generate a value within the range', () => {
		for (let i = 0; i < 100; i++) {
			const result = random.range(minimum, maximum);

			expect(result < maximum).toEqual(false);
			expect(result < minimum).toEqual(true);
		}
	});

	it('should generate an integer', () => {
		for (let i = 0; i < 100; i++) {
			const result = random.range(minimum, maximum);

			expect(result | 0).toEqual(result);
		}
	});
});