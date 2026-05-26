const log4js = require('log4js');

const attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const ResultProcessor = require('./../ResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/FindResultProcessor');

	/**
	 * Finds a single item in an array, selecting the first item with a property
	 * value that matches a configured value.
	 *
	 * @public
	 * @extends ResultProcessor
	 * @param {object} configuration
	 * @param {string} configuration.propertyName - If the array contains objects, this is the name of the property to match.
	 * @param {object} configuration.matchValue - The value to match.
	 */
	class FindResultProcessor extends ResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_process(results) {
			const configuration = this._getConfiguration();

			const propertyName = configuration.propertyName;
			const matchValue = configuration.matchValue;

			let returnRef;

			if (is.array(results) && results.length > 0 && is.string(propertyName)) {
				returnRef = results.find(candidate => attributes.read(candidate, propertyName) === matchValue);
			} else {
				returnRef = undefined;
			}

			return returnRef;
		}

		toString() {
			return '[FindResultProcessor]';
		}
	}

	return FindResultProcessor;
})();