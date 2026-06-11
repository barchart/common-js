const DynamoProvider = require('../../../aws/DynamoProvider');

const DataType = require('../../../aws/dynamo/schema/definitions/DataType'),
	KeyType = require('../../../aws/dynamo/schema/definitions/KeyType');

const OperatorType = require('../../../aws/dynamo/query/definitions/OperatorType'),
	ReturnValueType = require('../../../aws/dynamo/query/definitions/ReturnValueType'),
	UpdateActionType = require('../../../aws/dynamo/query/definitions/UpdateActionType'),
	UpdateOperatorType = require('../../../aws/dynamo/query/definitions/UpdateOperatorType');

const QueryBuilder = require('../../../aws/dynamo/query/builders/QueryBuilder'),
	ScanBuilder = require('../../../aws/dynamo/query/builders/ScanBuilder'),
	UpdateBuilder = require('../../../aws/dynamo/query/builders/UpdateBuilder');

const utils = require('../utils/ManualTestUtils');

utils.run('DynamoProvider manual test', async () => {
	const prefix = utils.prefix();

	const tableName = 'manual-table';
	const provider = new DynamoProvider({ region: utils.region(), prefix });

	let table = null;
	let backupArn = null;

	const started = await provider.start();
	utils.assertEqual(started, true, 'Dynamo provider should start');

	console.log('Configuration:', provider.getConfiguration());
	utils.assertEqual(provider.getConfiguration().prefix, prefix, 'getConfiguration should return configured prefix');

	try {
		table = provider.getTableBuilder(tableName)
			.withAttribute('id', DataType.STRING, KeyType.HASH)
			.withAttribute('value', DataType.STRING)
			.withAttribute('count', DataType.NUMBER)
			.withOnDemandThroughput()
			.table;

		const createdTable = await utils.step('createTable', () => provider.createTable(table));
		utils.assertEqual(createdTable.name, table.name, 'createTable should return created table definition');

		const fetchedTable = await utils.step('getTable', () => provider.getTable(tableName));
		utils.assertEqual(fetchedTable.name, table.name, 'getTable should return created table definition');

		const tables = await utils.step('getTables', () => provider.getTables());
		utils.assertIncludes(tables, table.name, 'getTables should include created table');

		utils.assertEqual(await utils.step('saveItem', () => provider.saveItem({ id: 'one', value: 'created', count: 1 }, table, true)), true, 'saveItem should return true');

		utils.assertEqual(await utils.step('createItems', () => provider.createItems([
			{ id: 'two', value: 'batch-2', count: 2 },
			{ id: 'three', value: 'batch-3', count: 3 }
		], table)), true, 'createItems should return true');

		const update = UpdateBuilder.targeting(table)
			.withKeyFilterBuilder(fb => fb.withExpression('id', OperatorType.EQUALS, 'one'))
			.withUpdateExpression(UpdateActionType.SET, 'value', UpdateOperatorType.EQUALS, 'updated')
			.withReturnValueType(ReturnValueType.ALL_NEW)
			.update;

		const updated = await utils.step('updateItem', () => provider.updateItem(update));
		utils.assertEqual(updated.value, 'updated', 'updateItem should return updated value');

		const scan = ScanBuilder.targeting(table)
			.withDescription('manual scan')
			.withLimit(10)
			.scan;

		const scanned = await utils.step('scan', () => provider.scan(scan));
		utils.assertEqual(scanned.length, 3, 'scan should return all inserted items');

		const scanChunk = await utils.step('scanChunk', () => provider.scanChunk(scan));
		utils.assertEqual(scanChunk.results.length, 3, 'scanChunk should return inserted items');

		const query = QueryBuilder.targeting(table)
			.withDescription('manual query')
			.withKeyFilterBuilder(fb => fb.withExpression('id', OperatorType.EQUALS, 'one'))
			.query;

		const queried = await utils.step('query', () => provider.query(query));
		utils.assertEqual(queried.length, 1, 'query should return one item');
		utils.assertEqual(queried[0].id, 'one', 'query should return requested item');

		const queryChunk = await utils.step('queryChunk', () => provider.queryChunk(query));
		utils.assertEqual(queryChunk.results.length, 1, 'queryChunk should return one item');

		const parallel = await utils.step('queryParallel', () => provider.queryParallel([query]));
		utils.assertEqual(parallel.length, 1, 'queryParallel should flatten query results');

		if (utils.env('DYNAMO_TEST_BACKUPS', 'false') === 'true') {
			const backupName = `manual-backup-${Date.now()}`;

			const backup = await utils.step('createBackup', () => provider.createBackup(table.name, backupName));

			utils.assertString(backup.BackupDetails.BackupArn, 'createBackup should return BackupArn');
			backupArn = backup.BackupDetails.BackupArn;

			const backups = await utils.step('listBackups', () => provider.listBackups(table.name));
			utils.assert(backups.some(item => item.BackupArn === backup.BackupDetails.BackupArn), 'listBackups should include created backup');
		} else {
			console.log('Skipping backup functions, set DYNAMO_TEST_BACKUPS=true to test createBackup/listBackups/deleteBackup.');
		}

	} finally {
		if (table) {
			await utils.pauseBeforeCleanup(`Inspect DynamoDB table [ ${table.name} ], then press Enter to cleanup.`);

			await utils.cleanup('deleteItem', async () => {
				utils.assertEqual(await provider.deleteItem({ id: 'one' }, table, true), true, 'deleteItem should return true');
			});

			await utils.cleanup('deleteItems', async () => {
				utils.assertEqual(await provider.deleteItems([{ id: 'two' }, { id: 'three' }], table, true), true, 'deleteItems should return true');
			});

			await utils.cleanup('deleteBackup', () => backupArn ? provider.deleteBackup(backupArn) : Promise.resolve());
			await utils.cleanup('deleteTable', () => provider.deleteTable(table.name));
		}
	}
});
