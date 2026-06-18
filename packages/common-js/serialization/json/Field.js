import * as assert from './../../lang/assert.js';
import * as is from './../../lang/is.js';

import DataType from './DataType.js';

/**
 * A simple field.
 *
 * @public
 */
export default class Field {
	#name;
	#dataType;
	#optional;
	#array;

	/**
	 * @param {string} name
	 * @param {DataType} dataType
	 * @param {boolean=} optional
	 * @param {boolean=} array
	 */
	constructor(name, dataType, optional, array) {
		assert.argumentIsRequired(name, 'name', String);
		assert.argumentIsRequired(dataType, 'dataType', DataType, 'DataType');
		assert.argumentIsOptional(optional, 'optional', Boolean);
		assert.argumentIsOptional(array, 'array', Boolean);

		this.#name = name;
		this.#dataType = dataType;
		this.#optional = is.boolean(optional) && optional;
		this.#array = is.boolean(array) && array;
	}

	/**
	 * Name of the field.
	 *
	 * @public
	 * @returns {string}
	 */
	get name() {
		return this.#name;
	}

	/**
	 * Type of the field.
	 *
	 * @public
	 * @returns {DataType}
	 */
	get dataType() {
		return this.#dataType;
	}

	/**
	 * Indicates if the field can be omitted without violating the schema.
	 *
	 * @public
	 * @returns {boolean}
	 */
	get optional() {
		return this.#optional;
	}

	/**
	 * Indicates if the field is an array.
	 *
	 * @public
	 * @returns {boolean}
	 */
	get array() {
		return this.#array;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[Field (name=${this.#name})]`;
	}
}
