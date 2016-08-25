var string = require('./../../../lang/string');

describe('When converting a string to "start" casing', function() {
	'use strict';

	var result;

	beforeEach(function() {
		result = string.startCase('The quick brown Fox');
	});

	it('should convert the first character (after each space) to a capital letter', function() {
		expect(result).toEqual('The Quick Brown Fox');
	});
});

describe('When truncating a string', function() {
	'use strict';

	var base;

	beforeEach(function() {
		base = '1234567890';
	});

	describe('to more characters than the base string', function() {
		var result;

		beforeEach(function() {
			result = string.truncate(base, base.length + 1);
		});

		it('should return the base string', function() {
			expect(result).toEqual(base);
		});
	});

	describe('to the same number of characters than the base string', function() {
		var result;

		beforeEach(function() {
			result = string.truncate(base, base.length);
		});

		it('should return the base string', function() {
			expect(result).toEqual(base);
		});
	});

	describe('to fewer characters than the base string', function() {
		var result;
		var length;

		beforeEach(function() {
			result = string.truncate(base, length = 2);
		});

		it('the result should be the correct number of characters', function() {
			expect(result.length).toEqual(length + 4);
		});

		it('the first characters should be from the base string', function() {
			for (var i = 0; i < length; i++) {
				expect(result.substring(i, i + 1)).toEqual(base.substring(i, i + 1));
			}
		});

		it('the final characters should be the base string', function() {
			expect(result.substring(result.length - 4, result.length)).toEqual(' ...');
		});
	});
});

describe('When left padding a string', function() {
	'use strict';

	var base;

	beforeEach(function() {
		base = 'base';
	});

	describe('with fewer characters than the base string', function() {
		var result;

		beforeEach(function() {
			result = string.padLeft(base, base.length, 'x');
		});

		it('should return the base string', function() {
			expect(result).toEqual(base);
		});
	});

	describe('with one more character than the base string', function() {
		var result;
		var repeat;

		beforeEach(function() {
			result = string.padLeft(base, base.length + 1, repeat = 'x');
		});

		it('the result should be the correct number of characters', function() {
			expect(result.length).toEqual(base.length + 1);
		});

		it('the first character should be the repeating character', function() {
			expect(result.substring(0, 1)).toEqual(repeat);
		});

		it('the final characters should be the base string', function() {
			expect(result.substring(1, result.length)).toEqual(base);
		});
	});

	describe('with many more character than the base string', function() {
		var result;
		var repeat;
		var count;

		beforeEach(function() {
			result = string.padLeft(base, count = 10, repeat = 'x');
		});

		it('the result should be the correct number of characters', function() {
			expect(result.length).toEqual(count);
		});

		it('the first characters should be the repeating character', function() {
			var prefix = count - base.length;

			for (var i = 0; i < prefix; i++) {
				expect(result.substring(i, i + 1)).toEqual(repeat);
			}
		});

		it('the final characters should be the base string', function() {
			expect(result.substring(count - base.length, result.length)).toEqual(base);
		});
	});
});