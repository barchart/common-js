const assert = require('./../../lang/assert'),
	is = require('./../../lang/is');

const FailureReasonItem = require('./FailureReasonItem'),
	FailureType = require('./FailureType'),
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
		formatTree() {
			const reasons = this._head.toJSObj((item) => {
				return {
					code: item ? item.type.code : null,
					message: item ? item.format(this._data) : null
				};
			});

			return reasons.children;
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

		toString() {
			return '[FailureReason]';
		}
	}

	return FailureReason;
})();