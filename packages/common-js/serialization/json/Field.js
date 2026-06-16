import * as assert from './../../lang/assert.js';
import * as is from './../../lang/is.js';

import DataType from './DataType.js';

/**
 * A simple field.
 *
 * @public
 * @param {String} name
 * @param {DataType} dataType
 * @param {Boolean=} optional
 * @param {Boolean=} array
 */
export default class Field {
	constructor(name, dataType, optional, array) {
		assert.argumentIsRequired(name, 'name', String);
		assert.argumentIsRequired(dataType, 'dataType', DataType, 'DataType');
		assert.argumentIsOptional(optional, 'optional', Boolean);
		assert.argumentIsOptional(array, 'array', Boolean);

		this._name = name;
		this._dataType = dataType;
		this._optional = is.boolean(optional) && optional;
		this._array = is.boolean(array) && array;
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

	/**
	 * Indicates if the field is an array.
	 *
	 * @public
	 * @returns {Boolean}
	 */
	get array() {
		return this._array;
	}

	toString() {
		return `[Field (name=${this._name})]`;
	}
}
