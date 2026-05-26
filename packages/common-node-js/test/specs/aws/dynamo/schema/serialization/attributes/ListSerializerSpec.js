const ListSerializer = require('./../../../../../../../aws/dynamo/schema/serialization/attributes/NestedSerializers').ListSerializer;

describe('When a ListSerializer is instantiated', () => {
	'use strict';

	let serializer;

	beforeEach(() => {
		serializer = new ListSerializer();
	});

	it('it serializes ["String 1", 2] as { "L": [ { "S": "String 1" }, { "N": "2" } ] }', () => {
		let serialized = serializer.serialize(['String 1', 2]);

		expect(serialized.L).toEqual([ { S: 'String 1' }, { N: '2' } ]);
	});

	it('it deserializes { "L": [ { "S": "String 1" }, { "N": "2" } ] } as ["123", 2]', () => {
		let deserialized = serializer.deserialize({ L: [ { S: 'String 1' }, { N: '2' } ] });

		expect(deserialized).toEqual(['String 1', 2]);
	});

	it('it serializes ["String 1", 2, ["String 2"]] as { "L": [ { "S": "String 1" }, { "N": "2" }, { "L" : [ { "S": "String 2" } ] } ] }', () => {
		let serialized = serializer.serialize(['String 1', 2, ["String 2"]]);

		expect(serialized.L).toEqual([ { S: 'String 1' }, { N: '2' }, { L: [ { S: 'String 2' } ] } ]);
	});

	it('it deserializes { "L": [ { "S": "String 1" }, { "N": "2" }, { "L" : [ { "S": "String 2" } ] } ] } as ["String 1", 2, ["String 2"]]', () => {
		let deserialized = serializer.deserialize({ L: [ { S: 'String 1' }, { N: '2' }, { L : [ { S: 'String 2' } ] } ] });

		expect(deserialized).toEqual(['String 1', 2, ['String 2']]);
	});

	it('it serializes [true, "String 1"] as { "L": [ { "BOOL": true }, { "S": "String 1" } ] }', () => {
		let serialized = serializer.serialize([true, 'String 1']);

		expect(serialized).toEqual({ L: [ { BOOL: true }, { S: 'String 1' } ] });
	});

	it('it deserializes { "L": [ { "BOOL": true }, { "S": "String 1" } ] } as [true, "String 1"]', () => {
		let deserialized = serializer.deserialize({ L: [ { BOOL: true }, { S: 'String 1' } ] });

		expect(deserialized).toEqual([true, 'String 1']);
	});

	it('it serializes [{"Name": "Joe", "Age": 35}, "String 1"] as { "L": [ { "M": {"Name": {"S": "Joe"}, "Age": {"N": "35"}} }, { "S": "String 1" } ] }', () => {
		let serialized = serializer.serialize([{Name: "Joe", Age: 35}, "String 1"]);

		expect(serialized).toEqual({ L: [ { M: {Name: {S: "Joe"}, Age: {N: "35"}} }, { S: "String 1" } ] });
	});

	it('it deserializes { "L": [ { "M": {"Name": {"S": "Joe"}, "Age": {"N": "35"}} }, { "S": "String 1" } ] } as [{"Name": "Joe", "Age": 35}, "String 1"]', () => {
		let deserialized = serializer.deserialize({ L: [ { M: {Name: {S: "Joe"}, Age: {N: "35"}} }, { S: "String 1" } ] });

		expect(deserialized).toEqual([{Name: "Joe", Age: 35}, "String 1"]);
	});
});
