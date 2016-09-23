var mask = require('./../../../lang/mask');

describe('When testing the suitibility of an bit-based enumeration item', function() {
	it('zero should be valid', function() {
		expect(mask.checkItem(0)).toEqual(true);
	});

	it('one should be valid', function() {
		expect(mask.checkItem(1)).toEqual(true);
	});

	it('two should be valid', function() {
		expect(mask.checkItem(2)).toEqual(true);
	});

	it('three should not be valid', function() {
		expect(mask.checkItem(3)).toEqual(false);
	});

	it('four should be valid', function() {
		expect(mask.checkItem(4)).toEqual(true);
	});

	it('five should not be valid', function() {
		expect(mask.checkItem(5)).toEqual(false);
	});

	it('4095 should not be valid', function() {
		expect(mask.checkItem(4095)).toEqual(false);
	});

	it('4096 should be valid', function() {
		expect(mask.checkItem(4096)).toEqual(true);
	});

	it('4097 should not be valid', function() {
		expect(mask.checkItem(4097)).toEqual(false);
	});
});

describe('When working with an empty flags collection', function() {
	'use strict';

	var FLAG_ONE = 1;
	var FLAG_TWO = 16;
	var FLAG_THREE = 512;

	var flags;

	beforeEach(function() {
		flags = mask.getEmpty();
	});

	it('should not contain flag one', function() {
		expect(mask.has(flags, FLAG_ONE)).toEqual(false);
	});

	it('should not contain flag two', function() {
		expect(mask.has(flags, FLAG_TWO)).toEqual(false);
	});

	it('should not contain flag three', function() {
		expect(mask.has(flags, FLAG_THREE)).toEqual(false);
	});

	describe('and adding the first flag', function() {
		var updated;

		beforeEach(function() {
			updated = mask.add(flags, FLAG_ONE);
		});

		it('should contain flag one', function() {
			expect(mask.has(updated, FLAG_ONE)).toEqual(true);
		});

		it('should not contain flag two', function() {
			expect(mask.has(updated, FLAG_TWO)).toEqual(false);
		});

		it('should not contain flag three', function() {
			expect(mask.has(updated, FLAG_THREE)).toEqual(false);
		});

		describe('and adding the third flag', function() {
			var again;

			beforeEach(function() {
				again = mask.add(updated, FLAG_THREE);
			});

			it('should contain flag one', function() {
				expect(mask.has(again, FLAG_ONE)).toEqual(true);
			});

			it('should not contain flag two', function() {
				expect(mask.has(again, FLAG_TWO)).toEqual(false);
			});

			it('should contain flag three', function() {
				expect(mask.has(again, FLAG_THREE)).toEqual(true);
			});
		});

		describe('and removing the first flag', function() {
			var again;

			beforeEach(function() {
				again = mask.remove(updated, FLAG_ONE);
			});

			it('should be empty', function() {
				expect(again).toEqual(mask.getEmpty());
			});

			it('should not contain flag one', function() {
				expect(mask.has(again, FLAG_ONE)).toEqual(false);
			});

			it('should not contain flag two', function() {
				expect(mask.has(again, FLAG_TWO)).toEqual(false);
			});

			it('should not contain flag three', function() {
				expect(mask.has(again, FLAG_THREE)).toEqual(false);
			});
		});

		describe('and adding the first flag again', function() {
			var again;

			beforeEach(function() {
				again = mask.add(updated, FLAG_ONE);
			});

			it('should be unchanged', function() {
				expect(again).toEqual(updated);
			});

			it('should contain flag one', function() {
				expect(mask.has(again, FLAG_ONE)).toEqual(true);
			});

			it('should not contain flag two', function() {
				expect(mask.has(again, FLAG_TWO)).toEqual(false);
			});

			it('should not contain flag three', function() {
				expect(mask.has(again, FLAG_THREE)).toEqual(false);
			});
		});
	});
});