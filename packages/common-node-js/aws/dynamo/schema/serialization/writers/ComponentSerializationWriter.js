import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';

import Component from './../../definitions/Component.js';
import Serializers from './../Serializers.js';
import Writer from './Writer.js';

/**
 * Reads a component value from a source object and writes it to
 * a target object, in the form required for saving to DynamoDB.
 *
 * @public
 * @extends {Writer}
 */
export default class ComponentSerializationWriter extends Writer {
	#component;
	#serializer;

	/**
	 * @param {Component} component - The component.
	 */
	constructor(component) {
		super();

		assert.argumentIsRequired(component, 'component', Component, 'Component');

		this.#component = component;
		this.#serializer = Serializers.forComponent(component);
	}

	/**
	 * Writes data from the stream.
	 *
	 * @protected
	 * @param {object} source - The source.
	 * @param {object} target - The target.
	 * @returns {*}
	 */
	_write(source, target) {
		const name = this.#component.name;

		const values = this.#serializer.serialize(source[name]);
		const definitions = this.#component.componentType.definitions;

		definitions.forEach((definition, i) => {
			const componentName = definition.getFieldName(name);

			target[componentName] = values[i];
		});
	}

	/**
	 * Indicates if the write can be performed.
	 *
	 * @protected
	 * @param {object} source - The source.
	 * @param {object} target - The target.
	 * @returns {boolean}
	 */
	_canWrite(source, target) {
		return this.#serializer !== null && is.object(source) && source.hasOwnProperty(this.#component.name);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[ComponentSerializationWriter]';
	}
}
