const CompositeResultProcessor = require('./../../../../data/processors/CompositeResultProcessor'),
	ResultProcessor = require('./../../../../data/ResultProcessor');

describe('When a CompositeResultProcessor is created with two children', () => {
	'use strict';

	let processor;

	let childProcessorOne;
	let childProcessorTwo;

	let spyOne;
	let spyTwo;

	let processResultOne;
	let processResultTwo;

	class ResultProcessorSpy extends ResultProcessor {
		constructor(spy) {
			super();

			this._spy = spy;
		}

		_process(results) {
			return this._spy(results);
		}
	}

	beforeEach(() => {
		childProcessorOne = new ResultProcessorSpy(spyOne = jasmine.createSpy('spyOne').and.returnValue(processResultOne = { }));
		childProcessorTwo = new ResultProcessorSpy(spyTwo = jasmine.createSpy('spyTwo').and.returnValue(processResultTwo = { }));

		processor = new CompositeResultProcessor([ childProcessorOne, childProcessorTwo ]);
	});

	describe('and the processor is invoked', () => {
		let result;
		let original;

		beforeEach((done) => {
			processor.process(original = { })
				.then((r) => {
					result = r;

					done();
				});
		});

		it('should pass the original context to first child provider', () => {
			expect(spyOne).toHaveBeenCalledWith(original);
		});

		it('should pass the result of the first child provider to the second child provider', () => {
			expect(spyTwo).toHaveBeenCalledWith(processResultOne);
		});

		it('should return the result of the second child provider', () => {
			expect(result).toBe(processResultTwo);
		});
	});
});