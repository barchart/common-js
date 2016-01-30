var Class = require('class.extend');

module.exports = function() {
	'use strict';

	var Stack = Class.extend({
		init: function() {
			this._array = [];
		},

		push: function(item) {
			this._array.unshift(item);

			return item;
		},

		pop: function() {
			if (this.empty()) {
				throw new Error('Stack is empty');
			}

			return this._array.shift();
		},

		peek: function() {
			if (this.empty()) {
				throw new Error('Stack is empty');
			}

			return this._array[0];
		},

		empty: function() {
			return this._array.length === 0;
		},

		toString: function() {
			return '[Stack]';
		}
	});

	return Stack;
}();