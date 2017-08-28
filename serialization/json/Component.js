const Currency = require('./../../lang/Currency'),
	Money = require('./../../lang/Money');

const DataType = require('./DataType'),
	Field = require('./Field');

module.exports = (() => {
	'use strict';

	/**
	 * A complex field built from many fields.
	 *
	 * @public
	 * @param {String} name
	 * @param {Array<Field>} componentType
	 */
	class Component {
		constructor(name, fields, reviver) {
			this._name = name;
			this._fields = fields || [ ];
			this._reviver = reviver;
		}

		/**
		 * Name of the component.
		 *
		 * @public
		 * @returns {String}
		 */
		get name() {
			return this._name;
		}

		/**
		 * Type of the component.
		 *
		 * @public
		 * @returns {ComponentType}
		 */
		get fields() {
			return this._fields;
		}

		/**
		 * The reviver used to rebuild the entire component.
		 *
		 * @returns {Function}
		 */
		get reviver() {
			return this._reviver;
		}

		/**
		 * The builds a {@link Component} for {@link Money}.
		 *
		 * @public
		 * @returns {Component}
		 */
		static forMoney(name) {
			return new Component(name, [
				new Field('decimal', DataType.DECIMAL),
				new Field('currency', DataType.forEnum(Currency, 'Currency'))
			], x => Money.parse(x));
		}

		toString() {
			return `[Component (name=${this._name})]`;
		}
	}

	return Component;
})();