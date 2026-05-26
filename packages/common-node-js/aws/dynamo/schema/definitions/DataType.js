const assert = require('@barchart/common-js/lang/assert'),
	Enum = require('@barchart/common-js/lang/Enum'),
	is = require('@barchart/common-js/lang/is');

module.exports = (() => {
	'use strict';

	/**
	 * A data type that used by DynamoDB attributes.
	 *
	 * @public
	 * @param {String} code
	 * @param {String} description
	 * @param {Function=} enumerationType
	 * @param {Boolean=} supportsCompression
	 * @param {Boolean=} supportsEncryption
	 */
	class DataType {
		constructor(code, description, enumerationType, supportsCompression, supportsEncryption) {
			assert.argumentIsRequired(code, 'code', String);
			assert.argumentIsRequired(description, 'description', String);
			assert.argumentIsOptional(enumerationType, 'enumerationType', Function);

			if (enumerationType) {
				assert.argumentIsValid(enumerationType, 'enumerationType', extendsEnumeration, 'is an enumeration');
			}

			assert.argumentIsOptional(supportsCompression, 'supportsCompression', Boolean);
			assert.argumentIsOptional(supportsEncryption, 'supportsEncryption', Boolean);

			this._code = code;
			this._description = description;

			this._enumerationType = enumerationType || null;

			this._supportsCompression = is.boolean(supportsCompression) && supportsCompression;
			this._supportsEncryption = is.boolean(supportsEncryption) && supportsEncryption;
		}

		/**
		 * Unique code used by Amazon to describe the data type.
		 *
		 * @public
		 * @returns {String}
		 */
		get code() {
			return this._code;
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
		 * The {@link Enumeration} type.
		 *
		 * @public
		 * @returns {Function|null}
		 */
		get enumerationType() {
			return this._enumerationType;
		}

		/**
		 * Indicates if the {@link DataType} can support compression.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get supportsCompression() {
			return this._supportsCompression;
		}

		/**
		 * Indicates if the {@link DataType} can support encryption.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get supportsEncryption() {
			return this._supportsEncryption;
		}

		/**
		 * Creates a {@link DataType} for an {@link Enum}.
		 *
		 * @public
		 * @static
		 * @param {Function} EnumerationType - A type that inherits {@link Enum}
		 * @param {String} description
		 * @returns {DataType}
		 */
		static forEnum(EnumerationType, description) {
			return new DataType('S', description, EnumerationType);
		}

		/**
		 * References a {@link Buffer} instance.
		 *
		 * @public
		 * @static
		 * @returns {DataType}
		 */
		static get BINARY() {
			return dataTypeBinary;
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
		 * References a string set.
		 *
		 * @public
		 * @static
		 * @return {DataType}
		 */
		static get STRING_SET() {
			return dataTypeStringSet;
		}

		/**
		 * References a list.
		 *
		 * @public
		 * @static
		 * @return {DataType}
		 */
		static get LIST() {
			return dataTypeList;
		}

		/**
		 * References a map.
		 *
		 * @public
		 * @static
		 * @return {DataType}
		 */
		static get MAP() {
			return dataTypeMap;
		}

		/**
		 * References an object (serialized as JSON).
		 *
		 * @public
		 * @static
		 * @returns {DataType}
		 */
		static get JSON() {
			return dataTypeJson;
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
		 * References a {@link Buffer} instance (serialized with compression).
		 *
		 * @public
		 * @static
		 * @returns {DataType}
		 */
		static get BINARY_COMPRESSED() {
			return dataTypeBinaryCompressed;
		}

		/**
		 * References a string (serialized with compression).
		 *
		 * @public
		 * @static
		 * @returns {DataType}
		 */
		static get STRING_COMPRESSED() {
			return dataTypeStringCompressed;
		}

		/**
		 * References a string (serialized with compression and then encrypted).
		 *
		 * @public
		 * @static
		 * @returns {DataType}
		 */
		static get STRING_ENCRYPTED() {
			return dataTypeStringEncrypted;
		}

		/**
		 * References an object (serialized as JSON, and using compression).
		 *
		 * @public
		 * @static
		 * @returns {DataType}
		 */
		static get JSON_COMPRESSED() {
			return dataTypeJsonCompressed;
		}

		/**
		 * References an object (serialized as JSON, compression, and encrypted).
		 *
		 * @public
		 * @static
		 * @returns {DataType}
		 */
		static get JSON_ENCRYPTED() {
			return dataTypeJsonEncrypted;
		}

		/**
		 * References an {@link AdHoc} instance (serialized with compression).
		 *
		 * @public
		 * @static
		 * @returns {DataType}
		 */
		static get AD_HOC_COMPRESSED() {
			return dataTypeAdHocCompressed;
		}

		/**
		 * References an {@link AdHoc} instance (serialized with compression and encrypted).
		 *
		 * @public
		 * @static
		 * @returns {DataType}
		 */
		static get AD_HOC_ENCRYPTED() {
			return dataTypeAdHocEncrypted;
		}

		/**
		 * Description of the data type (or null, if no known {@link DataType} can be found).
		 *
		 * @public
		 * @static
		 * @param {string} code - The code of the {@link DataType} instance to find.
		 * @returns {DataType|null}
		 */
		static fromCode(code) {
			assert.argumentIsRequired(code, 'code', String);

			return dataTypes.find(dt => dt.code === code) || null;
		}

		toString() {
			return `[DataType (code=${this._code}, description=${this._description})]`;
		}
	}

	function extendsEnumeration(EnumerationType) {
		return is.extension(Enum, EnumerationType);
	}

	const dataTypeBinary = new DataType('B', 'Binary');
	const dataTypeBoolean = new DataType('BOOL', 'Boolean');
	const dataTypeNumber = new DataType('N', 'Number');
	const dataTypeString = new DataType('S', 'String');
	const dataTypeList = new DataType('L', 'List');
	const dataTypeMap = new DataType('M', 'Map');
	const dataTypeStringSet = new DataType('SS', 'String Set');

	const dataTypeJson = new DataType('S', 'Json');

	const dataTypeDay = new DataType('S', 'Day');
	const dataTypeDecimal = new DataType('S', 'Decimal');
	const dataTypeTimestamp = new DataType('N', 'Timestamp');

	const dataTypeBinaryCompressed = new DataType('B', 'Binary (Compressed)', null, true, false);
	const dataTypeStringCompressed = new DataType('B', 'String (Compressed)', null, true, false);
	const dataTypeJsonCompressed = new DataType('B', 'Json (Compressed)', null, true, false);

	const dataTypeStringEncrypted = new DataType('B', 'String (Encrypted)', null, true, true);
	const dataTypeJsonEncrypted = new DataType('B', 'Json (Encrypted)', null, true, true);

	const dataTypeAdHocCompressed = new DataType('B', 'Ad Hoc (Compressed)', null, true, false);
	const dataTypeAdHocEncrypted = new DataType('B', 'Ad Hoc (Encrypted)', null, true, true);

	const dataTypes = [
		dataTypeNumber,
		dataTypeBoolean,
		dataTypeString,
		dataTypeStringCompressed,
		dataTypeStringEncrypted,
		dataTypeList,
		dataTypeMap,
		dataTypeStringSet,
		dataTypeJson,
		dataTypeJsonCompressed,
		dataTypeJsonEncrypted,
		dataTypeDecimal,
		dataTypeDay,
		dataTypeTimestamp,
		dataTypeBinary,
		dataTypeBinaryCompressed,
		dataTypeAdHocCompressed,
		dataTypeAdHocEncrypted
	];

	return DataType;
})();
