var Class = require('class.extend');
var assert = require('./../../lang/assert');

module.exports = function() {
	'use strict';

	var EvictingList = Class.extend({
		init: function(capacity) {
			assert.argumentIsOptional(capacity, 'capacity', Number);

			this._capacity = Math.max((capacity || 0), 0) || 10;

			this._array = [ ];

			for (var i = 0; i < this._capacity; i++) {
				this._array[i] = empty;
			}

			this._head = null;
		},

		add: function(item) {
			this._array[this._head = getNextIndex(this._head, this._capacity)] = item;
		},

		peek: function() {
			if (this.empty()) {
				throw new Error('EvictingList is empty');
			}

			return this._array[this._head];
		},

		empty: function() {
			return this._head === null;
		},

		getCapacity: function() {
			return this._capacity;
		},

		toArray: function() {
			var returnRef = [ ];

			if (!this.empty()) {
				var current = this._head;

				for (var i = 0; i < this._capacity; i++) {
					var item = this._array[current];

					if (item === empty) {
						break;
					}

					returnRef.push(item);

					current = getPreviousIndex(current, this._capacity);
				}
			}

			return returnRef;
		},

		toString: function() {
			return '[Stack]';
		}
	});

	var getNextIndex = function(current, capacity) {
		var returnVal;

		if (current === null) {
			returnVal = 0;
		} else {
			returnVal = current + 1;

			if (returnVal === capacity) {
				returnVal = 0;
			}
		}

		return returnVal;
	};

	var getPreviousIndex = function(current, capacity) {
		var returnVal;

		if (current === null) {
			returnVal = 0;
		} else {
			returnVal = current - 1;

			if (returnVal < 0) {
				returnVal = capacity -1;
			}
		}

		return returnVal;
	};

	var empty = { };

	return EvictingList;
}();