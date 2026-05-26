const log4js = require('log4js');

const attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const MutateResultProcessor = require('./MutateResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/UnitConversionResultProcessor');

	/**
	 * Converts a value from one unit into another unit (assuming simple
	 * multiplication can be used).
	 *
	 * @public
	 * @extends MutateResultProcessor
	 * @param {object} configuration
	 * @param {string=} configurationToUse.propertyName
	 * @param {number=} configurationToUse.value
	 * @param {string=} configurationToUse.valueRef
	 * @param {string=} configurationToUse.unit
	 * @param {string=} configurationToUse.unitRef
	 * @param {number=} configurationToUse.factor
	 * @param {string=} configurationToUse.factorRef
	 * @param {string=} configurationToUse.numeratorUnit
	 * @param {string=} configurationToUse.numeratorUnitRef
	 * @param {string=} configurationToUse.denominatorUnit
	 * @param {string=} configurationToUse.denominatorUnitRef
	 */
	class UnitConversionResultProcessor extends MutateResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_processItem(resultItemToProcess, configurationToUse) {
			let propertyName;

			if (is.string(configurationToUse.propertyName)) {
				propertyName = configurationToUse.propertyName;
			} else if (is.string(configurationToUse.valueRef)) {
				propertyName = configurationToUse.valueRef;
			} else {
				propertyName = null;
			}

			let value;

			if (is.number(configurationToUse.value)) {
				value = configurationToUse.value;
			} else if (is.string(configurationToUse.valueRef) && attributes.has(resultItemToProcess, configurationToUse.valueRef)) {
				value = attributes.read(resultItemToProcess, configurationToUse.valueRef);
			} else {
				value = null;
			}

			let unit;

			if (is.string(configurationToUse.unit)) {
				unit = configurationToUse.unit;
			} else if (is.string(configurationToUse.unitRef) && attributes.has(resultItemToProcess, configurationToUse.unitRef)) {
				unit = attributes.read(resultItemToProcess, configurationToUse.unitRef);
			} else {
				unit = null;
			}

			let factor;

			if (is.number(configurationToUse.factor)) {
				factor = configurationToUse.factor;
			} else if (is.string(configurationToUse.factorRef) && attributes.has(resultItemToProcess, configurationToUse.factorRef)) {
				factor = parseFloat(attributes.read(resultItemToProcess, configurationToUse.factorRef));
			} else {
				factor = null;
			}

			let numerator;

			if (is.string(configurationToUse.numeratorUnit)) {
				numerator = configurationToUse.numeratorUnit;
			} else if (is.string(configurationToUse.numeratorUnitRef)  && attributes.has(resultItemToProcess, configurationToUse.numeratorUnitRef)) {
				numerator = attributes.read(resultItemToProcess, configurationToUse.numeratorUnitRef);
			} else {
				numerator = null;
			}

			let denominator;

			if (is.string(configurationToUse.denominatorUnit)) {
				denominator = configurationToUse.denominatorUnit;
			} else if (is.string(configurationToUse.denominatorUnitRef) && attributes.has(resultItemToProcess, configurationToUse.denominatorUnitRef)) {
				denominator = attributes.read(resultItemToProcess, configurationToUse.denominatorUnitRef);
			} else {
				denominator = null;
			}

			if (is.string(propertyName) && is.number(value) && is.number(factor) && is.string(unit) && is.string(numerator) && is.string(denominator) && (unit === numerator || unit === denominator)) {
				if (numerator === denominator) {
					factor = 1;
				} else if (unit === numerator) {
					factor = 1 / factor;
				}

				attributes.write(resultItemToProcess, propertyName, value * factor);
			}
		}

		toString() {
			return '[UnitConversionResultProcessor]';
		}
	}

	return UnitConversionResultProcessor;
})();