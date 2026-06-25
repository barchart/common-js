import * as assert from '@barchart/common-js/lang/assert.js';
import * as attributes from '@barchart/common-js/lang/attributes.js';

import Transformation from './Transformation.js';

/**
 * An abstract subclass of {@link Transformation} that expects the input
 * to be an object, then reads a single property and then writes a value
 * to the same (or another) property.
 *
 * @public
 * @interface
 * @extends {Transformation}
 */
export default class PropertyTransformation extends Transformation {
	#inputPropertyName;
	#outputPropertyName;

	/**
	 * @param {string} inputPropertyName - The name of the property to read from.
	 * @param {string=} outputPropertyName - The name of the property to write to. If omitted, the transformed value is written back to the input property.
	 * @param {string=} description - Describes the transformation, intended for logging purposes.
	 */
	constructor(inputPropertyName, outputPropertyName, description) {
		super(description || `Property Transformation (${inputPropertyName}${(outputPropertyName ? ' to ' + outputPropertyName : '')})`);

		assert.argumentIsRequired(inputPropertyName, 'inputPropertyName', String);
		assert.argumentIsOptional(outputPropertyName, 'outputPropertyName', String);
		assert.argumentIsOptional(description, 'description', String);

		this.#inputPropertyName = inputPropertyName;
		this.#outputPropertyName = outputPropertyName || inputPropertyName;
	}

	/**
	 * Indicates if the transform can be performed.
	 *
	 * @protected
	 * @param {*} input - The input.
	 * @returns {boolean}
	 */
	_canTransform(input) {
		return attributes.has(input, this.#inputPropertyName) && this._canTransformValue(attributes.read(input, this.#inputPropertyName));
	}

	/**
	 * Indicates if the transform value can be performed.
	 *
	 * @protected
	 * @param {*} value - The value.
	 * @returns {boolean}
	 */
	_canTransformValue(value) {
		return true;
	}

	/**
	 * Transforms the input.
	 *
	 * @protected
	 * @param {*} input - The input.
	 * @returns {*}
	 */
	_transform(input) {
		attributes.write(input, this.#outputPropertyName, this._transformValue(attributes.read(input, this.#inputPropertyName)));

		return input;
	}

	/**
	 * Transforms the input.
	 *
	 * @protected
	 * @param {*} value - The value.
	 * @returns {*}
	 */
	_transformValue(value) {
		return value;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[PropertyTransformation]';
	}
}
