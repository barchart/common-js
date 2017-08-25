var Attribute = require('./../../../../serialization/json/Attribute');
var DataType = require('./../../../../serialization/json/DataType');
var Schema = require('./../../../../serialization/json/Schema');

describe('When a person schema is created (first and last names)', function() {
	'use strict';

	var schema;

	beforeEach(function() {
		schema = new Schema('person', [
			new Attribute('first', DataType.STRING),
			new Attribute('last', DataType.STRING)
		]);
	});

	describe('and a schema-compliant object is created', function() {
		var object;

		beforeEach(function() {
			object = {
				first: 'bryan',
				last: 'ingle'
			};
		});

		describe('and the object is "stringified" as JSON', function() {
			var serialized;

			beforeEach(function() {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', function() {
				var deserialized;

				beforeEach(function() {
					deserialized = JSON.parse(serialized, schema.getReviver());
				});

				it('should have a "first" property with the expected value', function() {
					expect(deserialized.first).toEqual('bryan');
				});

				it('should have a "last" property with the expected value', function() {
					expect(deserialized.last).toEqual('ingle');
				})
			});
		});
	});
});