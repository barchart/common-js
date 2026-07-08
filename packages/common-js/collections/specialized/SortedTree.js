import * as array from './../../lang/array.js';
import * as assert from './../../lang/assert.js';

import Tree from './../Tree.js';

/**
 * A tree data structure that sorts children as they are inserted.
 *
 * @public
 * @extends {Tree}
 */
export default class SortedTree extends Tree {
	/**
	 * @param {*} value - The value of the node.
	 * @param {Tree=} parent - The parent node. If not supplied, this will be the root node.
	 * @param {(a: any, b: any) => number=} comparator - The comparator function used to sort nodes.
	 */
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
		const child = new SortedTree(value, this);

		const comparatorNode = this.findParent((value, node) => node instanceof SortedTree && node._comparator !== null, true);

		if (!(comparatorNode instanceof SortedTree) || comparatorNode._comparator === null) {
			throw new Error('Unable to find a comparator for the sorted tree.');
		}

		array.insert(this._children, child, comparatorNode._comparator);

		return child;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[SortedTree]';
	}
}
