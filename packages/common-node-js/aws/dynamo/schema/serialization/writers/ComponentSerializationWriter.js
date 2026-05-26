const assert = require('@barchart/common-js/lang/assert'),
	is = require('@barchart/common-js/lang/is');

const Component = require('./../../definitions/Component'),
	Serializers = require('./../Serializers');

const Writer = require('./Writer');

module.exports = (() => {
	'use strict';

	/**
	 * Reads an component value from a source object and writes it to
	 * a target object, in the form required for saving to DynamoDB.
	 *
	 * @public
	 * @extends {Writer}
	 * @param {Component} component
	 */
	class ComponentSerializationWriter extends Writer {
		constructor(component) {
			super();

			assert.argumentIsRequired(component, 'component', Component, 'Component');

			this._component = component;
			this._serializer = Serializers.forComponent(component);
		}

		_write(source, target) {
			const name = this._component.name;

			const values = this._serializer.serialize(source[name]);
			const definitions = this._component.componentType.definitions;

			definitions.forEach((definition, i) => {
				const componentName = definition.getFieldName(name);

				target[componentName] = values[i];
			});
		}

		_canWrite(source, target) {
			return this._serializer !== null && is.object(source) && source.hasOwnProperty(this._component.name);
		}

		toString() {
			return '[ComponentSerializationWriter]';
		}
	}

	return ComponentSerializationWriter;
})();