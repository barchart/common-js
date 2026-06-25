import * as assert from '@barchart/common-js/lang/assert.js';
import * as attributes from '@barchart/common-js/lang/attributes.js';
import * as is from '@barchart/common-js/lang/is.js';

import Transformation from './Transformation.js';

/**
 * A {@link Transformation} that outputs a new object, selecting specific
 * properties from the input object.
 *
 * @public
 * @extends {Transformation}
 */
export default class SelectTransformation extends Transformation {
	#inputPropertyNames;
	#outputPropertyNames;

	/**
     * @param {Array<string>} inputPropertyNames - The property names to select from input object.
     * @param {Array<string>} outputPropertyNames - The property names write to the output object. If omitted, the "input" property names are used.
     * @param {string} description - The description
     */
	constructor(inputPropertyNames, outputPropertyNames, description) {
		super((description || 'Selection Transformation'));

		assert.argumentIsArray(inputPropertyNames, 'inputPropertyNames', String);

		if (outputPropertyNames) {
			assert.argumentIsArray(outputPropertyNames, 'outputPropertyNames', String);
			assert.argumentIsValid(outputPropertyNames, 'outputPropertyNames', x => outputPropertyNames.length === inputPropertyNames.length, 'input and output sizes must match');
		}

		this.#inputPropertyNames = inputPropertyNames;
		this.#outputPropertyNames = outputPropertyNames || inputPropertyNames;
	}

	/**
	 * Indicates if the transform can be performed.
	 *
	 * @protected
	 * @param {*} input - The input.
	 * @returns {boolean}
	 */
	_canTransform(input) {
		return is.object(input);
	}

	/**
	 * Transforms the input.
	 *
	 * @protected
	 * @param {*} input - The input.
	 * @returns {*}
	 */
	_transform(input) {
		return this.#inputPropertyNames.reduce((output, inputPropertyName, i) => {
			if (attributes.has(input, inputPropertyName)) {
				attributes.write(output, this.#outputPropertyNames[i], attributes.read(input, inputPropertyName));
			}

			return output;
		}, { });
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[SelectTransformation]';
	}
}
