const JsonSerializer = require('./../../../../../../../aws/dynamo/schema/serialization/attributes/JsonSerializer');

describe('When a JsonSerializer is instantiated', () => {
	'use strict';

	let serializer;

	beforeEach(() => {
		serializer = new JsonSerializer();
	});

	it('it serializes { cat: "black" } as { "S": "{\"cat\":\"black\" }" }', () => {
		let serialized = serializer.serialize({ cat: "black" });

		expect(serialized.S).toEqual('{"cat":"black"}');
	});

	it('it deserializes { "S": "{\"cat\":\"black\" } as { cat: "black" }', () => {
		let deserialized = serializer.deserialize({ S: '{"cat":"black"}' });

		expect(deserialized && deserialized.hasOwnProperty('cat') && deserialized.cat).toEqual('black');
	});
});