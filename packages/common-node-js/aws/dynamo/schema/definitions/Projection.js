import * as array from '@barchart/common-js/lang/array.js';
import * as is from '@barchart/common-js/lang/is.js';

import Attribute from './Attribute.js';
import ProjectionType from './ProjectionType.js';

/**
 * The {@link Attribute} definitions that are included (i.e. projected) onto
 * an {@link Index}.
 *
 * @public
 */
export default class Projection {
	#attributes;
	#type;

	/**
	 * @param {ProjectionType} type
	 * @param {*} attributes
	 */
	constructor(type, attributes) {
		this.#type = type;
		this.#attributes = attributes || [ ];
	}

	/**
	 * The projection type.
	 *
	 * @public
	 * @returns {ProjectionType}
	 */
	get type() {
		return this.#type;
	}

	/**
	 * The attributes that are "projected" (i.e. included) with an {@link Index}.
	 *
	 * @public
	 * @returns {Array<Attribute>}
	 */
	get attributes() {
		return [...this.#attributes];
	}

	/**
	 * Throws an {@link Error} if the instance is invalid.
	 *
	 * @public
	 */
	validate() {
		if (!(this.#type instanceof ProjectionType)) {
			throw new Error('Projection type is invalid.');
		}

		if (!is.array(this.#attributes)) {
			throw new Error('Projection must have an array of attributes.');
		}

		if (!this.#attributes.every(a => a instanceof Attribute)) {
			throw new Error('Projection attributes array can only contain attribute instances).');
		}

		if (array.uniqueBy(this.#attributes, a => a.name).length !== this.#attributes.length) {
			throw new Error('Projection attributes must be unique.');
		}

		if (this.#type === ProjectionType.CUSTOM && this.#attributes.length === 0) {
			throw new Error('Projection (custom) must have at least one attribute.');
		}

		if (this.#type === ProjectionType.KEYS && this.#attributes.length !== 0) {
			throw new Error('Projection (keys) cannot define any attributes.');
		}

		if (this.#type === ProjectionType.ALL && this.#attributes.length !== 0) {
			throw new Error('Projection (all) cannot define any attributes.');
		}

		this.#attributes.forEach(a => a.validate());
	}

	/**
	 * Generates an object which is suitable for use by the AWS SDK.
	 *
	 * @public
	 * @returns {object}
	 */
	toProjectionSchema() {
		this.validate();

		const schema = {
			ProjectionType: this.#type.code
		};

		if (this.#attributes.length > 0) {
			schema.NonKeyAttributes = this.#attributes.map(a => a.name);
		}

		return schema;
	}


	/**
	 * Returns true of this projection shares the same property values as the other projection.
	 *
	 * @public
	 * @param {Projection} other - The index to compare.
	 * @param {boolean=} relaxed - If true, the attributes are compared in "relaxed" mode.
	 * @returns {boolean}
	 */
	equals(other, relaxed) {
		if (other === this) {
			return true;
		}

		let returnVal = other instanceof Projection;

		if (returnVal) {
			returnVal = returnVal = this.#type === other.type;

			returnVal = returnVal && this.#attributes.length === other.attributes.length;
			returnVal = returnVal && this.#attributes.every(a => other.attributes.some(oa => oa.equals(a, relaxed)));
		}

		return returnVal;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Projection]';
	}
}
