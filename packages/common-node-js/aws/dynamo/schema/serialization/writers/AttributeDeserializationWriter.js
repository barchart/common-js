const assert = require('@barchart/common-js/lang/assert'),
	attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const Attribute = require('./../../definitions/Attribute'),
	Serializers = require('./../Serializers');

const Writer = require('./Writer');

module.exports = (() => {
	'use strict';

	/**
	 * Reads an attribute value from a source object, serialized for
	 * DynamoDB, and writes it to the target object.
	 *
	 * @public
	 * @extends {Writer}
	 * @param {Attribute} attribute
	 */
	class AttributeDeserializationWriter extends Writer {
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

	return AttributeDeserializationWriter;
})();