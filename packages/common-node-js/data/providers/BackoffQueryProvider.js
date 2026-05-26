const log4js = require('log4js');

const Scheduler = require('@barchart/common-js/timing/Scheduler');

const QueryProvider = require('./../QueryProvider');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/providers/BackoffQueryProvider');

	function handleAttemptFailure(count) {
		logger.warn('Nested query provider failed its', count, 'attempt.');
	}

	/**
	 * A {@link QueryProvider} that intercepts and delegates work to another
	 * query provider, retrying, if necessary. The retries are scheduled using
	 * exponential backoff logic.
	 *
	 * @public
	 * @extends QueryProvider
	 * @param {Object} configuration
	 * @param {number=} configuration.millisecondDelay - The amount of time to wait after the first failure. Subsequent failures are multiply this value by 2 ^ [number of failures]. So, a 1000 millisecond backoff would schedule attempts using the following delays: 0, 1000, 2000, 4000, 8000, etc.
	 * @param {number=} configuration.maximumAttempts - The number of attempts to before giving up.
	 * @param {Object=} configuration.failureValue - A value that will be considered a failure, and trigger a retry. Equality is determined using a deep comparison. If not supplied, a failing result is anything that's falsey.
	 */
	class BackoffQueryProvider extends QueryProvider {
		constructor(configuration, nestedQueryProvider) {
			super(configuration);

			this._nestedQueryProvider = nestedQueryProvider;
			this._scheduler = new Scheduler();
		}

		_runQuery(criteria) {
			const configuration = this._getConfiguration();

			return this._scheduler.backoff(() => this._nestedQueryProvider.runQuery(criteria), configuration.millisecondDelay, 'Backoff Query Provider Execution', configuration.maximumAttempts, handleAttemptFailure, configuration.failureValue);
		}

		toString() {
			return '[BackoffQueryProvider]';
		}
	}

	return BackoffQueryProvider;
})();