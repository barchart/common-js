var math = require('./../../../lang/math');

describe('When using math.approximate', function() {
	'use strict';

	describe("and comparing identical integers", function() {
		it("should return true", function() {
			expect(math.approximate(12, 12)).toEqual(true);
		});
	});

	describe("and comparing identical decimals literals", function() {
		it("should return true", function() {
			expect(math.approximate(0.3, 0.3)).toEqual(true);
		});
	});

	describe("and comparing identical derived decimals derived with addition", function() {
		it("should return true", function() {
			expect(math.approximate(0.1 + 0.2, 0.3)).toEqual(true);
		});
	});

	describe("and comparing identical derived decimals derived with division and multiplication", function() {
		it("should return true", function() {
			expect(math.approximate((100.33 / 3) * 3, 100.33)).toEqual(true);
		});
	});

	describe("and comparing an integer with undefined", function() {
		it("should return false", function() {
			expect(math.approximate(123, undefined)).toEqual(false);
		});
	});

	describe("and comparing a decimal with undefined", function() {
		it("should return false", function() {
			expect(math.approximate(123.45, undefined)).toEqual(false);
		});
	});

	describe("and comparing an integer with null", function() {
		it("should return false", function() {
			expect(math.approximate(123, null)).toEqual(false);
		});
	});

	describe("and comparing a decimal with null", function() {
		it("should return false", function() {
			expect(math.approximate(123.45, null)).toEqual(false);
		});
	});

	describe("and comparing strings", function() {
		it("should return false", function() {
			expect(math.approximate('hi', 'there')).toEqual(false);
		});
	});
});