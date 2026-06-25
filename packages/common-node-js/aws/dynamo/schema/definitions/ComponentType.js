import * as assert from '@barchart/common-js/lang/assert.js';

import Currency from '@barchart/common-js/lang/Currency.js';
import Money from '@barchart/common-js/lang/Money.js';

import ComponentTypeDefinition from './ComponentTypeDefinition.js';
import DataType from './DataType.js';

/**
 * Defines the items that compose a component.
 *
 * @public
 */
export default class ComponentType {
	#definitions;
	#description;
	#type;

	/**
	 * @param {string} description - The description.
	 * @param {Array<ComponentTypeDefinition>} definitions - The definitions.
	 * @param {Function=} type - The type.
	 */
	constructor(description, definitions, type) {
		assert.argumentIsRequired(description, 'description', String);
		assert.argumentIsArray(definitions, 'definitions', ComponentTypeDefinition, 'ComponentTypeDefinition');
		assert.argumentIsOptional(type, 'type', Function);

		if (definitions.length < 1) {
			throw new Error('The "definitions" array cannot be empty.');
		}

		this.#description = description;
		this.#definitions = definitions;

		this.#type = type || null;
	}

	/**
	 * A description of the component type.
	 *
	 * @public
	 * @returns {*}
	 */
	get description() {
		return this.#description;
	}

	/**
	 * Definition for the items that form a component.
	 *
	 * @public
	 * @returns {ComponentTypeDefinition[]}
	 */
	get definitions() {
		return this.#definitions;
	}

	/**
	 * The type, which a component must be an instance of.
	 *
	 * @public
	 * @returns {Function|null}
	 */
	get type() {
		return this.#type;
	}

	/**
	 * The component type for amount -- using a fixed precisions -- combined with a currency.
	 *
	 * @public
	 * @static
	 * @returns {ComponentType}
	 */
	static get MONEY() {
		return componentTypeAmount;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[ComponentType (description=${this.#description})]`;
	}
}

const componentTypeAmount = new ComponentType('Money', [
	new ComponentTypeDefinition('amount', DataType.DECIMAL, 'amount'),
	new ComponentTypeDefinition('currency', DataType.forEnum(Currency, 'currency'), 'currency')
], Money);
