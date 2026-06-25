import * as assert from '@barchart/common-js/lang/assert.js';

import Component from './../definitions/Component.js';
import ComponentType from './../definitions/ComponentType.js';

/**
 * Fluent interface for building a {@link Component}.
 *
 * @public
 */
export default class ComponentBuilder {
	#component;

	/**
	 * @param {string} name - The name.
	 */
	constructor(name) {
		assert.argumentIsRequired(name, 'name', String);

		this.#component = new Component(name, null);
	}

	/**
	 * The {@link Component}, given all the information provided thus far.
	 *
	 * @public
	 * @returns {Component}
	 */
	get component() {
		return this.#component;
	}

	/**
	 * Sets the {@link ComponentType} and returns the current instance.
	 *
	 * @public
	 * @param {ComponentType} componentType
	 * @returns {ComponentBuilder}
	 */
	withComponentType(componentType) {
		assert.argumentIsRequired(componentType, 'componentType', ComponentType, 'ComponentType');

		this.#component = new Component(this.#component.name, componentType);

		return this;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[ComponentBuilder]';
	}
}
