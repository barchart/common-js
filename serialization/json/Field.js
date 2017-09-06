module.exports = (() => {
	'use strict';

	/**
	 * A simple field.
	 *
	 * @public
	 * @param {String} name
	 * @param {DataType} dataType
	 * @param {Boolean} optional
	 */
	class Field {
		constructor(name, dataType, optional) {
			this._name = name;
			this._dataType = dataType;
			this._optional = optional || false;
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

		/**
		 * Indicates if the field can be omitted without violating the schema.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get optional() {
			return this._optional;
		}

		toString() {
			return `[Field (name=${this._name})]`;
		}
	}

	return Field;
})();