var EvictingMap = require('./../../../../collections/specialized/EvictingMap');

describe('When an EvictingMap is constructed (with no capacity)', function() {
	'use strict';

	var map;

	beforeEach(function() {
		map = new EvictingMap();
	});

	it('should be empty', function() {
		expect(map.empty()).toEqual(true);
	});

	it('should have a capacity of 10', function() {
		expect(map.getCapacity()).toEqual(10);
	});
});

describe('When an EvictingMap is constructed (with a capacity of 1)', function() {
	'use strict';

	var map;

	beforeEach(function() {
		map = new EvictingMap(1);
	});

	it('should be empty', function() {
		expect(map.empty()).toEqual(true);
	});

	it('should have a capacity of 1', function() {
		expect(map.getCapacity()).toEqual(1);
	});

	describe('when an item is added to the map', function() {
		var a;

		beforeEach(function() {
			a = { key: 'a' };

			map.put(a.key, a);
		});

		it('get should return the item', function() {
			expect(map.get(a.key)).toBe(a);
		});

		it('should not be empty',function() {
			expect(map.empty()).toEqual(false);
		});

		it('should have one item',function() {
			expect(map.getSize()).toEqual(1);
		});

		describe('when a second item is added to the map', function() {
			var b;

			beforeEach(function() {
				b = { key: 'b' };

				map.put(b.key, b);
			});

			it('get should return the second item', function() {
				expect(map.get(b.key)).toBe(b);
			});

			it('get should not return the first item', function() {
				expect(map.get(a.key)).toEqual(null);
			});

			it('should not be empty',function() {
				expect(map.empty()).toEqual(false);
			});

			it('should have one item',function() {
				expect(map.getSize()).toEqual(1);
			});

			describe('when a third item is added to the map', function() {
				var c;

				beforeEach(function() {
					c = { key: 'c' };

					map.put(c.key, c);
				});

				it('get should return the third item', function() {
					expect(map.get(c.key)).toBe(c);
				});

				it('get should not return the first item', function() {
					expect(map.get(a.key)).toEqual(null);
				});

				it('get should not return the second item', function() {
					expect(map.get(b.key)).toEqual(null);
				});

				it('should not be empty',function() {
					expect(map.empty()).toEqual(false);
				});

				it('should have one item',function() {
					expect(map.getSize()).toEqual(1);
				});
			});
		});

		describe('when the first item is removed from the map', function() {
			beforeEach(function() {
				map.remove('a');
			});

			it('should be empty',function() {
				expect(map.empty()).toEqual(true);
			});

			it('should have zero items',function() {
				expect(map.getSize()).toEqual(0);
			});

			describe('when the item is added to the map again', function() {
				beforeEach(function() {
					map.put(a.key, a);
				});

				it('get should return the item', function() {
					expect(map.get(a.key)).toBe(a);
				});

				it('should not be empty',function() {
					expect(map.empty()).toEqual(false);
				});

				it('should have one item',function() {
					expect(map.getSize()).toEqual(1);
				});
			});
		});
	});
});