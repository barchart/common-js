var Day = require('./../../../../lang/Day');

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
				});
			});
		});
	});
});


describe('When a person schema is created (grouped first and last names with a birthday)', function() {
	'use strict';

	var schema;

	beforeEach(function() {
		schema = new Schema('person', [
			new Attribute('name.first', DataType.STRING),
			new Attribute('name.last', DataType.STRING),
			new Attribute('birthday', DataType.DAY)
		]);
	});

	describe('and a schema-compliant object is created', function() {
		var object;

		beforeEach(function() {
			object = {
				name: {
					first: 'bryan',
					last: 'ingle'
				},
				birthday: new Day(1974, 10, 20)
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
					try {
						deserialized = JSON.parse(serialized, schema.getReviver());
					} catch (e) {
						console.log(e);
					}
				});

				it('should have a "name.first" property with the expected value', function() {
					expect(deserialized.name.first).toEqual('bryan');
				});

				it('should have a "name.last" property with the expected value', function() {
					expect(deserialized.name.last).toEqual('ingle');
				});

				it('should have a "birthday" property with the expected value', function() {
					expect(deserialized.birthday.year).toEqual(1974);
					expect(deserialized.birthday.month).toEqual(10);
					expect(deserialized.birthday.day).toEqual(20);
				});
			});
		});
	});
});