const NumberSerializer = require('./../../../../../../../aws/dynamo/schema/serialization/attributes/NumberSerializer');

describe('When a NumberSerializer is instantiated', () => {
	'use strict';

	let serializer;

	beforeEach(() => {
		serializer = new NumberSerializer();
	});

	it('it serializes 3 as { "N": 3 }', () => {
		let serialized = serializer.serialize(3);

		expect(serialized.N).toEqual('3');
	});

	it('it deserializes { "N": 3 } as 3', () => {
		let deserialized = serializer.deserialize({ N: '3' });

		expect(deserialized).toEqual(3);
	});
});