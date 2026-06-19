import * as assert from '@barchart/common-js/lang/assert.js';

import AttributeSerializer from './AttributeSerializer.js';

/**
 * An {@link AttributeSerializer} that delegates it work.
 *
 * @public
 * @extends {AttributeSerializer}
 */
export default class DelegateSerializer extends AttributeSerializer {
	#baseSerializer;
	#serializeDelegate;
	#deserializeDelegate;

	/**
	 * @param {AttributeSerializer} baseSerializer - A serializer for the underlying type (e.g. string).
	 * @param {Function} serializeDelegate - The delegate which extracts the underlying value.
	 * @param {Function} deserializeDelegate - The delegate which rehydrates the underlying value.
	 */
	constructor(baseSerializer, serializeDelegate, deserializeDelegate) {
		super();

		assert.argumentIsRequired(baseSerializer, 'baseSerializer', AttributeSerializer, 'AttributeSerializer');
		assert.argumentIsRequired(serializeDelegate, 'serializeDelegate', Function);
		assert.argumentIsRequired(deserializeDelegate, 'deserializeDelegate', Function);

		this.#baseSerializer = baseSerializer;
		this.#serializeDelegate = serializeDelegate;
		this.#deserializeDelegate = deserializeDelegate;
	}

	/**
	 * Serializes a value.
	 *
	 * @public
	 * @param {*} value
	 * @returns {object}
	 */
	serialize(value) {
		return this.#baseSerializer.serialize(this.#serializeDelegate.call(this, value));
	}

	/**
	 * Deserializes a value.
	 *
	 * @public
	 * @param {*} wrapper
	 * @returns {*}
	 */
	deserialize(wrapper) {
		return this.#deserializeDelegate.call(this, this.#baseSerializer.deserialize(wrapper));
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[DelegateSerializer]';
	}
}
