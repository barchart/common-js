const log4js = require('log4js');

const attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const MutateResultProcessor = require('./MutateResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/ReplaceResultProcessor');

	/**
	 * Applies regular-expression based replacement to a single property and
	 * overwrites the property.
	 *
	 * @public
	 * @extends MutateResultProcessor
	 * @param {object} configuration
	 * @param {string} configuration.propertyName - Name of the property to apply the regular expression replacement to.
	 * @param {string=} configuration.selectExpression - The select expression.
	 * @param {string=} configuration.selectExpressionRef - The name of the property which contains select expression.
	 * @param {string=} configuration.replaceExpression - The expression that defines the replacement.
	 * @param {string=} configuration.replaceExpressionRef - The name of the property which contains the replacement definition.
	 * @param {boolean=} configuration.global - True for global replacement (defaults to true).
	 * @param {boolean=} configuration.insensitive - True for case insensitive replacement (defaults to false).
	 */
	class ReplaceResultProcessor extends MutateResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_processItem(resultItemToProcess, configurationToUse) {
			const propertyName = configurationToUse.propertyName;
			const propertyValue = attributes.read(resultItemToProcess, propertyName);

			if (is.string(propertyValue)) {
				let selectExpression;

				if (is.string(configurationToUse.selectExpression)) {
					selectExpression = configurationToUse.selectExpression;
				} else if (is.string(configurationToUse.selectExpressionRef)) {
					selectExpression = attributes.read(resultItemToProcess, configurationToUse.selectExpressionRef);
				} else {
					selectExpression = null;
				}

				let replaceExpression;

				if (is.string(configurationToUse.replaceExpression)) {
					replaceExpression = configurationToUse.replaceExpression;
				} else if (is.string(configurationToUse.replaceExpressionRef)) {
					replaceExpression = attributes.read(resultItemToProcess, configurationToUse.replaceExpressionRef);
				} else {
					replaceExpression = null;
				}

				if (is.string(selectExpression) && is.string(replaceExpression)) {
					const options = [];

					if (!is.boolean(configurationToUse.global) || configurationToUse.global) {
						options.push('g');
					}

					if (is.boolean(configurationToUse.insensitive) && configurationToUse.insensitive) {
						options.push('i');
					}

					attributes.write(resultItemToProcess, propertyName, propertyValue.replace(new RegExp(selectExpression, options.join('')), replaceExpression));
				}
			}
		}

		toString() {
			return '[ReplaceResultProcessor]';
		}
	}

	return ReplaceResultProcessor;
})();