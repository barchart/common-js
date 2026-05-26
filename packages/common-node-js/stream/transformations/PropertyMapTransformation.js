const assert = require('@barchart/common-js/lang/assert');

const PropertyTransformation = require('./PropertyTransformation');

module.exports = (() => {
	'use strict';

	/**
	 * Reads a property value, does a key lookup in a map, and writes
	 * the key's value to a property.
	 *
	 * @public
	 * @extends {PropertyTransformation}
	 * @param {String} inputPropertyName - The name of the property to read from.
	 * @param {Map} map - The map of translations.
	 * @param {String=} outputPropertyName - The name of the property to write to.
	 * @param {String=} description - Describes the transformation, intended for logging purposes.
	 */
	class PropertyMapTransformation extends PropertyTransformation {
		constructor(inputPropertyName, map, outputPropertyName, description) {
			super(inputPropertyName, outputPropertyName, (description || `Property Map Transformation (${inputPropertyName}${(outputPropertyName ? ' to ' + outputPropertyName : '')})`));

			assert.argumentIsRequired(map, 'map', Map, 'Map');

			this._map = map;
		}

		_canTransformValue(value) {
			return this._map.has(value);
		}

		_transformValue(value) {
			return this._map.get(value);
		}

		toString() {
			return '[PropertyMapTransformation]';
		}
	}

	return PropertyMapTransformation;
})();
