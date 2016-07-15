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

	describe('when the an item is added to the map', function() {
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
			expect(map.empty()).toEqual(false);
		});

		describe('when a second item is added to the map', function() {

		});
	});
});