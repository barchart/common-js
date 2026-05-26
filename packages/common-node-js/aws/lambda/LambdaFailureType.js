const FailureType = require('@barchart/common-js/api/failures/FailureType');

module.exports = (() => {
	'use strict';

	/**
	 * A static container for {@link FailureType} items related to Lambda Functions.
	 *
	 * @public
	 */
	class LambdaFailureType {
		constructor() {

		}

		/**
		 * The Lambda function aborted processing.
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get LAMBDA_INVOCATION_SUPPRESSED() {
			return lambdaInvocationSuppressed;
		}

		toString() {
			return '[PortfolioFailureType]';
		}
	}

	const lambdaInvocationSuppressed = new FailureType('LAMBDA_INVOCATION_SUPPRESSED', 'Processing of this operation was suppressed.', false);

	return LambdaFailureType;
})();
