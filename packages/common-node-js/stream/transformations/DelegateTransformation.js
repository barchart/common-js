import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';

import Transformation from './Transformation.js';

/**
 * Defers all transformation work to a delegate.
 *
 * @public
 * @extends {Transformation}
 */
export default class DelegateTransformation extends Transformation {
	#canTransformDelegate;
	#synchronous;
	#transformDelegate;

	/**
	 * @param {Function} transformDelegate - Accepts the input and returns the transformed value.
	 * @param {Function=} canTransformDelegate - Accepts the input and indicates if the transform delegate will succeed, passed the same input.
	 * @param {boolean=} asynchronous - True, if the delegate might run asynchronously.
	 * @param {string=} description - Describes the transformation, intended for logging purposes.
	 */
	constructor(transformDelegate, canTransformDelegate, asynchronous, description) {
		super((description || 'Delegated Transformation'));

		assert.argumentIsRequired(transformDelegate, 'transformDelegate', Function);
		assert.argumentIsOptional(canTransformDelegate, 'canTransformDelegate', Function);
		assert.argumentIsOptional(asynchronous, 'asynchronous', Boolean);

		this.#transformDelegate = transformDelegate;
		this.#canTransformDelegate = canTransformDelegate || (input => true);

		this.#synchronous = !(is.boolean(asynchronous) && asynchronous);
	}

	/**
	 * Returns the synchronous.
	 *
	 * @public
	 * @returns {boolean}
	 */
	get synchronous() {
		return this.#synchronous;
	}

	_canTransform(input) {
		return this.#canTransformDelegate(input);
	}

	_transform(input) {
		return this.#transformDelegate(input);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[DelegateTransformation]';
	}
}
