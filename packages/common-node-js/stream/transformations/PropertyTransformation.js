const assert = require('@barchart/common-js/lang/assert'),
	attributes = require('@barchart/common-js/lang/attributes');

const Transformation = require('./Transformation');

module.exports = (() => {
	'use strict';

	/**
	 * An abstract subclass of {@link Transformation} that expects the input
	 * to be an object, then reads a single property and then writes a value
	 * to the same (or another) property.
	 *
	 * @public
	 * @interface
	 * @extends {Transformation}
	 * @param {String} inputPropertyName - The name of the property to read from.
	 * @param {String=} outputPropertyName - The name of the property to write to. If omitted, the transformed value is written back to the input property.
	 * @param {String=} description - Describes the transformation, intended for logging purposes.
	 */
	class PropertyTransformation extends Transformation {
		constructor(inputPropertyName, outputPropertyName, description) {
			super(description || `Property Transformation (${inputPropertyName}${(outputPropertyName ? ' to ' + outputPropertyName : '')})`);

			assert.argumentIsRequired(inputPropertyName, 'inputPropertyName', String);
			assert.argumentIsOptional(outputPropertyName, 'outputPropertyName', String);
			assert.argumentIsOptional(description, 'description', String);

			this._inputPropertyName = inputPropertyName;
			this._outputPropertyName = outputPropertyName || inputPropertyName;
		}

		_canTransform(input) {
			return attributes.has(input, this._inputPropertyName) && this._canTransformValue(attributes.read(input, this._inputPropertyName));
		}

		_canTransformValue(value) {
			return true;
		}

		_transform(input) {
			attributes.write(input, this._outputPropertyName, this._transformValue(attributes.read(input, this._inputPropertyName)));

			return input;
		}

		_transformValue(value) {
			return value;
		}

		toString() {
			return '[PropertyTransformation]';
		}
	}

	return PropertyTransformation;
})();
