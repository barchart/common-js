const aws = require('aws-sdk'),
    log4js = require('log4js');

const array = require('@barchart/common-js/lang/array'),
    assert = require('@barchart/common-js/lang/assert'),
    attributes = require('@barchart/common-js/lang/attributes'),
    Disposable = require('@barchart/common-js/lang/Disposable'),
    Enum = require('@barchart/common-js/lang/Enum'),
    is = require('@barchart/common-js/lang/is'),
    object = require('@barchart/common-js/lang/object'),
    promise = require('@barchart/common-js/lang/promise'),
    WorkQueue = require('@barchart/common-js/timing/Serializer'),
    Scheduler = require('@barchart/common-js/timing/Scheduler');

const ConditionalBuilder = require('./dynamo/query/builders/ConditionalBuilder'),
    KeyType = require('./dynamo/schema/definitions/KeyType'),
    OperatorType = require('./dynamo/query/definitions/OperatorType'),
    Table = require('./dynamo/schema/definitions/Table'),
    TableBuilder = require('./dynamo/schema/builders/TableBuilder'),
    Query = require('./dynamo/query/definitions/Query'),
    Scan = require('./dynamo/query/definitions/Scan'),
    Serializer = require('./dynamo/schema/serialization/Serializer'),
    Update = require('./dynamo/query/definitions/Update');

module.exports = (() => {
    'use strict';

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
     * @param {object} configuration
     * @param {string} configuration.region - The AWS region (e.g. "us-east-1").
     * @param {string} configuration.prefix - The prefix to automatically append to table names.
     * @param {string=} configuration.apiVersion - The DynamoDB API version (defaults to "2012-08-10").
     * @param {object=} options
     * @param {Boolean=} options.preferConsistentReads
     */
    class DynamoProvider extends Disposable {
        constructor(configuration, options) {
            super();

            assert.argumentIsRequired(configuration, 'configuration');
            assert.argumentIsRequired(configuration.region, 'configuration.region', String);
            assert.argumentIsRequired(configuration.prefix, 'configuration.prefix', String);
            assert.argumentIsOptional(configuration.apiVersion, 'configuration.apiVersion', String);

            this._configuration = configuration;

            this._options = Object.assign({ preferConsistentReads: false }, options || { });

            this._startPromise = null;
            this._started = false;

            this._dynamo = null;
            this._scheduler = null;
            this._batches = new Map();
        }

        /**
         * Initializes the Amazon SDK. Call this before invoking any other instance
         * functions.
         *
         * @public
         * @async
         * @returns {Promise<Boolean>}
         */
        async start() {
            if (this.disposed) {
                return Promise.reject('Unable to start, the Dynamo provider has been disposed');
            }

            if (this._startPromise === null) {
                this._startPromise = Promise.resolve()
                    .then(() => {
                        this._scheduler = new Scheduler();
                    }).then(() => {
                        aws.config.update({ region: this._configuration.region });

                        this._dynamo = new aws.DynamoDB({ apiVersion: this._configuration.apiVersion || '2012-08-10' });
                    }).then(() => {
                        logger.debug('The Dynamo provider has started');

                        this._started = true;

                        return this._started;
                    }).catch((e) => {
                        logger.error('The Dynamo provider failed to start', e);

                        throw e;
                    });
            }

            return this._startPromise;
        }

        /**
         * Returns a clone of the configuration object originally passed
         * to the constructor.
         *
         * @public
         * @returns {Object}
         */
        getConfiguration() {
            if (this.disposed) {
                throw new Error('The Dynamo provider has been disposed');
            }

            return object.clone(this._configuration);
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
            return Promise.resolve()
                .then(() => {
                    assert.argumentIsRequired(tableName, 'tableName', String);

                    checkReady.call(this);

                    const qualifiedTableName = getQualifiedTableName(this._configuration.prefix, tableName);

                    return getTable.call(this, qualifiedTableName)
                        .then((tableData) => {
                            logger.debug('Table definition retrieved for [', qualifiedTableName, ']');

                            return TableBuilder.fromDefinition(tableData);
                        });
                });
        }

        /**
         * Lists backups for a table.
         *
         * @public
         * @async
         * @param {string} tableName - The fully-qualified name of the table.
         * @param {string} backupName
         * @returns {Promise<Object>}
         */
        async createBackup(tableName, backupName) {
            return Promise.resolve()
                .then(() => {
                    assert.argumentIsRequired(tableName, 'tableName', String);
                    assert.argumentIsRequired(backupName, 'backupName', String);

                    checkReady.call(this);

                    return promise.build((resolve, reject) => {
                        logger.info(`Creating a backup of table [ ${tableName} ]`);

                        const query = {
                            TableName: tableName,
                            BackupName: backupName
                        };

                        this._dynamo.createBackup(query, (error, data) => {
                            if (error) {
                                logger.error('Failed to create backup', error);
                                reject(error);
                            } else {
                                resolve(data);
                            }
                        });
                    });
                });
        }

        /**
         * Creates a backup of the table
         *
         * @public
         * @async
         * @param {string} tableName - The fully-qualified name of the table.
         * @param {string=} lowerBound
         * @param {string=} upperBound
         * @returns {Promise<Object>}
         */
        async listBackups(tableName, lowerBound, upperBound) {
            return Promise.resolve()
                .then(() => {
                    assert.argumentIsRequired(tableName, 'tableName', String);

                    checkReady.call(this);

                    return promise.build((resolve, reject) => {
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

                        this._dynamo.listBackups(query, (error, data) => {
                            if (error) {
                                logger.error('Failed listing backups', error);
                                reject(error);
                            } else {
                                resolve(data.BackupSummaries);
                            }
                        });
                    });
                });
        }

        /**
         * Deletes a backup of the table (given the ARN of the backup).
         *
         * @public
         * @async
         * @param {string} arn
         * @returns {Promise<Object>}
         */
        async deleteBackup(arn) {
            return Promise.resolve()
                .then(() => {
                    assert.argumentIsRequired(arn, 'arn', String);

                    checkReady.call(this);

                    return promise.build((resolve, reject) => {
                        logger.info(`Deleting a backup of ARN [ ${arn} ]`);

                        const query = {
                            BackupArn: arn
                        };

                        this._dynamo.deleteBackup(query, (error, data) => {
                            if (error) {
                                logger.error('Failed to delete backup', error);
                                reject(error);
                            } else {
                                resolve(data);
                            }
                        });
                    });
                });
        }

        /**
         * Gets a list of all table names.
         *
         * @public
         * @async
         * @returns {Promise<String>}
         */
        async getTables() {
            return Promise.resolve()
                .then(() => {
                    checkReady.call(this);

                    const getTablesRecursive = (previous) => {
                        return promise.build((resolveCallback, rejectCallback) => {
                            const options = { };

                            if (previous && is.string(previous)) {
                                options.ExclusiveStartTableName = previous;
                            }

                            this._dynamo.listTables(options, (error, data) => {
                                if (error) {
                                    logger.error(error);

                                    rejectCallback('Failed to retrieve DynamoDB tables', error);
                                } else {
                                    const matches = data.TableNames.filter(name => name.startsWith(this._configuration.prefix));

                                    logger.info('Retrieved [', matches.length, '] matching DynamoDB tables');

                                    if (is.string(data.LastEvaluatedTableName)) {
                                        getTablesRecursive(data.LastEvaluatedTableName)
                                            .then((more) => {
                                                resolveCallback(matches.concat(more));
                                            });
                                    } else {
                                        resolveCallback(matches);
                                    }
                                }
                            });
                        });
                    };

                    return getTablesRecursive();
                });
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
            return Promise.resolve()
                .then(() => {
                    assert.argumentIsRequired(definition, 'definition', Table, 'Table');

                    checkReady.call(this);

                    const qualifiedTableName = definition.name;

                    const getTableForCreate = () => {
                        return getTable.call(this, qualifiedTableName)
                            .then((tableData) => {
                                if (tableData.TableStatus === 'ACTIVE') {
                                    return getTimeToLiveSettings.call(this, qualifiedTableName)
                                        .then((ttlData) => {
                                            logger.info('Table ready [', qualifiedTableName, ']');

                                            return Promise.resolve(Object.assign({ }, tableData, ttlData));
                                        }).catch((error) => {
                                            let promise;

                                            if (is.string(error) && error.includes('AccessDeniedException') && error.includes('dynamodb:DescribeTimeToLive')) {
                                                logger.error(error);

                                                promise = Promise.resolve(tableData);
                                            } else {
                                                promise = Promise.reject(error);
                                            }

                                            return promise;
                                        });
                                } else {
                                    logger.debug('Table not yet ready [', qualifiedTableName, ']');

                                    return Promise.reject();
                                }
                            });
                    };

                    return promise.build((resolveCallback, rejectCallback) => {
                        logger.info('Creating table [', qualifiedTableName, ']');

                        this._dynamo.createTable(definition.toTableSchema(), (error, data) => {
                            if (error) {
                                if (is.string(error.message) && error.message === `Table already exists: ${qualifiedTableName}`) {
                                    logger.info('Unable to create table [', qualifiedTableName, '], table already exists');

                                    return getTableForCreate.call(this, qualifiedTableName)
                                        .then((tableData) => {
                                            const serverDefinition = TableBuilder.fromDefinition(tableData);

                                            if (definition.equals(serverDefinition, true)) {
                                                resolveCallback(serverDefinition);
                                            } else {
                                                rejectCallback(new Error(`The server definition of the table [ ${qualifiedTableName} ] does not match the expected definition.`));
                                            }
                                        }).catch((e) => {
                                            rejectCallback(e);
                                        });
                                } else {
                                    logger.error(error);

                                    rejectCallback('Failed to create DynamoDB tables', error);
                                }
                            } else {
                                logger.info('Created table [', qualifiedTableName, '], waiting for table to become ready');

                                return this._scheduler.backoff(() => getTableForCreate.call(this, qualifiedTableName), 2000)
                                    .then((tableData) => {
                                        let ttlPromise;

                                        if (definition.ttlAttribute) {
                                            logger.info(`Updating time-to-live configuration for table [ ${definition.name} ]`);

                                            ttlPromise = this._dynamo.updateTimeToLive(definition.toTtlSchema()).promise()
                                                .then((ttlData) => {
                                                    logger.info(`Updated time-to-live configuration for table [ ${definition.name} ]`);

                                                    return ttlData;
                                                });
                                        } else {
                                            ttlPromise = Promise.resolve(null);
                                        }

                                        return ttlPromise.then((ttlData) => {
                                            const adjusted = Object.assign({ }, tableData, ttlData || { });

                                            resolveCallback(TableBuilder.fromDefinition(adjusted));
                                        });
                                    }).catch((e) => {
                                        rejectCallback(e);
                                    });
                            }
                        });
                    });
                });
        }

        /**
         * Deletes a table.
         *
         * @public
         * @async
         * @param {string} tableName - The (unqualified) name of the table.
         * @returns {Promise<Object>}
         */
        async deleteTable(tableName) {
            return Promise.resolve()
                .then(() => {
                    assert.argumentIsRequired(tableName, 'tableName', String);

                    checkReady.call(this);

                    const params = { TableName: tableName };

                    logger.debug(`Deleting table [ ${tableName} ]`);

                    return this._dynamo.deleteTable(params).promise()
                        .then(() => {
                            return this._dynamo.waitFor('tableNotExists', params).promise()
                                .then((data) => {
                                    logger.info(`Table [ ${tableName} ] successfully deleted`);

                                    return data;
                                });
                        }).catch((err) => {
                            logger.error(err);

                            return Promise.reject(`Failed to delete [ ${tableName} ] table`);
                        });
                });
        }

        /**
         * Adds a new item to a table. If the item already exists, it is overwritten.
         *
         * @public
         * @async
         * @param {Object} item - The item to write.
         * @param {Table} table - Describes the schema of the table to write to.
         * @param {Boolean=} preventOverwrite - If true, the resulting promise will reject if another item shares the same key.
         * @returns {Promise<Boolean>}
         */
        async saveItem(item, table, preventOverwrite) {
            return Promise.resolve()
                .then(() => {
                    assert.argumentIsRequired(table, 'table', Table, 'Table');
                    assert.argumentIsRequired(item, 'item', Object);

                    checkReady.call(this);

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

                    const putItem = () => {
                        return promise.build((resolveCallback, rejectCallback) => {
                            this._dynamo.putItem(payload, (error, data) => {
                                if (error) {
                                    const dynamoError = Enum.fromCode(DynamoError, error.code);

                                    if (dynamoError !== null && dynamoError.getRetryable(error)) {
                                        logger.debug('Encountered retryable error [', error.code, '] while putting an item into [', qualifiedTableName, ']');

                                        rejectCallback(error);
                                    } else {
                                        resolveCallback({ code: DYNAMO_RESULT.FAILURE, error: error });
                                    }
                                } else {
                                    resolveCallback({ code: DYNAMO_RESULT.SUCCESS });
                                }
                            });
                        });
                    };

                    return this._scheduler.backoff(putItem, WRITE_MILLISECOND_BACKOFF)
                        .then((result) => {
                            if (result.code === DYNAMO_RESULT.FAILURE) {
                                throw result.error;
                            }

                            return true;
                        });
                });
        }

        /**
         * Edits an existing item's attributes.
         *
         * @public
         * @async
         * @param {Update} update
         * @returns {Promise<Object|null>}
         */
        async updateItem(update) {
            return Promise.resolve()
                .then(() => {
                    assert.argumentIsRequired(update, 'update', Update, 'Update');

                    checkReady.call(this);

                    const schema = update.toUpdateSchema();

                    const updateItem = () => {
                        return Promise.resolve(this._dynamo.updateItem(schema).promise())
                            .then((data) => {
                                let deserialized;

                                if (!attributes.has(data, 'Attributes') || data.Attributes === null) {
                                    deserialized = null;
                                } else {
                                    deserialized = Serializer.deserialize(data.Attributes, update.table);
                                }

                                return Promise.resolve({ code: DYNAMO_RESULT.SUCCESS, results: deserialized });
                            }).catch((error) => {
                                const dynamoError = Enum.fromCode(DynamoError, error.code);

                                let result;

                                if (dynamoError !== null && dynamoError.getRetryable(error)) {
                                    logger.debug('Encountered retryable error [', error.code, '] while putting an item into [', update.table.name, ']');

                                    result = Promise.reject(error);
                                } else {
                                    result = Promise.resolve({ code: DYNAMO_RESULT.FAILURE, error: error });
                                }

                                return result;
                            });
                    };

                    return this._scheduler.backoff(updateItem, WRITE_MILLISECOND_BACKOFF)
                        .then((result) => {
                            if (result.code === DYNAMO_RESULT.FAILURE) {
                                throw result.error;
                            }

                            return result.results;
                        });
                });
        }

        /**
         * Adds multiple items to a table. Unlike the {@link DynamoProvider#saveItem} function,
         * batches are processed serially; that is, writes from a batch must complete before
         * writes from a subsequent batch are started.
         *
         * @public
         * @async
         * @param {Object[]} items - The items to write.
         * @param {Table} table - Describes the schema of the table to write to.
         * @returns {Promise<Boolean>}
         */
        async createItems(items, table) {
            return Promise.resolve()
                .then(() => {
                    return processBatch.call(this, table, DynamoBatchType.PUT, items);
                });
        }

        /**
         * Removes multiple items to a table. Unlike the {@link DynamoProvider#deleteItem} function,
         * batches are processed serially; that is, deletes from a batch must complete before
         * deletes from a subsequent batch are started.
         *
         * @public
         * @async
         * @param {Object[]} items - The items to write.
         * @param {Table} table - Describes the schema of the table to write to.
         * @param {Boolean=} explicit - If keys are derived, the item will be deleted as-is, without rederiving the key.
         * @returns {Promise<Boolean>}
         */
        async deleteItems(items, table, explicit) {
            return Promise.resolve()
                .then(() => {
                    return processBatch.call(this, table, DynamoBatchType.DELETE, items, explicit);
                });
        }

        /**
         * Removes an item from a table.
         *
         * @public
         * @async
         * @param {Object} item - The item to delete.
         * @param {Table} table - Describes the schema of the table to write to.
         * @param {Boolean=} explicit - If keys are derived, the item will be deleted as-is, without rederiving the key.
         * @returns {Promise<Boolean>}
         */
        async deleteItem(item, table, explicit) {
            return Promise.resolve()
                .then(() => {
                    assert.argumentIsRequired(table, 'table', Table, 'Table');
                    assert.argumentIsRequired(item, 'item', Object);
                    assert.argumentIsOptional(explicit, 'explicit', Boolean);

                    checkReady.call(this);

                    const qualifiedTableName = table.name;

                    const payload = {
                        TableName: table.name
                    };

                    payload.Key = Serializer.serialize(item, table, true, explicit);

                    const deleteItem = () => {
                        return promise.build((resolveCallback, rejectCallback) => {
                            this._dynamo.deleteItem(payload, (error, data) => {
                                if (error) {
                                    const dynamoError = Enum.fromCode(DynamoError, error.code);

                                    if (dynamoError !== null && dynamoError.getRetryable(error)) {
                                        logger.debug('Encountered retryable error [', error.code, '] while deleting an item from [', qualifiedTableName, ']');

                                        rejectCallback(error);
                                    } else {
                                        resolveCallback({ code: DYNAMO_RESULT.FAILURE, error: error });
                                    }
                                } else {
                                    resolveCallback({ code: DYNAMO_RESULT.SUCCESS });
                                }
                            });
                        });
                    };

                    return this._scheduler.backoff(deleteItem, WRITE_MILLISECOND_BACKOFF)
                        .then((result) => {
                            if (result.code === DYNAMO_RESULT.FAILURE) {
                                throw result.error;
                            }

                            return true;
                        });
                });
        }

        /**
         * Runs a scan against a DynamoDB table (or index) and returns
         * all the items matching the scan.
         *
         * @public
         * @async
         * @param {Scan} scan
         * @returns {Promise<Object[]>|Promise<Number>}
         */
        async scan(scan) {
            return Promise.resolve()
                .then(() => {
                    assert.argumentIsRequired(scan, 'scan', Scan, 'Scan');

                    checkReady.call(this);

                    const options = scan.toScanSchema();

                    if (!scan.consistentRead && scan.index === null && this._options.preferConsistentReads) {
                        logger.debug('Overriding scan definition, setting consistent reads to true for [', (scan.description || 'unnamed scan'), '] on [', scan.table.name, ']');

                        options.ConsistentRead = true;
                    }

                    let maximum = options.Limit || 0;
                    let count = 0;

                    let run = 0;
                    let runs;

                    if (logger.isTraceEnabled()) {
                        runs = [ ];
                    } else {
                        runs = null;
                    }

                    let abort = false;

                    const getEmptyResult = () => {
                        if (scan.countOnly) {
                            return 0;
                        } else {
                            return [ ];
                        }
                    };

                    const runScanRecursive = (previous) => {
                        const executeScan = () => {
                            const r = run++;

                            if (runs) {
                                runs[r] = { };
                            }

                            return promise.build((resolveCallback, rejectCallback) => {
                                if (runs) {
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
                                        resolveCallback(getEmptyResult());

                                        return;
                                    }
                                }

                                this._dynamo.scan(options, (error, data) => {
                                    if (runs) {
                                        runs[r].scanEnd = (new Date()).getTime();

                                        logger.trace(`Scan [ ${scan.table.name} ], run [ ${r} ] completed at [ ${runs[r].scanEnd} ] in [ ${runs[r].scanEnd - runs[r].scanStart} ] ms`);
                                    }

                                    if (error) {
                                        const dynamoError = Enum.fromCode(DynamoError, error.code);

                                        if (dynamoError !== null && dynamoError.getRetryable(error)) {
                                            logger.debug('Encountered retryable error [', error.code, '] while scanning [', scan.table.name, ']');

                                            rejectCallback(error);
                                        } else {
                                            logger.debug('Encountered non-retryable error [', error.code, '] while scanning [', scan.table.name, ']');

                                            abort = true;

                                            resolveCallback({ code: DYNAMO_RESULT.FAILURE, error: error });
                                        }
                                    } else {
                                        const deserializePromise = promise.build((resolveDeserialize) => {
                                            if (abort) {
                                                resolveDeserialize(getEmptyResult());

                                                return;
                                            }

                                            setImmediate(() => {
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

                                                    deserialized = { code: DYNAMO_RESULT.FAILURE, error: error };
                                                }

                                                if (runs) {
                                                    runs[r].deserializeEnd = (new Date()).getTime();

                                                    logger.trace(`Deserialize [ ${scan.table.name} ] run [ ${r} ] completed at [ ${runs[r].deserializeEnd} ] in [ ${runs[r].deserializeEnd - runs[r].deserializeStart} ] ms`);
                                                }

                                                resolveDeserialize(deserialized);
                                            });
                                        });

                                        const continuationPromise = promise.build((resolveContinuation) => {
                                            if (abort) {
                                                resolveContinuation(getEmptyResult());

                                                return;
                                            }

                                            if (data.Items && data.Items.length !== 0) {
                                                count += data.Items.length;
                                            }

                                            if (data.LastEvaluatedKey && (maximum === 0 || count < maximum)) {
                                                resolveContinuation(runScanRecursive(data.LastEvaluatedKey));
                                            } else {
                                                resolveContinuation(getEmptyResult());
                                            }
                                        });

                                        return Promise.all([ deserializePromise, continuationPromise ])
                                            .then((combined) => {
                                                const error = combined.find(r => is.object(r) && r.code === DYNAMO_RESULT.FAILURE);

                                                if (error) {
                                                    resolveCallback(error);
                                                } else {
                                                    const deserialized = combined[0];
                                                    const continuation = combined[1];

                                                    let results;

                                                    if (scan.countOnly) {
                                                        results = deserialized + continuation;
                                                    } else {
                                                        results = deserialized.concat(continuation);
                                                    }

                                                    resolveCallback(results);
                                                }
                                            });
                                    }
                                });
                            });
                        };

                        return this._scheduler.backoff(executeScan, READ_MILLISECOND_BACKOFF)
                            .then((results) => {
                                if (results.code === DYNAMO_RESULT.FAILURE) {
                                    return Promise.reject(results.error);
                                } else {
                                    return Promise.resolve(results);
                                }
                            });
                    };

                    return runScanRecursive()
                        .then((results) => {
                            const composite = { };

                            composite.results = results;
                            composite.timing = runs;

                            return composite;
                        });
                }).then((composite) => {
                    const results = composite.results;

                    logger.debug('Ran [', scan.description, '] on [', scan.table.name + (scan.index ? '/' + scan.index.name : ''), '] and matched [', (scan.countOnly ? results : results.length), '] results');

                    if (composite.timing) {
                        const timing = composite.timing;

                        logger.trace('Ran [', scan.description, '] on [', scan.table.name + (scan.index ? '/' + scan.index.name : ''), '] over [', timing.length ,'] runs in [', array.last(timing).deserializeEnd - array.first(timing).scanStart, '] ms with [', timing.reduce((t, i) => t + (i.scanEnd - i.scanStart), 0), '] ms scanning and [', timing.reduce((t, i) => t + (i.deserializeEnd - i.deserializeStart), 0), '] ms deserializing');
                    }

                    return results;
                }).catch((e) => {
                    logger.error('Failed to run [', scan.description, '] on [', scan.table.name + (scan.index ? '/' + scan.index.name : ''), ']', e);

                    return Promise.reject(e);
                });
        }

        /**
         * Runs a scan, returning a page of results.
         *
         * @public
         * @async
         * @param {Scan} scan
         * @param {Object=} startKey
         * @return {Promise}
         */
        async scanChunk(scan, startKey) {
            return Promise.resolve()
                .then(() => {
                    assert.argumentIsRequired(scan, 'scan', Scan, 'Scan');
                    assert.argumentIsOptional(startKey, 'startKey', Object);

                    checkReady.call(this);

                    const options = scan.toScanSchema();

                    if (!scan.consistentRead && scan.index === null && this._options.preferConsistentReads) {
                        logger.debug('Overriding scan definition, setting consistent reads to true for [', (scan.description || 'unnamed scan'), '] on [', scan.table.name, ']');

                        options.ConsistentRead = true;
                    }

                    const executeScan = () => {
                        return promise.build((resolveCallback, rejectCallback) => {
                            if (startKey) {
                                options.ExclusiveStartKey = Serializer.serialize(startKey, scan.table, false, true);
                            } else if (scan.exclusiveStartKey) {
                                options.ExclusiveStartKey = Serializer.serialize(scan.exclusiveStartKey, scan.table, true, false);
                            }

                            this._dynamo.scan(options, (error, data) => {
                                if (error) {
                                    const dynamoError = Enum.fromCode(DynamoError, error.code);

                                    if (dynamoError !== null && dynamoError.getRetryable(error)) {
                                        logger.debug('Encountered retryable error [', error.code, '] while scanning [', scan.table.name, ']');

                                        rejectCallback(error);
                                    } else {
                                        resolveCallback({ code: DYNAMO_RESULT.FAILURE, error: error });
                                    }
                                } else {
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

                                        results = null;

                                        resolveCallback({ code: DYNAMO_RESULT.FAILURE, error: error });
                                    }

                                    if (results !== null) {
                                        let wrapper = { };

                                        if (data.LastEvaluatedKey) {
                                            wrapper.startKey = Serializer.deserialize(data.LastEvaluatedKey, scan.table);
                                        }

                                        if (data.ConsumedCapacity) {
                                            wrapper.capacityConsumed = data.ConsumedCapacity.CapacityUnits || 0;
                                        }

                                        wrapper.code = DYNAMO_RESULT.SUCCESS;
                                        wrapper.results = results;

                                        resolveCallback(wrapper);
                                    }
                                }
                            });
                        });
                    };

                    return this._scheduler.backoff(executeScan, READ_MILLISECOND_BACKOFF)
                        .then((results) => {
                            if (results.code === DYNAMO_RESULT.FAILURE) {
                                return Promise.reject(results.error);
                            } else {
                                return Promise.resolve(results);
                            }
                        });
                }).then((results) => {
                    logger.debug('Ran [', scan.description, '] in chunk mode on [', scan.table.name + (scan.index ? '/ ' + scan.index.name : ''), '] and matched [', results.results.length ,'] results');

                    return results;
                }).catch((e) => {
                    logger.error('Failed to run [', scan.description, '] in chunk mode on [', scan.table.name + (scan.index ? '/' + scan.index.name : ''), ']', e);

                    return Promise.reject(e);
                });
        }

        /**
         * Runs a query against a DynamoDB table (or index) and returns
         * all the items matching the query.
         *
         * @public
         * @async
         * @param {Query} query
         * @returns {Promise<Object[]>|Promise<Number>}
         */
        async query(query) {
            return Promise.resolve()
                .then(() => {
                    assert.argumentIsRequired(query, 'query', Query, 'Query');

                    checkReady.call(this);

                    const options = query.toQuerySchema();

                    if (!query.consistentRead && query.index === null && this._options.preferConsistentReads) {
                        logger.debug('Overriding query definition, setting consistent reads to true for [', (query.description || 'unnamed query'), '] on [', query.table.name, ']');

                        options.ConsistentRead = true;
                    }

                    let maximum = options.Limit || 0;
                    let count = 0;

                    let run = 0;
                    let runs;

                    if (logger.isTraceEnabled()) {
                        runs = [ ];
                    } else {
                        runs = null;
                    }

                    let abort = false;

                    const getEmptyResult = () => {
                        if (query.countOnly) {
                            return 0;
                        } else {
                            return [ ];
                        }
                    };

                    const runQueryRecursive = (previous) => {
                        const executeQuery = () => {
                            const r = run++;

                            if (runs) {
                                runs[r] = { };
                            }

                            return promise.build((resolveCallback, rejectCallback) => {
                                if (runs) {
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
                                        resolveCallback(getEmptyResult());

                                        return;
                                    }
                                }

                                this._dynamo.query(options, (error, data) => {
                                    if (runs) {
                                        runs[r].queryEnd = (new Date()).getTime();

                                        logger.trace(`Query [ ${query.table.name} ], run [ ${r} ] completed at [ ${runs[r].queryEnd} ] in [ ${runs[r].queryEnd - runs[r].queryStart} ] ms`);
                                    }

                                    if (error) {
                                        const dynamoError = Enum.fromCode(DynamoError, error.code);

                                        if (dynamoError !== null && dynamoError.getRetryable(error)) {
                                            logger.debug('Encountered retryable error [', error.code, '] while querying [', query.table.name, ']');

                                            rejectCallback(error);
                                        } else {
                                            logger.debug('Encountered non-retryable error [', error.code, '] while querying [', query.table.name, ']');

                                            abort = true;

                                            resolveCallback({ code: DYNAMO_RESULT.FAILURE, error: error });
                                        }
                                    } else {
                                        const deserializePromise = promise.build((resolveDeserialize) => {
                                            if (abort) {
                                                resolveDeserialize(getEmptyResult());

                                                return;
                                            }

                                            // 2010/01/18, BRI. Using "setImmediate" causes the deserialization step to be deferred
                                            // until after the next query "segment" begins (assuming multiple query "segments" are
                                            // required to retrieve the full result set). This allows the deserialization step to
                                            // run while waiting on the network (for the next query segment), thereby improving
                                            // overall response time.

                                            setImmediate(() => {
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

                                                    deserialized = { code: DYNAMO_RESULT.FAILURE, error: error };
                                                }

                                                if (runs) {
                                                    runs[r].deserializeEnd = (new Date()).getTime();

                                                    logger.trace(`Deserialize [ ${query.table.name} ] run [ ${r} ] completed at [ ${runs[r].deserializeEnd} ] in [ ${runs[r].deserializeEnd - runs[r].deserializeStart} ] ms`);
                                                }

                                                resolveDeserialize(deserialized);
                                            });
                                        });

                                        const continuationPromise = promise.build((resolveContinuation) => {
                                            if (abort) {
                                                resolveContinuation(getEmptyResult());

                                                return;
                                            }

                                            if (data.Items && data.Items.length !== 0) {
                                                count += data.Items.length;
                                            }

                                            if (data.LastEvaluatedKey && (maximum === 0 || count < maximum)) {
                                                resolveContinuation(runQueryRecursive(data.LastEvaluatedKey));
                                            } else {
                                                resolveContinuation(getEmptyResult());
                                            }
                                        });

                                        Promise.all([ deserializePromise, continuationPromise ])
                                            .then((combined) => {
                                                const error = combined.find(r => is.object(r) && r.code === DYNAMO_RESULT.FAILURE);

                                                if (error) {
                                                    resolveCallback(error);
                                                } else {
                                                    const deserialized = combined[0];
                                                    const continuation = combined[1];

                                                    let results;

                                                    if (query.countOnly) {
                                                        results = deserialized + continuation;
                                                    } else {
                                                        results = deserialized.concat(continuation);
                                                    }

                                                    resolveCallback(results);
                                                }
                                            });
                                    }
                                });
                            });
                        };

                        return this._scheduler.backoff(executeQuery, READ_MILLISECOND_BACKOFF)
                            .then((results) => {
                                if (results.code === DYNAMO_RESULT.FAILURE) {
                                    return Promise.reject(results.error);
                                } else {
                                    return Promise.resolve(results);
                                }
                            });
                    };

                    return runQueryRecursive()
                        .then((results) => {
                            const composite = { };

                            composite.results = results;
                            composite.timing = runs;

                            return composite;
                        });
                }).then((composite) => {
                    const results = composite.results;

                    logger.debug('Ran [', query.description, '] on [', query.table.name + (query.index ? '/' + query.index.name : ''), '] and matched [', (query.countOnly ? results : results.length), '] results');

                    if (composite.timing) {
                        const timing = composite.timing;

                        logger.trace('Ran [', query.description, '] on [', query.table.name + (query.index ? '/' + query.index.name : ''), '] over [', timing.length ,'] runs in [', array.last(timing).deserializeEnd - array.first(timing).queryStart, '] ms with [', timing.reduce((t, i) => t + (i.queryEnd - i.queryStart), 0), '] ms querying and [', timing.reduce((t, i) => t + (i.deserializeEnd - i.deserializeStart), 0), '] ms deserializing');
                    }

                    return results;
                }).catch((e) => {
                    logger.error('Failed to run [', query.description, '] on [', query.table.name + (query.index ? '/' + query.index.name : ''), ']', e);

                    return Promise.reject(e);
                });
        }

        /**
         * Run parallel queries against a DynamoDB table (or index) and returns
         * all the items matching.
         *
         * @public
         * @async
         * @param {Query[]} queries
         * @returns {Promise<Object[]>}
         */
        async queryParallel(queries) {
            return Promise.resolve()
                .then(() => {
                    assert.argumentIsArray(queries, 'queries', Query, 'Query');

                    return Promise.all(queries.map(query => this.query(query)))
                        .then((results) => {
                            return array.flatten(results);
                        });
                });
        }

        /**
         * Runs a query, returning a page of results.
         *
         * @public
         * @async
         * @param {Query} query
         * @param {Object=} startKey
         * @return {Promise}
         */
        async queryChunk(query, startKey) {
            return Promise.resolve()
                .then(() => {
                    assert.argumentIsRequired(query, 'query', Query, 'Query');
                    assert.argumentIsOptional(startKey, 'startKey', Object);

                    checkReady.call(this);

                    const options = query.toQuerySchema();

                    if (!query.consistentRead && query.index === null && this._options.preferConsistentReads) {
                        logger.debug('Overriding query definition, setting consistent reads to true for [', (query.description || 'unnamed query'), '] on [', query.table.name, ']');

                        options.ConsistentRead = true;
                    }

                    const executeQuery = () => {
                        return promise.build((resolveCallback, rejectCallback) => {
                            if (startKey) {
                                options.ExclusiveStartKey = Serializer.serialize(startKey, query.table, false, true);
                            } else if (query.exclusiveStartKey) {
                                options.ExclusiveStartKey = Serializer.serialize(query.exclusiveStartKey, query.table, true, false);
                            }

                            this._dynamo.query(options, (error, data) => {
                                if (error) {
                                    const dynamoError = Enum.fromCode(DynamoError, error.code);

                                    if (dynamoError !== null && dynamoError.getRetryable(error)) {
                                        logger.debug('Encountered retryable error [', error.code, '] while querying [', query.table.name, ']');

                                        rejectCallback(error);
                                    } else {
                                        resolveCallback({ code: DYNAMO_RESULT.FAILURE, error: error });
                                    }
                                } else {
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

                                        results = null;

                                        resolveCallback({ code: DYNAMO_RESULT.FAILURE, error: error });
                                    }

                                    if (results !== null) {
                                        let wrapper = { };

                                        if (data.LastEvaluatedKey) {
                                            wrapper.startKey = Serializer.deserialize(data.LastEvaluatedKey, query.table);
                                        }

                                        if (data.ConsumedCapacity) {
                                            wrapper.capacityConsumed = data.ConsumedCapacity.CapacityUnits || 0;
                                        }

                                        wrapper.code = DYNAMO_RESULT.SUCCESS;
                                        wrapper.results = results;

                                        resolveCallback(wrapper);
                                    }
                                }
                            });
                        });
                    };

                    return this._scheduler.backoff(executeQuery, READ_MILLISECOND_BACKOFF).then((results) => {
                        if (results.code === DYNAMO_RESULT.FAILURE) {
                            return Promise.reject(results.error);
                        } else {
                            return Promise.resolve(results);
                        }
                    });
                }).then((results) => {
                    logger.debug('Ran [', query.description, '] in chunk mode on [', query.table.name + (query.index ? '/ ' + query.index.name : ''), '] and matched [', results.results.length ,'] results');

                    return results;
                }).catch((e) => {
                    logger.error('Failed to run [', query.description, '] in chunk mode on [', query.table.name + (query.index ? '/' + query.index.name : ''), ']', e);

                    return Promise.reject(e);
                });
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

            return TableBuilder.withName(getQualifiedTableName(this._configuration.prefix, name));
        }

        _onDispose() {
            if (this._scheduler !== null) {
                this._scheduler.dispose();
                this._scheduler = null;
            }

            if (this._batches !== null) {
                this._batches.forEach((k, v) => v.dispose());
                this._batches = null;
            }
        }

        toString() {
            return '[DynamoProvider]';
        }
    }

    function checkReady() {
        if (this.disposed) {
            throw new Error('The Dynamo provider has been disposed');
        }

        if (!this._started) {
            throw new Error('The Dynamo provider has not been started');
        }
    }

    function getQualifiedTableName(prefix, name) {
        return `${prefix}-${name}`;
    }

    function getTable(qualifiedTableName) {
        return promise.build((resolveCallback, rejectCallback) => {
            this._dynamo.describeTable({ TableName: qualifiedTableName }, (error, data) => {
                if (error) {
                    logger.error(error);

                    rejectCallback('Failed to retrieve DynamoDB table', error);
                } else if (!is.object(data.Table)) {
                    rejectCallback('Unexpected response from DynamoDB SDK.');
                } else {
                    if (logger.isTraceEnabled()) {
                        logger.trace(JSON.stringify(data, null, 2));
                    }

                    resolveCallback(data.Table);
                }
            });
        });
    }

    function getTimeToLiveSettings(qualifiedTableName) {
        return this._dynamo.describeTimeToLive({ TableName: qualifiedTableName }).promise()
            .catch((error) => {
                logger.error(error);

                return Promise.reject(`Failed to retrieve DynamoDB time-to-live settings, ${error}`);
            });
    }

    function processBatch(table, type, items, explicit) {
        assert.argumentIsRequired(table, 'table', Table, 'Table');
        assert.argumentIsRequired(type, 'type', DynamoBatchType, 'DynamoBatchType');
        assert.argumentIsArray(items, 'items');
        assert.argumentIsOptional(explicit, 'explicit', Boolean);

        checkReady.call(this);

        if (items.length === 0) {
            return;
        }

        const qualifiedTableName = table.name;

        if (!this._batches.has(qualifiedTableName)) {
            this._batches.set(qualifiedTableName, new WorkQueue());
        }

        const workQueue = this._batches.get(qualifiedTableName);

        return workQueue.enqueue(() => {
            const batchNumber = workQueue.getCurrent();

            logger.debug('Starting batch', type.description, 'on [', qualifiedTableName, '] for batch number [', batchNumber, '] with [', items.length, '] items');

            const writeBatch = (currentPayload) => {
                return promise.build((resolveCallback, rejectCallback) => {
                    this._dynamo.batchWriteItem(currentPayload, (error, data) => {
                        if (error) {
                            const dynamoError = Enum.fromCode(DynamoError, error.code);

                            if (dynamoError !== null && dynamoError.getRetryable(error)) {
                                logger.debug('Encountered retryable error [', error.code, '] while running batch', type.description, 'on [', qualifiedTableName, ']');

                                rejectCallback(error);
                            } else {
                                resolveCallback({ code: DYNAMO_RESULT.FAILURE, error: error });
                            }
                        } else {
                            let unprocessedItems;

                            if (is.object(data.UnprocessedItems) && is.array(data.UnprocessedItems[qualifiedTableName])) {
                                unprocessedItems = data.UnprocessedItems[qualifiedTableName];
                            } else {
                                unprocessedItems = [ ];
                            }

                            if (unprocessedItems.length === 0) {
                                resolveCallback({ code: DYNAMO_RESULT.SUCCESS });
                            } else {
                                logger.debug('Continuing batch [', type.description, '] on [', qualifiedTableName, '] for batch number [', batchNumber,'] with [', unprocessedItems.length, '] unprocessed items');

                                const continuePayload = getBatchPayload(qualifiedTableName, unprocessedItems);

                                this._scheduler.backoff(() => writeBatch(continuePayload), WRITE_MILLISECOND_BACKOFF)
                                    .then((continueResult) => {
                                        resolveCallback(continueResult);
                                    });
                            }
                        }
                    });
                });
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

            return this._scheduler.backoff(() => writeBatch(originalPayload), WRITE_MILLISECOND_BACKOFF)
                .then((result) => {
                    if (result.code === DYNAMO_RESULT.FAILURE) {
                        logger.error('Failed batch [', type.description, '] on [', qualifiedTableName, '] for batch number [', batchNumber,'] with [', items.length, '] items');

                        throw result.error;
                    }

                    logger.debug('Finished batch [', type.description, '] on [', qualifiedTableName, '] for batch number [', batchNumber,'] with [', items.length, '] items');

                    return true;
                });
        });
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
        constructor(code, description, retryablePredicate) {
            super(code, description);

            this._retryablePredicate = retryablePredicate;
        }

        getRetryable(error) {
            return this._retryablePredicate(error);
        }

        toString() {
            return `[DynamoError (code=${this._code})]`;
        }
    }

    const dynamoErrorThrottling = new DynamoError('ThrottlingException', 'Throttling Exception', () => true);
    const dynamoErrorThroughput = new DynamoError('ProvisionedThroughputExceededException', 'Provisioned Throughput Exceeded Exception', () => true);
    const dynamoErrorConditional = new DynamoError('ConditionalCheckFailedException', 'Conditional Check Failed Exception', () => false);
    const dynamoErrorUnavailable = new DynamoError('UnknownError', 'Unknown Error Exception', (error) => is.boolean(error.retryable) && error.retryable);
    const dynamoErrorTimeout = new DynamoError('TimeoutError', 'Timeout Error Exception', (error) => is.boolean(error.retryable) && error.retryable);

    class DynamoBatchType extends Enum {
        constructor(code, description, requestTypeName, requestItemName, keysOnly) {
            super(code, description);

            this._requestTypeName = requestTypeName;
            this._requestItemName = requestItemName;

            this._keysOnly = keysOnly;
        }

        get requestTypeName() {
            return this._requestTypeName;
        }

        get requestItemName() {
            return this._requestItemName;
        }

        get keysOnly() {
            return this._keysOnly;
        }

        static get PUT() {
            return dynamoBatchPut;
        }

        static get DELETE() {
            return dynamoBatchDelete;
        }

        toString() {
            return `[DynamoBatchType (code=${this._code})]`;
        }
    }

    const dynamoBatchPut = new DynamoBatchType('PUT', 'insert', 'PutRequest', 'Item', false);
    const dynamoBatchDelete = new DynamoBatchType('DELETE', 'delete', 'DeleteRequest', 'Key', true);

    return DynamoProvider;
})();
