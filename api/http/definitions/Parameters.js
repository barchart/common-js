const assert = require('./../../../lang/assert'),
	is = require('./../../../lang/is');

const Parameter = require('./Parameter');

module.exports = (() => {
	'use strict';

	/**
	 * An ordered collection of {@link Parameter} items.
	 *
	 * @public
	 * @param {Parameter[]|undefined} parameters
	 */
	class Parameters {
		constructor(parameters) {
			this._parameters = parameters || [ ];
		}

		/**
		 * The list of {@link Parameter} items.
		 *
		 * @public
		 * @returns {Parameter[]}
		 */
		get parameters() {
			return this._parameters;
		}

		/**
		 * Throws an {@link Error} if the instance is invalid.
		 *
		 * @public
		 */
		validate() {
			if (!is.array(this._parameters)) {
				throw new Error('Parameters must be an array.');
			}

			if (this._parameters.some(p => !(p instanceof Parameter))) {
				throw new Error('All parameter items must be instances of Parameters.');
			}

			this._parameters.forEach(p => p.validate());
		}

		toString() {
			return `[Parameters]`;
		}
	}

	return Parameters;
})();