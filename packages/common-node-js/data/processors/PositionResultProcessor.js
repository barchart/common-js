const log4js = require('log4js');

const attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const ResultProcessor = require('./../ResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/PositionResultProcessor');

	/**
	 * For an array, creates a new property on each of the array's items;
	 * assigning the index of the item's position within the array.
	 *
	 * @public
	 * @extends ResultProcessor
	 * @extends ResultProcessor
	 * @param {Object} configuration
	 * @param {string=} configuration.propertyName - The name of the property to create on each item.
	 */
	class PositionResultProcessor extends ResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_process(results) {
			const configuration = this._getConfiguration();
			const propertyName = configuration.propertyName;

			let returnRef;

			if (is.array(results) && is.string(propertyName)) {
				returnRef = results.map((item, index) => {
					attributes.write(item, propertyName, index);

					return item;
				});
			} else {
				returnRef = null;
			}

			return returnRef;
		}

		toString() {
			return '[PositionResultProcessor]';
		}
	}

	return PositionResultProcessor;
})();