var math = require('./../../../lang/math');

describe('When using math.equals', function() {
	'use strict';

	describe("and comparing identical integers", function() {
		it("should return true", function() {
			expect(math.equals(12, 12)).toEqual(true);
		});
	});

	describe("and comparing identical decimals literals", function() {
		it("should return true", function() {
			expect(math.equals(0.3, 0.3)).toEqual(true);
		});
	});

	describe("and comparing identical derived decimals derived with addition", function() {
		it("should return true", function() {
			expect(math.equals(0.1 + 0.2, 0.3)).toEqual(true);
		});
	});

	describe("and comparing identical derived decimals derived with division and multiplication", function() {
		it("should return true", function() {
			expect(math.equals((100.33 / 3) * 3, 100.33)).toEqual(true);
		});
	});

	describe("and comparing an integer with undefined", function() {
		it("should return false", function() {
			expect(math.equals(123, undefined)).toEqual(false);
		});
	});

	describe("and comparing a decimal with undefined", function() {
		it("should return false", function() {
			expect(math.equals(123.45, undefined)).toEqual(false);
		});
	});

	describe("and comparing an integer with null", function() {
		it("should return false", function() {
			expect(math.equals(123, null)).toEqual(false);
		});
	});

	describe("and comparing a decimal with null", function() {
		it("should return false", function() {
			expect(math.equals(123.45, null)).toEqual(false);
		});
	});

	describe("and comparing strings", function() {
		it("should return false", function() {
			expect(math.equals('hi', 'there')).toEqual(false);
		});
	});
});