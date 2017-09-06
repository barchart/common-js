const assert = require('./../../../lang/assert'),
	is = require('./../../../lang/is');

const Component = require('./../Component'),
	DataType = require('./../DataType'),
	Field = require('./../Field'),
	Schema = require('./../Schema');

const ComponentBuilder = require('./ComponentBuilder');

module.exports = (() => {
	'use strict';

	/**
	 * A fluent interface for building a {@link Schema} instance.
	 *
	 * @public
	 * @param {String} name - The name of the schema
	 */
	class SchemaBuilder {
		constructor(name) {
			this._schema = new Schema(name);
		}

		/**
		 * The {@link Schema} current schema instance.
		 *
		 * @public
		 * @returns {Schema}
		 */
		get schema() {
			return this._schema;
		}

		/**
		 * Adds a new {@link Field} to the schema and returns the current instance.
		 *
		 * @public
		 * @param {String} name - The name of the new field.
		 * @param {DataType} dataType - The type of the new field.
		 * @param {Boolean=} optional - If true, the field is not required and may be omitted.
		 * @returns {SchemaBuilder}
		 */
		withField(name, dataType, optional) {
			assert.argumentIsRequired(name, 'name', String);
			assert.argumentIsRequired(dataType, 'dataType', DataType, 'DataType');
			assert.argumentIsOptional(optional, 'optional', Boolean);

			const optionalToUse = is.boolean(optional) && optional;
			const fields = this._schema.fields.concat([ new Field(name, dataType, optionalToUse) ]);

			this._schema = new Schema(this._schema.name, fields, this._schema.components, this._schema.strict);

			return this;
		}

		/**
		 * Adds a new {@link Component} to the schema, using a {@link ComponentBuilder}
		 * and returns the current instance.
		 *
		 * @public
		 * @param {String} name - The name of the new component.
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
		 * Adds a new {@link Component} to the schema and returns the current instance.
		 *
		 * @public
		 * @param {Component} component - The new component to add.
		 * @returns {SchemaBuilder}
		 */
		withComponent(component) {
			assert.argumentIsRequired(component, 'component', Component, 'Component');

			const components = this._schema.components.concat([ component ]);

			this._schema = new Schema(this._schema.name, this._schema.fields, components, this._schema.strict);

			return this;
		}

		/**
		 * Creates a new {@link SchemaBuilder}.
		 *
		 * @public
		 * @param {String} name
		 * @returns {SchemaBuilder}
		 */
		static withName(name) {
			assert.argumentIsRequired(name, 'name', String);

			return new SchemaBuilder(name);
		}

		toString() {
			return `[SchemaBuilder (name=${this._name})]`;
		}
	}

	return SchemaBuilder;
})();