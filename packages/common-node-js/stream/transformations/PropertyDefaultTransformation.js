import * as is from '@barchart/common-js/lang/is.js';

import PropertyTransformation from './PropertyTransformation.js';

/**
 * If a property doesn't exist or has an undefined value, the property
 * will be assigned a default value; otherwise, it will be left unchanged.
 *
 * @public
 * @extends {PropertyTransformation}
 * @param {String} propertyName - The name of the property to read inspect and set to a default value.
 * @param {*} defaultValue - The value to assign to a missing or undefined property.
 * @param {String=} description - Describes the transformation, intended for logging purposes.
 */
export default class PropertyDefaultTransformation extends PropertyTransformation {
	constructor(defaultValue, propertyName, description) {
		super(propertyName, propertyName, (description || `Property Transformation (${propertyName})`));

		this._defaultValue = defaultValue;
	}

	_canTransform(input) {
		return true;
	}

	_transformValue(value) {
		if (is.undefined(value)) {
			return this._defaultValue;
		} else {
			return value;
		}
	}

	toString() {
		return '[PropertyDefaultTransformation]';
	}
}
