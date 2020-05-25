const iterate = require('./../../../lang/iterate');

describe('When using the iterate function', () => {
	let a;
	let b;
	let c;

	let iterable;

	beforeEach(() => {
		a = { };
		b = { };
		c = { };

		iterable = [ a, b, c ];
	});

	describe('to synchronously iterate over an array with three items', () => {
		let processor;

		beforeEach((done) => {
			processor = jasmine.createSpy('processor').and.callFake((item, callback) => {
				callback();
			});

			iterate(iterable, processor)
				.then(() => {
					done();
				});
		});

		it('the "processor" should have been called three times', () => {
			expect(processor).toHaveBeenCalledTimes(3);
		});

		it('the "processor" should have been called first with the first item', () => {
			expect(processor.calls.argsFor(0)[0]).toBe(a);
		});

		it('the "processor" should have been called second with the second item', () => {
			expect(processor.calls.argsFor(1)[0]).toBe(b);
		});

		it('the "processor" should have been called third with the third item', () => {
			expect(processor.calls.argsFor(2)[0]).toBe(c);
		});
	});

	describe('to synchronously iterate over an array with three items, breaking after the second item', () => {
		let processor;

		beforeEach((done) => {
			processor = jasmine.createSpy('processor').and.callFake((item, callback) => {
				callback(item !== b);
			});

			iterate(iterable, processor)
				.then(() => {
					done();
				});
		});

		it('the "processor" should have been called two times', () => {
			expect(processor).toHaveBeenCalledTimes(2);
		});

		it('the "processor" should have been called first with the first item', () => {
			expect(processor.calls.argsFor(0)[0]).toBe(a);
		});

		it('the "processor" should have been called second with the second item', () => {
			expect(processor.calls.argsFor(1)[0]).toBe(b);
		});
	});

	describe('to asynchronously iterate over an array with three items', () => {
		let processor;
		let invocations = [ ];

		beforeEach((done) => {
			processor = jasmine.createSpy('processor').and.callFake((item, callback) => {
				invocations.push((new Date()).getTime());

				setTimeout(() => {
					callback();
				}, 5);
			});

			iterate(iterable, processor)
				.then(() => {
					done();
				});
		});

		it('the "processor" should have been called three times', () => {
			expect(processor).toHaveBeenCalledTimes(3);
		});

		it('the "processor" should have been called first with the first item', () => {
			expect(processor.calls.argsFor(0)[0]).toBe(a);
		});

		it('the "processor" should have been called second, at least 5ms after the first call', () => {
			expect(invocations[1] - invocations[0] > 4).toEqual(true);
		});

		it('the "processor" should have been called second with the second item', () => {
			expect(processor.calls.argsFor(1)[0]).toBe(b);
		});

		it('the "processor" should have been called thrid, at least 5ms after the second call', () => {
			expect(invocations[2] - invocations[1] > 4).toEqual(true);
		});

		it('the "processor" should have been called third with the third item', () => {
			expect(processor.calls.argsFor(2)[0]).toBe(c);
		});
	});

	describe('to asynchronously iterate over an array with three items, breaking after the second item', () => {
		let processor;
		let invocations = [ ];

		beforeEach((done) => {
			processor = jasmine.createSpy('processor').and.callFake((item, callback) => {
				invocations.push((new Date()).getTime());

				setTimeout(() => {
					callback(item !== b);
				}, 5);
			});

			iterate(iterable, processor)
				.then(() => {
					done();
				});
		});

		it('the "processor" should have been called two times', () => {
			expect(processor).toHaveBeenCalledTimes(2);
		});

		it('the "processor" should have been called first with the first item', () => {
			expect(processor.calls.argsFor(0)[0]).toBe(a);
		});

		it('the "processor" should have been called second, at least 5ms after the first call', () => {
			expect(invocations[1] - invocations[0] > 4).toEqual(true);
		});

		it('the "processor" should have been called second with the second item', () => {
			expect(processor.calls.argsFor(1)[0]).toBe(b);
		});
	});
});