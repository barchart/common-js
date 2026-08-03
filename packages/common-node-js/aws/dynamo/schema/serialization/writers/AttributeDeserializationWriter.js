import * as assert from '@barchart/common-js/lang/assert.js';
import * as attributes from '@barchart/common-js/lang/attributes.js';
import * as is from '@barchart/common-js/lang/is.js';

import Attribute from './../../definitions/Attribute.js';
import Serializers from './../Serializers.js';
import Writer from './Writer.js';

/**
 * Reads an attribute value from a source object, serialized for
 * DynamoDB, and writes it to the target object.
 *
 * @public
 * @extends {Writer}
 */
export default class AttributeDeserializationWriter extends Writer {
	#attribute;
	#serializer;
	#writeDelegate;

	/**
	 * @param {Attribute} attribute - The attribute.
	 */
	constructor(attribute) {
		super();

		assert.argumentIsRequired(attribute, 'attribute', Attribute, 'Attribute');

		this.#attribute = attribute;
		this.#serializer = Serializers.forAttribute(attribute);

		let writeDelegate;

		if (this.#attribute.name.includes(Writer.SEPARATOR)) {
			const names = this.#attribute.name.split(Writer.SEPARATOR);

			writeDelegate = (target, value) => attributes.write(target, names, value);
		} else {
			const name = this.#attribute.name;

			writeDelegate = (target, value) => target[name] = value;
		}

		this.#writeDelegate = writeDelegate;
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
		this.#writeDelegate(target, this.#serializer.deserialize(source[this.#attribute.name]));
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
		return this.#serializer !== null && is.object(source) && Object.hasOwn(source, this.#attribute.name);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[AttributeDeserializationWriter]';
	}
}
