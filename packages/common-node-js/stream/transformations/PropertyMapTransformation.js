import * as assert from '@barchart/common-js/lang/assert.js';

import PropertyTransformation from './PropertyTransformation.js';

/**
 * Reads a property value, does a key lookup in a map, and writes
 * the key's value to a property.
 *
 * @public
 * @extends {PropertyTransformation}
 */
export default class PropertyMapTransformation extends PropertyTransformation {
	#map;

	/**
	 * @param {string} inputPropertyName - The name of the property to read from.
	 * @param {Map} map - The map of translations.
	 * @param {string=} outputPropertyName - The name of the property to write to.
	 * @param {string=} description - Describes the transformation, intended for logging purposes.
	 */
	constructor(inputPropertyName, map, outputPropertyName, description) {
		super(inputPropertyName, outputPropertyName, (description || `Property Map Transformation (${inputPropertyName}${(outputPropertyName ? ' to ' + outputPropertyName : '')})`));

		assert.argumentIsRequired(map, 'map', Map, 'Map');

		this.#map = map;
	}

	/**
	 * Indicates if the transform value can be performed.
	 *
	 * @protected
	 * @param {*} value - The value.
	 * @returns {boolean}
	 */
	_canTransformValue(value) {
		return this.#map.has(value);
	}

	/**
	 * Transforms the input.
	 *
	 * @protected
	 * @param {*} value - The value.
	 * @returns {*}
	 */
	_transformValue(value) {
		return this.#map.get(value);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[PropertyMapTransformation]';
	}
}
