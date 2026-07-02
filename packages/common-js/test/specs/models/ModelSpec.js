import Disposable from './../../../lang/Disposable.js';
import Model from './../../../models/Model.js';

describe('When an Model is constructed with "firstName" and "lastName" properties', () => {
	'use strict';

	let model;

	beforeEach(() => {
		model = new Model(['firstName', 'lastName']);
	});

	it('should return a snapshot of the current model state', () => {
		model.firstName = 'Bryan';
		model.lastName = 'Ingle';

		expect(model.getSnapshot()).toEqual({
			firstName: 'Bryan',
			lastName: 'Ingle',
			sequence: 2
		});
	});

	describe('and a transaction observer is registered', () => {
		let spy;
		let binding;

		beforeEach(() => {
			binding = model.onTransactionCommitted(spy = jasmine.createSpy('spy'));
		});

		describe('and a manual transaction is completed', () => {
			beforeEach(() => {
				model.beginTransaction();

				model.firstName = 'Bryan';
				model.lastName = 'Ingle';

				model.endTransaction();
			});

			it('should commit one transaction', () => {
				expect(spy.calls.count()).toEqual(1);
			});

			it('should include both updates in the transaction', () => {
				expect(spy.calls.argsFor(0)[0]).toEqual({
					firstName: 'Bryan',
					lastName: 'Ingle',
					sequence: 0
				});
			});
		});

		describe('and tracking is used around a transaction', () => {
			let trackedData;

			beforeEach(() => {
				model.startTracker();

				model.executeTransaction((m) => {
					m.firstName = 'Bryan';
					m.lastName = 'Ingle';
				});

				trackedData = model.resetTracker();
				model.stopTracking();
			});

			it('should return tracked transaction data', () => {
				expect(trackedData).toEqual({
					firstName: 'Bryan',
					lastName: 'Ingle',
					sequence: 0
				});
			});

			it('should clear tracking when tracking is stopped', () => {
				model.firstName = 'Luka';

				expect(model.resetTracker()).toEqual(null);
			});
		});

		it('should return a Disposable instance', () => {
			expect(binding instanceof Disposable).toEqual(true);
		});

		it('should return null values for each property', () => {
			expect({
				firstName: model.firstName,
				lastName: model.lastName
			}).toEqual({
				firstName: null,
				lastName: null
			});
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

				expect({
					firstName: argsOne[0].firstName,
					sequence: argsOne[0].sequence,
					model: argsOne[1]
				}).toEqual({
					firstName: 'Bryan',
					sequence: 0,
					model
				});
			});

			it('the second transaction should have updated the "last name" property', () => {
				let argsOne = spy.calls.argsFor(1);

				expect({
					lastName: argsOne[0].lastName,
					sequence: argsOne[0].sequence,
					model: argsOne[1]
				}).toEqual({
					lastName: 'Ingle',
					sequence: 1,
					model
				});
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

				expect({
					firstName: argsOne[0].firstName,
					lastName: argsOne[0].lastName,
					sequence: argsOne[0].sequence,
					model: argsOne[1]
				}).toEqual({
					firstName: 'Bryan',
					lastName: 'Ingle',
					sequence: 0,
					model
				});
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
				expect({
					firstName: model.firstName,
					lastName: model.lastName
				}).toEqual({
					firstName: null,
					lastName: null
				});
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

					expect({
						firstName: argsOne[0].firstName,
						sequence: argsOne[0].sequence,
						model: argsOne[1]
					}).toEqual({
						firstName: 0,
						sequence: 0,
						model
					});
				});

				it('the second transaction should have updated the "last name" property to a zero-length string', () => {
					let argsOne = spy.calls.argsFor(1);

					expect({
						lastName: argsOne[0].lastName,
						sequence: argsOne[0].sequence,
						model: argsOne[1]
					}).toEqual({
						lastName: '',
						sequence: 1,
						model
					});
				});
			});
		});
	});
});
