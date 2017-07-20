module.exports = (() => {
	'use strict';

	/**
	 * A tree data structure. Each instance represents a node, holding
	 * an item, a reference to the parent node, and a reference to
	 * children nodes.
	 *
	 * @public
	 */
	class Tree {
		/**
		 * @param {object} value - The value of the node.
		 * @param {Tree} parent - The parent node. If not supplied, this will be the root node.
		 */
		constructor(value, parent) {
			this._value = value;

			this._parent = parent || null;
			this._children = [ ];
		}

		/**
		 * Returns the parent node. If this is the root node, a null value is returned.
		 *
		 * @public
		 * @returns {Tree|null}
		 */
		getParent() {
			return this._parent;
		}

		/**
		 * Returns the collection of children nodes.
		 *
		 * @public
		 * @returns {Array<Tree>}
		 */
		getChildren() {
			return this._children;
		}

		/**
		 * Returns the value associated with the current node.
		 *
		 * @public
		 * @returns {object}
		 */
		getValue() {
			return this._value;
		}

		/**
		 * Returns true if this node has no children; otherwise false.
		 *
		 * @public
		 * @returns {boolean}
		 */
		getIsLeaf() {
			return this._children.length === 0;
		}

		/**
		 * Returns true if this node has no parent; otherwise false.
		 *
		 * @public
		 * @returns {boolean}
		 */
		getIsRoot() {
			return this._parent === null;
		}

		/**
		 * Adds a child node to the current node and returns a reference
		 * to the child node.
		 *
		 * @public
		 * @param {object} value - The value of the child.
		 * @returns {Tree}
		 */
		addChild(value) {
			const returnRef = new Tree(value, this);

			this._children.push(returnRef);

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

					child._parent = null;
					child._children = [ ];

					break;
				}
			}
		}

		/**
		 * Searches the children nodes for the first child node that matches the
		 * predicate.
		 *
		 * @public
		 * @param {Function} predicate - A predicate that tests each child node. The predicate takes two arguments -- the node's value, and the node itself.
		 * @returns {Tree|null}
		 */
		findChild(predicate) {
			let returnRef = null;

			for (let i = 0; i < this._children.length; i++) {
				let child = this._children[i];

				if (predicate(child.getValue(), child)) {
					returnRef = child;

					break;
				}
			}

			return returnRef;
		}

		/**
		 * Searches the tree recursively, starting with the current node.
		 *
		 * @public
		 * @param {Function} predicate - A predicate that tests each child node. The predicate takes two arguments -- the node's value, and the node itself.
		 * @param {boolean=} childrenFirst - True if the tree should be searched depth first.
		 * @param {boolean=} includeCurrentNode - True if the current node should be checked against the predicate.
		 * @returns {Tree|null}
		 */
		search(predicate, childrenFirst, includeCurrentNode) {
			let returnRef = null;

			if (returnRef === null && childrenFirst && includeCurrentNode && predicate(this.getValue(), this)) {
				returnRef = this;
			}

			for (let i = 0; i < this._children.length; i++) {
				const child = this._children[i];

				returnRef = child.search(predicate, childrenFirst, true);

				if (returnRef !== null) {
					break;
				}
			}

			if (returnRef === null && !childrenFirst && includeCurrentNode && predicate(this.getValue(), this)) {
				returnRef = this;
			}

			return returnRef;
		}

		/**
		 * Walks the children of the current node -- current node down to the lead nodes, running an action on each node.
		 *
		 * @public
		 * @param {Function} walkAction - A action to apply to each node. The action takes two arguments -- the node's value, and the node itself.
		 * @param {boolean=} childrenFirst - True if the tree should be walked depth first.
		 * @param {boolean=} includeCurrentNode - True if the current node should be applied to the action.
		 */
		walk(walkAction, childrenFirst, includeCurrentNode) {
			const predicate = (value, node) => {
				walkAction(value, node);

				return false;
			};

			this.search(predicate, childrenFirst, includeCurrentNode);
		}

		/**
		 * Climbs the parents of the current node -- current node up to the root node, running an action on each node.
		 *
		 * @public
		 * @param {Function} climbAction - A action to apply to each node. The action takes two arguments -- the node's value, and the node itself.
		 * @param {boolean=} includeCurrentNode - True if the current node should be applied to the action.
		 */
		climb(climbAction, includeCurrentNode) {
			if (includeCurrentNode)	{
				climbAction(this.getValue(), this);
			}

			if (this._parent !== null) {
				this._parent.climb(climbAction, true);
			}
		}

		toString() {
			return '[Tree]';
		}
	}

	return Tree;
})();