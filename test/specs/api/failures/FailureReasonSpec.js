var FailureReason = require('./../../../../api/failures/FailureReason'),
	FailureType = require('./../../../../api/failures/FailureType');

var DataType = require('./../../../../serialization/json/DataType'),
	Field = require('./../../../../serialization/json/Field'),
	Schema = require('./../../../../serialization/json/Schema');

describe('When a FailureReason is created', function() {
	'use strict';

	var reason;

	beforeEach(function() {
		reason = FailureReason.forRequest({ endpoint: { description: 'do stuff' }})
			.addItem(FailureType.REQUEST_CONSTRUCTION_FAILURE, { }, true)
			.addItem(FailureType.REQUEST_PARAMETER_MISSING, { name: 'First' })
			.addItem(FailureType.REQUEST_PARAMETER_MISSING, { name: 'Second' });
	});

	describe('and the FailureReason is checked for severity', function() {
		it('should be considered severe', function() {
			expect(reason.getIsSevere()).toEqual(true);
		});
	});

	describe('and the FailureReason is converted to a human-readable form', function() {
		var human;

		beforeEach(function() {
			human = reason.format();
		});

		it('should have one primary reason', function() {
			expect(human.length).toEqual(1);
		});

		it('should have two secondary reasons', function() {
			expect(human[0].children.length).toEqual(2);
		});

		it('should have the correct primary code', function() {
			expect(human[0].value.code).toEqual(FailureType.REQUEST_CONSTRUCTION_FAILURE.code);
		});

		it('should have the correct primary message', function() {
			expect(human[0].value.message).toEqual('An attempt to do stuff failed because some required information is missing.');
		});

		it('should have the correct secondary message (1)', function() {
			expect(human[0].children[0].value.message).toEqual('The "first" field is required.');
		});

		it('should have the correct secondary code (1)', function() {
			expect(human[0].children[0].value.code).toEqual(FailureType.REQUEST_PARAMETER_MISSING.code);
		});

		it('should have the correct secondary message (2)', function() {
			expect(human[0].children[1].value.message).toEqual('The "second" field is required.');
		});

		it('should have the correct secondary code (2)', function() {
			expect(human[0].children[1].value.code).toEqual(FailureType.REQUEST_PARAMETER_MISSING.code);
		});
	});
});

describe('When a schema is validated', function() {
	var schema;

	beforeEach(function() {
		schema = new Schema('person', [
			new Field('first', DataType.STRING),
			new Field('last', DataType.STRING)
		]);
	});

	describe('and a valid schema is processed', function() {
		var result;

		beforeEach(function(done) {
			FailureReason.validateSchema(schema, { first: 'bryan', last: 'ingle'})
				.then((r) => {
					result = r;

					done();
				});
		});

		it('should return null (not a FailureReason)', function() {
			expect(result).toEqual(null);
		});
	});

	describe('and an invalid schema is processed (with one invalid property)', function() {
		var successResult = null;
		var failureResult = null;

		beforeEach(function(done) {
			FailureReason.validateSchema(schema, { first: 'bryan' })
				.then((r) => {
					successResult = r;

					done();
				}).catch((e) => {
					failureResult = e;

					done();
				});
		});

		it('should fail with a formatted failure reason', function() {
			expect(failureResult).not.toEqual(null);
		});

		it('should fail with a formatted failure reason, having one child', function() {
			expect(failureResult[0].children.length).toEqual(1);
		});
	});

	describe('and an invalid schema is processed (with two invalid properties)', function() {
		var successResult = null;
		var failureResult = null;

		beforeEach(function(done) {
			FailureReason.validateSchema(schema, { })
				.then((r) => {
					successResult = r;

					done();
				}).catch((e) => {
					failureResult = e;

					done();
				});
		});

		it('should fail with a formatted failure reason', function() {
			expect(failureResult).not.toEqual(null);
		});

		it('should fail with a formatted failure reason, having two children', function() {
			expect(failureResult[0].children.length).toEqual(2);
		});
	});
});
