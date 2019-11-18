const array = require('./../../../lang/array');

describe('when reducing an array to unique values', () => {
	'use strict';

	describe('and using the first four rows of pascals triangle', () => {
		let unique;

		beforeEach(() => {
			unique = array.unique([ 1, 1, 1, 1, 2, 1, 1, 3, 3, 1 ]);
		});

		it('should only contain 3 unique elements', () => {
			expect(unique.length).toEqual(3);
		});

		it('should contain 1', () => {
			expect(unique.indexOf(1)).toEqual(0);
		});

		it('should contain 2', () => {
			expect(unique.indexOf(2)).toEqual(1);
		});

		it('should contain 3', () => {
			expect(unique.indexOf(3)).toEqual(2);
		});
	});
});

describe('when reducing an array of objects to unique values', () => {
	'use strict';

	describe('and using the first four rows of pascals triangle', () => {
		let unique;

		let one;
		let two;
		let three;
		let four;
		let five;
		let six;

		beforeEach(() => {
			unique = array.uniqueBy([ one = { x: 1 }, two = { x: 2 }, three = { x: 3 }, four = { x: 1 }, five = { x: 2 }, six = { x: 3 } ], (obj) => { return obj.x; });
		});

		it('should only contain 3 unique elements', () => {
			expect(unique.length).toEqual(3);
		});

		it('should contain the first item whose value is one', () => {
			expect(unique[0]).toBe(one);
		});

		it('should contain the first item whose value is two', () => {
			expect(unique[1]).toBe(two);
		});

		it('should contain the first item whose value is three', () => {
			expect(unique[2]).toBe(three);
		});
	});
});

describe('when partitioning an array of three items', () => {
	'use strict';

	let original;

	beforeEach(() => {
		original = [ 1, 2, 3 ];
	});

	describe('using a partition size of 10', () => {
		let partitions;

		beforeEach(() => {
			partitions = array.partition(original, 10);
		});

		it('should return an array', () => {
			expect(partitions instanceof Array).toEqual(true);
		});

		it('should return a copy of the original array', () => {
			expect(partitions).not.toBe(original);
		});

		it('should contain one partition', () => {
			expect(partitions.length).toEqual(1);
		});

		it('the first partition should contain three items', () => {
			expect(partitions[0].length).toEqual(3);
		});

		it('the first partition item should be the first item', () => {
			expect(partitions[0][0]).toBe(original[0]);
		});

		it('the second partition item should be the first item', () => {
			expect(partitions[0][1]).toBe(original[1]);
		});

		it('the third partition item should be the first item', () => {
			expect(partitions[0][2]).toBe(original[2]);
		});
	});

	describe('using a partition size of two', () => {
		let partitions;

		beforeEach(() => {
			partitions = array.partition(original, 2);
		});

		it('should return an array', () => {
			expect(partitions instanceof Array).toEqual(true);
		});

		it('should return a copy of the original array', () => {
			expect(partitions).not.toBe(original);
		});

		it('should contain two partition', () => {
			expect(partitions.length).toEqual(2);
		});

		it('the first partition should contain two items', () => {
			expect(partitions[0].length).toEqual(2);
		});

		it('the second partition should contain one item', () => {
			expect(partitions[1].length).toEqual(1);
		});

		it('the first item of the first partition should be the first item', () => {
			expect(partitions[0][0]).toBe(original[0]);
		});

		it('the second item of the first partition should be the second item', () => {
			expect(partitions[0][1]).toBe(original[1]);
		});

		it('the first item of the second partition should be the third item', () => {
			expect(partitions[1][0]).toBe(original[2]);
		});
	});
});

describe('when partitioning empty array', () => {
	'use strict';

	let original;

	beforeEach(() => {
		original = [ ];
	});

	describe('using a partition size of 10', () => {
		let partitions;

		beforeEach(() => {
			partitions = array.partition(original, 10);
		});

		it('an empty array should be returned', () => {
			expect(partitions.length).toEqual(0);
		});
	});
});

describe('when flattening an array', () => {
	'use strict';

	let arrayOne;
	let arrayTwo;

	let itemA;
	let itemB;
	let itemC;
	let itemD;

	beforeEach(() => {
		arrayOne = [ itemA = 'a', itemB = 'b', itemC =[ 'c' ]];
		arrayTwo = [ itemD = 'd' ];
	});

	describe('without using recursion', () => {
		let result;

		beforeEach(() => {
			result = array.flatten([ arrayOne, arrayTwo ], false);
		});

		it('the first item should be "a"', () => {
			expect(result[0]).toBe(itemA);
		});

		it('the second item should be "b"', () => {
			expect(result[1]).toBe(itemB);
		});

		it('the third item should be "c"', () => {
			expect(result[2]).toBe(itemC);
		});

		it('the forth item should be "d"', () => {
			expect(result[3]).toBe(itemD);
		});
	});

	describe('and using recursion', () => {
		let result;

		beforeEach(() => {
			result = array.flatten([ arrayOne, arrayTwo ], true);
		});

		it('the first item should be "a"', () => {
			expect(result[0]).toBe(itemA);
		});

		it('the second item should be "b"', () => {
			expect(result[1]).toBe(itemB);
		});

		it('the third item should be "c"', () => {
			expect(result[2]).toBe('c');
		});

		it('the forth item should be "d"', () => {
			expect(result[3]).toBe(itemD);
		});
	});
});

describe('when grouping an array', () => {
	'use strict';

	describe('and using objects containing the first three rows of pascals triangle', () => {
		let groups;

		beforeEach(() => {
			groups = array.groupBy([ { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 2 }, { value: 1 } ], (item) => { return item.value; });
		});

		it('should only contain 2 keys', () => {
			expect(Object.keys(groups).length).toEqual(2);
		});

		it('should have a key for number one', () => {
			expect(groups.hasOwnProperty(1)).toEqual(true);
		});

		it('should have five items grouped for the number one', () => {
			expect(groups[1].length).toEqual(5);
		});

		it('should an object with a value of one for each item grouped for the number one', () => {
			let group = groups[1];

			for (let i = 0; i < group.length; i++) {
				expect(group[i].value).toEqual(1);
			}
		});

		it('should have one item grouped for the number two', () => {
			expect(groups[2].length).toEqual(1);
		});

		it('should an object with a value of two for each item grouped for the number two', () => {
			let group = groups[2];

			for (let i = 0; i < group.length; i++) {
				expect(group[i].value).toEqual(2);
			}
		});
	});

	describe('when indexing an array', () => {
		describe('and using objects containing the first three prime numbers', () => {
			let groups;

			let one;
			let two;
			let three;

			beforeEach(() => {
				groups = array.indexBy([ one = { value: 1 }, two = { value: 2 }, three ={ value: 3 } ], (item) => { return item.value; });
			});

			it('should contain 3 keys', () => {
				expect(Object.keys(groups).length).toEqual(3);
			});

			it('should have a key for number one', () => {
				expect(groups.hasOwnProperty(1)).toEqual(true);
			});

			it('should have a key for number two', () => {
				expect(groups.hasOwnProperty(2)).toEqual(true);
			});

			it('should have a key for number three', () => {
				expect(groups.hasOwnProperty(3)).toEqual(true);
			});

			it('should have the first object at key one', () => {
				expect(groups[1]).toBe(one);
			});

			it('should have the first object at key one', () => {
				expect(groups[2]).toBe(two);
			});

			it('should have the first object at key one', () => {
				expect(groups[3]).toBe(three);
			});
		});
	});
});

describe('when batching an array', () => {
	describe('when keys are sorted', () => {
		let batches;
		let one, two, three, four, five;

		beforeEach(() => {
			batches = array.batchBy([ one = { value: 'a' }, two = { value: 'b' }, three ={ value: 'b' }, four ={ value: 'c' }, five ={ value: 'c' } ], (item) => { return item.value; });
		});

		it('should contain 3 batches', () => {
			expect(batches.length).toEqual(3);
		});

		it('should have 1 item in first batch', () => {
			expect(batches[0].length).toEqual(1);
		});

		it('should have 2 items in second batch', () => {
			expect(batches[1].length).toEqual(2);
		});

		it('should have 2 items in third batch', () => {
			expect(batches[2].length).toEqual(2);
		});
	});

	describe('when keys are not sorted', () => {
		let batches;
		let one, two, three, four, five;

		beforeEach(() => {
			batches = array.batchBy([ one = { value: 'a' }, two = { value: 'b' }, three ={ value: 'c' }, four ={ value: 'a' }, five ={ value: 'a' } ], (item) => { return item.value; });
		});

		it('should contain 4 batches', () => {
			expect(batches.length).toEqual(4);
		});

		it('should have 1 item in first batch', () => {
			expect(batches[0].length).toEqual(1);
		});

		it('should have 1 item in second batch', () => {
			expect(batches[1].length).toEqual(1);
		});

		it('should have 1 item in third batch', () => {
			expect(batches[2].length).toEqual(1);
		});

		it('should have 2 items in fourth batch', () => {
			expect(batches[3].length).toEqual(2);
		});
	});
});

describe('when calculating the "difference" between two arrays', () => {
	describe('and the arrays are empty', () => {
		let difference;

		beforeEach(() => {
			difference = array.difference([ ], [ ]);
		});

		it('should be an array', () => {
			expect(difference instanceof Array).toEqual(true);
		});

		it('should be empty', () => {
			expect(difference.length).toEqual(0);
		});
	});

	describe('and first array is [1,2] and the second array is [2,3]', () => {
		let difference;

		beforeEach(() => {
			difference = array.difference([1,2], [2,3]);
		});

		it('should be an array', () => {
			expect(difference instanceof Array).toEqual(true);
		});

		it('should contain one element', () => {
			expect(difference.length).toEqual(1);
		});

		it('the first element should be 1', () => {
			expect(difference[0]).toEqual(1);
		});
	});

	describe('and first array is [2,3] and the second array is [1,2]', () => {
		let difference;

		beforeEach(() => {
			difference = array.difference([2,3], [1,2]);
		});

		it('should be an array', () => {
			expect(difference instanceof Array).toEqual(true);
		});

		it('should contain one element', () => {
			expect(difference.length).toEqual(1);
		});

		it('the first element should be 3', () => {
			expect(difference[0]).toEqual(3);
		});
	});

	describe('and first array has a unique object and both arrays share an object', () => {
		let same;
		let unique;

		let difference;

		beforeEach(() => {
			same = {};

			difference = array.difference([same, unique = { }], [same]);
		});

		it('should be an array', () => {
			expect(difference instanceof Array).toEqual(true);
		});

		it('should contain one element', () => {
			expect(difference.length).toEqual(1);
		});

		it('the first element should be the unique object', () => {
			expect(difference[0]).toBe(unique);
		});
	});

	describe('and second array has a unique object and both arrays share an object', () => {
		let same;
		let unique;

		let difference;

		beforeEach(() => {
			same = {};

			difference = array.difference([same], [same, unique = { }]);
		});

		it('should be an array', () => {
			expect(difference instanceof Array).toEqual(true);
		});

		it('should contain zero elements', () => {
			expect(difference.length).toEqual(0);
		});
	});
});

describe('when calculating the "difference" between two arrays using key selectors', () => {
	describe('and the arrays are empty', () => {
		let difference;

		beforeEach(() => {
			difference = array.differenceBy([ ], [ ], x => x.key);
		});

		it('should be an array', () => {
			expect(difference instanceof Array).toEqual(true);
		});

		it('should be empty', () => {
			expect(difference.length).toEqual(0);
		});
	});

	describe('and first array is [{key:1}, {key:2}] and the second array is [{key:2}, {key:3}]', () => {
		let difference;

		beforeEach(() => {
			difference = array.differenceBy([{key:1},{key:2}], [{key:2},{key:3}], x => x.key);
		});

		it('should be an array', () => {
			expect(difference instanceof Array).toEqual(true);
		});

		it('should contain one element', () => {
			expect(difference.length).toEqual(1);
		});

		it('the first element key should be 1', () => {
			expect(difference[0].key).toEqual(1);
		});
	});

	describe('and first array is [{key:2}, {key:3}] and the second array is [{key:1}, {key:2}] ', () => {
		let difference;

		beforeEach(() => {
			difference = array.differenceBy([{key:2}, {key:3}], [{key:1}, {key:2}], x => x.key);
		});

		it('should be an array', () => {
			expect(difference instanceof Array).toEqual(true);
		});

		it('should contain one element', () => {
			expect(difference.length).toEqual(1);
		});

		it('the first element key should be 3', () => {
			expect(difference[0].key).toEqual(3);
		});
	});
});

describe('when calculating the "union" of two arrays', () => {
	describe('and the arrays are empty', () => {
		let union;

		beforeEach(() => {
			union = array.union([ ], [ ]);
		});

		it('should be an array', () => {
			expect(union instanceof Array).toEqual(true);
		});

		it('should be empty', () => {
			expect(union.length).toEqual(0);
		});
	});

	describe('and first array is [1,2] and the second array is [2,3]', () => {
		let union;

		beforeEach(() => {
			union = array.union([1,2], [2,3]);
		});

		it('should be an array', () => {
			expect(union instanceof Array).toEqual(true);
		});

		it('should contain three elements', () => {
			expect(union.length).toEqual(3);
		});

		it('the first element should be 1', () => {
			expect(union[0]).toEqual(1);
		});

		it('the second element should be 2', () => {
			expect(union[1]).toEqual(2);
		});

		it('the third element should be 3', () => {
			expect(union[2]).toEqual(3);
		});
	});

	describe('and first array has a unique object and both arrays share an object', () => {
		let same;
		let unique;

		let union;

		beforeEach(() => {
			same = {};

			union = array.union([same, unique = { }], [same]);
		});

		it('should be an array', () => {
			expect(union instanceof Array).toEqual(true);
		});

		it('should contain two elements', () => {
			expect(union.length).toEqual(2);
		});

		it('the first element the should be "same" object', () => {
			expect(union[0]).toBe(same);
		});

		it('the second element the should be "unique" object', () => {
			expect(union[1]).toBe(unique);
		});
	});
});

describe('when calculating the "union" of two arrays using key selectors', () => {
	describe('and the arrays are empty', () => {
		let union;

		beforeEach(() => {
			union = array.unionBy([ ], [ ], x => x.key);
		});

		it('should be an array', () => {
			expect(union instanceof Array).toEqual(true);
		});

		it('should be empty', () => {
			expect(union.length).toEqual(0);
		});
	});

	describe('and first array is [{key:1}, {key:2}] and the second array is [{key:2}, {key:3}]', () => {
		let union;

		beforeEach(() => {
			union = array.unionBy([{key:1},{key:2}], [{key:2},{key:3}], x => x.key);
		});

		it('should be an array', () => {
			expect(union instanceof Array).toEqual(true);
		});

		it('should contain three elements', () => {
			expect(union.length).toEqual(3);
		});

		it('the first element key should be 1', () => {
			expect(union[0].key).toEqual(1);
		});

		it('the second element key should be 2', () => {
			expect(union[1].key).toEqual(2);
		});

		it('the third element key should be 3', () => {
			expect(union[2].key).toEqual(3);
		});
	});

	describe('and first array has a unique object and both arrays share an object', () => {
		let union;

		beforeEach(() => {
			union = array.unionBy([{key:1},{key:2}], [{key:2}], x => x.key);
		});

		it('should be an array', () => {
			expect(union instanceof Array).toEqual(true);
		});

		it('should contain two elements', () => {
			expect(union.length).toEqual(2);
		});

		it('the first element key the should be "same" object key', () => {
			expect(union[0].key).toEqual(1);
		});

		it('the second element key the should be "unique" object key', () => {
			expect(union[1].key).toEqual(2);
		});
	});
});

describe('when calculating the "intersection" of two arrays', () => {
	describe('and the arrays are empty', () => {
		let intersection;

		beforeEach(() => {
			intersection = array.intersection([ ], [ ]);
		});

		it('should be an array', () => {
			expect(intersection instanceof Array).toEqual(true);
		});

		it('should be empty', () => {
			expect(intersection.length).toEqual(0);
		});
	});

	describe('and first array is [1,2] and the second array is [2,3]', () => {
		let intersection;

		beforeEach(() => {
			intersection = array.intersection([1,2], [2,3]);
		});

		it('should be an array', () => {
			expect(intersection instanceof Array).toEqual(true);
		});

		it('should contain one element', () => {
			expect(intersection.length).toEqual(1);
		});

		it('the first element should be 2', () => {
			expect(intersection[0]).toEqual(2);
		});
	});

	describe('and first array has a unique object and both arrays share an object', () => {
		let same;
		let unique;

		let intersection;

		beforeEach(() => {
			same = {};

			intersection = array.intersection([same, unique = { }], [same]);
		});

		it('should be an array', () => {
			expect(intersection instanceof Array).toEqual(true);
		});

		it('should contain one elements', () => {
			expect(intersection.length).toEqual(1);
		});

		it('the first element the "same" object', () => {
			expect(intersection[0]).toBe(same);
		});
	});
});

describe('when calculating the "intersection" of two arrays using key selectors', () => {
	describe('and the arrays are empty', () => {
		let intersection;

		beforeEach(() => {
			intersection = array.intersectionBy([ ], [ ], x => x.key);
		});

		it('should be an array', () => {
			expect(intersection instanceof Array).toEqual(true);
		});

		it('should be empty', () => {
			expect(intersection.length).toEqual(0);
		});
	});

	describe('and first array is [{key:1}, {key:2}] and the second array is [{key:2}, {key:3}]', () => {
		let intersection;

		beforeEach(() => {
			intersection = array.intersectionBy([{key:1},{key:2}], [{key:2},{key:3}], x => x.key);
		});

		it('should be an array', () => {
			expect(intersection instanceof Array).toEqual(true);
		});

		it('should contain one element', () => {
			expect(intersection.length).toEqual(1);
		});

		it('the first element should have key 2', () => {
			expect(intersection[0].key).toEqual(2);
		});
	});

	describe('and first array has a unique object and both arrays share an object', () => {
		let same;
		let unique;

		let intersection;

		beforeEach(() => {
			intersection = array.intersectionBy([{key:1},{key:2}], [{key:2}], x => x.key);
		});

		it('should be an array', () => {
			expect(intersection instanceof Array).toEqual(true);
		});

		it('should contain one elements', () => {
			expect(intersection.length).toEqual(1);
		});

		it('the first element key should the "same" object key', () => {
			expect(intersection[0].key).toEqual(2);
		});
	});
});

describe('when calculating the "symmetric difference" of two arrays', () => {
	describe('and the arrays are empty', () => {
		let difference;

		beforeEach(() => {
			difference = array.differenceSymmetric([ ], [ ]);
		});

		it('should be an array', () => {
			expect(difference instanceof Array).toEqual(true);
		});

		it('should be empty', () => {
			expect(difference.length).toEqual(0);
		});
	});

	describe('and first array is [1,2] and the second array is [2,3]', () => {
		let difference;

		beforeEach(() => {
			difference = array.differenceSymmetric([1,2], [2,3]);
		});

		it('should be an array', () => {
			expect(difference instanceof Array).toEqual(true);
		});

		it('should contain two elements', () => {
			expect(difference.length).toEqual(2);
		});

		it('the first element should be 1', () => {
			expect(difference[0]).toEqual(1);
		});

		it('the second element should be 3', () => {
			expect(difference[1]).toEqual(3);
		});
	});

	describe('and first array has a unique object and both arrays share an object', () => {
		let same;
		let unique;

		let difference;

		beforeEach(() => {
			same = {};

			difference = array.differenceSymmetric([same, unique = { }], [same]);
		});

		it('should be an array', () => {
			expect(difference instanceof Array).toEqual(true);
		});

		it('should contain one elements', () => {
			expect(difference.length).toEqual(1);
		});

		it('the first element the "unique" object', () => {
			expect(difference[0]).toBe(unique);
		});
	});
});

describe('when calculating the "symmetric difference" of two arrays using key selectors', () => {
	describe('and the arrays are empty', () => {
		let difference;

		beforeEach(() => {
			difference = array.differenceSymmetricBy([ ], [ ], x => x.key);
		});

		it('should be an array', () => {
			expect(difference instanceof Array).toEqual(true);
		});

		it('should be empty', () => {
			expect(difference.length).toEqual(0);
		});
	});

	describe('and first array is [{key:1}, {key:2}] and the second array is [{key:2}, {key:3}]', () => {
		let difference;

		beforeEach(() => {
			difference = array.differenceSymmetricBy([{key:1},{key:2}], [{key:2},{key:3}], x => x.key);
		});

		it('should be an array', () => {
			expect(difference instanceof Array).toEqual(true);
		});

		it('should contain two elements', () => {
			expect(difference.length).toEqual(2);
		});

		it('the first element should have key 1', () => {
			expect(difference[0].key).toEqual(1);
		});

		it('the second element should be 3', () => {
			expect(difference[1].key).toEqual(3);
		});
	});


	describe('and first array has a unique object and both arrays share an object', () => {
		let difference;

		beforeEach(() => {
			difference = array.differenceSymmetricBy([{key:1},{key:2}], [{key:2}], x => x.key);
		});

		it('should be an array', () => {
			expect(difference instanceof Array).toEqual(true);
		});

		it('should contain one elements', () => {
			expect(difference.length).toEqual(1);
		});

		it('the first element the "unique" object', () => {
			expect(difference[0].key).toEqual(1);
		});
	});
});

describe('when taking the first item of an array', () => {
	it('an undefined value should be returned from an empty array', () => {
		let value = array.first([ ]);

		expect(value).toEqual(undefined);
	});

	it('the first value should be returned from a non-empty array', () => {
		let a = { };
		let b = { };

		let value = array.first([ a, b ]);

		expect(value).toBe(a);
	});
});

describe('when taking the last item of an array', () => {
	it('an undefined value should be returned from an empty array', () => {
		let value = array.last([ ]);

		expect(value).toEqual(undefined);
	});

	it('the last value should be returned from a non-empty array', () => {
		let a = { };
		let b = { };

		let value = array.last([ a, b ]);

		expect(value).toBe(b);
	});
});

describe('when removing an item from an array using a predicate', () => {
	let a;
	let item;

	beforeEach(() => {
		a = [ { }, item = { }, { } ];

		let predicate = (i) => {
			return i === item;
		};

		array.remove(a, predicate);
	});

	it('should have two items', () => {
		expect(a.length).toEqual(2);
	});

	it('the first item should not be the removed item', () => {
		expect(a[0]).not.toBe(item);
	});

	it('the second item should not be the removed item', () => {
		expect(a[1]).not.toBe(item);
	});
});