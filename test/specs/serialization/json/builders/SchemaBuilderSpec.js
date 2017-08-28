var Component = require('./../../../../../serialization/json/Component');
var DataType = require('./../../../../../serialization/json/DataType');
var SchemaBuilder = require('./../../../../../serialization/json/builders/SchemaBuilder');

describe('When using the schema builder to create a "Person" schema', function() {
	'use strict';

	var schemaBuilder;

	beforeEach(function() {
		schemaBuilder = SchemaBuilder.withName('person');
	});

	describe('that has a string-typed "name" field and a number-typed "age" field', function() {
		beforeEach(function() {
			schemaBuilder = schemaBuilder.withField('name', DataType.STRING)
				.withField('age', DataType.NUMBER);
		});

		describe('and the schema is pulled', function() {
			var schema;

			beforeEach(function() {
				schema = schemaBuilder.schema;
			});

			it('the name should be "person"', function() {
				expect(schema.name).toEqual('person');
			});

			it('there should be two fields', function() {
				expect(schema.fields.length).toEqual(2);
			});

			it('the first field should be string-typed and called "name"', function() {
				expect(schema.fields[0].name).toEqual('name');
				expect(schema.fields[0].dataType).toEqual(DataType.STRING);
			});

			it('the second field should be number-typed and called "age"', function() {
				expect(schema.fields[1].name).toEqual('age');
				expect(schema.fields[1].dataType).toEqual(DataType.NUMBER);
			});

			it('there should be no components', function() {
				expect(schema.components.length).toEqual(0);
			});
		});

		describe('and a "wallet" component is added to the schema', function() {
			beforeEach(function() {
				schemaBuilder = schemaBuilder.withComponent(Component.forMoney('wallet'));
			});

			describe('and the schema is pulled', function() {
				var schema;

				beforeEach(function() {
					schema = schemaBuilder.schema;
				});

				it('the name should be "person"', function() {
					expect(schema.name).toEqual('person');
				});

				it('there should be two fields', function() {
					expect(schema.fields.length).toEqual(2);
				});

				it('the first field should be string-typed and called "name"', function() {
					expect(schema.fields[0].name).toEqual('name');
					expect(schema.fields[0].dataType).toEqual(DataType.STRING);
				});

				it('the second field should be number-typed and called "age"', function() {
					expect(schema.fields[1].name).toEqual('age');
					expect(schema.fields[1].dataType).toEqual(DataType.NUMBER);
				});

				it('there should be one component', function() {
					expect(schema.components.length).toEqual(1);
				});

				it('the component should be named "wallet"', function() {
					expect(schema.components[0].name).toEqual('wallet');
				});
			});
		});


		describe('and a "custom" component is added to the schema (using a component builder)', function() {
			var reviver;

			beforeEach(function() {
				schemaBuilder = schemaBuilder.withComponentBuilder('custom', function(cb) {
					cb.withField('b', DataType.STRING)
						.withField('a', DataType.NUMBER)
						.withReviver(reviver = function(x) { return 'hola amigo'; });
				});
			});

			describe('and the schema is pulled', function() {
				var schema;

				beforeEach(function() {
					schema = schemaBuilder.schema;
				});

				it('the name should be "person"', function() {
					expect(schema.name).toEqual('person');
				});

				it('there should be two fields', function() {
					expect(schema.fields.length).toEqual(2);
				});

				it('the first field should be string-typed and called "name"', function() {
					expect(schema.fields[0].name).toEqual('name');
					expect(schema.fields[0].dataType).toEqual(DataType.STRING);
				});

				it('the second field should be number-typed and called "age"', function() {
					expect(schema.fields[1].name).toEqual('age');
					expect(schema.fields[1].dataType).toEqual(DataType.NUMBER);
				});

				it('there should be one component', function() {
					expect(schema.components.length).toEqual(1);
				});

				it('the component should be named "custom"', function() {
					expect(schema.components[0].name).toEqual('custom');
				});

				it('there component should have two fields', function() {
					expect(schema.components[0].fields.length).toEqual(2);
				});

				it('the component\'s first field should be string-typed and called "b"', function() {
					expect(schema.components[0].fields[0].name).toEqual('b');
					expect(schema.components[0].fields[0].dataType).toEqual(DataType.STRING);
				});

				it('the component\'s second field should be number-typed and called "a"', function() {
					expect(schema.components[0].fields[1].name).toEqual('a');
					expect(schema.components[0].fields[1].dataType).toEqual(DataType.NUMBER);
				});

				it('there component reviver function should be correct', function() {
					expect(schema.components[0].reviver).toBe(reviver);
				});
			});
		});
	});
});