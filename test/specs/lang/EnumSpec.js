const Enum = require('./../../../lang/Enum');

describe('When Enum is extended (as types EnumA and EnumB) and type items are added to each (X and Y)', () => {
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

	let ax = new EnumA('x', 'A-X');
	let ay = new EnumA('y', 'A-Y');
	let bx = new EnumB('x', 'B-X');
	let by = new EnumB('y', 'B-Y');

	it('should be able to find X in EnumA using the code', () => {
		expect(Enum.fromCode(EnumA, 'x')).toBe(ax);
	});

	it('should be able to find Y in EnumA using the code', () => {
		expect(Enum.fromCode(EnumA, 'y')).toBe(ay);
	});

	it('should be able to find X in EnumB using the code', () => {
		expect(Enum.fromCode(EnumB, 'x')).toBe(bx);
	});

	it('should be able to find Y in EnumB using the code', () => {
		expect(Enum.fromCode(EnumB, 'y')).toBe(by);
	});

	describe('and a duplicate item (A-x) is added', () => {
		let invalid = new EnumA('x', 'A-XX');

		it('should still only have two items', () => {
			expect(Enum.getItems(EnumA).length).toEqual(2);
		});

		it('should still able to find the original instance in EnumA for X', () => {
			expect(Enum.fromCode(EnumA, 'x')).toBe(ax);
		});

		it('should not be able to find the mapping for the duplicated item', () => {
			expect(Enum.getItems(EnumA).some(x => x === invalid)).toEqual(false);
		});

		it('should should equal the original instance (for X)', () => {
			expect(Enum.fromCode(EnumA, 'x').equals(ax)).toBe(true);
		});
	});
});

describe('When Enum is extended (as types EnumA and EnumB) and type items are added to each (X and Y) which include mapping values', () => {
	'use strict';

	class EnumA extends Enum {
		constructor(code, description, mapping) {
			super(code, description, mapping);
		}
	}

	class EnumB extends Enum {
		constructor(code, description, mapping) {
			super(code, description, mapping);
		}
	}

	let ax = new EnumA('x', 'A-X', 0);
	let ay = new EnumA('y', 'A-Y', 1);
	let bx = new EnumB('x', 'B-X', 0);
	let by = new EnumB('y', 'B-Y', 1);

	it('should be able to find X in EnumA using the mapping value', () => {
		expect(Enum.fromMapping(EnumA, 0)).toBe(ax);
	});

	it('should be able to find Y in EnumA using the mapping value', () => {
		expect(Enum.fromMapping(EnumA, 1)).toBe(ay);
	});

	it('should be able to find X in EnumB using the mapping value', () => {
		expect(Enum.fromMapping(EnumB, 0)).toBe(bx);
	});

	it('should be able to find Y in EnumB using the mapping value', () => {
		expect(Enum.fromMapping(EnumB, 1)).toBe(by);
	});

	describe('and a duplicate mapping value is added', () => {
		let invalid = new EnumA('z', 'A-Z', 1);

		it('should still only have two items', () => {
			expect(Enum.getItems(EnumA).length).toEqual(2);
		});

		it('should still able to find the original instance in EnumA for Y', () => {
			expect(Enum.fromMapping(EnumA, 1)).toBe(ay);
		});

		it('should not be able to find the mapping for the duplicated item', () => {
			expect(Enum.getItems(EnumA).some(x => x === invalid)).toEqual(false);
		});
	});
});