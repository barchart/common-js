import * as is from './../../../lang/is.js';

import Parameter from './Parameter.js';

/**
 * An ordered collection of {@link Parameter} items.
 *
 * @public
 */
export default class Parameters {
	#parameters;

	/**
	 * @param {Parameter[]=} parameters
	 */
	constructor(parameters) {
		this.#parameters = parameters || [ ];
	}

	/**
	 * The list of {@link Parameter} items.
	 *
	 * @public
	 * @returns {Parameter[]}
	 */
	get parameters() {
		return this.#parameters;
	}

	/**
	 * Throws an {@link Error} if the instance is invalid.
	 *
	 * @public
	 */
	validate() {
		if (!is.array(this.#parameters)) {
			throw new Error('Parameters must be an array.');
		}

		if (this.#parameters.some(p => !(p instanceof Parameter))) {
			throw new Error('All parameter items must be instances of Parameters.');
		}

		this.#parameters.forEach(p => p.validate());
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[Parameters]`;
	}

	/**
	 * Merges two {@link Parameters} collections.
	 *
	 * @public
	 * @static
	 * @param {Parameters} a
	 * @param {Parameters} b
	 * @returns {Parameters}
	 */
	static merge(a, b) {
		return new Parameters(a.parameters.slice(0).concat(b.parameters.filter(candidate => !a.parameters.some(existing => existing.key === candidate.key))));
	}
}
