const log4js = require('log4js');

const attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const MutateResultProcessor = require('./MutateResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/MatchResultProcessor');

	class MatchResultProcessor extends MutateResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_processItem(resultItemToProcess, configurationToUse) {
			const propertyName = configurationToUse.propertyName;
			const matchPropertyName = configurationToUse.matchPropertyName;

			const expression = configurationToUse.expression;
			const expressions = configurationToUse.expressions;

			if (is.string(propertyName) && is.string(matchPropertyName) && (is.string(expression) || is.array(expressions))) {
				const expressionsToTest = expressions || [ ];
				
				if (is.string(expression)) {
					expressionsToTest.push(expression);
				}
				
				const propertyValue = attributes.read(resultItemToProcess, propertyName);
				const matched = is.string(propertyValue) && expressionsToTest.some(e => (new RegExp(e)).test(propertyValue));

				attributes.write(resultItemToProcess, matchPropertyName, matched);
			}
		}

		toString() {
			return '[MatchResultProcessor]';
		}
	}

	return MatchResultProcessor;
})();