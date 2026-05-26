const log4js = require('log4js');

const attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const ResultProcessor = require('./../ResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/IndexResultProcessor');

	/**
	 * Converts an array to an object, assuming each item in the array has
	 * a property with a unique value.
	 *
	 * @public
	 * @extends ResultProcessor
	 * @param {object} configuration
	 * @param {string} configuration.keyPropertyName - The name of the unique property of an item.
	 */
	class IndexResultProcessor extends ResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_process(results) {
			let returnRef = null;

			const configuration = this._getConfiguration();

			const keyPropertyName = configuration.keyPropertyName;

			if (is.array(results) && is.string(keyPropertyName)) {
				returnRef = results.reduce((object, item) => {
					const key = attributes.read(item, keyPropertyName);

					if (is.string(key)) {
						attributes.write(object, key, item);
					}

					return object;
				}, { });
			} else {
				returnRef = null;
			}

			return returnRef;
		}

		toString() {
			return '[IndexResultProcessor]';
		}
	}

	return IndexResultProcessor;
})();