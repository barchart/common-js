const is = require('@barchart/common-js/lang/is');

const ComponentType = require('./ComponentType');

module.exports = (() => {
	'use strict';

	/**
	 * A group of {@link Attribute} instances that are logically related.
	 *
	 * @public
	 */
	class Component {
		constructor(name, componentType) {
			this._name = name;
			this._componentType = componentType;
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
		get componentType() {
			return this._componentType;
		}

		/**
		 * Throws an {@link Error} if the instance is invalid.
		 *
		 * @public
		 */
		validate() {
			if (!is.string(this._name) || this._name.length < 1) {
				throw new Error('Component name is invalid.');
			}

			if (!(this._componentType instanceof ComponentType)) {
				throw new Error('Component type is invalid.');
			}
		}

		toString() {
			return `[Component (name=${this._name})]`;
		}
	}

	return Component;
})();