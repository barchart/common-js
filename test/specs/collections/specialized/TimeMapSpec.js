var TimeMap = require('./../../../../collections/specialized/TimeMap');

describe('When an TimeMap is constructed (with a 10 millisecond time to live)', function() {
	'use strict';

	var map;

	beforeEach(function() {
		map = new TimeMap(10);
	});

	describe('and an item is added to the map', function() {
		var key;
		var item;

		beforeEach(function() {
			try {
				map.set(key = 'a', item = {});
			} catch (e) {
				console.log(e);
			}
		});

		it('should contain the key', function() {
			expect(map.has(key)).toEqual(true);
		});

		it('should return the original value', function() {
			expect(map.get(key)).toBe(item);
		});

		describe('and 15 milliseconds elapses', function() {
			beforeEach(function(done) {
				setTimeout(function() {
					done();
				}, 15);
			});

			it('should not contain the key', function() {
				expect(map.has(key)).toEqual(false);
			});

			it('should not return the original value', function() {
				expect(map.get(key)).toEqual(null);
			});
		});
	});
});