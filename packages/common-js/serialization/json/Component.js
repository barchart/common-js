import Currency from './../../lang/Currency.js';
import Money from './../../lang/Money.js';
import DataType from './DataType.js';
import Field from './Field.js';

/**
 * A complex object built from many {@link Field} instances.
 *
 * @public
 */
export default class Component {
	#name;
	#fields;
	#reviver;

	/**
	 * @param {string} name
	 * @param {Array<Field>=} fields
	 * @param {Function=} reviver
	 */
	constructor(name, fields, reviver) {
		this.#name = name;
		this.#fields = fields || [ ];
		this.#reviver = reviver;
	}

	/**
	 * Name of the component.
	 *
	 * @public
	 * @returns {string}
	 */
	get name() {
		return this.#name;
	}

	/**
	 * Type of the component.
	 *
	 * @public
	 * @returns {Array<Field>}
	 */
	get fields() {
		return this.#fields;
	}

	/**
	 * The reviver used to rebuild the entire component.
	 *
	 * @returns {Function}
	 */
	get reviver() {
		return this.#reviver;
	}

	/**
	 * The builds a {@link Component} for {@link Money}.
	 *
	 * @public
	 * @static
	 * @param {string} name
	 * @returns {Component}
	 */
	static forMoney(name) {
		return new Component(name, [ new Field('decimal', DataType.DECIMAL), new Field('currency', DataType.forEnum(Currency, 'Currency')) ], x => Money.parse(x));
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[Component (name=${this.#name})]`;
	}
}
