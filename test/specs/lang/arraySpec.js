var array = require('./../../../lang/array');

describe('when reducing an array to unique values', function() {
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

describe('when reducing an array of objects to unique values', function() {
	'use strict';

	describe('and using the first four rows of pascals triangle', function() {
		var unique;

		var one;
		var two;
		var three;

		beforeEach(function() {
			unique = array.uniqueBy([ one = { x: 1 }, { x: 1 }, { x: 1 }, { x: 1 }, two = { x: 2 }, { x: 1 }, { x: 1 }, three = { x: 3 }, { x: 3 }, { x: 1 } ], function(obj) { return obj.x; });
		});

		it('should only contain 3 unique elements', function() {
			expect(unique.length).toEqual(3);
		});

		it('should contain the first item whose value is one', function() {
			expect(unique[0]).toBe(one);
		});

		it('should contain the first item whose value is two', function() {
			expect(unique[1]).toBe(two);
		});

		it('should contain the first item whose value is three', function() {
			expect(unique[2]).toBe(three);
		});
	});
});

describe('when partitioning an array of three items', function() {
	'use strict';

	var original;

	beforeEach(function() {
		original = [ 1, 2, 3 ];
	});

	describe('using a partition size of 10', function() {
		var partitions;

		beforeEach(function() {
			partitions = array.partition(original, 10);
		});

		it('should return an array', function() {
			expect(partitions instanceof Array).toEqual(true);
		});

		it('should return a copy of the original array', function() {
			expect(partitions).not.toBe(original);
		});

		it('should contain one partition', function() {
			expect(partitions.length).toEqual(1);
		});

		it('the first partition should contain three items', function() {
			expect(partitions[0].length).toEqual(3);
		});

		it('the first partition item should be the first item', function() {
			expect(partitions[0][0]).toBe(original[0]);
		});

		it('the second partition item should be the first item', function() {
			expect(partitions[0][1]).toBe(original[1]);
		});

		it('the third partition item should be the first item', function() {
			expect(partitions[0][2]).toBe(original[2]);
		});
	});

	describe('using a partition size of two', function() {
		var partitions;

		beforeEach(function() {
			partitions = array.partition(original, 2);
		});

		it('should return an array', function() {
			expect(partitions instanceof Array).toEqual(true);
		});

		it('should return a copy of the original array', function() {
			expect(partitions).not.toBe(original);
		});

		it('should contain two partition', function() {
			expect(partitions.length).toEqual(2);
		});

		it('the first partition should contain two items', function() {
			expect(partitions[0].length).toEqual(2);
		});

		it('the second partition should contain one item', function() {
			expect(partitions[1].length).toEqual(1);
		});

		it('the first item of the first partition should be the first item', function() {
			expect(partitions[0][0]).toBe(original[0]);
		});

		it('the second item of the first partition should be the second item', function() {
			expect(partitions[0][1]).toBe(original[1]);
		});

		it('the first item of the second partition should be the third item', function() {
			expect(partitions[1][0]).toBe(original[2]);
		});
	});
});

describe('when flattening an array', function() {
	'use strict';

	var arrayOne;
	var arrayTwo;

	var itemA;
	var itemB;
	var itemC;
	var itemD;

	beforeEach(function() {
		arrayOne = [ itemA = 'a', itemB = 'b', itemC =[ 'c' ]];
		arrayTwo = [ itemD = 'd' ];
	});

	describe('without using recursion', function() {
		var result;

		beforeEach(function() {
			result = array.flatten([ arrayOne, arrayTwo ], false);
		});

		it('the first item should be "a"', function() {
			expect(result[0]).toBe(itemA);
		});

		it('the second item should be "b"', function() {
			expect(result[1]).toBe(itemB);
		});

		it('the third item should be "c"', function() {
			expect(result[2]).toBe(itemC);
		});

		it('the forth item should be "d"', function() {
			expect(result[3]).toBe(itemD);
		});
	});

	describe('and using recursion', function() {
		var result;

		beforeEach(function() {
			result = array.flatten([ arrayOne, arrayTwo ], true);
		});

		it('the first item should be "a"', function() {
			expect(result[0]).toBe(itemA);
		});

		it('the second item should be "b"', function() {
			expect(result[1]).toBe(itemB);
		});

		it('the third item should be "c"', function() {
			expect(result[2]).toBe('c');
		});

		it('the forth item should be "d"', function() {
			expect(result[3]).toBe(itemD);
		});
	});
});

describe('when grouping an array', function() {
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

	describe('when indexing an array', function() {
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

describe('when batching an array', function() {
	describe('when keys are sorted', function() {
		var batches;
		var one, two, three, four, five;

		beforeEach(function() {
			batches = array.batchBy([ one = { value: 'a' }, two = { value: 'b' }, three ={ value: 'b' }, four ={ value: 'c' }, five ={ value: 'c' } ], function(item) { return item.value; });
		});

		it('should contain 3 batches', function() {
			expect(batches.length).toEqual(3);
		});

		it('should have 1 item in first batch', function() {
			expect(batches[0].length).toEqual(1);
		});

		it('should have 2 items in second batch', function() {
			expect(batches[1].length).toEqual(2);
		});

		it('should have 2 items in third batch', function() {
			expect(batches[2].length).toEqual(2);
		});
	});

	describe('when keys are not sorted', function() {
		var batches;
		var one, two, three, four, five;

		beforeEach(function() {
			batches = array.batchBy([ one = { value: 'a' }, two = { value: 'b' }, three ={ value: 'c' }, four ={ value: 'a' }, five ={ value: 'a' } ], function(item) { return item.value; });
		});

		it('should contain 4 batches', function() {
			expect(batches.length).toEqual(4);
		});

		it('should have 1 item in first batch', function() {
			expect(batches[0].length).toEqual(1);
		});

		it('should have 1 item in second batch', function() {
			expect(batches[1].length).toEqual(1);
		});

		it('should have 1 item in third batch', function() {
			expect(batches[2].length).toEqual(1);
		});

		it('should have 2 items in fourth batch', function() {
			expect(batches[3].length).toEqual(2);
		});
	});
});

describe('when calculating the "difference" between two arrays', function() {
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

		it('the first element should be the unique object', function() {
			expect(difference[0]).toBe(unique);
		});
	});

	describe('and second array has a unique object and both arrays share an object', function() {
		var same;
		var unique;

		var difference;

		beforeEach(() => {
			same = {};

			difference = array.difference([same], [same, unique = { }]);
		});

		it('should be an array', function() {
			expect(difference instanceof Array).toEqual(true);
		});

		it('should contain zero elements', function() {
			expect(difference.length).toEqual(0);
		});
	});
});

describe('when calculating the "union" of two arrays', function() {
	describe('and the arrays are empty', function() {
		var union;

		beforeEach(() => {
			union = array.union([ ], [ ]);
		});

		it('should be an array', function() {
			expect(union instanceof Array).toEqual(true);
		});

		it('should be empty', function() {
			expect(union.length).toEqual(0);
		});
	});

	describe('and first array is [1,2] and the second array is [2,3]', function() {
		var union;

		beforeEach(() => {
			union = array.union([1,2], [2,3]);
		});

		it('should be an array', function() {
			expect(union instanceof Array).toEqual(true);
		});

		it('should contain three elements', function() {
			expect(union.length).toEqual(3);
		});

		it('the first element should be 1', function() {
			expect(union[0]).toEqual(1);
		});

		it('the second element should be 2', function() {
			expect(union[1]).toEqual(2);
		});

		it('the third element should be 3', function() {
			expect(union[2]).toEqual(3);
		});
	});

	describe('and first array has a unique object and both arrays share an object', function() {
		var same;
		var unique;

		var difference;

		beforeEach(() => {
			same = {};

			difference = array.union([same, unique = { }], [same]);
		});

		it('should be an array', function() {
			expect(difference instanceof Array).toEqual(true);
		});

		it('should contain two elements', function() {
			expect(difference.length).toEqual(2);
		});

		it('the first element the should be "same" object', function() {
			expect(difference[0]).toBe(same);
		});

		it('the second element the should be "unique" object', function() {
			expect(difference[1]).toBe(unique);
		});
	});
});

describe('when calculating the "intersection" of two arrays', function() {
	describe('and the arrays are empty', function() {
		var intersection;

		beforeEach(() => {
			intersection = array.intersection([ ], [ ]);
		});

		it('should be an array', function() {
			expect(intersection instanceof Array).toEqual(true);
		});

		it('should be empty', function() {
			expect(intersection.length).toEqual(0);
		});
	});

	describe('and first array is [1,2] and the second array is [2,3]', function() {
		var intersection;

		beforeEach(() => {
			intersection = array.intersection([1,2], [2,3]);
		});

		it('should be an array', function() {
			expect(intersection instanceof Array).toEqual(true);
		});

		it('should contain one element', function() {
			expect(intersection.length).toEqual(1);
		});

		it('the first element should be 2', function() {
			expect(intersection[0]).toEqual(2);
		});
	});

	describe('and first array has a unique object and both arrays share an object', function() {
		var same;
		var unique;

		var intersection;

		beforeEach(() => {
			same = {};

			intersection = array.intersection([same, unique = { }], [same]);
		});

		it('should be an array', function() {
			expect(intersection instanceof Array).toEqual(true);
		});

		it('should contain one elements', function() {
			expect(intersection.length).toEqual(1);
		});

		it('the first element the "same" object', function() {
			expect(intersection[0]).toBe(same);
		});
	});
});

describe('when calculating the "symmetric difference" of two arrays', function() {
	describe('and the arrays are empty', function() {
		var difference;

		beforeEach(() => {
			difference = array.differenceSymmetric([ ], [ ]);
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
			difference = array.differenceSymmetric([1,2], [2,3]);
		});

		it('should be an array', function() {
			expect(difference instanceof Array).toEqual(true);
		});

		it('should contain two elements', function() {
			expect(difference.length).toEqual(2);
		});

		it('the first element should be 1', function() {
			expect(difference[0]).toEqual(1);
		});

		it('the second element should be 3', function() {
			expect(difference[1]).toEqual(3);
		});
	});

	describe('and first array has a unique object and both arrays share an object', function() {
		var same;
		var unique;

		var difference;

		beforeEach(() => {
			same = {};

			difference = array.differenceSymmetric([same, unique = { }], [same]);
		});

		it('should be an array', function() {
			expect(difference instanceof Array).toEqual(true);
		});

		it('should contain one elements', function() {
			expect(difference.length).toEqual(1);
		});

		it('the first element the "unique" object', function() {
			expect(difference[0]).toBe(unique);
		});
	});
});