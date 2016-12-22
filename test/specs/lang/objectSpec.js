var object = require('./../../../lang/object');

describe('When cloning an object', function() {
	'use strict';

	var target;
	var clone;

	describe('that is empty', function() {
		beforeEach(function() {
			clone = object.clone(target = { });
		});

		it('the clone should be an object', function() {
			expect(typeof clone).toEqual('object');
		});

		it('the clone should not reference the source object', function() {
			expect(clone).not.toBe(target);
		});
	});

	describe('that has a string-based property', function() {
		beforeEach(function() {
			clone = object.clone(target = { property: 'hi' });
		});

		it('the property value should equal the source property value', function() {
			expect(clone.property).toEqual(target.property);
		});
	});

	describe('that has a number-based property', function() {
		beforeEach(function() {
			clone = object.clone(target = { property: 23 });
		});

		it('the property value should equal the source property value', function() {
			expect(clone.property).toEqual(target.property);
		});
	});

	describe('that has an object-based property', function() {
		beforeEach(function() {
			clone = object.clone(target = { property: { } });
		});

		it('the clone should be an object', function() {
			expect(typeof clone.property).toEqual('object');
		});

		it('the property value should not be a reference to the property value on the source object', function() {
			expect(clone.property).not.toBe(target.property);
		});
	});

	describe('that has an array-based property', function() {
		beforeEach(function() {
			clone = object.clone(target = { property: [ ] });
		});

		it('the clone should be an object', function() {
			expect(typeof clone.property).toEqual('object');
		});

		it('the property value should not be a reference to the property value on the source object', function() {
			expect(clone.property).not.toBe(target.property);
		});
	});
});

describe('When merging objects', function() {
	var a;
	var b;

	var merged;

	describe('that are flat', function() {
		beforeEach(function() {
			merged = object.merge(a = { a: 1, b: 0  }, b = { b: 2, z: 26 });
		});

		it('should not provide a reference to the first source', function() {
			expect(merged).not.toBe(a);
		});

		it('should not provide a reference to the second source', function() {
			expect(merged).not.toBe(b);
		});

		it('should take exclusive properties from the first source', function() {
			expect(merged.a).toEqual(a.a);
		});

		it('should take exclusive properties from the second source', function() {
			expect(merged.z).toEqual(b.z);
		});

		it('should take shared properties from the second source', function() {
			expect(merged.b).toEqual(b.b);
		});
	});

	describe('that have nesting', function() {
		beforeEach(function() {
			merged = object.merge(a = { a: { a: 1, b: 0  }  }, b = { a: { b: 2, z: 26 } });

			console.log(merged);
		});

		it('should not provide a reference to the (nested) first source', function() {
			expect(merged.a).not.toBe(a.a);
		});

		it('should not provide a reference to the (nested) second source', function() {
			expect(merged.a).not.toBe(b.a);
		});

		it('should take exclusive properties from the (nested) first source', function() {
			expect(merged.a.a).toEqual(a.a.a);
		});

		it('should take exclusive properties from the (nested) second source', function() {
			expect(merged.a.z).toEqual(b.a.z);
		});

		it('should take shared properties from the (nested) second source', function() {
			expect(merged.a.b).toEqual(b.a.b);
		});
	});
});