const CleanResultProcessor = require('./../../../../data/processors/CleanResultProcessor');

describe('When a CleanResultProcessor is used on an object', () => {
	'use strict';

	let processor;
	let original;

	let e;
	let f;

	beforeEach(() => {
		processor = new CleanResultProcessor({ });

		original = {
			a: null,
			b: undefined,
			c: 3,
			d: 'four',
			e: e = {},
			f: f = []
		};
	});

	describe('properties that are null should be deleted', () => {
		let result;

		beforeEach((done) => {
			processor.process(original)
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the original object should not have an "a" property', () => {
			expect(result.hasOwnProperty('a')).toEqual(false);
		});
	});

	describe('properties that are undefined should be deleted', () => {
		let result;

		beforeEach((done) => {
			processor.process(original)
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the original object should not have an "b" property', () => {
			expect(result.hasOwnProperty('b')).toEqual(false);
		});
	});

	describe('properties that are numbers should not be affected', () => {
		let result;

		beforeEach((done) => {
			processor.process(original)
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the original object should have an "c" property', () => {
			expect(result.c).toEqual(3);
		});
	});

	describe('properties that are strings should not be affected', () => {
		let result;

		beforeEach((done) => {
			processor.process(original)
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the original object should have an "d" property', () => {
			expect(result.d).toEqual('four');
		});
	});

	describe('properties that are objects should not be affected', () => {
		let result;

		beforeEach((done) => {
			processor.process(original)
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the original object should have an "e" property', () => {
			expect(result.e).toBe(e);
		});
	});

	describe('properties that are arrays should not be affected', () => {
		let result;

		beforeEach((done) => {
			processor.process(original)
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the original object should have an "f" property', () => {
			expect(result.f).toBe(f);
		});
	});
});

describe('When a CleanResultProcessor is used on a single property (that is an object)', () => {
	'use strict';

	let processor;
	let original;

	let xyz;
	let e;
	let f;

	beforeEach(() => {
		processor = new CleanResultProcessor({ propertyName: 'xyz' });

		original = {
			xyz: xyz = {
				a: null,
				b: undefined,
				c: 3,
				d: 'four',
				e: e = {},
				f: f = []
			}
		};
	});

	describe('the wrapper property should be unaffected', () => {
		let result;

		beforeEach((done) => {
			processor.process(original)
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the original object should not have an "xyz" property', () => {
			expect(result.xyz).toBe(xyz);
		});
	});

	describe('properties that are null should be deleted', () => {
		let result;

		beforeEach((done) => {
			processor.process(original)
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the original object should not have an "xyz.a" property', () => {
			expect(result.xyz.hasOwnProperty('a')).toEqual(false);
		});
	});

	describe('properties that are undefined should be deleted', () => {
		let result;

		beforeEach((done) => {
			processor.process(original)
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the original object should not have an "xyz.b" property', () => {
			expect(result.hasOwnProperty('xyz.b')).toEqual(false);
		});
	});

	describe('properties that are numbers should not be affected', () => {
		let result;

		beforeEach((done) => {
			processor.process(original)
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the original object should have an "xyz.c" property', () => {
			expect(result.xyz.c).toEqual(3);
		});
	});

	describe('nested properties that are strings should not be affected', () => {
		let result;

		beforeEach((done) => {
			processor.process(original)
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the original object should have an "d" property', () => {
			expect(result.xyz.d).toEqual('four');
		});
	});

	describe('properties that are objects should not be affected', () => {
		let result;

		beforeEach((done) => {
			processor.process(original)
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the original object should have an "xyz.e" property', () => {
			expect(result.xyz.e).toBe(e);
		});
	});

	describe('properties that are arrays should not be affected', () => {
		let result;

		beforeEach((done) => {
			processor.process(original)
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the original object should have an "xyz.f" property', () => {
			expect(result.xyz.f).toBe(f);
		});
	});
});

describe('When a CleanResultProcessor is used on a single property (that is null)', () => {
	'use strict';

	let processor;
	let original;

	let xyz;
	let e;
	let f;

	beforeEach(() => {
		processor = new CleanResultProcessor({ propertyName: 'abc' });

		original = {
			abc: null,
			xyz: xyz = {
				a: null,
				b: undefined,
				c: 3,
				d: 'four',
				e: e = {},
				f: f = []
			}
		};
	});

	describe('the wrapper property should be unaffected', () => {
		let result;

		beforeEach((done) => {
			processor.process(original)
				.then((r) => {
					result = r;

					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the original object should not have an "abc" property', () => {
			expect(result.hasOwnProperty('abc')).toEqual(false);
		});

		it('the original object should have an "xyz" property', () => {
			expect(result.xyz).toBe(xyz);
		});
	});
});
