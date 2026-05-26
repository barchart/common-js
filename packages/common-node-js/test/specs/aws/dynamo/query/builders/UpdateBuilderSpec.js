const TableBuilder = require('./../../../../../../aws/dynamo/schema/builders/TableBuilder'),
	DataType = require('./../../../../../../aws/dynamo/schema/definitions/DataType'),
	OperatorType = require('./../../../../../../aws/dynamo/query/definitions/OperatorType'),
	KeyType = require('./../../../../../../aws/dynamo/schema/definitions/KeyType'),
	UpdateActionType = require('./../../../../../../aws/dynamo/query/definitions/UpdateActionType'),
	UpdateBuilder = require('./../../../../../../aws/dynamo/query/builders/UpdateBuilder'),
	UpdateOperatorType = require('./../../../../../../aws/dynamo/query/definitions/UpdateOperatorType');

describe('When creating an update query', () => {
	'use strict';

	let table;

	beforeEach(() => {
		table = TableBuilder.withName('table')
			.withAttribute('hash', DataType.STRING, KeyType.HASH)
			.withAttribute('range', DataType.NUMBER, KeyType.RANGE)
			.withAttribute('name', DataType.STRING)
			.withAttribute('counters.first', DataType.NUMBER)
			.withAttribute('counters.second', DataType.NUMBER)
			.withAttribute('counters.three', DataType.NUMBER)
			.withAttribute('counters.four', DataType.NUMBER)
			.table;
	});

	describe('and references only hash key', () => {
		let builder;

		beforeEach(() => {
			builder = UpdateBuilder.targeting(table)
				.withDescription('Test update')
				.withKeyFilterBuilder((kfb) => {
					kfb.withExpression('hash', OperatorType.EQUALS, 'hash-key');
				})
				.withUpdateExpression(UpdateActionType.SET, 'counters.first', UpdateOperatorType.PLUS, 3);
		});

		it('should throw a validation error', () => {
			expect(() => builder.update.toUpdateSchema()).toThrowError();
		});
	});

	describe('and references multiple targets', () => {
		let builder;

		beforeEach(() => {
			builder = UpdateBuilder.targeting(table)
				.withDescription('Test update')
				.withKeyFilterBuilder((kfb) => {
					kfb.withExpression('hash', OperatorType.EQUALS, 'hash-key')
						.withExpression('range', OperatorType.GREATER_THAN_OR_EQUAL_TO, 0);
				})
				.withUpdateExpression(UpdateActionType.SET, 'counters.first', UpdateOperatorType.PLUS, 3);
		});

		it('should throw a validation error', () => {
			expect(() => builder.update.toUpdateSchema()).toThrowError();
		});
	});

	describe('and update expressions are missing', () => {
		let builder;

		beforeEach(() => {
			builder = UpdateBuilder.targeting(table)
				.withDescription('Test update')
				.withKeyFilterBuilder((kfb) => {
					kfb.withExpression('hash', OperatorType.EQUALS, 'hash-key')
						.withExpression('range', OperatorType.EQUALS, 1);
				});
		});

		it('should throw a validation error', () => {
			expect(() => builder.update.toUpdateSchema()).toThrowError();
		});
	});

	describe('and set different update action types', () => {
		let builder;

		beforeEach(() => {
			builder = UpdateBuilder.targeting(table)
				.withDescription('Test update')
				.withKeyFilterBuilder((kfb) => {
					kfb.withExpression('hash', OperatorType.EQUALS, 'hash-key')
						.withExpression('range', OperatorType.EQUALS, 1);
				})
				.withConditionFilterBuilder((cfb) => {
					cfb.withExpression('hash', OperatorType.EQUALS, 'hash-key')
						.withExpression('range', OperatorType.EQUALS, 1)
						.withExpression('name', OperatorType.ATTRIBUTE_EXISTS)
						.withExpression('counters.first', OperatorType.GREATER_THAN_OR_EQUAL_TO, 0);
				})
				.withUpdateExpression(UpdateActionType.SET, 'name', UpdateOperatorType.EQUALS_IF_NOT_EXISTS, 'testing')
				.withUpdateExpression(UpdateActionType.SET, 'counters.first', UpdateOperatorType.PLUS, 3)
				.withUpdateExpression(UpdateActionType.SET, 'counters.second', UpdateOperatorType.MINUS, 4)
				.withUpdateExpression(UpdateActionType.ADD, 'counters.three', UpdateOperatorType.SPACE, 10)
				.withUpdateExpression(UpdateActionType.REMOVE, 'counters.four');
		});

		it('should contain each action type keyword only once', () => {
			const schema = builder.update.toUpdateSchema();

			expect(schema.UpdateExpression.match(/SET/g).length).toEqual(1);
			expect(schema.UpdateExpression.match(/ADD/g).length).toEqual(1);
			expect(schema.UpdateExpression.match(/REMOVE/g).length).toEqual(1);
		});
	});

	describe('and set incompatible action type and operators', () => {
		let builder;

		beforeEach(() => {
			builder = UpdateBuilder.targeting(table)
				.withDescription('Test update')
				.withKeyFilterBuilder((kfb) => {
					kfb.withExpression('hash', OperatorType.EQUALS, 'hash-key')
					.withExpression('range', OperatorType.EQUALS, 1);
				})
				.withUpdateExpression(UpdateActionType.ADD, 'name', UpdateOperatorType.MINUS, 'testing');
		});

		it('should throw an error', () => {
			expect(() => builder.update.toUpdateSchema()).toThrowError();
		});
	});
});

