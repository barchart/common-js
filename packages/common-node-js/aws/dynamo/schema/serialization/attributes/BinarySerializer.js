import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';

import AttributeSerializer from './AttributeSerializer.js';
import CompressionType from './../../definitions/CompressionType.js';
import DataType from './../../definitions/DataType.js';

import crypto from 'crypto';
import zlib from 'zlib';

/**
 * Converts a buffer into (and back from) the representation used
 * on a DynamoDB record.
 *
 * @public
 * @extends {AttributeSerializer}
 */
export default class BinarySerializer extends AttributeSerializer {
	constructor() {
		super();
	}

	_getCompressionType() {
		return null;
	}

	_getEncryptor() {
		return null;
	}

	/**
	 * Serializes a value.
	 *
	 * @public
	 * @param {*} value
	 * @returns {object}
	 */
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

	/**
	 * Deserializes a value.
	 *
	 * @public
	 * @param {*} wrapper
	 * @returns {*}
	 */
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

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[BinarySerializer]';
	}
}

const instance = new BinarySerializer();
