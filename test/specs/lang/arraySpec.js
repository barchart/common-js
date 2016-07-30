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