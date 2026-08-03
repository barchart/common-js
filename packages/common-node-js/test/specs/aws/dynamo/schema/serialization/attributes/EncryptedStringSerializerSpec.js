import Attribute from './../../../../../../../aws/dynamo/schema/definitions/Attribute.js';
import DataType from './../../../../../../../aws/dynamo/schema/definitions/DataType.js';
import EncryptionType from './../../../../../../../aws/dynamo/schema/definitions/EncryptionType.js';
import Encryptor from './../../../../../../../aws/dynamo/schema/definitions/Encryptor.js';
import EncryptedStringSerializer from './../../../../../../../aws/dynamo/schema/serialization/attributes/EncryptedStringSerializer.js';

describe('When a EncryptedStringSerializer is instantiated using the AES-192 algorithm', () => {
	'use strict';

	let attribute;
	let serializer;

	beforeEach(() => {
		attribute = new Attribute('test', DataType.STRING, null, new Encryptor(EncryptionType.AES_192, '123456789012345678901234'));
		serializer = new EncryptedStringSerializer(attribute);
	});

	describe('and a string is serialized', () => {
		let string = ('abc').repeat(10);
		let serialized;

		beforeEach(() => {
			serialized = serializer.serialize(string);
		});

		it('should produce an object with a binary (i.e. "B") property', () => {
			expect(Object.hasOwn(serialized, "B")).toEqual(true);
		});

		it('should produce an object with a binary (i.e. buffer) value', () => {
			expect(Buffer.isBuffer(serialized.B)).toEqual(true);
		});

		describe('and the output is deserialized', () => {
			let deserialized;

			beforeEach(() => {
				deserialized = serializer.deserialize(serialized);
			});

			it('should produce the original string', () => {
				expect(deserialized).toEqual(string);
			});
		});
	});
});

describe('When a EncryptedStringSerializer is instantiated using the AES-256 algorithm', () => {
	'use strict';

	let attribute;
	let serializer;

	beforeEach(() => {
		attribute = new Attribute('test', DataType.STRING, null, new Encryptor(EncryptionType.AES_256, '12345678901234567890123456789012'));
		serializer = new EncryptedStringSerializer(attribute);
	});

	describe('and a string is serialized', () => {
		let string = ('abc').repeat(10);
		let serialized;

		beforeEach(() => {
			serialized = serializer.serialize(string);
		});

		it('should produce an object with a binary (i.e. "B") property', () => {
			expect(Object.hasOwn(serialized, "B")).toEqual(true);
		});

		it('should produce an object with a binary (i.e. buffer) value', () => {
			expect(Buffer.isBuffer(serialized.B)).toEqual(true);
		});

		describe('and the output is deserialized', () => {
			let deserialized;

			beforeEach(() => {
				deserialized = serializer.deserialize(serialized);
			});

			it('should produce the original string', () => {
				expect(deserialized).toEqual(string);
			});
		});
	});
});