const StringSerializer = require('./../../../../../../../aws/dynamo/schema/serialization/attributes/StringSerializer');

describe('When a StringSerializer is instantiated', () => {
	'use strict';

	let serializer;

	beforeEach(() => {
		serializer = new StringSerializer();
	});

	it('it serializes "three" as { "S": "three" }', () => {
		let serialized = serializer.serialize("three");

		expect(serialized.S).toEqual('three');
	});

	it('it deserializes { "S": "three" } as "three"', () => {
		let deserialized = serializer.deserialize({ S: 'three' });

		expect(deserialized).toEqual('three');
	});
});