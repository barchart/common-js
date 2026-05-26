const log4js = require('log4js');

const MutateStringResultProcessor = require('./MutateStringResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/UppercaseResultProcessor');

	class UppercaseResultProcessor extends MutateStringResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_processString(value) {
			return value.toUpperCase();
		}

		toString() {
			return '[UppercaseResultProcessor]';
		}
	}

	return UppercaseResultProcessor;
})();