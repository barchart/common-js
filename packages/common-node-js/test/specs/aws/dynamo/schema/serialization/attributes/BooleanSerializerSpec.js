const BooleanSerializer = require('./../../../../../../../aws/dynamo/schema/serialization/attributes/BooleanSerializer');

describe('When a BooleanSerializer is instantiated', () => {
	'use strict';

	let serializer;

	beforeEach(() => {
		serializer = new BooleanSerializer();
	});

	it('it serializes true as { "BOOL": true }', () => {
		let serialized = serializer.serialize(true);

		expect(serialized.BOOL).toEqual(true);
	});

	it('it deserializes { "BOOL": true } as true', () => {
		let deserialized = serializer.deserialize({ BOOL: true });

		expect(deserialized).toEqual(true);
	});
});