import * as is from '@barchart/common-js/lang/is.js';

import PropertyTransformation from './PropertyTransformation.js';

/**
 * If a property doesn't exist or has an undefined value, the property
 * will be assigned a default value; otherwise, it will be left unchanged.
 *
 * @public
 * @extends {PropertyTransformation}
 */
export default class PropertyDefaultTransformation extends PropertyTransformation {
	#defaultValue;

	/**
	 * @param {string} propertyName - The name of the property to read inspect and set to a default value.
	 * @param {*} defaultValue - The value to assign to a missing or undefined property.
	 * @param {string=} description - Describes the transformation, intended for logging purposes.
	 */
	constructor(defaultValue, propertyName, description) {
		super(propertyName, propertyName, (description || `Property Transformation (${propertyName})`));

		this.#defaultValue = defaultValue;
	}

	_canTransform(input) {
		return true;
	}

	_transformValue(value) {
		if (is.undef(value)) {
			return this.#defaultValue;
		} else {
			return value;
		}
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[PropertyDefaultTransformation]';
	}
}
