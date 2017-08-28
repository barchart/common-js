const DataType = require('./DataType');

module.exports = (() => {
	'use strict';

	/**
	 * A simple field.
	 *
	 * @public
	 * @param {String} name
	 * @param {DataType} dataType
	 */
	class Field {
		constructor(name, dataType) {
			this._name = name;
			this._dataType = dataType;
		}

		/**
		 * Name of the field.
		 *
		 * @public
		 * @returns {String}
		 */
		get name() {
			return this._name;
		}

		/**
		 * Type of the field.
		 *
		 * @public
		 * @returns {DataType}
		 */
		get dataType() {
			return this._dataType;
		}

		toString() {
			return `[Field (name=${this._name})]`;
		}
	}

	return Field;
})();