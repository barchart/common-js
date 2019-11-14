const is = require('./../lang/is');

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
	class Tree {
		constructor(value, parent) {
			this._value = value;

			this._parent = parent || null;
			this._children = [ ];
		}

		/**
		 * Gets the root node.
		 *
		 * @public
		 * @returns {Tree}
		 */
		getRoot() {
			if (this.getIsRoot()) {
				return this;
			} else {
				return this._parent.getRoot();
			}
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
		 * @returns {*}
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
		 * @param {*} value - The value of the child.
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
		 * Removes the current node from the parent tree. Use on a root node
		 * has no effect.
		 *
		 * @public
		 */
		sever() {
			if (this.getIsRoot()) {
				return;
			}

			this.getParent().removeChild(this);
		}

		/**
		 * Searches the children nodes for the first child node that matches the
		 * predicate.
		 *
		 * @public
		 * @param {Tree~nodePredicate} predicate - A predicate that tests each child node. The predicate takes two arguments -- the node's value, and the node itself.
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
		 * @param {Tree~nodePredicate} predicate - A predicate that tests each child node. The predicate takes two arguments -- the node's value, and the node itself.
		 * @param {boolean=} parentFirst - If true, the true will be searched from parent-to-child (breadth first). Otherwise, child-to-parent (depth first).
		 * @param {boolean=} includeCurrentNode - True, if the current node should be checked against the predicate.
		 * @returns {Tree|null}
		 */
		search(predicate, parentFirst, includeCurrentNode) {
			let returnRef = null;

			if (returnRef === null && parentFirst && includeCurrentNode && predicate(this.getValue(), this)) {
				returnRef = this;
			}

			for (let i = 0; i < this._children.length; i++) {
				const child = this._children[i];

				returnRef = child.search(predicate, parentFirst, true);

				if (returnRef !== null) {
					break;
				}
			}

			if (returnRef === null && !parentFirst && includeCurrentNode && predicate(this.getValue(), this)) {
				returnRef = this;
			}

			return returnRef;
		}

		/**
		 * Walks the children of the current node, running an action on each node.
		 *
		 * @public
		 * @param {Tree~nodeAction} walkAction - A action to apply to each node. The action takes two arguments -- the node's value, and the node itself.
		 * @param {boolean=} parentFirst - If true, the true will be searched from parent-to-child (breadth first). Otherwise, child-to-parent (depth first).
		 * @param {boolean=} includeCurrentNode - True if the current node should be applied to the action.
		 */
		walk(walkAction, parentFirst, includeCurrentNode) {
			const predicate = (value, node) => {
				walkAction(value, node);

				return false;
			};

			this.search(predicate, parentFirst, includeCurrentNode);
		}

		/**
		 * Climbs the parents of the current node -- current node up to the root node, running an action on each node.
		 *
		 * @public
		 * @param {Tree~nodeAction} climbAction - A action to apply to each node. The action takes two arguments -- the node's value, and the node itself.
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

		/**
		 * Climbs the tree, evaluating each parent until a predicate is matched. Once matched,
		 * the {@link Tree} node is returned. Otherwise, if the predicate cannot be matched,
		 * a null value is returned.
		 *
		 * @public
		 * @param {Tree~nodePredicate} predicate - A predicate that tests each child node. The predicate takes two arguments -- the node's value, and the node itself.
		 * @param {boolean=} includeCurrentNode - If true, the predicate will be applied to the current node.
		 * @returns {Tree|null}
		 */
		findParent(predicate, includeCurrentNode) {
			let returnRef;

			if (is.boolean(includeCurrentNode) && includeCurrentNode && predicate(this.getValue(), this)) {
				returnRef = this;
			} else if (this._parent !== null) {
				returnRef = this._parent.findParent(predicate, true);
			} else {
				returnRef = null;
			}

			return returnRef;
		}

		/**
		 * Creates a representation of the tree using JavaScript objects and arrays.
		 *
		 * @public
		 * @param {Function=} valueConverter - An optional function for converting the value of each node.
		 * @param {Boolean=} valueConverter - If true, empty children arrays will be excluded from output.
		 * @returns {Object}
		 */
		toJSObj(valueConverter, omitEmptyChildren) {
			let valueConverterToUse;

			if (is.fn(valueConverter)) {
				valueConverterToUse = valueConverter;
			} else {
				valueConverterToUse = (x) => x;
			}

			const converted = {
				value: valueConverterToUse(this._value)
			};

			if (!(is.boolean(omitEmptyChildren) && omitEmptyChildren && this._children.length === 0)) {
				converted.children = this._children.map((child) => child.toJSObj(valueConverter, omitEmptyChildren));
			}

			return converted;
		}

		toString() {
			return '[Tree]';
		}
	}

	/**
	 * A predicate that is used to check a node (i.e. {@link Tree}).
	 *
	 * @callback Tree~nodePredicate
	 * @param {*} item - The candidate node's item
	 * @param {Tree} node - The candidate node.
	 * @returns {Boolean}
	 */

	/**
	 * An action that is run on a node (i.e. {@link Tree}).
	 *
	 * @callback Tree~nodeAction
	 * @param {*} item - The candidate node's item
	 * @param {Tree} node - The candidate node.
	 */

	return Tree;
})();