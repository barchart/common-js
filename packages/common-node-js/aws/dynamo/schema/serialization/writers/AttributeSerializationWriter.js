const assert = require('@barchart/common-js/lang/assert'),
	attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const Attribute = require('./../../definitions/Attribute'),
	Serializers = require('./../Serializers');

const Writer = require('./Writer');

module.exports = (() => {
	'use strict';

	/**
	 * Reads an attribute value from a source object and writes it to
	 * a target object, in the form required for saving to DynamoDB.
	 *
	 * @public
	 * @extends {Writer}
	 * @param {Attribute} attribute
	 * @param {Boolean=} explicit - If true, derivation is suppressed.
	 */
	class AttributeSerializationWriter extends Writer {
		constructor(attribute, explicit) {
			super();

			assert.argumentIsRequired(attribute, 'attribute', Attribute, 'Attribute');

			this._attribute = attribute;
			this._serializer = Serializers.forAttribute(attribute);

			let validDelegate;
			let readDelegate;

			if (this._attribute.derivation === null || (is.boolean(explicit) && explicit)) {
				const attributeDelegates = getDelegatesForAttribute(this._attribute, false);

				validDelegate = attributeDelegates.valid;
				readDelegate = attributeDelegates.read;
			} else {
				const derivation = this._attribute.derivation;

				const derivationDelegates = derivation.attributes.map((a, i) => getDelegatesForAttribute(a, derivation.optionalities[i] || false));

				validDelegate = source => derivationDelegates.every(dd => dd.valid(source));
				readDelegate = source => derivation.generator(derivationDelegates.map(dd => dd.read(source)));
			}

			this._validDelegate = validDelegate;
			this._readDelegate = readDelegate;
		}

		_write(source, target) {
			const name = this._attribute.name;

			target[name] = this._serializer.serialize(this._readDelegate(source));
		}

		_canWrite(source, target) {
			return this._serializer !== null && is.object(source) && this._validDelegate(source);
		}

		toString() {
			return '[AttributeSerializationWriter]';
		}
	}

	function getDelegatesForAttribute(attribute, optional) {
		let existsDelegate;
		let extractDelegate;

		if (attribute.name.includes(Writer.SEPARATOR)) {
			const names = attribute.name.split(Writer.SEPARATOR);

			existsDelegate = source => attributes.has(source, names);
			extractDelegate = source => attributes.read(source, names);
		} else {
			const name = attribute.name;

			existsDelegate = source => source.hasOwnProperty(name);
			extractDelegate = source => source[name];
		}

		const valid = source => existsDelegate(source) || optional;
		const read = source => existsDelegate(source) ? extractDelegate(source) : null;

		return { valid, read };
	}

	return AttributeSerializationWriter;
})();