import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';

import DynamoProvider from './../../DynamoProvider.js';
import Table from './../schema/definitions/Table.js';

import log4js from 'log4js';
import Stream from 'stream';

const logger = log4js.getLogger('common-node/aws/dynamo/stream/DynamoStreamWriter');

/**
 * A Node.js {@link Stream.Writable} which creates or deletes DynamoDB records.
 *
 * @public
 * @extends {Stream.Writable}
 */
export default class DynamoStreamWriter extends Stream.Writable {
	#delegateFactory;
	#explicit;
	#provider;
	#table;

	/**
	 * @param {Table} table - The table schema which items must conform to.
	 * @param {DynamoProvider} provider - The provider used to write records.
	 * @param {boolean=} remove - If true, the items are deleted (instead of written) to the database.
	 * @param {boolean=} explicit - If true, attribute derivation is skipped (only applies when remove is true).
	 */
	constructor(table, provider, remove, explicit) {
		super({ objectMode: true, highWaterMark: 100 });

		assert.argumentIsRequired(table, 'table', Table, 'Table');
		assert.argumentIsRequired(provider, 'provider', DynamoProvider, 'DynamoProvider');
		assert.argumentIsOptional(remove, 'remove', Boolean);
		assert.argumentIsOptional(explicit, 'explicit', Boolean);

		this.#table = table;
		this.#provider = provider;

		let delegateFactory;

		if (is.boolean(remove) && remove) {
			delegateFactory = this.#getDeleteDelegate.bind(this);
		} else {
			delegateFactory = this.#getCreateDelegate.bind(this);
		}

		this.#delegateFactory = delegateFactory;

		this.#explicit = is.boolean(explicit) && explicit;
	}

	_write(chunk, encoding, callback) {
		let delegate = this.#delegateFactory(chunk, this.#explicit);

		(async () => {
			try {
				await delegate.call(this.#provider, chunk, this.#table);

				callback(null);
			} catch (e) {
				logger.error('Failed to write chunk', e);
				logger.error('Failed to write chunk', JSON.stringify((chunk || {}), null, 2));

				callback(e);
			}
		})();
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[DynamoStreamWriter]';
	}


	#getCreateDelegate(chunk) {
		if (is.array(chunk)) {
			return this.#provider.createItems;
			} else {
				return this.#provider.saveItem;
			}
		}

	#getDeleteDelegate(chunk, explicit) {
		if (is.array(chunk)) {
			return (items, table) => this.#provider.deleteItems(items, table, explicit);
			} else {
				return (items, table) => this.#provider.deleteItem(items, table, explicit);
			}
		}
}
