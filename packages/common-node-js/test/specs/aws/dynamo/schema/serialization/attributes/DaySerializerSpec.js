import Day from '@barchart/common-js/lang/Day.js';

import DaySerializer from './../../../../../../../aws/dynamo/schema/serialization/attributes/DaySerializer.js';

describe('When a DaySerializer is instantiated', () => {
	'use strict';

	let serializer;

	beforeEach(() => {
		serializer = new DaySerializer();
	});

	it('it serializes a Day instance (with a value of December 1st, 2017) as { S: "2017-12-01" } }', () => {
		let serialized = serializer.serialize(new Day(2017, 12, 1));

		expect(serialized.S).toEqual('2017-12-01');
	});

	it('it deserializes { S: "2017-12-01" } as a Day instance for December 1st, 2017', () => {
		let deserialized = serializer.deserialize({ S: '2017-12-01' });

		expect(deserialized && (deserialized instanceof Day) && deserialized.year === 2017 && deserialized.month === 12 && deserialized.day === 1).toEqual(true);
	});
});