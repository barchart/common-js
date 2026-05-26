const log4js = require('log4js');

const Environment = require('./../../environment/Environment'),
	QueryProvider = require('./../QueryProvider');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/providers/SystemQueryProvider');

	/**
	 * A {@link QueryProvider} that returns details about the current
	 * application (e.g. version and name).
	 *
	 * @public
	 * @extends QueryProvider
	 * @param {Object} configuration
	 */
	class SystemQueryProvider extends QueryProvider {
		constructor(configuration) {
			super(configuration);
		}

		_runQuery(criteria) {
			const environment = Environment.getInstance();

			return {
				name: environment.getName(),
				version: environment.getVersion()
			};
		}

		toString() {
			return '[SystemQueryProvider]';
		}
	}

	return SystemQueryProvider;
})();