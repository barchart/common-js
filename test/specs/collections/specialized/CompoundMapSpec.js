var CompoundMap = require('./../../../../collections/specialized/CompoundMap');

describe('When an CompoundMap is constructed', function() {
	'use strict';

	describe('with a depth of one', function() {
		var map;

		beforeEach(function() {
			map = new CompoundMap(1);
		});

		describe('and an item with one key is put into the map', function() {
			var value;
			var key;

			beforeEach(function() {
				map.put(value = 'bryan', key = 'b');
			});

			it('should have the item', function() {
				expect(map.has(key)).toEqual(true);
			});

			it('should return the value when asked', function() {
				expect(map.get(key)).toEqual(value);
			});
		});

		describe('and an item with one key is put into the map', function() {
			it('should throw an error', function() {
				expect(function() { map.put('bryan', 'b', 'r'); }).toThrow();
			});
		});
	});

	describe('with a depth of two', function() {
		var map;

		beforeEach(function() {
			map = new CompoundMap(2);
		});

		describe('and an item with two keys is put into the map', function() {
			var value;

			var keyOne;
			var keyTwo;

			beforeEach(function() {
				map.put(value = 'bryan', keyOne = 'b', keyTwo = 'r');
			});

			it('should have the group', function() {
				expect(map.has(keyOne)).toEqual(true);
			});

			it('should have the item', function() {
				expect(map.has(keyOne, keyTwo)).toEqual(true);
			});

			it('should return the value when asked', function() {
				expect(map.get(keyOne, keyTwo)).toEqual(value);
			});

			describe('and another item, with the same keys, is put into the map', function() {
				var replaced;

				beforeEach(function() {
					map.put(replaced = 'brock', keyOne, keyTwo);
				});

				it('should have the item', function() {
					expect(map.has(keyOne, keyTwo)).toEqual(true);
				});

				it('should return the value when asked', function() {
					expect(map.get(keyOne, keyTwo)).toEqual(replaced);
				});
			});

			describe('and another item, with the same first key, is put into the map', function() {
				var valueB;

				var keyOneB;
				var keyTwoB;

				beforeEach(function() {
					map.put(valueB = 'bob', keyOneB = keyOne, keyTwoB = 'o');
				});

				it('should have the item', function() {
					expect(map.has(keyOneB, keyTwoB)).toEqual(true);
				});

				it('should return the value when asked', function() {
					expect(map.get(keyOneB, keyTwoB)).toEqual(valueB);
				});

				it('should still have the original item', function() {
					expect(map.has(keyOne, keyTwo)).toEqual(true);
				});

				it('should still return the original value when asked', function() {
					expect(map.get(keyOne, keyTwo)).toEqual(value);
				});

				describe('and that item is deleted', function() {
					beforeEach(function() {
						map.remove(keyOneB, keyTwoB);
					});

					it('should not have the item', function() {
						expect(map.has(keyOneB, keyTwoB)).toEqual(false);
					});

					it('should still have the original item', function() {
						expect(map.has(keyOne, keyTwo)).toEqual(true);
					});
				});

				describe('and the entire group is deleted', function() {
					beforeEach(function() {
						map.remove(keyOneB);
					});

					it('should not have the item', function() {
						expect(map.has(keyOneB, keyTwoB)).toEqual(false);
					});

					it('should not have the original item', function() {
						expect(map.has(keyOne, keyTwo)).toEqual(false);
					});
				});
			});
		});

		describe('and an item with one key is put into the map', function() {
			it('should throw an error', function() {
				expect(function() { map.put('bryan', 'b'); }).toThrow();
			});
		});
	});
});