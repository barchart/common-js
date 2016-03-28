var Class = require('class.extend');

module.exports = function() {
	'use strict';

	var Queue = Class.extend({
		init: function() {
			this._array = [];
		},

		enqueue: function(item) {
			this._array.push(item);

			return item;
		},

		dequeue: function() {
			if (this.empty()) {
				throw new Error('Queue is empty');
			}

			return this._array.shift();
		},

		peek: function() {
			if (this.empty()) {
				throw new Error('Queue is empty');
			}

			return this._array[0];
		},

		empty: function() {
			return this._array.length === 0;
		},

		toString: function() {
			return '[Queue]';
		}
	});

	return Queue;
}();