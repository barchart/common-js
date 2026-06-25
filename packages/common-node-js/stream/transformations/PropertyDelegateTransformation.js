import PropertyTransformation from './PropertyTransformation.js';
import DelegateTransformation from './DelegateTransformation.js';

/**
 * Reads a property value, passes that value to a delegate, and writes
 * the output of the delegate to the same (or another) property.
 *
 * @public
 * @extends {PropertyTransformation}
 */
export default class PropertyDelegateTransformation extends PropertyTransformation {
	#delegateTransformation;

	/**
	 * @param {string} inputPropertyName - The name of the property to read from.
	 * @param {Function} transformDelegate - Accepts the input property value and returns the transformed value.
	 * @param {string=} outputPropertyName - The name of the property to write to.
	 * @param {Function=} canTransformDelegate - Accepts the input property value and indicates if the transform delegate will succeed, passed the same value.
	 * @param {boolean=} asynchronous - True, if the delegate might run asynchronously.
	 * @param {string=} description - Describes the transformation, intended for logging purposes.
	 */
	constructor(inputPropertyName, transformDelegate, outputPropertyName, canTransformDelegate, asynchronous, description) {
		super(inputPropertyName, outputPropertyName, (description || `Delegated Property Transformation (${inputPropertyName}${(outputPropertyName ? ' to ' + outputPropertyName : '')})`));

		this.#delegateTransformation = new DelegateTransformation(transformDelegate, canTransformDelegate, asynchronous);
	}

	/**
	 * Returns the synchronous.
	 *
	 * @public
	 * @returns {boolean}
	 */
	get synchronous() {
		return this.#delegateTransformation.synchronous;
	}

	/**
	 * Indicates if the transform value can be performed.
	 *
	 * @protected
	 * @param {*} value - The value.
	 * @returns {boolean}
	 */
	_canTransformValue(value) {
		return this.#delegateTransformation.canTransform(value);
	}

	/**
	 * Transforms the input.
	 *
	 * @protected
	 * @param {*} value - The value.
	 * @returns {*}
	 */
	_transformValue(value) {
		return this.#delegateTransformation.transform(value);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[PropertyDelegateTransformation]';
	}
}
