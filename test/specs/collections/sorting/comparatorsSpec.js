var comparators = require('./../../../../collections/sorting/comparators');

describe('When using the "compareDates" comparator', function() {
	'use strict';

	var first = new Date(2015, 12, 1);
	var second = new Date(2015, 12, 31);
	var third = new Date(2016, 1, 31);

	describe('to sort an array of Date instances', function() {
		var arrayToSort;

		beforeEach(function() {
			arrayToSort = [second, first, third];

			arrayToSort.sort(comparators.compareDates);
		});

		it('the array should be in the correct order', function() {
			expect(arrayToSort[0]).toBe(first);
			expect(arrayToSort[1]).toBe(second);
			expect(arrayToSort[2]).toBe(third);
		});
	});

	describe('to sort an array that contains something other than Date instances', function() {
		it('an error should be thrown', function() {
			expect(function() {
				var arrayToSort = [second, first, third, '1-1-2017'];

				arrayToSort.sort(comparators.compareDates);
			}).toThrow();
		});
	});
});

describe('When using the "compareNumbers" comparator', function() {
	'use strict';

	var first = -1;
	var second = Math.E;
	var third = Math.PI;

	describe('to sort an array of numbers', function() {
		var arrayToSort;

		beforeEach(function() {
			arrayToSort = [second, first, third];

			arrayToSort.sort(comparators.compareNumbers);
		});

		it('the array should be in the correct order', function() {
			expect(arrayToSort[0]).toBe(first);
			expect(arrayToSort[1]).toBe(second);
			expect(arrayToSort[2]).toBe(third);
		});
	});

	describe('to sort an array that contains something other than numbers', function() {
		it('an error should be thrown', function() {
			expect(function() {
				var arrayToSort = [second, first, third, null];

				arrayToSort.sort(comparators.compareNumbers);
			}).toThrow();
		});
	});
});

describe('When using the "compareStrings" comparator', function() {
	'use strict';

	var first = '';
	var second = 'Bye now';
	var third = 'Hi there';

	describe('to sort an array of strings', function() {
		var arrayToSort;

		beforeEach(function() {
			arrayToSort = [third, first, second];

			arrayToSort.sort(comparators.compareStrings);
		});

		it('the array should be in the correct order', function() {
			expect(arrayToSort[0]).toBe(first);
			expect(arrayToSort[1]).toBe(second);
			expect(arrayToSort[2]).toBe(third);
		});
	});

	describe('to sort an array that contains something other than strings', function() {
		it('an error should be thrown', function() {
			expect(function() {
				var arrayToSort = [second, first, third, 7];

				arrayToSort.sort(comparators.compareStrings);
			}).toThrow();
		});
	});
});