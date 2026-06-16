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
 * @param {Attribute} attribute
 */
export default class AttributeDeserializationWriter extends Writer {
	constructor(attribute) {
		super();

		assert.argumentIsRequired(attribute, 'attribute', Attribute, 'Attribute');

		this._attribute = attribute;
		this._serializer = Serializers.forAttribute(attribute);

		let writeDelegate;

		if (this._attribute.name.includes(Writer.SEPARATOR)) {
			const names = this._attribute.name.split(Writer.SEPARATOR);

			writeDelegate = (target, value) => attributes.write(target, names, value);
		} else {
			const name = this._attribute.name;

			writeDelegate = (target, value) => target[name] = value;
		}

		this._writeDelegate = writeDelegate;
	}

	_write(source, target) {
		this._writeDelegate(target, this._serializer.deserialize(source[this._attribute.name]));
	}

	_canWrite(source, target) {
		return this._serializer !== null && is.object(source) && source.hasOwnProperty(this._attribute.name);
	}

	toString() {
		return '[AttributeDeserializationWriter]';
	}
}
