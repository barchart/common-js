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

describe('When when extracting keys', function() {
	describe('from an object that has "a" and "b" properties', function() {
		var keys;

		beforeEach(function() {
			keys = object.keys({ a: 1, b: 1 });
		});

		it('should have with two items', function() {
			expect(keys.length).toEqual(2);
		});

		it('should contain an "a" value', function() {
			expect(keys[0] === 'a' || keys[1] === 'a').toEqual(true);
		});

		it('should contain a "b" value', function() {
			expect(keys[0] === 'b' || keys[1] === 'b').toEqual(true);
		});

		it('should not contain a "toString" value', function() {
			expect(keys[0] === 'toString' || keys[1] === 'toString').toEqual(false);
		});
	});
});

describe('When running a deep comparison', function() {
	describe('against two matching strings', function() {
		it('the result should be true', function() {
			expect(object.equals('abc', 'abc')).toEqual(true);
		});
	});

	describe('against two different strings', function() {
		it('the result should be true', function() {
			expect(object.equals('abc', 'xyz')).toEqual(false);
		});
	});

	describe('against an array containing the same strings', function() {
		it('the result should be false', function() {
			expect(object.equals([ 'a', 'b' ], [ 'a', 'b' ])).toEqual(true);
		});
	});

	describe('against an array of different sizes', function() {
		it('the result should be false', function() {
			expect(object.equals([ 'a', 'b' ], [ 'a', 'b', 'c' ])).toEqual(false);
		});
	});

	describe('against objects where one object has an extra property', function() {
		it('the result should be false', function() {
			expect(object.equals({ first: 'bryan' }, { first: 'bryan', last: 'ingle' })).toEqual(false);
		});
	});

	describe('against an complex object, with the same properties and values', function() {
		it('the result should be true', function() {
			var a = {
				hi: {
					my: {
						name: [
							'Elvis',
							'Presley'
						],
						home: 'Graceland'
					}
				}
			};

			var b = {
				hi: {
					my: {
						name: [
							'Elvis',
							'Presley'
						],
						home: 'Graceland'
					}
				}
			};

			expect(object.equals(a, b)).toEqual(true);
		});
	});

	describe('against an complex object, with the different properties and values', function() {
		it('the result should be false', function() {
			var a = {
				hi: {
					my: {
						name: [
							'Elvis',
							'Presley'
						],
						home: 'Graceland'
					}
				}
			};

			var b = {
				hi: {
					my: {
						name: [
							'Johnny',
							'Cash'
						],
						home: 'Tennessee'
					}
				}
			};

			expect(object.equals(a, b)).toEqual(false);
		});
	});

	describe('against two empty arrays', function() {
		it('the result should be true', function() {
			expect(object.equals([], [])).toEqual(true);
		});
	});
});