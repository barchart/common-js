const assert = require('@barchart/common-js/lang/assert'),
	is = require('@barchart/common-js/lang/is');

const Component = require('./../../definitions/Component'),
	Serializers = require('./../Serializers');

const Writer = require('./Writer');

module.exports = (() => {
	'use strict';

	/**
	 * Reads a component's value(s) from a source object, serialized for
	 * DynamoDB, and writes it to the target object.
	 *
	 * @public
	 * @extends {Writer}
	 * @param {Component} component
	 */
	class ComponentDeserializationWriter extends Writer {
		constructor(component) {
			super();

			assert.argumentIsRequired(component, 'component', Component, 'Component');

			this._component = component;
			this._serializer = Serializers.forComponent(component);
		}

		_write(source, target) {
			const name = this._component.name;
			const definitions = this._component.componentType.definitions;

			const values = definitions.map((definition) => {
				const componentName = definition.getFieldName(name);

				return source[componentName];
			});

			target[name] = this._serializer.deserialize(values);
		}

		_canWrite(source, target) {
			return this._serializer !== null && is.object(source) && source.hasOwnProperty(this._component.name);
		}

		toString() {
			return '[ComponentDeserializationWriter]';
		}
	}

	return ComponentDeserializationWriter;
})();