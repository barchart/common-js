var Class = require('class.extend');

var assert = require('./../lang/assert');

module.exports = function() {
	'use strict';

	var Tree = Class.extend({
		init: function(value, parent) {
			this._value = value;

			this._parent = parent || null;
			this._children = [ ];
		},

		getParent: function() {
			return this._parent;
		},

		getChildren: function() {
			return this._children;
		},

		getValue: function() {
			return this._value;
		},

		getIsLeaf: function() {
			return this._children.length === 0;
		},

		getIsRoot: function() {
			return this._parent === null;
		},

		addChild: function(value) {
			var returnRef = new Tree(this, value);

			this._children.push(returnRef);

			return returnRef;
		},

		removeChild: function(node) {
			var returnRef = null;

			for (var i = this._children.length - 1; !(i < 0); i--) {
				var child = this._children[i];

				if (child === node) {
					this._children.splice(i, 1);

					child._parent = null;
					child._children = [ ];

					break;
				}
			}
		},

		findChild: function(predicate) {
			var returnRef = null;

			for (var i = 0; i < this._children.length; i++) {
				var child = this._children[i];

				if (predicate(child.getValue(), child)) {
					returnRef = child;

					break;
				}
			}

			return returnRef;
		},

		walk: function(walkAction, childrenFirst, includeCurrentNode) {
			if (childrenFirst && includeCurrentNode) {
				walkAction(this.getValue(), this);
			}

			for (var i = 0; i < this._children.length; i++) {
				var child = this._children[i];

				if (childrenFirst) {
					this.walk(walkAction, true, false);
				}

				walkAction(child.getValue(), child);

				if (!childrenFirst) {
					this.walk(walkAction, false, false);
				}
			}

			if (!childrenFirst && includeCurrentNode) {
				walkAction(this.getValue(), this);
			}
		},

		climb: function(climbAction, includeCurrentNode) {
			if (includeCurrentNode)	{
				climbAction(this.getValue(), this);
			}

			if (this._parent !== null) {
				this._parent.climb(climbAction, true);
			}
		},

		toString: function() {
			return '[Tree]';
		}
	});

	return Tree;
}();