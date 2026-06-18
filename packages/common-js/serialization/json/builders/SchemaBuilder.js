import * as assert from './../../../lang/assert.js';

import Component from './../Component.js';
import DataType from './../DataType.js';
import Field from './../Field.js';
import Schema from './../Schema.js';
import ComponentBuilder from './ComponentBuilder.js';

/**
 * A fluent interface for building a {@link Schema} instance.
 *
 * @public
 */
export default class SchemaBuilder {
	#schema;
	#name;

	/**
	 * @param {string} name - The name of the schema
	 */
	constructor(name) {
		this.#name = name;

		this.#schema = new Schema(name);
	}

	/**
	 * The {@link Schema} current schema instance.
	 *
	 * @public
	 * @returns {Schema}
	 */
	get schema() {
		return this.#schema;
	}

	/**
	 * Adds a new {@link Field} to the schema and returns the current instance.
	 *
	 * @public
	 * @param {string} name - The name of the new field.
	 * @param {DataType} dataType - The type of the new field.
	 * @param {boolean=} optional - If true, the field is not required and may be omitted.
	 * @returns {SchemaBuilder}
	 */
	withField(name, dataType, optional) {
		assert.argumentIsRequired(name, 'name', String);
		assert.argumentIsRequired(dataType, 'dataType', DataType, 'DataType');
		assert.argumentIsOptional(optional, 'optional', Boolean);

		const fields = this.#schema.fields.concat([ new Field(name, dataType, optional, false) ]);

		this.#schema = new Schema(this.#schema.name, fields, this.#schema.components, this.#schema.strict);

		return this;
	}

	/**
	 * Adds a new {@link Field} to the schema (where the field is an array) and returns the current instance.
	 *
	 * @public
	 * @param {string} name - The name of the new field.
	 * @param {DataType} dataType - The type of the new field.
	 * @param {boolean=} optional - If true, the field is not required and may be omitted.
	 * @returns {SchemaBuilder}
	 */
	withArray(name, dataType, optional) {
		assert.argumentIsRequired(name, 'name', String);
		assert.argumentIsRequired(dataType, 'dataType', DataType, 'DataType');
		assert.argumentIsOptional(optional, 'optional', Boolean);

		const fields = this.#schema.fields.concat([ new Field(name, dataType, optional, true) ]);

		this.#schema = new Schema(this.#schema.name, fields, this.#schema.components, this.#schema.strict);

		return this;
	}

	/**
	 * Adds a new {@link Component} to the schema and returns the current instance.
	 *
	 * @public
	 * @param {Component} component - The new component to add.
	 * @returns {SchemaBuilder}
	 */
	withComponent(component) {
		assert.argumentIsRequired(component, 'component', Component, 'Component');

		const components = this.#schema.components.concat([ component ]);

		this.#schema = new Schema(this.#schema.name, this.#schema.fields, components, this.#schema.strict);

		return this;
	}

	/**
	 * Adds a new {@link Component} to the schema, using a {@link ComponentBuilder}
	 * and returns the current instance.
	 *
	 * @public
	 * @param {string} name - The name of the new component.
	 * @param {Function} callback - A callback to which the {@link ComponentBuilder} is passed synchronously.
	 * @returns {SchemaBuilder}
	 */
	withComponentBuilder(name, callback) {
		assert.argumentIsRequired(name, 'name', String);

		const componentBuilder = new ComponentBuilder(name);

		callback(componentBuilder);

		return this.withComponent(componentBuilder.component);
	}

	/**
	 * Creates a new {@link SchemaBuilder}.
	 *
	 * @public
	 * @static
	 * @param {string} name
	 * @returns {SchemaBuilder}
	 */
	static withName(name) {
		assert.argumentIsRequired(name, 'name', String);

		return new SchemaBuilder(name);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[SchemaBuilder (name=${this.#name})]`;
	}
}
