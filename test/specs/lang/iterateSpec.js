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
});