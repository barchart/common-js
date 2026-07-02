import Attribute from './../../../../../../aws/dynamo/schema/definitions/Attribute.js';
import DataType from './../../../../../../aws/dynamo/schema/definitions/DataType.js';
import Index from './../../../../../../aws/dynamo/schema/definitions/Index.js';
import IndexType from './../../../../../../aws/dynamo/schema/definitions/IndexType.js';
import Key from './../../../../../../aws/dynamo/schema/definitions/Key.js';
import KeyType from './../../../../../../aws/dynamo/schema/definitions/KeyType.js';
import Projection from './../../../../../../aws/dynamo/schema/definitions/Projection.js';
import ProjectionType from './../../../../../../aws/dynamo/schema/definitions/ProjectionType.js';
import Table from './../../../../../../aws/dynamo/schema/definitions/Table.js';
import Conditional from './../../../../../../aws/dynamo/query/definitions/Conditional.js';
import ConditionalBuilder from './../../../../../../aws/dynamo/query/builders/ConditionalBuilder.js';
import Filter from './../../../../../../aws/dynamo/query/definitions/Filter.js';
import FilterBuilder from './../../../../../../aws/dynamo/query/builders/FilterBuilder.js';
import OperatorType from './../../../../../../aws/dynamo/query/definitions/OperatorType.js';
import OrderingType from './../../../../../../aws/dynamo/query/definitions/OrderingType.js';
import Query from './../../../../../../aws/dynamo/query/definitions/Query.js';
import QueryBuilder from './../../../../../../aws/dynamo/query/builders/QueryBuilder.js';
import Scan from './../../../../../../aws/dynamo/query/definitions/Scan.js';
import ScanBuilder from './../../../../../../aws/dynamo/query/builders/ScanBuilder.js';

describe('When Dynamo query builders are used', () => {
	'use strict';

	let table;

	beforeEach(() => {
		const accountId = new Attribute('accountId', DataType.STRING);
		const createdAt = new Attribute('createdAt', DataType.NUMBER);
		const status = new Attribute('status', DataType.STRING);

		const index = new Index(
			'status-createdAt-index',
			IndexType.GLOBAL_SECONDARY,
			[ new Key(status, KeyType.HASH), new Key(createdAt, KeyType.RANGE) ],
			new Projection(ProjectionType.ALL)
		);

		table = new Table(
			'Orders',
			[ new Key(accountId, KeyType.HASH), new Key(createdAt, KeyType.RANGE) ],
			[ index ],
			[ accountId, createdAt, status ]
		);
	});

	it('should build a conditional action from a filter callback', () => {
		const builder = ConditionalBuilder.targeting(table)
			.withFilterBuilder(filterBuilder => filterBuilder.withExpression('status', OperatorType.ATTRIBUTE_EXISTS))
			.withDescription('status exists');

		const schema = builder.conditional.toConditionalSchema();

		expect({
			builder: builder instanceof ConditionalBuilder,
			action: builder.action instanceof Conditional,
			tableName: schema.TableName,
			conditionExpression: schema.ConditionExpression,
			expressionAttributeNames: schema.ExpressionAttributeNames
		}).toEqual({
			builder: true,
			action: true,
			tableName: 'Orders',
			conditionExpression: 'attribute_exists(#c)',
			expressionAttributeNames: {
				'#c': 'status'
			}
		});
	});

	it('should build a filter with expressions', () => {
		const queryBuilder = QueryBuilder.targeting(table);
		const filterBuilder = new FilterBuilder(queryBuilder)
			.withExpression('accountId', OperatorType.EQUALS, 'A1')
			.withExpressionBuilder('createdAt', expressionBuilder => {
				expressionBuilder
					.withOperatorType(OperatorType.BETWEEN)
					.withOperand([ 100, 200 ]);
			});

		expect({
			filter: filterBuilder.filter instanceof Filter,
			count: filterBuilder.filter.expressions.length,
			firstAttribute: filterBuilder.filter.expressions[0].attribute.name,
			secondOperand: filterBuilder.filter.expressions[1].operand
		}).toEqual({
			filter: true,
			count: 2,
			firstAttribute: 'accountId',
			secondOperand: [ 100, 200 ]
		});
	});

	it('should build a query schema without calling DynamoDB', () => {
		const exclusiveStartKey = {
			accountId: { S: 'A1' },
			createdAt: { N: '100' }
		};

		const builder = QueryBuilder.targeting(table)
			.withKeyFilterBuilder(filterBuilder => filterBuilder.withExpression('accountId', OperatorType.EQUALS, 'A1'))
			.withResultsFilterBuilder(filterBuilder => filterBuilder.withExpression('status', OperatorType.EQUALS, 'OPEN'))
			.withAttribute('status')
			.withLimit(25)
			.withOrderingType(OrderingType.DESCENDING)
			.withConsistentRead()
			.withDeserializationSkipped()
			.withCapacityMonitored()
			.withExclusiveStartKey(exclusiveStartKey)
			.withDescription('open orders');

		const schema = builder.query.toQuerySchema();

		expect({
			builder: builder instanceof QueryBuilder,
			action: builder.action instanceof Query,
			description: builder.query.description,
			schema
		}).toEqual({
			builder: true,
			action: true,
			description: 'open orders',
			schema: {
				TableName: 'Orders',
				Select: 'SPECIFIC_ATTRIBUTES',
				ProjectionExpression: '#c',
				KeyConditionExpression: '#a = :a',
				FilterExpression: '#c = :b',
				ExpressionAttributeNames: {
					'#c': 'status',
					'#a': 'accountId'
				},
				ExpressionAttributeValues: {
					':a': { S: 'A1' },
					':b': { S: 'OPEN' }
				},
				ScanIndexForward: false,
				Limit: 25,
				ConsistentRead: true,
				ReturnConsumedCapacity: 'TOTAL',
				ExclusiveStartKey: exclusiveStartKey
			}
		});
	});

	it('should build an index query schema', () => {
		const schema = QueryBuilder.targeting(table)
			.withIndex('status-createdAt-index')
			.withKeyFilterBuilder(filterBuilder => filterBuilder.withExpression('status', OperatorType.EQUALS, 'OPEN'))
			.withLimit(5)
			.query
			.toQuerySchema();

		expect({
			indexName: schema.IndexName,
			keyConditionExpression: schema.KeyConditionExpression,
			limit: schema.Limit
		}).toEqual({
			indexName: 'status-createdAt-index',
			keyConditionExpression: '#c = :a',
			limit: 5
		});
	});

	it('should create parallel queries from range partitions', () => {
		const queries = QueryBuilder.targeting(table)
			.withKeyFilterBuilder(filterBuilder => filterBuilder.withExpression('accountId', OperatorType.EQUALS, 'A1'))
			.withDescription('partitioned orders')
			.toParallelQueries(() => [
				{ start: 0, end: 100 },
				{ start: 101, end: null }
			]);

		expect({
			count: queries.length,
			instances: queries.every(query => query instanceof Query),
			firstDescription: queries[0].description,
			firstParallelOperator: queries[0].parallelFilter.expressions[0].operatorType,
			secondParallelOperator: queries[1].parallelFilter.expressions[0].operatorType
		}).toEqual({
			count: 2,
			instances: true,
			firstDescription: 'partitioned orders [ 0 ]',
			firstParallelOperator: OperatorType.BETWEEN,
			secondParallelOperator: OperatorType.GREATER_THAN_OR_EQUAL_TO
		});
	});

	it('should reject parallel count queries', () => {
		const builder = QueryBuilder.targeting(table)
			.withKeyFilterBuilder(filterBuilder => filterBuilder.withExpression('accountId', OperatorType.EQUALS, 'A1'))
			.withCount();

		expect(() => builder.toParallelQueries(() => [ ])).toThrow();
	});

	it('should build a scan schema without calling DynamoDB', () => {
		const exclusiveStartKey = {
			accountId: { S: 'A1' }
		};

		const builder = ScanBuilder.targeting(table)
			.withFilterBuilder(filterBuilder => filterBuilder.withExpression('status', OperatorType.EQUALS, 'OPEN'))
			.withAttribute('accountId')
			.withAttribute('status')
			.withAttribute('status')
			.withLimit(10)
			.withConcurrency(1, 4)
			.withConsistentRead()
			.withDeserializationSkipped()
			.withCapacityMonitored()
			.withExclusiveStartKey(exclusiveStartKey)
			.withDescription('open order scan');

		const schema = builder.scan.toScanSchema();

		expect({
			builder: builder instanceof ScanBuilder,
			action: builder.action instanceof Scan,
			description: builder.scan.description,
			attributeCount: builder.scan.attributes.length,
			schema
		}).toEqual({
			builder: true,
			action: true,
			description: 'open order scan',
			attributeCount: 2,
			schema: {
				TableName: 'Orders',
				Select: 'SPECIFIC_ATTRIBUTES',
				ProjectionExpression: '#a,#c',
				FilterExpression: '#c = :a',
				ExpressionAttributeValues: {
					':a': { S: 'OPEN' }
				},
				ExpressionAttributeNames: {
					'#a': 'accountId',
					'#c': 'status'
				},
				Limit: 10,
				Segment: 1,
				TotalSegments: 4,
				ConsistentRead: true,
				ReturnConsumedCapacity: 'TOTAL',
				ExclusiveStartKey: exclusiveStartKey
			}
		});
	});

	it('should build an index scan schema', () => {
		const schema = ScanBuilder.targeting(table)
			.withIndex('status-createdAt-index')
			.withCount()
			.scan
			.toScanSchema();

		expect(schema).toEqual({
			TableName: 'Orders',
			IndexName: 'status-createdAt-index',
			Select: 'COUNT'
		});
	});
});
