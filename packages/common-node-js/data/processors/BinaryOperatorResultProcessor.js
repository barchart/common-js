const log4js = require('log4js');

const attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const MutateResultProcessor = require('./MutateResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/BinaryOperatorResultProcessor');

	/**
	 * Performs an operation with two operands and assigns the result.
	 *
	 * @public
	 * @interface
	 * @extends MutateResultProcessor
	 * @param {object} configuration
	 * @param {string} configuration.propertyName - The property to which the result will be assigned.
	 * @param {number=} configuration.left - If provided, the left value.
	 * @param {string=} configuration.leftRef - The name of the property that holds the left value.
	 * @param {number=} configuration.right - If provided, the right value.
	 * @param {string=} configuration.rightRef - The name of the property that holds the right value.
	 */
	class BinaryOperatorResultProcessor extends MutateResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_processItem(resultItemToProcess, configurationToUse) {
			const propertyName = configurationToUse.propertyName;

			if (!is.string(propertyName)) {
				return;
			}

			let left;

			if (is.number(configurationToUse.left)) {
				left = configurationToUse.left;
			} else if (is.string(configurationToUse.leftRef)) {
				left = parseFloat(attributes.read(resultItemToProcess, configurationToUse.leftRef));
			} else {
				left = null;
			}

			let right;

			if (is.number(configurationToUse.right)) {
				right = configurationToUse.right;
			} else if (is.string(configurationToUse.rightRef)) {
				right = parseFloat(attributes.read(resultItemToProcess, configurationToUse.rightRef));
			} else {
				right = null;
			}

			if (this._validateLeft(left) && this._validateRight(right)) {
				attributes.write(resultItemToProcess, propertyName, this._evaluate(left, right));
			}
		}

		_validateLeft(left) {
			return is.number(left);
		}

		_validateRight(right) {
			return is.number(right);
		}

		_evaluate(left, right) {
			return undefined;
		}

		toString() {
			return '[BinaryOperatorResultProcessor]';
		}
	}

	return BinaryOperatorResultProcessor;
})();