import TimeMap from './../../../../collections/specialized/TimeMap.js';

describe('When an TimeMap is constructed (with a 10 millisecond time to live)', () => {
	'use strict';

	let map;

	beforeEach(() => {
		map = new TimeMap(10);
	});

	describe('and an item is added to the map', () => {
		let key;
		let item;

		beforeEach(() => {
			map.set(key = 'a', item = {});
		});

		it('should contain the key', () => {
			expect(map.has(key)).toEqual(true);
		});

		it('should return the original value', () => {
			expect(map.get(key)).toBe(item);
		});

		describe('and the item is removed', () => {
			beforeEach(() => {
				map.remove(key);
			});

			it('should not contain the key', () => {
				expect(map.has(key)).toEqual(false);
			});
		});

		describe('and the item is deleted', () => {
			beforeEach(() => {
				map.delete(key);
			});

			it('should not contain the key', () => {
				expect(map.has(key)).toEqual(false);
			});
		});

		describe('and 15 milliseconds elapses', () => {
			beforeEach((done) => {
				setTimeout(() => {
					done();
				}, 15);
			});

			it('should not contain the key', () => {
				expect(map.has(key)).toEqual(false);
			});

			it('should not return the original value', () => {
				expect(map.get(key)).toEqual(null);
			});
		});
	});

	describe('and an item is put into the map', () => {
		let key;
		let item;

		beforeEach(() => {
			map.put(key = 'a', item = {});
		});

		it('should return the original value', () => {
			expect(map.get(key)).toBe(item);
		});
	});
});
