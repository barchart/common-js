import * as assert from '@barchart/common-js/lang/assert.js';
import * as utils from '../utils/InteractiveTestUtils.js';

import DynamoProvider from '../../../aws/DynamoProvider.js';
import DataType from '../../../aws/dynamo/schema/definitions/DataType.js';
import KeyType from '../../../aws/dynamo/schema/definitions/KeyType.js';
import OperatorType from '../../../aws/dynamo/query/definitions/OperatorType.js';
import ReturnValueType from '../../../aws/dynamo/query/definitions/ReturnValueType.js';
import UpdateActionType from '../../../aws/dynamo/query/definitions/UpdateActionType.js';
import UpdateOperatorType from '../../../aws/dynamo/query/definitions/UpdateOperatorType.js';
import QueryBuilder from '../../../aws/dynamo/query/builders/QueryBuilder.js';
import ScanBuilder from '../../../aws/dynamo/query/builders/ScanBuilder.js';
import UpdateBuilder from '../../../aws/dynamo/query/builders/UpdateBuilder.js';

utils.run('DynamoProvider interactive test', async () => {
	const prefix = utils.prefix();

	const tableName = 'interactive-table';
	const provider = new DynamoProvider({ prefix }, { region: utils.region() });

	let table = null;
	let backupArn = null;

	const started = await provider.start();
	assert.areEqual(started, true, 'Dynamo provider should start');

	console.log('Configuration:', provider.getConfiguration());
	assert.areEqual(provider.getConfiguration().prefix, prefix, 'getConfiguration should return configured prefix');

	try {
		table = provider.getTableBuilder(tableName)
			.withAttribute('id', DataType.STRING, KeyType.HASH)
			.withAttribute('value', DataType.STRING)
			.withAttribute('count', DataType.NUMBER)
			.withOnDemandThroughput()
			.table;

		const createdTable = await utils.step('createTable', () => provider.createTable(table));
		assert.areEqual(createdTable.name, table.name, 'createTable should return created table definition');

		const fetchedTable = await utils.step('getTable', () => provider.getTable(tableName));
		assert.areEqual(fetchedTable.name, table.name, 'getTable should return created table definition');

		const tables = await utils.step('getTables', () => provider.getTables());
		assert.argumentIsValid(tables, 'values', value => Array.isArray(value) && value.includes(table.name), 'getTables should include created table');

		assert.areEqual(await utils.step('saveItem', () => provider.saveItem({ id: 'one', value: 'created', count: 1 }, table, true)), true, 'saveItem should return true');

		assert.areEqual(await utils.step('createItems', () => provider.createItems([
			{ id: 'two', value: 'batch-2', count: 2 },
			{ id: 'three', value: 'batch-3', count: 3 }
		], table)), true, 'createItems should return true');

		const update = UpdateBuilder.targeting(table)
			.withKeyFilterBuilder(fb => fb.withExpression('id', OperatorType.EQUALS, 'one'))
			.withUpdateExpression(UpdateActionType.SET, 'value', UpdateOperatorType.EQUALS, 'updated')
			.withReturnValueType(ReturnValueType.ALL_NEW)
			.update;

		const updated = await utils.step('updateItem', () => provider.updateItem(update));
		assert.areEqual(updated.value, 'updated', 'updateItem should return updated value');

		const scan = ScanBuilder.targeting(table)
			.withDescription('interactive scan')
			.withLimit(10)
			.scan;

		const scanned = await utils.step('scan', () => provider.scan(scan));
		assert.areEqual(scanned.length, 3, 'scan should return all inserted items');

		const scanChunk = await utils.step('scanChunk', () => provider.scanChunk(scan));
		assert.areEqual(scanChunk.results.length, 3, 'scanChunk should return inserted items');

		const query = QueryBuilder.targeting(table)
			.withDescription('interactive query')
			.withKeyFilterBuilder(fb => fb.withExpression('id', OperatorType.EQUALS, 'one'))
			.query;

		const queried = await utils.step('query', () => provider.query(query));
		assert.areEqual(queried.length, 1, 'query should return one item');
		assert.areEqual(queried[0].id, 'one', 'query should return requested item');

		const queryChunk = await utils.step('queryChunk', () => provider.queryChunk(query));
		assert.areEqual(queryChunk.results.length, 1, 'queryChunk should return one item');

		const parallel = await utils.step('queryParallel', () => provider.queryParallel([query]));
		assert.areEqual(parallel.length, 1, 'queryParallel should flatten query results');

		if (utils.env('DYNAMO_TEST_BACKUPS', 'false') === 'true') {
			const backupName = `interactive-backup-${Date.now()}`;

			const backup = await utils.step('createBackup', () => provider.createBackup(table.name, backupName));

			assert.argumentIsValid(backup.BackupDetails.BackupArn, 'value', value => typeof value === 'string' && value.length > 0, 'createBackup should return BackupArn');
			backupArn = backup.BackupDetails.BackupArn;

			const backups = await utils.step('listBackups', () => provider.listBackups(table.name));
			assert.argumentIsValid(backups.some(item => item.BackupArn === backup.BackupDetails.BackupArn), 'condition', value => value === true, 'listBackups should include created backup');
		} else {
			console.log('Skipping backup functions, set DYNAMO_TEST_BACKUPS=true to test createBackup/listBackups/deleteBackup.');
		}

	} finally {
		if (table) {
			await utils.pauseBeforeCleanup(`Inspect DynamoDB table [ ${table.name} ], then press Enter to cleanup.`);

			await utils.cleanup('deleteItem', async () => {
				assert.areEqual(await provider.deleteItem({ id: 'one' }, table, true), true, 'deleteItem should return true');
			});

			await utils.cleanup('deleteItems', async () => {
				assert.areEqual(await provider.deleteItems([{ id: 'two' }, { id: 'three' }], table, true), true, 'deleteItems should return true');
			});

			await utils.cleanup('deleteBackup', async () => {
				if (backupArn) {
					await provider.deleteBackup(backupArn);
				}
			});

			await utils.cleanup('deleteTable', () => provider.deleteTable(table.name));
		}
	}
});
