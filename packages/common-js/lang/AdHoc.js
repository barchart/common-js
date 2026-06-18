import * as assert from './assert.js';

/**
 * A serialization container for ad hoc data where internal data is serialized
 * as an escaped JSON string.
 *
 * @public
 */
export default class AdHoc {
	#data;

	/**
	 * @param {object} data
	 */
	constructor(data) {
		this.#data = data || { };
	}

	/**
	 * The data.
	 * 
	 * @public
	 * @returns {object}
	 */
	get data() {
		return this.#data;
	}

	/**
	 * The data.
	 *
	 * @public
	 * @param {object} data
	 */
	set data(data) {
		assert.argumentIsRequired(data, 'data', Object);
		
		this.#data = data;
	}

	/**
	 * Returns the JSON representation.
	 *
	 * @public
	 * @returns {*}
	 */
	toJSON() {
		return JSON.stringify(this.#data);
	}
	
	/**
	 * Converts a JSON-serialized object into an {@link AdHoc} instance.
	 *
	 * @public
	 * @static
	 * @param {string} serialized
	 * @returns {AdHoc}
	 */
	static parse(serialized) {
		return new AdHoc(JSON.parse(serialized));
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[AdHoc]';
	}
}
