import FailureType from '@barchart/common-js/api/failures/FailureType.js';

/**
 * A static container for {@link FailureType} items related to Lambda Functions.
 *
 * @public
 */
export default class LambdaFailureType {
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

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[PortfolioFailureType]';
	}
}

const lambdaInvocationSuppressed = new FailureType('LAMBDA_INVOCATION_SUPPRESSED', 'Processing of this operation was suppressed.', false);
