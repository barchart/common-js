const crypto = require('crypto'),
	zlib = require('zlib');

const assert = require('@barchart/common-js/lang/assert'),
	is = require('@barchart/common-js/lang/is');

const AttributeSerializer = require('./AttributeSerializer'),
	CompressionType = require('./../../definitions/CompressionType'),
	DataType = require('./../../definitions/DataType');

module.exports = (() => {
	'use strict';

	/**
	 * Converts a buffer into (and back from) the representation used
	 * on a DynamoDB record.
	 *
	 * @public
	 * @extends {AttributeSerializer}
	 */
	class BinarySerializer extends AttributeSerializer {
		constructor() {
			super();
		}

		_getCompressionType() {
			return null;
		}

		_getEncryptor() {
			return null;
		}

		serialize(value) {
			assert.argumentIsValid(value, 'value', Buffer.isBuffer, 'is buffer');

			const wrapper = { };

			let serialized;

			const compressionType = this._getCompressionType();

			if (compressionType === CompressionType.DEFLATE) {
				serialized = zlib.deflateSync(value);
			} else if (compressionType === CompressionType.ZIP) {
				serialized = zlib.gzipSync(value);
			} else {
				serialized = value;
			}

			const encryptor = this._getEncryptor();

			if (encryptor !== null) {
				const initializationVector = crypto.randomBytes(encryptor.type.initializationVectorLength);
				const cipher = crypto.createCipheriv(encryptor.type.code, encryptor.key, initializationVector);

				serialized = Buffer.concat([ initializationVector, cipher.update(serialized), cipher.final() ]);
			}

			wrapper[DataType.BINARY.code] = serialized;

			return wrapper;
		}

		deserialize(wrapper) {
			const value = wrapper[DataType.BINARY.code];

			let deserialized = value;

			if (is.string(deserialized)) {
				deserialized = Buffer.from(deserialized, 'base64');
			}

			const encryptor = this._getEncryptor();

			if (encryptor !== null) {
				const initializationVector = value.slice(0, encryptor.type.initializationVectorLength);
				const decipher = crypto.createDecipheriv(encryptor.type.code, encryptor.key, initializationVector);

				deserialized = Buffer.concat([ decipher.update(value.slice(encryptor.type.initializationVectorLength)), decipher.final() ]);
			}

			const compressionType = this._getCompressionType();

			if (compressionType === CompressionType.DEFLATE) {
				deserialized = zlib.inflateSync(deserialized);
			} else if (compressionType === CompressionType.ZIP) {
				deserialized = zlib.gunzipSync(deserialized);
			}

			return deserialized;
		}

		/**
		 * A singleton.
		 *
		 * @public
		 * @static
		 * @returns {BinarySerializer}
		 */
		static get INSTANCE() {
			return instance;
		}

		toString() {
			return '[BinarySerializer]';
		}
	}

	const instance = new BinarySerializer();

	return BinarySerializer;
})();