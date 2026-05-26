const log4js = require('log4js');

const attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const ResultProcessor = require('./../ResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/WrapResultProcessor');

	/**
	 * Wraps the context within an object. Optionally, if the context is an
	 * array, wraps each item in an object and returns the array of wrapped
	 * objects.
	 *
	 * @public
	 * @extends ResultProcessor
	 * @param {object} configuration
	 * @param {string} configuration.propertyName - The name of the single property inside the wrapped object.
	 * @param {boolean=} configuration.wrapArray - If true, and the context is an array, returns an array of wrapped object (instead of a single object).
	 */
	class WrapResultProcessor extends ResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_process(results) {
			const configuration = this._getConfiguration();

			const propertyName = configuration.propertyName;
			const wrapArray = is.boolean(configuration.wrapArray) && configuration.wrapArray;

			let returnRef;

			if (!is.string(propertyName) || propertyName.length === 0) {
				returnRef = results;
			} else if (wrapArray) {
				if (is.array(results)) {
					returnRef = results.map((item) => {
						return wrap(propertyName, item);
					});
				} else {
					returnRef = [ ];
				}
			} else {
				returnRef = wrap(propertyName, results);
			}

			return returnRef;
		}

		toString() {
			return '[WrapResultProcessor]';
		}
	}

	function wrap(propertyName, item) {
		const returnRef = { };

		attributes.write(returnRef, propertyName, item);

		return returnRef;
	}

	return WrapResultProcessor;
})();