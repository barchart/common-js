import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';

import Component from './../../definitions/Component.js';
import Serializers from './../Serializers.js';
import Writer from './Writer.js';

/**
 * Reads an component value from a source object and writes it to
 * a target object, in the form required for saving to DynamoDB.
 *
 * @public
 * @extends {Writer}
 * @param {Component} component
 */
export default class ComponentSerializationWriter extends Writer {
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
