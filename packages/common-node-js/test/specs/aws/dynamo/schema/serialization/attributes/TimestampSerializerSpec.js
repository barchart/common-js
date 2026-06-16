import Timestamp from '@barchart/common-js/lang/Timestamp.js';

import TimestampSerializer from './../../../../../../../aws/dynamo/schema/serialization/attributes/TimestampSerializer.js';

describe('When a TimestampSerializer is instantiated', () => {
	'use strict';

	let serializer;

	beforeEach(() => {
		serializer = new TimestampSerializer();
	});

	it('it serializes a Timestamp instance (with a value of 1502377780551) as { N: "1502377780551" } }', () => {
		let serialized = serializer.serialize(new Timestamp(1502377780551));

		expect(serialized.N).toEqual('1502377780551');
	});

	it('it deserializes { N: "1502377780551" } as a Timestamp instance with the correct value', () => {
		let deserialized = serializer.deserialize({ N: "1502377780551" });

		expect(deserialized && (deserialized instanceof Timestamp) && deserialized.timestamp).toEqual(1502377780551);
	});
});