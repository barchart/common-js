const mask = require('./../../../lang/mask');

describe('When testing the suitibility of an bit-based enumeration item', () => {
	it('zero should be valid', () => {
		expect(mask.checkItem(0)).toEqual(true);
	});

	it('one should be valid', () => {
		expect(mask.checkItem(1)).toEqual(true);
	});

	it('two should be valid', () => {
		expect(mask.checkItem(2)).toEqual(true);
	});

	it('three should not be valid', () => {
		expect(mask.checkItem(3)).toEqual(false);
	});

	it('four should be valid', () => {
		expect(mask.checkItem(4)).toEqual(true);
	});

	it('five should not be valid', () => {
		expect(mask.checkItem(5)).toEqual(false);
	});

	it('4095 should not be valid', () => {
		expect(mask.checkItem(4095)).toEqual(false);
	});

	it('4096 should be valid', () => {
		expect(mask.checkItem(4096)).toEqual(true);
	});

	it('4097 should not be valid', () => {
		expect(mask.checkItem(4097)).toEqual(false);
	});
});

describe('When working with an empty flags collection', () => {
	'use strict';

	let FLAG_ONE = 1;
	let FLAG_TWO = 16;
	let FLAG_THREE = 512;

	let flags;

	beforeEach(() => {
		flags = mask.getEmpty();
	});

	it('should not contain flag one', () => {
		expect(mask.has(flags, FLAG_ONE)).toEqual(false);
	});

	it('should not contain flag two', () => {
		expect(mask.has(flags, FLAG_TWO)).toEqual(false);
	});

	it('should not contain flag three', () => {
		expect(mask.has(flags, FLAG_THREE)).toEqual(false);
	});

	describe('and adding the first flag', () => {
		let updated;

		beforeEach(() => {
			updated = mask.add(flags, FLAG_ONE);
		});

		it('should contain flag one', () => {
			expect(mask.has(updated, FLAG_ONE)).toEqual(true);
		});

		it('should not contain flag two', () => {
			expect(mask.has(updated, FLAG_TWO)).toEqual(false);
		});

		it('should not contain flag three', () => {
			expect(mask.has(updated, FLAG_THREE)).toEqual(false);
		});

		describe('and adding the third flag', () => {
			let again;

			beforeEach(() => {
				again = mask.add(updated, FLAG_THREE);
			});

			it('should contain flag one', () => {
				expect(mask.has(again, FLAG_ONE)).toEqual(true);
			});

			it('should not contain flag two', () => {
				expect(mask.has(again, FLAG_TWO)).toEqual(false);
			});

			it('should contain flag three', () => {
				expect(mask.has(again, FLAG_THREE)).toEqual(true);
			});
		});

		describe('and removing the first flag', () => {
			let again;

			beforeEach(() => {
				again = mask.remove(updated, FLAG_ONE);
			});

			it('should be empty', () => {
				expect(again).toEqual(mask.getEmpty());
			});

			it('should not contain flag one', () => {
				expect(mask.has(again, FLAG_ONE)).toEqual(false);
			});

			it('should not contain flag two', () => {
				expect(mask.has(again, FLAG_TWO)).toEqual(false);
			});

			it('should not contain flag three', () => {
				expect(mask.has(again, FLAG_THREE)).toEqual(false);
			});
		});

		describe('and adding the first flag again', () => {
			let again;

			beforeEach(() => {
				again = mask.add(updated, FLAG_ONE);
			});

			it('should be unchanged', () => {
				expect(again).toEqual(updated);
			});

			it('should contain flag one', () => {
				expect(mask.has(again, FLAG_ONE)).toEqual(true);
			});

			it('should not contain flag two', () => {
				expect(mask.has(again, FLAG_TWO)).toEqual(false);
			});

			it('should not contain flag three', () => {
				expect(mask.has(again, FLAG_THREE)).toEqual(false);
			});
		});
	});
});