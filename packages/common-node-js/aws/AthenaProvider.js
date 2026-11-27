import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';

import Disposable from '@barchart/common-js/lang/Disposable.js';

import AwsOptions from './AwsOptions.js';

import { AthenaClient, GetPreparedStatementCommand, GetQueryExecutionCommand, GetQueryResultsCommand, ListPreparedStatementsCommand, StartQueryExecutionCommand, StopQueryExecutionCommand } from '@aws-sdk/client-athena';

import log4js from 'log4js';

const logger = log4js.getLogger('common-node/aws/AthenaProvider');

/**
 * @typedef {import('@aws-sdk/client-athena').AthenaClientConfig} AthenaProviderOptions
 * @typedef {import('@aws-sdk/client-athena').StartQueryExecutionCommandInput} StartQueryExecutionCommandInput
 * @typedef {import('@aws-sdk/client-athena').GetQueryResultsCommandInput} GetQueryResultsCommandInput
 * @typedef {import('@aws-sdk/client-athena').GetQueryResultsCommandOutput} GetQueryResultsCommandOutput
 * @typedef {import('@aws-sdk/client-athena').GetPreparedStatementCommandInput} GetPreparedStatementCommandInput
 * @typedef {import('@aws-sdk/client-athena').GetPreparedStatementCommandOutput} GetPreparedStatementCommandOutput
 * @typedef {import('@aws-sdk/client-athena').ListPreparedStatementsCommandInput} ListPreparedStatementsCommandInput
 * @typedef {import('@aws-sdk/client-athena').ListPreparedStatementsCommandOutput} ListPreparedStatementsCommandOutput
 */

/**
 * A facade for Amazon's Athena service. The constructor accepts
 * configuration options. The promise-based instance functions
 * abstract knowledge of the AWS API.
 *
 * @public
 * @extends Disposable
 */
export default class AthenaProvider extends Disposable {
	#athena;

	#configuration;
	#options;

	#started;

	/**
	 * @param {object=} configuration - The configuration.
	 * @param {string=} configuration.database - The default query database.
	 * @param {string=} configuration.catalog - The default data catalog.
	 * @param {string=} configuration.workgroup - The default workgroup.
	 * @param {string=} configuration.outputLocation - The default S3 query result location.
	 * @param {number=} configuration.pollIntervalMs - The delay between status checks (defaults to 1,000 ms).
	 * @param {number=} configuration.timeoutMs - The maximum waiting time (defaults to 60,000 ms).
	 * @param {number=} configuration.maxRows - The maximum number of returned data rows (defaults to 10,000).
	 * @param {AthenaProviderOptions=} options - The AWS SDK client configuration.
	 */
	constructor(configuration = { }, options) {
		super();

		assert.argumentIsRequired(configuration, 'configuration', Object);
		assert.argumentIsOptional(options, 'options', Object);

		assert.argumentIsOptional(configuration.database, 'configuration.database', String);
		assert.argumentIsOptional(configuration.catalog, 'configuration.catalog', String);
		assert.argumentIsOptional(configuration.workgroup, 'configuration.workgroup', String);
		assert.argumentIsOptional(configuration.outputLocation, 'configuration.outputLocation', String);

		this.#athena = null;

		this.#configuration = {
			pollIntervalMs: 1000,
			timeoutMs: 60000,
			maxRows: 10000,
			...configuration
		};
		this.#options = { ...AwsOptions.instance.options, ...options };

		this.#started = false;
	}

	/**
	 * Connects to Amazon. Must be called once before using other instance
	 * functions.
	 *
	 * @public
	 * @async
	 * @returns {Promise<boolean>}
	 */
	async start() {
		if (this.disposed) {
			throw new Error('The Athena provider has been disposed');
		}

		if (!this.#started) {
			try {
				this.#athena = new AthenaClient(this.#options);

				logger.info('The Athena provider has started');

				this.#started = true;
			} catch (e) {
				logger.error('The Athena provider failed to start', e);

				throw e;
			}
		}

		return this.#started;
	}

	/**
	 * Submits SQL without waiting. Native parameters, idempotency and reuse options pass through.
	 * Explicit request settings override configured query defaults.
	 *
	 * @public
	 * @async
	 * @param {StartQueryExecutionCommandInput} input
	 * @returns {Promise<string>}
	 */
	async startQueryExecution(input) {
		assert.argumentIsRequired(input, 'input', Object);

		this.#checkReady();

		const { database, catalog, workgroup, outputLocation } = this.#configuration;

		const payload = { ...input };

		if (database || catalog) {
			payload.QueryExecutionContext = { Database: database, Catalog: catalog, ...input.QueryExecutionContext };
		}

		if (outputLocation) {
			payload.ResultConfiguration = { OutputLocation: outputLocation, ...input.ResultConfiguration };
		}

		if (workgroup && !input.WorkGroup) {
			payload.WorkGroup = workgroup;
		}

		const response = await this.#athena.send(new StartQueryExecutionCommand(payload));

		if (!response.QueryExecutionId) {
			throw new Error('Athena did not return a query execution ID');
		}

		return response.QueryExecutionId;
	}

	/**
	 * Retrieves native execution metadata, including status and statistics.
	 *
	 * @public
	 * @async
	 * @param {string} queryExecutionId
	 * @returns {Promise<object>}
	 */
	async getQueryExecution(queryExecutionId) {
		assert.argumentIsRequired(queryExecutionId, 'queryExecutionId', String);

		this.#checkReady();

		return this.#getQueryExecution(queryExecutionId);
	}

	/**
	 * Retrieves one native result page. Athena permits at most 1,000 rows per request.
	 * Manifest and other native request options remain available here.
	 *
	 * @public
	 * @async
	 * @param {GetQueryResultsCommandInput} input
	 * @returns {Promise<GetQueryResultsCommandOutput>}
	 */
	async getQueryResults(input) {
		assert.argumentIsRequired(input, 'input', Object);

		this.#checkReady();

		return this.#athena.send(new GetQueryResultsCommand(input));
	}

	/**
	 * Requests cancellation without waiting for a confirmed CANCELLED state.
	 *
	 * @public
	 * @async
	 * @param {string} queryExecutionId
	 * @returns {Promise<void>}
	 */
	async stopQueryExecution(queryExecutionId) {
		assert.argumentIsRequired(queryExecutionId, 'queryExecutionId', String);

		this.#checkReady();

		await this.#athena.send(new StopQueryExecutionCommand({ QueryExecutionId: queryExecutionId }));
	}

	/**
	 * Polls immediately, then sequentially until success or the waiting deadline.
	 * A timeout aborts an in-flight status request, but does not stop the query.
	 *
	 * @public
	 * @async
	 * @param {string} queryExecutionId
	 * @param {object=} options
	 * @param {number=} options.pollIntervalMs - Overrides the configured polling interval.
	 * @param {number=} options.timeoutMs - Overrides the configured waiting deadline.
	 * @returns {Promise<object>}
	 */
	async waitForQueryExecution(queryExecutionId, options = { }) {
		assert.argumentIsRequired(queryExecutionId, 'queryExecutionId', String);
		assert.argumentIsRequired(options, 'options', Object);

		this.#checkReady();

		const pollIntervalMs = options.pollIntervalMs ?? this.#configuration.pollIntervalMs;
		const timeoutMs = options.timeoutMs ?? this.#configuration.timeoutMs;

		this.#validateWaitOptions({ pollIntervalMs, timeoutMs });

		const deadline = Date.now() + timeoutMs;
		const timeoutError = new AthenaQueryError(`Athena query [ ${queryExecutionId} ] timed out after ${timeoutMs} ms`, queryExecutionId, 'TIMEOUT');

		while (Date.now() < deadline) {
			this.#checkReady();

			const controller = new AbortController();
			let timer;
			let execution;

			try {
				execution = await Promise.race([
					new Promise((resolve, reject) => {
						timer = setTimeout(() => {
							reject(timeoutError);
							controller.abort();
						}, deadline - Date.now());
					}),
					
					this.#getQueryExecution(queryExecutionId, controller.signal)
				]);
			} finally {
				clearTimeout(timer);
			}

			if (Date.now() >= deadline) {
				throw timeoutError;
			}

			const status = execution.Status;
			const state = status?.State;

			if (state === 'SUCCEEDED') {
				return execution;
			}

			if (state === 'FAILED' || state === 'CANCELLED') {
				throw new AthenaQueryError(`Athena query [ ${queryExecutionId} ] ${state}${status.StateChangeReason ? `: ${status.StateChangeReason}` : ''}`, queryExecutionId, state, status);
			}

			if (state !== 'QUEUED' && state !== 'RUNNING') {
				throw new AthenaQueryError(`Athena query [ ${queryExecutionId} ] returned an invalid state`, queryExecutionId, 'INVALID_RESPONSE', status);
			}

			await new Promise(resolve => setTimeout(resolve, Math.min(pollIntervalMs, Math.max(0, deadline - Date.now()))));
		}

		throw timeoutError;
	}

	/**
	 * Collects DATA_ROWS for SELECT queries, omitting only the first page's header.
	 * Values remain strings or null. Exceeding maxRows rejects rather than truncates.
	 *
	 * @public
	 * @async
	 * @param {string} queryExecutionId
	 * @param {object=} options
	 * @param {number=} options.maxRows - Overrides the configured data-row limit.
	 * @returns {Promise<object>}
	 */
	async getAllQueryResults(queryExecutionId, options = { }) {
		assert.argumentIsRequired(queryExecutionId, 'queryExecutionId', String);
		assert.argumentIsRequired(options, 'options', Object);

		this.#checkReady();

		const maxRows = options.maxRows ?? this.#configuration.maxRows;

		this.#validateMaxRows(maxRows);

		let columns = [ ];
		const rows = [ ];
		
		let nextToken;
		let firstPage = true;

		do {
			const page = await this.getQueryResults({
				QueryExecutionId: queryExecutionId,
				QueryResultType: 'DATA_ROWS',
				MaxResults: 1000,
				NextToken: nextToken
			});
			
			const resultSet = page.ResultSet;
			let pageRows = resultSet?.Rows ?? [];

			if (firstPage) {
				columns = (resultSet?.ResultSetMetadata?.ColumnInfo ?? []).map(column => ({ name: column.Name, type: column.Type }));
				pageRows = pageRows.slice(1);
				firstPage = false;
			}

			if (rows.length + pageRows.length > maxRows) {
				throw new AthenaQueryError(`Athena query [ ${queryExecutionId} ] exceeded the ${maxRows} data-row limit`, queryExecutionId, 'ROW_LIMIT_EXCEEDED');
			}

			for (const row of pageRows) {
				rows.push(columns.map((column, index) => row.Data?.[index]?.VarCharValue ?? null));
			}

			nextToken = page.NextToken;
		} while (nextToken);

		return { queryExecutionId, columns, rows };
	}

	/**
	 * Submits and waits for a statement without retrieving results. Intended for
	 * statements such as PREPARE, DEALLOCATE PREPARE or CREATE VIEW. By default, a
	 * waiting timeout triggers a best-effort stop of this call's query. The timeout
	 * bounds waiting only, not the stop request.
	 *
	 * @public
	 * @async
	 * @param {StartQueryExecutionCommandInput} input
	 * @param {object=} options
	 * @param {number=} options.pollIntervalMs - Overrides the configured polling interval.
	 * @param {number=} options.timeoutMs - Overrides the configured waiting deadline.
	 * @param {boolean=} options.cancelOnTimeout - Stops the query on timeout (defaults to true).
	 * @returns {Promise<object>}
	 */
	async executeStatement(input, options = { }) {
		const { execution } = await this.#executeStatement(input, options);

		return execution;
	}

	/**
	 * Submits, waits for and collects bounded SELECT results with execution statistics.
	 * By default, a waiting timeout triggers a best-effort stop of this call's query.
	 * Result failures retain the original error as cause and never resubmit SQL.
	 * The timeout bounds waiting only, not result retrieval. The row limit does not
	 * limit the data scanned (and billed) by Athena.
	 *
	 * @public
	 * @async
	 * @param {StartQueryExecutionCommandInput} input
	 * @param {object=} options
	 * @param {number=} options.pollIntervalMs - Overrides the configured polling interval.
	 * @param {number=} options.timeoutMs - Overrides the configured waiting deadline.
	 * @param {number=} options.maxRows - Overrides the configured data-row limit.
	 * @param {boolean=} options.cancelOnTimeout - Stops the query on timeout (defaults to true).
	 * @returns {Promise<object>}
	 */
	async executeQuery(input, options = { }) {
		assert.argumentIsRequired(options, 'options', Object);

		this.#validateMaxRows(options.maxRows ?? this.#configuration.maxRows);

		const { queryExecutionId, execution } = await this.#executeStatement(input, options);

		try {
			const result = await this.getAllQueryResults(queryExecutionId, options);

			return { ...result, statistics: execution.Statistics };
		} catch (error) {
			if (error instanceof AthenaQueryError) {
				throw error;
			}

			throw new AthenaQueryError(`Failed to retrieve results for Athena query [ ${queryExecutionId} ]`, queryExecutionId, 'RESULT_ERROR', execution.Status, error);
		}
	}

	/**
	 * Executes a prepared statement and collects its results, like executeQuery. The
	 * statement name must be a valid identifier. Parameters are passed separately as
	 * execution parameters and must already be encoded as SQL literals.
	 *
	 * @public
	 * @async
	 * @param {string} statementName - The prepared statement name.
	 * @param {string[]=} parameters - SQL literals for the statement's positional placeholders.
	 * @param {object=} options - The same options accepted by executeQuery.
	 * @returns {Promise<object>}
	 */
	async executePreparedStatement(statementName, parameters, options) {
		assert.argumentIsRequired(statementName, 'statementName', String);
		assert.argumentIsOptional(parameters, 'parameters', Array);

		if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(statementName)) {
			throw new Error(`The prepared statement name [ ${statementName} ] is invalid`);
		}

		const input = { QueryString: `EXECUTE ${statementName}` };

		if (parameters && parameters.length > 0) {
			input.ExecutionParameters = parameters;
		}

		return this.executeQuery(input, options);
	}

	/**
	 * Retrieves one native prepared statement description.
	 *
	 * @public
	 * @async
	 * @param {GetPreparedStatementCommandInput} input
	 * @returns {Promise<GetPreparedStatementCommandOutput>}
	 */
	async getPreparedStatement(input) {
		assert.argumentIsRequired(input, 'input', Object);

		this.#checkReady();

		return this.#athena.send(new GetPreparedStatementCommand(input));
	}

	/**
	 * Retrieves one native page of prepared statements for a workgroup. Subsequent
	 * pages are not fetched implicitly; pass the returned NextToken instead.
	 *
	 * @public
	 * @async
	 * @param {ListPreparedStatementsCommandInput} input
	 * @returns {Promise<ListPreparedStatementsCommandOutput>}
	 */
	async listPreparedStatements(input) {
		assert.argumentIsRequired(input, 'input', Object);

		this.#checkReady();

		return this.#athena.send(new ListPreparedStatementsCommand(input));
	}

	/**
	 * @protected
	 * @override
	 */
	_onDispose() {
		this.#athena?.destroy();
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[AthenaProvider]';
	}

	/**
	 * @param {string} queryExecutionId
	 * @param {AbortSignal=} abortSignal
	 * @returns {Promise<object>}
	 */
	async #getQueryExecution(queryExecutionId, abortSignal) {
		const response = await this.#athena.send(new GetQueryExecutionCommand({ QueryExecutionId: queryExecutionId }), { abortSignal });

		if (!response.QueryExecution) {
			throw new AthenaQueryError(`Athena did not return execution [ ${queryExecutionId} ]`, queryExecutionId, 'INVALID_RESPONSE');
		}

		return response.QueryExecution;
	}

	/**
	 * @param {StartQueryExecutionCommandInput} input
	 * @param {object} options
	 * @returns {Promise<object>}
	 */
	async #executeStatement(input, options) {
		assert.argumentIsRequired(options, 'options', Object);
		assert.argumentIsOptional(options.cancelOnTimeout, 'options.cancelOnTimeout', Boolean);

		this.#validateWaitOptions({
			pollIntervalMs: options.pollIntervalMs ?? this.#configuration.pollIntervalMs,
			timeoutMs: options.timeoutMs ?? this.#configuration.timeoutMs
		});

		const queryExecutionId = await this.startQueryExecution(input);

		try {
			const execution = await this.waitForQueryExecution(queryExecutionId, options);

			return { queryExecutionId, execution };
		} catch (error) {
			if (error instanceof AthenaQueryError && error.code === 'TIMEOUT' && options.cancelOnTimeout !== false) {
				try {
					await this.stopQueryExecution(queryExecutionId);
				} catch {
					logger.warn(`Failed to request cancellation of Athena query [ ${queryExecutionId} ] after timeout`);
				}
			}

			throw error;
		}
	}

	#validateWaitOptions(options) {
		for (const key of [ 'pollIntervalMs', 'timeoutMs' ]) {
			if (!is.positive(options[key])) {
				throw new Error(`The "${key}" option must be positive`);
			}
		}
	}

	#validateMaxRows(maxRows) {
		if (!is.integer(maxRows) || !is.positive(maxRows)) {
			throw new Error('The "maxRows" option must be a positive integer');
		}
	}

	#checkReady() {
		if (this.disposed) {
			throw new Error('The Athena provider has been disposed');
		}

		if (!this.#started) {
			throw new Error('The Athena provider has not been started');
		}
	}
}

/**
 * An Athena workflow error. Native SDK errors remain available as causes when wrapped.
 *
 * @private
 * @extends Error
 */
class AthenaQueryError extends Error {
	/**
	 * @param {string} message
	 * @param {string} queryExecutionId
	 * @param {string} code
	 * @param {object=} status
	 * @param {*=} cause
	 */
	constructor(message, queryExecutionId, code, status, cause) {
		super(message, { cause });

		this.name = 'AthenaQueryError';
		this.queryExecutionId = queryExecutionId;
		this.code = code;
		this.state = status?.State;
		this.stateChangeReason = status?.StateChangeReason;
		this.athenaError = status?.AthenaError;
	}
}