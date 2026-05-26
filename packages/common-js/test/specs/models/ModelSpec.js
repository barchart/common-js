const Disposable = require('./../../../lang/Disposable'),
	Model = require('./../../../models/Model');

describe('When an Model is constructed with "firstName" and "lastName" properties', () => {
	'use strict';

	let model;

	beforeEach(() => {
		model = new Model(['firstName', 'lastName']);
	});

	describe('and a transaction observer is registered', () => {
		let spy;
		let binding;

		beforeEach(() => {
			binding = model.onTransactionCommitted(spy = jasmine.createSpy('spy'));
		});

		it('should return a Disposable instance', () => {
			expect(binding instanceof Disposable).toEqual(true);
		});

		it('should return null values for each property', () => {
			expect(model.firstName).toBe(null);
			expect(model.lastName).toBe(null);
		});

		describe('and both properties are updated', () => {
			let data;

			beforeEach(() => {
				model.firstName = 'Bryan';
				model.lastName = 'Ingle';
			});

			it('two transactions should occur', () => {
				expect(spy.calls.count()).toEqual(2);
			});

			it('the first transaction should have updated the "first name" property', () => {
				let argsOne = spy.calls.argsFor(0);

				expect(argsOne[0].firstName).toEqual('Bryan');
				expect(argsOne[0].sequence).toEqual(0);

				expect(argsOne[1]).toBe(model);
			});

			it('the second transaction should have updated the "last name" property', () => {
				let argsOne = spy.calls.argsFor(1);

				expect(argsOne[0].lastName).toEqual('Ingle');
				expect(argsOne[0].sequence).toEqual(1);

				expect(argsOne[1]).toBe(model);
			});
		});

		describe('and both properties are updated with an explicit transaction', () => {
			let data;

			beforeEach(() => {
				model.executeTransaction((m) => {
					m.firstName = 'Bryan';
					m.lastName = 'Ingle';
				});
			});

			it('one transaction should occur', () => {
				expect(spy.calls.count()).toEqual(1);
			});

			it('the first transaction should have updated the "first name" property', () => {
				let argsOne = spy.calls.argsFor(0);

				expect(argsOne[0].firstName).toEqual('Bryan');
				expect(argsOne[0].lastName).toEqual('Ingle');
				expect(argsOne[0].sequence).toEqual(0);

				expect(argsOne[1]).toBe(model);
			});
		});

		describe('and both properties are to undefined values', () => {
			let data;

			beforeEach(() => {
				model.firstName = undefined;
				model.lastName = undefined;
			});

			it('no transactions should occur', () => {
				expect(spy.calls.count()).toEqual(0);
			});

			it('the properties should return null values', () => {
				expect(model.firstName).toBe(null);
				expect(model.lastName).toBe(null);
			});

			describe('and both are updated to non-null values', () => {
				beforeEach(() => {
					model.firstName = 0;
					model.lastName = '';
				});

				it('two transactions should occur', () => {
					expect(spy.calls.count()).toEqual(2);
				});

				it('the first transaction should have updated the "first name" property to zero', () => {
					let argsOne = spy.calls.argsFor(0);

					expect(argsOne[0].firstName).toBe(0);
					expect(argsOne[0].sequence).toEqual(0);

					expect(argsOne[1]).toBe(model);
				});

				it('the second transaction should have updated the "last name" property to a zero-length string', () => {
					let argsOne = spy.calls.argsFor(1);

					expect(argsOne[0].lastName).toBe('');
					expect(argsOne[0].sequence).toEqual(1);

					expect(argsOne[1]).toBe(model);
				});
			});
		});
	});
});