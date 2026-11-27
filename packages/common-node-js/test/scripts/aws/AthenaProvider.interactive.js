import * as assert from '@barchart/common-js/lang/assert.js';
import * as utils from '../utils/InteractiveTestUtils.js';

import AthenaProvider from '../../../aws/AthenaProvider.js';

const rowCount = 1001;
const largeNumber = '9007199254740993';
const query = {
	QueryString: `
		SELECT sample_value, CAST(9007199254740993 AS BIGINT) AS large_number
		FROM UNNEST(SEQUENCE(CAST(1 AS BIGINT), CAST(1001 AS BIGINT))) AS samples(sample_value)
		WHERE sample_value >= ?
		ORDER BY sample_value
	`,
	ExecutionParameters: ['1']
};

function assertResults(result) {
	assert.areEqual(result.columns.length, 2, 'Result should have two columns');
	assert.areEqual(result.columns[0].name, 'sample_value', 'First column should be sample_value');
	assert.areEqual(result.columns[0].type, 'bigint', 'First column should be bigint');
	assert.areEqual(result.columns[1].name, 'large_number', 'Second column should be large_number');
	assert.areEqual(result.columns[1].type, 'bigint', 'Second column should be bigint');
	assert.areEqual(result.rows.length, rowCount, 'Result should contain all data rows');
	assert.areEqual(result.rows[0][0], '1', 'First value should be preserved');
	assert.areEqual(result.rows[998][0], '999', 'Value 999 should be preserved');
	assert.areEqual(result.rows[999][0], '1000', 'Value 1000 should be preserved');
	assert.areEqual(result.rows[1000][0], '1001', 'Last value should be preserved');
	assert.areEqual(result.rows[0][1], largeNumber, 'BIGINT should retain its precision');
}

utils.run('AthenaProvider interactive test', async () => {
	const workgroup = utils.env('ATHENA_TEST_WORKGROUP', 'primary');
	const statementName = `common_node_js_interactive_${Date.now()}`;

	const provider = new AthenaProvider({
		database: utils.env('ATHENA_TEST_DATABASE'),
		catalog: utils.env('ATHENA_TEST_CATALOG'),
		workgroup,
		outputLocation: utils.env('ATHENA_TEST_OUTPUT_LOCATION'),
		timeoutMs: Number(utils.env('ATHENA_TEST_TIMEOUT_MS', '60000'))
	}, { region: utils.region() });

	let pendingQueryId = null;
	let prepared = false;

	try {
		const started = await utils.step('start', () => provider.start());
		assert.areEqual(started, true, 'Athena provider should start');

		pendingQueryId = await utils.step('startQueryExecution', () => provider.startQueryExecution(query));
		assert.argumentIsValid(pendingQueryId, 'queryExecutionId', value => typeof value === 'string' && value.length > 0, 'startQueryExecution should return a query execution ID');

		await utils.step('getQueryExecution', async () => {
			const execution = await provider.getQueryExecution(pendingQueryId);

			assert.areEqual(execution.QueryExecutionId, pendingQueryId, 'getQueryExecution should return the requested query');
			assert.argumentIsValid(execution.Status?.State, 'state', value => typeof value === 'string' && value.length > 0, 'getQueryExecution should return a state');

			return { state: execution.Status.State };
		});

		await utils.step('waitForQueryExecution', async () => {
			const execution = await provider.waitForQueryExecution(pendingQueryId);

			assert.areEqual(execution.Status.State, 'SUCCEEDED', 'waitForQueryExecution should return a successful query');

			return { state: execution.Status.State, dataScannedInBytes: execution.Statistics?.DataScannedInBytes };
		});

		const queryExecutionId = pendingQueryId;
		pendingQueryId = null;

		await utils.step('getQueryResults with pagination', async () => {
			const rows = [ ];
			let nextToken;
			let pages = 0;

			do {
				const response = await provider.getQueryResults({
					QueryExecutionId: queryExecutionId,
					MaxResults: 1000,
					...(nextToken ? { NextToken: nextToken } : { })
				});

				assert.argumentIsValid(response.ResultSet?.Rows, 'rows', Array.isArray, 'getQueryResults should return rows');

				rows.push(...response.ResultSet.Rows);
				nextToken = response.NextToken;
				pages++;
			} while (nextToken);

			assert.argumentIsValid(pages > 1, 'pages', value => value === true, 'getQueryResults should return multiple pages');
			assert.areEqual(rows.length, rowCount + 1, 'getQueryResults should include the header and all data rows');
			assert.areEqual(rows[0].Data[0].VarCharValue, 'sample_value', 'First row should contain column headers');
			assert.areEqual(rows[1].Data[0].VarCharValue, '1', 'First data row should be preserved');
			assert.areEqual(rows[rows.length - 1].Data[0].VarCharValue, '1001', 'Last data row should be preserved');

			return { pages, dataRows: rows.length - 1 };
		});

		await utils.step('getAllQueryResults', async () => {
			const result = await provider.getAllQueryResults(queryExecutionId);

			assert.areEqual(result.queryExecutionId, queryExecutionId, 'getAllQueryResults should return the requested query ID');
			assertResults(result);

			return { queryExecutionId: result.queryExecutionId, dataRows: result.rows.length };
		});

		await utils.step('executeQuery', async () => {
			const result = await provider.executeQuery(query);

			assert.argumentIsValid(result.queryExecutionId, 'queryExecutionId', value => typeof value === 'string' && value.length > 0, 'executeQuery should return a query execution ID');
			assertResults(result);

			return { queryExecutionId: result.queryExecutionId, dataRows: result.rows.length, dataScannedInBytes: result.statistics?.DataScannedInBytes };
		});

		await utils.step('executeStatement (PREPARE)', async () => {
			const execution = await provider.executeStatement({ QueryString: `PREPARE ${statementName} FROM ${query.QueryString}` });

			prepared = true;

			assert.areEqual(execution.Status.State, 'SUCCEEDED', 'executeStatement should return a successful query');

			return { queryExecutionId: execution.QueryExecutionId, statementName };
		});

		await utils.step('getPreparedStatement', async () => {
			const response = await provider.getPreparedStatement({ StatementName: statementName, WorkGroup: workgroup });

			assert.areEqual(response.PreparedStatement?.StatementName, statementName, 'getPreparedStatement should return the prepared statement');

			return { statementName: response.PreparedStatement.StatementName, workgroup: response.PreparedStatement.WorkGroupName };
		});

		await utils.step('listPreparedStatements', async () => {
			const names = [ ];
			let nextToken;

			do {
				const response = await provider.listPreparedStatements({ WorkGroup: workgroup, NextToken: nextToken });

				names.push(...(response.PreparedStatements ?? []).map(statement => statement.StatementName));
				nextToken = response.NextToken;
			} while (nextToken);

			assert.argumentIsValid(names.includes(statementName), 'condition', value => value === true, 'listPreparedStatements should include the prepared statement');

			return { statements: names.length };
		});

		await utils.step('executePreparedStatement', async () => {
			const result = await provider.executePreparedStatement(statementName, query.ExecutionParameters);

			assertResults(result);

			return { queryExecutionId: result.queryExecutionId, dataRows: result.rows.length };
		});

		pendingQueryId = await utils.step('startQueryExecution for cancellation', () => provider.startQueryExecution(query));
		await utils.step('stopQueryExecution', () => provider.stopQueryExecution(pendingQueryId));

		const stoppedQueryId = pendingQueryId;
		pendingQueryId = null;

		await utils.step('getQueryExecution after stop', async () => {
			const execution = await provider.getQueryExecution(stoppedQueryId);

			assert.areEqual(execution.QueryExecutionId, stoppedQueryId, 'getQueryExecution should return the stopped query');

			return { queryExecutionId: stoppedQueryId, state: execution.Status?.State };
		});

		console.log('The stop request was accepted; the query may already have completed or may still be stopping.');

		await utils.pauseBeforeCleanup('Inspect the Athena executions, then press Enter to finish. Query result objects are not deleted by this test.');
	} finally {
		if (pendingQueryId !== null) {
			await utils.cleanup('stop unfinished query', () => provider.stopQueryExecution(pendingQueryId));
		}

		if (prepared) {
			await utils.cleanup('executeStatement (DEALLOCATE PREPARE)', () => provider.executeStatement({ QueryString: `DEALLOCATE PREPARE ${statementName}` }));
		}

		provider.dispose();
	}
});
