const comparators = require('./../../../../collections/sorting/comparators');

describe('When using the "compareDates" comparator', () => {
	'use strict';

	let first = new Date(2015, 12, 1);
	let second = new Date(2015, 12, 31);
	let third = new Date(2016, 1, 31);
	
	describe('to rank Date instances', () => {
		it('comparing 2019-08-27 with 2019-07-31 should return a positive value', () => {
			expect(comparators.compareDates(new Date(2019, 7, 27), new Date(2019, 6, 31)) > 0).toEqual(true);
		});

		it('comparing 2019-08-27 with 2019-07-31 should return a negative value', () => {
			expect(comparators.compareDates(new Date(2019, 6, 31), new Date(2019, 7, 27)) < 0).toEqual(true);
		});

		it('comparing 2019-08-27 with 2019-08-27 should return a zero value', () => {
			expect(comparators.compareDates(new Date(2019, 7, 27), new Date(2019, 7, 27))).toEqual(0);
		});
	});

	describe('to sort an array of Date instances', () => {
		let arrayToSort;

		beforeEach(() => {
			arrayToSort = [second, first, third];

			arrayToSort.sort(comparators.compareDates);
		});

		it('the array should be in the correct order', () => {
			expect(arrayToSort[0]).toBe(first);
			expect(arrayToSort[1]).toBe(second);
			expect(arrayToSort[2]).toBe(third);
		});
	});

	describe('to sort an array that contains something other than Date instances', () => {
		it('an error should be thrown', () => {
			expect(() => {
				let arrayToSort = [second, first, third, '1-1-2017'];

				arrayToSort.sort(comparators.compareDates);
			}).toThrow();
		});
	});
});

describe('When using the "compareNumbers" comparator', () => {
	'use strict';

	let first = -1;
	let second = Math.E;
	let third = Math.PI;

	describe('to rank numbers', () => {
		it('comparing 22 with 11 should return a positive value', () => {
			expect(comparators.compareNumbers(22, 11) > 0).toEqual(true);
		});

		it('comparing 11 with 22 should return a negative value', () => {
			expect(comparators.compareNumbers(11, 22) < 0).toEqual(true);
		});

		it('comparing 11 with 11 should return a zero value', () => {
			expect(comparators.compareNumbers(11, 11)).toEqual(0);
		});
	});

	describe('to sort an array of numbers', () => {
		let arrayToSort;

		beforeEach(() => {
			arrayToSort = [second, first, third];

			arrayToSort.sort(comparators.compareNumbers);
		});

		it('the array should be in the correct order', () => {
			expect(arrayToSort[0]).toBe(first);
			expect(arrayToSort[1]).toBe(second);
			expect(arrayToSort[2]).toBe(third);
		});
	});

	describe('to sort an array that contains something other than numbers', () => {
		it('an error should be thrown', () => {
			expect(() => {
				let arrayToSort = [second, first, third, null];

				arrayToSort.sort(comparators.compareNumbers);
			}).toThrow();
		});
	});
});

describe('When using the "compareStrings" comparator', () => {
	'use strict';

	let first = '';
	let second = 'Bye now';
	let third = 'Hi there';

	describe('to rank strings', () => {
		it('comparing "abd" with "abc" should return a positive value', () => {
			expect(comparators.compareStrings('abd', 'abc') > 0).toEqual(true);
		});

		it('comparing "abc" with "abd" should return a negative value', () => {
			expect(comparators.compareStrings('abc', 'abd') < 0).toEqual(true);
		});

		it('comparing "abc" with "abc" should return a zero value', () => {
			expect(comparators.compareStrings('abc', 'abc')).toEqual(0);
		});
	});

	describe('to sort an array of strings', () => {
		let arrayToSort;

		beforeEach(() => {
			arrayToSort = [third, first, second];

			arrayToSort.sort(comparators.compareStrings);
		});

		it('the array should be in the correct order', () => {
			expect(arrayToSort[0]).toBe(first);
			expect(arrayToSort[1]).toBe(second);
			expect(arrayToSort[2]).toBe(third);
		});
	});

	describe('to sort an array that contains something other than strings', () => {
		it('an error should be thrown', () => {
			expect(() => {
				let arrayToSort = [second, first, third, 7];

				arrayToSort.sort(comparators.compareStrings);
			}).toThrow();
		});
	});
});

describe('When using the "compareBoolean" comparator', () => {
	'use strict';

	let a = true;
	let b = false;
	let c = true;

	describe('to rank boolean values', () => {
		it('comparing "true" with "false" should return a positive value', () => {
			expect(comparators.compareBooleans(true, false) > 0).toEqual(true);
		});

		it('comparing "false" with "true" should return a negative value', () => {
			expect(comparators.compareBooleans(false, true) < 0).toEqual(true);
		});

		it('comparing "true" with "true" should return a zero value', () => {
			expect(comparators.compareBooleans(true, true)).toEqual(0);
		});
	});

	describe('to sort an array of booleans', () => {
		let arrayToSort;

		beforeEach(() => {
			arrayToSort = [a, b, c];

			arrayToSort.sort(comparators.compareBooleans);
		});


		it('the array should be in the correct order', () => {
			expect(arrayToSort[0]).toEqual(b);
			expect(arrayToSort[1]).toEqual(a);
			expect(arrayToSort[2]).toEqual(c);
		});
	});
});