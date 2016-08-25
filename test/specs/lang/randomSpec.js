var random = require('./../../../lang/random');

describe('When generating a random number, restricting the range to one integer', function() {
	'use strict';

	var result;
	var value;

	beforeEach(function() {
		result = random.range(value = 42, value);
	});

	it('should be the value', function() {
		expect(result).toEqual(value);
	});
});

describe('When generating a random number with a range of multiple values', function() {
	'use strict';

	var result;
	var minimum;
	var maximum;

	beforeEach(function() {
		minimum = -2;
		maximum = 1;
	});

	it('should generate a value within the range', function() {
		var range = maximum - minimum;

		for (var i = 0; i < range * 10; i++) {
			var result = random.range(minimum, maximum);

			expect(result < minimum).toEqual(false);
			expect(result > maximum).toEqual(false);
		}
	});
});