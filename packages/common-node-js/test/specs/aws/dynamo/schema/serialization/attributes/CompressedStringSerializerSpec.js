const Attribute = require('./../../../../../../../aws/dynamo/schema/definitions/Attribute'),
	CompressionType = require('./../../../../../../../aws/dynamo/schema/definitions/CompressionType'),
	DataType = require('./../../../../../../../aws/dynamo/schema/definitions/DataType');

const CompressedStringSerializer = require('./../../../../../../../aws/dynamo/schema/serialization/attributes/CompressedStringSerializer');

describe('When a CompressedStringSerializer is instantiated using the Deflate algorithm', () => {
	'use strict';

	let attribute;
	let serializer;

	beforeEach(() => {
		attribute = new Attribute('test', DataType.STRING, null, null, CompressionType.DEFLATE);
		serializer = new CompressedStringSerializer(attribute);
	});

	describe('and a string is serialized', () => {
		let string = ('abc').repeat(10);
		let serialized;

		beforeEach(() => {
			serialized = serializer.serialize(string);
		});

		it('should produce an object with a binary (i.e. "B") property', () => {
			expect(serialized.hasOwnProperty("B")).toEqual(true);
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

describe('When a CompressedStringSerializer is instantiated using the Zip algorithm', () => {
	'use strict';

	let attribute;
	let serializer;

	beforeEach(() => {
		attribute = new Attribute('test', DataType.STRING, null, null, CompressionType.ZIP);
		serializer = new CompressedStringSerializer(attribute);
	});

	describe('and a string is serialized', () => {
		let string = ('abc').repeat(10);
		let serialized;

		beforeEach(() => {
			serialized = serializer.serialize(string);
		});

		it('should produce an object with a binary (i.e. "B") property', () => {
			expect(serialized.hasOwnProperty("B")).toEqual(true);
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