const assert = require('@barchart/common-js/lang/assert'),
	attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const Transformation = require('./Transformation');

module.exports = (() => {
	'use strict';

	/**
	 * A {@link Transformation} that outputs a new object, selecting specific
	 * properties from the input object.
	 *
	 * @public
	 * @param {Array<String>} inputPropertyNames - The property names to select from input object.
	 * @param {Array<String>=} outputPropertyNames - The property names write to the output object. If omitted, the "input" property names are used.
	 * @extends {Transformation}
	 */
	class SelectTransformation extends Transformation {
		constructor(inputPropertyNames, outputPropertyNames, description) {
			super((description || 'Selection Transformation'));

			assert.argumentIsArray(inputPropertyNames, 'inputPropertyNames', String);

			if (outputPropertyNames) {
				assert.argumentIsArray(outputPropertyNames, 'outputPropertyNames', String);
				assert.argumentIsValid(outputPropertyNames, 'outputPropertyNames', x => outputPropertyNames.length === inputPropertyNames.length, 'input and output sizes must match');
			}

			this._inputPropertyNames = inputPropertyNames;
			this._outputPropertyNames = outputPropertyNames || inputPropertyNames;
		}

		_canTransform(input) {
			return is.object(input);
		}

		_transform(input) {
			return this._inputPropertyNames.reduce((output, inputPropertyName, i) => {
				if (attributes.has(input, inputPropertyName)) {
					attributes.write(output, this._outputPropertyNames[i], attributes.read(input, inputPropertyName));
				}

				return output;
			}, { });
		}

		toString() {
			return '[SelectTransformation]';
		}
	}

	return SelectTransformation;
})();
