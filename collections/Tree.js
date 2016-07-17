module.exports = (() => {
	'use strict';

	class Tree {
		constructor(value, parent) {
			this._value = value;

			this._parent = parent || null;
			this._children = [ ];
		}

		getParent() {
			return this._parent;
		}

		getChildren() {
			return this._children;
		}

		getValue() {
			return this._value;
		}

		getIsLeaf() {
			return this._children.length === 0;
		}

		getIsRoot() {
			return this._parent === null;
		}

		addChild(value) {
			const returnRef = new Tree(this, value);

			this._children.push(returnRef);

			return returnRef;
		}

		removeChild(node) {
			var returnRef = null;

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

		search(predicate, childrenFirst, includeCurrentNode) {
			let returnRef = null;

			if (returnRef === null && childrenFirst && includeCurrentNode && predicate(this.getValue(), this)) {
				returnRef = this;
			}

			for (let i = 0; i < this._children.length; i++) {
				var child = this._children[i];

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

		walk(walkAction, childrenFirst, includeCurrentNode) {
			const predicate = (value, node) => {
				walkAction(value, node);

				return false;
			};

			this.search(predicate, childrenFirst, includeCurrentNode);
		}

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