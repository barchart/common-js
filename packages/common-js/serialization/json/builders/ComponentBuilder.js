import * as assert from './../../../lang/assert.js';

import Component from './../Component.js';
import DataType from './../DataType.js';
import Field from './../Field.js';

/**
 * A fluent interface for building a {@link Component} instance.
 *
 * @public
 */
export default class ComponentBuilder {
	#component;
	#name;

	/**
	 * @param {string} name - The name of the schema
	 */
	constructor(name) {
		this.#component = new Component(name);
	}

	/**
	 * The {@link Schema} current schema instance.
	 *
	 * @public
	 * @returns {Component}
	 */
	get component() {
		return this.#component;
	}

	/**
	 * Adds a new {@link Field} to the schema and returns the current instance.
	 *
	 * @public
	 * @param {string} name
	 * @param {DataType} dataType
	 * @returns {ComponentBuilder}
	 */
	withField(name, dataType) {
		assert.argumentIsRequired(name, 'name', String);
		assert.argumentIsRequired(dataType, 'dataType', DataType, 'DataType');

		const fields = this.#component.fields.concat([ new Field(name, dataType) ]);

		this.#component = new Component(this.#component.name, fields, this.#component.reviver);

		return this;
	}

	/**
	 * Adds a "reviver" function for use with JSON.parse.
	 *
	 * @public
	 * @param {Function} reviver
	 * @returns {ComponentBuilder}
	 */
	withReviver(reviver) {
		assert.argumentIsRequired(reviver, 'reviver', Function);

		this.#component = new Component(this.#component.name, this.#component.fields, reviver);

		return this;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[ComponentBuilder (name=${this.#name})]`;
	}
}
