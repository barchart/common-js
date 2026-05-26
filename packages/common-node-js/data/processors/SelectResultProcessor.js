const log4js = require('log4js');

const attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const ResultProcessor = require('./../ResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/SelectResultProcessor');

	/**
	 * Selects properties from the result object (or from each object
	 * in the results array) and returns a new object having those
	 * properties (or a new array of new objects having those properties).
	 *
	 * @public
	 * @extends ResultProcessor
	 * @param {object} configuration
	 * @param {object[]} configuration.properties - The properties to read into the results. Each key is the name of the property on the source object and each value is the name of the property on the target object.
	 */
	class SelectResultProcessor extends ResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_process(results) {
			const configuration = this._getConfiguration();

			if (configuration.properties) {
				let resultsToProcess;

				if (is.array(results)) {
					resultsToProcess = results;
				} else if (is.object(results)) {
					resultsToProcess = [ results ];
				} else {
					resultsToProcess = null;
				}

				if (resultsToProcess) {
					resultsToProcess = resultsToProcess.map((result) => {
						const transform = {};

						Object.keys(configuration.properties)
							.forEach((inputPropertyName) => {
								const outputPropertyName = configuration.properties[inputPropertyName];

								attributes.write(transform, outputPropertyName, attributes.read(result, inputPropertyName));
							});

						return transform;
					});

					if (is.array(results)) {
						results = resultsToProcess;
					} else {
						results = resultsToProcess[0];
					}
				}
			}

			return results;
		}

		toString() {
			return '[SelectResultProcessor]';
		}
	}

	return SelectResultProcessor;
})();