const Tree = require('./Tree');

module.exports = (() => {
	'use strict';

	/**
	 * A tree data structure. Each instance represents a node, holding
	 * an item, a reference to the parent node, and a reference to
	 * children nodes. Children are stored in insertion order.
	 *
	 * @public
	 * @param {*} value - The value of the node.
	 * @param {Tree=} parent - The parent node. If not supplied, this will be the root node.
	 */
	class BindingTree extends Tree {
		constructor(value, parent) {
			super(value, parent);

			this._children2 = [ ];
		}

		/**
		 * Returns the collection of children values.
		 *
		 * @public
		 * @returns {Array<*>}
		 */
		getChildren2() {
			return this._children2;
		}

		addChild(value) {
			const returnRef = new BindingTree(value, this);

			this._children.push(returnRef);
			this._children2.push(value);

			return returnRef;
		}

		/**
		 * Removes a child node.
		 *
		 * @public
		 * @param {Tree} node - The child to remove.
		 */
		removeChild(node) {
			for (let i = this._children.length - 1; !(i < 0); i--) {
				const child = this._children[i];

				if (child === node) {
					this._children.splice(i, 1);
					this._children2.splice(i, 1);

					child._parent = null;

					child._children.splice(0, child._children.length);
					child._children2.splice(0, child._children2.length);

					break;
				}
			}
		}

		toString() {
			return '[BindingTree]';
		}
	}

	return BindingTree;
})();