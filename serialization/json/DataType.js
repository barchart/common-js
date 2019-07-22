const moment = require('moment');

const AdHoc = require('./../../lang/AdHoc'),
	assert = require('./../../lang/assert'),
	Day = require('./../../lang/Day'),
	Decimal = require('./../../lang/Decimal'),
	Enum = require('./../../lang/Enum'),
	is = require('./../../lang/is'),
	Timestamp = require('./../../lang/Timestamp');

module.exports = (() => {
	'use strict';

	/**
	 * The formal definition of a data type which is used by an {@link Field}.
	 *
	 * @public
	 * @param {String} description
	 * @param {Function=} enumerationType
	 */
	class DataType {
		constructor(description, enumerationType, reviver, validator, builder) {
			assert.argumentIsRequired(description, 'description', String);
			assert.argumentIsOptional(enumerationType, 'enumerationType', Function);

			assert.argumentIsOptional(reviver, 'reviver', Function);
			assert.argumentIsOptional(validator, 'validator', Function);
			assert.argumentIsOptional(builder, 'builder', Function);

			if (enumerationType) {
				assert.argumentIsValid(enumerationType, 'enumerationType', extendsEnumeration, 'is an enumeration');
			}

			this._description = description;
			this._enumerationType = enumerationType || null;

			let reviverToUse;

			if (reviver) {
				reviverToUse = reviver;
			} else if (enumerationType) {
				reviverToUse = x => Enum.fromCode(enumerationType, x);
			} else {
				reviverToUse = x => x;
			}

			this._reviver = reviverToUse;

			let validatorToUse;

			if (validator) {
				validatorToUse = validator;
			} else {
				validatorToUse = (candidate) => true;
			}

			this._validator = validatorToUse;

			let builderToUse;

			if (builder) {
				builderToUse = builder;
			} else {
				builderToUse = (data) => data;
			}

			this._builder = builderToUse;
		}

		/**
		 * A function that converts data into the desired format.
		 *
		 * @public
		 * @param {*} data
		 * @returns {*}
		 */
		convert(data) {
			return this._builder(data);
		}

		/**
		 * Description of the data type.
		 *
		 * @public
		 * @returns {String}
		 */
		get description() {
			return this._description;
		}

		/**
		 * The {@Enumeration} type, if applicable.
		 *
		 * @public
		 * @returns {Function|null}
		 */
		get enumerationType() {
			return this._enumerationType;
		}

		/**
		 * A function which "revives" a value after serialization to JSON.
		 *
		 * @public
		 * @returns {Function}
		 */
		get reviver() {
			return this._reviver;
		}

		/**
		 * A function validates data, returning true or false.
		 *
		 * @public
		 * @returns {Function}
		 */
		get validator() {
			return this._validator;
		}

		/**
		 * Return a {@link DataType} instance for use with an {@link @Enum}.
		 *
		 * @public
		 * @param {Function} enumerationType - A class that extends {@link Enum}
		 * @param description - The description
		 * @returns {DataType}
		 */
		static forEnum(enumerationType, description) {
			return new DataType(description, enumerationType, null, x => x instanceof enumerationType, getBuilder(getEnumerationBuilder(enumerationType)));
		}

		/**
		 * References a string.
		 *
		 * @public
		 * @static
		 * @returns {DataType}
		 */
		static get STRING() {
			return dataTypeString;
		}

		/**
		 * References a number.
		 *
		 * @public
		 * @static
		 * @returns {DataType}
		 */
		static get NUMBER() {
			return dataTypeNumber;
		}

		/**
		 * References a Boolean value.
		 *
		 * @public
		 * @static
		 * @returns {DataType}
		 */
		static get BOOLEAN() {
			return dataTypeBoolean;
		}

		/**
		 * References an object (serialized as JSON).
		 *
		 * @public
		 * @static
		 * @returns {DataType}
		 */
		static get OBJECT() {
			return dataTypeObject;
		}

		/**
		 * References an array.
		 *
		 * @public
		 * @static
		 * @returns {DataType}
		 */
		static get ARRAY() {
			return dataTypeArray;
		}

		/**
		 * References a {@link Decimal} instance.
		 *
		 * @public
		 * @static
		 * @returns {DataType}
		 */
		static get DECIMAL() {
			return dataTypeDecimal;
		}

		/**
		 * References a {@link Day} instance.
		 *
		 * @public
		 * @static
		 * @returns {DataType}
		 */
		static get DAY() {
			return dataTypeDay;
		}

		/**
		 * References a {@link Timestamp} instance.
		 *
		 * @public
		 * @static
		 * @returns {DataType}
		 */
		static get TIMESTAMP() {
			return dataTypeTimestamp;
		}

		/**
		 * References a {@link Timestamp} instance.
		 *
		 * @public
		 * @static
		 * @returns {DataType}
		 */
		static get AD_HOC() {
			return dataTypeAdHoc;
		}


		toString() {
			return `[DataType (description=${this._description})]`;
		}
	}

	function extendsEnumeration(EnumerationType) {
		return is.extension(Enum, EnumerationType);
	}

	const dataTypeString = new DataType('String', null, null, is.string);
	const dataTypeNumber = new DataType('Number', null, null, is.number);
	const dataTypeBoolean = new DataType('Boolean', null, null, is.boolean);
	const dataTypeObject = new DataType('Object', null, null, is.object);
	const dataTypeArray =  new DataType('Array', null, null, is.array);

	const dataTypeDecimal = new DataType('Decimal', null, x => Decimal.parse(x), x => x instanceof Decimal, getBuilder(buildDecimal));
	const dataTypeDay = new DataType('Day', null, x => Day.parse(x), x => x instanceof Day, getBuilder(buildDay));
	const dataTypeTimestamp = new DataType('Timestamp', null, x => Timestamp.parse(x), x => x instanceof Timestamp, getBuilder(buildTimestamp));
	const dataTypeAdHoc = new DataType('AdHoc', null, x => AdHoc.parse(x), x => x instanceof AdHoc, getBuilder(buildAdHoc));

	const dataTypes = [
		dataTypeString,
		dataTypeNumber,
		dataTypeBoolean,
		dataTypeObject,
		dataTypeArray,
		dataTypeDecimal,
		dataTypeDay,
		dataTypeTimestamp,
		dataTypeAdHoc
	];

	function getBuilder(builder) {
		return (data) => {
			try {
				return builder(data);
			} catch(e) {
				return data;
			}
		};
	}

	function buildDecimal(data) {
		return new Decimal(data);
	}

	function buildDay(data) {
		if (data instanceof Day) {
			return new Day(data.year, data.month, data.day);
		} else if (is.date(data)) {
			return Day.fromDate(data);
		} else if (is.string(data)) {
			return Day.parse(data);
		} else if (data instanceof moment) {
			return new Day(data.year(), data.month() + 1, data.date());
		} else {
			return data;
		}
	}

	function buildTimestamp(data) {
		return new Timestamp(data);
	}

	function buildAdHoc(data) {
		if (data instanceof AdHoc) {
			return new AdHoc(data.data);
		} else if (is.object(data)) {
			return new AdHoc(data);
		}
	}

	function getEnumerationBuilder(enumerationType) {
		return (data) => {
			if (is.string(data)) {
				return Enum.fromCode(enumerationType, data);
			} else {
				return data;
			}
		};
	}

	return DataType;
})();
