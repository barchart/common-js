const log4js = require('log4js');

const attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const MutateResultProcessor = require('./MutateResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/MapResultProcessor');

	class MapResultProcessor extends MutateResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_processItem(resultItemToProcess, configurationToUse) {
			const propertyName = configurationToUse.propertyName;
			const map = configurationToUse.map;

			const propertyValue = attributes.read(resultItemToProcess, propertyName);

			if (map.hasOwnProperty(propertyValue)) {
				attributes.write(resultItemToProcess, propertyName, map[propertyValue]);
			}
		}

		toString() {
			return '[MapResultProcessor]';
		}
	}

	return MapResultProcessor;
})();