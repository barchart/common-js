import * as assert from '@barchart/common-js/lang/assert.js';
import * as attributes from '@barchart/common-js/lang/attributes.js';
import * as is from '@barchart/common-js/lang/is.js';

import Disposable from '@barchart/common-js/lang/Disposable.js';

import Definition from './schema/definitions/Table.js';
import DynamoProvider from './../DynamoProvider.js';

import log4js from 'log4js';

/**
 * @typedef {import('./schema/definitions/Table.js').default} Table
 */

/**
 * @typedef {import('./query/definitions/Update.js').default} Update
 */

/**
 * @typedef {import('./query/definitions/Scan.js').default} Scan
 */

/**
 * @typedef {import('./query/definitions/Query.js').default} Query
 */

const logger = log4js.getLogger('common-node/aws/dynamo/TableContainer');

/**
 * A container that houses functions for interacting with a
 * single DynamoDB table. In other words, this is the base
 * class for an implementing a repository pattern.
 *
 * @public
 * @abstract
 * @extends {Disposable}
 */
export default class TableContainer extends Disposable {
	#definition;
	#provider;
	#startPromise;
	#started;

	/**
	 * @param {DynamoProvider} provider
	 * @param {Table} definition
	 */
	constructor(provider, definition) {
		super();

		assert.argumentIsRequired(provider, 'provider', DynamoProvider, 'DynamoProvider');
		assert.argumentIsRequired(definition, 'definition', Definition, 'Definition');

		this.#provider = provider;
		this.#definition = definition;

		this.#startPromise = null;
		this.#started = false;
	}

	/**
	 * The table definition.
	 *
	 * @public
	 * @returns {Table}
	 */
	get definition() {
		return this.#definition;
	}

	/**
	 * Returns a key, suitable as a starting point for queries and scans.
	 *
	 * @public
	 * @param {*} hash
	 * @param {*|null|undefined} range
	 * @returns {object}
	 */
	getPagingKey(hash, range) {
		const pagingKey = { };

		attributes.write(pagingKey, this.#definition.hashKey.attribute.name, hash);

		if (this.#definition.rangeKey !== null) {
			attributes.write(pagingKey, this.#definition.rangeKey.attribute.name, range);
		}

		return pagingKey;
	}

	/**
	 * Given a record, returns the record's hash key value.
	 *
	 * @public
	 * @param {object} record
	 * @returns {*|null}
	 */
	getHashKey(record) {
		assert.argumentIsRequired(record, 'record', Object);

		return attributes.read(record, this.#definition.hashKey.attribute.name);
	}

	/**
	 * Given a record, returns the record's range key value (or a null value).
	 *
	 * @public
	 * @param {object} record
	 * @returns {*|null}
	 */
	getRangeKey(record) {
		assert.argumentIsRequired(record, 'record', Object);

		return attributes.read(record, this.#definition.rangeKey.attribute.name);
	}

	/**
	 * Initializes the table. Call this before invoking any other instance
	 * functions.
	 *
	 * @public
	 * @async
	 * @param {boolean=} skipVerification
	 * @returns {Promise<boolean>}
	 */
	async start(skipVerification) {
		if (this.#startPromise === null) {
			this.#startPromise = (async () => {
				try {
					if (this.disposed) {
						throw new Error(`The ${this.toString()} has been disposed.`);
					}

					assert.argumentIsOptional(skipVerification, 'skipVerification', Boolean);

					await this.#provider.start();

					if (!(is.boolean(skipVerification) && skipVerification)) {
						await this.#provider.createTable(this.definition);
					}

					logger.debug('Dynamo table wrapper for', this.#definition.name, 'initialized');

					this.#started = true;

					return this.#started;
				} catch (e) {
					logger.error('Dynamo table wrapper failed to start', e);

					throw e;
				}
			})();
		}

		return this.#startPromise;
	}

	/**
	 * Returns true, if the item conforms to the table's schema; otherwise false.
	 *
	 * @protected
	 * @param {object} item
	 * @returns {boolean}
	 */
	_validate(item) {
		return is.object(item);
	}

	/**
	 * Creates a new item.
	 *
	 * @protected
	 * @async
	 * @param {object} item
	 * @param {boolean=} preventOverwrite
	 * @returns {Promise<boolean>}
	 */
	async _createItem(item, preventOverwrite) {
		this.#checkReady();

		if (!this._validate(item)) {
			logger.trace('Failed to create item in [', this.definition.name, '] table', item);

			throw new Error(`Unable to insert item into [ ${this.definition.name} ] table.`);
		}

		return this.#provider.saveItem(item, this.definition, preventOverwrite);
	}

	/**
	 * Creates multiple items, in a batch operation.
	 *
	 * @protected
	 * @async
	 * @param {object[]} items
	 * @returns {Promise<boolean>}
	 */
	async _createItems(items) {
		this.#checkReady();

		items.forEach((item) => {
			if (!this._validate(item)) {
				logger.trace('Failed to create item in [', this.definition.name, '] table', item);

				throw new Error(`Unable to insert items into [ ${this.definition.name} ] table.`);
			}
		});

		return this.#provider.createItems(items, this.definition);
	}

	/**
	 * Deletes an item from the table.
	 *
	 * @protected
	 * @async
	 * @param {object} item
	 * @returns {Promise<boolean>}
	 */
	async _deleteItem(item) {
		this.#checkReady();

		if (!this._validate(item)) {
			logger.trace('Failed to delete item from [', this.definition.name, '] table', item);

			throw new Error(`Unable to delete item from [ ${this.definition.name} ] table.`);
		}

		return this.#provider.deleteItem(item, this.definition);
	}

	/**
	 * Deletes multiple items, in a batch operation.
	 *
	 * @protected
	 * @async
	 * @param {object[]} items
	 * @returns {Promise<boolean>}
	 */
	async _deleteItems(items) {
		this.#checkReady();

		items.forEach((item) => {
			if (!this._validate(item)) {
				logger.trace('Failed to create delete item from [', this.definition.name, '] table', item);

				throw new Error(`Unable to delete items from [ ${this.definition.name} ] table.`);
			}
		});

		return this.#provider.deleteItems(items, this.definition);
	}

	/**
	 * Updates an item from the table.
	 *
	 * @protected
	 * @async
	 * @param {Update} update
	 * @returns {Promise<object>}
	 */
	async _updateItem(update) {
		this.#checkReady();

		return this.#provider.updateItem(update);
	}

	/**
	 * Deletes a table.
	 *
	 * @public
	 * @async
	 * @returns {Promise<object>}
	 */
	async deleteTable() {
		this.#checkReady();

		const data = await this.#provider.deleteTable(this.definition.name);

		this.dispose();

		return data;
	}

	/**
	 * Runs an update of the table item.
	 *
	 * @deprecated
	 * @public
	 * @async
	 * @param {Update} update
	 * @returns {Promise<object>}
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
	 * @returns {Promise<object[]|number>}
	 */
	async scan(scan) {
		this.#checkReady();

		return this.#provider.scan(scan);
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
		this.#checkReady();

		return this.#provider.scanChunk(scan, startKey);
	}


	/**
	 * Runs a query on the table.
	 *
	 * @public
	 * @async
	 * @param {Query} query
	 * @returns {Promise<object[]|number>}
	 */
	async query(query) {
		this.#checkReady();

		return this.#provider.query(query);
	}

	/**
	 * Runs parallel queries.
	 *
	 * @public
	 * @async
	 * @param {Query[]} queries
	 * @returns {Promise<object[]>}
	 */
	async queryParallel(queries) {
		this.#checkReady();

		return this.#provider.queryParallel(queries);
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
		this.#checkReady();

		return this.#provider.queryChunk(query, startKey);
	}

	_onDispose() {
		return;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Table]';
	}


	#checkReady() {
		if (this.disposed) {
			throw new Error(`The ${this.toString()} has been disposed.`);
			}

			if (!this.#started) {
				throw new Error(`The ${this.toString()} has not been started.`);
			}
		}
}
