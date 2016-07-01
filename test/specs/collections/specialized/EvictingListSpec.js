var EvictingList = require('./../../../../collections/specialized/EvictingList');

describe('When an EvictingList is constructed (with no capacity)', function() {
	'use strict';

	var list;

	beforeEach(function() {
		list = new EvictingList();
	});

	it('should be empty', function() {
		expect(list.empty()).toEqual(true);
	});

	it('should have a capacity of 10', function() {
		expect(list.getCapacity()).toEqual(10);
	});

	describe('when dumped to an array', function() {
		var array;

		beforeEach(function() {
			array = list.toArray();
		});

		it('should be empty',function() {
			expect(array.length).toEqual(0);
		});
	});
});

describe('When an EvictingList is constructed (with a capacity of 1)', function() {
	'use strict';

	var list;

	beforeEach(function() {
		list = new EvictingList(1);
	});

	it('should be empty', function() {
		expect(list.empty()).toEqual(true);
	});

	it('should have a capacity of 1', function() {
		expect(list.getCapacity()).toEqual(1);
	});

	describe('when dumped to an array', function() {
		var array;

		beforeEach(function() {
			array = list.toArray();
		});

		it('should be empty',function() {
			expect(array.length).toEqual(0);
		});
	});

	describe('when the first item is added to the list', function() {
		var a;

		beforeEach(function() {
			list.add(a = { });
		});

		it('should not be empty',function() {
			expect(list.empty()).toEqual(false);
		});

		describe('when dumped to an array', function() {
			var array;

			beforeEach(function() {
				array = list.toArray();
			});

			it('should contain one item',function() {
				expect(array.length).toEqual(1);
			});

			it('the first item should be the first item added',function() {
				expect(array[0]).toEqual(a);
			});
		});

		describe('when the second item is added to the list', function() {
			var b;

			beforeEach(function() {
				list.add(b = { });
			});

			it('should not be empty',function() {
				expect(list.empty()).toEqual(false);
			});

			describe('when dumped to an array', function() {
				var array;

				beforeEach(function() {
					array = list.toArray();
				});

				it('should contain one item',function() {
					expect(array.length).toEqual(1);
				});

				it('the first item should be the first item added',function() {
					expect(array[0]).toEqual(b);
				});
			});
		});
	});
});

describe('When an EvictingList is constructed (with a capacity of 3)', function() {
	'use strict';

	var list;

	beforeEach(function() {
		list = new EvictingList(3);
	});

	it('should be empty', function() {
		expect(list.empty()).toEqual(true);
	});

	it('should have a capacity of 1', function() {
		expect(list.getCapacity()).toEqual(3);
	});

	describe('and five items are added to the list', function() {
		var a;
		var b;
		var c;
		var d;
		var e;

		beforeEach(function() {
			list.add(a = { });
			list.add(b = { });
			list.add(c = { });
			list.add(d = { });
			list.add(e = { });
		});

		it('should not be empty',function() {
			expect(list.empty()).toEqual(false);
		});

		describe('when dumped to an array', function() {
			var array;

			beforeEach(function() {
				array = list.toArray();
			});

			it('should contain three items',function() {
				expect(array.length).toEqual(3);
			});

			it('the first item should be the last item added',function() {
				expect(array[0]).toEqual(e);
			});

			it('the second item should be the second to last item added',function() {
				expect(array[1]).toEqual(d);
			});

			it('the third item should be the second to last item added',function() {
				expect(array[2]).toEqual(c);
			});
		});

		describe('and 100 more items are added to the list', function() {
			var items = [ ];

			beforeEach(function() {
				for (var i = 0; i < 100; i++) {
					items[i] = { };
				}
			});

			describe('when dumped to an array', function() {
				var array;

				beforeEach(function() {
					array = list.toArray();
				});

				it('should contain three items',function() {
					expect(array.length).toEqual(3);
				});

				it('the first item should be the last item added',function() {
					expect(array[0]).toEqual(items[99]);
				});

				it('the second item should be the second to last item added',function() {
					expect(array[1]).toEqual(items[98]);
				});

				it('the third item should be the second to last item added',function() {
					expect(array[2]).toEqual(items[97]);
				});
			});
		});
	});
});