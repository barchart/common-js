const log4js = require('log4js'),
	moment = require('moment');

const attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const ResultProcessor = require('./../ResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/DateParseResultProcessor');

	/**
	 * Constructs a date instance from a string.
	 *
	 * @public
	 * @extends ResultProcessor
	 * @param {object} configuration
	 * @param {number=} configuration.dateRef
	 */
	class DateParseResultProcessor extends ResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_process(results) {
			const configuration = this._getConfiguration();

			let returnRef;

			if (is.string(configuration.dateRef)) {
				const m = moment(attributes.read(results, configuration.dateRef));

				returnRef = m.toDate();
			} else {
				returnRef = null;
			}

			return returnRef;
		}

		toString() {
			return '[DateParseResultProcessor]';
		}
	}

	return DateParseResultProcessor;
})();