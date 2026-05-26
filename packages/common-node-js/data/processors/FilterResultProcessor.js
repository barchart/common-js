const log4js = require('log4js'),
	moment = require('moment');

const attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const ResultProcessor = require('./../ResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/FilterResultProcessor');

	class FilterResultProcessor extends ResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_process(results) {
			const configuration = this._getConfiguration();

			if (is.object(configuration.equals)) {
				results = results.filter((result) => {
					return Object.keys(configuration.equals)
						.every((propertyName) => {
							const expectedValue = configuration.equals[propertyName];

							return attributes.has(result, propertyName) && attributes.read(result, propertyName) === expectedValue;
						});
				});
			}

			if (is.object(configuration.regex)) {
				results = results.filter((result) => {
					return Object.keys(configuration.regex)
						.every((propertyName) => {
							const regex = new RegExp(configuration.regex[propertyName]);

							return attributes.has(result, propertyName) && regex.test(attributes.read(result, propertyName));
						});
				});
			}

			if (is.array(configuration.empty)) {
				results = results.filter((result) => {
					return configuration.empty
						.every((propertyName) => {
							let returnVal;

							if (attributes.has(result, propertyName)) {
								const value = attributes.read(result, propertyName);

								returnVal = is.null(value) || is.undefined(value) || value === '';
							} else {
								returnVal = true;
							}

							return returnVal;
						});
				});
			}

			if (is.object(configuration.special)) {
				const now = moment();

				results = results.filter((result) => {
					return Object.keys(configuration.special)
						.every((propertyName) => {
							const specialOperation = configuration.special[propertyName];

							let returnVal = attributes.has(result, propertyName);

							if (returnVal) {
								const propertyValue = attributes.read(result, propertyName);

								if (specialOperation === 'today') {
									const m = moment(propertyValue);

									returnVal = m.isValid() &&
										m.year() === now.year() &&
										m.month() === now.month() &&
										m.date() === now.date();
								}
							}

							return returnVal;
						});
				});
			}

			if (is.string(configuration.unique)) {
				const set = new Set();

				results = results.filter((result) => {
					const value = attributes.read(result, configuration.unique);
					const keep = !set.has(value);

					set.add(value);

					return keep;
				});
			}

			return results;
		}

		toString() {
			return '[FilterResultProcessor]';
		}
	}

	return FilterResultProcessor;
})();