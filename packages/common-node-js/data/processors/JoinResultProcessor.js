const log4js = require('log4js');

const array = require('@barchart/common-js/lang/array'),
	attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const ResultProcessor = require('./../ResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/JoinResultProcessor');

	class JoinResultProcessor extends ResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_process(results) {
			const configuration = this._getConfiguration();

			const separator = configuration.customSeparator;

			const target = attributes.read(results, configuration.target, separator);
			const source = attributes.read(results, configuration.source, separator);

			let targetProperty;
			let sourceProperty;

			if (is.string(configuration.join)) {
				targetProperty = configuration.join;
				sourceProperty = configuration.join;
			} else if (is.string(configuration.targetProperty) && is.string(configuration.sourceProperty)) {
				targetProperty = configuration.targetProperty;
				sourceProperty = configuration.sourceProperty;
			} else {
				targetProperty = null;
				sourceProperty = null;
			}

			let sourceItemMap;

			const keySelector = (item) => {
				return attributes.read(item, sourceProperty, separator);
			};

			if (!is.array(source)) {
				sourceItemMap = source;
			} else if (is.boolean(configuration.multiple) && configuration.multiple) {
				sourceItemMap = array.groupBy(source, keySelector);
			} else {
				sourceItemMap = array.indexBy(source, keySelector);
			}

			const aliasProperty = configuration.alias;

			target.forEach((targetItem) => {
				let targetValue;

				if (is.array(attributes.read(targetItem, targetProperty), separator)) {
					const joinValues = attributes.read(targetItem, targetProperty, separator);

					targetValue = joinValues.map((joinValue) => {
						return getTargetValue(sourceItemMap, joinValue, separator);
					});
				} else {
					const joinValue = attributes.read(targetItem, targetProperty, separator);

					targetValue = getTargetValue(sourceItemMap, joinValue, separator);
				}

				attributes.write(targetItem, aliasProperty, targetValue, separator);
			});

			return target;
		}

		toString() {
			return '[JoinResultProcessor]';
		}
	}

	function getTargetValue(sourceItemMap, joinValue, separator) {
		let targetValue;

		if (is.null(joinValue) || is.undefined(joinValue)) {
			targetValue = sourceItemMap[joinValue];
		} else {
			targetValue = attributes.read(sourceItemMap, joinValue.toString(), separator);
		}

		return targetValue;
	}

	return JoinResultProcessor;
})();