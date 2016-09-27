var array = require('./../../../lang/array');

describe('When reducing an array to unique values', function() {
	'use strict';

	describe('and using the first four rows of pascals triangle', function() {
		var unique;

		beforeEach(function() {
			unique = array.unique([ 1, 1, 1, 1, 2, 1, 1, 3, 3, 1 ]);
		});

		it('should only contain 3 unique elements', function() {
			expect(unique.length).toEqual(3);
		});

		it('should contain 1', function() {
			expect(unique.indexOf(1)).toEqual(0);
		});

		it('should contain 2', function() {
			expect(unique.indexOf(2)).toEqual(1);
		});

		it('should contain 3', function() {
			expect(unique.indexOf(3)).toEqual(2);
		});
	});
});

describe('When grouping an array', function() {
	'use strict';

	describe('and using objects containing the first three rows of pascals triangle', function() {
		var groups;

		beforeEach(function() {
			groups = array.groupBy([ { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 2 }, { value: 1 } ], function(item) { return item.value; });
		});

		it('should only contain 2 keys', function() {
			expect(Object.keys(groups).length).toEqual(2);
		});

		it('should have a key for number one', function() {
			expect(groups.hasOwnProperty(1)).toEqual(true);
		});

		it('should have five items grouped for the number one', function() {
			expect(groups[1].length).toEqual(5);
		});

		it('should an object with a value of one for each item grouped for the number one', function() {
			var group = groups[1];

			for (var i = 0; i < group.length; i++) {
				expect(group[i].value).toEqual(1);
			}
		});

		it('should have one item grouped for the number two', function() {
			expect(groups[2].length).toEqual(1);
		});

		it('should an object with a value of two for each item grouped for the number two', function() {
			var group = groups[2];

			for (var i = 0; i < group.length; i++) {
				expect(group[i].value).toEqual(2);
			}
		});
	});

	describe('When indexing an array', function() {
		describe('and using objects containing the first three prime numbers', function() {
			var groups;

			var one;
			var two;
			var three;

			beforeEach(function() {
				groups = array.indexBy([ one = { value: 1 }, two = { value: 2 }, three ={ value: 3 } ], function(item) { return item.value; });
			});

			it('should contain 3 keys', function() {
				expect(Object.keys(groups).length).toEqual(3);
			});

			it('should have a key for number one', function() {
				expect(groups.hasOwnProperty(1)).toEqual(true);
			});

			it('should have a key for number two', function() {
				expect(groups.hasOwnProperty(2)).toEqual(true);
			});

			it('should have a key for number three', function() {
				expect(groups.hasOwnProperty(3)).toEqual(true);
			});

			it('should have the first object at key one', function() {
				expect(groups[1]).toBe(one);
			});

			it('should have the first object at key one', function() {
				expect(groups[2]).toBe(two);
			});

			it('should have the first object at key one', function() {
				expect(groups[3]).toBe(three);
			});
		});
	});
});

describe('When calculating the "difference" between two arrays', function() {
	describe('and the arrays are empty', function() {
		var difference;

		beforeEach(() => {
			difference = array.difference([ ], [ ]);
		});

		it('should be an array', function() {
			expect(difference instanceof Array).toEqual(true);
		});

		it('should be empty', function() {
			expect(difference.length).toEqual(0);
		});
	});

	describe('and first array is [1,2] and the second array is [2,3]', function() {
		var difference;

		beforeEach(() => {
			difference = array.difference([1,2], [2,3]);
		});

		it('should be an array', function() {
			expect(difference instanceof Array).toEqual(true);
		});

		it('should contain one element', function() {
			expect(difference.length).toEqual(1);
		});

		it('the first element should be 1', function() {
			expect(difference[0]).toEqual(1);
		});
	});

	describe('and first array is [2,3] and the second array is [1,2]', function() {
		var difference;

		beforeEach(() => {
			difference = array.difference([2,3], [1,2]);
		});

		it('should be an array', function() {
			expect(difference instanceof Array).toEqual(true);
		});

		it('should contain one element', function() {
			expect(difference.length).toEqual(1);
		});

		it('the first element should be 3', function() {
			expect(difference[0]).toEqual(3);
		});
	});

	describe('and first array has a unique object and both arrays share an object', function() {
		var same;
		var unique;

		var difference;

		beforeEach(() => {
			same = {};

			difference = array.difference([same, unique = { }], [same]);
		});

		it('should be an array', function() {
			expect(difference instanceof Array).toEqual(true);
		});

		it('should contain one element', function() {
			expect(difference.length).toEqual(1);
		});

		it('the first element the unique object', function() {
			expect(difference[0]).toBe(unique);
		});
	});
});