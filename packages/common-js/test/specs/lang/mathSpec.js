const math = require('./../../../lang/math');

describe('When using math.approximate', () => {
	'use strict';

	describe("and comparing identical integers", () => {
		it("should return true", () => {
			expect(math.approximate(12, 12)).toEqual(true);
		});
	});

	describe("and comparing identical decimals literals", () => {
		it("should return true", () => {
			expect(math.approximate(0.3, 0.3)).toEqual(true);
		});
	});

	describe("and comparing identical derived decimals derived with addition", () => {
		it("should return true", () => {
			expect(math.approximate(0.1 + 0.2, 0.3)).toEqual(true);
		});
	});

	describe("and comparing identical derived decimals derived with division and multiplication", () => {
		it("should return true", () => {
			expect(math.approximate((100.33 / 3) * 3, 100.33)).toEqual(true);
		});
	});

	describe("and comparing an integer with undefined", () => {
		it("should return false", () => {
			expect(math.approximate(123, undefined)).toEqual(false);
		});
	});

	describe("and comparing a decimal with undefined", () => {
		it("should return false", () => {
			expect(math.approximate(123.45, undefined)).toEqual(false);
		});
	});

	describe("and comparing an integer with null", () => {
		it("should return false", () => {
			expect(math.approximate(123, null)).toEqual(false);
		});
	});

	describe("and comparing a decimal with null", () => {
		it("should return false", () => {
			expect(math.approximate(123.45, null)).toEqual(false);
		});
	});

	describe("and comparing strings", () => {
		it("should return false", () => {
			expect(math.approximate('hi', 'there')).toEqual(false);
		});
	});
});