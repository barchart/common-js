const assert = require('./../../lang/assert'),
	is = require('./../../lang/is');

const FailureReasonItem = require('./FailureReasonItem'),
	FailureType = require('./FailureType'),
	Schema = require('./../../serialization/json/Schema'),
	Tree = require('./../../collections/Tree');

module.exports = (() => {
	'use strict';

	/**
	 * Describes all of the reasons for API failure. Since there can be multiple reasons, the reasons are
	 * stored in a tree structure.
	 *
	 * @public
	 * @param {Object=} data - Data regarding the API request itself, likely independent of the failure data (which is maintained in the tree structure).
	 */
	class FailureReason {
		constructor(data) {
			this._data = data || null;

			this._head = new Tree();
			this._current = this._head;
		}

		/**
		 * Adds a {@link FailureReasonItem} to the tree of reason(s) at the current node.
		 *
		 * @public
		 * @param {FailureType} type - The failure type.
		 * @param {Object=} data - The data associated with the failure type.
		 * @param {Boolean=} group - The reason is expected to have children; therefore, the current tree node is shifted to the newly added {@link FailureReasonItem}.
		 * @returns {FailureReason} - The current instance, allowing for method chaining.
		 */
		addItem(type, data, group) {
			assert.argumentIsRequired(type, 'type', FailureType, 'FailureType');
			assert.argumentIsOptional(group, 'group', Boolean);

			const node = this._current.addChild(new FailureReasonItem(type, data));

			if (is.boolean(group) && group) {
				this._current = node;
			}

			return this;
		}

		/**
		 * Resets the current node to the head of the tree.
		 *
		 * @public
		 * @returns {FailureReason} - The current instance, allowing for method chaining.
		 */
		reset() {
			this._current = this._head;

			return this;
		}

		/**
		 * Returns a tree of strings, describing the reason(s) for API failure.
		 *
		 * @public
		 * @returns {Array}
		 */
		format() {
			const reasons = this._head.toJSObj((item) => {
				const formatted = { };

				formatted.code = item ? item.type.code : null;
				formatted.message = item ? item.format(this._data) : null;

				if (item && item.type.verbose) {
					formatted.data = item.data;
				}

				return formatted;
			});

			return reasons.children;
		}

		/**
		 * Indicates if the tree of {@link FailureReasonItem} instances contains
		 * at least one item with a matching {@link FailureType}.
		 *
		 * @public
		 * @param {FailureType} type
		 * @returns {Boolean}
		 */
		hasFailureType(type) {
			assert.argumentIsRequired(type, 'type', FailureType, 'FailureType');

			return this._head.search(item => item.type === type, false, false) !== null;
		}

		/**
		 * Indicates if the tree of {@link FailureReasonItem} instances contains
		 * at least one item that is considered to be severe.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		getIsSevere() {
			return this._head.search(item => item.type.severe, false, false) !== null;
		}

		/**
		 * Searches the tree of {@link FailureReasonItem} instances for a non-standard
		 * http error code.
		 *
		 * @public
		 * @returns {Number|null}
		 */
		getErrorCode() {
			const node = this._head.search(item => item.type.error !== null, true, false);

			if (node !== null) {
				return node.getValue().type.error;
			} else {
				return null;
			}
		}

		toJSON() {
			return this.format();
		}

		/**
		 * Factory function for creating instances of {@link FailureReason}.
		 *
		 * @public
		 * @static
		 * @param data
		 * @returns {FailureReason}
		 */
		static forRequest(data) {
			return new FailureReason(data);
		}

		/**
		 * Returns an HTTP status code that would be suitable for use with the
		 * failure reason.
		 *
		 * @public
		 * @static
		 * @param {FailureReason} reason
		 * @returns {Number}
		 */
		static getHttpStatusCode(reason) {
			assert.argumentIsRequired(reason, 'reason', FailureReason, 'FailureReason');

			let returnVal = null;

			reason._head.walk((item) => {
				let code = FailureType.getHttpStatusCode(item.type);

				if (returnVal === null || returnVal !== 400) {
					returnVal = code;
				}
			}, false, false);

			return returnVal;
		}

		/**
		 * Validates that a candidate conforms to a schema, returning a rejected
		 * promise (with a serialized FailureReason) if a problem exists.
		 *
		 * @public
		 * @static
		 * @param {Schema|Enum} schema
		 * @param {Object} candidate
		 * @param {String=} description
		 * @returns {Promise}
		 */
		static validateSchema(schema, candidate, description) {
			return Promise.resolve()
				.then(() => {
					let schemaToUse;

					if (schema instanceof Schema) {
						schemaToUse = schema;
					} else if (schema.schema && schema.schema instanceof Schema) {
						schemaToUse = schema.schema;
					} else {
						schemaToUse = null;
					}

					const fields = schemaToUse.getInvalidFields(candidate);

					let failure;

					if (fields.length !== 0) {
						failure = FailureReason.forRequest({endpoint: { description: (description || `serialize data into ${schema.name}`) }})
							.addItem(FailureType.REQUEST_INPUT_MALFORMED, { }, true);

						failure = fields.reduce((accumulator, field) => {
							accumulator.addItem(FailureType.REQUEST_PARAMETER_MALFORMED, { name: field.name });

							return accumulator;
						}, failure);
					} else {
						failure = null;
					}

					if (failure !== null) {
						return Promise.reject(failure.format());
					} else {
						return Promise.resolve(null);
					}
				});
		}

		toString() {
			return '[FailureReason]';
		}
	}

	return FailureReason;
})();
