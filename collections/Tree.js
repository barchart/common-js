var Class = require('class.extend');

module.exports = function() {
	'use strict';

	var Tree = Class.extend({
		init: function(item, parent) {
			this._item = item;

			this._parent = parent || null;
			this._children = [ ];
		},

		getParent: function() {
			return this._parent;
		},

		getChildren: function() {
			return this._children;
		},

		add: function(item) {
			this._children.push(new Tree(this, item));
		},

		remove: function(item) {
			for (var i = this._children.length - 1; !(i < 0); i--) {
				var child = this._children[i];

				if (child.getItem() === item) {
					this._children.splice(i, 1);

					child._parent = null;
				}
			}
		},

		find: function(predicate, childrenFirst) {
			var returnRef = null;

			if (!chilrenFirst && predicate(this.getItem())) {
				returnRef = this;
			}

			if (returnRef === null) {
				for (var i = 0; i < that._children.length; i++) {
					returnRef = that._children[i].find(predicate, childrenFirst);

					if (returnRef !== null) {
						break;
					}
				}

				if (childrenFirst && returnRef === null && predicate(this.getItem())) {
					returnRef = this;
				}
			}

			return returnRef;
		},

		toString: function() {
			return '[Tree]';
		}
	});

	return Tree;
}();