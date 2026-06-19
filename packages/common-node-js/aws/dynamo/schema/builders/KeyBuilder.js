import * as assert from '@barchart/common-js/lang/assert.js';

import Key from './../definitions/Key.js';
import KeyType from './../definitions/KeyType.js';

/**
 * @typedef {import('./TableBuilder.js').default} TableBuilder
 */

/**
 * Fluent interface for building a {@link Key}.
 *
 * @public
 */
export default class KeyBuilder {
	#key;

	/**
	 * @param {string} name
	 * @param {TableBuilder} parent
	 */
	constructor(name, parent) {
		assert.argumentIsRequired(name, 'name', String);

		this.#key = new Key(getAttribute(name, parent), null);
	}

	/**
	 * The {@link Key}, given all the information provided thus far.
	 *
	 * @public
	 * @returns {Key}
	 */
	get key() {
		return this.#key;
	}

	/**
	 * Sets the {@link KeyType} and returns the current instance.
	 *
	 * @public
	 * @param {KeyType} keyType
	 * @returns {KeyBuilder}
	 */
	withKeyType(keyType) {
		assert.argumentIsRequired(keyType, 'keyType', KeyType, 'KeyType');

		this.#key = new Key(this.#key.attribute, keyType);

		return this;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[KeyBuilder]';
	}
}

function getAttribute(name, parent) {
	return parent.table.attributes.find(a => a.name === name) || null;
}
