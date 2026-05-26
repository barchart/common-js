const Decimal = require('@barchart/common-js/lang/Decimal');

const DecimalSerializer = require('./../../../../../../../aws/dynamo/schema/serialization/attributes/DecimalSerializer');

describe('When a DecimalSerializer is instantiated', () => {
	'use strict';

	let serializer;

	beforeEach(() => {
		serializer = new DecimalSerializer();
	});

	it('it serializes a Decimal instance (with a value of 3.1416) as { S: "3.1416" } }', () => {
		let serialized = serializer.serialize(new Decimal(3.1416));

		expect(serialized.S).toEqual('3.1416');
	});

	it('it deserializes { S: "3.1416" } as a Decimal with a value of 3.1416', () => {
		let deserialized = serializer.deserialize({ S: '3.1416' });

		expect(deserialized && (deserialized instanceof Decimal) && deserialized.toFixed()).toEqual('3.1416');
	});
});