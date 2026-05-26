const NullCoalescingResultProcessor = require('./../../../../data/processors/NullCoalescingResultProcessor');

describe('When a NullCoalescingResultProcessor is created', () => {
	'use strict';

	let processor;
	let configuration;

	beforeEach(() => {
		processor = new NullCoalescingResultProcessor(configuration = { propertyName: 'testProperty', replaceValue: 'testValue' });
	});

	describe('and a target object with a null property is processed', () => {
		let target;

		beforeEach((done) => {
			processor.process(target = { testProperty: null })
				.then((r) => {
					done();
				});
		});

		it('should assign the coalesced value to the target property', () => {
			expect(target.testProperty).toEqual('testValue');
		});
	});

	describe('and a target object with a non-null property is processed', () => {
		let target;

		beforeEach((done) => {
			processor.process(target = { testProperty: 'bob' })
				.then((r) => {
					done();
				});
		});

		it('should assign the coalesced value to the target property', () => {
			expect(target.testProperty).toEqual('bob');
		});
	});

	describe('and a target object without the property is processed', () => {
		let target;

		beforeEach((done) => {
			processor.process(target = { })
				.then((r) => {
					done();
				});
		});

		it('should assign the coalesced value to the target property', () => {
			expect(target.hasOwnProperty('testProperty')).toEqual(false);
		});
	});
});