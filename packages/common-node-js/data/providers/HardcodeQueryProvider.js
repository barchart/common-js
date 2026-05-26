const log4js = require('log4js');

const object = require('@barchart/common-js/lang/object');

const QueryProvider = require('./../QueryProvider');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/providers/HardcodeQueryProvider');

	/**
	 * A {@link QueryProvider} that returns a clone of a literal object.
	 *
	 * @public
	 * @extends QueryProvider
	 * @param {Object} configuration
	 * @param {Object} configuration.results - The object to clone and return.
	 */
	class HardcodeQueryProvider extends QueryProvider {
		constructor(configuration) {
			super(configuration);
		}

		_runQuery(criteria) {
			return object.clone(this._getConfiguration().results);
		}

		toString() {
			return '[HardcodeQueryProvider]';
		}
	}

	return HardcodeQueryProvider;
})();