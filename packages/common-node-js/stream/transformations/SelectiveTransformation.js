import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';

import Transformation from './Transformation.js';

/**
 * A transformation that maintains an ordered list of {@link Transformations}.
 * Depending on the configuration, all transformations, which pass the
 * {@link Transformations#canTransform} test, will be executed; or, only
 * the first transformation to pass the {@link Transformations#canTransform}
 * test will be executed.
 *
 * @public
 * @extends {Transformation}
 */
export default class SelectiveTransformation extends Transformation {
	#first;
	#silent;
	#synchronous;
	#transformations;

	/**
	 * @param {*} transformations
	 * @param {*} first
	 * @param {*} silent
	 * @param {string} description
	 */
	constructor(transformations, first, silent, description) {
		super((description || 'Selector Transformation'));

		assert.argumentIsArray(transformations, 'transformations', Transformation, 'Transformation');
		assert.argumentIsOptional(first, 'first', Boolean);
		assert.argumentIsOptional(silent, 'silent', Boolean);

		this.#transformations = transformations;

		this.#first = is.boolean(first) && first;
		this.#silent = is.boolean(silent) && silent;

		this.#synchronous = this.#transformations.every(t => t.synchronous);
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
		return this.#silent || this.#transformations.some(t => t.canTransform(input));
	}

	_transform(input) {
		let output = input;

		if (this.#first) {
			const transformation = this.#transformations.find(t => t.canTransform(input));

			if (transformation) {
				output = transformation.transform(input);
			}
		} else {
			this.#transformations.filter(t => t.canTransform(input)).forEach((transformation) => {
				output = transformation.transform(output);
			});
		}

		return output;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[SelectiveTransformation]';
	}
}
