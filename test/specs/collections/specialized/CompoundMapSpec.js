const CompoundMap = require('./../../../../collections/specialized/CompoundMap');

describe('When an CompoundMap is constructed', () => {
	'use strict';

	describe('with a depth of one', () => {
		let map;

		beforeEach(() => {
			map = new CompoundMap(1);
		});

		describe('and an item with one key is put into the map', () => {
			let value;
			let key;

			beforeEach(() => {
				map.put(value = 'bryan', key = 'b');
			});

			it('should have the item', () => {
				expect(map.has(key)).toEqual(true);
			});

			it('should return the value when asked', () => {
				expect(map.get(key)).toEqual(value);
			});
		});

		describe('and an item with one key is put into the map', () => {
			it('should throw an error', () => {
				expect(() => { map.put('bryan', 'b', 'r'); }).toThrow();
			});
		});
	});

	describe('with a depth of two', () => {
		let map;

		beforeEach(() => {
			map = new CompoundMap(2);
		});

		describe('and an item with two keys is put into the map', () => {
			let value;

			let keyOne;
			let keyTwo;

			beforeEach(() => {
				map.put(value = 'bryan', keyOne = 'b', keyTwo = 'r');
			});

			it('should have the group', () => {
				expect(map.has(keyOne)).toEqual(true);
			});

			it('should have the item', () => {
				expect(map.has(keyOne, keyTwo)).toEqual(true);
			});

			it('should return the value when asked', () => {
				expect(map.get(keyOne, keyTwo)).toEqual(value);
			});

			describe('and another item, with the same keys, is put into the map', () => {
				let replaced;

				beforeEach(() => {
					map.put(replaced = 'brock', keyOne, keyTwo);
				});

				it('should have the item', () => {
					expect(map.has(keyOne, keyTwo)).toEqual(true);
				});

				it('should return the value when asked', () => {
					expect(map.get(keyOne, keyTwo)).toEqual(replaced);
				});
			});

			describe('and another item, with the same first key, is put into the map', () => {
				let valueB;

				let keyOneB;
				let keyTwoB;

				beforeEach(() => {
					map.put(valueB = 'bob', keyOneB = keyOne, keyTwoB = 'o');
				});

				it('should have the item', () => {
					expect(map.has(keyOneB, keyTwoB)).toEqual(true);
				});

				it('should return the value when asked', () => {
					expect(map.get(keyOneB, keyTwoB)).toEqual(valueB);
				});

				it('should still have the original item', () => {
					expect(map.has(keyOne, keyTwo)).toEqual(true);
				});

				it('should still return the original value when asked', () => {
					expect(map.get(keyOne, keyTwo)).toEqual(value);
				});

				describe('and that item is deleted', () => {
					let result;

					beforeEach(() => {
						result = map.remove(keyOneB, keyTwoB);
					});

					it('should be a successful operation', () => {
						expect(result).toEqual(true);
					});

					it('should not have the item', () => {
						expect(map.has(keyOneB, keyTwoB)).toEqual(false);
					});

					it('should still have the original item', () => {
						expect(map.has(keyOne, keyTwo)).toEqual(true);
					});
				});

				describe('and the entire group is deleted', () => {
					let result;

					beforeEach(() => {
						result = map.remove(keyOneB);
					});

					it('should be a successful operation', () => {
						expect(result).toEqual(true);
					});

					it('should not have the item', () => {
						expect(map.has(keyOneB, keyTwoB)).toEqual(false);
					});

					it('should not have the original item', () => {
						expect(map.has(keyOne, keyTwo)).toEqual(false);
					});
				});

				describe('and an attempt to delete a non-existent key is made', () => {
					let result;

					beforeEach(() => {
						result = map.remove(keyOneB, 'xxx');
					});

					it('should be a failed operation', () => {
						expect(result).toEqual(false);
					});
				});
			});
		});

		describe('and an item with one key is put into the map', () => {
			it('should throw an error', () => {
				expect(() => { map.put('bryan', 'b'); }).toThrow();
			});
		});
	});
});