const MapSerializer = require('./../../../../../../../aws/dynamo/schema/serialization/attributes/NestedSerializers').MapSerializer;

describe('When a MapSerializer is instantiated', () => {
	'use strict';

	let serializer;

	beforeEach(() => {
		serializer = new MapSerializer();
	});

	it('it serializes { "Name": "Joe", "Age": 35 } as { "M": {"Name": {"S": "Joe"}, "Age": {"N": "35"}} }', () => {
		let serialized = serializer.serialize({ Name: 'Joe', Age: 35 });

		expect(serialized.M).toEqual({ Name: { S: 'Joe' }, Age: { N: '35' } });
	});

	it('it deserializes { "M": {"Name": {"S": "Joe"}, "Age": {"N": "35"}} } as { "Name": "Joe", "Age": 35 }', () => {
		let deserialized = serializer.deserialize({ M: { Name: { S: 'Joe' }, Age: { N: 35 } } });

		expect(deserialized).toEqual({ Name: 'Joe', Age: 35 });
	});
});
