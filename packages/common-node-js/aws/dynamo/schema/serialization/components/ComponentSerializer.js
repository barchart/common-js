const assert = require('@barchart/common-js/lang/assert');

const ComponentType = require('./../../definitions/ComponentType'),
	Serializers = require('./../Serializers');

module.exports = (() => {
	'use strict';

	/**
	 * Converts a complex object (i.e. a component) into an array
	 * of objects which define DynamoDB values. Also performs the
	 * inverse.
	 *
	 * @public
	 * @interface
	 */
	class ComponentSerializer {
		constructor(componentType) {
			assert.argumentIsRequired(componentType, 'componentType', ComponentType, 'ComponentType');

			this._componentType = componentType;
		}

		/**
		 * Reads a complex component, and emits an array of DynamoDB values,
		 * in the order defined by by {@link ComponentType#defintitions}.
		 *
		 * @public
		 * @param {*} source - The component object.
		 * @returns {Array} - An array of serialized component values.
		 */
		serialize(source) {
			let serialized = [ ];

			const definitions = this._componentType.definitions;
			const values = this._readComponent(source);

			if (values !== null && values.length === definitions.length) {
				serialized = definitions.map((ctd) => {
					const serializer = Serializers.forDataType(ctd.dataType);

					return serializer.serialize(values[i]);
				});
			}

			return serialized;
		}

		/**
		 * Reads each property value from the source component and returns
		 * an array of primitive values, in the order defined by by
		 * {@link ComponentType#defintitions}.
		 *
		 * @protected
		 * @abstract
		 * @param {*} source - The component object.
		 * @returns {Array} - The primitive values that compose the component.
		 */
		_readComponent(source) {
			return null;
		}

		/**
		 * Generates a complex component, from an array of DynamoDB object, assuming
		 * the array is ordered according to {@link ComponentType#defintitions}.
		 *
		 * @param {Array} values - An array of serialized component values.
		 * @returns {*} - The component object.
		 */
		deserialize(values) {
			assert.argumentIsArray(values, 'values');

			const definitions = this._componentType.definitions;

			return this._createComponent(
				definitions.map((ctd, i) => {
					const serializer = Serializers.forDataType(ctd.dataType);

					return serializer.deserialize(values[i]);
				})
			);
		}

		/**
		 * Given an array of data points, in the same order as the
		 * {@link ComponentType#definitions} array, return a single
		 * component object.
		 *
		 * @protected
		 * @abstract
		 * @param {Array} values
		 * @returns {*}
		 */
		_createComponent(values) {
			return null;
		}

		toString() {
			return '[ComponentSerializer]';
		}
	}

	return ComponentSerializer;
})();