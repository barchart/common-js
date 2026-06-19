import Enum from '@barchart/common-js/lang/Enum.js';

/**
 * Defines a category of {@link Projection}. Currently, there are three types;
 * projecting all table's attributes, projecting only the table's keys, and
 * projecting a custom subset of the table's attributes.
 *
 * @public
 * @extends {Enum}
 */
export default class ProjectionType extends Enum {
	/**
	 * @param {string} code
	 * @param {string} description
	 */
	constructor(code, description) {
		super(code, description);
	}

	/**
	 * Returns the custom.
	 *
	 * @public
	 * @returns {boolean}
	 */
	get custom() {
		return this.code === ProjectionType.CUSTOM.code;
	}

	/**
	 * Returns the all.
	 *
	 * @public
	 * @static
	 */
	static get ALL() {
		return projectionTypeAll;
	}

	/**
	 * Returns the keys.
	 *
	 * @public
	 * @static
	 */
	static get KEYS() {
		return projectionTypeKeys;
	}

	/**
	 * Returns the custom.
	 *
	 * @public
	 * @static
	 */
	static get CUSTOM() {
		return projectionTypeCustom;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[ProjectionType (code=${this.code})]`;
	}
}

const projectionTypeAll = new ProjectionType('ALL', 'All');
const projectionTypeKeys = new ProjectionType('KEYS_ONLY', 'Keys');
const projectionTypeCustom = new ProjectionType('INCLUDE', 'Custom');
