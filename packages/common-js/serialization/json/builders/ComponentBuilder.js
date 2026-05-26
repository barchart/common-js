const assert = require('./../../../lang/assert');

const Component = require('./../Component'),
	DataType = require('./../DataType'),
	Field = require('./../Field');

module.exports = (() => {
	'use strict';

	/**
	 * A fluent interface for building a {@link Component} instance.
	 *
	 * @public
	 * @param {String} name - The name of the schema
	 */
	class ComponentBuilder {
		constructor(name) {
			this._component = new Component(name);
		}

		/**
		 * The {@link Schema} current schema instance.
		 *
		 * @public
		 * @returns {Component}
		 */
		get component() {
			return this._component;
		}

		/**
		 * Adds a new {@link Field} to the schema and returns the current instance.
		 *
		 * @public
		 * @param {String} name
		 * @param {DataType} dataType
		 * @returns {ComponentBuilder}
		 */
		withField(name, dataType) {
			assert.argumentIsRequired(name, 'name', String);
			assert.argumentIsRequired(dataType, 'dataType', DataType, 'DataType');

			const fields = this._component.fields.concat([ new Field(name, dataType) ]);

			this._component = new Component(this._component.name, fields, this._component.reviver);

			return this;
		}

		/**
		 * Adds a "reviver" function for use with JSON.parse.
		 *
		 * @public
		 * @param {String} name
		 * @param {DataType} dataType
		 * @returns {ComponentBuilder}
		 */
		withReviver(reviver) {
			assert.argumentIsRequired(reviver, 'reviver', Function);

			this._component = new Component(this._component.name, this._component.fields, reviver);

			return this;
		}

		toString() {
			return `[ComponentBuilder (name=${this._name})]`;
		}
	}

	return ComponentBuilder;
})();