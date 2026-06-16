import * as assert from '@barchart/common-js/lang/assert.js';

import Component from './../definitions/Component.js';
import ComponentType from './../definitions/ComponentType.js';

/**
 * Fluent interface for building a {@link Component}.
 *
 * @public
 * @param {string} name
 */
export default class ComponentBuilder {
	constructor(name) {
		assert.argumentIsRequired(name, 'name', String);

		this._component = new Component(name, null);
	}

	/**
	 * The {@link Component}, given all the information provided thus far.
	 *
	 * @public
	 * @returns {Component}
	 */
	get component() {
		return this._component;
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

		this._component = new Component(this._component.name, componentType);

		return this;
	}

	toString() {
		return '[ComponentBuilder]';
	}
}
