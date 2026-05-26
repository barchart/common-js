const log4js = require('log4js');

const assert = require('@barchart/common-js/lang/assert'),
	attributes = require('@barchart/common-js/lang/attributes'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
	is = require('@barchart/common-js/lang/is');

const Definition = require('./schema/definitions/Table'),
	DynamoProvider = require('./../DynamoProvider');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('common-node/aws/dynamo/TableContainer');

	/**
	 * A container that houses functions for interacting with a
	 * single DynamoDB table. In other words, this is the base
	 * class for an implementing a repository pattern.
	 *
	 * @public
	 * @abstract
	 * @extends {Disposable}
	 * @param {DynamoProvider} provider
	 * @param {Table} definition
	 */
	class TableContainer extends Disposable {
		constructor(provider, definition) {
			super();

			assert.argumentIsRequired(provider, 'provider', DynamoProvider, 'DynamoProvider');
			assert.argumentIsRequired(definition, 'definition', Definition, 'Definition');

			this._provider = provider;
			this._definition = definition;

			this._startPromise = null;
			this._started = false;
		}

		/**
		 * The table definition.
		 *
		 * @public
		 * @returns {Table}
		 */
		get definition() {
			return this._definition;
		}

		/**
		 * Returns a key, suitable as a starting point for queries and scans.
		 *
		 * @public
		 * @param {*} hash
		 * @param {*|null|undefined} range
		 * @returns {Object}
		 */
		getPagingKey(hash, range) {
			const pagingKey = { };

			attributes.write(pagingKey, this._definition.hashKey.attribute.name, hash);

			if (this._definition.rangeKey !== null) {
				attributes.write(pagingKey, this._definition.rangeKey.attribute.name, range);
			}

			return pagingKey;
		}

		/**
		 * Given a record, returns the record's hash key value.
		 *
		 * @public
		 * @param {Object} record
		 * @returns {*|null}
		 */
		getHashKey(record) {
			assert.argumentIsRequired(record, 'record', Object);

			return attributes.read(record, this._definition.hashKey.attribute.name);
		}

		/**
		 * Given a record, returns the record's range key value (or a null value).
		 *
		 * @public
		 * @param {Object} record
		 * @returns {*|null}
		 */
		getRangeKey(record) {
			assert.argumentIsRequired(record, 'record', Object);

			return attributes.read(record, this._definition.rangeKey.attribute.name);
		}

		/**
		 * Initializes the table. Call this before invoking any other instance
		 * functions.
		 *
		 * @public
		 * @async
		 * @param {Boolean=} skipVerification - If true, verification of table's existence and schema is skipped. This could be considered unsafe, but startup will be faster.
		 * @returns {Promise<Boolean>}
		 */
		async start(skipVerification) {
			if (this._startPromise === null) {
				this._startPromise = Promise.resolve()
					.then(() => {
						if (this.disposed) {
							return Promise.reject(`The ${this.toString()} has been disposed.`);
						}

						assert.argumentIsOptional(skipVerification, 'skipVerification', Boolean);

						return this._provider.start();
					}).then(() => {
						let createPromise;

						if (is.boolean(skipVerification) && skipVerification) {
							createPromise = Promise.resolve();
						} else {
							createPromise = this._provider.createTable(this.definition);
						}

						return createPromise;
					}).then(() => {
						logger.debug('Dynamo table wrapper for', this._definition.name, 'initialized');

						this._started = true;

						return this._started;
					}).catch((e) => {
						logger.error('Dynamo table wrapper failed to start', e);

						throw e;
					});
			}

			return this._startPromise;
		}

		/**
		 * Returns true, if the item conforms to the table's schema; otherwise false.
		 *
		 * @protected
		 * @param {Object} item
		 * @returns {Boolean}
		 */
		_validate(item) {
			return is.object(item);
		}

		/**
		 * Creates a new item.
		 *
		 * @protected
		 * @async
		 * @param {Object} item
		 * @param {Boolean=} preventOverwrite
		 * @returns {Promise<Boolean>}
		 */
		async _createItem(item, preventOverwrite) {
			return Promise.resolve()
				.then(() => {
					checkReady.call(this);

					if (!this._validate(item)) {
						logger.trace('Failed to create item in [', this.definition.name, '] table', item);

						throw new Error(`Unable to insert item into [ ${this.definition.name} ] table.`);
					}

					return this._provider.saveItem(item, this.definition, preventOverwrite);
				});
		}

		/**
		 * Creates multiple items, in an batch operation.
		 *
		 * @protected
		 * @async
		 * @param {Object[]} items
		 * @returns {Promise<Boolean>}
		 */
		async _createItems(items) {
			return Promise.resolve()
				.then(() => {
					checkReady.call(this);

					items.forEach((item) => {
						if (!this._validate(item)) {
							logger.trace('Failed to create item in [', this.definition.name, '] table', item);

							throw new Error(`Unable to insert items into [ ${this.definition.name} ] table.`);
						}
					});

					return this._provider.createItems(items, this.definition);
				});
		}

		/**
		 * Deletes an item from the table.
		 *
		 * @protected
		 * @async
		 * @param {Object} item
		 * @returns {Promise<Boolean>}
		 */
		async _deleteItem(item) {
			return Promise.resolve()
				.then(() => {
					checkReady.call(this);

					if (!this._validate(item)) {
						logger.trace('Failed to delete item from [', this.definition.name, '] table', item);

						throw new Error(`Unable to delete item from [ ${this.definition.name} ] table.`);
					}

					return this._provider.deleteItem(item, this.definition);
				});
		}

		/**
		 * Deletes multiple items, in an batch operation.
		 *
		 * @protected
		 * @async
		 * @param {Object[]} items
		 * @returns {Promise<Boolean>}
		 */
		async _deleteItems(items) {
			return Promise.resolve()
				.then(() => {
					checkReady.call(this);

					items.forEach((item) => {
						if (!this._validate(item)) {
							logger.trace('Failed to create delete item from [', this.definition.name, '] table', item);

							throw new Error(`Unable to delete items from [ ${this.definition.name} ] table.`);
						}
					});

					return this._provider.deleteItems(items, this.definition);
				});
		}

		/**
		 * Updates an item from the table.
		 *
		 * @protected
		 * @async
		 * @param {Update} update
		 * @returns {Promise<Object>}
		 */
		async _updateItem(update) {
			return Promise.resolve()
				.then(() => {
					checkReady.call(this);

					return this._provider.updateItem(update);
				});
		}

		/**
		 * Deletes a table.
		 *
		 * @public
		 * @async
		 * @returns {Promise<Object>}
		 */
		async deleteTable() {
			return Promise.resolve()
				.then(() => {
					checkReady.call(this);

					return this._provider.deleteTable(this.definition.name)
						.then((data) => {
							this.dispose();

							return data;
						});
				});
		}

		/**
		 * Runs an update of the table item.
		 *
		 * @deprecated
		 * @public
		 * @async
		 * @param {Update} update
		 * @returns {Promise<Object>}
		 */
		async updateItem(update) {
			return this._updateItem(update);
		}

		/**
		 * Runs a scan on the table.
		 *
		 * @public
		 * @async
		 * @param {Scan} scan
		 * @returns {Promise<Object[]>}
		 */
		async scan(scan) {
			return Promise.resolve()
				.then(() => {
					checkReady.call(this);

					return this._provider.scan(scan);
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
					checkReady.call(this);

					return this._provider.scanChunk(scan, startKey);
				});
		}

		/**
		 * Runs a query on the table.
		 *
		 * @public
		 * @async
		 * @param {Query} query
		 * @returns {Promise<Object[]>}
		 */
		async query(query) {
			return Promise.resolve()
				.then(() => {
					checkReady.call(this);

					return this._provider.query(query);
				});
		}

		/**
		 * Runs parallel queries.
		 *
		 * @public
		 * @async
		 * @param {Query[]} queries
		 * @returns {Promise<Object[]>}
		 */
		async queryParallel(queries) {
			return Promise.resolve()
				.then(() => {
					checkReady.call(this);

					return this._provider.queryParallel(queries);
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
					checkReady.call(this);

					return this._provider.queryChunk(query, startKey);
				});
		}

		_onDispose() {
			return;
		}

		toString() {
			return '[Table]';
		}
	}

	function checkReady() {
		if (this.disposed) {
			throw new Error(`The ${this.toString()} has been disposed.`);
		}

		if (!this._started) {
			throw new Error(`The ${this.toString()} has not been started.`);
		}
	}

	return TableContainer;
})();
