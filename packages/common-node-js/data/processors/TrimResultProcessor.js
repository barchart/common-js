const log4js = require('log4js');

const MutateStringResultProcessor = require('./MutateStringResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/TrimResultProcessor');

	/**
	 * Trims a string (or an array of strings). If the value (or array item) is
	 * not a string, the value is ignored.
	 *
	 * @public
	 * @extends MutateResultProcessor
	 * @param {object} configuration
	 * @param {string} configuration.propertyName - The property to trim.
	 */
	class TrimResultProcessor extends MutateStringResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_processString(value) {
			return value.trim();
		}

		toString() {
			return '[TrimResultProcessor]';
		}
	}

	return TrimResultProcessor;
})();