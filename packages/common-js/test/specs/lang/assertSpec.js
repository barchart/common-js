import * as assert from './../../../lang/assert.js';

describe('when attempting to validate an array', () => {
	'use strict';

	class A {
		constructor() {
		}
	}

	class B extends A {
		constructor() {
			super();
		}
	}

	class C {
		constructor() {
		}
	}

	describe('that contains instances of the same ES6 class', () => {
		let value;

		beforeEach(() => {
			value = [ new A() ];
		});

		it('should be valid without a type constraint', () => {
			expect(() => assert.argumentIsArray(value, 'value')).not.toThrow();
		});

		it('should be valid with a type constraint', () => {
			expect(() => assert.argumentIsArray(value, 'value', A, 'A')).not.toThrow();
		});
	});

	describe('that contains instances of an ES6 class and its subclasses', () => {
		let value;

		beforeEach(() => {
			value = [ new A(), new B() ];
		});

		it('should be valid without a type constraint', () => {
			expect(() => assert.argumentIsArray(value, 'value')).not.toThrow();
		});

		it('should be valid with the superclass type constraint', () => {
			expect(() => assert.argumentIsArray(value, 'value', A, 'A')).not.toThrow();
		});

		it('should not be valid with the subclass type constraint', () => {
			expect(() => assert.argumentIsArray(value, 'value', B, 'B')).toThrow();
		});
	});

	describe('that contains instances of an ES6 class, its subclasses, and unrelated classes', () => {
		let value;

		beforeEach(() => {
			value = [ new A(), new B(), new C() ];
		});

		it('should be valid without a type constraint', () => {
			expect(() => assert.argumentIsArray(value, 'value')).not.toThrow();
		});

		it('should not be valid with the superclass type constraint', () => {
			expect(() => assert.argumentIsArray(value, 'value', A, 'A')).toThrow();
		});

		it('should not be valid with the subclass type constraint', () => {
			expect(() => assert.argumentIsArray(value, 'value', B, 'B')).toThrow();
		});
	});

	describe('that uses a String type constraint', () => {
		it('should be valid when all items are strings', () => {
			const value = [ 'first', 'second' ];

			expect(() => assert.argumentIsArray(value, 'value', String)).not.toThrow();
		});

		it('should not be valid when an item is not a string', () => {
			const value = [ 'first', { value: 'second' } ];

			expect(() => assert.argumentIsArray(value, 'value', String)).toThrow();
		});
	});

	describe('that uses a Number type constraint', () => {
		it('should be valid when all items are numbers', () => {
			const value = [ 1, 2 ];

			expect(() => assert.argumentIsArray(value, 'value', Number)).not.toThrow();
		});

		it('should not be valid when an item is not a number', () => {
			const value = [ 1, '2' ];

			expect(() => assert.argumentIsArray(value, 'value', Number)).toThrow();
		});
	});

	describe('that uses a Boolean type constraint', () => {
		it('should be valid when all items are booleans', () => {
			const value = [ true, false ];

			expect(() => assert.argumentIsArray(value, 'value', Boolean)).not.toThrow();
		});

		it('should not be valid when an item is not a boolean', () => {
			const value = [ true, 1 ];

			expect(() => assert.argumentIsArray(value, 'value', Boolean)).toThrow();
		});
	});

	describe('that uses a Date type constraint', () => {
		it('should be valid when all items are dates', () => {
			const value = [ new Date(), new Date() ];

			expect(() => assert.argumentIsArray(value, 'value', Date)).not.toThrow();
		});

		it('should not be valid when an item is not a date', () => {
			const value = [ new Date(), '2026-06-12' ];

			expect(() => assert.argumentIsArray(value, 'value', Date)).toThrow();
		});
	});

	describe('that uses a RegExp type constraint', () => {
		it('should be valid when all items are regular expressions', () => {
			const value = [ /first/, /second/ ];

			expect(() => assert.argumentIsArray(value, 'value', RegExp)).not.toThrow();
		});

		it('should not be valid when an item is not a regular expression', () => {
			const value = [ /first/, 'second' ];

			expect(() => assert.argumentIsArray(value, 'value', RegExp)).toThrow();
		});
	});

	describe('that uses an Array type constraint', () => {
		it('should be valid when all items are arrays', () => {
			const value = [ [ 1 ], [ 2 ] ];

			expect(() => assert.argumentIsArray(value, 'value', Array)).not.toThrow();
		});

		it('should not be valid when an item is not an array', () => {
			const value = [ [ 1 ], { value: 2 } ];

			expect(() => assert.argumentIsArray(value, 'value', Array)).toThrow();
		});
	});

	describe('that uses a Function type constraint', () => {
		it('should be valid when all items are functions', () => {
			const value = [
				() => null,
				function() {
					return null;
				}
			];

			expect(() => assert.argumentIsArray(value, 'value', Function)).not.toThrow();
		});

		it('should not be valid when an item is not a function', () => {
			const value = [ () => null, { } ];

			expect(() => assert.argumentIsArray(value, 'value', Function)).toThrow();
		});
	});

	describe('that uses an Object type constraint', () => {
		it('should be valid when all items are objects', () => {
			const value = [ { first: true }, { second: true } ];

			expect(() => assert.argumentIsArray(value, 'value', Object)).not.toThrow();
		});

		it('should not be valid when an item is not an object', () => {
			const value = [ { first: true }, 'second' ];

			expect(() => assert.argumentIsArray(value, 'value', Object)).toThrow();
		});
	});

	describe('that uses a custom item validator', () => {
		function isPositive(value) {
			if (value <= 0) {
				throw new Error('not positive');
			}
		}

		it('should be valid when every item passes the validator', () => {
			const value = [ 1, 2 ];

			expect(() => assert.argumentIsArray(value, 'value', isPositive, 'positive')).not.toThrow();
		});

		it('should not be valid when the validator throws', () => {
			const value = [ 1, -2 ];

			expect(() => assert.argumentIsArray(value, 'value', isPositive, 'positive')).toThrow();
		});

	});

	describe('that is not an array', () => {
		it('should not be valid', () => {
			expect(() => assert.argumentIsArray({ }, 'value')).toThrow();
		});
	});
});
