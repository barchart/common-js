import * as array from '@barchart/common-js/lang/array.js';
import * as assert from '@barchart/common-js/lang/assert.js';
import * as attributes from '@barchart/common-js/lang/attributes.js';
import * as is from '@barchart/common-js/lang/is.js';
import * as object from '@barchart/common-js/lang/object.js';

import Disposable from '@barchart/common-js/lang/Disposable.js';
import Enum from '@barchart/common-js/lang/Enum.js';
import WorkQueue from '@barchart/common-js/timing/Serializer.js';
import Scheduler from '@barchart/common-js/timing/Scheduler.js';

import ConditionalBuilder from './dynamo/query/builders/ConditionalBuilder.js';
import KeyType from './dynamo/schema/definitions/KeyType.js';
import OperatorType from './dynamo/query/definitions/OperatorType.js';
import Table from './dynamo/schema/definitions/Table.js';
import TableBuilder from './dynamo/schema/builders/TableBuilder.js';
import Query from './dynamo/query/definitions/Query.js';
import Scan from './dynamo/query/definitions/Scan.js';
import Serializer from './dynamo/schema/serialization/Serializer.js';
import Update from './dynamo/query/definitions/Update.js';

import { BatchWriteItemCommand, CreateBackupCommand, CreateTableCommand, DeleteBackupCommand, DeleteItemCommand, DeleteTableCommand, DescribeTableCommand, DescribeTimeToLiveCommand, DynamoDBClient, ListBackupsCommand, ListTablesCommand, PutItemCommand, QueryCommand, ScanCommand, UpdateItemCommand, UpdateTimeToLiveCommand, waitUntilTableNotExists } from '@aws-sdk/client-dynamodb';

import log4js from 'log4js';

const logger = log4js.getLogger('common-node/aws/DynamoProvider');

const READ_MILLISECOND_BACKOFF = 500;
const WRITE_MILLISECOND_BACKOFF = 500;

/**
 * A facade for Amazon's DynamoDB service. The constructor accepts
 * configuration options. The promise-based instance functions
 * abstract knowledge of the AWS API.
 *
 * @public
 * @extends Disposable
 */
export default class DynamoProvider extends Disposable {
    #batches;
    #configuration;
    #dynamo;
    #options;
    #scheduler;
    #startPromise;
    #started;

    /**
     * @param {object} configuration
     * @param {string} configuration.region - The AWS region (e.g. "us-east-1").
     * @param {string} configuration.prefix - The prefix to automatically append to table names.
     * @param {string=} configuration.apiVersion - The DynamoDB API version (defaults to "2012-08-10").
     * @param {object=} options
     * @param {boolean=} options.preferConsistentReads
     */
    constructor(configuration, options) {
        super();

        assert.argumentIsRequired(configuration, 'configuration');
        assert.argumentIsRequired(configuration.region, 'configuration.region', String);
        assert.argumentIsRequired(configuration.prefix, 'configuration.prefix', String);
        assert.argumentIsOptional(configuration.apiVersion, 'configuration.apiVersion', String);

        this.#configuration = configuration;

        this.#options = Object.assign({ preferConsistentReads: false }, options || { });

        this.#startPromise = null;
        this.#started = false;

        this.#dynamo = null;
        this.#scheduler = null;
        this.#batches = new Map();
    }

    /**
     * Initializes the Amazon SDK. Call this before invoking any other instance
     * functions.
     *
     * @public
     * @async
     * @returns {Promise<boolean>}
     */
    async start() {
        if (this.disposed) {
            throw 'Unable to start, the Dynamo provider has been disposed';
        }

        if (this.#startPromise === null) {
            this.#startPromise = (async () => {
                try {
                    this.#scheduler = new Scheduler();

                    this.#dynamo = new DynamoDBClient({
                        apiVersion: this.#configuration.apiVersion || '2012-08-10',
                        region: this.#configuration.region
                    });

                    logger.debug('The Dynamo provider has started');

                    this.#started = true;

                    return this.#started;
                } catch (e) {
                    logger.error('The Dynamo provider failed to start', e);

                    throw e;
                }
            })();
        }

        return this.#startPromise;
    }

    /**
     * Returns a clone of the configuration object originally passed
     * to the constructor.
     *
     * @public
     * @returns {object}
     */
    getConfiguration() {
        if (this.disposed) {
            throw new Error('The Dynamo provider has been disposed');
        }

        return object.clone(this.#configuration);
    }

    /**
     * Gets the definition of a table. If no matching table exists; then
     * the promise is rejected.
     *
     * @public
     * @async
     * @param {string} tableName - The (unqualified) name of the table.
     * @returns {Promise<Table>}
     */
    async getTable(tableName) {
        assert.argumentIsRequired(tableName, 'tableName', String);

        this.#checkReady();

        const qualifiedTableName = getQualifiedTableName(this.#configuration.prefix, tableName);

        const tableData = await this.#getTable(qualifiedTableName);

        logger.debug('Table definition retrieved for [', qualifiedTableName, ']');

        return TableBuilder.fromDefinition(tableData);
    }

    /**
     * Lists backups for a table.
     *
     * @public
     * @async
     * @param {string} tableName - The fully-qualified name of the table.
     * @param {string} backupName
     * @returns {Promise<object>}
     */
    async createBackup(tableName, backupName) {
        assert.argumentIsRequired(tableName, 'tableName', String);
        assert.argumentIsRequired(backupName, 'backupName', String);

        this.#checkReady();

        logger.info(`Creating a backup of table [ ${tableName} ]`);

        const query = {
            TableName: tableName,
            BackupName: backupName
        };

        try {
            return await this.#dynamo.send(new CreateBackupCommand(query));
        } catch (error) {
            logger.error('Failed to create backup', error);

            throw error;
        }
    }

    /**
     * Creates a backup of the table
     *
     * @public
     * @async
     * @param {string} tableName - The fully-qualified name of the table.
     * @param {string=} lowerBound
     * @param {string=} upperBound
     * @returns {Promise<object>}
     */
    async listBackups(tableName, lowerBound, upperBound) {
        assert.argumentIsRequired(tableName, 'tableName', String);

        this.#checkReady();

        logger.info(`Listing the backups for table [ ${tableName} ]`);

        const query = {
            TableName: tableName
        };

        if (lowerBound) {
            query.TimeRangeLowerBound = lowerBound;
        }

        if (upperBound) {
            query.TimeRangeUpperBound = upperBound;
        }

        try {
            const data = await this.#dynamo.send(new ListBackupsCommand(query));

            return data.BackupSummaries;
        } catch (error) {
            logger.error('Failed listing backups', error);

            throw error;
        }
    }

    /**
     * Deletes a backup of the table (given the ARN of the backup).
     *
     * @public
     * @async
     * @param {string} arn
     * @returns {Promise<object>}
     */
    async deleteBackup(arn) {
        assert.argumentIsRequired(arn, 'arn', String);

        this.#checkReady();

        logger.info(`Deleting a backup of ARN [ ${arn} ]`);

        const query = {
            BackupArn: arn
        };

        try {
            return await this.#dynamo.send(new DeleteBackupCommand(query));
        } catch (error) {
            logger.error('Failed to delete backup', error);

            throw error;
        }
    }

    /**
     * Gets a list of all table names.
     *
     * @public
     * @async
     * @returns {Promise<string>}
     */
    async getTables() {
        this.#checkReady();

        const getTablesRecursive = async (previous) => {
            const options = { };

            if (previous && is.string(previous)) {
                options.ExclusiveStartTableName = previous;
            }

            try {
                const data = await this.#dynamo.send(new ListTablesCommand(options));

                const matches = data.TableNames.filter(name => name.startsWith(this.#configuration.prefix));

                logger.info('Retrieved [', matches.length, '] matching DynamoDB tables');

                if (is.string(data.LastEvaluatedTableName)) {
                    const more = await getTablesRecursive(data.LastEvaluatedTableName);

                    return matches.concat(more);
                }

                return matches;
            } catch (error) {
                logger.error(error);

                throw new Error('Failed to retrieve DynamoDB tables');
            }
        };

        return getTablesRecursive();
    }

    /**
     * Creates a new table, if it does not already exist, and returns the table's
     * metadata once the table becomes ready.
     *
     * @public
     * @async
     * @param {Table} definition - Describes the schema of the table to create.
     * @returns {Promise<Table>}
     */
    async createTable(definition) {
        assert.argumentIsRequired(definition, 'definition', Table, 'Table');

        this.#checkReady();

        const qualifiedTableName = definition.name;

        const getTableForCreate = async () => {
            const tableData = await this.#getTable(qualifiedTableName);

            if (tableData.TableStatus === 'ACTIVE') {
                try {
                    const ttlData = await this.#getTimeToLiveSettings(qualifiedTableName);

                    logger.info('Table ready [', qualifiedTableName, ']');

                    return Object.assign({ }, tableData, ttlData);
                } catch (error) {
                    if (error && error.name === 'AccessDeniedException' && is.string(error.message) && error.message.includes('dynamodb:DescribeTimeToLive')) {
                        logger.error(error);

                        return tableData;
                    }

                    throw error;
                }
            }

            logger.debug('Table not yet ready [', qualifiedTableName, ']');

            throw new Error('Table not yet ready');
        };

        logger.info('Creating table [', qualifiedTableName, ']');

        try {
            await this.#dynamo.send(new CreateTableCommand(definition.toTableSchema()));
        } catch (error) {
            if (is.string(error.message) && error.message === `Table already exists: ${qualifiedTableName}`) {
                logger.info('Unable to create table [', qualifiedTableName, '], table already exists');

                const tableData = await getTableForCreate.call(this, qualifiedTableName);

                const serverDefinition = TableBuilder.fromDefinition(tableData);

                if (definition.equals(serverDefinition, true)) {
                    return serverDefinition;
                }

                throw new Error(`The server definition of the table [ ${qualifiedTableName} ] does not match the expected definition.`);
            }

            logger.error(error);

            throw 'Failed to create DynamoDB tables';
        }

        logger.info('Created table [', qualifiedTableName, '], waiting for table to become ready');

        const tableData = await this.#scheduler.backoff(() => getTableForCreate.call(this, qualifiedTableName), 2000);

        let ttlData = null;

        if (definition.ttlAttribute) {
            logger.info(`Updating time-to-live configuration for table [ ${definition.name} ]`);

            ttlData = await this.#dynamo.send(new UpdateTimeToLiveCommand(definition.toTtlSchema()));

            logger.info(`Updated time-to-live configuration for table [ ${definition.name} ]`);
        }

        const adjusted = Object.assign({ }, tableData, ttlData || { });

        return TableBuilder.fromDefinition(adjusted);
    }

    /**
     * Deletes a table.
     *
     * @public
     * @async
     * @param {string} tableName - The (unqualified) name of the table.
     * @returns {Promise<object>}
     */
    async deleteTable(tableName) {
        assert.argumentIsRequired(tableName, 'tableName', String);

        this.#checkReady();

        const params = { TableName: tableName };

        logger.debug(`Deleting table [ ${tableName} ]`);

        try {
            await this.#dynamo.send(new DeleteTableCommand(params));

            const data = await waitUntilTableNotExists({ client: this.#dynamo, maxWaitTime: 600 }, params);

            logger.info(`Table [ ${tableName} ] successfully deleted`);

            return data;
        } catch (err) {
            logger.error(err);

            throw `Failed to delete [ ${tableName} ] table`;
        }
    }

    /**
     * Adds a new item to a table. If the item already exists, it is overwritten.
     *
     * @public
     * @async
     * @param {object} item - The item to write.
     * @param {Table} table - Describes the schema of the table to write to.
     * @param {boolean=} preventOverwrite - If true, the resulting promise will reject if another item shares the same key.
     * @returns {Promise<boolean>}
     */
    async saveItem(item, table, preventOverwrite) {
        assert.argumentIsRequired(table, 'table', Table, 'Table');
        assert.argumentIsRequired(item, 'item', Object);

        this.#checkReady();

        const qualifiedTableName = table.name;

        let payload;

        if (is.boolean(preventOverwrite) && preventOverwrite) {
            const builder = new ConditionalBuilder(table)
                .withDescription(`Conditional put to [${qualifiedTableName}] table`)
                .withFilterBuilder((fb) => {
                    const hashKeyName = table.keys.find(k => k.keyType === KeyType.HASH).attribute.name;

                    fb.withExpression(hashKeyName, OperatorType.ATTRIBUTE_NOT_EXISTS);
                });

            payload = builder.conditional.toConditionalSchema();
        } else {
            payload = {
                TableName: table.name
            };
        }

        payload.Item = Serializer.serialize(item, table);

        const putItem = async () => {
            try {
                await this.#dynamo.send(new PutItemCommand(payload));

                return { code: DYNAMO_RESULT.SUCCESS };
            } catch (error) {
                const dynamoError = Enum.fromCode(DynamoError, error.name);

                if (dynamoError !== null && dynamoError.getRetryable(error)) {
                    logger.debug('Encountered retryable error [', error.name, '] while putting an item into [', qualifiedTableName, ']');

                    throw error;
                }

                return { code: DYNAMO_RESULT.FAILURE, error: error };
            }
        };

        const result = await this.#scheduler.backoff(putItem, WRITE_MILLISECOND_BACKOFF);

        if (result.code === DYNAMO_RESULT.FAILURE) {
            throw result.error;
        }

        return true;
    }

    /**
     * Edits an existing item's attributes.
     *
     * @public
     * @async
     * @param {Update} update
     * @returns {Promise<object|null>}
     */
    async updateItem(update) {
        assert.argumentIsRequired(update, 'update', Update, 'Update');

        this.#checkReady();

        const schema = update.toUpdateSchema();

        const updateItem = async () => {
            try {
                const data = await this.#dynamo.send(new UpdateItemCommand(schema));

                let deserialized;

                if (!attributes.has(data, 'Attributes') || data.Attributes === null) {
                    deserialized = null;
                } else {
                    deserialized = Serializer.deserialize(data.Attributes, update.table);
                }

                return { code: DYNAMO_RESULT.SUCCESS, results: deserialized };
            } catch (error) {
                const dynamoError = Enum.fromCode(DynamoError, error.name);

                if (dynamoError !== null && dynamoError.getRetryable(error)) {
                    logger.debug('Encountered retryable error [', error.name, '] while putting an item into [', update.table.name, ']');

                    throw error;
                }

                return { code: DYNAMO_RESULT.FAILURE, error: error };
            }
        };

        const result = await this.#scheduler.backoff(updateItem, WRITE_MILLISECOND_BACKOFF);

        if (result.code === DYNAMO_RESULT.FAILURE) {
            throw result.error;
        }

        return result.results;
    }

    /**
     * Adds multiple items to a table. Unlike the {@link DynamoProvider#saveItem} function,
     * batches are processed serially; that is, writes from a batch must complete before
     * writes from a subsequent batch are started.
     *
     * @public
     * @async
     * @param {object[]} items - The items to write.
     * @param {Table} table - Describes the schema of the table to write to.
     * @returns {Promise<boolean>}
     */
    async createItems(items, table) {
        return this.#processBatch(table, DynamoBatchType.PUT, items);
    }

    /**
     * Removes multiple items to a table. Unlike the {@link DynamoProvider#deleteItem} function,
     * batches are processed serially; that is, deletes from a batch must complete before
     * deletes from a subsequent batch are started.
     *
     * @public
     * @async
     * @param {object[]} items - The items to write.
     * @param {Table} table - Describes the schema of the table to write to.
     * @param {boolean=} explicit - If keys are derived, the item will be deleted as-is, without rederiving the key.
     * @returns {Promise<boolean>}
     */
    async deleteItems(items, table, explicit) {
        return this.#processBatch(table, DynamoBatchType.DELETE, items, explicit);
    }

    /**
     * Removes an item from a table.
     *
     * @public
     * @async
     * @param {object} item - The item to delete.
     * @param {Table} table - Describes the schema of the table to write to.
     * @param {boolean=} explicit - If keys are derived, the item will be deleted as-is, without rederiving the key.
     * @returns {Promise<boolean>}
     */
    async deleteItem(item, table, explicit) {
        assert.argumentIsRequired(table, 'table', Table, 'Table');
        assert.argumentIsRequired(item, 'item', Object);
        assert.argumentIsOptional(explicit, 'explicit', Boolean);

        this.#checkReady();

        const qualifiedTableName = table.name;

        const payload = {
            TableName: table.name
        };

        payload.Key = Serializer.serialize(item, table, true, explicit);

        const deleteItem = async () => {
            try {
                await this.#dynamo.send(new DeleteItemCommand(payload));

                return { code: DYNAMO_RESULT.SUCCESS };
            } catch (error) {
                const dynamoError = Enum.fromCode(DynamoError, error.name);

                if (dynamoError !== null && dynamoError.getRetryable(error)) {
                    logger.debug('Encountered retryable error [', error.name, '] while deleting an item from [', qualifiedTableName, ']');

                    throw error;
                }

                return { code: DYNAMO_RESULT.FAILURE, error: error };
            }
        };

        const result = await this.#scheduler.backoff(deleteItem, WRITE_MILLISECOND_BACKOFF);

        if (result.code === DYNAMO_RESULT.FAILURE) {
            throw result.error;
        }

        return true;
    }

    /**
     * Runs a scan against a DynamoDB table (or index) and returns
     * all the items matching the scan.
     *
     * @public
     * @async
     * @param {Scan} scan
     * @returns {Promise<object[]|number>}
     */
    async scan(scan) {
        assert.argumentIsRequired(scan, 'scan', Scan, 'Scan');

        this.#checkReady();

        const options = scan.toScanSchema();

        if (!scan.consistentRead && scan.index === null && this.#options.preferConsistentReads) {
            logger.debug('Overriding scan definition, setting consistent reads to true for [', (scan.description || 'unnamed scan'), '] on [', scan.table.name, ']');

            options.ConsistentRead = true;
        }

        let maximum = options.Limit || 0;
        let count = 0;

        let run = 0;
        let runs = logger.isTraceEnabled() ? [ ] : null;

        let abort = false;

        const getEmptyResult = () => scan.countOnly ? 0 : [ ];

        const runScanRecursive = async (previous) => {
            const executeScan = async () => {
                const r = run++;

                if (runs) {
                    runs[r] = { };

                    runs[r].scanStart = (new Date()).getTime();

                    logger.trace(`Scan [ ${scan.table.name} ], run [ ${r} ] started at [ ${runs[r].scanStart} ]`);
                }

                if (previous) {
                    options.ExclusiveStartKey = previous;
                } else if (is.object(scan.exclusiveStartKey)) {
                    options.ExclusiveStartKey = Serializer.serialize(scan.exclusiveStartKey, scan.table, true, false);
                }

                if (maximum !== 0) {
                    options.Limit = maximum - count;

                    if (options.Limit === 0) {
                        return getEmptyResult();
                    }
                }

                let data;

                try {
                    data = await this.#dynamo.send(new ScanCommand(options));
                } catch (error) {
                    const dynamoError = Enum.fromCode(DynamoError, error.name);

                    if (dynamoError !== null && dynamoError.getRetryable(error)) {
                        logger.debug('Encountered retryable error [', error.name, '] while scanning [', scan.table.name, ']');

                        throw error;
                    }

                    logger.debug('Encountered non-retryable error [', error.name, '] while scanning [', scan.table.name, ']');

                    abort = true;

                    return { code: DYNAMO_RESULT.FAILURE, error: error };
                }

                if (runs) {
                    runs[r].scanEnd = (new Date()).getTime();

                    logger.trace(`Scan [ ${scan.table.name} ], run [ ${r} ] completed at [ ${runs[r].scanEnd} ] in [ ${runs[r].scanEnd - runs[r].scanStart} ] ms`);
                }

                const deserializePromise = defer(() => {
                    if (abort) {
                        return getEmptyResult();
                    }

                    if (runs) {
                        runs[r].deserializeStart = (new Date()).getTime();

                        logger.trace(`Deserialize [ ${scan.table.name} ] run [ ${r} ] started at [ ${runs[r].deserializeStart} ]`);
                    }

                    let deserialized;

                    try {
                        if (scan.countOnly) {
                            deserialized = data.Count;
                        } else if (scan.skipDeserialization) {
                            deserialized = data.Items;
                        } else {
                            deserialized = data.Items.map(i => Serializer.deserialize(i, scan.table));
                        }
                    } catch (e) {
                        abort = true;

                        logger.error('Unable to deserialize scan results.', e);

                        if (data.Items) {
                            logger.error(JSON.stringify(data.Items, null, 2));
                        }

                        deserialized = { code: DYNAMO_RESULT.FAILURE, error: e };
                    }

                    if (runs) {
                        runs[r].deserializeEnd = (new Date()).getTime();

                        logger.trace(`Deserialize [ ${scan.table.name} ] run [ ${r} ] completed at [ ${runs[r].deserializeEnd} ] in [ ${runs[r].deserializeEnd - runs[r].deserializeStart} ] ms`);
                    }

                    return deserialized;
                });

                const continuationPromise = (async () => {
                    if (abort) {
                        return getEmptyResult();
                    }

                    if (data.Items && data.Items.length !== 0) {
                        count += data.Items.length;
                    }

                    if (data.LastEvaluatedKey && (maximum === 0 || count < maximum)) {
                        return runScanRecursive(data.LastEvaluatedKey);
                    }

                    return getEmptyResult();
                })();

                const combined = await Promise.all([ deserializePromise, continuationPromise ]);

                const error = combined.find(r => is.object(r) && r.code === DYNAMO_RESULT.FAILURE);

                if (error) {
                    return error;
                }

                const deserialized = combined[0];
                const continuation = combined[1];

                if (scan.countOnly) {
                    return deserialized + continuation;
                }

                return deserialized.concat(continuation);
            };

            const results = await this.#scheduler.backoff(executeScan, READ_MILLISECOND_BACKOFF);

            if (results.code === DYNAMO_RESULT.FAILURE) {
                throw results.error;
            }

            return results;
        };

        try {
            const results = await runScanRecursive();
            const composite = { results: results, timing: runs };

            logger.debug('Ran [', scan.description, '] on [', scan.table.name + (scan.index ? '/' + scan.index.name : ''), '] and matched [', (scan.countOnly ? results : results.length), '] results');

            if (composite.timing) {
                const timing = composite.timing;

                logger.trace('Ran [', scan.description, '] on [', scan.table.name + (scan.index ? '/' + scan.index.name : ''), '] over [', timing.length ,'] runs in [', array.last(timing).deserializeEnd - array.first(timing).scanStart, '] ms with [', timing.reduce((t, i) => t + (i.scanEnd - i.scanStart), 0), '] ms scanning and [', timing.reduce((t, i) => t + (i.deserializeEnd - i.deserializeStart), 0), '] ms deserializing');
            }

            return results;
        } catch (e) {
            logger.error('Failed to run [', scan.description, '] on [', scan.table.name + (scan.index ? '/' + scan.index.name : ''), ']', e);

            throw e;
        }
    }

    /**
     * Runs a scan, returning a page of results.
     *
     * @public
     * @async
     * @param {Scan} scan
     * @param {object=} startKey
     * @return {Promise}
     */
    async scanChunk(scan, startKey) {
        assert.argumentIsRequired(scan, 'scan', Scan, 'Scan');
        assert.argumentIsOptional(startKey, 'startKey', Object);

        this.#checkReady();

        const options = scan.toScanSchema();

        if (!scan.consistentRead && scan.index === null && this.#options.preferConsistentReads) {
            logger.debug('Overriding scan definition, setting consistent reads to true for [', (scan.description || 'unnamed scan'), '] on [', scan.table.name, ']');

            options.ConsistentRead = true;
        }

        const executeScan = async () => {
            if (startKey) {
                options.ExclusiveStartKey = Serializer.serialize(startKey, scan.table, false, true);
            } else if (scan.exclusiveStartKey) {
                options.ExclusiveStartKey = Serializer.serialize(scan.exclusiveStartKey, scan.table, true, false);
            }

            let data;

            try {
                data = await this.#dynamo.send(new ScanCommand(options));
            } catch (error) {
                const dynamoError = Enum.fromCode(DynamoError, error.name);

                if (dynamoError !== null && dynamoError.getRetryable(error)) {
                    logger.debug('Encountered retryable error [', error.name, '] while scanning [', scan.table.name, ']');

                    throw error;
                }

                return { code: DYNAMO_RESULT.FAILURE, error: error };
            }

            let results;

            try {
                if (scan.skipDeserialization) {
                    results = data.Items;
                } else {
                    results = data.Items.map(i => Serializer.deserialize(i, scan.table));
                }
            } catch (e) {
                logger.error('Unable to deserialize scan results.', e);

                if (data.Items) {
                    logger.error(JSON.stringify(data.Items, null, 2));
                }

                return { code: DYNAMO_RESULT.FAILURE, error: e };
            }

            let wrapper = { };

            if (data.LastEvaluatedKey) {
                wrapper.startKey = Serializer.deserialize(data.LastEvaluatedKey, scan.table);
            }

            if (data.ConsumedCapacity) {
                wrapper.capacityConsumed = data.ConsumedCapacity.CapacityUnits || 0;
            }

            wrapper.code = DYNAMO_RESULT.SUCCESS;
            wrapper.results = results;

            return wrapper;
        };

        try {
            const results = await this.#scheduler.backoff(executeScan, READ_MILLISECOND_BACKOFF);

            if (results.code === DYNAMO_RESULT.FAILURE) {
                throw results.error;
            }

            logger.debug('Ran [', scan.description, '] in chunk mode on [', scan.table.name + (scan.index ? '/ ' + scan.index.name : ''), '] and matched [', results.results.length ,'] results');

            return results;
        } catch (e) {
            logger.error('Failed to run [', scan.description, '] in chunk mode on [', scan.table.name + (scan.index ? '/' + scan.index.name : ''), ']', e);

            throw e;
        }
    }

    /**
     * Runs a query against a DynamoDB table (or index) and returns
     * all the items matching the query.
     *
     * @public
     * @async
     * @param {Query} query
     * @returns {Promise<object[]|number>}
     */
    async query(query) {
        assert.argumentIsRequired(query, 'query', Query, 'Query');

        this.#checkReady();

        const options = query.toQuerySchema();

        if (!query.consistentRead && query.index === null && this.#options.preferConsistentReads) {
            logger.debug('Overriding query definition, setting consistent reads to true for [', (query.description || 'unnamed query'), '] on [', query.table.name, ']');

            options.ConsistentRead = true;
        }

        let maximum = options.Limit || 0;
        let count = 0;

        let run = 0;
        let runs = logger.isTraceEnabled() ? [ ] : null;

        let abort = false;

        const getEmptyResult = () => query.countOnly ? 0 : [ ];

        const runQueryRecursive = async (previous) => {
            const executeQuery = async () => {
                const r = run++;

                if (runs) {
                    runs[r] = { };

                    runs[r].queryStart = (new Date()).getTime();

                    logger.trace(`Query [ ${query.table.name} ], run [ ${r} ] started at [ ${runs[r].queryStart} ]`);
                }

                if (previous) {
                    options.ExclusiveStartKey = previous;
                } else if (is.object(query.exclusiveStartKey)) {
                    options.ExclusiveStartKey = Serializer.serialize(query.exclusiveStartKey, query.table, true, false);
                }

                if (maximum !== 0) {
                    options.Limit = maximum - count;

                    if (options.Limit === 0) {
                        return getEmptyResult();
                    }
                }

                let data;

                try {
                    data = await this.#dynamo.send(new QueryCommand(options));
                } catch (error) {
                    const dynamoError = Enum.fromCode(DynamoError, error.name);

                    if (dynamoError !== null && dynamoError.getRetryable(error)) {
                        logger.debug('Encountered retryable error [', error.name, '] while querying [', query.table.name, ']');

                        throw error;
                    }

                    logger.debug('Encountered non-retryable error [', error.name, '] while querying [', query.table.name, ']');

                    abort = true;

                    return { code: DYNAMO_RESULT.FAILURE, error: error };
                }

                if (runs) {
                    runs[r].queryEnd = (new Date()).getTime();

                    logger.trace(`Query [ ${query.table.name} ], run [ ${r} ] completed at [ ${runs[r].queryEnd} ] in [ ${runs[r].queryEnd - runs[r].queryStart} ] ms`);
                }

                const deserializePromise = defer(() => {
                    if (abort) {
                        return getEmptyResult();
                    }

                    if (runs) {
                        runs[r].deserializeStart = (new Date()).getTime();

                        logger.trace(`Deserialize [ ${query.table.name} ] run [ ${r} ] started at [ ${runs[r].deserializeStart} ]`);
                    }

                    let deserialized;

                    try {
                        if (query.countOnly) {
                            deserialized = data.Count;
                        } else if (query.skipDeserialization) {
                            deserialized = data.Items;
                        } else {
                            deserialized = data.Items.map(i => Serializer.deserialize(i, query.table));
                        }
                    } catch (e) {
                        abort = true;

                        logger.error('Unable to deserialize query results.', e);

                        if (data.Items) {
                            logger.error(JSON.stringify(data.Items, null, 2));
                        }

                        deserialized = { code: DYNAMO_RESULT.FAILURE, error: e };
                    }

                    if (runs) {
                        runs[r].deserializeEnd = (new Date()).getTime();

                        logger.trace(`Deserialize [ ${query.table.name} ] run [ ${r} ] completed at [ ${runs[r].deserializeEnd} ] in [ ${runs[r].deserializeEnd - runs[r].deserializeStart} ] ms`);
                    }

                    return deserialized;
                });

                const continuationPromise = (async () => {
                    if (abort) {
                        return getEmptyResult();
                    }

                    if (data.Items && data.Items.length !== 0) {
                        count += data.Items.length;
                    }

                    if (data.LastEvaluatedKey && (maximum === 0 || count < maximum)) {
                        return runQueryRecursive(data.LastEvaluatedKey);
                    }

                    return getEmptyResult();
                })();

                const combined = await Promise.all([ deserializePromise, continuationPromise ]);
                const error = combined.find(r => is.object(r) && r.code === DYNAMO_RESULT.FAILURE);

                if (error) {
                    return error;
                }

                const deserialized = combined[0];
                const continuation = combined[1];

                if (query.countOnly) {
                    return deserialized + continuation;
                }

                return deserialized.concat(continuation);
            };

            const results = await this.#scheduler.backoff(executeQuery, READ_MILLISECOND_BACKOFF);

            if (results.code === DYNAMO_RESULT.FAILURE) {
                throw results.error;
            }

            return results;
        };

        try {
            const results = await runQueryRecursive();
            const composite = { results: results, timing: runs };

            logger.debug('Ran [', query.description, '] on [', query.table.name + (query.index ? '/' + query.index.name : ''), '] and matched [', (query.countOnly ? results : results.length), '] results');

            if (composite.timing) {
                const timing = composite.timing;

                logger.trace('Ran [', query.description, '] on [', query.table.name + (query.index ? '/' + query.index.name : ''), '] over [', timing.length ,'] runs in [', array.last(timing).deserializeEnd - array.first(timing).queryStart, '] ms with [', timing.reduce((t, i) => t + (i.queryEnd - i.queryStart), 0), '] ms querying and [', timing.reduce((t, i) => t + (i.deserializeEnd - i.deserializeStart), 0), '] ms deserializing');
            }

            return results;
        } catch (e) {
            logger.error('Failed to run [', query.description, '] on [', query.table.name + (query.index ? '/' + query.index.name : ''), ']', e);

            throw e;
        }
    }

    /**
     * Run parallel queries against a DynamoDB table (or index) and returns
     * all the items matching.
     *
     * @public
     * @async
     * @param {Query[]} queries
     * @returns {Promise<object[]>}
     */
    async queryParallel(queries) {
        assert.argumentIsArray(queries, 'queries', Query, 'Query');

        const results = await Promise.all(queries.map(query => this.query(query)));

        return array.flatten(results);
    }

    /**
     * Runs a query, returning a page of results.
     *
     * @public
     * @async
     * @param {Query} query
     * @param {object=} startKey
     * @return {Promise}
     */
    async queryChunk(query, startKey) {
        assert.argumentIsRequired(query, 'query', Query, 'Query');
        assert.argumentIsOptional(startKey, 'startKey', Object);

        this.#checkReady();

        const options = query.toQuerySchema();

        if (!query.consistentRead && query.index === null && this.#options.preferConsistentReads) {
            logger.debug('Overriding query definition, setting consistent reads to true for [', (query.description || 'unnamed query'), '] on [', query.table.name, ']');

            options.ConsistentRead = true;
        }

        const executeQuery = async () => {
            if (startKey) {
                options.ExclusiveStartKey = Serializer.serialize(startKey, query.table, false, true);
            } else if (query.exclusiveStartKey) {
                options.ExclusiveStartKey = Serializer.serialize(query.exclusiveStartKey, query.table, true, false);
            }

            let data;

            try {
                data = await this.#dynamo.send(new QueryCommand(options));
            } catch (error) {
                const dynamoError = Enum.fromCode(DynamoError, error.name);

                if (dynamoError !== null && dynamoError.getRetryable(error)) {
                    logger.debug('Encountered retryable error [', error.name, '] while querying [', query.table.name, ']');

                    throw error;
                }

                return { code: DYNAMO_RESULT.FAILURE, error: error };
            }

            let results;

            try {
                if (query.skipDeserialization) {
                    results = data.Items;
                } else {
                    results = data.Items.map(i => Serializer.deserialize(i, query.table));
                }
            } catch (e) {
                logger.error('Unable to deserialize query results.', e);

                if (data.Items) {
                    logger.error(JSON.stringify(data.Items, null, 2));
                }

                return { code: DYNAMO_RESULT.FAILURE, error: e };
            }

            let wrapper = { };

            if (data.LastEvaluatedKey) {
                wrapper.startKey = Serializer.deserialize(data.LastEvaluatedKey, query.table);
            }

            if (data.ConsumedCapacity) {
                wrapper.capacityConsumed = data.ConsumedCapacity.CapacityUnits || 0;
            }

            wrapper.code = DYNAMO_RESULT.SUCCESS;
            wrapper.results = results;

            return wrapper;
        };

        try {
            const results = await this.#scheduler.backoff(executeQuery, READ_MILLISECOND_BACKOFF);

            if (results.code === DYNAMO_RESULT.FAILURE) {
                throw results.error;
            }

            logger.debug('Ran [', query.description, '] in chunk mode on [', query.table.name + (query.index ? '/ ' + query.index.name : ''), '] and matched [', results.results.length ,'] results');

            return results;
        } catch (e) {
            logger.error('Failed to run [', query.description, '] in chunk mode on [', query.table.name + (query.index ? '/' + query.index.name : ''), ']', e);

            throw e;
        }
    }

    /**
     * Returns a new {@link TableBuilder} instance, suitable for use by the
     * {@link DynamoProvider#createTable} function.
     *
     * @publicq
     * @param {string} name - The (unqualified) name of the table.
     * @returns {TableBuilder}
     */
    getTableBuilder(name) {
        assert.argumentIsRequired(name, 'name', String);

        return TableBuilder.withName(getQualifiedTableName(this.#configuration.prefix, name));
    }

    /**
     * @protected
     * @override
     */
    _onDispose() {
        if (this.#scheduler !== null) {
            this.#scheduler.dispose();
            this.#scheduler = null;
        }

        if (this.#batches !== null) {
            this.#batches.forEach((k, v) => v.dispose());
            this.#batches = null;
        }
    }

    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
        return '[DynamoProvider]';
    }


    #checkReady() {
        if (this.disposed) {
            throw new Error('The Dynamo provider has been disposed');
            }

            if (!this.#started) {
                throw new Error('The Dynamo provider has not been started');
            }
        }

    async #getTable(qualifiedTableName) {
        let data;

        try {
            data = await this.#dynamo.send(new DescribeTableCommand({ TableName: qualifiedTableName }));
            } catch (error) {
                logger.error(error);

                throw 'Failed to retrieve DynamoDB table';
            }

            if (!is.object(data.Table)) {
                throw 'Unexpected response from DynamoDB SDK.';
            }

            if (logger.isTraceEnabled()) {
                logger.trace(JSON.stringify(data, null, 2));
            }

            return data.Table;
        }

    async #getTimeToLiveSettings(qualifiedTableName) {
        try {
            return await this.#dynamo.send(new DescribeTimeToLiveCommand({ TableName: qualifiedTableName }));
            } catch (error) {
                logger.error(error);

                throw error;
            }
        }

    #processBatch(table, type, items, explicit) {
        assert.argumentIsRequired(table, 'table', Table, 'Table');
        assert.argumentIsRequired(type, 'type', DynamoBatchType, 'DynamoBatchType');
        assert.argumentIsArray(items, 'items');
        assert.argumentIsOptional(explicit, 'explicit', Boolean);

        this.#checkReady();

        if (items.length === 0) {
            return;
            }

            const qualifiedTableName = table.name;

            if (!this.#batches.has(qualifiedTableName)) {
                this.#batches.set(qualifiedTableName, new WorkQueue());
            }

            const workQueue = this.#batches.get(qualifiedTableName);

            return workQueue.enqueue(async () => {
                const batchNumber = workQueue.getCurrent();

                logger.debug('Starting batch', type.description, 'on [', qualifiedTableName, '] for batch number [', batchNumber, '] with [', items.length, '] items');

                const writeBatch = async (currentPayload) => {
                    let data;

                    try {
                        data = await this.#dynamo.send(new BatchWriteItemCommand(currentPayload));
                    } catch (error) {
                        const dynamoError = Enum.fromCode(DynamoError, error.name);

                        if (dynamoError !== null && dynamoError.getRetryable(error)) {
                            logger.debug('Encountered retryable error [', error.name, '] while running batch', type.description, 'on [', qualifiedTableName, ']');

                            throw error;
                        }

                        return { code: DYNAMO_RESULT.FAILURE, error: error };
                    }

                    let unprocessedItems;

                    if (is.object(data.UnprocessedItems) && is.array(data.UnprocessedItems[qualifiedTableName])) {
                        unprocessedItems = data.UnprocessedItems[qualifiedTableName];
                    } else {
                        unprocessedItems = [ ];
                    }

                    if (unprocessedItems.length === 0) {
                        return { code: DYNAMO_RESULT.SUCCESS };
                    }

                    logger.debug('Continuing batch [', type.description, '] on [', qualifiedTableName, '] for batch number [', batchNumber,'] with [', unprocessedItems.length, '] unprocessed items');

                    const continuePayload = getBatchPayload(qualifiedTableName, unprocessedItems);

                    return this.#scheduler.backoff(() => writeBatch(continuePayload), WRITE_MILLISECOND_BACKOFF);
                };

                const originalPayload = getBatchPayload(qualifiedTableName,
                    items.map((item) => {
                        const request = { };
                        const wrapper = { };

                        wrapper[type.requestItemName] = Serializer.serialize(item, table, type.keysOnly, explicit);
                        request[type.requestTypeName] = wrapper;

                        return request;
                    })
                );

                const result = await this.#scheduler.backoff(() => writeBatch(originalPayload), WRITE_MILLISECOND_BACKOFF);

                if (result.code === DYNAMO_RESULT.FAILURE) {
                    logger.error('Failed batch [', type.description, '] on [', qualifiedTableName, '] for batch number [', batchNumber,'] with [', items.length, '] items');

                    throw result.error;
                }

                logger.debug('Finished batch [', type.description, '] on [', qualifiedTableName, '] for batch number [', batchNumber,'] with [', items.length, '] items');

                return true;
            });
        }
}

// 2010/01/18, BRI. Using "setImmediate" causes the deserialization step to be deferred
// until after the next query "segment" begins (assuming multiple query "segments" are
// required to retrieve the full result set). This allows the deserialization step to
// run while waiting on the network (for the next query segment), thereby improving
// overall response time.
function defer(callback) {
    return new Promise((resolve) => {
        setImmediate(() => {
            resolve(callback());
        });
    });
}

function getQualifiedTableName(prefix, name) {
    return `${prefix}-${name}`;
}

function getBatchPayload(tableName, serializedItems) {
    const payload = {
        RequestItems: { }
    };

    payload.RequestItems[tableName] = serializedItems;

    return payload;
}

const DYNAMO_RESULT = {
    SUCCESS: 'SUCCESS',
    FAILURE: 'FAILURE'
};

class DynamoError extends Enum {
    #retryablePredicate;

    constructor(code, description, retryablePredicate) {
        super(code, description);

        this.#retryablePredicate = retryablePredicate;
    }

    getRetryable(error) {
        return this.#retryablePredicate(error);
    }

    toString() {
        return `[DynamoError (code=${this.code})]`;
    }
}

const dynamoErrorThrottling = new DynamoError('ThrottlingException', 'Throttling Exception', () => true);
const dynamoErrorThroughput = new DynamoError('ProvisionedThroughputExceededException', 'Provisioned Throughput Exceeded Exception', () => true);
const dynamoErrorConditional = new DynamoError('ConditionalCheckFailedException', 'Conditional Check Failed Exception', () => false);
const dynamoErrorUnavailable = new DynamoError('UnknownError', 'Unknown Error Exception', error => is.object(error.$retryable));
const dynamoErrorTimeout = new DynamoError('TimeoutError', 'Timeout Error Exception', error => is.object(error.$retryable));

class DynamoBatchType extends Enum {
    #keysOnly;
    #requestItemName;
    #requestTypeName;

    constructor(code, description, requestTypeName, requestItemName, keysOnly) {
        super(code, description);

        this.#requestTypeName = requestTypeName;
        this.#requestItemName = requestItemName;

        this.#keysOnly = keysOnly;
    }

    get requestTypeName() {
        return this.#requestTypeName;
    }

    get requestItemName() {
        return this.#requestItemName;
    }

    get keysOnly() {
        return this.#keysOnly;
    }

    static get PUT() {
        return dynamoBatchPut;
    }

    static get DELETE() {
        return dynamoBatchDelete;
    }

    toString() {
        return `[DynamoBatchType (code=${this.code})]`;
    }
}

const dynamoBatchPut = new DynamoBatchType('PUT', 'insert', 'PutRequest', 'Item', false);
const dynamoBatchDelete = new DynamoBatchType('DELETE', 'delete', 'DeleteRequest', 'Key', true);
