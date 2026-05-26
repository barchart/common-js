const log4js = require('log4js'),
	moment = require('moment');

const is = require('@barchart/common-js/lang/is');

const QueryProvider = require('./../QueryProvider');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/providers/TimestampQueryProvider');

	class TimestampQueryProvider extends QueryProvider {
		constructor(configuration) {
			super(configuration);
		}

		_runQuery(criteria) {
			let m = moment();

			const configuration = this._getConfiguration();

			if (is.object(configuration.add)) {
				m = m.add(configuration.add);
			}

			if (is.object(configuration.subtract)) {
				m = m.subtract(configuration.subtract);
			}

			return {
				moment: m,
				date: m.toDate(),
				day: m.date(),
				dayNumber: m.format('D'),
				dayShort: m.format('Do'),
				dayName: m.format('dddd'),
				month: m.month(),
				monthNumber: m.format('M'),
				monthShort: m.format('MMM'),
				monthName: m.format('MMMM'),
				year: m.year(),
				hour: m.hour(),
				minute: m.minute(),
				second: m.second(),
				timezone: 'CT',
				timeDisplay: m.format('h:mm A [CT]'),
				dateDisplay: m.format('MMMM D, YYYY'),
				timeDisplayShort: m.format('hh:mm A'),
				dateShortDisplay: m.format('MM/DD'),
				unix: m.format('x')
			};
		}

		toString() {
			return '[TimestampQueryProvider]';
		}
	}

	return TimestampQueryProvider;
})();