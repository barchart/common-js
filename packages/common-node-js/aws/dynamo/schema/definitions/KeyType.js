import Enum from '@barchart/common-js/lang/Enum.js';

/**
 * Defines a category of {@link Key}. Currently, there are two types;
 * a "hash" key and a "range" key.
 *
 * @public
 * @extends {Enum}
 * @param {String} code
 * @param {String} description
 */
export default class KeyType extends Enum {
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

	toString() {
		return `[KeyType (code=${this.code}, description=${this.description})]`;
	}
}

const keyTypeHash = new KeyType('HASH', 'Hash');
const keyTypeRange = new KeyType('RANGE', 'Range');
