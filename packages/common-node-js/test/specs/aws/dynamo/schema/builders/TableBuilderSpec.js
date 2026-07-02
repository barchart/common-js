import TableBuilder from './../../../../../../aws/dynamo/schema/builders/TableBuilder.js';
import DataType from './../../../../../../aws/dynamo/schema/definitions/DataType.js';
import IndexType from './../../../../../../aws/dynamo/schema/definitions/IndexType.js';
import KeyType from './../../../../../../aws/dynamo/schema/definitions/KeyType.js';
import ProjectionType from './../../../../../../aws/dynamo/schema/definitions/ProjectionType.js';
import ProvisioningType from './../../../../../../aws/dynamo/schema/definitions/ProvisioningType.js';
import StreamViewType from './../../../../../../aws/dynamo/schema/definitions/StreamViewType.js';
import Table from './../../../../../../aws/dynamo/schema/definitions/Table.js';

describe('When Dynamo table schema builders are used', () => {
	'use strict';

	it('should build table attributes, keys, throughput, stream, ttl, and indexes', () => {
		const builder = TableBuilder.withName('Orders')
			.withAttribute('accountId', DataType.STRING, KeyType.HASH)
			.withAttribute('createdAt', DataType.NUMBER, KeyType.RANGE)
			.withAttribute('status', DataType.STRING)
			.withAttribute('ttl', DataType.NUMBER)
			.withProvisionedThroughput(3, 4)
			.withStreamViewType(StreamViewType.BOTH_IMAGES)
			.withTimeToLive('ttl')
			.withIndexBuilder('status-createdAt-index', (indexBuilder) => {
				indexBuilder
					.withType(IndexType.GLOBAL_SECONDARY)
					.withKey('status', KeyType.HASH)
					.withKey('createdAt', KeyType.RANGE)
					.withProjection(ProjectionType.ALL)
					.withProvisionedThroughput(5, 6);
			});

		const table = builder.table;
		const schema = table.toTableSchema();

		expect({
			builder: builder instanceof TableBuilder,
			table: table instanceof Table,
			name: table.name,
			hashKey: table.hashKey.attribute.name,
			rangeKey: table.rangeKey.attribute.name,
			provisioningType: table.provisioningType,
			ttlSchema: table.toTtlSchema(),
			schema
		}).toEqual({
			builder: true,
			table: true,
			name: 'Orders',
			hashKey: 'accountId',
			rangeKey: 'createdAt',
			provisioningType: ProvisioningType.PROVISIONED,
			ttlSchema: {
				TableName: 'Orders',
				TimeToLiveSpecification: {
					AttributeName: 'ttl',
					Enabled: true
				}
			},
			schema: {
				TableName: 'Orders',
				KeySchema: [
					{ AttributeName: 'accountId', KeyType: 'HASH' },
					{ AttributeName: 'createdAt', KeyType: 'RANGE' }
				],
				BillingMode: 'PROVISIONED',
				ProvisionedThroughput: {
					ReadCapacityUnits: 3,
					WriteCapacityUnits: 4
				},
				GlobalSecondaryIndexes: [
					{
						IndexName: 'status-createdAt-index',
						KeySchema: [
							{ AttributeName: 'status', KeyType: 'HASH' },
							{ AttributeName: 'createdAt', KeyType: 'RANGE' }
						],
						Projection: {
							ProjectionType: 'ALL'
						},
						BillingMode: 'PROVISIONED',
						ProvisionedThroughput: {
							ReadCapacityUnits: 5,
							WriteCapacityUnits: 6
						}
					}
				],
				AttributeDefinitions: [
					{ AttributeName: 'status', AttributeType: 'S' },
					{ AttributeName: 'createdAt', AttributeType: 'N' },
					{ AttributeName: 'accountId', AttributeType: 'S' }
				],
				StreamSpecification: {
					StreamEnabled: true,
					StreamViewType: 'NEW_AND_OLD_IMAGES'
				}
			}
		});
	});

	it('should build on-demand tables from AWS-style definitions', () => {
		const table = TableBuilder.fromDefinition({
			TableName: 'Orders',
			AttributeDefinitions: [
				{ AttributeName: 'accountId', AttributeType: 'S' },
				{ AttributeName: 'createdAt', AttributeType: 'N' },
				{ AttributeName: 'status', AttributeType: 'S' }
			],
			KeySchema: [
				{ AttributeName: 'accountId', KeyType: 'HASH' },
				{ AttributeName: 'createdAt', KeyType: 'RANGE' }
			],
			GlobalSecondaryIndexes: [
				{
					IndexName: 'status-createdAt-index',
					KeySchema: [
						{ AttributeName: 'status', KeyType: 'HASH' },
						{ AttributeName: 'createdAt', KeyType: 'RANGE' }
					],
					Projection: {
						ProjectionType: 'ALL'
					}
				}
			],
			StreamSpecification: {
				StreamEnabled: true,
				StreamViewType: 'NEW_IMAGE'
			},
			TimeToLiveDescription: {
				TimeToLiveStatus: 'ENABLED',
				AttributeName: 'ttl'
			}
		});

		expect({
			name: table.name,
			provisioningType: table.provisioningType,
			indexName: table.indices[0].name,
			streamViewType: table.streamViewType,
			ttlAttribute: table.ttlAttribute
		}).toEqual({
			name: 'Orders',
			provisioningType: ProvisioningType.ON_DEMAND,
			indexName: 'status-createdAt-index',
			streamViewType: StreamViewType.NEW_IMAGE,
			ttlAttribute: 'ttl'
		});
	});

	it('should switch provisioned throughput back to on-demand', () => {
		const table = TableBuilder.withName('Orders')
			.withAttribute('accountId', DataType.STRING, KeyType.HASH)
			.withProvisionedThroughput(3, 4)
			.withOnDemandThroughput()
			.table;

		expect({
			provisioningType: table.provisioningType,
			provisionedThroughput: table.provisionedThroughput,
			billingMode: table.toTableSchema().BillingMode
		}).toEqual({
			provisioningType: ProvisioningType.ON_DEMAND,
			provisionedThroughput: null,
			billingMode: 'PAY_PER_REQUEST'
		});
	});
});
