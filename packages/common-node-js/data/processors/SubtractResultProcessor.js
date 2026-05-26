const log4js = require('log4js');

const attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const BinaryOperatorResultProcessor = require('./BinaryOperatorResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/SubtractResultProcessor');

	/**
	 * Subtracts two numbers and assigns the result.
	 *
	 * @public
	 * @extends BinaryOperatorResultProcessor
	 * @param {object} configuration
	 * @param {string} configuration.propertyName - The property to which the result will be assigned.
	 * @param {number=} configuration.left - If provided, the left value.
	 * @param {string=} configuration.leftRef - The name of the property that holds the left value.
	 * @param {number=} configuration.right - If provided, the right value.
	 * @param {string=} configuration.rightRef - The name of the property that holds the right value.
	 */
	class SubtractResultProcessor extends BinaryOperatorResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_evaluate(left, right) {
			return left - right;
		}

		toString() {
			return '[SubtractResultProcessor]';
		}
	}

	return SubtractResultProcessor;
})();