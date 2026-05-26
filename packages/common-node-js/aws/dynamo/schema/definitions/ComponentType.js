const assert = require('@barchart/common-js/lang/assert'),
	Currency = require('@barchart/common-js/lang/Currency'),
	Money = require('@barchart/common-js/lang/Money');

const ComponentTypeDefinition = require('./ComponentTypeDefinition'),
	DataType = require('./DataType');

module.exports = (() => {
	'use strict';

	/**
	 * Defines the items that compose a component.
	 *
	 * @public
	 * @param {String} description
	 * @param {Array<ComponentTypeDefinition>} definitions
	 * @param {Function=} type
	 */
	class ComponentType {
		constructor(description, definitions, type) {
			assert.argumentIsRequired(description, 'description', String);
			assert.argumentIsArray(definitions, 'definitions', ComponentTypeDefinition, 'ComponentTypeDefinition');
			assert.argumentIsOptional(type, type, Function);

			if (definitions.length < 1) {
				throw new Error('The "definitions" array cannot be empty.');
			}

			this._description = description;
			this._definitions = definitions;

			this._type = type || null;
		}

		/**
		 * A description of the component type.
		 *
		 * @public
		 * @returns {*}
		 */
		get description() {
			return this._description;
		}

		/**
		 * Definition for the items that form a component.
		 *
		 * @public
		 * @returns {ComponentTypeDefinition[]}
		 */
		get definitions() {
			return this._definitions;
		}

		/**
		 * The type, which a component must be an instance of.
		 *
		 * @public
		 * @returns {Function|null}
		 */
		get type() {
			return this._type;
		}

		/**
		 * The component type for amount -- using a fixed precisions -- combined with a currency.
		 *
		 * @public
		 * @returns {ComponentType}
		 */
		static get MONEY() {
			return componentTypeAmount;
		}

		toString() {
			return `[ComponentType (description=${this._description})]`;
		}
	}

	const componentTypeAmount = new ComponentType('Money', [
		new ComponentTypeDefinition('amount', DataType.DECIMAL, 'amount'),
		new ComponentTypeDefinition('currency', DataType.forEnum(Currency, 'currency'), 'currency')
	], Money);

	return ComponentType;
})();