const log4js = require('log4js'),
	Stream = require('stream');

const assert = require('@barchart/common-js/lang/assert'),
	is = require('@barchart/common-js/lang/is');

const DynamoProvider = require('./../../DynamoProvider'),
	Table = require('./../schema/definitions/Table');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('common-node/aws/dynamo/stream/DynamoStreamWriter');

	/**
	 * A Node.js {@link Stream.Writable} which creates or deletes DynamoDB records.
	 *
	 * @public
	 * @extends {Stream.Writable}
	 * @param {Table} table - The table schema which items must conform to.
	 * @param {DynamoProvider} provider - The provider used to write records.
	 * @param {Boolean=} remove - If true, the items are deleted (instead of written) to the database.
	 * @param {Boolean=} explicit - If true, attribute derivation is skipped (only applies when remove is true).
	 */
	class DynamoStreamWriter extends Stream.Writable {
		constructor(table, provider, remove, explicit) {
			super({ objectMode: true, highWaterMark: 100 });

			assert.argumentIsRequired(table, 'table', Table, 'Table');
			assert.argumentIsRequired(provider, 'provider', DynamoProvider, 'DynamoProvider');
			assert.argumentIsOptional(remove, 'remove', Boolean);
			assert.argumentIsOptional(explicit, 'explicit', Boolean);

			this._table = table;
			this._provider = provider;

			let delegateFactory;

			if (is.boolean(remove) && remove) {
				delegateFactory = getDeleteDelegate;
			} else {
				delegateFactory = getCreateDelegate;
			}

			this._delegateFactory = delegateFactory;

			this._explicit = is.boolean(explicit) && explicit;
		}

		_write(chunk, encoding, callback) {
			let delegate = this._delegateFactory(chunk, this._explicit);

			delegate.call(this._provider, chunk, this._table)
				.then(() => {
					callback(null);
				}).catch((e) => {
					logger.error('Failed to write chunk', e);
					logger.error('Failed to write chunk', JSON.stringify((chunk || {}), null, 2));

					callback(e);
				});
		}

		toString() {
			return '[DynamoStreamWriter]';
		}
	}

	function getCreateDelegate(chunk, explicit) {
		if (is.array(chunk)) {
			return this._provider.createItems;
		} else {
			return this._provider.saveItem;
		}
	}

	function getDeleteDelegate(chunk, explicit) {
		if (is.array(chunk)) {
			return (items, table) => this._provider.deleteItems(items, table, explicit);
		} else {
			return (items, table) => this._provider.deleteItem(items, table, explicit);
		}
	}

	return DynamoStreamWriter;
})();