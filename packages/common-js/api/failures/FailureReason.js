import * as assert from './../../lang/assert.js';
import * as is from './../../lang/is.js';

import FailureReasonItem from './FailureReasonItem.js';
import FailureType from './FailureType.js';
import Schema from './../../serialization/json/Schema.js';
import Tree from './../../collections/Tree.js';

/**
 * @typedef {import('./../../lang/Enum.js').default} Enum
 */

/**
 * An Enum instance that contains a serialization schema.
 *
 * @typedef {Enum & {schema: Schema}} EnumWithSchema
 */

/**
 * Describes all the reasons for API failure. Since there can be multiple
 * reasons, the reasons are stored in a tree structure.
 *
 * @public
 */
export default class FailureReason {
	#data;
	#root;
	#current;

	/**
	 * @param {object=} data - Data regarding the API request itself, likely independent of the failure data maintained in the tree structure.
	 */
	constructor(data) {
		this.#data = data || null;

		this.#root = new Tree(null);
		this.#current = this.#root;
	}

	/**
	 * Adds a {@link FailureReasonItem} to the tree of reasons at the current node.
	 *
	 * @public
	 * @param {FailureType} type - The failure type.
	 * @param {object=} data - The data associated with the failure type.
	 * @param {boolean=} group - Whether the newly added item is expected to have children.
	 * @returns {FailureReason} The current instance, allowing for method chaining.
	 */
	addItem(type, data, group) {
		assert.argumentIsRequired(type, 'type', FailureType, 'FailureType');
		assert.argumentIsOptional(group, 'group', Boolean);

		const node = this.#current.addChild(new FailureReasonItem(type, data));

		if (is.boolean(group) && group) {
			this.#current = node;
		}

		return this;
	}

	/**
	 * Resets the current node to the head of the tree.
	 *
	 * @public
	 * @param {boolean=} previous
	 * @returns {FailureReason} The current instance, allowing for method chaining.
	 */
	reset(previous) {
		assert.argumentIsOptional(previous, 'previous', Boolean);

		let node;

		if (previous && this.#current.getIsInner()) {
			node = this.#current.getParent();
		} else {
			node = this.#root;
		}

		this.#current = node;

		return this;
	}

	/**
	 * Returns a tree of strings describing the reasons for API failure.
	 *
	 * @public
	 * @returns {Array}
	 */
	format() {
		const reasons = this.#root.toJSObj((item) => {
			const formatted = { };

			formatted.code = item ? item.type.code : null;
			formatted.message = item ? item.format(this.#data) : null;

			if (item && item.type.verbose) {
				formatted.data = item.data;
			}

			return formatted;
		}, true);

		return reasons.children;
	}

	/**
	 * Indicates whether the tree of {@link FailureReasonItem} instances
	 * contains at least one item with a matching {@link FailureType}.
	 *
	 * @public
	 * @param {FailureType} type
	 * @returns {boolean}
	 */
	hasFailureType(type) {
		assert.argumentIsRequired(type, 'type', FailureType, 'FailureType');

		return this.#root.search(item => item.type === type, false, false) !== null;
	}

	/**
	 * Indicates whether the tree of {@link FailureReasonItem} instances
	 * contains at least one item considered severe.
	 *
	 * @public
	 * @returns {boolean}
	 */
	getIsSevere() {
		return this.#root.search(item => item.type.severe, false, false) !== null;
	}

	/**
	 * Searches the tree of {@link FailureReasonItem} instances for a
	 * non-standard HTTP error code.
	 *
	 * @public
	 * @returns {number|null}
	 */
	getErrorCode() {
		const node = this.#root.search(item => item.type.error !== null, true, false);

		if (node === null) {
			return null;
		}

		return node.getValue().type.error;
	}

	/**
	 * A convenience function for creating a new {@link FailureReason}
	 * with a single {@link FailureType}.
	 *
	 * @public
	 * @static
	 * @param {FailureType} type
	 * @param {object=} data
	 * @returns {FailureReason}
	 */
	static from(type, data) {
		const reason = new FailureReason();

		return reason.addItem(type, data);
	}

	/**
	 * Factory function for creating instances of {@link FailureReason}.
	 *
	 * @public
	 * @static
	 * @param {object=} data
	 * @returns {FailureReason}
	 */
	static forRequest(data) {
		return new FailureReason(data);
	}

	/**
	 * Returns a JSON representation of the failure reason.
	 *
	 * @public
	 * @returns {Array}
	 */
	toJSON() {
		return this.format();
	}

	/**
	 * Returns an HTTP status code suitable for use with the failure reason.
	 *
	 * @public
	 * @static
	 * @param {FailureReason} reason
	 * @returns {number|null}
	 */
	static getHttpStatusCode(reason) {
		assert.argumentIsRequired(reason, 'reason', FailureReason, 'FailureReason');

		let returnValue = null;

		reason.#root.walk((item) => {
			const code = FailureType.getHttpStatusCode(item.type);

			if (returnValue === null || returnValue !== 400) {
				returnValue = code;
			}
		}, false, false);

		return returnValue;
	}

	/**
	 * Validates that a candidate conforms to a schema, returning a rejected
	 * promise with a serialized {@link FailureReason} if a problem exists.
	 *
	 * The schema argument can be either a {@link Schema} instance or an
	 * {@link Enum} instance that exposes a Schema through its schema property.
	 *
	 * @public
	 * @static
	 * @async
	 * @param {Schema|EnumWithSchema} schema
	 * @param {object} candidate
	 * @param {string=} description
	 * @returns {Promise<null>}
	 */
	static async validateSchema(schema, candidate, description) {
		let schemaToUse;

		if (schema instanceof Schema) {
			schemaToUse = schema;
		} else if (schema.schema && schema.schema instanceof Schema) {
			schemaToUse = schema.schema;
		} else {
			throw new TypeError('The schema argument must be a Schema instance or an Enum instance containing a Schema.');
		}

		const fields = schemaToUse.getInvalidFields(candidate);

		if (fields.length === 0) {
			return null;
		}

		let failure = FailureReason.forRequest({ endpoint: { description: description || `serialize data into ${schemaToUse.name}`}})
			.addItem(FailureType.REQUEST_INPUT_MALFORMED, { }, true);

		failure = fields.reduce((accumulator, field) => {
			accumulator.addItem(FailureType.REQUEST_PARAMETER_MALFORMED, { name: field.name });

			return accumulator;
		}, failure);

		throw failure.format();
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[FailureReason]';
	}
}
