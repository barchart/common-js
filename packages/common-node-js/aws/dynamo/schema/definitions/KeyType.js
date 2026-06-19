import Enum from '@barchart/common-js/lang/Enum.js';

/**
 * Defines a category of {@link Key}. Currently, there are two types;
 * a "hash" key and a "range" key.
 *
 * @public
 * @extends {Enum}
 */
export default class KeyType extends Enum {
	/**
	 * @param {string} code
	 * @param {string} description
	 */
	constructor(code, description) {
		super(code, description);
	}

	/**
	 * A hash key.
	 *
	 * @returns {KeyType}
	 */
	static get HASH() {
		return keyTypeHash;
	}

	/**
	 * A range key.
	 *
	 * @returns {KeyType}
	 */
	static get RANGE() {
		return keyTypeRange;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[KeyType (code=${this.code}, description=${this.description})]`;
	}
}

const keyTypeHash = new KeyType('HASH', 'Hash');
const keyTypeRange = new KeyType('RANGE', 'Range');
