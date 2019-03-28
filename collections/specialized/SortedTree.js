const array = require('./../../lang/array'),
	assert = require('./../../lang/assert');

const Tree = require('./../Tree');

module.exports = (() => {
	'use strict';

	/**
	 * A tree data structure that sorts children as they are inserted.
	 *
	 * @public
	 * @extends {Tree}
	 * @param {*} value - The value of the node.
	 * @param {Tree=} parent - The parent node. If not supplied, this will be the root node.
	 * @param {Function=} comparator - The comparator function used to sort nodes.
	 */
	class SortedTree extends Tree {
		constructor(value, parent, comparator) {
			super(value, parent);

			if (parent) {
				assert.argumentIsOptional(comparator, 'comparator', Function);
			} else {
				assert.argumentIsRequired(comparator, 'comparator', Function);
			}

			this._comparator = comparator || null;
		}

		/**
		 * Adds a child node to the current node, inserting it at the correct position,
		 * and returns a reference to the child node.
		 *
		 * @public
		 * @param {*} value - The value of the child.
		 * @returns {Tree}
		 */
		addChild(value) {
			const returnRef = new SortedTree(value, this);

			const comparatorNode = this.findParent((t) => t._comparator !== null, true);

			array.insert(this._children, returnRef, comparatorNode._comparator);

			return returnRef;
		}

		toString() {
			return '[SortedTree]';
		}
	}

	return SortedTree;
})();