const PropertyTransformation = require('./PropertyTransformation'),
	DelegateTransformation = require('./DelegateTransformation');

module.exports = (() => {
	'use strict';

	/**
	 * Reads a property value, passes that value to a delegate, and writes
	 * the output of the delegate to the same (or another) property.
	 *
	 * @public
	 * @extends {PropertyTransformation}
	 * @param {String} inputPropertyName - The name of the property to read from.
	 * @param {Function} transformDelegate - Accepts the input property value and returns the transformed value.
	 * @param {String=} outputPropertyName - The name of the property to write to.
	 * @param {Function=} canTransformDelegate - Accepts the input property value and indicates if the transform delegate will succeed, passed the same value.
	 * @param {Boolean=} asynchronous - True, if the delegate might run asynchronously.
	 * @param {String=} description - Describes the transformation, intended for logging purposes.
	 */
	class PropertyDelegateTransformation extends PropertyTransformation {
		constructor(inputPropertyName, transformDelegate, outputPropertyName, canTransformDelegate, asynchronous, description) {
			super(inputPropertyName, outputPropertyName, (description || `Delegated Property Transformation (${inputPropertyName}${(outputPropertyName ? ' to ' + outputPropertyName : '')})`));

			this._delegateTransformation = new DelegateTransformation(transformDelegate, canTransformDelegate, asynchronous);
		}

		get synchronous() {
			return this._delegateTransformation.synchronous;
		}

		_canTransformValue(value) {
			return this._delegateTransformation.canTransform(value);
		}

		_transformValue(value) {
			return this._delegateTransformation.transform(value);
		}

		toString() {
			return '[PropertyDelegateTransformation]';
		}
	}

	return PropertyDelegateTransformation;
})();
