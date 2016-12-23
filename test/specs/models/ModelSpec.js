var Disposable = require('./../../../lang/Disposable');
var Model = require('./../../../models/Model');

describe('When an Model is constructed with "firstName" and "lastName" properties', function() {
	'use strict';

	var model;

	beforeEach(function() {
		model = new Model(['firstName', 'lastName']);
	});

	describe('and a transaction observer is registered', function() {
		var spy;
		var binding;

		beforeEach(function() {
			binding = model.onTransactionCommitted(spy = jasmine.createSpy('spy'));
		});

		it('should return a Disposable instance', function() {
			expect(binding instanceof Disposable).toEqual(true);
		});

		it('should return null values for each property', function() {
			expect(model.firstName).toBe(null);
			expect(model.lastName).toBe(null);
		});

		describe('and both properties are updated', function() {
			var data;

			beforeEach(function() {
				model.firstName = 'Bryan';
				model.lastName = 'Ingle';
			});

			it('two transactions should occur', function() {
				expect(spy.calls.count()).toEqual(2);
			});

			it('the first transaction should have updated the "first name" property', function() {
				var argsOne = spy.calls.argsFor(0);

				expect(argsOne[0].firstName).toEqual('Bryan');
				expect(argsOne[0].sequence).toEqual(0);

				expect(argsOne[1]).toBe(model);
			});

			it('the second transaction should have updated the "last name" property', function() {
				var argsOne = spy.calls.argsFor(1);

				expect(argsOne[0].lastName).toEqual('Ingle');
				expect(argsOne[0].sequence).toEqual(1);

				expect(argsOne[1]).toBe(model);
			});
		});

		describe('and both properties are updated with an explicit transaction', function() {
			var data;

			beforeEach(function() {
				model.executeTransaction(function(m) {
					m.firstName = 'Bryan';
					m.lastName = 'Ingle';
				});
			});

			it('one transaction should occur', function() {
				expect(spy.calls.count()).toEqual(1);
			});

			it('the first transaction should have updated the "first name" property', function() {
				var argsOne = spy.calls.argsFor(0);

				expect(argsOne[0].firstName).toEqual('Bryan');
				expect(argsOne[0].lastName).toEqual('Ingle');
				expect(argsOne[0].sequence).toEqual(0);

				expect(argsOne[1]).toBe(model);
			});
		});

		describe('and both properties are to undefined values', function() {
			var data;

			beforeEach(function() {
				model.firstName = undefined;
				model.lastName = undefined;
			});

			it('no transactions should occur', function() {
				expect(spy.calls.count()).toEqual(0);
			});

			it('the properties should return null values', function() {
				expect(model.firstName).toBe(null);
				expect(model.lastName).toBe(null);
			});

			describe('and both are updated to non-null values', function() {
				beforeEach(function() {
					model.firstName = 0;
					model.lastName = '';
				});

				it('two transactions should occur', function() {
					expect(spy.calls.count()).toEqual(2);
				});

				it('the first transaction should have updated the "first name" property to zero', function() {
					var argsOne = spy.calls.argsFor(0);

					expect(argsOne[0].firstName).toBe(0);
					expect(argsOne[0].sequence).toEqual(0);

					expect(argsOne[1]).toBe(model);
				});

				it('the second transaction should have updated the "last name" property to a zero-length string', function() {
					var argsOne = spy.calls.argsFor(1);

					expect(argsOne[0].lastName).toBe('');
					expect(argsOne[0].sequence).toEqual(1);

					expect(argsOne[1]).toBe(model);
				});
			});
		});
	});
});