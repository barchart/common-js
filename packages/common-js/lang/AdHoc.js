import * as assert from './assert.js';

/**
 * A serialization container for ad hoc data where internal data is serialized
 * as an escaped JSON string.
 *
 * @public
 * @param {Object} data
 */
export default class AdHoc {
	constructor(data) {
		this._data = data || { };
	}

	/**
	 * The data.
	 * 
	 * @public
	 * @returns {Object}
	 */
	get data() {
		return this._data;
	}

	/**
	 * The data.
	 *
	 * @public
	 * @param {Object} data
	 */
	set data(data) {
		assert.argumentIsRequired(data, 'data', Object);
		
		this._data = data;
	}

	toJSON() {
		return JSON.stringify(this._data);
	}
	
	/**
	 * Converts a JSON-serialized object into an {@link AdHoc} instance.
	 *
	 * @public
	 * @static
	 * @param {String} serialized
	 * @returns {AdHoc}
	 */
	static parse(serialized) {
		return new AdHoc(JSON.parse(serialized));
	}

	toString() {
		return '[AdHoc]';
	}
}
