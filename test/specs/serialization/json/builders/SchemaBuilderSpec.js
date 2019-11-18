const Component = require('./../../../../../serialization/json/Component'),
	DataType = require('./../../../../../serialization/json/DataType'),
	SchemaBuilder = require('./../../../../../serialization/json/builders/SchemaBuilder');

describe('When using the schema builder to create a "Person" schema', () => {
	'use strict';

	let schemaBuilder;

	beforeEach(() => {
		schemaBuilder = SchemaBuilder.withName('person');
	});

	describe('that has a string-typed "name" field and a number-typed "age" field', () => {
		beforeEach(() => {
			schemaBuilder = schemaBuilder.withField('name', DataType.STRING)
				.withField('age', DataType.NUMBER);
		});

		describe('and the schema is pulled', () => {
			let schema;

			beforeEach(() => {
				schema = schemaBuilder.schema;
			});

			it('the name should be "person"', () => {
				expect(schema.name).toEqual('person');
			});

			it('there should be two fields', () => {
				expect(schema.fields.length).toEqual(2);
			});

			it('the first field should be string-typed and called "name"', () => {
				expect(schema.fields[0].name).toEqual('name');
				expect(schema.fields[0].dataType).toEqual(DataType.STRING);
			});

			it('the second field should be number-typed and called "age"', () => {
				expect(schema.fields[1].name).toEqual('age');
				expect(schema.fields[1].dataType).toEqual(DataType.NUMBER);
			});

			it('there should be no components', () => {
				expect(schema.components.length).toEqual(0);
			});
		});

		describe('and a "wallet" component is added to the schema', () => {
			beforeEach(() => {
				schemaBuilder = schemaBuilder.withComponent(Component.forMoney('wallet'));
			});

			describe('and the schema is pulled', () => {
				let schema;

				beforeEach(() => {
					schema = schemaBuilder.schema;
				});

				it('the name should be "person"', () => {
					expect(schema.name).toEqual('person');
				});

				it('there should be two fields', () => {
					expect(schema.fields.length).toEqual(2);
				});

				it('the first field should be string-typed and called "name"', () => {
					expect(schema.fields[0].name).toEqual('name');
					expect(schema.fields[0].dataType).toEqual(DataType.STRING);
				});

				it('the second field should be number-typed and called "age"', () => {
					expect(schema.fields[1].name).toEqual('age');
					expect(schema.fields[1].dataType).toEqual(DataType.NUMBER);
				});

				it('there should be one component', () => {
					expect(schema.components.length).toEqual(1);
				});

				it('the component should be named "wallet"', () => {
					expect(schema.components[0].name).toEqual('wallet');
				});
			});
		});


		describe('and a "custom" component is added to the schema (using a component builder)', () => {
			let reviver;

			beforeEach(() => {
				schemaBuilder = schemaBuilder.withComponentBuilder('custom', function(cb) {
					cb.withField('b', DataType.STRING)
						.withField('a', DataType.NUMBER)
						.withReviver(reviver = function(x) { return 'hola amigo'; });
				});
			});

			describe('and the schema is pulled', () => {
				let schema;

				beforeEach(() => {
					schema = schemaBuilder.schema;
				});

				it('the name should be "person"', () => {
					expect(schema.name).toEqual('person');
				});

				it('there should be two fields', () => {
					expect(schema.fields.length).toEqual(2);
				});

				it('the first field should be string-typed and called "name"', () => {
					expect(schema.fields[0].name).toEqual('name');
					expect(schema.fields[0].dataType).toEqual(DataType.STRING);
				});

				it('the second field should be number-typed and called "age"', () => {
					expect(schema.fields[1].name).toEqual('age');
					expect(schema.fields[1].dataType).toEqual(DataType.NUMBER);
				});

				it('there should be one component', () => {
					expect(schema.components.length).toEqual(1);
				});

				it('the component should be named "custom"', () => {
					expect(schema.components[0].name).toEqual('custom');
				});

				it('there component should have two fields', () => {
					expect(schema.components[0].fields.length).toEqual(2);
				});

				it('the component\'s first field should be string-typed and called "b"', () => {
					expect(schema.components[0].fields[0].name).toEqual('b');
					expect(schema.components[0].fields[0].dataType).toEqual(DataType.STRING);
				});

				it('the component\'s second field should be number-typed and called "a"', () => {
					expect(schema.components[0].fields[1].name).toEqual('a');
					expect(schema.components[0].fields[1].dataType).toEqual(DataType.NUMBER);
				});

				it('there component reviver function should be correct', () => {
					expect(schema.components[0].reviver).toBe(reviver);
				});
			});
		});
	});
});