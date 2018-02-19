const assert = require('./../../../lang/assert'),
	is = require('./../../../lang/is');

module.exports = (() => {
	'use strict';

	/**
	 * Encapsulates definition of a parameter -- that is, its name and
	 * its value. Parameters are used in request paths, querystrings, and
	 * as headers.
	 *
	 * @public
	 * @param {String=} key
	 * @param {Parameter~parameterValueCallback} value
	 * @param {Boolean=} optional
	 */
	class Parameter {
		constructor(key, extractor, optional) {
			this._key = key || null;
			this._extractor = extractor ||null;
			this._optional = is.boolean(optional) && optional;
		}

		/**
		 * The name of the parameter.
		 *
		 * @public
		 * @returns {String}
		 */
		get key() {
			return this._key;
		}

		/**
		 * A function for extracting the parameter's value.
		 *
		 * @public
		 * @returns {Parameter~parameterValueCallback}
		 */
		get extractor() {
			return this._extractor;
		}

		/**
		 * Indicates if the parameter is required.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get optional() {
			return this._optional;
		}

		/**
		 * Throws an {@link Error} if the instance is invalid.
		 *
		 * @public
		 */
		validate() {
			if (!is.string(this.key) || this.key.length === 0) {
				throw new Error('Parameter key must be a non-zero length string');
			}

			if (!is.fn(this._extractor)) {
				throw new Error('Parameter extractor must be a function.');
			}
		}

		toString() {
			return `[Parameter]`;
		}
	}

	/**
	 * A function that, when passed the request's payload, returns a parameter's value.
	 *
	 * @callback Parameter~parameterValueCallback
	 * @param {Object} payload
	 * @returns {Promise.<String>}
	 */

	return Parameter;
})();