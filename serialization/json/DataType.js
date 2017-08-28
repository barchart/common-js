const assert = require('./../../lang/assert'),
	Day = require('./../../lang/Day'),
	Decimal = require('./../../lang/Decimal'),
	Enum = require('./../../lang/Enum'),
	is = require('./../../lang/is'),
	Timestamp = require('./../../lang/Timestamp');

module.exports = (() => {
	'use strict';

	/**
	 * The formal definition of a data type which is used by an {@link Attribute}.
	 *
	 * @public
	 * @param {String} description
	 * @param {Function=} enumerationType
	 */
	class DataType {
		constructor(description, enumerationType, reviver) {
			assert.argumentIsRequired(description, 'description', String);
			assert.argumentIsOptional(enumerationType, 'enumerationType', Function);
			assert.argumentIsOptional(reviver, 'reviver', Function);

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
		 * @returns {Function}reviver
		 */
		get reviver() {
			return this._reviver;
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
			return new DataType(description, enumerationType);
		}

		/**
		 * References a string.
		 *
		 * @public
		 * @returns {DataType}
		 */
		static get STRING() {
			return dataTypeString;
		}

		/**
		 * References a number.
		 *
		 * @public
		 * @returns {DataType}
		 */
		static get NUMBER() {
			return dataTypeNumber;
		}

		/**
		 * References a Boolean value.
		 *
		 * @public
		 * @returns {DataType}
		 */
		static get BOOLEAN() {
			return dataTypeBoolean;
		}

		/**
		 * References an object (serialized as JSON).
		 *
		 * @public
		 * @returns {DataType}
		 */
		static get OBJECT() {
			return dataTypeObject;
		}

		/**
		 * References a {@link Decimal} instance.
		 *
		 * @public
		 * @returns {DataType}
		 */
		static get DECIMAL() {
			return dataTypeDecimal;
		}

		/**
		 * References a {@link Day} instance.
		 *
		 * @public
		 * @returns {DataType}
		 */
		static get DAY() {
			return dataTypeDay;
		}

		/**
		 * References a {@link Timestamp} instance.
		 *
		 * @public
		 * @returns {DataType}
		 */
		static get TIMESTAMP() {
			return dataTypeTimestamp;
		}

		toString() {
			return `[DataType (description=${this._description})]`;
		}
	}

	function extendsEnumeration(EnumerationType) {
		return is.extension(Enum, EnumerationType);
	}

	const dataTypeString = new DataType('String');
	const dataTypeNumber = new DataType('Number');
	const dataTypeBoolean = new DataType('Boolean');
	const dataTypeObject = new DataType('Object');

	const dataTypeDecimal = new DataType('Decimal', null, x => Decimal.parse(x));
	const dataTypeDay = new DataType('Day', null, x => Day.parse(x));
	const dataTypeTimestamp = new DataType('Timestamp', null, x => Timestamp.parse(x));

	const dataTypes = [
		dataTypeString,
		dataTypeNumber,
		dataTypeBoolean,
		dataTypeObject,
		dataTypeDecimal,
		dataTypeDay,
		dataTypeTimestamp
	];

	return DataType;
})();