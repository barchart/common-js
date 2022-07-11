const assert = require('./../../../lang/assert');

describe('when attempting to validate an array', () => {
	'use strict';

	class A {
		constructor() {
		}
	}

	class B extends A {
		constructor() {
			super()
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

		it('should be valid (without a type constraint)', () => {
			expect(() => assert.argumentIsArray(value, 'value')).not.toThrow();
		});

		it('should be valid (with a type constraint)', () => {
			expect(() => assert.argumentIsArray(value, 'value', A, 'A')).not.toThrow();
		});
	});

	describe('that contains instances of an ES6 class and its subclass(es),', () => {
		let value;

		beforeEach(() => {
			value = [ new A(), new B() ];
		});

		it('should be valid (without a type constraint)', () => {
			expect(() => assert.argumentIsArray(value, 'value')).not.toThrow();
		});

		it('should be valid (with the superclass type constraint)', () => {
			expect(() => assert.argumentIsArray(value, 'value', A, 'A')).not.toThrow();
		});

		it('should not be valid (with the subclass type constraint)', () => {
			expect(() => assert.argumentIsArray(value, 'value', B, 'B')).toThrow();
		});
	});

	describe('that contains instances of an ES6 class, its subclass(es), and unrelated classes', () => {
		let value;

		beforeEach(() => {
			value = [ new A(), new B(), new C() ];
		});

		it('should be valid (without a type constraint)', () => {
			expect(() => assert.argumentIsArray(value, 'value')).not.toThrow();
		});

		it('should be not valid (with the superclass type constraint)', () => {
			expect(() => assert.argumentIsArray(value, 'value', A, 'A')).toThrow();
		});

		it('should not be valid (with the subclass type constraint)', () => {
			expect(() => assert.argumentIsArray(value, 'value', B, 'B')).toThrow();
		});
	});
});