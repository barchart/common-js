const log4js = require('log4js');

const attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const BinaryOperatorResultProcessor = require('./BinaryOperatorResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/DivideResultProcessor');

	/**
	 * Divides two numbers and assigns the result.
	 *
	 * @public
	 * @extends BinaryOperatorResultProcessor
	 * @param {object} configuration
	 * @param {string} configuration.propertyName - The property to which the result will be assigned.
	 * @param {number=} configuration.numerator - If provided, the left value.
	 * @param {string=} configuration.numeratorRef - The name of the property that holds the left value.
	 * @param {number=} configuration.denominator - If provided, the right value.
	 * @param {string=} configuration.denominatorRef - The name of the property that holds the right value.
	 */
	class DivideResultProcessor extends BinaryOperatorResultProcessor {
		constructor(configuration) {
			super(rewriteConfiguration(configuration));
		}

		_validateRight(right) {
			return is.number(right) && right !== 0;
		}

		_evaluate(left, right) {
			return left / right;
		}

		toString() {
			return '[DivideResultProcessor]';
		}
	}

	function rewriteConfigurationItem(configurationItem) {
		return Object.assign(configurationItem, {
			left: configurationItem.numerator,
			right: configurationItem.denominator,
			leftRef: configurationItem.numeratorRef,
			rightRef: configurationItem.denominatorRef
		});
	}

	function rewriteConfiguration(configuration) {
		if (is.array(configuration.items)) {
			configuration.items = configuration.items.map((configurationItem) => {
				return rewriteConfigurationItem(configurationItem);
			});
		} else {
			rewriteConfigurationItem(configuration);
		}

		return configuration;
	}

	return DivideResultProcessor;
})();