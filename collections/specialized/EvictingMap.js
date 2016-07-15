var Class = require('class.extend');
var assert = require('./../../lang/assert');

module.exports = function() {
	'use strict';

	var EvictingMap = Class.extend({
		init: function(capacity) {
			assert.argumentIsOptional(capacity, 'capacity', Number);

			this._capacity = Math.max((capacity || 0), 0) || 10;

			this._map = { };

			this._head = null;
			this._tail = null;

			this._size = 0;
		},

		has: function(key) {
			return this._map.hasOwnProperty(key);
		},

		put: function(key, value) {
			var item = this._map[key];

			this.remove(key);

			var node;

			if (this._head) {
				node = this._head.insertBefore(key);
			} else {
				node = new Node(key);

				this._head = node;
				this._tail = node;
			}

			this._map[key] = new Item(node, key, value);

			this._size++;

			while (this._size > this._capacity) {
				this.remove(this._tail.getItem());
			}
		},

		get: function(key) {
			var returnRef;

			var item = this._map[key];

			if (item) {
				returnRef = item.getValue();

				var node = item.getNode();

				if (node !== this._head) {
					node.remove();

					this._head = this._head.insertBefore(key);
				}
			} else {
				returnRef = null;
			}

			return returnRef;
		},

		remove: function(key) {
			var item = this._map[key];

			if (item) {
				var node = item.getNode();

				var next = node.getNext();
				var previous = node.getPrevious();

				node.remove();

				if (this._head === node) {
					this._head = next;
				}

				if (this._tail === node) {
					this._tail = previous;
				}

				delete this._map[key];

				this._size--;
			}
		},

		empty: function() {
			return this._size === 0;
		},

		getCapacity: function() {
			return this._capacity;
		},

		toString: function() {
			return '[EvictingMap]';
		}
	});

	var Item = Class.extend({
		init: function(node, key, value) {
			this._node = node;

			this._key = key;
			this._value = value;
		},

		setItem: function(key, value) {
			this._key = key;
			this._value = value;
		},

		getKey: function() {
			return this._key;
		},

		getValue: function() {
			this._value;
		},

		getNode: function() {
			return this._node;
		}
	});

	var Node = Class.extend({
		init: function(item) {
			this._item = item;

			this._previous = null;
			this._next = null;
		},

		insertBefore: function(item) {
			var node = new Node(item);

			node._next = this;

			if (this._previous !== null) {
				node._previous = this._previous;
				this._previous._next = node;
			}

			this._previous = node;

			return node;
		},

		insertAfter: function(item) {
			var node = new Node(item);

			node._previous = this;

			if (this._next !== null) {
				node._next = this._next;
				this._next._previous = node;
			}

			this._next = node;

			return node;
		},

		remove: function() {
			var next = this._next;
			var previous = this._previous;

			this._next = null;
			this._previous = null;

			if (next && previous) {
				previous._next = next;
				next._previous = previous;
			} else if (next) {
				next._previous = null;
			} else if (previous) {
				previous._next = null;
			}

			return this;
		},

		getItem: function() {
			return this._item;
		},

		hasNext: function() {
			return this._next !== null;
		},

		getNext: function() {
			return this._next;
		},

		hasPrevious: function() {
			return this._previous !== null;
		},

		getPrevious: function() {
			return this._previous;
		}
	});

	return EvictingMap;
}();