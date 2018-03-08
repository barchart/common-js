const assert = require('./assert'),
	is = require('./is');

module.exports = (() => {
	'use strict';

	/**
	 * A serialization container for ad hoc data where internal data is serialized
	 * as an escaped JSON string.
	 *
	 * @public
	 * @param {Object} data
	 */
	class AdHoc {
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
		 * Given a code, returns the enumeration item.
		 *
		 * @public
		 * @param {String} code
		 * @returns {AdHoc}
		 */
		static parse(serialized) {
			return new AdHoc(JSON.parse(serialized));
		}

		toString() {
			return '[AdHoc]';
		}
	}
	
	return AdHoc;
})();
