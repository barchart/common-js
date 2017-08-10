var Enum = require('./../../../lang/Enum');

describe('When Enum is extended (as types EnumA and EnumB) and type items are added to each (X and Y)', function() {
	'use strict';

	class EnumA extends Enum {
		constructor(code, description) {
			super(code, description);
		}
	}

	class EnumB extends Enum {
		constructor(code, description) {
			super(code, description);
		}
	}

	var ax = new EnumA('x', 'A-X');
	var ay = new EnumA('y', 'A-Y');
	var bx = new EnumB('x', 'B-X');
	var by = new EnumB('y', 'B-Y');

	it('should be able to find X in EnumA using the code', function() {
		expect(Enum.fromCode(EnumA, 'x')).toBe(ax);
	});

	it('should be able to find Y in EnumA using the code', function() {
		expect(Enum.fromCode(EnumA, 'y')).toBe(ay);
	});

	it('should be able to find X in EnumB using the code', function() {
		expect(Enum.fromCode(EnumB, 'x')).toBe(bx);
	});

	it('should be able to find Y in EnumB using the code', function() {
		expect(Enum.fromCode(EnumB, 'y')).toBe(by);
	});

	describe('and a duplicate item (A-x) is added', function() {
		var axx = new EnumA('x', 'A-XX');

		it('should be still find the original instance in EnumA for X', function() {
			expect(Enum.fromCode(EnumA, 'x')).toBe(ax);
		});

		it('should should equal the original instance (for X)', function() {
			expect(Enum.fromCode(EnumA, 'x').equals(axx)).toBe(true);
		});
	});
});