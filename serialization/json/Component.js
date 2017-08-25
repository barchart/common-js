const assert = require('./../../lang/assert'),
	is = require('./../../lang/is');

const ComponentType = require('./ComponentType');

module.exports = (() => {
	'use strict';

	/**
	 * A complex field, which when serialized, requires many data points.
	 *
	 * @public
	 * @param {String} name
	 * @param {ComponentType} componentType
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

		toString() {
			return `[Component (name=${this._name})]`;
		}
	}

	return Component;
})();