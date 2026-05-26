const MatchResultProcessor = require('./../../../../data/processors/MatchResultProcessor');

describe('When a MatchResultProcessor is created with an expression to test for letters', () => {
	'use strict';

	let processor;
	let configuration;

	beforeEach(() => {
		processor = new MatchResultProcessor(configuration = { propertyName: 'testProperty', matchPropertyName: 'passed', expression: '[a-z]' });
	});

	describe('and the property value is null', () => {
		let target;

		beforeEach((done) => {
			processor.process(target = { testProperty: null })
				.then((r) => {
					done();
				});
		});

		it('should assign a true value to the matched property', () => {
			expect(target.passed).toEqual(false);
		});
	});

	describe('and the property value is undefined', () => {
		let target;

		beforeEach((done) => {
			processor.process(target = { testProperty: undefined })
				.then((r) => {
					done();
				});
		});

		it('should assign a true value to the matched property', () => {
			expect(target.passed).toEqual(false);
		});
	});

	describe('and the property value contains letters', () => {
		let target;

		beforeEach((done) => {
			processor.process(target = { testProperty: '1x2y1z' })
				.then((r) => {
					done();
				});
		});

		it('should assign a true value to the matched property', () => {
			expect(target.passed).toEqual(true);
		});
	});

	describe('and the property value does not contain letters', () => {
		let target;

		beforeEach((done) => {
			processor.process(target = { testProperty: '121' })
				.then((r) => {
					done();
				});
		});

		it('should assign a true value to the matched property', () => {
			expect(target.passed).toEqual(false);
		});
	});
});

describe('When a MatchResultProcessor is created with two expressions (starting with a letter and ending with a letter)', () => {
	'use strict';

	let processor;
	let configuration;

	beforeEach(() => {
		processor = new MatchResultProcessor(configuration = { propertyName: 'testProperty', matchPropertyName: 'passed', expressions: ['^[a-z]', '[a-z]$'] });
	});

	describe('and the property value is null', () => {
		let target;

		beforeEach((done) => {
			processor.process(target = { testProperty: null })
				.then((r) => {
					done();
				});
		});

		it('should assign a true value to the matched property', () => {
			expect(target.passed).toEqual(false);
		});
	});

	describe('and the property value is undefined', () => {
		let target;

		beforeEach((done) => {
			processor.process(target = { testProperty: undefined })
				.then((r) => {
					done();
				});
		});

		it('should assign a true value to the matched property', () => {
			expect(target.passed).toEqual(false);
		});
	});

	describe('and the property value starts with a letter', () => {
		let target;

		beforeEach((done) => {
			processor.process(target = { testProperty: 'a123' })
				.then((r) => {
					done();
				});
		});

		it('should assign a true value to the matched property', () => {
			expect(target.passed).toEqual(true);
		});
	});

	describe('and the property value ends with a letter', () => {
		let target;

		beforeEach((done) => {
			processor.process(target = { testProperty: '987z' })
				.then((r) => {
					done();
				});
		});

		it('should assign a true value to the matched property', () => {
			expect(target.passed).toEqual(true);
		});
	});

	describe('and the property value does not start or end with a letter', () => {
		let target;

		beforeEach((done) => {
			processor.process(target = { testProperty: '121' })
				.then((r) => {
					done();
				});
		});

		it('should assign a true value to the matched property', () => {
			expect(target.passed).toEqual(false);
		});
	});
});