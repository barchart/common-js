const StringSetSerializer = require('./../../../../../../../aws/dynamo/schema/serialization/attributes/StringSetSerializer');

describe('When a StringSetSerializer is instantiated', () => {
	'use strict';

	let serializer;

	beforeEach(() => {
		serializer = new StringSetSerializer();
	});

	it('it serializes ["one", "two"] as { "SS": ["one", "two"] }', () => {
		let serialized = serializer.serialize(['one', 'two']);

		expect(serialized.SS).toEqual(['one', 'two']);
	});

	it('it deserializes { "SS": ["one", "two"] } as ["one", "two"]', () => {
		let deserialized = serializer.deserialize({ SS: ['one', 'two'] });

		expect(deserialized).toEqual(['one', 'two']);
	});
});
