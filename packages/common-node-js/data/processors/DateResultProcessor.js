const log4js = require('log4js'),
	moment = require('moment');

const attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const ResultProcessor = require('./../ResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/DateResultProcessor');

	/**
	 * Constructs a date from context.
	 *
	 * @public
	 * @extends ResultProcessor
	 * @param {object} configuration
	 * @param {number=} configuration.year
	 * @param {string=} configuration.yearRef
	 * @param {number} configuration.month
	 * @param {string} configuration.monthRef
	 * @param {number=} configuration.day
	 * @param {string=} configuration.dayRef
	 * @param {string=} configuration.start
	 * @param {string=} configuration.end
	 */
	class DateResultProcessor extends ResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_process(results) {
			const configuration = this._getConfiguration();

			let year;

			if (is.number(configuration.year)) {
				year = configuration.year;
			} else if (is.string(configuration.yearRef)) {
				year = attributes.read(results, configuration.yearRef);
			} else {
				year = null;
			}

			let month;

			if (is.number(configuration.month)) {
				month = configuration.month;
			} else if (is.string(configuration.monthRef)) {
				month = attributes.read(results, configuration.monthRef);
			} else {
				month = null;
			}

			let day;

			if (is.number(configuration.day)) {
				day = configuration.day;
			} else if (is.string(configuration.dayRef)) {
				day = attributes.read(results, configuration.dayRef);
			} else {
				day = null;
			}

			let m = moment().startOf('day');

			if (is.number(year)) {
				m = m.year(year);
			}

			if (is.number(month)) {
				m = m.month(month);
			}

			if (is.number(day)) {
				m = m.date(day);
			}

			const start = configuration.start;
			const end = configuration.end;

			if (is.string(start)) {
				m = m.startOf(start);
			} else if (is.string(end)) {
				m = m.endOf(end);
			}

			return m.toDate();
		}

		toString() {
			return '[DateResultProcessor]';
		}
	}

	return DateResultProcessor;
})();