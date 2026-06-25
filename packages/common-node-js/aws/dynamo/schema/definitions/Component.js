import * as is from '@barchart/common-js/lang/is.js';

import ComponentType from './ComponentType.js';

/**
 * A group of {@link Attribute} instances that are logically related.
 *
 * @public
 */
export default class Component {
	#componentType;
	#name;

	/**
	 * @param {string} name - The name.
	 * @param {*} componentType - The component type.
	 */
	constructor(name, componentType) {
		this.#name = name;
		this.#componentType = componentType;
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
	 * @returns {ComponentType}
	 */
	get componentType() {
		return this.#componentType;
	}

	/**
	 * Throws an {@link Error} if the instance is invalid.
	 *
	 * @public
	 */
	validate() {
		if (!is.string(this.#name) || this.#name.length < 1) {
			throw new Error('Component name is invalid.');
		}

		if (!(this.#componentType instanceof ComponentType)) {
			throw new Error('Component type is invalid.');
		}
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
