const object = require('./../../../lang/object');

describe('When cloning an object', () => {
	'use strict';

	let target;
	let clone;

	describe('that is empty', () => {
		beforeEach(() => {
			clone = object.clone(target = { });
		});

		it('the clone should be an object', () => {
			expect(typeof clone).toEqual('object');
		});

		it('the clone should not reference the source object', () => {
			expect(clone).not.toBe(target);
		});
	});

	describe('that has a string-based property', () => {
		beforeEach(() => {
			clone = object.clone(target = { property: 'hi' });
		});

		it('the property value should equal the source property value', () => {
			expect(clone.property).toEqual(target.property);
		});
	});

	describe('that has a number-based property', () => {
		beforeEach(() => {
			clone = object.clone(target = { property: 23 });
		});

		it('the property value should equal the source property value', () => {
			expect(clone.property).toEqual(target.property);
		});
	});

	describe('that has an object-based property', () => {
		beforeEach(() => {
			clone = object.clone(target = { property: { } });
		});

		it('the clone should be an object', () => {
			expect(typeof clone.property).toEqual('object');
		});

		it('the property value should not be a reference to the property value on the source object', () => {
			expect(clone.property).not.toBe(target.property);
		});
	});

	describe('that has an array-based property', () => {
		beforeEach(() => {
			clone = object.clone(target = { property: [ ] });
		});

		it('the clone should be an object', () => {
			expect(typeof clone.property).toEqual('object');
		});

		it('the property value should not be a reference to the property value on the source object', () => {
			expect(clone.property).not.toBe(target.property);
		});
	});
});

describe('When merging objects', () => {
	let a;
	let b;

	let merged;

	describe('that are flat', () => {
		beforeEach(() => {
			merged = object.merge(a = { a: 1, b: 0  }, b = { b: 2, z: 26 });
		});

		it('should not provide a reference to the first source', () => {
			expect(merged).not.toBe(a);
		});

		it('should not provide a reference to the second source', () => {
			expect(merged).not.toBe(b);
		});

		it('should take exclusive properties from the first source', () => {
			expect(merged.a).toEqual(a.a);
		});

		it('should take exclusive properties from the second source', () => {
			expect(merged.z).toEqual(b.z);
		});

		it('should take shared properties from the second source', () => {
			expect(merged.b).toEqual(b.b);
		});
	});

	describe('that have nesting', () => {
		beforeEach(() => {
			merged = object.merge(a = { a: { a: 1, b: 0  }  }, b = { a: { b: 2, z: 26 } });
		});

		it('should not provide a reference to the (nested) first source', () => {
			expect(merged.a).not.toBe(a.a);
		});

		it('should not provide a reference to the (nested) second source', () => {
			expect(merged.a).not.toBe(b.a);
		});

		it('should take exclusive properties from the (nested) first source', () => {
			expect(merged.a.a).toEqual(a.a.a);
		});

		it('should take exclusive properties from the (nested) second source', () => {
			expect(merged.a.z).toEqual(b.a.z);
		});

		it('should take shared properties from the (nested) second source', () => {
			expect(merged.a.b).toEqual(b.a.b);
		});
	});
});

describe('When when extracting keys', () => {
	describe('from an object that has "a" and "b" properties', () => {
		let keys;

		beforeEach(() => {
			keys = object.keys({ a: 1, b: 1 });
		});

		it('should have with two items', () => {
			expect(keys.length).toEqual(2);
		});

		it('should contain an "a" value', () => {
			expect(keys[0] === 'a' || keys[1] === 'a').toEqual(true);
		});

		it('should contain a "b" value', () => {
			expect(keys[0] === 'b' || keys[1] === 'b').toEqual(true);
		});

		it('should not contain a "toString" value', () => {
			expect(keys[0] === 'toString' || keys[1] === 'toString').toEqual(false);
		});
	});
});

describe('When running a deep comparison', () => {
	describe('against two matching strings', () => {
		it('the result should be true', () => {
			expect(object.equals('abc', 'abc')).toEqual(true);
		});
	});

	describe('against two different strings', () => {
		it('the result should be true', () => {
			expect(object.equals('abc', 'xyz')).toEqual(false);
		});
	});

	describe('against an array containing the same strings', () => {
		it('the result should be false', () => {
			expect(object.equals([ 'a', 'b' ], [ 'a', 'b' ])).toEqual(true);
		});
	});

	describe('against an array of different sizes', () => {
		it('the result should be false', () => {
			expect(object.equals([ 'a', 'b' ], [ 'a', 'b', 'c' ])).toEqual(false);
		});
	});

	describe('against objects where one object has an extra property', () => {
		it('the result should be false', () => {
			expect(object.equals({ first: 'bryan' }, { first: 'bryan', last: 'ingle' })).toEqual(false);
		});
	});

	describe('against a complex object, with the same properties and values', () => {
		it('the result should be true', () => {
			let a = {
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

			let b = {
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

	describe('against a complex object, with the different properties and values', () => {
		it('the result should be false', () => {
			let a = {
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

			let b = {
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

	describe('against a complex object, where both objects have equals methods (somewhere in the object model tree)', () => {
		it('the result should be true', () => {
			let a = {
				hi: {
					my: {
						name: [
							'Elvis',
							'Presley'
						],
						home: {
							name: 'Graceland',
							equals: function(other) {
								return other.name === 'Graceland';
							}
						}
					}
				}
			};

			let b = {
				hi: {
					my: {
						name: [
							'Elvis',
							'Presley'
						],
						home: {
							name: 'Graceland',
							equals: function(other) {
								return other.name === 'Graceland';
							}
						}
					}
				}
			};

			expect(object.equals(a, b)).toEqual(true);
		});
	});

	describe('against two empty arrays', () => {
		it('the result should be true', () => {
			expect(object.equals([], [])).toEqual(true);
		});
	});
});

describe('When cloning a simple object (using a custom value extractor)', () => {
	let source;
	let clone;

	let canExtract;
	let extractor;

	beforeEach(() => {
		source = 42;

		canExtract = value => true;
		extractor = value => ++value;

		clone = object.clone(source, canExtract, extractor);
	});

	it('the cloned object should be 43', () => {
		expect(clone).toBe(43);
	});
});

describe('When cloning a complex object (using a custom value extractor)', () => {
	let source;
	let clone;

	let canExtract;
	let extractor;

	beforeEach(() => {
		source = { examples: { one: 1, two: 2, three: 3 }, game: { name: 'fizz' }, numbers: [ 0, 1, 2, 3, 4 ] };

		canExtract = value => typeof(value) === 'number';
		extractor = value => value > 0 && value % 3 === 0 ? 'fizz' : value;

		clone = object.clone(source, canExtract, extractor);
	});

	it('the cloned object should not be the source object', () => {
		expect(clone).not.toBe(source);
	});

	it("the clone object's child objects should not be the same", () => {
		expect(clone.examples).not.toBe(source.examples);
		expect(clone.game).not.toBe(source.game);
	});

	it("the clone object's child arrays should not be the same", () => {
		expect(clone.numbers).not.toBe(source.numbers);
	});

	it('the numbers divisible by three should be replaced with "fizz" (for object properties)', () => {
		expect(clone.examples.three).toEqual('fizz');
		expect(clone.numbers[3]).toEqual('fizz');
	});

	it('the numbers not divisible should be the same value (for object properties)', () => {
		expect(clone.examples.one).toEqual(1);
		expect(clone.examples.two).toEqual(2);

		expect(clone.numbers[0]).toEqual(0);
		expect(clone.numbers[1]).toEqual(1);
		expect(clone.numbers[2]).toEqual(2);
		expect(clone.numbers[4]).toEqual(4);
	});
});