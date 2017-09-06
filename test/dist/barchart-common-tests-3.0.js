(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

module.exports = function () {
	'use strict';

	/**
  * A singly linked list. Each instance represents a node in the list,
  * holding both an item, a reference to the next node.
  *
  * @public
  * @param {*} value - The value of current node.
  */

	var LinkedList = function () {
		function LinkedList(value) {
			_classCallCheck(this, LinkedList);

			this._value = value;

			this._next = null;
		}

		/**
   * Returns the value associated with the current node.
   *
   * @public
   * @returns {*}
   */

		_createClass(LinkedList, [{
			key: 'getValue',
			value: function getValue() {
				return this._value;
			}

			/**
    * Returns the next node, if it exists; otherwise a null value is returned.
    *
    * @public
    * @returns {Tree|null}
    */

		}, {
			key: 'getNext',
			value: function getNext() {
				return this._next;
			}

			/**
    * Returns true, if the node is the last one in the list.
    *
    * @public
    * @returns {boolean}
    */

		}, {
			key: 'getIsTail',
			value: function getIsTail() {
				return this._next === null;
			}

			/**
    * Adds (or inserts) a value after the current node and returns
    * the newly added node.
    *
    * @public
    * @param {*} value
    * @returns {LinkedList}
    */

		}, {
			key: 'insert',
			value: function insert(value) {
				var next = new LinkedList(value);

				if (this._next) {
					next._next = this._next;
				}

				this._next = next;

				return next;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[LinkedList]';
			}
		}]);

		return LinkedList;
	}();

	return LinkedList;
}();

},{}],2:[function(require,module,exports){
'use strict';

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var assert = require('./../lang/assert');

module.exports = function () {
	'use strict';

	/**
  * A queue collection (i.e. supports FIFO operations).
  *
  * @public
  */

	var Queue = function () {
		function Queue() {
			_classCallCheck(this, Queue);

			this._array = [];
		}

		/**
   * Adds an item to the queue.
   *
   * @public
   * @param {object} item
   * @returns {object} - The item added to the queue.
   */

		_createClass(Queue, [{
			key: 'enqueue',
			value: function enqueue(item) {
				this._array.push(item);

				return item;
			}

			/**
    * Removes the next item from the queue and returns it. Throws if the queue is empty.
    *
    * @public
    * @returns {object} - The item added to the queue.
    */

		}, {
			key: 'dequeue',
			value: function dequeue() {
				if (this.empty()) {
					throw new Error('Queue is empty');
				}

				return this._array.shift();
			}

			/**
    * Returns the next item in the queue (without removing it). Throws if the queue is empty.
    *
    * @public
    * @returns {object} - The item added to the queue.
    */

		}, {
			key: 'peek',
			value: function peek() {
				if (this.empty()) {
					throw new Error('Queue is empty');
				}

				return this._array[0];
			}

			/**
    * Returns true if the queue is empty; otherwise false.
    *
    * @public
    * @returns {boolean}
    */

		}, {
			key: 'empty',
			value: function empty() {
				return this._array.length === 0;
			}

			/**
    * Runs an action on each item in the queue.
    *
    * @public
    * @param {Function} action - The action to run.
    */

		}, {
			key: 'scan',
			value: function scan(action) {
				assert.argumentIsRequired(action, 'action', Function);

				this._array.forEach(function (x) {
					return action(x);
				});
			}

			/**
    * Outputs an array of the queue's items; without affecting the
    * queue's internal state;
    *
    * @public
    * @returns {Array}
    */

		}, {
			key: 'toArray',
			value: function toArray() {
				return this._array.slice(0);
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[Queue]';
			}
		}]);

		return Queue;
	}();

	return Queue;
}();

},{"./../lang/assert":24}],3:[function(require,module,exports){
'use strict';

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var assert = require('./../lang/assert');

module.exports = function () {
	'use strict';

	/**
  * A stack collection (supports LIFO operations).
  *
  * @public
  */

	var Stack = function () {
		function Stack() {
			_classCallCheck(this, Stack);

			this._array = [];
		}

		/**
   * Adds an item to the stack.
   *
   * @public
   * @param {object} item
   * @returns {object} - The item added to the stack.
   */

		_createClass(Stack, [{
			key: 'push',
			value: function push(item) {
				this._array.unshift(item);

				return item;
			}

			/**
    * Removes and returns an item from the stack. Throws if the stack is empty.
    *
    * @public
    * @returns {object} - The removed from the stack.
    */

		}, {
			key: 'pop',
			value: function pop() {
				if (this.empty()) {
					throw new Error('Stack is empty');
				}

				return this._array.shift();
			}

			/**
    * Returns the next item in the stack (without removing it). Throws if the stack is empty.
    *
    * @public
    * @returns {object} - The item added to the queue.
    */

		}, {
			key: 'peek',
			value: function peek() {
				if (this.empty()) {
					throw new Error('Stack is empty');
				}

				return this._array[0];
			}

			/**
    * Returns true if the queue is empty; otherwise false.
    *
    * @public
    * @returns {boolean}
    */

		}, {
			key: 'empty',
			value: function empty() {
				return this._array.length === 0;
			}

			/**
    * Runs an action on each item in the stack.
    *
    * @public
    * @param {Function} action - The action to run.
    */

		}, {
			key: 'scan',
			value: function scan(action) {
				assert.argumentIsRequired(action, 'action', Function);

				this._array.forEach(function (x) {
					return action(x);
				});
			}

			/**
    * Outputs an array of the stacks's items; without affecting the
    * queue's internal state;
    *
    * @public
    * @returns {Array}
    */

		}, {
			key: 'toArray',
			value: function toArray() {
				return this._array.slice(0);
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[Stack]';
			}
		}]);

		return Stack;
	}();

	return Stack;
}();

},{"./../lang/assert":24}],4:[function(require,module,exports){
'use strict';

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

module.exports = function () {
	'use strict';

	/**
  * A tree data structure. Each instance represents a node, holding
  * an item, a reference to the parent node, and a reference to
  * children nodes. Children are stored in insertion order.
  *
  * @public
  * @param {*} value - The value of the node.
  * @param {Tree} parent - The parent node. If not supplied, this will be the root node.
  */

	var Tree = function () {
		function Tree(value, parent) {
			_classCallCheck(this, Tree);

			this._value = value;

			this._parent = parent || null;
			this._children = [];
		}

		/**
   * Returns the parent node. If this is the root node, a null value is returned.
   *
   * @public
   * @returns {Tree|null}
   */

		_createClass(Tree, [{
			key: 'getParent',
			value: function getParent() {
				return this._parent;
			}

			/**
    * Returns the collection of children nodes.
    *
    * @public
    * @returns {Array<Tree>}
    */

		}, {
			key: 'getChildren',
			value: function getChildren() {
				return this._children;
			}

			/**
    * Returns the value associated with the current node.
    *
    * @public
    * @returns {*}
    */

		}, {
			key: 'getValue',
			value: function getValue() {
				return this._value;
			}

			/**
    * Returns true if this node has no children; otherwise false.
    *
    * @public
    * @returns {boolean}
    */

		}, {
			key: 'getIsLeaf',
			value: function getIsLeaf() {
				return this._children.length === 0;
			}

			/**
    * Returns true if this node has no parent; otherwise false.
    *
    * @public
    * @returns {boolean}
    */

		}, {
			key: 'getIsRoot',
			value: function getIsRoot() {
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

		}, {
			key: 'addChild',
			value: function addChild(value) {
				var returnRef = new Tree(value, this);

				this._children.push(returnRef);

				return returnRef;
			}

			/**
    * Removes a child node.
    *
    * @public
    * @param {Tree} node - The child to remove.
    */

		}, {
			key: 'removeChild',
			value: function removeChild(node) {
				for (var i = this._children.length - 1; !(i < 0); i--) {
					var child = this._children[i];

					if (child === node) {
						this._children.splice(i, 1);

						child._parent = null;
						child._children = [];

						break;
					}
				}
			}

			/**
    * Searches the children nodes for the first child node that matches the
    * predicate.
    *
    * @public
    * @param {Tree~nodePredicate} predicate - A predicate that tests each child node. The predicate takes two arguments -- the node's value, and the node itself.
    * @returns {Tree|null}
    */

		}, {
			key: 'findChild',
			value: function findChild(predicate) {
				var returnRef = null;

				for (var i = 0; i < this._children.length; i++) {
					var child = this._children[i];

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
    * @param {boolean=} childrenFirst - True, if the tree should be searched depth first.
    * @param {boolean=} includeCurrentNode - True, if the current node should be checked against the predicate.
    * @returns {Tree|null}
    */

		}, {
			key: 'search',
			value: function search(predicate, childrenFirst, includeCurrentNode) {
				var returnRef = null;

				if (returnRef === null && childrenFirst && includeCurrentNode && predicate(this.getValue(), this)) {
					returnRef = this;
				}

				for (var i = 0; i < this._children.length; i++) {
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

			/**
    * Walks the children of the current node -- current node down to the lead nodes, running an action on each node.
    *
    * @public
    * @param {Tree~nodeAction} walkAction - A action to apply to each node. The action takes two arguments -- the node's value, and the node itself.
    * @param {boolean=} childrenFirst - True if the tree should be walked depth first.
    * @param {boolean=} includeCurrentNode - True if the current node should be applied to the action.
    */

		}, {
			key: 'walk',
			value: function walk(walkAction, childrenFirst, includeCurrentNode) {
				var predicate = function predicate(value, node) {
					walkAction(value, node);

					return false;
				};

				this.search(predicate, childrenFirst, includeCurrentNode);
			}

			/**
    * Climbs the parents of the current node -- current node up to the root node, running an action on each node.
    *
    * @public
    * @param {Tree~nodeAction} climbAction - A action to apply to each node. The action takes two arguments -- the node's value, and the node itself.
    * @param {boolean=} includeCurrentNode - True if the current node should be applied to the action.
    */

		}, {
			key: 'climb',
			value: function climb(climbAction, includeCurrentNode) {
				if (includeCurrentNode) {
					climbAction(this.getValue(), this);
				}

				if (this._parent !== null) {
					this._parent.climb(climbAction, true);
				}
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[Tree]';
			}
		}]);

		return Tree;
	}();

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
}();

},{}],5:[function(require,module,exports){
'use strict';

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var assert = require('./../../lang/assert'),
    comparators = require('./comparators');

module.exports = function () {
	'use strict';

	/**
  * A builder for compound comparator functions (e.g. sort by last name,
  * then by first name, then by social security number) that uses a fluent
  * interface.
  *
  * @public
  * @param {Function} comparator - The initial comparator.
  * @param {Boolean=} invert - Indicates if the comparator should sort in descending order.
  */

	var ComparatorBuilder = function () {
		function ComparatorBuilder(comparator, invert, previous) {
			_classCallCheck(this, ComparatorBuilder);

			assert.argumentIsRequired(comparator, 'comparator', Function);
			assert.argumentIsOptional(invert, 'invert', Boolean);

			this._comparator = comparator;
			this._invert = invert || false;
			this._previous = previous || null;
		}

		/**
   * Adds a new comparator to the list of comparators to use.
   *
   * @public
   * @param {Function} comparator - The next comparator function.
   * @param {Boolean=} invert - Indicates if the comparator should sort in descending order.
   * @returns {ComparatorBuilder}
   */

		_createClass(ComparatorBuilder, [{
			key: 'thenBy',
			value: function thenBy(comparator, invert) {
				assert.argumentIsRequired(comparator, 'comparator', Function);
				assert.argumentIsOptional(invert, 'invert', Boolean);

				return new ComparatorBuilder(comparator, invert, this);
			}

			/**
    * Flips the order of the comparator (e.g. ascending to descending).
    *
    * @public
    * @returns {ComparatorBuilder}
    */

		}, {
			key: 'invert',
			value: function invert() {
				var previous = void 0;

				if (this._previous) {
					previous = this._previous.invert();
				} else {
					previous = null;
				}

				return new ComparatorBuilder(this._comparator, !this._invert, previous);
			}

			/**
    * Returns the comparator function.
    *
    * @public
    * @returns {Function}
    */

		}, {
			key: 'toComparator',
			value: function toComparator() {
				var _this = this;

				var previousComparator = void 0;

				if (this._previous) {
					previousComparator = this._previous.toComparator();
				} else {
					previousComparator = comparators.empty;
				}

				return function (a, b) {
					var result = previousComparator(a, b);

					if (result === 0) {
						var sortA = void 0;
						var sortB = void 0;

						if (_this._invert) {
							sortA = b;
							sortB = a;
						} else {
							sortA = a;
							sortB = b;
						}

						result = _this._comparator(sortA, sortB);
					}

					return result;
				};
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[ComparatorBuilder]';
			}

			/**
    * Creates a {@link ComparatorBuilder}, given an initial comparator function.
    *
    * @public
    * @param {Function} comparator - The initial comparator.
    * @param {Boolean=} invert - Indicates if the comparator should sort in descending order.
    * @returns {ComparatorBuilder}
    */

		}], [{
			key: 'startWith',
			value: function startWith(comparator, invert) {
				return new ComparatorBuilder(comparator, invert);
			}
		}]);

		return ComparatorBuilder;
	}();

	return ComparatorBuilder;
}();

},{"./../../lang/assert":24,"./comparators":6}],6:[function(require,module,exports){
'use strict';

var assert = require('./../../lang/assert');

module.exports = function () {
  'use strict';

  /**
   * Functions that can use used as comparators.
   *
   * @public
   * @module collections/sorting/comparators
   */

  return {
    /**
     * Compares two dates (in ascending order).
     *
     * @static
     * @param {Date} a
     * @param {Date} b
     * @returns {Number}
     */
    compareDates: function compareDates(a, b) {
      assert.argumentIsRequired(a, 'a', Date);
      assert.argumentIsRequired(b, 'b', Date);

      return a - b;
    },

    /**
     * Compares two numbers (in ascending order).
     *
     * @static
     * @param {Number} a
     * @param {Number} b
     * @returns {Number}
     */
    compareNumbers: function compareNumbers(a, b) {
      assert.argumentIsRequired(a, 'a', Number);
      assert.argumentIsRequired(b, 'b', Number);

      return a - b;
    },

    /**
     * Compares two strings (in ascending order), using {@link String#localeCompare}.
     *
     * @static
     * @param {Number} a
     * @param {Number} b
     * @returns {Number}
     */
    compareStrings: function compareStrings(a, b) {
      assert.argumentIsRequired(a, 'a', String);
      assert.argumentIsRequired(b, 'b', String);

      return a.localeCompare(b);
    },

    /**
     * Compares two objects, always returning zero.
     *
     * @static
     * @param {*} a
     * @param {*} b
     * @returns {Number}
     */
    empty: function empty(a, b) {
      return 0;
    }
  };
}();

},{"./../../lang/assert":24}],7:[function(require,module,exports){
'use strict';

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var assert = require('./../../lang/assert'),
    is = require('./../../lang/is');

module.exports = function () {
	'use strict';

	/**
  * A map that stores data using a compound key -- without the need
  * to implement objects needing to implement equals and hashcode.
  *
  * @public
  * @param {Number} depth - The number of keys.
  */

	var CompoundMap = function () {
		function CompoundMap(depth) {
			_classCallCheck(this, CompoundMap);

			assert.argumentIsRequired(depth, 'depth', Number);

			this._depth = depth;

			this._map = {};
		}

		/**
   * Returns true if the map has a value for the key.
   *
   * @public
   * @param {...String} keys
   * @returns {Boolean}
   */

		_createClass(CompoundMap, [{
			key: 'has',
			value: function has() {
				for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
					keys[_key] = arguments[_key];
				}

				validateKeys(keys, this._depth);

				var target = this._map;

				return keys.every(function (k) {
					var returnVal = target.hasOwnProperty(k);

					if (returnVal) {
						target = target[k];
					}

					return returnVal;
				});
			}

			/**
    * Puts a value into the map, overwriting any preexisting value.
    *
    * @public
    * @param {*} value
    * @param {...String} keys
    */

		}, {
			key: 'put',
			value: function put(value) {
				for (var _len2 = arguments.length, keys = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
					keys[_key2 - 1] = arguments[_key2];
				}

				validateKeys(keys, this._depth);

				var target = this._map;
				var final = keys.length - 1;

				keys.forEach(function (k, i) {
					if (i === final) {
						target[k] = value;
					} else {
						if (!target.hasOwnProperty(k)) {
							target[k] = {};
						}

						target = target[k];
					}
				});
			}

			/**
    * Gets a value into the map, returning null if the value does not
    * exist.
    *
    * @public
    * @param {...String} keys
    * @reeturns {*}
    */

		}, {
			key: 'get',
			value: function get() {
				for (var _len3 = arguments.length, keys = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
					keys[_key3] = arguments[_key3];
				}

				validateKeys(keys, this._depth);

				return keys.reduce(function (target, k) {
					var next = void 0;

					if (is.object(target) && target.hasOwnProperty(k)) {
						next = target[k];
					} else {
						next = null;
					}

					return next;
				}, this._map);
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[CompoundMap]';
			}
		}]);

		return CompoundMap;
	}();

	function validateKeys(keys, depth) {
		assert.argumentIsValid(keys, 'keys', function (k) {
			return k.length === depth;
		}, 'incorrect number of keys');
	}

	return CompoundMap;
}();

},{"./../../lang/assert":24,"./../../lang/is":29}],8:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Stack = require('./../Stack');

var assert = require('./../../lang/assert'),
    Disposable = require('./../../lang/Disposable'),
    is = require('./../../lang/is');

module.exports = function () {
	'use strict';

	/**
  * A stack of {@link Disposable} instances which itself inherits {@Disposable}.
  * When {@link DisposableStack#dispose} is called, then each item in the collection
  * is disposed in order.
  *
  * @public
  * @extends {Disposable}
  */

	var DisposableStack = function (_Disposable) {
		_inherits(DisposableStack, _Disposable);

		function DisposableStack() {
			_classCallCheck(this, DisposableStack);

			var _this = _possibleConstructorReturn(this, (DisposableStack.__proto__ || Object.getPrototypeOf(DisposableStack)).call(this));

			_this._stack = new Stack();
			return _this;
		}

		/**
   * Adds a new {@link Disposable} instance to the stack.
   *
   * @public
   * @param {Disposable} disposable - The item to add.
   */

		_createClass(DisposableStack, [{
			key: 'push',
			value: function push(disposable) {
				assert.argumentIsRequired(disposable, 'disposable', Disposable, 'Disposable');

				if (this.getIsDisposed()) {
					throw new Error('Unable to push item onto DisposableStack because it has been disposed.');
				}

				this._stack.push(disposable);
			}
		}, {
			key: '_onDispose',
			value: function _onDispose() {
				while (!this._stack.empty()) {
					this._stack.pop().dispose();
				}
			}
		}], [{
			key: 'fromArray',
			value: function fromArray(bindings) {
				assert.argumentIsArray(bindings, 'bindings', Disposable, 'Disposable');

				var returnRef = new DisposableStack();

				for (var i = 0; i < bindings.length; i++) {
					returnRef.push(bindings[i]);
				}

				return returnRef;
			}
		}, {
			key: 'pushPromise',
			value: function pushPromise(stack, promise) {
				assert.argumentIsRequired(stack, 'stack', DisposableStack, 'DisposableStack');
				assert.argumentIsRequired(promise, 'promise');

				return promise.then(function (b) {
					var bindings = void 0;

					if (is.array(b)) {
						bindings = b;
					} else {
						bindings = [b];
					}

					bindings.forEach(function (binding) {
						return stack.push(binding);
					});
				});
			}
		}]);

		return DisposableStack;
	}(Disposable);

	return DisposableStack;
}();

},{"./../../lang/Disposable":18,"./../../lang/assert":24,"./../../lang/is":29,"./../Stack":3}],9:[function(require,module,exports){
'use strict';

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var assert = require('./../../lang/assert');

module.exports = function () {
	'use strict';

	var empty = {};

	/**
  * A list that is restricted to a certain capacity. If adding an
  * item would exceed the capacity; the oldest item is removed.
  *
  * @public
  * @param {Number=} capacity - The maximum number of items the list can contain (defaults to ten).
  */

	var EvictingList = function () {
		function EvictingList(capacity) {
			_classCallCheck(this, EvictingList);

			assert.argumentIsOptional(capacity, 'capacity', Number);

			this._capacity = Math.max(capacity || 0, 0) || 10;

			this._array = [];

			for (var i = 0; i < this._capacity; i++) {
				this._array[i] = empty;
			}

			this._head = null;
		}

		/**
   * Adds an item to the list (possibly causing eviction, if the size of the
   * list exceeds the capacity).
   *
   * @public
   * @param {*} item
   */

		_createClass(EvictingList, [{
			key: 'add',
			value: function add(item) {
				this._array[this._head = getNextIndex(this._head, this._capacity)] = item;
			}

			/**
    * Returns the first item in the list, throwing an error if the list is empty.
    *
    * @public
    * @returns {*}
    */

		}, {
			key: 'peek',
			value: function peek() {
				if (this.empty()) {
					throw new Error('EvictingList is empty');
				}

				return this._array[this._head];
			}

			/**
    * Returns true, if the list is empty; otherwise false.
    *
    * @public
    * @returns {Boolean}
    */

		}, {
			key: 'empty',
			value: function empty() {
				return this._head === null;
			}

			/**
    * The capacity of the list.
    *
    * @public
    * @returns {Number}
    */

		}, {
			key: 'getCapacity',
			value: function getCapacity() {
				return this._capacity;
			}

			/**
    * Copies the items in the list to a new array.
    *
    * @returns {Array}
    */

		}, {
			key: 'toArray',
			value: function toArray() {
				var returnRef = [];

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
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[EvictingList]';
			}
		}]);

		return EvictingList;
	}();

	var getNextIndex = function getNextIndex(current, capacity) {
		var returnVal = void 0;

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

	var getPreviousIndex = function getPreviousIndex(current, capacity) {
		var returnVal = void 0;

		if (current === null) {
			returnVal = 0;
		} else {
			returnVal = current - 1;

			if (returnVal < 0) {
				returnVal = capacity - 1;
			}
		}

		return returnVal;
	};

	return EvictingList;
}();

},{"./../../lang/assert":24}],10:[function(require,module,exports){
'use strict';

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var assert = require('./../../lang/assert');

module.exports = function () {
	'use strict';

	/**
  * A map that is restricted to a certain capacity. If adding an
  * item would exceed the capacity; the oldest item is removed.
  *
  * @public
  * @param {Number=} capacity - The maximum number of items the map can contain (defaults to ten).
  */

	var EvictingMap = function () {
		function EvictingMap(capacity) {
			_classCallCheck(this, EvictingMap);

			assert.argumentIsOptional(capacity, 'capacity', Number);

			this._capacity = Math.max(capacity || 0, 0) || 10;

			this._map = {};

			this._head = null;
			this._tail = null;

			this._size = 0;
		}

		/**
   * Returns true, if the map contains the item; otherwise false.
   *
   * @public
   * @param {String} key
   * @returns {boolean}
   */

		_createClass(EvictingMap, [{
			key: 'has',
			value: function has(key) {
				return this._map.hasOwnProperty(key);
			}

			/**
    * Puts an item into the map (possibly causing eviction, if the size of the
    * list exceeds the capacity).
    *
    * @public
    * @param {*} item
    */

		}, {
			key: 'put',
			value: function put(key, value) {
				this.remove(key);

				var node = void 0;

				if (this._head !== null) {
					node = this._head.insertBefore(key);

					this._head = node;
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
			}

			/**
    * Gets an item from the map, returning a null value if the no item
    * for the given key exists.
    *
    * @public
    * @param {string} key
    * @returns {*}
    */

		}, {
			key: 'get',
			value: function get(key) {
				var returnRef = void 0;

				var item = this._map[key];

				if (item) {
					returnRef = item.getValue();

					var node = item.getNode();

					if (node !== this._head) {
						if (node === this._tail) {
							this._tail = node._previous;
						}

						node.remove();

						this._head = this._head.insertBefore(key);
					}
				} else {
					returnRef = null;
				}

				return returnRef;
			}

			/**
    * Removes an item from the map.
    *
    * @public
    * @param {string} key
    */

		}, {
			key: 'remove',
			value: function remove(key) {
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
			}

			/**
    * Returns true, if the map contains no items; otherwise false.
    *
    * @public
    * @param {String} key
    * @returns {boolean}
    */

		}, {
			key: 'empty',
			value: function empty() {
				return this._size === 0;
			}

			/**
    * Returns the number of items stored in the map.
    *
    * @public
    * @returns {Number}
    */

		}, {
			key: 'getSize',
			value: function getSize() {
				return this._size;
			}

			/**
    * The capacity of the map.
    *
    * @public
    * @returns {Number}
    */

		}, {
			key: 'getCapacity',
			value: function getCapacity() {
				return this._capacity;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[EvictingMap]';
			}
		}]);

		return EvictingMap;
	}();

	var Item = function () {
		function Item(node, key, value) {
			_classCallCheck(this, Item);

			this._node = node;

			this._key = key;
			this._value = value;
		}

		_createClass(Item, [{
			key: 'setItem',
			value: function setItem(key, value) {
				this._key = key;
				this._value = value;
			}
		}, {
			key: 'getKey',
			value: function getKey() {
				return this._key;
			}
		}, {
			key: 'getValue',
			value: function getValue() {
				return this._value;
			}
		}, {
			key: 'getNode',
			value: function getNode() {
				return this._node;
			}
		}]);

		return Item;
	}();

	var Node = function () {
		function Node(item) {
			_classCallCheck(this, Node);

			this._item = item;

			this._previous = null;
			this._next = null;
		}

		_createClass(Node, [{
			key: 'insertBefore',
			value: function insertBefore(item) {
				var node = new Node(item);

				node._next = this;

				if (this._previous !== null) {
					node._previous = this._previous;
					this._previous._next = node;
				}

				this._previous = node;

				return node;
			}
		}, {
			key: 'insertAfter',
			value: function insertAfter(item) {
				var node = new Node(item);

				node._previous = this;

				if (this._next !== null) {
					node._next = this._next;
					this._next._previous = node;
				}

				this._next = node;

				return node;
			}
		}, {
			key: 'remove',
			value: function remove() {
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
			}
		}, {
			key: 'getItem',
			value: function getItem() {
				return this._item;
			}
		}, {
			key: 'hasNext',
			value: function hasNext() {
				return this._next !== null;
			}
		}, {
			key: 'getNext',
			value: function getNext() {
				return this._next;
			}
		}, {
			key: 'hasPrevious',
			value: function hasPrevious() {
				return this._previous !== null;
			}
		}, {
			key: 'getPrevious',
			value: function getPrevious() {
				return this._previous;
			}
		}]);

		return Node;
	}();

	return EvictingMap;
}();

},{"./../../lang/assert":24}],11:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

var _get = function get(object, property, receiver) {
	if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
		var parent = Object.getPrototypeOf(object);if (parent === null) {
			return undefined;
		} else {
			return get(parent, property, receiver);
		}
	} else if ("value" in desc) {
		return desc.value;
	} else {
		var getter = desc.get;if (getter === undefined) {
			return undefined;
		}return getter.call(receiver);
	}
};

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var assert = require('./../../lang/assert'),
    Queue = require('./../Queue');

module.exports = function () {
	'use strict';

	/**
  * A queue that sorts items as they are inserted.
  *
  * This implementation has not been optimized for performance. It uses
  * the native Array sort implementation an may result in n-squared
  * insert performance.
  *
  * @public
  * @extends {Queue}
  */

	var PriorityQueue = function (_Queue) {
		_inherits(PriorityQueue, _Queue);

		function PriorityQueue(comparator) {
			_classCallCheck(this, PriorityQueue);

			var _this = _possibleConstructorReturn(this, (PriorityQueue.__proto__ || Object.getPrototypeOf(PriorityQueue)).call(this));

			assert.argumentIsRequired(comparator, 'comparator', Function);

			_this._comparator = comparator;
			_this._dirty = false;
			return _this;
		}

		_createClass(PriorityQueue, [{
			key: 'enqueue',
			value: function enqueue(item) {
				this._array.push(item);

				this._dirty = true;

				return item;
			}
		}, {
			key: 'dequeue',
			value: function dequeue() {
				checkSortQueue.call(this);

				return _get(PriorityQueue.prototype.__proto__ || Object.getPrototypeOf(PriorityQueue.prototype), 'dequeue', this).call(this);
			}
		}, {
			key: 'peek',
			value: function peek() {
				checkSortQueue.call(this);

				return _get(PriorityQueue.prototype.__proto__ || Object.getPrototypeOf(PriorityQueue.prototype), 'peek', this).call(this);
			}
		}, {
			key: 'scan',
			value: function scan(action) {
				checkSortQueue.call(this);

				return _get(PriorityQueue.prototype.__proto__ || Object.getPrototypeOf(PriorityQueue.prototype), 'scan', this).call(this, action);
			}
		}, {
			key: 'toArray',
			value: function toArray() {
				checkSortQueue.call(this);

				return _get(PriorityQueue.prototype.__proto__ || Object.getPrototypeOf(PriorityQueue.prototype), 'toArray', this).call(this);
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[PriorityQueue]';
			}
		}]);

		return PriorityQueue;
	}(Queue);

	function checkSortQueue() {
		if (this._dirty) {
			this._array.sort(this._comparator);
			this._dirty = false;
		}
	}

	return PriorityQueue;
}();

},{"./../../lang/assert":24,"./../Queue":2}],12:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var assert = require('./../lang/assert');

module.exports = function () {
	'use strict';

	/**
  * An object that can perform an action.
  *
  * @public
  * @interface
  */

	var CommandHandler = function () {
		function CommandHandler() {
			_classCallCheck(this, CommandHandler);
		}

		/**
   * Execute the action.
   *
   * @param {*} data
   * @returns {*}
   */

		_createClass(CommandHandler, [{
			key: 'process',
			value: function process(data) {
				return this._process(data);
			}

			/**
    * @protected
    * @param {*} data
    * @returns {*}
    */

		}, {
			key: '_process',
			value: function _process(data) {
				return true;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[CommandHandler]';
			}

			/**
    * Returns a function which executes the command.
    *
    * @public
    * @param {CommandHandler} commandHandler
    * @returns {function(*=)}
    */

		}], [{
			key: 'toFunction',
			value: function toFunction(commandHandler) {
				assert.argumentIsRequired(commandHandler, 'commandHandler', CommandHandler, 'CommandHandler');

				return function (data) {
					return commandHandler.process(data);
				};
			}

			/**
    * Returns a {@link CommandHandler} that where execution is delegated
    * to a function.
    *
    * @public
    * @param {Function} handler - The function which the command delegates to.
    * @returns {CommandHandler}
    */

		}, {
			key: 'fromFunction',
			value: function fromFunction(handler) {
				assert.argumentIsRequired(handler, 'handler', Function);

				return new DelegateCommandHandler(handler);
			}
		}]);

		return CommandHandler;
	}();

	var DelegateCommandHandler = function (_CommandHandler) {
		_inherits(DelegateCommandHandler, _CommandHandler);

		function DelegateCommandHandler(handler) {
			_classCallCheck(this, DelegateCommandHandler);

			var _this = _possibleConstructorReturn(this, (DelegateCommandHandler.__proto__ || Object.getPrototypeOf(DelegateCommandHandler)).call(this));

			_this._handler = handler;
			return _this;
		}

		_createClass(DelegateCommandHandler, [{
			key: '_process',
			value: function _process(data) {
				return this._handler(data);
			}
		}]);

		return DelegateCommandHandler;
	}(CommandHandler);

	return CommandHandler;
}();

},{"./../lang/assert":24}],13:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var assert = require('./../lang/assert'),
    CommandHandler = require('./CommandHandler');

module.exports = function () {
	'use strict';

	var CompositeCommandHandler = function (_CommandHandler) {
		_inherits(CompositeCommandHandler, _CommandHandler);

		function CompositeCommandHandler(commandHandlerA, commandHandlerB) {
			_classCallCheck(this, CompositeCommandHandler);

			var _this = _possibleConstructorReturn(this, (CompositeCommandHandler.__proto__ || Object.getPrototypeOf(CompositeCommandHandler)).call(this));

			assert.argumentIsRequired(commandHandlerA, 'commandHandlerA', CommandHandler, 'CommandHandler');
			assert.argumentIsRequired(commandHandlerB, 'commandHandlerB', CommandHandler, 'CommandHandler');
			assert.areNotEqual(commandHandlerA, commandHandlerB, 'commandHandlerA', 'commandHandlerB');

			_this._commandHandlerA = commandHandlerA;
			_this._commandHandlerB = commandHandlerB;
			return _this;
		}

		_createClass(CompositeCommandHandler, [{
			key: '_process',
			value: function _process(data) {
				return this._commandHandlerA.process(data) && this._commandHandlerB.process(data);
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[CompositeCommandHandler]';
			}
		}]);

		return CompositeCommandHandler;
	}(CommandHandler);

	return CompositeCommandHandler;
}();

},{"./../lang/assert":24,"./CommandHandler":12}],14:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var assert = require('./../lang/assert'),
    CommandHandler = require('./CommandHandler');

module.exports = function () {
	'use strict';

	var MappedCommandHandler = function (_CommandHandler) {
		_inherits(MappedCommandHandler, _CommandHandler);

		function MappedCommandHandler(nameExtractor) {
			_classCallCheck(this, MappedCommandHandler);

			var _this = _possibleConstructorReturn(this, (MappedCommandHandler.__proto__ || Object.getPrototypeOf(MappedCommandHandler)).call(this));

			assert.argumentIsRequired(nameExtractor, 'nameFunction', Function);

			_this._handlerMap = {};
			_this._defaultHandler = null;

			_this._nameExtractor = nameExtractor;
			return _this;
		}

		_createClass(MappedCommandHandler, [{
			key: 'addCommandHandler',
			value: function addCommandHandler(name, commandHandler) {
				assert.argumentIsRequired(name, 'name', String);
				assert.argumentIsRequired(commandHandler, 'commandHandler', CommandHandler, 'CommandHandler');

				if (this._handlerMap.hasOwnProperty(name)) {
					throw new Error('A handler with the same name already exists in the map');
				}

				if (commandHandler === this) {
					throw new Error('Recursive use of mapped command handlers is prohibited');
				}

				this._handlerMap[name] = commandHandler;

				return this;
			}
		}, {
			key: 'setDefaultCommandHandler',
			value: function setDefaultCommandHandler(commandHandler) {
				assert.argumentIsRequired(commandHandler, 'commandHandler', CommandHandler, 'CommandHandler');

				this._defaultHandler = commandHandler;

				return this;
			}
		}, {
			key: '_process',
			value: function _process(data) {
				var handlerName = this._nameExtractor(data);
				var handler = this._handlerMap[handlerName] || this._defaultHandler;

				var returnRef = void 0;

				if (handler) {
					returnRef = handler.process(data);
				} else {
					returnRef = null;
				}

				return returnRef;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[MappedCommandHandler]';
			}
		}]);

		return MappedCommandHandler;
	}(CommandHandler);

	return MappedCommandHandler;
}();

},{"./../lang/assert":24,"./CommandHandler":12}],15:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var assert = require('./assert'),
    Enum = require('./Enum'),
    is = require('./is');

module.exports = function () {
	'use strict';

	/**
  * An enumeration for currency types.
  *
  * @public
  * @param {String} code - Currency code (e.g. "USD")
  * @param {String} description - The description (e.g. "US Dollar")
  * @extends {Enum}
  */

	var Currency = function (_Enum) {
		_inherits(Currency, _Enum);

		function Currency(code, description) {
			_classCallCheck(this, Currency);

			return _possibleConstructorReturn(this, (Currency.__proto__ || Object.getPrototypeOf(Currency)).call(this, code, description));
		}

		/**
   * The Canadian Dollar.
   *
   * @returns {Currency}
   */

		_createClass(Currency, [{
			key: 'toString',
			value: function toString() {
				return '[Currency (code=' + this.code + ')]';
			}
		}], [{
			key: 'EUR',

			/**
    * The Euro.
    *
    * @returns {Currency}
    */
			value: function EUR() {
				return eur;
			}

			/**
    * The US Dollar.
    *
    * @returns {Currency}
    */

		}, {
			key: 'CAD',
			get: function get() {
				return cad;
			}
		}, {
			key: 'USD',
			get: function get() {
				return usd;
			}
		}]);

		return Currency;
	}(Enum);

	var cad = new Currency('CAD', 'Canadian Dollar');
	var eur = new Currency('EUR', 'Euro');
	var usd = new Currency('USD', 'US Dollar');

	return Currency;
}();

},{"./Enum":19,"./assert":24,"./is":29}],16:[function(require,module,exports){
'use strict';

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var assert = require('./assert'),
    ComparatorBuilder = require('./../collections/sorting/ComparatorBuilder'),
    comparators = require('./../collections/sorting/comparators'),
    is = require('./is');

module.exports = function () {
	'use strict';

	/**
  * A data structure that represents a day (year, month, and day)
  * without consideration for time or timezone.
  *
  * @public
  */

	var Day = function () {
		function Day(year, month, day) {
			_classCallCheck(this, Day);

			if (!Day.validate(year, month, day)) {
				throw new Error('Unable to instantiate Day, input is invalid [' + year + '], [' + month + '], [' + day + ']');
			}

			this._year = year;
			this._month = month;
			this._day = day;
		}

		/**
   * Calculates a new {@link Day} in the future (or past).
   *
   * @public
   * @param {Number} days - The number of days to add (negative numbers can be used for subtraction).
   * @param {Boolean=} inverse - If true, the sign of the "days" value will be flipped.
   * @returns {Day}
   */

		_createClass(Day, [{
			key: 'addDays',
			value: function addDays(days, inverse) {
				assert.argumentIsRequired(days, 'days', Number);
				assert.argumentIsOptional(inverse, inverse, Boolean);
				assert.argumentIsValid(days, 'days', is.large, 'is an integer');

				var totalDaysToShift = days;

				if (inverse) {
					totalDaysToShift = totalDaysToShift * -1;
				}

				var positive = is.positive(totalDaysToShift);

				var shiftedDay = this._day;
				var shiftedMonth = this._month;
				var shiftedYear = this._year;

				while (totalDaysToShift !== 0) {
					var monthDaysAvailable = void 0;
					var monthDaysToShift = void 0;

					if (positive) {
						monthDaysAvailable = Day.getDaysInMonth(shiftedYear, shiftedMonth) - shiftedDay;
						monthDaysToShift = Math.min(totalDaysToShift, monthDaysAvailable);
					} else {
						monthDaysAvailable = 1 - shiftedDay;
						monthDaysToShift = Math.max(totalDaysToShift, monthDaysAvailable);
					}

					totalDaysToShift = totalDaysToShift - monthDaysToShift;

					if (totalDaysToShift === 0) {
						shiftedDay = shiftedDay + monthDaysToShift;
					} else if (positive) {
						shiftedMonth++;

						if (shiftedMonth > 12) {
							shiftedYear++;
							shiftedMonth = 1;
						}

						shiftedDay = 0;
					} else {
						shiftedMonth--;

						if (shiftedMonth < 1) {
							shiftedYear--;
							shiftedMonth = 12;
						}

						shiftedDay = Day.getDaysInMonth(shiftedYear, shiftedMonth) + 1;
					}
				}

				return new Day(shiftedYear, shiftedMonth, shiftedDay);
			}

			/**
    * Calculates a new {@link Day} in the past (or future).
    *
    * @public
    * @param {Number} days - The number of days to subtract (negative numbers can be used for addition).
    * @returns {Day}
    */

		}, {
			key: 'subtractDays',
			value: function subtractDays(days) {
				return this.addDays(days, true);
			}

			/**
    * The year.
    *
    * @public
    * @returns {Number}
    */

		}, {
			key: 'format',

			/**
    * Outputs the date as the formatted string: {year}-{month}-{day}.
    *
    * @public
    * @returns {String}
    */
			value: function format() {
				return this._year + '-' + leftPad(this._month) + '-' + leftPad(this._day);
			}

			/**
    * Returns the JSON representation.
    *
    * @public
    * @returns {String}
    */

		}, {
			key: 'toJSON',
			value: function toJSON() {
				return this.format();
			}

			/**
    * Converts a string (which matches the output of {@link Day#format} into
    * a {@link Day} instance.
    *
    * @public
    * @param {String} value
    * @returns {Day}
    */

		}, {
			key: 'toString',
			value: function toString() {
				return '[Day]';
			}
		}, {
			key: 'year',
			get: function get() {
				return this._year;
			}

			/**
    * The month of the year (January is one, December is twelve).
    *
    * @public
    * @returns {Number}
    */

		}, {
			key: 'month',
			get: function get() {
				return this._month;
			}

			/**
    * The day of the month.
    *
    * @public
    * @returns {Number}
    */

		}, {
			key: 'day',
			get: function get() {
				return this._day;
			}
		}], [{
			key: 'parse',
			value: function parse(value) {
				assert.argumentIsRequired(value, 'value', String);

				var match = value.match(dayRegex);

				if (match === null) {
					throw new Error('Unable to parse value as Day [ ' + value + ' ]');
				}

				return new Day(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]));
			}

			/**
    * Returns true if the year, month, and day combination is valid; otherwise false.
    *
    * @public
    * @param {Number} year
    * @param {Number} month
    * @param {Number} day
    * @returns {Boolean}
    */

		}, {
			key: 'validate',
			value: function validate(year, month, day) {
				return is.integer(year) && is.integer(month) && is.integer(day) && !(month < 1) && !(month > 12) && !(day < 1) && !(day > Day.getDaysInMonth(year, month));
			}

			/**
    * Returns the number of days in a given month.
    *
    * @public
    * @param {number} year - The year number (e.g. 2017)
    * @param {number} month - The month number (e.g. 2 is February)
    */

		}, {
			key: 'getDaysInMonth',
			value: function getDaysInMonth(year, month) {
				switch (month) {
					case 1:
					case 3:
					case 5:
					case 7:
					case 8:
					case 10:
					case 12:
						{
							return 31;
						}
					case 4:
					case 6:
					case 9:
					case 11:
						{
							return 30;
						}
					case 2:
						{
							if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
								return 29;
							} else {
								return 28;
							}
						}
				}
			}

			/**
    * A comparator function for {@link Day} instances.
    *
    * @public
    * @param {Day} a
    * @param {Day} b
    * @returns {Number}
    */

		}, {
			key: 'compareDays',
			value: function compareDays(a, b) {
				assert.argumentIsRequired(a, 'a', Day, 'Day');
				assert.argumentIsRequired(b, 'b', Day, 'Day');

				return comparator(a, b);
			}
		}]);

		return Day;
	}();

	var dayRegex = /^([0-9]{4}).([0-9]{2}).([0-9]{2})$/;

	function leftPad(value) {
		return value < 10 ? '0' + value : '' + value;
	}

	var comparator = ComparatorBuilder.startWith(function (a, b) {
		return comparators.compareNumbers(a.year, b.year);
	}).thenBy(function (a, b) {
		return comparators.compareNumbers(a.month, b.month);
	}).thenBy(function (a, b) {
		return comparators.compareNumbers(a.day, b.day);
	}).toComparator();

	return Day;
}();

},{"./../collections/sorting/ComparatorBuilder":5,"./../collections/sorting/comparators":6,"./assert":24,"./is":29}],17:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var assert = require('./assert'),
    Enum = require('./Enum'),
    is = require('./is');

var Big = require('big.js');

module.exports = function () {
	'use strict';

	/**
  * An immutable object that allows for arbitrary-precision calculations.
  *
  * @public
  * @param {Decimal|Number|String} value - The value.
  */

	var Decimal = function () {
		function Decimal(value) {
			_classCallCheck(this, Decimal);

			this._big = getBig(value);
		}

		/**
   * Returns a new {@link Decimal} instance that is the sum of the
   * current instance's value and the value supplied.
   *
   * @public
   * @param {Decimal|Number|String} other - The value to add.
   * @returns {Decimal}
   */

		_createClass(Decimal, [{
			key: 'add',
			value: function add(other) {
				return new Decimal(this._big.plus(getBig(other)));
			}

			/**
    * Returns a new {@link Decimal} instance with a value that results
    * from the subtraction of the value supplied from the current instance's
    * value.
    *
    * @public
    * @param {Decimal|Number|String} other - The value to subtract.
    * @returns {Decimal}
    */

		}, {
			key: 'subtract',
			value: function subtract(other) {
				return new Decimal(this._big.minus(getBig(other)));
			}

			/**
    * Returns a new {@link Decimal} instance that is the product of the
    * current instance's value and the value supplied.
    *
    * @public
    * @param {Decimal|Number|String} other - The value to add.
    * @returns {Decimal}
    */

		}, {
			key: 'multiply',
			value: function multiply(other) {
				return new Decimal(this._big.times(getBig(other)));
			}

			/**
    * Returns a new {@link Decimal} instance with a value that results
    * from the division of the current instance's value by the value
    * supplied.
    *
    * @public
    * @param {Decimal|Number|String} other - The value to subtract.
    * @returns {Decimal}
    */

		}, {
			key: 'divide',
			value: function divide(other) {
				return new Decimal(this._big.div(getBig(other)));
			}

			/**
    * Returns a new {@link Decimal} with a value resulting from a rounding
    * operation on the current value.
    *
    * @public
    * @param {Number} places - The number of decimal places to retain.
    * @param {RoundingMode=} mode - The strategy to use for rounding.
    * @returns {Decimal}
    */

		}, {
			key: 'round',
			value: function round(places, mode) {
				assert.argumentIsRequired(places, 'places', Number);
				assert.argumentIsOptional(mode, 'mode', RoundingMode, 'RoundingMode');

				var modeToUse = mode || RoundingMode.NORMAL;

				return new Decimal(this._big.round(places, modeToUse.value));
			}

			/**
    * Returns a new {@link Decimal} instance having the absolute value of
    * the current instance's value.
    *
    * @public
    * @returns {Decimal}
    */

		}, {
			key: 'absolute',
			value: function absolute() {
				return new Decimal(this._big.abs());
			}

			/**
    * Returns a new {@link Decimal} instance the opposite sign as the
    * current instance's value.
    *
    * @public
    * @returns {Decimal}
    */

		}, {
			key: 'opposite',
			value: function opposite() {
				return this.multiply(-1);
			}

			/**
    * Returns a Boolean value, indicating if the current instance's value is
    * equal to zero (or approximately equal to zero).
    *
    * @public
    * @param {Boolean=} approximate
    * @returns {Boolean}
    */

		}, {
			key: 'getIsZero',
			value: function getIsZero(approximate) {
				assert.argumentIsOptional(approximate, 'approximate', Boolean);

				return this._big.eq(zero) || is.boolean(approximate) && approximate && this.round(20, RoundingMode.NORMAL).getIsZero();
			}

			/**
    * Returns true if the current instance is positive; otherwise false.
    *
    * @public
    * @returns {Boolean}
    */

		}, {
			key: 'getIsPositive',
			value: function getIsPositive() {
				return this._big.gt(zero);
			}

			/**
    * Returns true if the current instance is negative; otherwise false.
    *
    * @public
    * @returns {Boolean}
    */

		}, {
			key: 'getIsNegative',
			value: function getIsNegative() {
				return this._big.lt(zero);
			}

			/**
    * Returns true if the current instance is greater than the value.
    *
    * @public
    * @param {Decimal|Number|String} value - The value to compare.
    * @returns {Boolean}
    */

		}, {
			key: 'getIsGreaterThan',
			value: function getIsGreaterThan(other) {
				return this._big.gt(getBig(other));
			}

			/**
    * Returns true if the current instance is less than the value.
    *
    * @public
    * @param {Decimal|Number|String} value - The value to compare.
    * @returns {Boolean}
    */

		}, {
			key: 'getIsLessThan',
			value: function getIsLessThan(other) {
				return this._big.lt(getBig(other));
			}

			/**
    * Returns true if the current instance is equal to the value.
    *
    * @public
    * @param {Decimal|Number|String} value - The value to compare.
    * @returns {Boolean}
    */

		}, {
			key: 'getIsEqual',
			value: function getIsEqual(other) {
				return this._big.eq(getBig(other));
			}

			/**
    * Emits a floating point value that approximates the value of the current
    * instance.
    *
    * @public
    * @param {Number=} places
    * @returns {Number}
    */

		}, {
			key: 'toFloat',
			value: function toFloat(places) {
				assert.argumentIsOptional(places, 'places', Number);

				// Accepting places might be a mistake here; perhaps
				// the consumer should be forced to use the round
				// function.

				return parseFloat(this._big.toFixed(places || 16));
			}

			/**
    * Returns a string-based representation of the instance's value.
    *
    * @public
    * @returns {String}
    */

		}, {
			key: 'toFixed',
			value: function toFixed() {
				return this._big.toFixed();
			}

			/**
    * Returns the JSON representation.
    *
    * @public
    * @returns {String}
    */

		}, {
			key: 'toJSON',
			value: function toJSON() {
				return this.toFixed();
			}

			/**
    * Parses the value emitted by {@link Decimal#toJSON}.
    *
    * @public
    * @param {String} value
    * @returns {Decimal}
    */

		}, {
			key: 'toString',
			value: function toString() {
				return '[Decimal]';
			}
		}], [{
			key: 'parse',
			value: function parse(value) {
				return new Decimal(value);
			}

			/**
    * Returns an instance with the value of zero.
    *
    * @public
    * @returns {Decimal}
    */

		}, {
			key: 'getIsPositive',

			/**
    * Runs {@link Decimal#getIsPositive} and returns the result.
    *
    * @public
    * @param {Decimal} instance
    */
			value: function getIsPositive(instance) {
				assert.argumentIsRequired(instance, 'instance', Decimal, 'Decimal');

				return instance.getIsPositive();
			}

			/**
    * Checks an instance to see if its negative or zero.
    *
    * @public
    * @param {Decimal} instance
    */

		}, {
			key: 'getIsNotPositive',
			value: function getIsNotPositive(instance) {
				assert.argumentIsRequired(instance, 'instance', Decimal, 'Decimal');

				return instance.getIsNegative() || instance.getIsZero();
			}

			/**
    * Runs {@link Decimal#getIsNegative} and returns the result.
    *
    * @public
    * @param {Decimal} instance
    */

		}, {
			key: 'getIsNegative',
			value: function getIsNegative(instance) {
				assert.argumentIsRequired(instance, 'instance', Decimal, 'Decimal');

				return instance.getIsNegative();
			}

			/**
    * Checks an instance to see if its positive or zero.
    *
    * @public
    * @param {Decimal} instance
    */

		}, {
			key: 'getIsNotNegative',
			value: function getIsNotNegative(instance) {
				assert.argumentIsRequired(instance, 'instance', Decimal, 'Decimal');

				return instance.getIsPositive() || instance.getIsZero();
			}

			/**
    * A comparator function for {@link Decimal} instances.
    *
    * @public
    * @param {Decimal} a
    * @param {Decimal} b
    * @returns {Number}
    */

		}, {
			key: 'compareDecimals',
			value: function compareDecimals(a, b) {
				assert.argumentIsRequired(a, 'a', Decimal, 'Decimal');
				assert.argumentIsRequired(b, 'b', Decimal, 'Decimal');

				if (a._big.gt(b)) {
					return 1;
				} else if (a._big.lt(b)) {
					return -1;
				} else {
					return 0;
				}
			}
		}, {
			key: 'ZERO',
			get: function get() {
				return decimalZero;
			}

			/**
    * Returns an instance with the value of one.
    *
    * @public
    * @returns {Decimal}
    */

		}, {
			key: 'ONE',
			get: function get() {
				return decimalOne;
			}

			/**
    * Returns an instance with the value of one.
    *
    * @public
    * @returns {Decimal}
    */

		}, {
			key: 'NEGATIVE_ONE',
			get: function get() {
				return decimalNegativeOne;
			}

			/**
    * The enumeration for rounding modes.
    *
    * @public
    * @returns {RoundingMode}
    * @constructor
    */

		}, {
			key: 'ROUNDING_MODE',
			get: function get() {
				return RoundingMode;
			}
		}]);

		return Decimal;
	}();

	var zero = new Big(0);
	var positiveOne = new Big(1);
	var negativeOne = new Big(-1);

	var decimalZero = new Decimal(zero);
	var decimalOne = new Decimal(positiveOne);
	var decimalNegativeOne = new Decimal(negativeOne);

	function getBig(value) {
		if (value instanceof Big) {
			return value;
		} else if (value instanceof Decimal) {
			return value._big;
		} else {
			return new Big(value);
		}
	}

	var RoundingMode = function (_Enum) {
		_inherits(RoundingMode, _Enum);

		function RoundingMode(value, description) {
			_classCallCheck(this, RoundingMode);

			var _this = _possibleConstructorReturn(this, (RoundingMode.__proto__ || Object.getPrototypeOf(RoundingMode)).call(this, value.toString(), description));

			_this._value = value;
			return _this;
		}

		_createClass(RoundingMode, [{
			key: 'toString',
			value: function toString() {
				return '[RoundingMode]';
			}
		}, {
			key: 'value',
			get: function get() {
				return this._value;
			}

			/**
    * Rounds away from zero.
    *
    * @returns {RoundingMode}
    */

		}], [{
			key: 'UP',
			get: function get() {
				return up;
			}

			/**
    * Rounds towards zero.
    *
    * @returns {RoundingMode}
    */

		}, {
			key: 'DOWN',
			get: function get() {
				return down;
			}

			/**
    * Rounds towards nearest neighbor. If equidistant, rounds away from zero.
    *
    * @returns {RoundingMode}
    */

		}, {
			key: 'NORMAL',
			get: function get() {
				return normal;
			}
		}]);

		return RoundingMode;
	}(Enum);

	var up = new RoundingMode(3, 'up');
	var down = new RoundingMode(0, 'down');
	var normal = new RoundingMode(1, 'normal');

	return Decimal;
}();

},{"./Enum":19,"./assert":24,"./is":29,"big.js":44}],18:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var assert = require('./assert');

module.exports = function () {
	'use strict';

	/**
  * An object that has an end-of-life process.
  *
  * @public
  * @interface
  */

	var Disposable = function () {
		function Disposable() {
			_classCallCheck(this, Disposable);

			this._disposed = false;
		}

		/**
   * Invokes end-of-life logic. Once this function has been
   * invoked, further interaction with the object is not
   * recommended.
   *
   * @public
   */

		_createClass(Disposable, [{
			key: 'dispose',
			value: function dispose() {
				if (this._disposed) {
					return;
				}

				this._disposed = true;

				this._onDispose();
			}

			/**
    * @protected
    * @abstract
    * @ignore
    */

		}, {
			key: '_onDispose',
			value: function _onDispose() {
				return;
			}

			/**
    * Returns true if the {@link Disposable#dispose} function has been invoked.
    *
    * @public
    * @returns {boolean}
    */

		}, {
			key: 'getIsDisposed',
			value: function getIsDisposed() {
				return this._disposed || false;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[Disposable]';
			}

			/**
    * Creates and returns a {@link Disposable} object with end-of-life logic
    * delegated to a function.
    *
    * @public
    * @param disposeAction {Function}
    * @returns {Disposable}
    */

		}], [{
			key: 'fromAction',
			value: function fromAction(disposeAction) {
				assert.argumentIsRequired(disposeAction, 'disposeAction', Function);

				return new DisposableAction(disposeAction);
			}

			/**
    * Creates and returns a {@link Disposable} object whose end-of-life
    * logic does nothing.
    *
    * @public
    * @returns {Disposable}
    */

		}, {
			key: 'getEmpty',
			value: function getEmpty() {
				return Disposable.fromAction(function () {
					return;
				});
			}
		}]);

		return Disposable;
	}();

	var DisposableAction = function (_Disposable) {
		_inherits(DisposableAction, _Disposable);

		function DisposableAction(disposeAction) {
			_classCallCheck(this, DisposableAction);

			var _this = _possibleConstructorReturn(this, (DisposableAction.__proto__ || Object.getPrototypeOf(DisposableAction)).call(this, disposeAction));

			_this._disposeAction = disposeAction;
			return _this;
		}

		_createClass(DisposableAction, [{
			key: '_onDispose',
			value: function _onDispose() {
				this._disposeAction();
				this._disposeAction = null;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[DisposableAction]';
			}
		}]);

		return DisposableAction;
	}(Disposable);

	return Disposable;
}();

},{"./assert":24}],19:[function(require,module,exports){
'use strict';

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var assert = require('./assert');

module.exports = function () {
	'use strict';

	var types = new Map();

	/**
  * An enumeration. Must be inherited. Do not instantiate directly.
  * Also, this class uses the ES6 Map, therefore a polyfill must
  * be supplied.
  *
  * @public
  * @interface
  * @param {String} - The unique code of the enumeration item.
  * @param {Description} - A description of the enumeration item.
  */

	var Enum = function () {
		function Enum(code, description) {
			_classCallCheck(this, Enum);

			assert.argumentIsRequired(code, 'code', String);
			assert.argumentIsRequired(description, 'description', String);

			this._code = code;
			this._description = description;

			var c = this.constructor;

			if (!types.has(c)) {
				types.set(c, []);
			}

			var existing = Enum.fromCode(c, code);

			if (existing === null) {
				types.get(c).push(this);
			}
		}

		/**
   * The unique code.
   */

		_createClass(Enum, [{
			key: 'equals',

			/**
    * Returns true if the provided {@link Enum} instance equals
    *
    * @param {Enum} other
    * @returns {boolean}
    */
			value: function equals(other) {
				return other === this || other instanceof Enum && other.constructor === this.constructor && other.code === this.code;
			}
		}, {
			key: 'toJSON',
			value: function toJSON() {
				return this.code;
			}

			/**
    * Looks up a enumeration item; given the enumeration type and the enumeration
    * item's value. If no matching item can be found, a null value is returned.
    *
    * @param {Function} type - The enumeration type.
    * @param {String} code - The enumeration item's code.
    * @returns {Enum|null}
    */

		}, {
			key: 'toString',
			value: function toString() {
				return '[Enum]';
			}
		}, {
			key: 'code',
			get: function get() {
				return this._code;
			}

			/**
    * The description.
    *
    * @returns {*}
    */

		}, {
			key: 'description',
			get: function get() {
				return this._description;
			}
		}], [{
			key: 'fromCode',
			value: function fromCode(type, code) {
				return Enum.getItems(type).find(function (x) {
					return x.code === code;
				}) || null;
			}

			/**
    * Returns all of the enumeration's items (given an enumeration type).
    *
    * @param {Function} type - The enumeration to list.
    * @returns {Array}
    */

		}, {
			key: 'getItems',
			value: function getItems(type) {
				return types.get(type) || [];
			}
		}]);

		return Enum;
	}();

	return Enum;
}();

},{"./assert":24}],20:[function(require,module,exports){
'use strict';

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var assert = require('./assert'),
    is = require('./is');

var Decimal = require('./Decimal'),
    Currency = require('./Currency');

module.exports = function () {
	'use strict';

	/**
  * A structure for storing money amounts.
  *
  * @public
  * @param {Decimal|Number|String} - A amount, which can be parsed as a {@link Decimal}
  * @param {Currency} - The currency.
  */

	var Money = function () {
		function Money(value, currency) {
			_classCallCheck(this, Money);

			assert.argumentIsRequired(currency, 'currency', Currency, 'Currency');

			this._decimal = getDecimal(value);
			this._currency = currency;
		}

		/**
   * The currency amount.
   *
   * @public
   * @returns {Decimal}
   */

		_createClass(Money, [{
			key: 'toAmount',
			value: function toAmount(places, mode) {
				return new Money(this._decimal.round(getPlaces(places), mode), this._currency);
			}

			/**
    * Returns the JSON representation.
    *
    * @public
    * @returns {Object}
    */

		}, {
			key: 'toJSON',
			value: function toJSON() {
				return {
					decimal: this._decimal,
					currency: this._currency
				};
			}
			/**
    * Parses the value emitted by {@link Decimal#toJSON}.
    *
    * @public
    * @param {Object} value
    * @returns {Money}
    */

		}, {
			key: 'toString',
			value: function toString() {
				return '[Money]';
			}
		}, {
			key: 'decimal',
			get: function get() {
				return this._decimal;
			}

			/**
    * The currency.
    *
    * @public
    * @returns {Currency}
    */

		}, {
			key: 'currency',
			get: function get() {
				return this._currency;
			}
		}], [{
			key: 'parse',
			value: function parse(value) {
				return new Money(value.decimal, value.currency);
			}
		}]);

		return Money;
	}();

	function getDecimal(value) {
		if (value instanceof Decimal) {
			return value;
		} else {
			return new Decimal(value);
		}
	}

	function getPlaces(value) {
		if (is.integer(value) && !(value < 0)) {
			return value;
		} else {
			return 2;
		}
	}

	return Money;
}();

},{"./Currency":15,"./Decimal":17,"./assert":24,"./is":29}],21:[function(require,module,exports){
'use strict';

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var assert = require('./assert'),
    is = require('./is');

var moment = require('moment-timezone');

module.exports = function () {
	'use strict';

	/**
  * A data structure encapsulates (and lazy loads) a moment (see https://momentjs.com/).
  *
  * @public
  * @param {Number} timestamp
  * @param {String=} timezone
  */

	var Timestamp = function () {
		function Timestamp(timestamp, timezone) {
			_classCallCheck(this, Timestamp);

			assert.argumentIsValid(timestamp, 'timestamp', is.large, 'is an integer');
			assert.argumentIsOptional(timezone, 'timezone', String);

			this._timestamp = timestamp;
			this._timezone = timezone || null;

			this._moment = null;
		}

		/**
   * The timestamp.
   *
   * @public
   * @returns {Number}
   */

		_createClass(Timestamp, [{
			key: 'toJSON',

			/**
    * Returns the JSON representation.
    *
    * @public
    * @returns {Number}
    */
			value: function toJSON() {
				return this.timestamp;
			}

			/**
    * Parses the value emitted by {@link Timestamp#toJSON}.
    *
    * @public
    * @param {String} value
    * @returns {Timestamp}
    */

		}, {
			key: 'toString',
			value: function toString() {
				return '[Timestamp]';
			}
		}, {
			key: 'timestamp',
			get: function get() {
				return this._timestamp;
			}

			/**
    * The moment instance.
    *
    * @public
    * @returns {moment}
    */

		}, {
			key: 'moment',
			get: function get() {
				if (this._moment === null) {
					this._moment = moment(this._timestamp);

					if (this._timezone !== null) {
						this.moment.tz(this._timezone);
					}
				}

				return this._moment;
			}
		}], [{
			key: 'parse',
			value: function parse(value) {
				return new Timestamp(value);
			}
		}]);

		return Timestamp;
	}();

	return Timestamp;
}();

},{"./assert":24,"./is":29,"moment-timezone":47}],22:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var assert = require('./assert'),
    Enum = require('./Enum'),
    is = require('./is'),
    timezone = require('./timezone');

module.exports = function () {
	'use strict';

	/**
  * An enumeration item that lists timezones, according to the common names
  * used in the tz database (see https://en.wikipedia.org/wiki/Tz_database).
  * The full list of names is sourced from moment.js; however, this wikipedia
  * article lists them: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
  *
  * @public
  * @param {String} code - The timezone name
  * @extends {Enum}
  */

	var Timezones = function (_Enum) {
		_inherits(Timezones, _Enum);

		function Timezones(code) {
			_classCallCheck(this, Timezones);

			return _possibleConstructorReturn(this, (Timezones.__proto__ || Object.getPrototypeOf(Timezones)).call(this, code, code));
		}

		/**
   * America/Chicago
   *
   * @public
   * @returns {Timezones}
   */

		_createClass(Timezones, [{
			key: 'toString',
			value: function toString() {
				return '[Timezone (name=' + this.code + ')]';
			}
		}], [{
			key: 'AMERICA_CHICAGO',
			get: function get() {
				return america_chicago;
			}

			/**
    * America/New_York
    *
    * @public
    * @returns {Timezones}
    */

		}, {
			key: 'AMERICA_NEW_YORK',
			get: function get() {
				return america_new_york;
			}
		}]);

		return Timezones;
	}(Enum);

	timezone.getTimezones().forEach(function (name) {
		return new Timezones(name);
	});

	var america_chicago = Enum.fromCode(Timezones, 'America/Chicago');
	var america_new_york = Enum.fromCode(Timezones, 'America/New_York');

	return Timezones;
}();

},{"./Enum":19,"./assert":24,"./is":29,"./timezone":37}],23:[function(require,module,exports){
'use strict';

var assert = require('./assert'),
    is = require('./is');

module.exports = function () {
	'use strict';

	/**
  * Utilities for working with arrays.
  *
  * @public
  * @module lang/array
  */

	return {
		/**
   * Returns the unique items from an array, where the unique
   * key is determined via a strict equality check.
   *
   * @static
   * @param {Array} a
   * @returns {Array}
   */
		unique: function unique(a) {
			assert.argumentIsArray(a, 'a');

			return a.filter(function (item, index, array) {
				return array.indexOf(item) === index;
			});
		},

		/**
   * Returns the unique items from an array, where the unique
   * key is determined by a delegate.
   *
   * @static
   * @param {Array} a
   * @param {Function} keySelector - The function, when applied to an item yields a unique key.
   * @returns {Array}
   */
		uniqueBy: function uniqueBy(a, keySelector) {
			assert.argumentIsArray(a, 'a');

			return a.filter(function (item, index, array) {
				var key = keySelector(item);

				return array.findIndex(function (candidate) {
					return key === keySelector(candidate);
				}) === index;
			});
		},

		/**
   * Splits array into groups and returns an object (where the properties have
   * are arrays). Unlike the indexBy function, there can be many items
   * which share the same key.
   *
   * @static
   * @param {Array} a
   * @param {Function} keySelector - The function, when applied to an item yields a key.
   * @returns {Object}
   */
		groupBy: function groupBy(a, keySelector) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsRequired(keySelector, 'keySelector', Function);

			return a.reduce(function (groups, item) {
				var key = keySelector(item);

				if (!groups.hasOwnProperty(key)) {
					groups[key] = [];
				}

				groups[key].push(item);

				return groups;
			}, {});
		},

		/**
   * Splits array into groups and returns an object (where the properties are items from the
   * original array). Unlike the groupBy, Only one item can have a given key
   * value.
   *
   * @static
   * @param {Array} a
   * @param {Function} keySelector - The function, when applied to an item yields a unique key.
   * @returns {Object}
   */
		indexBy: function indexBy(a, keySelector) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsRequired(keySelector, 'keySelector', Function);

			return a.reduce(function (map, item) {
				var key = keySelector(item);

				if (map.hasOwnProperty(key)) {
					throw new Error('Unable to index array. A duplicate key exists.');
				}

				map[key] = item;

				return map;
			}, {});
		},

		/**
   * Returns a new array containing all but the last item.
   *
   * @static
   * @param {Array} a
   * @returns {Array}
   */
		dropRight: function dropRight(a) {
			assert.argumentIsArray(a, 'a');

			var returnRef = Array.from(a);

			if (returnRef.length !== 0) {
				returnRef.pop();
			}

			return returnRef;
		},

		/**
   * Returns the last item from an array, or an undefined value, if the
   * array is empty.
   *
   * @static
   * @param {Array} a
   * @returns {*|undefined}
   */
		last: function last(a) {
			assert.argumentIsArray(a, 'a');

			var returnRef = void 0;

			if (a.length !== 0) {
				returnRef = a[a.length - 1];
			} else {
				returnRef = undefined;
			}

			return returnRef;
		},

		/**
   * Returns a copy of an array, replacing any item that is itself an array
   * with the item's items.
   *
   * @static
   * @param {Array} a
   * @param {Boolean=} recursive - If true, all nested arrays will be flattened.
   * @returns {Array}
   */
		flatten: function flatten(a, recursive) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsOptional(recursive, 'recursive', Boolean);

			var empty = [];

			var flat = empty.concat.apply(empty, a);

			if (recursive && flat.some(function (x) {
				return is.array(x);
			})) {
				flat = this.flatten(flat, true);
			}

			return flat;
		},

		/**
   * Breaks an array into smaller arrays, returning an array of arrays.
   *
   * @static
   * @param {Array} a
   * @param {Number} size - The maximum number of items per partition.
   * @param {Array<Array>}
   */
		partition: function partition(a, size) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsOptional(size, 'size', Number);

			var copy = a.slice(0);
			var partitions = [];

			while (copy.length !== 0) {
				partitions.push(copy.splice(0, size));
			}

			return partitions;
		},

		/**
   * Set difference operation (using strict equality).
   *
   * @static
   * @param {Array} a
   * @param {Array} b
   * @returns {Array}
   */
		difference: function difference(a, b) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsArray(b, 'b');

			var returnRef = [];

			a.forEach(function (candidate) {
				var exclude = b.some(function (comparison) {
					return candidate === comparison;
				});

				if (!exclude) {
					returnRef.push(candidate);
				}
			});

			return returnRef;
		},

		/**
   * Set symmetric difference operation (using strict equality). In
   * other words, this is the union of the differences between the
   * sets.
   *
   * @static
   * @param {Array} a
   * @param {Array} b
   * @returns {Array}
   */
		differenceSymmetric: function differenceSymmetric(a, b) {
			return this.union(this.difference(a, b), this.difference(b, a));
		},

		/**
   * Set union operation (using strict equality).
   *
   * @static
   * @param {Array} a
   * @param {Array} b
   * @returns {Array}
   */
		union: function union(a, b) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsArray(b, 'b');

			var returnRef = a.slice();

			b.forEach(function (candidate) {
				var exclude = returnRef.some(function (comparison) {
					return candidate === comparison;
				});

				if (!exclude) {
					returnRef.push(candidate);
				}
			});

			return returnRef;
		},

		/**
   * Set intersection operation (using strict equality).
   *
   * @static
   * @param {Array} a
   * @param {Array} b
   * @returns {Array}
   */
		intersection: function intersection(a, b) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsArray(b, 'b');

			var returnRef = [];

			a.forEach(function (candidate) {
				var include = b.some(function (comparison) {
					return candidate === comparison;
				});

				if (include) {
					returnRef.push(candidate);
				}
			});

			return returnRef;
		}
	};
}();

},{"./assert":24,"./is":29}],24:[function(require,module,exports){
'use strict';

var is = require('./is');

module.exports = function () {
	'use strict';

	function checkArgumentType(variable, variableName, type, typeDescription, index) {
		if (type === String) {
			if (!is.string(variable)) {
				throwInvalidTypeError(variableName, 'string', index);
			}
		} else if (type === Number) {
			if (!is.number(variable)) {
				throwInvalidTypeError(variableName, 'number', index);
			}
		} else if (type === Function) {
			if (!is.fn(variable)) {
				throwInvalidTypeError(variableName, 'function', index);
			}
		} else if (type === Boolean) {
			if (!is.boolean(variable)) {
				throwInvalidTypeError(variableName, 'boolean', index);
			}
		} else if (type === Date) {
			if (!is.date(variable)) {
				throwInvalidTypeError(variableName, 'date', index);
			}
		} else if (type === Array) {
			if (!is.array(variable)) {
				throwInvalidTypeError(variableName, 'array', index);
			}
		} else if (!(variable instanceof (type || Object))) {
			throwInvalidTypeError(variableName, typeDescription, index);
		}
	}

	function throwInvalidTypeError(variableName, typeDescription, index) {
		var message = void 0;

		if (typeof index === 'number') {
			message = 'The argument [ ' + (variableName || 'unspecified') + ' ], at index [ ' + index.toString() + ' ] must be a [ ' + (typeDescription || 'unknown') + ' ]';
		} else {
			message = 'The argument [ ' + (variableName || 'unspecified') + ' ] must be a [ ' + (typeDescription || 'Object') + ' ]';
		}

		throw new Error(message);
	}

	function throwCustomValidationError(variableName, predicateDescription) {
		throw new Error('The argument [ ' + (variableName || 'unspecified') + ' ] failed a validation check [ ' + (predicateDescription || 'No description available') + ' ]');
	}

	/**
  * Utilities checking arguments.
  *
  * @public
  * @module lang/assert
  */
	return {
		/**
   * Throws an error if an argument doesn't conform to the desired specification (as
   * determined by a type check).
   *
   * @static
   * @param {*} variable - The value to check.
   * @param {String} variableName - The name of the value (used for formatting an error message).
   * @param {*} type - The expected type of the argument.
   * @param {String=} typeDescription - The description of the expected type (used for formatting an error message).
   */
		argumentIsRequired: function argumentIsRequired(variable, variableName, type, typeDescription) {
			checkArgumentType(variable, variableName, type, typeDescription);
		},

		/**
   * A relaxed version of the "argumentIsRequired" function that will not throw if
   * the value is undefined or null.
   *
   * @static
   * @param {*} variable - The value to check.
   * @param {String} variableName - The name of the value (used for formatting an error message).
   * @param {*} type - The expected type of the argument.
   * @param {String=} typeDescription - The description of the expected type (used for formatting an error message).
   */
		argumentIsOptional: function argumentIsOptional(variable, variableName, type, typeDescription, predicate, predicateDescription) {
			if (variable === null || variable === undefined) {
				return;
			}

			checkArgumentType(variable, variableName, type, typeDescription);

			if (is.fn(predicate) && !predicate(variable)) {
				throwCustomValidationError(variableName, predicateDescription);
			}
		},
		argumentIsArray: function argumentIsArray(variable, variableName, itemConstraint, itemConstraintDescription) {
			this.argumentIsRequired(variable, variableName, Array);

			if (itemConstraint) {
				var itemValidator = void 0;

				if (typeof itemConstraint === 'function' && itemConstraint !== Function) {
					itemValidator = function itemValidator(value, index) {
						return value instanceof itemConstraint || itemConstraint(value, variableName + '[' + index + ']');
					};
				} else {
					itemValidator = function itemValidator(value, index) {
						return checkArgumentType(value, variableName, itemConstraint, itemConstraintDescription, index);
					};
				}

				variable.forEach(function (v, i) {
					itemValidator(v, i);
				});
			}
		},

		/**
   * Throws an error if an argument doesn't conform to the desired specification
   * (as determined by a predicate).
   *
   * @static
   * @param {*} variable - The value to check.
   * @param {String} variableName - The name of the value (used for formatting an error message).
   * @param {Function=} predicate - A function used to validate the item (beyond type checking).
   * @param {Function=} predicateDescription - A description of the assertion made by the predicate (e.g. "is an integer") that is used for formatting an error message.
   */
		argumentIsValid: function argumentIsValid(variable, variableName, predicate, predicateDescription) {
			if (!predicate(variable)) {
				throwCustomValidationError(variableName, predicateDescription);
			}
		},
		areEqual: function areEqual(a, b, descriptionA, descriptionB) {
			if (a !== b) {
				throw new Error('The objects must be equal [' + (descriptionA || a.toString()) + '] and [' + (descriptionB || b.toString()) + ']');
			}
		},
		areNotEqual: function areNotEqual(a, b, descriptionA, descriptionB) {
			if (a === b) {
				throw new Error('The objects cannot be equal [' + (descriptionA || a.toString()) + '] and [' + (descriptionB || b.toString()) + ']');
			}
		}
	};
}();

},{"./is":29}],25:[function(require,module,exports){
'use strict';

var assert = require('./assert'),
    is = require('./is');

module.exports = function () {
	'use strict';

	function getPropertyNameArray(propertyNames) {
		var separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '.';

		var returnRef = void 0;

		if (is.array(propertyNames)) {
			returnRef = propertyNames;
		} else {
			returnRef = propertyNames.split(separator);
		}

		return returnRef;
	}

	function getPropertyTarget(target, propertyNameArray, create) {
		var returnRef = void 0;

		var propertyTarget = target;

		for (var i = 0; i < propertyNameArray.length - 1; i++) {
			var propertyName = propertyNameArray[i];

			if (propertyTarget.hasOwnProperty(propertyName) && !is.null(propertyTarget[propertyName]) && !is.undefined(propertyTarget[propertyName])) {
				propertyTarget = propertyTarget[propertyName];
			} else if (create) {
				propertyTarget = propertyTarget[propertyName] = {};
			} else {
				propertyTarget = null;

				break;
			}
		}

		return propertyTarget;
	}

	function last(array) {
		if (array.length !== 0) {
			return array[array.length - 1];
		} else {
			return null;
		}
	}

	/**
  * Utilities for reading and writing "complex" properties to
  * objects. For example, the property "name.first" reads the
  * "first" property on the "name" object of the target.
  *
  * @public
  * @module lang/attributes
  */
	return {
		/**
   * Checks to see if an attribute exists on the target object.
   *
   * @static
   * @param {Object} target - The object to check for existence of the property.
   * @param {String|Array<String>} propertyNames - The property to check -- either a string with separators, or an array of strings (already split by separator).
   * @param {String=} separator - The separator (defaults to a period character).
   * @returns {boolean}
   */
		has: function has(target, propertyNames, separator) {
			assert.argumentIsRequired(target, 'target', Object);

			if (is.array(propertyNames)) {
				assert.argumentIsArray(propertyNames, 'propertyNames', String);
			} else {
				assert.argumentIsRequired(propertyNames, 'propertyNames', String);
			}

			var propertyNameArray = getPropertyNameArray(propertyNames, separator);
			var propertyTarget = getPropertyTarget(target, propertyNameArray, false);

			return propertyTarget !== null && propertyTarget.hasOwnProperty(last(propertyNameArray));
		},

		/**
   * Returns a value from the target object. If the property doesn't exist; undefined
   * is returned.
   *
   * @static
   * @param {Object} target - The object to read from.
   * @param {String|Array<String>} propertyNames - The property to read -- either a string with separators, or an array of strings (already split by separator).
   * @param {String=} separator - The separator (defaults to a period character).
   * @returns {*}
   */
		read: function read(target, propertyNames, separator) {
			assert.argumentIsRequired(target, 'target', Object);

			if (is.array(propertyNames)) {
				assert.argumentIsArray(propertyNames, 'propertyNames', String);
			} else {
				assert.argumentIsRequired(propertyNames, 'propertyNames', String);
			}

			var propertyNameArray = getPropertyNameArray(propertyNames, separator);
			var propertyTarget = getPropertyTarget(target, propertyNameArray, false);

			var returnRef = void 0;

			if (propertyTarget) {
				var propertyName = last(propertyNameArray);

				returnRef = propertyTarget[propertyName];
			} else {
				returnRef = undefined;
			}

			return returnRef;
		},

		/**
   * Writes a value to the target object.
   *
   * @static
   * @param {Object} target - The object to write to.
   * @param {String|Array<String>} propertyNames - The property to write -- either a string with separators, or an array of strings (already split by separator).
   * @param {String=} separator - The separator (defaults to a period character).
   */
		write: function write(target, propertyNames, value, separator) {
			assert.argumentIsRequired(target, 'target', Object);

			if (is.array(propertyNames)) {
				assert.argumentIsArray(propertyNames, 'propertyNames', String);
			} else {
				assert.argumentIsRequired(propertyNames, 'propertyNames', String);
			}

			var propertyNameArray = getPropertyNameArray(propertyNames, separator);
			var propertyTarget = getPropertyTarget(target, propertyNameArray, true);

			var propertyName = last(propertyNameArray);

			propertyTarget[propertyName] = value;
		},

		/**
   * Erases a property from the target object.
   *
   * @static
   * @param {Object} target - The object to erase a property from.
   * @param {String|Array<String>} propertyNames - The property to write -- either a string with separators, or an array of strings (already split by separator).
   * @param {String=} separator - The separator (defaults to a period character).
   */
		erase: function erase(target, propertyNames, separator) {
			if (!this.has(target, propertyNames)) {
				return;
			}

			var propertyNameArray = getPropertyNameArray(propertyNames, separator);
			var propertyTarget = getPropertyTarget(target, propertyNameArray, true);

			var propertyName = last(propertyNameArray);

			delete propertyTarget[propertyName];
		}
	};
}();

},{"./assert":24,"./is":29}],26:[function(require,module,exports){
'use strict';

var is = require('./is');

module.exports = function () {
  'use strict';

  /**
   * Utilities checking HTTP connections.
   *
   * @public
   * @module lang/connection
   * @deprecated
   */

  return {
    /**
     * Returns true, if the input is a true boolean value; otherwise false.
     *
     * @param {Boolean=} secure
     * @returns {Boolean}
     */
    getIsSecure: function getIsSecure(secure) {
      return is.boolean(secure) && secure;
    }
  };
}();

},{"./is":29}],27:[function(require,module,exports){
'use strict';

module.exports = function () {
	'use strict';

	var utilities = {
		getShortDay: function getShortDay(date) {
			var day = date.getDay();

			return days[day].short;
		},
		getDate: function getDate(date) {
			return date.getDate();
		},
		getDateOrdinal: function getDateOrdinal(date) {
			var d = utilities.getDate(date);
			var remainder = d % 10;

			var returnRef = void 0;

			if (remainder === 1 && d !== 11) {
				returnRef = 'st';
			} else if (remainder === 2 && d !== 12) {
				returnRef = 'nd';
			} else if (remainder === 3) {
				returnRef = 'rd';
			} else {
				returnRef = 'th';
			}

			return returnRef;
		},
		getShortMonth: function getShortMonth(date) {
			var month = date.getMonth();

			return months[month].short;
		},
		getYear: function getYear(date) {
			return date.getFullYear();
		}
	};

	var days = [{ short: 'Sun' }, { short: 'Mon' }, { short: 'Tue' }, { short: 'Wed' }, { short: 'Thu' }, { short: 'Fri' }, { short: 'Sat' }];

	var months = [{ short: 'Jan' }, { short: 'Feb' }, { short: 'Mar' }, { short: 'Apr' }, { short: 'May' }, { short: 'Jun' }, { short: 'Jul' }, { short: 'Aug' }, { short: 'Sep' }, { short: 'Oct' }, { short: 'Nov' }, { short: 'Dec' }];

	return utilities;
}();

},{}],28:[function(require,module,exports){
'use strict';

module.exports = function () {
	'use strict';

	function tautology(x) {
		return x;
	}

	function empty() {
		return;
	}

	/**
  * Utilities for working with functions.
  *
  * @public
  * @module lang/functions
  */
	return {
		/**
   * A function that returns the first argument passed.
   *
   * @static
   * @returns {Function}
   */
		getTautology: function getTautology() {
			return tautology;
		},

		/**
   * A function with no return value.
   *
   * @static
   * @returns {Function}
   */
		getEmpty: function getEmpty() {
			return empty;
		}
	};
}();

},{}],29:[function(require,module,exports){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

module.exports = function () {
  'use strict';

  /**
   * Utilities for interrogating variables (e.g. checking data types).
   *
   * @public
   * @module lang/is
   */

  return {
    /**
     * Returns true, if the argument is a number. NaN will return false.
     *
     * @static
     * @public
     * @param candidate {*}
     * @returns {boolean}
     */
    number: function number(candidate) {
      return typeof candidate === 'number' && !isNaN(candidate);
    },

    /**
     * Returns true, if the argument is NaN.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    nan: function nan(candidate) {
      return typeof candidate === 'number' && isNaN(candidate);
    },

    /**
     * Returns true, if the argument is a valid 32-bit integer.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    integer: function integer(candidate) {
      return typeof candidate === 'number' && !isNaN(candidate) && (candidate | 0) === candidate;
    },

    /**
     * Returns true, if the argument is a valid integer (which can exceed 32 bits); however,
     * the check can fail above the value of Number.MAX_SAFE_INTEGER.
     *
     * @static
     * @public
     * @param {*) candidate
     * @returns {boolean}
     */
    large: function large(candidate) {
      return typeof candidate === 'number' && !isNaN(candidate) && isFinite(candidate) && Math.floor(candidate) === candidate;
    },

    /**
     * Returns true, if the argument is a number that is positive.
     *
     * @static
     * @public
     * @param candidate
     * @returns {boolean}
     */
    positive: function positive(candidate) {
      return this.number(candidate) && candidate > 0;
    },

    /**
     * Returns true, if the argument is a number that is negative.
     *
     * @static
     * @public
     * @param candidate
     * @returns {*|boolean}
     */
    negative: function negative(candidate) {
      return this.number(candidate) && candidate < 0;
    },

    /**
     * Returns true, if the argument is a string.
     *
     * @static
     * @public
     * @param candidate
     * @returns {boolean}
     */
    string: function string(candidate) {
      return typeof candidate === 'string';
    },

    /**
     * Returns true, if the argument is a JavaScript Date instance.
     *
     * @static
     * @public
     * @param candidate
     * @returns {boolean}
     */
    date: function date(candidate) {
      return candidate instanceof Date;
    },

    /**
     * Returns true, if the argument is a function.
     *
     * @static
     * @public
     * @param candidate
     * @returns {boolean}
     */
    fn: function fn(candidate) {
      return typeof candidate === 'function';
    },

    /**
     * Returns true, if the argument is an array.
     *
     * @static
     * @public
     * @param candidate
     * @returns {boolean}
     */
    array: function array(candidate) {
      return Array.isArray(candidate);
    },

    /**
     * Returns true, if the argument is a Boolean value.
     *
     * @static
     * @public
     * @param candidate
     * @returns {boolean}
     */
    boolean: function boolean(candidate) {
      return typeof candidate === 'boolean';
    },

    /**
     * Returns true, if the argument is an object.
     *
     * @static
     * @public
     * @param candidate
     * @returns {boolean}
     */
    object: function object(candidate) {
      return (typeof candidate === 'undefined' ? 'undefined' : _typeof(candidate)) === 'object' && candidate !== null;
    },

    /**
     * Returns true, if the argument is a null value.
     *
     * @static
     * @public
     * @param candidate
     * @returns {boolean}
     */
    null: function _null(candidate) {
      return candidate === null;
    },

    /**
     * Returns true, if the argument is an undefined value.
     *
     * @static
     * @public
     * @param candidate
     * @returns {boolean}
     */
    undefined: function (_undefined) {
      function undefined(_x) {
        return _undefined.apply(this, arguments);
      }

      undefined.toString = function () {
        return _undefined.toString();
      };

      return undefined;
    }(function (candidate) {
      return candidate === undefined;
    }),

    /**
     * Given two classes, determines if the "child" class extends
     * the "parent" class (without instantiation).
     *
     * @param {Function} parent
     * @param {Function} child
     * @returns {Boolean}
     */
    extension: function extension(parent, child) {
      return this.fn(parent) && this.fn(child) && child.prototype instanceof parent;
    }
  };
}();

},{}],30:[function(require,module,exports){
'use strict';

var assert = require('./assert'),
    is = require('./is');

module.exports = function () {
	'use strict';

	var mask = {
		getEmpty: function getEmpty() {
			return 0;
		},
		add: function add(existing, itemToAdd) {
			assert.argumentIsRequired(existing, 'existing', Number);
			assert.argumentIsRequired(itemToAdd, 'itemToAdd', Number);

			if (mask.checkItem(itemToAdd)) {
				return existing | itemToAdd;
			} else {
				return existing;
			}
		},
		remove: function remove(existing, itemToRemove) {
			assert.argumentIsRequired(existing, 'existing', Number);
			assert.argumentIsRequired(itemToRemove, 'itemToRemove', Number);

			if (mask.checkItem(itemToRemove)) {
				return existing & ~itemToRemove;
			} else {
				return existing;
			}
		},
		has: function has(existing, itemToCheck) {
			assert.argumentIsRequired(existing, 'existing', Number);
			assert.argumentIsRequired(itemToCheck, 'itemToCheck', Number);

			return mask.checkItem(itemToCheck) && (existing & itemToCheck) === itemToCheck;
		},
		checkItem: function checkItem(itemToCheck) {
			return is.number(itemToCheck) && (itemToCheck === 0 || (itemToCheck & ~itemToCheck + 1) === itemToCheck);
		}
	};

	return mask;
}();

},{"./assert":24,"./is":29}],31:[function(require,module,exports){
'use strict';

var is = require('./is');

module.exports = function () {
	'use strict';

	return {
		approximate: function approximate(a, b) {
			if (!is.number(a) || !is.number(b)) {
				return false;
			}

			if (a == b) {
				return true;
			}

			if (isFinite(a) && isFinite(b)) {
				var absoluteDifference = Math.abs(a - b);

				if (absoluteDifference < Number.EPSILON) {
					return true;
				} else {
					return !(absoluteDifference > Math.max(Math.abs(a), Math.abs(b)) * Number.EPSILON);
				}
			} else {
				return false;
			}
		}
	};
}();

},{"./is":29}],32:[function(require,module,exports){
'use strict';

var is = require('./is');

module.exports = function () {
	'use strict';

	/**
  * Utilities for caching results of function invocations (a.k.a. memoization).
  *
  * @public
  * @module lang/memoize
  */

	return {
		/**
   * Memoizes a function that accepts a single argument only. Furthermore,
   * the parameter's toString function must return a unique value.
   *
   * @static
   * @public
   * @param {Function} fn - The function to memoize. This function should accept one parameters whose "toString" function outputs a unique value.
   */
		simple: function simple(fn) {
			var cache = {};

			return function (x) {
				if (cache.hasOwnProperty(x)) {
					return cache[x];
				} else {
					return cache[x] = fn(x);
				}
			};
		}
	};
}();

},{"./is":29}],33:[function(require,module,exports){
'use strict';

var array = require('./array'),
    is = require('./is');

module.exports = function () {
	'use strict';

	/**
  * Utilities for working with objects.
  *
  * @public
  * @module lang/object
  */

	var object = {
		/**
   * <p>Performs "deep" equality check on two objects.</p>
   *
   * <p>Array items are compared, object properties are compared, and
   * finally "primitive" values are checked using strict equality rules.</p>
   *
   * @static
   * @param {Object} a
   * @param {Object} b
   * @returns {Boolean}
   */
		equals: function equals(a, b) {
			var returnVal = void 0;

			if (a === b) {
				returnVal = true;
			} else if (is.array(a) && is.array(b)) {
				if (a.length === b.length) {
					returnVal = a.length === 0 || a.every(function (x, i) {
						return object.equals(x, b[i]);
					});
				} else {
					returnVal = false;
				}
			} else if (is.object(a) && is.object(b)) {
				var keysA = object.keys(a);
				var keysB = object.keys(b);

				returnVal = array.differenceSymmetric(keysA, keysB).length === 0 && keysA.every(function (key) {
					var valueA = a[key];
					var valueB = b[key];

					return object.equals(valueA, valueB);
				});
			} else {
				returnVal = false;
			}

			return returnVal;
		},

		/**
   * Performs a "deep" copy.
   *
   * @static
   * @param {Object} source - The object to copy.
   * @returns {Object}
   */
		clone: function clone(source) {
			var c = void 0;

			if (is.array(source)) {
				c = source.map(function (sourceItem) {
					return object.clone(sourceItem);
				});
			} else if (is.object(source)) {
				c = object.keys(source).reduce(function (accumulator, key) {
					accumulator[key] = object.clone(source[key]);

					return accumulator;
				}, {});
			} else {
				c = source;
			}

			return c;
		},

		/**
   * Creates a new object (or array) by performing a deep copy
   * of the properties from each object. If the same property
   * exists on both objects, the property value from the
   * second object ("b") is preferred.
   *
   * @static
   * @param {Object} a
   * @param {Object} b
   * @returns {Object}
   */
		merge: function merge(a, b) {
			var m = void 0;

			var mergeTarget = is.object(a) && !is.array(a);
			var mergeSource = is.object(b) && !is.array(b);

			if (mergeTarget && mergeSource) {
				var properties = array.unique(object.keys(a).concat(object.keys(b)));

				m = properties.reduce(function (accumulator, property) {
					accumulator[property] = object.merge(a[property], b[property]);

					return accumulator;
				}, {});
			} else if (is.undefined(b)) {
				m = object.clone(a);
			} else {
				m = object.clone(b);
			}

			return m;
		},

		/**
   * Given an object, returns an array of "own" properties.
   *
   * @static
   * @param {Object} target - The object to interrogate.
   * @returns {Array<string>}
   */
		keys: function keys(target) {
			var keys = [];

			for (var k in target) {
				if (target.hasOwnProperty(k)) {
					keys.push(k);
				}
			}

			return keys;
		}
	};

	return object;
}();

},{"./array":23,"./is":29}],34:[function(require,module,exports){
'use strict';

var assert = require('./assert');

module.exports = function () {
	'use strict';

	/**
  * Utilities for working with promises.
  *
  * @public
  * @module lang/promise
  */

	return {
		timeout: function timeout(promise, _timeout) {
			var _this = this;

			return Promise.resolve().then(function () {
				assert.argumentIsRequired(promise, 'promise', Promise, 'Promise');
				assert.argumentIsRequired(_timeout, 'timeout', Number);

				if (!(_timeout > 0)) {
					throw new Error('Promise timeout must be greater than zero.');
				}

				return _this.build(function (resolveCallback, rejectCallback) {
					var pending = true;

					var token = setTimeout(function () {
						if (pending) {
							pending = false;

							rejectCallback('Promise timed out after ' + _timeout + ' milliseconds');
						}
					}, _timeout);

					promise.then(function (result) {
						if (pending) {
							pending = false;
							clearTimeout(token);

							resolveCallback(result);
						}
					}).catch(function (error) {
						if (pending) {
							pending = false;
							clearTimeout(token);

							rejectCallback(error);
						}
					});
				});
			});
		},

		/**
   * A mapping function that works asynchronously. Given an array of items, each item through
   * a mapping function, which can return a promise. Then, this function returns a single promise
   * which is the result of each mapped promise.
   *
   * @param {Array} items - The items to map
   * @param {Function} mapper - The mapping function (e.g. given an item, return a promise).
   * @param {Number} concurrency - The maximum number of promises that are allowed to run at once.
   * @returns {Promise.<Array>}
   */
		map: function map(items, mapper, concurrency) {
			var _this2 = this;

			return Promise.resolve().then(function () {
				assert.argumentIsArray(items, 'items');
				assert.argumentIsRequired(mapper, 'mapper', Function);
				assert.argumentIsOptional(concurrency, 'concurrency', Number);

				var c = Math.max(0, concurrency || 0);

				var mapPromise = void 0;

				if (c === 0 || items.length === 0) {
					mapPromise = Promise.all(items.map(function (item) {
						return Promise.resolve(mapper(item));
					}));
				} else {
					var total = items.length;
					var active = 0;
					var complete = 0;
					var failure = false;

					var results = Array.of(total);

					var executors = items.map(function (item, index) {
						return function () {
							return Promise.resolve().then(function () {
								return mapper(item);
							}).then(function (result) {
								results[index] = result;
							});
						};
					});

					mapPromise = _this2.build(function (resolveCallback, rejectCallback) {
						var execute = function execute() {
							if (!(executors.length > 0 && c > active && !failure)) {
								return;
							}

							active = active + 1;

							var executor = executors.shift();

							executor().then(function () {
								if (failure) {
									return;
								}

								active = active - 1;
								complete = complete + 1;

								if (complete < total) {
									execute();
								} else {
									resolveCallback(results);
								}
							}).catch(function (error) {
								failure = false;

								rejectCallback(error);
							});

							execute();
						};

						execute();
					});
				}

				return mapPromise;
			});
		},

		/**
   * Runs a series of functions sequentially (where each function can be
   * synchronous or asynchronous). The result of each function is passed
   * to the successive function and the result of the final function is
   * returned to the consumer.
   *
   * @static
   * @public
   * @param {Function[]} functions - An array of functions, each expecting a single argument.
   * @param input - The argument to pass the first function.
   * @returns {Promise.<TResult>}
   */
		pipeline: function pipeline(functions, input) {
			return Promise.resolve().then(function () {
				assert.argumentIsArray(functions, 'functions', Function);

				return functions.reduce(function (previous, fn) {
					return previous.then(function (result) {
						return fn(result);
					});
				}, Promise.resolve(input));
			});
		},

		/**
   * Creates a new promise, given an executor.
   *
   * This is a wrapper for the {@link Promise} constructor; however, any error
   * is caught and the resulting promise is rejected (instead of letting the
   * error bubble up to the top-level handler).
   *
   * @static
   * @public
   * @param {Function} executor - A function which has two callback parameters. The first is used to resolve the promise, the second rejects it.
   * @returns {Promise}
   */
		build: function build(executor) {
			return new Promise(function (resolve, reject) {
				try {
					executor(resolve, reject);
				} catch (e) {
					reject(e);
				}
			});
		}
	};
}();

},{"./assert":24}],35:[function(require,module,exports){
'use strict';

var assert = require('./assert'),
    is = require('./is');

module.exports = function () {
	'use strict';

	return {
		range: function range(minimum, maximum) {
			assert.argumentIsRequired(minimum, 'minimum', Number);
			assert.argumentIsRequired(maximum, 'maximum', Number);

			var mn = Math.trunc(minimum);
			var mx = Math.trunc(maximum);

			return Math.min(mn, mx) + Math.floor(Math.random() * Math.abs(mx - mn));
		}
	};
}();

},{"./assert":24,"./is":29}],36:[function(require,module,exports){
'use strict';

var assert = require('./assert'),
    is = require('./is');

module.exports = function () {
	'use strict';

	/**
  * Utility functions for strings.
  *
  * @public
  * @module lang/string
  */

	return {
		startCase: function startCase(s) {
			return s.split(' ').reduce(function (phrase, word) {
				if (word.length !== 0) {
					phrase.push(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
				}

				return phrase;
			}, []).join(' ');
		},

		/**
   * If a string exceeds a desired length, it is truncated and a poor man's
   * ellipsis (i.e. three periods) is appended. Otherwise, the original
   * string is returned.
   *
   * @public
   * @static
   * @param {String} s
   * @param {Number} length
   * @returns {String}
   */
		truncate: function truncate(s, length) {
			if (is.string(s) && s.length > length) {
				return s.substring(0, length) + ' ...';
			} else {
				return s;
			}
		},

		/**
   * Adds leading characters to a string, until the string length is a desired size.
   *
   * @public
   * @static
   * @param {String} s - The string to pad.
   * @param {Number} length - The desired overall length of the string.
   * @param {String} character - The character to use for padding.
   * @returns {String}
   */
		padLeft: function padLeft(s, length, character) {
			assert.argumentIsRequired(s, 's', String);
			assert.argumentIsRequired(length, 'length', Number);
			assert.argumentIsRequired(character, 'character', String);

			if (character.length !== 1) {
				throw new Error('The "character" argument must be one character in length.');
			}

			return character.repeat(length - s.length) + s;
		},

		/**
   * Performs a simple token replacement on a string; where the tokens
   * are braced numbers (e.g. {0}, {1}, {2}).
   *
   * @public
   * @static
   * @param {String} s - The string to format (e.g. 'my first name is {0} and my last name is {1}')
   * @param {Array<String>} data - The replacement data
   * @returns {String}
   */
		format: function format(s) {
			for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				data[_key - 1] = arguments[_key];
			}

			assert.argumentIsRequired(s, 's', String);

			return s.replace(/{(\d+)}/g, function (match, i) {
				var replacement = void 0;

				if (i < data.length) {
					var item = data[i];

					if (!is.undefined(item) && !is.null(item)) {
						replacement = item.toString();
					} else {
						replacement = match;
					}
				} else {
					replacement = match;
				}

				return replacement;
			});
		}
	};
}();

},{"./assert":24,"./is":29}],37:[function(require,module,exports){
'use strict';

var moment = require('moment-timezone/builds/moment-timezone-with-data-2010-2020'),
    assert = require('./assert');

module.exports = function () {
  'use strict';

  /**
   * Utilities for working with arrays.
   *
   * @public
   * @module lang/array
   */

  return {
    /**
     * Gets a list of names in the tz database (see https://en.wikipedia.org/wiki/Tz_database
     * and https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
     *
     * @static
     * @returns {Array<String>}
     */
    getTimezones: function getTimezones() {
      return moment.tz.names();
    },

    /**
     * Indicates if a timezone name exists.
     *
     * @static
     * @param {String} name - The timezone name to find.
     * @returns {Boolean}
     */
    hasTimezone: function hasTimezone(name) {
      assert.argumentIsRequired(name, 'name', String);

      return this.getTimezones().some(function (candidate) {
        return candidate === name;
      });
    },

    /**
     * Attempts to guess the current timezone.
     *
     * @returns {String|null}
     */
    guessTimezone: function guessTimezone() {
      return moment.tz.guess() || null;
    }
  };
}();

},{"./assert":24,"moment-timezone/builds/moment-timezone-with-data-2010-2020":45}],38:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var assert = require('./../lang/assert'),
    Disposable = require('./../lang/Disposable');

module.exports = function () {
	'use strict';

	/**
  * An implementation of the observer pattern.
  *
  * @param {*} sender - The object which owns the event.
  * @extends {Disposable}
  */

	var Event = function (_Disposable) {
		_inherits(Event, _Disposable);

		function Event(sender) {
			_classCallCheck(this, Event);

			var _this = _possibleConstructorReturn(this, (Event.__proto__ || Object.getPrototypeOf(Event)).call(this));

			_this._sender = sender || null;

			_this._observers = [];
			return _this;
		}

		/**
   * Registers an event handler which will receive a notification when
   * {@link Event#fire} is called.
   *
   * @public
   * @param {Function} handler - The function which will be called each time the event fires. The first argument will be the event data. The second argument will be the event owner (i.e. sender).
   * @returns {Disposable}
   */

		_createClass(Event, [{
			key: 'register',
			value: function register(handler) {
				var _this2 = this;

				assert.argumentIsRequired(handler, 'handler', Function);

				addRegistration.call(this, handler);

				return Disposable.fromAction(function () {
					if (_this2.getIsDisposed()) {
						return;
					}

					removeRegistration.call(_this2, handler);
				});
			}

			/**
    * Removes registration for an event handler. That is, the handler will
    * no longer be called if the event fires.
    *
    * @public
    * @param {Function} handler
    */

		}, {
			key: 'unregister',
			value: function unregister(handler) {
				assert.argumentIsRequired(handler, 'handler', Function);

				removeRegistration.call(this, handler);
			}

			/**
    * Removes all handlers from the event.
    *
    * @public
    */

		}, {
			key: 'clear',
			value: function clear() {
				this._observers = [];
			}

			/**
    * Triggers the event, calling all previously registered handlers.
    *
    * @public
    * @param {*) data - The data to pass each handler.
    */

		}, {
			key: 'fire',
			value: function fire(data) {
				var observers = this._observers;

				for (var i = 0; i < observers.length; i++) {
					var observer = observers[i];

					observer(data, this._sender);
				}
			}

			/**
    * Returns true, if no handlers are currently registered.
    *
    * @returns {boolean}
    */

		}, {
			key: 'getIsEmpty',
			value: function getIsEmpty() {
				return this._observers.length === 0;
			}
		}, {
			key: '_onDispose',
			value: function _onDispose() {
				this._observers = null;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[Event]';
			}
		}]);

		return Event;
	}(Disposable);

	function addRegistration(handler) {
		var copiedObservers = this._observers.slice();

		copiedObservers.push(handler);

		this._observers = copiedObservers;
	}

	function removeRegistration(handler) {
		var indicesToRemove = [];

		for (var i = 0; i < this._observers.length; i++) {
			var candidate = this._observers[i];

			if (candidate === handler) {
				indicesToRemove.push(i);
			}
		}

		if (indicesToRemove.length > 0) {
			var copiedObservers = this._observers.slice();

			for (var j = indicesToRemove.length - 1; !(j < 0); j--) {
				copiedObservers.splice(indicesToRemove[j], 1);
			}

			this._observers = copiedObservers;
		}
	}

	return Event;
}();

},{"./../lang/Disposable":18,"./../lang/assert":24}],39:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var assert = require('./../lang/assert'),
    Disposable = require('./../lang/Disposable'),
    Event = require('./Event');

module.exports = function () {
	'use strict';

	/**
  * A container for {@link Event} instances where each event is
  * keyed by name.
  *
  * @public
  * @extends {Disposable}
  */

	var EventMap = function (_Disposable) {
		_inherits(EventMap, _Disposable);

		function EventMap() {
			_classCallCheck(this, EventMap);

			var _this = _possibleConstructorReturn(this, (EventMap.__proto__ || Object.getPrototypeOf(EventMap)).call(this));

			_this._events = {};
			return _this;
		}

		/**
   * Fires the appropriate event which is mapped to the event name.
   * See {@link Event#fire} for more information.
   *
   * @public
   * @param {String} eventName - The event's name.
   * @param {*} data - The data to provide to observers.
   */

		_createClass(EventMap, [{
			key: 'fire',
			value: function fire(eventName, data) {
				var event = this._events[eventName];

				if (event) {
					event.fire(data);
				}
			}

			/**
    * Registers a handler. See {@link Event#register} for more information.
    *
    * @public
    * @param {String} eventName - The event's name.
    * @param {Function} handler
    */

		}, {
			key: 'register',
			value: function register(eventName, handler) {
				assert.argumentIsRequired(eventName, 'eventName', String);

				if (this.getIsDisposed()) {
					throw new Error('The event has been disposed.');
				}

				var event = this._events[eventName];

				if (!event) {
					event = this._events[eventName] = new Event(this);
				}

				return event.register(handler);
			}

			/**
    * Removes a handler. See {@link Event#unregister} for more information.
    *
    * @public
    * @param {String} eventName - The event's name.
    * @param {Function} handler
    */

		}, {
			key: 'unregister',
			value: function unregister(eventName, handler) {
				assert.argumentIsRequired(eventName, 'eventName', String);

				var event = this._events[eventName];

				if (event) {
					event.unregister(handler);

					if (event.getIsEmpty()) {
						delete this._events[eventName];
					}
				}
			}

			/**
    * Clears an event's handlers. See {@link Event#clear} for more information.
    *
    * @public
    * @param {String} eventName - The event's name.
    */

		}, {
			key: 'clear',
			value: function clear(eventName) {
				assert.argumentIsRequired(eventName, 'eventName', String);

				var event = this._events[eventName];

				if (event) {
					event.clear();

					delete this._events[eventName];
				}
			}

			/**
    * Returns true, if no handlers are currently registered for the
    * specified event. See {@link Event#getIsEmpty} for more information.
    *
    * @returns {boolean}
    */

		}, {
			key: 'getIsEmpty',
			value: function getIsEmpty(eventName) {
				var event = this._events[eventName];

				var returnVal = void 0;

				if (event) {
					returnVal = event.getIsEmpty();
				} else {
					returnVal = true;
				}

				return returnVal;
			}

			/**
    * Returns an array of all the event names.
    *
    * @returns {Array<String>}
    */

		}, {
			key: 'getKeys',
			value: function getKeys() {
				var keys = [];

				for (var key in this._events) {
					if (this._events.hasOwnProperty(key)) {
						keys.push(key);
					}
				}

				return keys;
			}

			/**
    * Returns true, if an event with the given name exists.
    *
    * @param {String} key
    * @returns {boolean}
    */

		}, {
			key: 'hasKey',
			value: function hasKey(key) {
				return this._events.hasOwnProperty(key);
			}
		}, {
			key: '_onDispose',
			value: function _onDispose() {
				var keys = this.getKeys();

				for (var i = 0; i < keys.length; i++) {
					var key = keys[i];

					this._events[key].dispose();
				}

				this._events = {};
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[EventMap]';
			}
		}]);

		return EventMap;
	}(Disposable);

	return EventMap;
}();

},{"./../lang/Disposable":18,"./../lang/assert":24,"./Event":38}],40:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var assert = require('./../lang/assert'),
    is = require('./../lang/is'),
    Disposable = require('./../lang/Disposable'),
    Event = require('./../messaging/Event');

module.exports = function () {
	'use strict';

	var Model = function (_Disposable) {
		_inherits(Model, _Disposable);

		function Model(propertyNames, propertyObservers, equalityPredicates) {
			_classCallCheck(this, Model);

			var _this = _possibleConstructorReturn(this, (Model.__proto__ || Object.getPrototypeOf(Model)).call(this));

			_this._propertyNames = propertyNames;

			_this._transactionCommit = new Event(_this);

			_this._transactionOpen = false;
			_this._transactionData = null;

			_this._trackerOpen = false;
			_this._trackerData = null;

			_this._sequence = 0;

			var observers = propertyObservers || {};
			var predicates = equalityPredicates || {};

			for (var i = 0; i < _this._propertyNames.length; i++) {
				var propertyName = propertyNames[i];

				createProperty.call(_this, propertyName, observers[propertyName] || emptyFunction, predicates[propertyName] || checkEquals);
			}
			return _this;
		}

		_createClass(Model, [{
			key: 'beginTransaction',
			value: function beginTransaction() {
				if (this._transactionOpen) {
					return;
				}

				this._transactionOpen = true;
			}
		}, {
			key: 'endTransaction',
			value: function endTransaction() {
				if (!this._transactionOpen) {
					return;
				}

				if (this.getIsDisposed()) {
					return;
				}

				this._transactionOpen = false;

				if (this._transactionData !== null) {
					this._formatTransactionData(this._transactionData);

					this._transactionData.sequence = this._sequence++;

					if (this._trackerOpen) {
						this._trackerData = this._trackerData || {};

						for (var propertyName in this._transactionData) {
							this._trackerData[propertyName] = this._transactionData[propertyName];
						}
					}

					this._transactionCommit.fire(this._transactionData);

					this._transactionData = null;
				}
			}
		}, {
			key: '_formatTransactionData',
			value: function _formatTransactionData(transactionData) {
				return;
			}
		}, {
			key: 'executeTransaction',
			value: function executeTransaction(processor) {
				assert.argumentIsRequired(processor, 'processor', Function);

				this.beginTransaction();
				processor(this);
				this.endTransaction();
			}
		}, {
			key: 'onTransactionCommitted',
			value: function onTransactionCommitted(observer) {
				if (this.getIsDisposed()) {
					return;
				}

				return this._transactionCommit.register(observer);
			}
		}, {
			key: 'startTracker',
			value: function startTracker() {
				if (this._trackerOpen) {
					return;
				}

				this._trackerOpen = true;
			}
		}, {
			key: 'resetTracker',
			value: function resetTracker() {
				if (!this._trackerOpen) {
					return null;
				}

				if (this.getIsDisposed()) {
					return null;
				}

				var returnRef = this._trackerData;

				this._trackerData = null;

				return returnRef;
			}
		}, {
			key: 'stopTracking',
			value: function stopTracking() {
				if (!this._trackerOpen) {
					return;
				}

				if (this.getIsDisposed()) {
					return;
				}

				this._trackerOpen = false;
				this._trackerData = null;
			}
		}, {
			key: 'getSnapshot',
			value: function getSnapshot() {
				var snapshot = {};

				for (var i = 0; i < this._propertyNames.length; i++) {
					var propertyName = this._propertyNames[i];

					snapshot[propertyName] = this[propertyName];
				}

				snapshot.sequence = this._sequence;

				return snapshot;
			}
		}, {
			key: '_onDispose',
			value: function _onDispose() {
				this._transactionCommit.dispose();
				this._transactionCommit = null;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[Model]';
			}
		}]);

		return Model;
	}(Disposable);

	function emptyFunction() {
		return;
	}

	function checkEquals(a, b) {
		return a === b;
	}

	function createProperty(propertyName, propertyObserver, equalityPredicate) {
		var _this2 = this;

		var propertyValue = null;

		Object.defineProperty(this, propertyName, {
			get: function get() {
				return propertyValue;
			},
			set: function set(value) {
				var valueToAssign = is.undefined(value) ? null : value;

				if (equalityPredicate(propertyValue, valueToAssign)) {
					return;
				}

				propertyValue = valueToAssign;

				var implicit = !_this2._transactionOpen;

				if (implicit) {
					_this2.beginTransaction();
				}

				_this2._transactionData = _this2._transactionData || {};
				_this2._transactionData[propertyName] = propertyValue;

				propertyObserver(_this2);

				if (implicit) {
					_this2.endTransaction();
				}
			}
		});
	}

	return Model;
}();

},{"./../lang/Disposable":18,"./../lang/assert":24,"./../lang/is":29,"./../messaging/Event":38}],41:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var assert = require('./../../lang/assert'),
    Enum = require('./../../lang/Enum');

module.exports = function () {
	'use strict';

	/**
  * Maps an action (e.g. create) to an HTTP verb (e.g. POST).
  *
  * @public
  * @extends {Enum}
  */

	var RestAction = function (_Enum) {
		_inherits(RestAction, _Enum);

		function RestAction(action, httpVerb, requiresPath, requiresPayload, allowQuerystring, allowBody) {
			_classCallCheck(this, RestAction);

			var _this = _possibleConstructorReturn(this, (RestAction.__proto__ || Object.getPrototypeOf(RestAction)).call(this, action, action));

			assert.argumentIsRequired(action, 'action', String);
			assert.argumentIsRequired(httpVerb, 'httpVerb', String);
			assert.argumentIsRequired(requiresPath, 'requiresPath', Boolean);
			assert.argumentIsRequired(requiresPayload, 'requiresPayload', Boolean);
			assert.argumentIsRequired(allowQuerystring, 'allowQuerystring', Boolean);
			assert.argumentIsRequired(allowBody, 'allowBody', Boolean);

			_this._action = action;

			_this._httpVerb = httpVerb;
			_this._requiresPath = requiresPath;
			_this._requiresPayload = requiresPayload;
			_this._allowQuerystring = allowQuerystring;
			_this._allowBody = allowBody;
			return _this;
		}

		/**
   * The HTTP action (e.g. create).
   *
   * @public
   * @returns {string}
   */

		_createClass(RestAction, [{
			key: 'getAction',
			value: function getAction() {
				return this._action;
			}

			/**
    * The HTTP verb.
    *
    * @public
    * @returns {string}
    */

		}, {
			key: 'getHttpVerb',
			value: function getHttpVerb() {
				return this._httpVerb;
			}

			/**
    * Indicates if a path, beyond the base URL, is required.
    * 
    * @public
    * @returns {Boolean}
    */

		}, {
			key: 'getPathIsRequired',
			value: function getPathIsRequired() {
				return this._requiresPath;
			}

			/**
    * Indicates if a payload is required, either for the purpose of formulating a
    * request body or querystring, is required.
    *
    * @public
    * @returns {*}
    */

		}, {
			key: 'getPayloadIsRequired',
			value: function getPayloadIsRequired() {
				return this._requiresPayload;
			}

			/**
    * Indicates if a querystring is allowed with this action.
    *
    * @public
    * @returns {Boolean}
    */

		}, {
			key: 'getAllowQuerystring',
			value: function getAllowQuerystring() {
				return this._allowQuerystring;
			}

			/**
    * Indicates if a request body is allowed with this action.
    *
    * @public
    * @returns {Boolean}
    */

		}, {
			key: 'getAllowBody',
			value: function getAllowBody() {
				return this._allowBody;
			}

			/**
    * The REST-ful action to create an object.
    *
    * @public
    * @returns {RestAction}
    */

		}], [{
			key: 'Create',
			get: function get() {
				return CREATE;
			}

			/**
    * The REST-ful action to update an object.
    *
    * @public
    * @returns {RestAction}
    */

		}, {
			key: 'Update',
			get: function get() {
				return UPDATE;
			}

			/**
    * The REST-ful action to retrieve an object.
    *
    * @public
    * @returns {RestAction}
    */

		}, {
			key: 'Retrieve',
			get: function get() {
				return RETRIEVE;
			}

			/**
    * The REST-ful action to delete an object.
    *
    * @public
    * @returns {RestAction}
    */

		}, {
			key: 'Delete',
			get: function get() {
				return DELETE;
			}

			/**
    * The REST-ful action to retrieve execute a query for object(s).
    *
    * @public
    * @returns {RestAction}
    */

		}, {
			key: 'Query',
			get: function get() {
				return QUERY;
			}
		}]);

		return RestAction;
	}(Enum);

	var CREATE = new RestAction('Create', 'POST', false, true, false, true);
	var UPDATE = new RestAction('Update', 'PUT', true, true, false, true);
	var RETRIEVE = new RestAction('Retrieve', 'GET', true, false, true, false);
	var DELETE = new RestAction('Delete', 'DELETE', true, false, false, false);
	var QUERY = new RestAction('Query', 'GET', false, false, true, false);

	return RestAction;
}();

},{"./../../lang/Enum":19,"./../../lang/assert":24}],42:[function(require,module,exports){
'use strict';

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var assert = require('./../../lang/assert'),
    attributes = require('./../../lang/attributes'),
    is = require('./../../lang/is');

var RestAction = require('./RestAction'),
    RestParser = require('./RestParser');

module.exports = function () {
	'use strict';

	/**
  * Defines a REST-ful endpoint and allows construction of valid
  * URI that can be used to call the endpoint.
  *
  * @public
  * @param {RestAction} action - The action supported by the endpoint
  * @param {Array<String>} pathProperties - The parameters required by the endpoint
  * @param {String=} payloadProperty - The property name of the object to use as a payload for the REST action
  * @param {Boolean=} suppressQuerystring - If true, the querystring will be omitted when making the HTTP request
  */

	var RestEndpoint = function () {
		function RestEndpoint(action, pathProperties, payloadProperty, suppressQuerystring, responseParser) {
			_classCallCheck(this, RestEndpoint);

			assert.argumentIsRequired(action, 'action', RestAction, 'RestAction');
			assert.argumentIsArray(pathProperties, 'pathProperties', String);
			assert.argumentIsOptional(payloadProperty, 'payloadProperty', String);
			assert.argumentIsOptional(suppressQuerystring, 'suppressQuerystring', Boolean);
			assert.argumentIsOptional(responseParser, 'responseParser', RestParser, 'RestParser');

			this._action = action;

			this._pathProperties = pathProperties;
			this._payloadProperty = payloadProperty || null;
			this._suppressQuerystring = is.boolean(suppressQuerystring) && suppressQuerystring;

			this._responseParser = responseParser || RestParser.JSON;
		}

		/**
   * The {@link RestAction} the endpoint supports.
   *
   * @public
   * @returns {RestAction}
   */

		_createClass(RestEndpoint, [{
			key: 'getAction',
			value: function getAction() {
				return this._action;
			}

			/**
    * Indicates if the querystring should be omitted when making the HTTP
    * request.
    * 
    * @public
    * @returns {Boolean}
    */

		}, {
			key: 'getSuppressQuerystring',
			value: function getSuppressQuerystring() {
				return this._suppressQuerystring;
			}

			/**
    * Constructs the URI used to trigger the REST action.
    *
    * @public
    * @param {Object} data - The data which will be passed to the endpoint
    * @param {String} host - The host name to call
    * @param {Number=} port - The port
    * @param {Boolean=} secure - If true, HTTPS is used; otherwise HTTP.
    * @returns {*}
    */

		}, {
			key: 'getUrl',
			value: function getUrl(data, host, port, secure) {
				assert.argumentIsOptional(host, 'host', String);
				assert.argumentIsOptional(port, 'port', Number);
				assert.argumentIsOptional(secure, 'secure', Boolean);

				var path = this.getPath(data, true);

				if (this.getAction().getPathIsRequired() && path.length === 0) {
					throw new Error('Unable to generate REST query path.');
				}

				var returnRef = void 0;

				if (host.length !== 0) {
					var url = void 0;

					if (secure) {
						url = 'https://';
					} else {
						url = 'http://';
					}

					url = url + host;

					if (is.number(port) && port !== 80) {
						url = url + ':' + port;
					}

					returnRef = encodeURI(url + '/' + path);
				}

				return returnRef;
			}
		}, {
			key: 'getPath',
			value: function getPath(data, skipEncoding) {
				var path = this._pathProperties.map(function (pathProperty) {
					var pathItem = void 0;

					if (attributes.has(data || {}, pathProperty)) {
						pathItem = attributes.read(data, pathProperty);
					} else {
						pathItem = pathProperty;
					}

					if (!skipEncoding) {
						pathItem = encodeURIComponent(pathItem);
					}

					return pathItem;
				});

				return path.join('/');
			}
		}, {
			key: 'getPayload',
			value: function getPayload(data) {
				var returnRef = void 0;

				if (this._payloadProperty !== null) {
					returnRef = attributes.read(data, this._payloadProperty);
				} else {
					returnRef = data;
				}

				if (this.getAction().getPayloadIsRequired() && !is.object(returnRef)) {
					throw new Error('Unable to generate REST payload.');
				}

				return returnRef;
			}
		}, {
			key: 'parseResponse',
			value: function parseResponse(response) {
				return this._responseParser.parse(response);
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[RestEndpoint]';
			}
		}]);

		return RestEndpoint;
	}();

	return RestEndpoint;
}();

},{"./../../lang/assert":24,"./../../lang/attributes":25,"./../../lang/is":29,"./RestAction":41,"./RestParser":43}],43:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var assert = require('./../../lang/assert');

var RestEndpoint = require('./RestEndpoint'),
    RestParser = require('./RestParser');

var Schema = require('./../../serialization/json/Schema');

module.exports = function () {
	'use strict';

	/**
  * Parses the response received by a {@link RestProivderBase}, the
  * default implementation simply returns the response string.
  *
  * @public
  */

	var RestParser = function () {
		function RestParser() {
			_classCallCheck(this, RestParser);
		}

		/**
   * Parses a response.
   *
   * @public
   * @param {String=} response.
   * @returns {*}
   */

		_createClass(RestParser, [{
			key: 'parse',
			value: function parse(response) {
				assert.argumentIsOptional(response, 'response', String);

				return this._parse(response);
			}

			/**
    * @protected
    * @abstract
    * @ignore
    */

		}, {
			key: '_parse',
			value: function _parse(response) {
				return response;
			}

			/**
    * Returns a {@link RestParser} that does nothing -- it just returns
    * the response string that it is given.
    *
    * @public
    * @returns {RestParser}
    */

		}, {
			key: 'toString',
			value: function toString() {
				return '[RestParser]';
			}
		}], [{
			key: 'getJsonParser',

			/**
    * Returns a {@link RestParser} parses the does customized JSON parsing
    * using a "reviver" function.
    *
    * @public
    * @param {Function} reviverFactory - A function that returns a JSON.parse reviver function
    * @returns {RestParser}
    */
			value: function getJsonParser(reviverFactory) {
				return new DelegatedRestParser(function (x) {
					return JSON.parse(x, reviverFactory());
				});
			}

			/**
    * Returns a {@link RestParser} parses the does customized JSON parsing
    * based on a JSON {@link Schema}.
    *
    * @public
    * @param {Schema} schema
    * @returns {RestParser}
    */

		}, {
			key: 'getJsonParserForSchema',
			value: function getJsonParserForSchema(schema) {
				assert.argumentIsRequired(schema, 'schema', Schema, 'Schema');

				return RestParser.getJsonParser(schema.getReviverFactory());
			}
		}, {
			key: 'DEFAULT',
			get: function get() {
				return restParserDefault;
			}

			/**
    * Returns a {@link RestParser} parses the response string as JSON.
    *
    * @public
    * @returns {RestParser}
    */

		}, {
			key: 'JSON',
			get: function get() {
				return restParserJson;
			}
		}]);

		return RestParser;
	}();

	var DelegatedRestParser = function (_RestParser) {
		_inherits(DelegatedRestParser, _RestParser);

		function DelegatedRestParser(delegate) {
			_classCallCheck(this, DelegatedRestParser);

			var _this = _possibleConstructorReturn(this, (DelegatedRestParser.__proto__ || Object.getPrototypeOf(DelegatedRestParser)).call(this));

			assert.argumentIsRequired(delegate, 'delegate', Function);

			_this._delegate = delegate;
			return _this;
		}

		_createClass(DelegatedRestParser, [{
			key: '_parse',
			value: function _parse(response) {
				return this._delegate(response);
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[DelegatedRestParser]';
			}
		}]);

		return DelegatedRestParser;
	}(RestParser);

	var restParserDefault = new RestParser();
	var restParserJson = new DelegatedRestParser(function (x) {
		return JSON.parse(x);
	});

	return RestParser;
}();

},{"./../../lang/assert":24,"./../../serialization/json/Schema":53,"./RestEndpoint":42,"./RestParser":43}],44:[function(require,module,exports){
/* big.js v3.1.3 https://github.com/MikeMcl/big.js/LICENCE */
;(function (global) {
    'use strict';

/*
  big.js v3.1.3
  A small, fast, easy-to-use library for arbitrary-precision decimal arithmetic.
  https://github.com/MikeMcl/big.js/
  Copyright (c) 2014 Michael Mclaughlin <M8ch88l@gmail.com>
  MIT Expat Licence
*/

/***************************** EDITABLE DEFAULTS ******************************/

    // The default values below must be integers within the stated ranges.

    /*
     * The maximum number of decimal places of the results of operations
     * involving division: div and sqrt, and pow with negative exponents.
     */
    var DP = 20,                           // 0 to MAX_DP

        /*
         * The rounding mode used when rounding to the above decimal places.
         *
         * 0 Towards zero (i.e. truncate, no rounding).       (ROUND_DOWN)
         * 1 To nearest neighbour. If equidistant, round up.  (ROUND_HALF_UP)
         * 2 To nearest neighbour. If equidistant, to even.   (ROUND_HALF_EVEN)
         * 3 Away from zero.                                  (ROUND_UP)
         */
        RM = 1,                            // 0, 1, 2 or 3

        // The maximum value of DP and Big.DP.
        MAX_DP = 1E6,                      // 0 to 1000000

        // The maximum magnitude of the exponent argument to the pow method.
        MAX_POWER = 1E6,                   // 1 to 1000000

        /*
         * The exponent value at and beneath which toString returns exponential
         * notation.
         * JavaScript's Number type: -7
         * -1000000 is the minimum recommended exponent value of a Big.
         */
        E_NEG = -7,                   // 0 to -1000000

        /*
         * The exponent value at and above which toString returns exponential
         * notation.
         * JavaScript's Number type: 21
         * 1000000 is the maximum recommended exponent value of a Big.
         * (This limit is not enforced or checked.)
         */
        E_POS = 21,                   // 0 to 1000000

/******************************************************************************/

        // The shared prototype object.
        P = {},
        isValid = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,
        Big;


    /*
     * Create and return a Big constructor.
     *
     */
    function bigFactory() {

        /*
         * The Big constructor and exported function.
         * Create and return a new instance of a Big number object.
         *
         * n {number|string|Big} A numeric value.
         */
        function Big(n) {
            var x = this;

            // Enable constructor usage without new.
            if (!(x instanceof Big)) {
                return n === void 0 ? bigFactory() : new Big(n);
            }

            // Duplicate.
            if (n instanceof Big) {
                x.s = n.s;
                x.e = n.e;
                x.c = n.c.slice();
            } else {
                parse(x, n);
            }

            /*
             * Retain a reference to this Big constructor, and shadow
             * Big.prototype.constructor which points to Object.
             */
            x.constructor = Big;
        }

        Big.prototype = P;
        Big.DP = DP;
        Big.RM = RM;
        Big.E_NEG = E_NEG;
        Big.E_POS = E_POS;

        return Big;
    }


    // Private functions


    /*
     * Return a string representing the value of Big x in normal or exponential
     * notation to dp fixed decimal places or significant digits.
     *
     * x {Big} The Big to format.
     * dp {number} Integer, 0 to MAX_DP inclusive.
     * toE {number} 1 (toExponential), 2 (toPrecision) or undefined (toFixed).
     */
    function format(x, dp, toE) {
        var Big = x.constructor,

            // The index (normal notation) of the digit that may be rounded up.
            i = dp - (x = new Big(x)).e,
            c = x.c;

        // Round?
        if (c.length > ++dp) {
            rnd(x, i, Big.RM);
        }

        if (!c[0]) {
            ++i;
        } else if (toE) {
            i = dp;

        // toFixed
        } else {
            c = x.c;

            // Recalculate i as x.e may have changed if value rounded up.
            i = x.e + i + 1;
        }

        // Append zeros?
        for (; c.length < i; c.push(0)) {
        }
        i = x.e;

        /*
         * toPrecision returns exponential notation if the number of
         * significant digits specified is less than the number of digits
         * necessary to represent the integer part of the value in normal
         * notation.
         */
        return toE === 1 || toE && (dp <= i || i <= Big.E_NEG) ?

          // Exponential notation.
          (x.s < 0 && c[0] ? '-' : '') +
            (c.length > 1 ? c[0] + '.' + c.join('').slice(1) : c[0]) +
              (i < 0 ? 'e' : 'e+') + i

          // Normal notation.
          : x.toString();
    }


    /*
     * Parse the number or string value passed to a Big constructor.
     *
     * x {Big} A Big number instance.
     * n {number|string} A numeric value.
     */
    function parse(x, n) {
        var e, i, nL;

        // Minus zero?
        if (n === 0 && 1 / n < 0) {
            n = '-0';

        // Ensure n is string and check validity.
        } else if (!isValid.test(n += '')) {
            throwErr(NaN);
        }

        // Determine sign.
        x.s = n.charAt(0) == '-' ? (n = n.slice(1), -1) : 1;

        // Decimal point?
        if ((e = n.indexOf('.')) > -1) {
            n = n.replace('.', '');
        }

        // Exponential form?
        if ((i = n.search(/e/i)) > 0) {

            // Determine exponent.
            if (e < 0) {
                e = i;
            }
            e += +n.slice(i + 1);
            n = n.substring(0, i);

        } else if (e < 0) {

            // Integer.
            e = n.length;
        }

        // Determine leading zeros.
        for (i = 0; n.charAt(i) == '0'; i++) {
        }

        if (i == (nL = n.length)) {

            // Zero.
            x.c = [ x.e = 0 ];
        } else {

            // Determine trailing zeros.
            for (; n.charAt(--nL) == '0';) {
            }

            x.e = e - i - 1;
            x.c = [];

            // Convert string to array of digits without leading/trailing zeros.
            for (e = 0; i <= nL; x.c[e++] = +n.charAt(i++)) {
            }
        }

        return x;
    }


    /*
     * Round Big x to a maximum of dp decimal places using rounding mode rm.
     * Called by div, sqrt and round.
     *
     * x {Big} The Big to round.
     * dp {number} Integer, 0 to MAX_DP inclusive.
     * rm {number} 0, 1, 2 or 3 (DOWN, HALF_UP, HALF_EVEN, UP)
     * [more] {boolean} Whether the result of division was truncated.
     */
    function rnd(x, dp, rm, more) {
        var u,
            xc = x.c,
            i = x.e + dp + 1;

        if (rm === 1) {

            // xc[i] is the digit after the digit that may be rounded up.
            more = xc[i] >= 5;
        } else if (rm === 2) {
            more = xc[i] > 5 || xc[i] == 5 &&
              (more || i < 0 || xc[i + 1] !== u || xc[i - 1] & 1);
        } else if (rm === 3) {
            more = more || xc[i] !== u || i < 0;
        } else {
            more = false;

            if (rm !== 0) {
                throwErr('!Big.RM!');
            }
        }

        if (i < 1 || !xc[0]) {

            if (more) {

                // 1, 0.1, 0.01, 0.001, 0.0001 etc.
                x.e = -dp;
                x.c = [1];
            } else {

                // Zero.
                x.c = [x.e = 0];
            }
        } else {

            // Remove any digits after the required decimal places.
            xc.length = i--;

            // Round up?
            if (more) {

                // Rounding up may mean the previous digit has to be rounded up.
                for (; ++xc[i] > 9;) {
                    xc[i] = 0;

                    if (!i--) {
                        ++x.e;
                        xc.unshift(1);
                    }
                }
            }

            // Remove trailing zeros.
            for (i = xc.length; !xc[--i]; xc.pop()) {
            }
        }

        return x;
    }


    /*
     * Throw a BigError.
     *
     * message {string} The error message.
     */
    function throwErr(message) {
        var err = new Error(message);
        err.name = 'BigError';

        throw err;
    }


    // Prototype/instance methods


    /*
     * Return a new Big whose value is the absolute value of this Big.
     */
    P.abs = function () {
        var x = new this.constructor(this);
        x.s = 1;

        return x;
    };


    /*
     * Return
     * 1 if the value of this Big is greater than the value of Big y,
     * -1 if the value of this Big is less than the value of Big y, or
     * 0 if they have the same value.
    */
    P.cmp = function (y) {
        var xNeg,
            x = this,
            xc = x.c,
            yc = (y = new x.constructor(y)).c,
            i = x.s,
            j = y.s,
            k = x.e,
            l = y.e;

        // Either zero?
        if (!xc[0] || !yc[0]) {
            return !xc[0] ? !yc[0] ? 0 : -j : i;
        }

        // Signs differ?
        if (i != j) {
            return i;
        }
        xNeg = i < 0;

        // Compare exponents.
        if (k != l) {
            return k > l ^ xNeg ? 1 : -1;
        }

        i = -1;
        j = (k = xc.length) < (l = yc.length) ? k : l;

        // Compare digit by digit.
        for (; ++i < j;) {

            if (xc[i] != yc[i]) {
                return xc[i] > yc[i] ^ xNeg ? 1 : -1;
            }
        }

        // Compare lengths.
        return k == l ? 0 : k > l ^ xNeg ? 1 : -1;
    };


    /*
     * Return a new Big whose value is the value of this Big divided by the
     * value of Big y, rounded, if necessary, to a maximum of Big.DP decimal
     * places using rounding mode Big.RM.
     */
    P.div = function (y) {
        var x = this,
            Big = x.constructor,
            // dividend
            dvd = x.c,
            //divisor
            dvs = (y = new Big(y)).c,
            s = x.s == y.s ? 1 : -1,
            dp = Big.DP;

        if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
            throwErr('!Big.DP!');
        }

        // Either 0?
        if (!dvd[0] || !dvs[0]) {

            // If both are 0, throw NaN
            if (dvd[0] == dvs[0]) {
                throwErr(NaN);
            }

            // If dvs is 0, throw +-Infinity.
            if (!dvs[0]) {
                throwErr(s / 0);
            }

            // dvd is 0, return +-0.
            return new Big(s * 0);
        }

        var dvsL, dvsT, next, cmp, remI, u,
            dvsZ = dvs.slice(),
            dvdI = dvsL = dvs.length,
            dvdL = dvd.length,
            // remainder
            rem = dvd.slice(0, dvsL),
            remL = rem.length,
            // quotient
            q = y,
            qc = q.c = [],
            qi = 0,
            digits = dp + (q.e = x.e - y.e) + 1;

        q.s = s;
        s = digits < 0 ? 0 : digits;

        // Create version of divisor with leading zero.
        dvsZ.unshift(0);

        // Add zeros to make remainder as long as divisor.
        for (; remL++ < dvsL; rem.push(0)) {
        }

        do {

            // 'next' is how many times the divisor goes into current remainder.
            for (next = 0; next < 10; next++) {

                // Compare divisor and remainder.
                if (dvsL != (remL = rem.length)) {
                    cmp = dvsL > remL ? 1 : -1;
                } else {

                    for (remI = -1, cmp = 0; ++remI < dvsL;) {

                        if (dvs[remI] != rem[remI]) {
                            cmp = dvs[remI] > rem[remI] ? 1 : -1;
                            break;
                        }
                    }
                }

                // If divisor < remainder, subtract divisor from remainder.
                if (cmp < 0) {

                    // Remainder can't be more than 1 digit longer than divisor.
                    // Equalise lengths using divisor with extra leading zero?
                    for (dvsT = remL == dvsL ? dvs : dvsZ; remL;) {

                        if (rem[--remL] < dvsT[remL]) {
                            remI = remL;

                            for (; remI && !rem[--remI]; rem[remI] = 9) {
                            }
                            --rem[remI];
                            rem[remL] += 10;
                        }
                        rem[remL] -= dvsT[remL];
                    }
                    for (; !rem[0]; rem.shift()) {
                    }
                } else {
                    break;
                }
            }

            // Add the 'next' digit to the result array.
            qc[qi++] = cmp ? next : ++next;

            // Update the remainder.
            if (rem[0] && cmp) {
                rem[remL] = dvd[dvdI] || 0;
            } else {
                rem = [ dvd[dvdI] ];
            }

        } while ((dvdI++ < dvdL || rem[0] !== u) && s--);

        // Leading zero? Do not remove if result is simply zero (qi == 1).
        if (!qc[0] && qi != 1) {

            // There can't be more than one zero.
            qc.shift();
            q.e--;
        }

        // Round?
        if (qi > digits) {
            rnd(q, dp, Big.RM, rem[0] !== u);
        }

        return q;
    };


    /*
     * Return true if the value of this Big is equal to the value of Big y,
     * otherwise returns false.
     */
    P.eq = function (y) {
        return !this.cmp(y);
    };


    /*
     * Return true if the value of this Big is greater than the value of Big y,
     * otherwise returns false.
     */
    P.gt = function (y) {
        return this.cmp(y) > 0;
    };


    /*
     * Return true if the value of this Big is greater than or equal to the
     * value of Big y, otherwise returns false.
     */
    P.gte = function (y) {
        return this.cmp(y) > -1;
    };


    /*
     * Return true if the value of this Big is less than the value of Big y,
     * otherwise returns false.
     */
    P.lt = function (y) {
        return this.cmp(y) < 0;
    };


    /*
     * Return true if the value of this Big is less than or equal to the value
     * of Big y, otherwise returns false.
     */
    P.lte = function (y) {
         return this.cmp(y) < 1;
    };


    /*
     * Return a new Big whose value is the value of this Big minus the value
     * of Big y.
     */
    P.sub = P.minus = function (y) {
        var i, j, t, xLTy,
            x = this,
            Big = x.constructor,
            a = x.s,
            b = (y = new Big(y)).s;

        // Signs differ?
        if (a != b) {
            y.s = -b;
            return x.plus(y);
        }

        var xc = x.c.slice(),
            xe = x.e,
            yc = y.c,
            ye = y.e;

        // Either zero?
        if (!xc[0] || !yc[0]) {

            // y is non-zero? x is non-zero? Or both are zero.
            return yc[0] ? (y.s = -b, y) : new Big(xc[0] ? x : 0);
        }

        // Determine which is the bigger number.
        // Prepend zeros to equalise exponents.
        if (a = xe - ye) {

            if (xLTy = a < 0) {
                a = -a;
                t = xc;
            } else {
                ye = xe;
                t = yc;
            }

            t.reverse();
            for (b = a; b--; t.push(0)) {
            }
            t.reverse();
        } else {

            // Exponents equal. Check digit by digit.
            j = ((xLTy = xc.length < yc.length) ? xc : yc).length;

            for (a = b = 0; b < j; b++) {

                if (xc[b] != yc[b]) {
                    xLTy = xc[b] < yc[b];
                    break;
                }
            }
        }

        // x < y? Point xc to the array of the bigger number.
        if (xLTy) {
            t = xc;
            xc = yc;
            yc = t;
            y.s = -y.s;
        }

        /*
         * Append zeros to xc if shorter. No need to add zeros to yc if shorter
         * as subtraction only needs to start at yc.length.
         */
        if (( b = (j = yc.length) - (i = xc.length) ) > 0) {

            for (; b--; xc[i++] = 0) {
            }
        }

        // Subtract yc from xc.
        for (b = i; j > a;){

            if (xc[--j] < yc[j]) {

                for (i = j; i && !xc[--i]; xc[i] = 9) {
                }
                --xc[i];
                xc[j] += 10;
            }
            xc[j] -= yc[j];
        }

        // Remove trailing zeros.
        for (; xc[--b] === 0; xc.pop()) {
        }

        // Remove leading zeros and adjust exponent accordingly.
        for (; xc[0] === 0;) {
            xc.shift();
            --ye;
        }

        if (!xc[0]) {

            // n - n = +0
            y.s = 1;

            // Result must be zero.
            xc = [ye = 0];
        }

        y.c = xc;
        y.e = ye;

        return y;
    };


    /*
     * Return a new Big whose value is the value of this Big modulo the
     * value of Big y.
     */
    P.mod = function (y) {
        var yGTx,
            x = this,
            Big = x.constructor,
            a = x.s,
            b = (y = new Big(y)).s;

        if (!y.c[0]) {
            throwErr(NaN);
        }

        x.s = y.s = 1;
        yGTx = y.cmp(x) == 1;
        x.s = a;
        y.s = b;

        if (yGTx) {
            return new Big(x);
        }

        a = Big.DP;
        b = Big.RM;
        Big.DP = Big.RM = 0;
        x = x.div(y);
        Big.DP = a;
        Big.RM = b;

        return this.minus( x.times(y) );
    };


    /*
     * Return a new Big whose value is the value of this Big plus the value
     * of Big y.
     */
    P.add = P.plus = function (y) {
        var t,
            x = this,
            Big = x.constructor,
            a = x.s,
            b = (y = new Big(y)).s;

        // Signs differ?
        if (a != b) {
            y.s = -b;
            return x.minus(y);
        }

        var xe = x.e,
            xc = x.c,
            ye = y.e,
            yc = y.c;

        // Either zero?
        if (!xc[0] || !yc[0]) {

            // y is non-zero? x is non-zero? Or both are zero.
            return yc[0] ? y : new Big(xc[0] ? x : a * 0);
        }
        xc = xc.slice();

        // Prepend zeros to equalise exponents.
        // Note: Faster to use reverse then do unshifts.
        if (a = xe - ye) {

            if (a > 0) {
                ye = xe;
                t = yc;
            } else {
                a = -a;
                t = xc;
            }

            t.reverse();
            for (; a--; t.push(0)) {
            }
            t.reverse();
        }

        // Point xc to the longer array.
        if (xc.length - yc.length < 0) {
            t = yc;
            yc = xc;
            xc = t;
        }
        a = yc.length;

        /*
         * Only start adding at yc.length - 1 as the further digits of xc can be
         * left as they are.
         */
        for (b = 0; a;) {
            b = (xc[--a] = xc[a] + yc[a] + b) / 10 | 0;
            xc[a] %= 10;
        }

        // No need to check for zero, as +x + +y != 0 && -x + -y != 0

        if (b) {
            xc.unshift(b);
            ++ye;
        }

         // Remove trailing zeros.
        for (a = xc.length; xc[--a] === 0; xc.pop()) {
        }

        y.c = xc;
        y.e = ye;

        return y;
    };


    /*
     * Return a Big whose value is the value of this Big raised to the power n.
     * If n is negative, round, if necessary, to a maximum of Big.DP decimal
     * places using rounding mode Big.RM.
     *
     * n {number} Integer, -MAX_POWER to MAX_POWER inclusive.
     */
    P.pow = function (n) {
        var x = this,
            one = new x.constructor(1),
            y = one,
            isNeg = n < 0;

        if (n !== ~~n || n < -MAX_POWER || n > MAX_POWER) {
            throwErr('!pow!');
        }

        n = isNeg ? -n : n;

        for (;;) {

            if (n & 1) {
                y = y.times(x);
            }
            n >>= 1;

            if (!n) {
                break;
            }
            x = x.times(x);
        }

        return isNeg ? one.div(y) : y;
    };


    /*
     * Return a new Big whose value is the value of this Big rounded to a
     * maximum of dp decimal places using rounding mode rm.
     * If dp is not specified, round to 0 decimal places.
     * If rm is not specified, use Big.RM.
     *
     * [dp] {number} Integer, 0 to MAX_DP inclusive.
     * [rm] 0, 1, 2 or 3 (ROUND_DOWN, ROUND_HALF_UP, ROUND_HALF_EVEN, ROUND_UP)
     */
    P.round = function (dp, rm) {
        var x = this,
            Big = x.constructor;

        if (dp == null) {
            dp = 0;
        } else if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
            throwErr('!round!');
        }
        rnd(x = new Big(x), dp, rm == null ? Big.RM : rm);

        return x;
    };


    /*
     * Return a new Big whose value is the square root of the value of this Big,
     * rounded, if necessary, to a maximum of Big.DP decimal places using
     * rounding mode Big.RM.
     */
    P.sqrt = function () {
        var estimate, r, approx,
            x = this,
            Big = x.constructor,
            xc = x.c,
            i = x.s,
            e = x.e,
            half = new Big('0.5');

        // Zero?
        if (!xc[0]) {
            return new Big(x);
        }

        // If negative, throw NaN.
        if (i < 0) {
            throwErr(NaN);
        }

        // Estimate.
        i = Math.sqrt(x.toString());

        // Math.sqrt underflow/overflow?
        // Pass x to Math.sqrt as integer, then adjust the result exponent.
        if (i === 0 || i === 1 / 0) {
            estimate = xc.join('');

            if (!(estimate.length + e & 1)) {
                estimate += '0';
            }

            r = new Big( Math.sqrt(estimate).toString() );
            r.e = ((e + 1) / 2 | 0) - (e < 0 || e & 1);
        } else {
            r = new Big(i.toString());
        }

        i = r.e + (Big.DP += 4);

        // Newton-Raphson iteration.
        do {
            approx = r;
            r = half.times( approx.plus( x.div(approx) ) );
        } while ( approx.c.slice(0, i).join('') !==
                       r.c.slice(0, i).join('') );

        rnd(r, Big.DP -= 4, Big.RM);

        return r;
    };


    /*
     * Return a new Big whose value is the value of this Big times the value of
     * Big y.
     */
    P.mul = P.times = function (y) {
        var c,
            x = this,
            Big = x.constructor,
            xc = x.c,
            yc = (y = new Big(y)).c,
            a = xc.length,
            b = yc.length,
            i = x.e,
            j = y.e;

        // Determine sign of result.
        y.s = x.s == y.s ? 1 : -1;

        // Return signed 0 if either 0.
        if (!xc[0] || !yc[0]) {
            return new Big(y.s * 0);
        }

        // Initialise exponent of result as x.e + y.e.
        y.e = i + j;

        // If array xc has fewer digits than yc, swap xc and yc, and lengths.
        if (a < b) {
            c = xc;
            xc = yc;
            yc = c;
            j = a;
            a = b;
            b = j;
        }

        // Initialise coefficient array of result with zeros.
        for (c = new Array(j = a + b); j--; c[j] = 0) {
        }

        // Multiply.

        // i is initially xc.length.
        for (i = b; i--;) {
            b = 0;

            // a is yc.length.
            for (j = a + i; j > i;) {

                // Current sum of products at this digit position, plus carry.
                b = c[j] + yc[i] * xc[j - i - 1] + b;
                c[j--] = b % 10;

                // carry
                b = b / 10 | 0;
            }
            c[j] = (c[j] + b) % 10;
        }

        // Increment result exponent if there is a final carry.
        if (b) {
            ++y.e;
        }

        // Remove any leading zero.
        if (!c[0]) {
            c.shift();
        }

        // Remove trailing zeros.
        for (i = c.length; !c[--i]; c.pop()) {
        }
        y.c = c;

        return y;
    };


    /*
     * Return a string representing the value of this Big.
     * Return exponential notation if this Big has a positive exponent equal to
     * or greater than Big.E_POS, or a negative exponent equal to or less than
     * Big.E_NEG.
     */
    P.toString = P.valueOf = P.toJSON = function () {
        var x = this,
            Big = x.constructor,
            e = x.e,
            str = x.c.join(''),
            strL = str.length;

        // Exponential notation?
        if (e <= Big.E_NEG || e >= Big.E_POS) {
            str = str.charAt(0) + (strL > 1 ? '.' + str.slice(1) : '') +
              (e < 0 ? 'e' : 'e+') + e;

        // Negative exponent?
        } else if (e < 0) {

            // Prepend zeros.
            for (; ++e; str = '0' + str) {
            }
            str = '0.' + str;

        // Positive exponent?
        } else if (e > 0) {

            if (++e > strL) {

                // Append zeros.
                for (e -= strL; e-- ; str += '0') {
                }
            } else if (e < strL) {
                str = str.slice(0, e) + '.' + str.slice(e);
            }

        // Exponent zero.
        } else if (strL > 1) {
            str = str.charAt(0) + '.' + str.slice(1);
        }

        // Avoid '-0'
        return x.s < 0 && x.c[0] ? '-' + str : str;
    };


    /*
     ***************************************************************************
     * If toExponential, toFixed, toPrecision and format are not required they
     * can safely be commented-out or deleted. No redundant code will be left.
     * format is used only by toExponential, toFixed and toPrecision.
     ***************************************************************************
     */


    /*
     * Return a string representing the value of this Big in exponential
     * notation to dp fixed decimal places and rounded, if necessary, using
     * Big.RM.
     *
     * [dp] {number} Integer, 0 to MAX_DP inclusive.
     */
    P.toExponential = function (dp) {

        if (dp == null) {
            dp = this.c.length - 1;
        } else if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
            throwErr('!toExp!');
        }

        return format(this, dp, 1);
    };


    /*
     * Return a string representing the value of this Big in normal notation
     * to dp fixed decimal places and rounded, if necessary, using Big.RM.
     *
     * [dp] {number} Integer, 0 to MAX_DP inclusive.
     */
    P.toFixed = function (dp) {
        var str,
            x = this,
            Big = x.constructor,
            neg = Big.E_NEG,
            pos = Big.E_POS;

        // Prevent the possibility of exponential notation.
        Big.E_NEG = -(Big.E_POS = 1 / 0);

        if (dp == null) {
            str = x.toString();
        } else if (dp === ~~dp && dp >= 0 && dp <= MAX_DP) {
            str = format(x, x.e + dp);

            // (-0).toFixed() is '0', but (-0.1).toFixed() is '-0'.
            // (-0).toFixed(1) is '0.0', but (-0.01).toFixed(1) is '-0.0'.
            if (x.s < 0 && x.c[0] && str.indexOf('-') < 0) {
        //E.g. -0.5 if rounded to -0 will cause toString to omit the minus sign.
                str = '-' + str;
            }
        }
        Big.E_NEG = neg;
        Big.E_POS = pos;

        if (!str) {
            throwErr('!toFix!');
        }

        return str;
    };


    /*
     * Return a string representing the value of this Big rounded to sd
     * significant digits using Big.RM. Use exponential notation if sd is less
     * than the number of digits necessary to represent the integer part of the
     * value in normal notation.
     *
     * sd {number} Integer, 1 to MAX_DP inclusive.
     */
    P.toPrecision = function (sd) {

        if (sd == null) {
            return this.toString();
        } else if (sd !== ~~sd || sd < 1 || sd > MAX_DP) {
            throwErr('!toPre!');
        }

        return format(this, sd - 1, 2);
    };


    // Export


    Big = bigFactory();

    //AMD.
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return Big;
        });

    // Node and other CommonJS-like environments that support module.exports.
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = Big;

    //Browser.
    } else {
        global.Big = Big;
    }
})(this);

},{}],45:[function(require,module,exports){
//! moment-timezone.js
//! version : 0.5.11
//! Copyright (c) JS Foundation and other contributors
//! license : MIT
//! github.com/moment/moment-timezone

(function (root, factory) {
	"use strict";

	/*global define*/
	if (typeof define === 'function' && define.amd) {
		define(['moment'], factory);                 // AMD
	} else if (typeof module === 'object' && module.exports) {
		module.exports = factory(require('moment')); // Node
	} else {
		factory(root.moment);                        // Browser
	}
}(this, function (moment) {
	"use strict";

	// Do not load moment-timezone a second time.
	// if (moment.tz !== undefined) {
	// 	logError('Moment Timezone ' + moment.tz.version + ' was already loaded ' + (moment.tz.dataVersion ? 'with data from ' : 'without any data') + moment.tz.dataVersion);
	// 	return moment;
	// }

	var VERSION = "0.5.11",
		zones = {},
		links = {},
		names = {},
		guesses = {},
		cachedGuess,

		momentVersion = moment.version.split('.'),
		major = +momentVersion[0],
		minor = +momentVersion[1];

	// Moment.js version check
	if (major < 2 || (major === 2 && minor < 6)) {
		logError('Moment Timezone requires Moment.js >= 2.6.0. You are using Moment.js ' + moment.version + '. See momentjs.com');
	}

	/************************************
		Unpacking
	************************************/

	function charCodeToInt(charCode) {
		if (charCode > 96) {
			return charCode - 87;
		} else if (charCode > 64) {
			return charCode - 29;
		}
		return charCode - 48;
	}

	function unpackBase60(string) {
		var i = 0,
			parts = string.split('.'),
			whole = parts[0],
			fractional = parts[1] || '',
			multiplier = 1,
			num,
			out = 0,
			sign = 1;

		// handle negative numbers
		if (string.charCodeAt(0) === 45) {
			i = 1;
			sign = -1;
		}

		// handle digits before the decimal
		for (i; i < whole.length; i++) {
			num = charCodeToInt(whole.charCodeAt(i));
			out = 60 * out + num;
		}

		// handle digits after the decimal
		for (i = 0; i < fractional.length; i++) {
			multiplier = multiplier / 60;
			num = charCodeToInt(fractional.charCodeAt(i));
			out += num * multiplier;
		}

		return out * sign;
	}

	function arrayToInt (array) {
		for (var i = 0; i < array.length; i++) {
			array[i] = unpackBase60(array[i]);
		}
	}

	function intToUntil (array, length) {
		for (var i = 0; i < length; i++) {
			array[i] = Math.round((array[i - 1] || 0) + (array[i] * 60000)); // minutes to milliseconds
		}

		array[length - 1] = Infinity;
	}

	function mapIndices (source, indices) {
		var out = [], i;

		for (i = 0; i < indices.length; i++) {
			out[i] = source[indices[i]];
		}

		return out;
	}

	function unpack (string) {
		var data = string.split('|'),
			offsets = data[2].split(' '),
			indices = data[3].split(''),
			untils  = data[4].split(' ');

		arrayToInt(offsets);
		arrayToInt(indices);
		arrayToInt(untils);

		intToUntil(untils, indices.length);

		return {
			name       : data[0],
			abbrs      : mapIndices(data[1].split(' '), indices),
			offsets    : mapIndices(offsets, indices),
			untils     : untils,
			population : data[5] | 0
		};
	}

	/************************************
		Zone object
	************************************/

	function Zone (packedString) {
		if (packedString) {
			this._set(unpack(packedString));
		}
	}

	Zone.prototype = {
		_set : function (unpacked) {
			this.name       = unpacked.name;
			this.abbrs      = unpacked.abbrs;
			this.untils     = unpacked.untils;
			this.offsets    = unpacked.offsets;
			this.population = unpacked.population;
		},

		_index : function (timestamp) {
			var target = +timestamp,
				untils = this.untils,
				i;

			for (i = 0; i < untils.length; i++) {
				if (target < untils[i]) {
					return i;
				}
			}
		},

		parse : function (timestamp) {
			var target  = +timestamp,
				offsets = this.offsets,
				untils  = this.untils,
				max     = untils.length - 1,
				offset, offsetNext, offsetPrev, i;

			for (i = 0; i < max; i++) {
				offset     = offsets[i];
				offsetNext = offsets[i + 1];
				offsetPrev = offsets[i ? i - 1 : i];

				if (offset < offsetNext && tz.moveAmbiguousForward) {
					offset = offsetNext;
				} else if (offset > offsetPrev && tz.moveInvalidForward) {
					offset = offsetPrev;
				}

				if (target < untils[i] - (offset * 60000)) {
					return offsets[i];
				}
			}

			return offsets[max];
		},

		abbr : function (mom) {
			return this.abbrs[this._index(mom)];
		},

		offset : function (mom) {
			return this.offsets[this._index(mom)];
		}
	};

	/************************************
		Current Timezone
	************************************/

	function OffsetAt(at) {
		var timeString = at.toTimeString();
		var abbr = timeString.match(/\([a-z ]+\)/i);
		if (abbr && abbr[0]) {
			// 17:56:31 GMT-0600 (CST)
			// 17:56:31 GMT-0600 (Central Standard Time)
			abbr = abbr[0].match(/[A-Z]/g);
			abbr = abbr ? abbr.join('') : undefined;
		} else {
			// 17:56:31 CST
			// 17:56:31 GMT+0800 (台北標準時間)
			abbr = timeString.match(/[A-Z]{3,5}/g);
			abbr = abbr ? abbr[0] : undefined;
		}

		if (abbr === 'GMT') {
			abbr = undefined;
		}

		this.at = +at;
		this.abbr = abbr;
		this.offset = at.getTimezoneOffset();
	}

	function ZoneScore(zone) {
		this.zone = zone;
		this.offsetScore = 0;
		this.abbrScore = 0;
	}

	ZoneScore.prototype.scoreOffsetAt = function (offsetAt) {
		this.offsetScore += Math.abs(this.zone.offset(offsetAt.at) - offsetAt.offset);
		if (this.zone.abbr(offsetAt.at).replace(/[^A-Z]/g, '') !== offsetAt.abbr) {
			this.abbrScore++;
		}
	};

	function findChange(low, high) {
		var mid, diff;

		while ((diff = ((high.at - low.at) / 12e4 | 0) * 6e4)) {
			mid = new OffsetAt(new Date(low.at + diff));
			if (mid.offset === low.offset) {
				low = mid;
			} else {
				high = mid;
			}
		}

		return low;
	}

	function userOffsets() {
		var startYear = new Date().getFullYear() - 2,
			last = new OffsetAt(new Date(startYear, 0, 1)),
			offsets = [last],
			change, next, i;

		for (i = 1; i < 48; i++) {
			next = new OffsetAt(new Date(startYear, i, 1));
			if (next.offset !== last.offset) {
				change = findChange(last, next);
				offsets.push(change);
				offsets.push(new OffsetAt(new Date(change.at + 6e4)));
			}
			last = next;
		}

		for (i = 0; i < 4; i++) {
			offsets.push(new OffsetAt(new Date(startYear + i, 0, 1)));
			offsets.push(new OffsetAt(new Date(startYear + i, 6, 1)));
		}

		return offsets;
	}

	function sortZoneScores (a, b) {
		if (a.offsetScore !== b.offsetScore) {
			return a.offsetScore - b.offsetScore;
		}
		if (a.abbrScore !== b.abbrScore) {
			return a.abbrScore - b.abbrScore;
		}
		return b.zone.population - a.zone.population;
	}

	function addToGuesses (name, offsets) {
		var i, offset;
		arrayToInt(offsets);
		for (i = 0; i < offsets.length; i++) {
			offset = offsets[i];
			guesses[offset] = guesses[offset] || {};
			guesses[offset][name] = true;
		}
	}

	function guessesForUserOffsets (offsets) {
		var offsetsLength = offsets.length,
			filteredGuesses = {},
			out = [],
			i, j, guessesOffset;

		for (i = 0; i < offsetsLength; i++) {
			guessesOffset = guesses[offsets[i].offset] || {};
			for (j in guessesOffset) {
				if (guessesOffset.hasOwnProperty(j)) {
					filteredGuesses[j] = true;
				}
			}
		}

		for (i in filteredGuesses) {
			if (filteredGuesses.hasOwnProperty(i)) {
				out.push(names[i]);
			}
		}

		return out;
	}

	function rebuildGuess () {

		// use Intl API when available and returning valid time zone
		try {
			var intlName = Intl.DateTimeFormat().resolvedOptions().timeZone;
			if (intlName){
				var name = names[normalizeName(intlName)];
				if (name) {
					return name;
				}
				logError("Moment Timezone found " + intlName + " from the Intl api, but did not have that data loaded.");
			}
		} catch (e) {
			// Intl unavailable, fall back to manual guessing.
		}

		var offsets = userOffsets(),
			offsetsLength = offsets.length,
			guesses = guessesForUserOffsets(offsets),
			zoneScores = [],
			zoneScore, i, j;

		for (i = 0; i < guesses.length; i++) {
			zoneScore = new ZoneScore(getZone(guesses[i]), offsetsLength);
			for (j = 0; j < offsetsLength; j++) {
				zoneScore.scoreOffsetAt(offsets[j]);
			}
			zoneScores.push(zoneScore);
		}

		zoneScores.sort(sortZoneScores);

		return zoneScores.length > 0 ? zoneScores[0].zone.name : undefined;
	}

	function guess (ignoreCache) {
		if (!cachedGuess || ignoreCache) {
			cachedGuess = rebuildGuess();
		}
		return cachedGuess;
	}

	/************************************
		Global Methods
	************************************/

	function normalizeName (name) {
		return (name || '').toLowerCase().replace(/\//g, '_');
	}

	function addZone (packed) {
		var i, name, split, normalized;

		if (typeof packed === "string") {
			packed = [packed];
		}

		for (i = 0; i < packed.length; i++) {
			split = packed[i].split('|');
			name = split[0];
			normalized = normalizeName(name);
			zones[normalized] = packed[i];
			names[normalized] = name;
			if (split[5]) {
				addToGuesses(normalized, split[2].split(' '));
			}
		}
	}

	function getZone (name, caller) {
		name = normalizeName(name);

		var zone = zones[name];
		var link;

		if (zone instanceof Zone) {
			return zone;
		}

		if (typeof zone === 'string') {
			zone = new Zone(zone);
			zones[name] = zone;
			return zone;
		}

		// Pass getZone to prevent recursion more than 1 level deep
		if (links[name] && caller !== getZone && (link = getZone(links[name], getZone))) {
			zone = zones[name] = new Zone();
			zone._set(link);
			zone.name = names[name];
			return zone;
		}

		return null;
	}

	function getNames () {
		var i, out = [];

		for (i in names) {
			if (names.hasOwnProperty(i) && (zones[i] || zones[links[i]]) && names[i]) {
				out.push(names[i]);
			}
		}

		return out.sort();
	}

	function addLink (aliases) {
		var i, alias, normal0, normal1;

		if (typeof aliases === "string") {
			aliases = [aliases];
		}

		for (i = 0; i < aliases.length; i++) {
			alias = aliases[i].split('|');

			normal0 = normalizeName(alias[0]);
			normal1 = normalizeName(alias[1]);

			links[normal0] = normal1;
			names[normal0] = alias[0];

			links[normal1] = normal0;
			names[normal1] = alias[1];
		}
	}

	function loadData (data) {
		addZone(data.zones);
		addLink(data.links);
		tz.dataVersion = data.version;
	}

	function zoneExists (name) {
		if (!zoneExists.didShowError) {
			zoneExists.didShowError = true;
				logError("moment.tz.zoneExists('" + name + "') has been deprecated in favor of !moment.tz.zone('" + name + "')");
		}
		return !!getZone(name);
	}

	function needsOffset (m) {
		return !!(m._a && (m._tzm === undefined));
	}

	function logError (message) {
		if (typeof console !== 'undefined' && typeof console.error === 'function') {
			console.error(message);
		}
	}

	/************************************
		moment.tz namespace
	************************************/

	function tz (input) {
		var args = Array.prototype.slice.call(arguments, 0, -1),
			name = arguments[arguments.length - 1],
			zone = getZone(name),
			out  = moment.utc.apply(null, args);

		if (zone && !moment.isMoment(input) && needsOffset(out)) {
			out.add(zone.parse(out), 'minutes');
		}

		out.tz(name);

		return out;
	}

	tz.version      = VERSION;
	tz.dataVersion  = '';
	tz._zones       = zones;
	tz._links       = links;
	tz._names       = names;
	tz.add          = addZone;
	tz.link         = addLink;
	tz.load         = loadData;
	tz.zone         = getZone;
	tz.zoneExists   = zoneExists; // deprecated in 0.1.0
	tz.guess        = guess;
	tz.names        = getNames;
	tz.Zone         = Zone;
	tz.unpack       = unpack;
	tz.unpackBase60 = unpackBase60;
	tz.needsOffset  = needsOffset;
	tz.moveInvalidForward   = true;
	tz.moveAmbiguousForward = false;

	/************************************
		Interface with Moment.js
	************************************/

	var fn = moment.fn;

	moment.tz = tz;

	moment.defaultZone = null;

	moment.updateOffset = function (mom, keepTime) {
		var zone = moment.defaultZone,
			offset;

		if (mom._z === undefined) {
			if (zone && needsOffset(mom) && !mom._isUTC) {
				mom._d = moment.utc(mom._a)._d;
				mom.utc().add(zone.parse(mom), 'minutes');
			}
			mom._z = zone;
		}
		if (mom._z) {
			offset = mom._z.offset(mom);
			if (Math.abs(offset) < 16) {
				offset = offset / 60;
			}
			if (mom.utcOffset !== undefined) {
				mom.utcOffset(-offset, keepTime);
			} else {
				mom.zone(offset, keepTime);
			}
		}
	};

	fn.tz = function (name) {
		if (name) {
			this._z = getZone(name);
			if (this._z) {
				moment.updateOffset(this);
			} else {
				logError("Moment Timezone has no data for " + name + ". See http://momentjs.com/timezone/docs/#/data-loading/.");
			}
			return this;
		}
		if (this._z) { return this._z.name; }
	};

	function abbrWrap (old) {
		return function () {
			if (this._z) { return this._z.abbr(this); }
			return old.call(this);
		};
	}

	function resetZoneWrap (old) {
		return function () {
			this._z = null;
			return old.apply(this, arguments);
		};
	}

	fn.zoneName = abbrWrap(fn.zoneName);
	fn.zoneAbbr = abbrWrap(fn.zoneAbbr);
	fn.utc      = resetZoneWrap(fn.utc);

	moment.tz.setDefault = function(name) {
		if (major < 2 || (major === 2 && minor < 9)) {
			logError('Moment Timezone setDefault() requires Moment.js >= 2.9.0. You are using Moment.js ' + moment.version + '.');
		}
		moment.defaultZone = name ? getZone(name) : null;
		return moment;
	};

	// Cloning a moment should include the _z property.
	var momentProperties = moment.momentProperties;
	if (Object.prototype.toString.call(momentProperties) === '[object Array]') {
		// moment 2.8.1+
		momentProperties.push('_z');
		momentProperties.push('_a');
	} else if (momentProperties) {
		// moment 2.7.0
		momentProperties._z = null;
	}

	loadData({
		"version": "2016j",
		"zones": [
			"Africa/Abidjan|GMT|0|0||48e5",
			"Africa/Khartoum|EAT|-30|0||51e5",
			"Africa/Algiers|CET|-10|0||26e5",
			"Africa/Lagos|WAT|-10|0||17e6",
			"Africa/Maputo|CAT|-20|0||26e5",
			"Africa/Cairo|EET EEST|-20 -30|010101010|1Cby0 Fb0 c10 8n0 8Nd0 gL0 e10 mn0|15e6",
			"Africa/Casablanca|WET WEST|0 -10|01010101010101010101010101010101010101010|1Cco0 Db0 1zd0 Lz0 1Nf0 wM0 co0 go0 1o00 s00 dA0 vc0 11A0 A00 e00 y00 11A0 uM0 e00 Dc0 11A0 s00 e00 IM0 WM0 mo0 gM0 LA0 WM0 jA0 e00 Rc0 11A0 e00 e00 U00 11A0 8o0 e00 11A0|32e5",
			"Europe/Paris|CET CEST|-10 -20|01010101010101010101010|1BWp0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|11e6",
			"Africa/Johannesburg|SAST|-20|0||84e5",
			"Africa/Tripoli|EET CET CEST|-20 -10 -20|0120|1IlA0 TA0 1o00|11e5",
			"Africa/Windhoek|WAST WAT|-20 -10|01010101010101010101010|1C1c0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 11B0|32e4",
			"America/Adak|HST HDT|a0 90|01010101010101010101010|1BR00 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|326",
			"America/Anchorage|AKST AKDT|90 80|01010101010101010101010|1BQX0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|30e4",
			"America/Santo_Domingo|AST|40|0||29e5",
			"America/Araguaina|BRT BRST|30 20|010|1IdD0 Lz0|14e4",
			"America/Argentina/Buenos_Aires|ART|30|0|",
			"America/Asuncion|PYST PYT|30 40|01010101010101010101010|1C430 1a10 1fz0 1a10 1fz0 1cN0 17b0 1ip0 17b0 1ip0 17b0 1ip0 19X0 1fB0 19X0 1fB0 19X0 1ip0 17b0 1ip0 17b0 1ip0|28e5",
			"America/Panama|EST|50|0||15e5",
			"America/Bahia|BRT BRST|30 20|010|1FJf0 Rb0|27e5",
			"America/Bahia_Banderas|MST CDT CST|70 50 60|01212121212121212121212|1C1l0 1nW0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0|84e3",
			"America/Fortaleza|BRT|30|0||34e5",
			"America/Managua|CST|60|0||22e5",
			"America/Manaus|AMT|40|0||19e5",
			"America/Bogota|COT|50|0||90e5",
			"America/Denver|MST MDT|70 60|01010101010101010101010|1BQV0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|26e5",
			"America/Campo_Grande|AMST AMT|30 40|01010101010101010101010|1BIr0 1zd0 On0 1zd0 Rb0 1zd0 Lz0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 On0 1zd0 On0 1C10 Lz0 1C10 Lz0 1C10|77e4",
			"America/Cancun|CST CDT EST|60 50 50|010101010102|1C1k0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 Dd0|63e4",
			"America/Caracas|VET VET|4u 40|01|1QMT0|29e5",
			"America/Cayenne|GFT|30|0||58e3",
			"America/Chicago|CST CDT|60 50|01010101010101010101010|1BQU0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|92e5",
			"America/Chihuahua|MST MDT|70 60|01010101010101010101010|1C1l0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0|81e4",
			"America/Phoenix|MST|70|0||42e5",
			"America/Los_Angeles|PST PDT|80 70|01010101010101010101010|1BQW0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|15e6",
			"America/New_York|EST EDT|50 40|01010101010101010101010|1BQT0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|21e6",
			"America/Rio_Branco|AMT ACT|40 50|01|1KLE0|31e4",
			"America/Fort_Nelson|PST PDT MST|80 70 70|010101010102|1BQW0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0|39e2",
			"America/Halifax|AST ADT|40 30|01010101010101010101010|1BQS0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|39e4",
			"America/Godthab|WGT WGST|30 20|01010101010101010101010|1BWp0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|17e3",
			"America/Goose_Bay|AST ADT|40 30|01010101010101010101010|1BQQ1 1zb0 Op0 1zcX Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|76e2",
			"America/Grand_Turk|EST EDT AST|50 40 40|0101010101012|1BQT0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|37e2",
			"America/Guayaquil|ECT|50|0||27e5",
			"America/Guyana|GYT|40|0||80e4",
			"America/Havana|CST CDT|50 40|01010101010101010101010|1BQR0 1wo0 U00 1zc0 U00 1qM0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0|21e5",
			"America/La_Paz|BOT|40|0||19e5",
			"America/Lima|PET|50|0||11e6",
			"America/Mexico_City|CST CDT|60 50|01010101010101010101010|1C1k0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0|20e6",
			"America/Metlakatla|PST AKST AKDT|80 90 80|012121212121|1PAa0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|14e2",
			"America/Miquelon|PMST PMDT|30 20|01010101010101010101010|1BQR0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|61e2",
			"America/Montevideo|UYST UYT|20 30|010101010101|1BQQ0 1ld0 14n0 1ld0 14n0 1o10 11z0 1o10 11z0 1o10 11z0|17e5",
			"America/Noronha|FNT|20|0||30e2",
			"America/North_Dakota/Beulah|MST MDT CST CDT|70 60 60 50|01232323232323232323232|1BQV0 1zb0 Oo0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0",
			"America/Paramaribo|SRT|30|0||24e4",
			"America/Port-au-Prince|EST EDT|50 40|010101010|1GI70 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|23e5",
			"America/Santiago|CLST CLT|30 40|010101010101010101010|1C1f0 1fB0 1nX0 G10 1EL0 Op0 1zb0 Rd0 1wn0 Rd0 46n0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0|62e5",
			"America/Sao_Paulo|BRST BRT|20 30|01010101010101010101010|1BIq0 1zd0 On0 1zd0 Rb0 1zd0 Lz0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 On0 1zd0 On0 1C10 Lz0 1C10 Lz0 1C10|20e6",
			"America/Scoresbysund|EGT EGST|10 0|01010101010101010101010|1BWp0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|452",
			"America/St_Johns|NST NDT|3u 2u|01010101010101010101010|1BQPv 1zb0 Op0 1zcX Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|11e4",
			"Antarctica/Casey|+11 +08|-b0 -80|01010|1BN30 40P0 KL0 blz0|10",
			"Antarctica/Davis|+05 +07|-50 -70|0101|1BPw0 3Wn0 KN0|70",
			"Antarctica/DumontDUrville|+10|-a0|0||80",
			"Antarctica/Macquarie|AEDT MIST|-b0 -b0|01|1C140|1",
			"Asia/Tashkent|+05|-50|0||23e5",
			"Pacific/Auckland|NZDT NZST|-d0 -c0|01010101010101010101010|1C120 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00|14e5",
			"Antarctica/Rothera|-03|30|0||130",
			"Antarctica/Syowa|+03|-30|0||20",
			"Antarctica/Troll|+00 +02|0 -20|01010101010101010101010|1BWp0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|40",
			"Asia/Almaty|+06|-60|0||15e5",
			"Asia/Baghdad|AST|-30|0||66e5",
			"Asia/Amman|EET EEST|-20 -30|010101010101010101010|1BVy0 1qM0 11A0 1o00 11A0 4bX0 Dd0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0|25e5",
			"Asia/Kamchatka|+12 +11|-c0 -b0|010|1Dp30 WM0|18e4",
			"Asia/Baku|+04 +05|-40 -50|0101010101010|1BWo0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00|27e5",
			"Asia/Bangkok|ICT|-70|0||15e6",
			"Asia/Barnaul|+06 +07|-60 -70|010101|1BWk0 1qM0 WM0 8Hz0 3rd0",
			"Asia/Beirut|EET EEST|-20 -30|01010101010101010101010|1BWm0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0|22e5",
			"Asia/Brunei|BNT|-80|0||42e4",
			"Asia/Kolkata|IST|-5u|0||15e6",
			"Asia/Chita|+09 +10 +08|-90 -a0 -80|010120|1BWh0 1qM0 WM0 8Hz0 3re0|33e4",
			"Asia/Choibalsan|CHOT CHOST|-80 -90|0101010101010|1O8G0 1cJ0 1cP0 1cJ0 1cP0 1fx0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1cJ0|38e3",
			"Asia/Shanghai|CST|-80|0||23e6",
			"Asia/Colombo|+0530|-5u|0||22e5",
			"Asia/Dhaka|BDT|-60|0||16e6",
			"Asia/Damascus|EET EEST|-20 -30|01010101010101010101010|1C0m0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0|26e5",
			"Asia/Dili|TLT|-90|0||19e4",
			"Asia/Dubai|GST|-40|0||39e5",
			"Asia/Famagusta|EET EEST +03|-20 -30 -30|010101010101012|1BWp0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 15U0",
			"Asia/Gaza|EET EEST|-20 -30|01010101010101010101010|1BVW1 SKX 1xd1 MKX 1AN0 1a00 1fA0 1cL0 1cN0 1nX0 1210 1nz0 1220 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1qL0|18e5",
			"Asia/Hebron|EET EEST|-20 -30|0101010101010101010101010|1BVy0 Tb0 1xd1 MKX bB0 cn0 1cN0 1a00 1fA0 1cL0 1cN0 1nX0 1210 1nz0 1220 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1qL0|25e4",
			"Asia/Hong_Kong|HKT|-80|0||73e5",
			"Asia/Hovd|HOVT HOVST|-70 -80|0101010101010|1O8H0 1cJ0 1cP0 1cJ0 1cP0 1fx0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1cJ0|81e3",
			"Asia/Irkutsk|+08 +09|-80 -90|01010|1BWi0 1qM0 WM0 8Hz0|60e4",
			"Europe/Istanbul|EET EEST +03|-20 -30 -30|010101010101012|1BWp0 1qM0 Xc0 1qo0 WM0 1qM0 11A0 1o00 1200 1nA0 11A0 1tA0 U00 15w0|13e6",
			"Asia/Jakarta|WIB|-70|0||31e6",
			"Asia/Jayapura|WIT|-90|0||26e4",
			"Asia/Jerusalem|IST IDT|-20 -30|01010101010101010101010|1BVA0 17X0 1kp0 1dz0 1c10 1aL0 1eN0 1oL0 10N0 1oL0 10N0 1oL0 10N0 1rz0 W10 1rz0 W10 1rz0 10N0 1oL0 10N0 1oL0|81e4",
			"Asia/Kabul|AFT|-4u|0||46e5",
			"Asia/Karachi|PKT|-50|0||24e6",
			"Asia/Urumqi|XJT|-60|0||32e5",
			"Asia/Kathmandu|NPT|-5J|0||12e5",
			"Asia/Khandyga|+10 +11 +09|-a0 -b0 -90|010102|1BWg0 1qM0 WM0 17V0 7zD0|66e2",
			"Asia/Krasnoyarsk|+07 +08|-70 -80|01010|1BWj0 1qM0 WM0 8Hz0|10e5",
			"Asia/Kuala_Lumpur|MYT|-80|0||71e5",
			"Asia/Magadan|+11 +12 +10|-b0 -c0 -a0|010120|1BWf0 1qM0 WM0 8Hz0 3Cq0|95e3",
			"Asia/Makassar|WITA|-80|0||15e5",
			"Asia/Manila|PHT|-80|0||24e6",
			"Europe/Athens|EET EEST|-20 -30|01010101010101010101010|1BWp0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|35e5",
			"Asia/Novokuznetsk|+07 +06|-70 -60|010|1Dp80 WM0|55e4",
			"Asia/Novosibirsk|+06 +07|-60 -70|010101|1BWk0 1qM0 WM0 8Hz0 4eN0|15e5",
			"Asia/Omsk|+06 +07|-60 -70|01010|1BWk0 1qM0 WM0 8Hz0|12e5",
			"Asia/Pyongyang|KST KST|-90 -8u|01|1P4D0|29e5",
			"Asia/Rangoon|MMT|-6u|0||48e5",
			"Asia/Sakhalin|+10 +11|-a0 -b0|010101|1BWg0 1qM0 WM0 8Hz0 3rd0|58e4",
			"Asia/Seoul|KST|-90|0||23e6",
			"Asia/Singapore|SGT|-80|0||56e5",
			"Asia/Srednekolymsk|+11 +12|-b0 -c0|01010|1BWf0 1qM0 WM0 8Hz0|35e2",
			"Asia/Tbilisi|+04|-40|0||11e5",
			"Asia/Tehran|IRST IRDT|-3u -4u|01010101010101010101010|1BTUu 1dz0 1cp0 1dz0 1cp0 1dz0 1cN0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cN0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0|14e6",
			"Asia/Thimphu|BTT|-60|0||79e3",
			"Asia/Tokyo|JST|-90|0||38e6",
			"Asia/Tomsk|+06 +07|-60 -70|010101|1BWk0 1qM0 WM0 8Hz0 3Qp0|10e5",
			"Asia/Ulaanbaatar|ULAT ULAST|-80 -90|0101010101010|1O8G0 1cJ0 1cP0 1cJ0 1cP0 1fx0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1cJ0|12e5",
			"Asia/Ust-Nera|+11 +12 +10|-b0 -c0 -a0|010102|1BWf0 1qM0 WM0 17V0 7zD0|65e2",
			"Asia/Vladivostok|+10 +11|-a0 -b0|01010|1BWg0 1qM0 WM0 8Hz0|60e4",
			"Asia/Yakutsk|+09 +10|-90 -a0|01010|1BWh0 1qM0 WM0 8Hz0|28e4",
			"Asia/Yekaterinburg|+05 +06|-50 -60|01010|1BWl0 1qM0 WM0 8Hz0|14e5",
			"Asia/Yerevan|+04 +05|-40 -50|01010|1BWm0 1qM0 WM0 1qM0|13e5",
			"Atlantic/Azores|AZOT AZOST|10 0|01010101010101010101010|1BWp0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|25e4",
			"Europe/Lisbon|WET WEST|0 -10|01010101010101010101010|1BWp0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|27e5",
			"Atlantic/Cape_Verde|CVT|10|0||50e4",
			"Atlantic/South_Georgia|GST|20|0||30",
			"Atlantic/Stanley|FKST FKT|30 40|010|1C6R0 U10|21e2",
			"Australia/Sydney|AEDT AEST|-b0 -a0|01010101010101010101010|1C140 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0|40e5",
			"Australia/Adelaide|ACDT ACST|-au -9u|01010101010101010101010|1C14u 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0|11e5",
			"Australia/Brisbane|AEST|-a0|0||20e5",
			"Australia/Darwin|ACST|-9u|0||12e4",
			"Australia/Eucla|ACWST|-8J|0||368",
			"Australia/Lord_Howe|LHDT LHST|-b0 -au|01010101010101010101010|1C130 1cMu 1cLu 1cMu 1cLu 1fAu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1fAu 1cLu 1cMu 1cLu 1cMu|347",
			"Australia/Perth|AWST|-80|0||18e5",
			"Pacific/Easter|EASST EAST|50 60|010101010101010101010|1C1f0 1fB0 1nX0 G10 1EL0 Op0 1zb0 Rd0 1wn0 Rd0 46n0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0|30e2",
			"Europe/Dublin|GMT IST|0 -10|01010101010101010101010|1BWp0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|12e5",
			"Etc/GMT+1|-01|10|0|",
			"Etc/GMT+10|-10|a0|0|",
			"Etc/GMT+11|-11|b0|0|",
			"Etc/GMT+12|-12|c0|0|",
			"Etc/GMT+2|-02|20|0|",
			"Etc/GMT+4|-04|40|0|",
			"Etc/GMT+5|-05|50|0|",
			"Etc/GMT+6|-06|60|0|",
			"Etc/GMT+7|-07|70|0|",
			"Etc/GMT+8|-08|80|0|",
			"Etc/GMT+9|-09|90|0|",
			"Etc/GMT-1|+01|-10|0|",
			"Etc/GMT-11|+11|-b0|0|",
			"Etc/GMT-12|+12|-c0|0|",
			"Etc/GMT-13|+13|-d0|0|",
			"Etc/GMT-14|+14|-e0|0|",
			"Etc/GMT-2|+02|-20|0|",
			"Etc/GMT-7|+07|-70|0|",
			"Etc/GMT-8|+08|-80|0|",
			"Etc/GMT-9|+09|-90|0|",
			"Etc/UCT|UCT|0|0|",
			"Etc/UTC|UTC|0|0|",
			"Europe/Astrakhan|+03 +04|-30 -40|010101|1BWn0 1qM0 WM0 8Hz0 3rd0",
			"Europe/London|GMT BST|0 -10|01010101010101010101010|1BWp0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|10e6",
			"Europe/Chisinau|EET EEST|-20 -30|01010101010101010101010|1BWo0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|67e4",
			"Europe/Kaliningrad|EET EEST +03|-20 -30 -30|01020|1BWo0 1qM0 WM0 8Hz0|44e4",
			"Europe/Volgograd|+03 +04|-30 -40|01010|1BWn0 1qM0 WM0 8Hz0|10e5",
			"Europe/Minsk|EET EEST +03|-20 -30 -30|0102|1BWo0 1qM0 WM0|19e5",
			"Europe/Moscow|MSK MSD MSK|-30 -40 -40|01020|1BWn0 1qM0 WM0 8Hz0|16e6",
			"Europe/Samara|+04 +03|-40 -30|010|1Dpb0 WM0|12e5",
			"Europe/Saratov|+03 +04|-30 -40|010101|1BWn0 1qM0 WM0 8Hz0 5810",
			"Europe/Simferopol|EET EEST MSK MSK|-20 -30 -40 -30|01010101023|1BWp0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11z0 1nW0|33e4",
			"Pacific/Honolulu|HST|a0|0||37e4",
			"Indian/Chagos|IOT|-60|0||30e2",
			"Indian/Christmas|CXT|-70|0||21e2",
			"Indian/Cocos|CCT|-6u|0||596",
			"Indian/Mahe|SCT|-40|0||79e3",
			"Indian/Maldives|MVT|-50|0||35e4",
			"Indian/Mauritius|MUT|-40|0||15e4",
			"Indian/Reunion|RET|-40|0||84e4",
			"Pacific/Majuro|MHT|-c0|0||28e3",
			"MET|MET MEST|-10 -20|01010101010101010101010|1BWp0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00",
			"Pacific/Chatham|CHADT CHAST|-dJ -cJ|01010101010101010101010|1C120 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00|600",
			"Pacific/Apia|SST SDT WSDT WSST|b0 a0 -e0 -d0|01012323232323232323232|1Dbn0 1ff0 1a00 CI0 AQ0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00|37e3",
			"Pacific/Bougainville|PGT BST|-a0 -b0|01|1NwE0|18e4",
			"Pacific/Chuuk|CHUT|-a0|0||49e3",
			"Pacific/Efate|VUT|-b0|0||66e3",
			"Pacific/Enderbury|PHOT|-d0|0||1",
			"Pacific/Fakaofo|TKT TKT|b0 -d0|01|1Gfn0|483",
			"Pacific/Fiji|FJST FJT|-d0 -c0|01010101010101010101010|1BWe0 1o00 Rc0 1wo0 Ao0 1Nc0 Ao0 1Q00 xz0 1SN0 uM0 1SM0 uM0 1VA0 s00 1VA0 uM0 1SM0 uM0 1SM0 uM0 1SM0|88e4",
			"Pacific/Funafuti|TVT|-c0|0||45e2",
			"Pacific/Galapagos|GALT|60|0||25e3",
			"Pacific/Gambier|GAMT|90|0||125",
			"Pacific/Guadalcanal|SBT|-b0|0||11e4",
			"Pacific/Guam|ChST|-a0|0||17e4",
			"Pacific/Kiritimati|LINT|-e0|0||51e2",
			"Pacific/Kosrae|KOST|-b0|0||66e2",
			"Pacific/Marquesas|MART|9u|0||86e2",
			"Pacific/Pago_Pago|SST|b0|0||37e2",
			"Pacific/Nauru|NRT|-c0|0||10e3",
			"Pacific/Niue|NUT|b0|0||12e2",
			"Pacific/Norfolk|NFT NFT|-bu -b0|01|1PoCu|25e4",
			"Pacific/Noumea|NCT|-b0|0||98e3",
			"Pacific/Palau|PWT|-90|0||21e3",
			"Pacific/Pitcairn|PST|80|0||56",
			"Pacific/Pohnpei|PONT|-b0|0||34e3",
			"Pacific/Port_Moresby|PGT|-a0|0||25e4",
			"Pacific/Rarotonga|CKT|a0|0||13e3",
			"Pacific/Tahiti|TAHT|a0|0||18e4",
			"Pacific/Tarawa|GILT|-c0|0||29e3",
			"Pacific/Tongatapu|+13 +14|-d0 -e0|0101010101|1S4d0 s00 1VA0 uM0 1SM0 uM0 1SM0 uM0 1SM0|75e3",
			"Pacific/Wake|WAKT|-c0|0||16e3",
			"Pacific/Wallis|WFT|-c0|0||94"
		],
		"links": [
			"Africa/Abidjan|Africa/Accra",
			"Africa/Abidjan|Africa/Bamako",
			"Africa/Abidjan|Africa/Banjul",
			"Africa/Abidjan|Africa/Bissau",
			"Africa/Abidjan|Africa/Conakry",
			"Africa/Abidjan|Africa/Dakar",
			"Africa/Abidjan|Africa/Freetown",
			"Africa/Abidjan|Africa/Lome",
			"Africa/Abidjan|Africa/Monrovia",
			"Africa/Abidjan|Africa/Nouakchott",
			"Africa/Abidjan|Africa/Ouagadougou",
			"Africa/Abidjan|Africa/Sao_Tome",
			"Africa/Abidjan|Africa/Timbuktu",
			"Africa/Abidjan|America/Danmarkshavn",
			"Africa/Abidjan|Atlantic/Reykjavik",
			"Africa/Abidjan|Atlantic/St_Helena",
			"Africa/Abidjan|Etc/GMT",
			"Africa/Abidjan|Etc/GMT+0",
			"Africa/Abidjan|Etc/GMT-0",
			"Africa/Abidjan|Etc/GMT0",
			"Africa/Abidjan|Etc/Greenwich",
			"Africa/Abidjan|GMT",
			"Africa/Abidjan|GMT+0",
			"Africa/Abidjan|GMT-0",
			"Africa/Abidjan|GMT0",
			"Africa/Abidjan|Greenwich",
			"Africa/Abidjan|Iceland",
			"Africa/Algiers|Africa/Tunis",
			"Africa/Cairo|Egypt",
			"Africa/Casablanca|Africa/El_Aaiun",
			"Africa/Johannesburg|Africa/Maseru",
			"Africa/Johannesburg|Africa/Mbabane",
			"Africa/Khartoum|Africa/Addis_Ababa",
			"Africa/Khartoum|Africa/Asmara",
			"Africa/Khartoum|Africa/Asmera",
			"Africa/Khartoum|Africa/Dar_es_Salaam",
			"Africa/Khartoum|Africa/Djibouti",
			"Africa/Khartoum|Africa/Juba",
			"Africa/Khartoum|Africa/Kampala",
			"Africa/Khartoum|Africa/Mogadishu",
			"Africa/Khartoum|Africa/Nairobi",
			"Africa/Khartoum|Indian/Antananarivo",
			"Africa/Khartoum|Indian/Comoro",
			"Africa/Khartoum|Indian/Mayotte",
			"Africa/Lagos|Africa/Bangui",
			"Africa/Lagos|Africa/Brazzaville",
			"Africa/Lagos|Africa/Douala",
			"Africa/Lagos|Africa/Kinshasa",
			"Africa/Lagos|Africa/Libreville",
			"Africa/Lagos|Africa/Luanda",
			"Africa/Lagos|Africa/Malabo",
			"Africa/Lagos|Africa/Ndjamena",
			"Africa/Lagos|Africa/Niamey",
			"Africa/Lagos|Africa/Porto-Novo",
			"Africa/Maputo|Africa/Blantyre",
			"Africa/Maputo|Africa/Bujumbura",
			"Africa/Maputo|Africa/Gaborone",
			"Africa/Maputo|Africa/Harare",
			"Africa/Maputo|Africa/Kigali",
			"Africa/Maputo|Africa/Lubumbashi",
			"Africa/Maputo|Africa/Lusaka",
			"Africa/Tripoli|Libya",
			"America/Adak|America/Atka",
			"America/Adak|US/Aleutian",
			"America/Anchorage|America/Juneau",
			"America/Anchorage|America/Nome",
			"America/Anchorage|America/Sitka",
			"America/Anchorage|America/Yakutat",
			"America/Anchorage|US/Alaska",
			"America/Argentina/Buenos_Aires|America/Argentina/Catamarca",
			"America/Argentina/Buenos_Aires|America/Argentina/ComodRivadavia",
			"America/Argentina/Buenos_Aires|America/Argentina/Cordoba",
			"America/Argentina/Buenos_Aires|America/Argentina/Jujuy",
			"America/Argentina/Buenos_Aires|America/Argentina/La_Rioja",
			"America/Argentina/Buenos_Aires|America/Argentina/Mendoza",
			"America/Argentina/Buenos_Aires|America/Argentina/Rio_Gallegos",
			"America/Argentina/Buenos_Aires|America/Argentina/Salta",
			"America/Argentina/Buenos_Aires|America/Argentina/San_Juan",
			"America/Argentina/Buenos_Aires|America/Argentina/San_Luis",
			"America/Argentina/Buenos_Aires|America/Argentina/Tucuman",
			"America/Argentina/Buenos_Aires|America/Argentina/Ushuaia",
			"America/Argentina/Buenos_Aires|America/Buenos_Aires",
			"America/Argentina/Buenos_Aires|America/Catamarca",
			"America/Argentina/Buenos_Aires|America/Cordoba",
			"America/Argentina/Buenos_Aires|America/Jujuy",
			"America/Argentina/Buenos_Aires|America/Mendoza",
			"America/Argentina/Buenos_Aires|America/Rosario",
			"America/Campo_Grande|America/Cuiaba",
			"America/Chicago|America/Indiana/Knox",
			"America/Chicago|America/Indiana/Tell_City",
			"America/Chicago|America/Knox_IN",
			"America/Chicago|America/Matamoros",
			"America/Chicago|America/Menominee",
			"America/Chicago|America/North_Dakota/Center",
			"America/Chicago|America/North_Dakota/New_Salem",
			"America/Chicago|America/Rainy_River",
			"America/Chicago|America/Rankin_Inlet",
			"America/Chicago|America/Resolute",
			"America/Chicago|America/Winnipeg",
			"America/Chicago|CST6CDT",
			"America/Chicago|Canada/Central",
			"America/Chicago|US/Central",
			"America/Chicago|US/Indiana-Starke",
			"America/Chihuahua|America/Mazatlan",
			"America/Chihuahua|Mexico/BajaSur",
			"America/Denver|America/Boise",
			"America/Denver|America/Cambridge_Bay",
			"America/Denver|America/Edmonton",
			"America/Denver|America/Inuvik",
			"America/Denver|America/Ojinaga",
			"America/Denver|America/Shiprock",
			"America/Denver|America/Yellowknife",
			"America/Denver|Canada/Mountain",
			"America/Denver|MST7MDT",
			"America/Denver|Navajo",
			"America/Denver|US/Mountain",
			"America/Fortaleza|America/Belem",
			"America/Fortaleza|America/Maceio",
			"America/Fortaleza|America/Recife",
			"America/Fortaleza|America/Santarem",
			"America/Halifax|America/Glace_Bay",
			"America/Halifax|America/Moncton",
			"America/Halifax|America/Thule",
			"America/Halifax|Atlantic/Bermuda",
			"America/Halifax|Canada/Atlantic",
			"America/Havana|Cuba",
			"America/Los_Angeles|America/Dawson",
			"America/Los_Angeles|America/Ensenada",
			"America/Los_Angeles|America/Santa_Isabel",
			"America/Los_Angeles|America/Tijuana",
			"America/Los_Angeles|America/Vancouver",
			"America/Los_Angeles|America/Whitehorse",
			"America/Los_Angeles|Canada/Pacific",
			"America/Los_Angeles|Canada/Yukon",
			"America/Los_Angeles|Mexico/BajaNorte",
			"America/Los_Angeles|PST8PDT",
			"America/Los_Angeles|US/Pacific",
			"America/Los_Angeles|US/Pacific-New",
			"America/Managua|America/Belize",
			"America/Managua|America/Costa_Rica",
			"America/Managua|America/El_Salvador",
			"America/Managua|America/Guatemala",
			"America/Managua|America/Regina",
			"America/Managua|America/Swift_Current",
			"America/Managua|America/Tegucigalpa",
			"America/Managua|Canada/East-Saskatchewan",
			"America/Managua|Canada/Saskatchewan",
			"America/Manaus|America/Boa_Vista",
			"America/Manaus|America/Porto_Velho",
			"America/Manaus|Brazil/West",
			"America/Mexico_City|America/Merida",
			"America/Mexico_City|America/Monterrey",
			"America/Mexico_City|Mexico/General",
			"America/New_York|America/Detroit",
			"America/New_York|America/Fort_Wayne",
			"America/New_York|America/Indiana/Indianapolis",
			"America/New_York|America/Indiana/Marengo",
			"America/New_York|America/Indiana/Petersburg",
			"America/New_York|America/Indiana/Vevay",
			"America/New_York|America/Indiana/Vincennes",
			"America/New_York|America/Indiana/Winamac",
			"America/New_York|America/Indianapolis",
			"America/New_York|America/Iqaluit",
			"America/New_York|America/Kentucky/Louisville",
			"America/New_York|America/Kentucky/Monticello",
			"America/New_York|America/Louisville",
			"America/New_York|America/Montreal",
			"America/New_York|America/Nassau",
			"America/New_York|America/Nipigon",
			"America/New_York|America/Pangnirtung",
			"America/New_York|America/Thunder_Bay",
			"America/New_York|America/Toronto",
			"America/New_York|Canada/Eastern",
			"America/New_York|EST5EDT",
			"America/New_York|US/East-Indiana",
			"America/New_York|US/Eastern",
			"America/New_York|US/Michigan",
			"America/Noronha|Brazil/DeNoronha",
			"America/Panama|America/Atikokan",
			"America/Panama|America/Cayman",
			"America/Panama|America/Coral_Harbour",
			"America/Panama|America/Jamaica",
			"America/Panama|EST",
			"America/Panama|Jamaica",
			"America/Phoenix|America/Creston",
			"America/Phoenix|America/Dawson_Creek",
			"America/Phoenix|America/Hermosillo",
			"America/Phoenix|MST",
			"America/Phoenix|US/Arizona",
			"America/Rio_Branco|America/Eirunepe",
			"America/Rio_Branco|America/Porto_Acre",
			"America/Rio_Branco|Brazil/Acre",
			"America/Santiago|Antarctica/Palmer",
			"America/Santiago|Chile/Continental",
			"America/Santo_Domingo|America/Anguilla",
			"America/Santo_Domingo|America/Antigua",
			"America/Santo_Domingo|America/Aruba",
			"America/Santo_Domingo|America/Barbados",
			"America/Santo_Domingo|America/Blanc-Sablon",
			"America/Santo_Domingo|America/Curacao",
			"America/Santo_Domingo|America/Dominica",
			"America/Santo_Domingo|America/Grenada",
			"America/Santo_Domingo|America/Guadeloupe",
			"America/Santo_Domingo|America/Kralendijk",
			"America/Santo_Domingo|America/Lower_Princes",
			"America/Santo_Domingo|America/Marigot",
			"America/Santo_Domingo|America/Martinique",
			"America/Santo_Domingo|America/Montserrat",
			"America/Santo_Domingo|America/Port_of_Spain",
			"America/Santo_Domingo|America/Puerto_Rico",
			"America/Santo_Domingo|America/St_Barthelemy",
			"America/Santo_Domingo|America/St_Kitts",
			"America/Santo_Domingo|America/St_Lucia",
			"America/Santo_Domingo|America/St_Thomas",
			"America/Santo_Domingo|America/St_Vincent",
			"America/Santo_Domingo|America/Tortola",
			"America/Santo_Domingo|America/Virgin",
			"America/Sao_Paulo|Brazil/East",
			"America/St_Johns|Canada/Newfoundland",
			"Antarctica/DumontDUrville|Etc/GMT-10",
			"Antarctica/Rothera|Etc/GMT+3",
			"Antarctica/Syowa|Etc/GMT-3",
			"Asia/Almaty|Antarctica/Vostok",
			"Asia/Almaty|Asia/Bishkek",
			"Asia/Almaty|Asia/Qyzylorda",
			"Asia/Almaty|Etc/GMT-6",
			"Asia/Baghdad|Asia/Aden",
			"Asia/Baghdad|Asia/Bahrain",
			"Asia/Baghdad|Asia/Kuwait",
			"Asia/Baghdad|Asia/Qatar",
			"Asia/Baghdad|Asia/Riyadh",
			"Asia/Bangkok|Asia/Ho_Chi_Minh",
			"Asia/Bangkok|Asia/Phnom_Penh",
			"Asia/Bangkok|Asia/Saigon",
			"Asia/Bangkok|Asia/Vientiane",
			"Asia/Dhaka|Asia/Dacca",
			"Asia/Dubai|Asia/Muscat",
			"Asia/Hong_Kong|Hongkong",
			"Asia/Jakarta|Asia/Pontianak",
			"Asia/Jerusalem|Asia/Tel_Aviv",
			"Asia/Jerusalem|Israel",
			"Asia/Kamchatka|Asia/Anadyr",
			"Asia/Kathmandu|Asia/Katmandu",
			"Asia/Kolkata|Asia/Calcutta",
			"Asia/Kuala_Lumpur|Asia/Kuching",
			"Asia/Makassar|Asia/Ujung_Pandang",
			"Asia/Rangoon|Asia/Yangon",
			"Asia/Seoul|ROK",
			"Asia/Shanghai|Asia/Chongqing",
			"Asia/Shanghai|Asia/Chungking",
			"Asia/Shanghai|Asia/Harbin",
			"Asia/Shanghai|Asia/Macao",
			"Asia/Shanghai|Asia/Macau",
			"Asia/Shanghai|Asia/Taipei",
			"Asia/Shanghai|PRC",
			"Asia/Shanghai|ROC",
			"Asia/Singapore|Singapore",
			"Asia/Tashkent|Antarctica/Mawson",
			"Asia/Tashkent|Asia/Aqtau",
			"Asia/Tashkent|Asia/Aqtobe",
			"Asia/Tashkent|Asia/Ashgabat",
			"Asia/Tashkent|Asia/Ashkhabad",
			"Asia/Tashkent|Asia/Atyrau",
			"Asia/Tashkent|Asia/Dushanbe",
			"Asia/Tashkent|Asia/Oral",
			"Asia/Tashkent|Asia/Samarkand",
			"Asia/Tashkent|Etc/GMT-5",
			"Asia/Tashkent|Indian/Kerguelen",
			"Asia/Tbilisi|Etc/GMT-4",
			"Asia/Tehran|Iran",
			"Asia/Thimphu|Asia/Thimbu",
			"Asia/Tokyo|Japan",
			"Asia/Ulaanbaatar|Asia/Ulan_Bator",
			"Asia/Urumqi|Asia/Kashgar",
			"Australia/Adelaide|Australia/Broken_Hill",
			"Australia/Adelaide|Australia/South",
			"Australia/Adelaide|Australia/Yancowinna",
			"Australia/Brisbane|Australia/Lindeman",
			"Australia/Brisbane|Australia/Queensland",
			"Australia/Darwin|Australia/North",
			"Australia/Lord_Howe|Australia/LHI",
			"Australia/Perth|Australia/West",
			"Australia/Sydney|Australia/ACT",
			"Australia/Sydney|Australia/Canberra",
			"Australia/Sydney|Australia/Currie",
			"Australia/Sydney|Australia/Hobart",
			"Australia/Sydney|Australia/Melbourne",
			"Australia/Sydney|Australia/NSW",
			"Australia/Sydney|Australia/Tasmania",
			"Australia/Sydney|Australia/Victoria",
			"Etc/UCT|UCT",
			"Etc/UTC|Etc/Universal",
			"Etc/UTC|Etc/Zulu",
			"Etc/UTC|UTC",
			"Etc/UTC|Universal",
			"Etc/UTC|Zulu",
			"Europe/Astrakhan|Europe/Ulyanovsk",
			"Europe/Athens|Asia/Nicosia",
			"Europe/Athens|EET",
			"Europe/Athens|Europe/Bucharest",
			"Europe/Athens|Europe/Helsinki",
			"Europe/Athens|Europe/Kiev",
			"Europe/Athens|Europe/Mariehamn",
			"Europe/Athens|Europe/Nicosia",
			"Europe/Athens|Europe/Riga",
			"Europe/Athens|Europe/Sofia",
			"Europe/Athens|Europe/Tallinn",
			"Europe/Athens|Europe/Uzhgorod",
			"Europe/Athens|Europe/Vilnius",
			"Europe/Athens|Europe/Zaporozhye",
			"Europe/Chisinau|Europe/Tiraspol",
			"Europe/Dublin|Eire",
			"Europe/Istanbul|Asia/Istanbul",
			"Europe/Istanbul|Turkey",
			"Europe/Lisbon|Atlantic/Canary",
			"Europe/Lisbon|Atlantic/Faeroe",
			"Europe/Lisbon|Atlantic/Faroe",
			"Europe/Lisbon|Atlantic/Madeira",
			"Europe/Lisbon|Portugal",
			"Europe/Lisbon|WET",
			"Europe/London|Europe/Belfast",
			"Europe/London|Europe/Guernsey",
			"Europe/London|Europe/Isle_of_Man",
			"Europe/London|Europe/Jersey",
			"Europe/London|GB",
			"Europe/London|GB-Eire",
			"Europe/Moscow|W-SU",
			"Europe/Paris|Africa/Ceuta",
			"Europe/Paris|Arctic/Longyearbyen",
			"Europe/Paris|Atlantic/Jan_Mayen",
			"Europe/Paris|CET",
			"Europe/Paris|Europe/Amsterdam",
			"Europe/Paris|Europe/Andorra",
			"Europe/Paris|Europe/Belgrade",
			"Europe/Paris|Europe/Berlin",
			"Europe/Paris|Europe/Bratislava",
			"Europe/Paris|Europe/Brussels",
			"Europe/Paris|Europe/Budapest",
			"Europe/Paris|Europe/Busingen",
			"Europe/Paris|Europe/Copenhagen",
			"Europe/Paris|Europe/Gibraltar",
			"Europe/Paris|Europe/Ljubljana",
			"Europe/Paris|Europe/Luxembourg",
			"Europe/Paris|Europe/Madrid",
			"Europe/Paris|Europe/Malta",
			"Europe/Paris|Europe/Monaco",
			"Europe/Paris|Europe/Oslo",
			"Europe/Paris|Europe/Podgorica",
			"Europe/Paris|Europe/Prague",
			"Europe/Paris|Europe/Rome",
			"Europe/Paris|Europe/San_Marino",
			"Europe/Paris|Europe/Sarajevo",
			"Europe/Paris|Europe/Skopje",
			"Europe/Paris|Europe/Stockholm",
			"Europe/Paris|Europe/Tirane",
			"Europe/Paris|Europe/Vaduz",
			"Europe/Paris|Europe/Vatican",
			"Europe/Paris|Europe/Vienna",
			"Europe/Paris|Europe/Warsaw",
			"Europe/Paris|Europe/Zagreb",
			"Europe/Paris|Europe/Zurich",
			"Europe/Paris|Poland",
			"Europe/Volgograd|Europe/Kirov",
			"Pacific/Auckland|Antarctica/McMurdo",
			"Pacific/Auckland|Antarctica/South_Pole",
			"Pacific/Auckland|NZ",
			"Pacific/Chatham|NZ-CHAT",
			"Pacific/Chuuk|Pacific/Truk",
			"Pacific/Chuuk|Pacific/Yap",
			"Pacific/Easter|Chile/EasterIsland",
			"Pacific/Guam|Pacific/Saipan",
			"Pacific/Honolulu|HST",
			"Pacific/Honolulu|Pacific/Johnston",
			"Pacific/Honolulu|US/Hawaii",
			"Pacific/Majuro|Kwajalein",
			"Pacific/Majuro|Pacific/Kwajalein",
			"Pacific/Pago_Pago|Pacific/Midway",
			"Pacific/Pago_Pago|Pacific/Samoa",
			"Pacific/Pago_Pago|US/Samoa",
			"Pacific/Pohnpei|Pacific/Ponape"
		]
	});


	return moment;
}));

},{"moment":49}],46:[function(require,module,exports){
module.exports={
	"version": "2016j",
	"zones": [
		"Africa/Abidjan|LMT GMT|g.8 0|01|-2ldXH.Q|48e5",
		"Africa/Accra|LMT GMT GHST|.Q 0 -k|012121212121212121212121212121212121212121212121|-26BbX.8 6tzX.8 MnE 1BAk MnE 1BAk MnE 1BAk MnE 1C0k MnE 1BAk MnE 1BAk MnE 1BAk MnE 1C0k MnE 1BAk MnE 1BAk MnE 1BAk MnE 1C0k MnE 1BAk MnE 1BAk MnE 1BAk MnE 1C0k MnE 1BAk MnE 1BAk MnE 1BAk MnE 1C0k MnE 1BAk MnE 1BAk MnE|41e5",
		"Africa/Nairobi|LMT EAT BEAT BEAUT|-2r.g -30 -2u -2J|01231|-1F3Cr.g 3Dzr.g okMu MFXJ|47e5",
		"Africa/Algiers|PMT WET WEST CET CEST|-9.l 0 -10 -10 -20|0121212121212121343431312123431213|-2nco9.l cNb9.l HA0 19A0 1iM0 11c0 1oo0 Wo0 1rc0 QM0 1EM0 UM0 DA0 Imo0 rd0 De0 9Xz0 1fb0 1ap0 16K0 2yo0 mEp0 hwL0 jxA0 11A0 dDd0 17b0 11B0 1cN0 2Dy0 1cN0 1fB0 1cL0|26e5",
		"Africa/Lagos|LMT WAT|-d.A -10|01|-22y0d.A|17e6",
		"Africa/Bissau|LMT WAT GMT|12.k 10 0|012|-2ldWV.E 2xonV.E|39e4",
		"Africa/Maputo|LMT CAT|-2a.k -20|01|-2GJea.k|26e5",
		"Africa/Cairo|EET EEST|-20 -30|0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-1bIO0 vb0 1ip0 11z0 1iN0 1nz0 12p0 1pz0 10N0 1pz0 16p0 1jz0 s3d0 Vz0 1oN0 11b0 1oO0 10N0 1pz0 10N0 1pb0 10N0 1pb0 10N0 1pb0 10N0 1pz0 10N0 1pb0 10N0 1pb0 11d0 1oL0 11d0 1pb0 11d0 1oL0 11d0 1oL0 11d0 1oL0 11d0 1pb0 11d0 1oL0 11d0 1oL0 11d0 1oL0 11d0 1pb0 11d0 1oL0 11d0 1oL0 11d0 1oL0 11d0 1pb0 11d0 1oL0 11d0 1WL0 rd0 1Rz0 wp0 1pb0 11d0 1oL0 11d0 1oL0 11d0 1oL0 11d0 1pb0 11d0 1qL0 Xd0 1oL0 11d0 1oL0 11d0 1pb0 11d0 1oL0 11d0 1oL0 11d0 1ny0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 WL0 1qN0 Rb0 1wp0 On0 1zd0 Lz0 1EN0 Fb0 c10 8n0 8Nd0 gL0 e10 mn0|15e6",
		"Africa/Casablanca|LMT WET WEST CET|u.k 0 -10 -10|0121212121212121213121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2gMnt.E 130Lt.E rb0 Dd0 dVb0 b6p0 TX0 EoB0 LL0 gnd0 rz0 43d0 AL0 1Nd0 XX0 1Cp0 pz0 dEp0 4mn0 SyN0 AL0 1Nd0 wn0 1FB0 Db0 1zd0 Lz0 1Nf0 wM0 co0 go0 1o00 s00 dA0 vc0 11A0 A00 e00 y00 11A0 uM0 e00 Dc0 11A0 s00 e00 IM0 WM0 mo0 gM0 LA0 WM0 jA0 e00 Rc0 11A0 e00 e00 U00 11A0 8o0 e00 11A0 11A0 5A0 e00 17c0 1fA0 1a00 1a00 1fA0 17c0 1io0 14o0 1lc0 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1lc0 14o0 1fA0|32e5",
		"Africa/Ceuta|WET WEST CET CEST|0 -10 -10 -20|010101010101010101010232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232|-25KN0 11z0 drd0 18o0 3I00 17c0 1fA0 1a00 1io0 1a00 1y7p0 LL0 gnd0 rz0 43d0 AL0 1Nd0 XX0 1Cp0 pz0 dEp0 4VB0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|85e3",
		"Africa/El_Aaiun|LMT WAT WET WEST|Q.M 10 0 -10|01232323232323232323232323232323232323232323232323232323232323232323232323232323232323232|-1rDz7.c 1GVA7.c 6L0 AL0 1Nd0 XX0 1Cp0 pz0 1cBB0 AL0 1Nd0 wn0 1FB0 Db0 1zd0 Lz0 1Nf0 wM0 co0 go0 1o00 s00 dA0 vc0 11A0 A00 e00 y00 11A0 uM0 e00 Dc0 11A0 s00 e00 IM0 WM0 mo0 gM0 LA0 WM0 jA0 e00 Rc0 11A0 e00 e00 U00 11A0 8o0 e00 11A0 11A0 5A0 e00 17c0 1fA0 1a00 1a00 1fA0 17c0 1io0 14o0 1lc0 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1lc0 14o0 1fA0|20e4",
		"Africa/Johannesburg|SAST SAST SAST|-1u -20 -30|012121|-2GJdu 1Ajdu 1cL0 1cN0 1cL0|84e5",
		"Africa/Khartoum|LMT CAT CAST EAT|-2a.8 -20 -30 -30|01212121212121212121212121212121213|-1yW2a.8 1zK0a.8 16L0 1iN0 17b0 1jd0 17b0 1ip0 17z0 1i10 17X0 1hB0 18n0 1hd0 19b0 1gp0 19z0 1iN0 17b0 1ip0 17z0 1i10 18n0 1hd0 18L0 1gN0 19b0 1gp0 19z0 1iN0 17z0 1i10 17X0 yGd0|51e5",
		"Africa/Monrovia|MMT LRT GMT|H.8 I.u 0|012|-23Lzg.Q 29s01.m|11e5",
		"Africa/Ndjamena|LMT WAT WAST|-10.c -10 -20|0121|-2le10.c 2J3c0.c Wn0|13e5",
		"Africa/Tripoli|LMT CET CEST EET|-Q.I -10 -20 -20|012121213121212121212121213123123|-21JcQ.I 1hnBQ.I vx0 4iP0 xx0 4eN0 Bb0 7ip0 U0n0 A10 1db0 1cN0 1db0 1dd0 1db0 1eN0 1bb0 1e10 1cL0 1c10 1db0 1dd0 1db0 1cN0 1db0 1q10 fAn0 1ep0 1db0 AKq0 TA0 1o00|11e5",
		"Africa/Tunis|PMT CET CEST|-9.l -10 -20|0121212121212121212121212121212121|-2nco9.l 18pa9.l 1qM0 DA0 3Tc0 11B0 1ze0 WM0 7z0 3d0 14L0 1cN0 1f90 1ar0 16J0 1gXB0 WM0 1rA0 11c0 nwo0 Ko0 1cM0 1cM0 1rA0 10M0 zuM0 10N0 1aN0 1qM0 WM0 1qM0 11A0 1o00|20e5",
		"Africa/Windhoek|SWAT SAST SAST CAT WAT WAST|-1u -20 -30 -20 -10 -20|012134545454545454545454545454545454545454545454545454545454545454545454545454545454545454545|-2GJdu 1Ajdu 1cL0 1SqL0 9NA0 11D0 1nX0 11B0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 11B0 1nX0 11B0|32e4",
		"America/Adak|NST NWT NPT BST BDT AHST HST HDT|b0 a0 a0 b0 a0 a0 a0 90|012034343434343434343434343434343456767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676|-17SX0 8wW0 iB0 Qlb0 52O0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 cm0 10q0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|326",
		"America/Anchorage|CAT CAWT CAPT AHST AHDT YST AKST AKDT|a0 90 90 a0 90 90 90 80|012034343434343434343434343434343456767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676|-17T00 8wX0 iA0 Qlb0 52O0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 cm0 10q0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|30e4",
		"America/Port_of_Spain|LMT AST|46.4 40|01|-2kNvR.U|43e3",
		"America/Araguaina|LMT BRT BRST|3c.M 30 20|0121212121212121212121212121212121212121212121212121|-2glwL.c HdKL.c 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 1EN0 FX0 1HB0 Lz0 dMN0 Lz0 1zd0 Rb0 1wN0 Wn0 1tB0 Rb0 1tB0 WL0 1tB0 Rb0 1zd0 On0 1HB0 FX0 ny10 Lz0|14e4",
		"America/Argentina/Buenos_Aires|CMT ART ARST ART ARST|4g.M 40 30 30 20|0121212121212121212121212121212121212121213434343434343234343|-20UHH.c pKnH.c Mn0 1iN0 Tb0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 MN0 2jz0 MN0 4lX0 u10 5Lb0 1pB0 Fnz0 u10 uL0 1vd0 SL0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 zvd0 Bz0 1tB0 TX0 1wp0 Rb0 1wp0 Rb0 1wp0 TX0 g0p0 10M0 j3c0 uL0 1qN0 WL0",
		"America/Argentina/Catamarca|CMT ART ARST ART ARST WART|4g.M 40 30 30 20 40|0121212121212121212121212121212121212121213434343454343235343|-20UHH.c pKnH.c Mn0 1iN0 Tb0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 MN0 2jz0 MN0 4lX0 u10 5Lb0 1pB0 Fnz0 u10 uL0 1vd0 SL0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 zvd0 Bz0 1tB0 TX0 1wp0 Rb0 1wq0 Ra0 1wp0 TX0 g0p0 10M0 ako0 7B0 8zb0 uL0",
		"America/Argentina/Cordoba|CMT ART ARST ART ARST WART|4g.M 40 30 30 20 40|0121212121212121212121212121212121212121213434343454343234343|-20UHH.c pKnH.c Mn0 1iN0 Tb0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 MN0 2jz0 MN0 4lX0 u10 5Lb0 1pB0 Fnz0 u10 uL0 1vd0 SL0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 zvd0 Bz0 1tB0 TX0 1wp0 Rb0 1wq0 Ra0 1wp0 TX0 g0p0 10M0 j3c0 uL0 1qN0 WL0",
		"America/Argentina/Jujuy|CMT ART ARST ART ARST WART WARST|4g.M 40 30 30 20 40 30|01212121212121212121212121212121212121212134343456543432343|-20UHH.c pKnH.c Mn0 1iN0 Tb0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 MN0 2jz0 MN0 4lX0 u10 5Lb0 1pB0 Fnz0 u10 uL0 1vd0 SL0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 zvd0 Bz0 1tB0 TX0 1ze0 TX0 1ld0 WK0 1wp0 TX0 g0p0 10M0 j3c0 uL0",
		"America/Argentina/La_Rioja|CMT ART ARST ART ARST WART|4g.M 40 30 30 20 40|01212121212121212121212121212121212121212134343434534343235343|-20UHH.c pKnH.c Mn0 1iN0 Tb0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 MN0 2jz0 MN0 4lX0 u10 5Lb0 1pB0 Fnz0 u10 uL0 1vd0 SL0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 zvd0 Bz0 1tB0 TX0 1wp0 Qn0 qO0 16n0 Rb0 1wp0 TX0 g0p0 10M0 ako0 7B0 8zb0 uL0",
		"America/Argentina/Mendoza|CMT ART ARST ART ARST WART WARST|4g.M 40 30 30 20 40 30|0121212121212121212121212121212121212121213434345656543235343|-20UHH.c pKnH.c Mn0 1iN0 Tb0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 MN0 2jz0 MN0 4lX0 u10 5Lb0 1pB0 Fnz0 u10 uL0 1vd0 SL0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 zvd0 Bz0 1tB0 TX0 1u20 SL0 1vd0 Tb0 1wp0 TW0 g0p0 10M0 agM0 Op0 7TX0 uL0",
		"America/Argentina/Rio_Gallegos|CMT ART ARST ART ARST WART|4g.M 40 30 30 20 40|0121212121212121212121212121212121212121213434343434343235343|-20UHH.c pKnH.c Mn0 1iN0 Tb0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 MN0 2jz0 MN0 4lX0 u10 5Lb0 1pB0 Fnz0 u10 uL0 1vd0 SL0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 zvd0 Bz0 1tB0 TX0 1wp0 Rb0 1wp0 Rb0 1wp0 TX0 g0p0 10M0 ako0 7B0 8zb0 uL0",
		"America/Argentina/Salta|CMT ART ARST ART ARST WART|4g.M 40 30 30 20 40|01212121212121212121212121212121212121212134343434543432343|-20UHH.c pKnH.c Mn0 1iN0 Tb0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 MN0 2jz0 MN0 4lX0 u10 5Lb0 1pB0 Fnz0 u10 uL0 1vd0 SL0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 zvd0 Bz0 1tB0 TX0 1wp0 Rb0 1wq0 Ra0 1wp0 TX0 g0p0 10M0 j3c0 uL0",
		"America/Argentina/San_Juan|CMT ART ARST ART ARST WART|4g.M 40 30 30 20 40|01212121212121212121212121212121212121212134343434534343235343|-20UHH.c pKnH.c Mn0 1iN0 Tb0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 MN0 2jz0 MN0 4lX0 u10 5Lb0 1pB0 Fnz0 u10 uL0 1vd0 SL0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 zvd0 Bz0 1tB0 TX0 1wp0 Qn0 qO0 16n0 Rb0 1wp0 TX0 g0p0 10M0 ak00 m10 8lb0 uL0",
		"America/Argentina/San_Luis|CMT ART ARST ART ARST WART WARST|4g.M 40 30 30 20 40 30|01212121212121212121212121212121212121212134343456536353465653|-20UHH.c pKnH.c Mn0 1iN0 Tb0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 MN0 2jz0 MN0 4lX0 u10 5Lb0 1pB0 Fnz0 u10 uL0 1vd0 SL0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 zvd0 Bz0 1tB0 XX0 1q20 SL0 AN0 kin0 10M0 ak00 m10 8lb0 8L0 jd0 1qN0 WL0 1qN0",
		"America/Argentina/Tucuman|CMT ART ARST ART ARST WART|4g.M 40 30 30 20 40|012121212121212121212121212121212121212121343434345434323534343|-20UHH.c pKnH.c Mn0 1iN0 Tb0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 MN0 2jz0 MN0 4lX0 u10 5Lb0 1pB0 Fnz0 u10 uL0 1vd0 SL0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 zvd0 Bz0 1tB0 TX0 1wp0 Rb0 1wq0 Ra0 1wp0 TX0 g0p0 10M0 ako0 4N0 8BX0 uL0 1qN0 WL0",
		"America/Argentina/Ushuaia|CMT ART ARST ART ARST WART|4g.M 40 30 30 20 40|0121212121212121212121212121212121212121213434343434343235343|-20UHH.c pKnH.c Mn0 1iN0 Tb0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 MN0 2jz0 MN0 4lX0 u10 5Lb0 1pB0 Fnz0 u10 uL0 1vd0 SL0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 zvd0 Bz0 1tB0 TX0 1wp0 Rb0 1wp0 Rb0 1wp0 TX0 g0p0 10M0 ajA0 8p0 8zb0 uL0",
		"America/Curacao|LMT ANT AST|4z.L 4u 40|012|-2kV7o.d 28KLS.d|15e4",
		"America/Asuncion|AMT PYT PYT PYST|3O.E 40 30 30|012131313131313131313131313131313131313131313131313131313131313131313131313131313131313131313131313131313131313131313131313131313|-1x589.k 1DKM9.k 3CL0 3Dd0 10L0 1pB0 10n0 1pB0 10n0 1pB0 1cL0 1dd0 1db0 1dd0 1cL0 1dd0 1cL0 1dd0 1cL0 1dd0 1db0 1dd0 1cL0 1dd0 1cL0 1dd0 1cL0 1dd0 1db0 1dd0 1cL0 1lB0 14n0 1dd0 1cL0 1fd0 WL0 1rd0 1aL0 1dB0 Xz0 1qp0 Xb0 1qN0 10L0 1rB0 TX0 1tB0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1qN0 1cL0 WN0 1qL0 11B0 1nX0 1ip0 WL0 1qN0 WL0 1qN0 WL0 1tB0 TX0 1tB0 TX0 1tB0 19X0 1a10 1fz0 1a10 1fz0 1cN0 17b0 1ip0 17b0 1ip0 17b0 1ip0 19X0 1fB0 19X0 1fB0 19X0 1ip0 17b0 1ip0 17b0 1ip0 19X0 1fB0 19X0 1fB0 19X0 1fB0 19X0 1ip0 17b0 1ip0 17b0 1ip0 19X0 1fB0 19X0 1fB0 19X0 1ip0 17b0 1ip0 17b0 1ip0 19X0 1fB0 19X0 1fB0 19X0 1fB0 19X0 1ip0 17b0 1ip0 17b0 1ip0|28e5",
		"America/Atikokan|CST CDT CWT CPT EST|60 50 50 50 50|0101234|-25TQ0 1in0 Rnb0 3je0 8x30 iw0|28e2",
		"America/Bahia|LMT BRT BRST|2y.4 30 20|01212121212121212121212121212121212121212121212121212121212121|-2glxp.U HdLp.U 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 1EN0 FX0 1HB0 Lz0 1EN0 Lz0 1C10 IL0 1HB0 Db0 1HB0 On0 1zd0 On0 1zd0 Lz0 1zd0 Rb0 1wN0 Wn0 1tB0 Rb0 1tB0 WL0 1tB0 Rb0 1zd0 On0 1HB0 FX0 l5B0 Rb0|27e5",
		"America/Bahia_Banderas|LMT MST CST PST MDT CDT|71 70 60 80 60 50|0121212131414141414141414141414141414152525252525252525252525252525252525252525252525252525252|-1UQF0 deL0 8lc0 17c0 10M0 1dd0 otX0 gmN0 P2N0 13Vd0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 1fB0 WL0 1fB0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nW0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0|84e3",
		"America/Barbados|LMT BMT AST ADT|3W.t 3W.t 40 30|01232323232|-1Q0I1.v jsM0 1ODC1.v IL0 1ip0 17b0 1ip0 17b0 1ld0 13b0|28e4",
		"America/Belem|LMT BRT BRST|3d.U 30 20|012121212121212121212121212121|-2glwK.4 HdKK.4 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0|20e5",
		"America/Belize|LMT CST CHDT CDT|5Q.M 60 5u 50|01212121212121212121212121212121212121212121212121213131|-2kBu7.c fPA7.c Onu 1zcu Rbu 1wou Rbu 1wou Rbu 1zcu Onu 1zcu Onu 1zcu Rbu 1wou Rbu 1wou Rbu 1wou Rbu 1zcu Onu 1zcu Onu 1zcu Rbu 1wou Rbu 1wou Rbu 1zcu Onu 1zcu Onu 1zcu Onu 1zcu Rbu 1wou Rbu 1wou Rbu 1zcu Onu 1zcu Onu 1zcu Rbu 1wou Rbu 1f0Mu qn0 lxB0 mn0|57e3",
		"America/Blanc-Sablon|AST ADT AWT APT|40 30 30 30|010230|-25TS0 1in0 UGp0 8x50 iu0|11e2",
		"America/Boa_Vista|LMT AMT AMST|42.E 40 30|0121212121212121212121212121212121|-2glvV.k HdKV.k 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 smp0 WL0 1tB0 2L0|62e2",
		"America/Bogota|BMT COT COST|4U.g 50 40|0121|-2eb73.I 38yo3.I 2en0|90e5",
		"America/Boise|PST PDT MST MWT MPT MDT|80 70 70 60 60 60|0101023425252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252|-261q0 1nX0 11B0 1nX0 8C10 JCL0 8x20 ix0 QwN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 Dd0 1Kn0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|21e4",
		"America/Cambridge_Bay|-00 MST MWT MPT MDDT MDT CST CDT EST|0 70 60 60 50 60 60 50 50|0123141515151515151515151515151515151515151515678651515151515151515151515151515151515151515151515151515151515151515151515151|-21Jc0 RO90 8x20 ix0 LCL0 1fA0 zgO0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11A0 1nX0 2K0 WQ0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|15e2",
		"America/Campo_Grande|LMT AMT AMST|3C.s 40 30|012121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212|-2glwl.w HdLl.w 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 1EN0 FX0 1HB0 Lz0 1EN0 Lz0 1C10 IL0 1HB0 Db0 1HB0 On0 1zd0 On0 1zd0 Lz0 1zd0 Rb0 1wN0 Wn0 1tB0 Rb0 1tB0 WL0 1tB0 Rb0 1zd0 On0 1HB0 FX0 1C10 Lz0 1Ip0 HX0 1zd0 On0 1HB0 IL0 1wp0 On0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 Rb0 1zd0 Lz0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 On0 1zd0 On0 1C10 Lz0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 Rb0 1wp0 On0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 On0 1zd0 On0 1C10 Lz0 1C10 Lz0 1C10 Lz0 1C10 On0 1zd0 Rb0 1wp0 On0 1C10 Lz0 1C10 On0 1zd0|77e4",
		"America/Cancun|LMT CST EST EDT CDT|5L.4 60 50 40 50|0123232341414141414141414141414141414141412|-1UQG0 2q2o0 yLB0 1lb0 14p0 1lb0 14p0 Lz0 xB0 14p0 1nX0 11B0 1nX0 1fB0 WL0 1fB0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 Dd0|63e4",
		"America/Caracas|CMT VET VET|4r.E 4u 40|01212|-2kV7w.k 28KM2.k 1IwOu kqo0|29e5",
		"America/Cayenne|LMT GFT GFT|3t.k 40 30|012|-2mrwu.E 2gWou.E|58e3",
		"America/Panama|CMT EST|5j.A 50|01|-2uduE.o|15e5",
		"America/Chicago|CST CDT EST CWT CPT|60 50 50 50 50|01010101010101010101010101010101010102010101010103401010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-261s0 1nX0 11B0 1nX0 1wp0 TX0 WN0 1qL0 1cN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 11B0 1Hz0 14p0 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 RB0 8x30 iw0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|92e5",
		"America/Chihuahua|LMT MST CST CDT MDT|74.k 70 60 50 60|0121212323241414141414141414141414141414141414141414141414141414141414141414141414141414141|-1UQF0 deL0 8lc0 17c0 10M0 1dd0 2zQN0 1lb0 14p0 1lb0 14q0 1lb0 14p0 1nX0 11B0 1nX0 1fB0 WL0 1fB0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0|81e4",
		"America/Costa_Rica|SJMT CST CDT|5A.d 60 50|0121212121|-1Xd6n.L 2lu0n.L Db0 1Kp0 Db0 pRB0 15b0 1kp0 mL0|12e5",
		"America/Creston|MST PST|70 80|010|-29DR0 43B0|53e2",
		"America/Cuiaba|LMT AMT AMST|3I.k 40 30|0121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212|-2glwf.E HdLf.E 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 1EN0 FX0 1HB0 Lz0 1EN0 Lz0 1C10 IL0 1HB0 Db0 1HB0 On0 1zd0 On0 1zd0 Lz0 1zd0 Rb0 1wN0 Wn0 1tB0 Rb0 1tB0 WL0 1tB0 Rb0 1zd0 On0 1HB0 FX0 4a10 HX0 1zd0 On0 1HB0 IL0 1wp0 On0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 Rb0 1zd0 Lz0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 On0 1zd0 On0 1C10 Lz0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 Rb0 1wp0 On0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 On0 1zd0 On0 1C10 Lz0 1C10 Lz0 1C10 Lz0 1C10 On0 1zd0 Rb0 1wp0 On0 1C10 Lz0 1C10 On0 1zd0|54e4",
		"America/Danmarkshavn|LMT WGT WGST GMT|1e.E 30 20 0|01212121212121212121212121212121213|-2a5WJ.k 2z5fJ.k 19U0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 DC0|8",
		"America/Dawson|YST YDT YWT YPT YDDT PST PDT|90 80 80 80 70 80 70|0101023040565656565656565656565656565656565656565656565656565656565656565656565656565656565656565656565656565656565656565656565|-25TN0 1in0 1o10 13V0 Ser0 8x00 iz0 LCL0 1fA0 jrA0 fNd0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|13e2",
		"America/Dawson_Creek|PST PDT PWT PPT MST|80 70 70 70 70|0102301010101010101010101010101010101010101010101010101014|-25TO0 1in0 UGp0 8x10 iy0 3NB0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 ML0|12e3",
		"America/Denver|MST MDT MWT MPT|70 60 60 60|01010101023010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-261r0 1nX0 11B0 1nX0 11B0 1qL0 WN0 mn0 Ord0 8x20 ix0 LCN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|26e5",
		"America/Detroit|LMT CST EST EWT EPT EDT|5w.b 60 50 40 40 40|01234252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252|-2Cgir.N peqr.N 156L0 8x40 iv0 6fd0 11z0 Jy10 SL0 dnB0 1cL0 s10 1Vz0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|37e5",
		"America/Edmonton|LMT MST MDT MWT MPT|7x.Q 70 60 60 60|01212121212121341212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2yd4q.8 shdq.8 1in0 17d0 hz0 2dB0 1fz0 1a10 11z0 1qN0 WL0 1qN0 11z0 IGN0 8x20 ix0 3NB0 11z0 LFB0 1cL0 3Cp0 1cL0 66N0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|10e5",
		"America/Eirunepe|LMT ACT ACST AMT|4D.s 50 40 40|0121212121212121212121212121212131|-2glvk.w HdLk.w 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 dPB0 On0 yTd0 d5X0|31e3",
		"America/El_Salvador|LMT CST CDT|5U.M 60 50|012121|-1XiG3.c 2Fvc3.c WL0 1qN0 WL0|11e5",
		"America/Tijuana|LMT MST PST PDT PWT PPT|7M.4 70 80 70 70 70|012123245232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232|-1UQE0 4PX0 8mM0 8lc0 SN0 1cL0 pHB0 83r0 zI0 5O10 1Rz0 cOO0 11A0 1o00 11A0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 BUp0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 U10 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|20e5",
		"America/Fort_Nelson|PST PDT PWT PPT MST|80 70 70 70 70|01023010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010104|-25TO0 1in0 UGp0 8x10 iy0 3NB0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0|39e2",
		"America/Fort_Wayne|CST CDT CWT CPT EST EDT|60 50 50 50 50 40|010101023010101010101010101040454545454545454545454545454545454545454545454545454545454545454545454|-261s0 1nX0 11B0 1nX0 QI10 Db0 RB0 8x30 iw0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 5Tz0 1o10 qLb0 1cL0 1cN0 1cL0 1qhd0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0",
		"America/Fortaleza|LMT BRT BRST|2y 30 20|0121212121212121212121212121212121212121|-2glxq HdLq 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 1EN0 FX0 1HB0 Lz0 nsp0 WL0 1tB0 5z0 2mN0 On0|34e5",
		"America/Glace_Bay|LMT AST ADT AWT APT|3X.M 40 30 30 30|012134121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2IsI0.c CwO0.c 1in0 UGp0 8x50 iu0 iq10 11z0 Jg10 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|19e3",
		"America/Godthab|LMT WGT WGST|3q.U 30 20|0121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2a5Ux.4 2z5dx.4 19U0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|17e3",
		"America/Goose_Bay|NST NDT NST NDT NWT NPT AST ADT ADDT|3u.Q 2u.Q 3u 2u 2u 2u 40 30 20|010232323232323245232323232323232323232323232323232323232326767676767676767676767676767676767676767676768676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676|-25TSt.8 1in0 DXb0 2HbX.8 WL0 1qN0 WL0 1qN0 WL0 1tB0 TX0 1tB0 WL0 1qN0 WL0 1qN0 7UHu itu 1tB0 WL0 1qN0 WL0 1qN0 WL0 1qN0 WL0 1tB0 WL0 1ld0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 S10 g0u 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14n1 1lb0 14p0 1nW0 11C0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zcX Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|76e2",
		"America/Grand_Turk|KMT EST EDT AST|57.b 50 40 40|0121212121212121212121212121212121212121212121212121212121212121212121212123|-2l1uQ.N 2HHBQ.N 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|37e2",
		"America/Guatemala|LMT CST CDT|62.4 60 50|0121212121|-24KhV.U 2efXV.U An0 mtd0 Nz0 ifB0 17b0 zDB0 11z0|13e5",
		"America/Guayaquil|QMT ECT|5e 50|01|-1yVSK|27e5",
		"America/Guyana|LMT GBGT GYT GYT GYT|3Q.E 3J 3J 30 40|01234|-2dvU7.k 24JzQ.k mlc0 Bxbf|80e4",
		"America/Halifax|LMT AST ADT AWT APT|4e.o 40 30 30 30|0121212121212121212121212121212121212121212121212134121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2IsHJ.A xzzJ.A 1db0 3I30 1in0 3HX0 IL0 1E10 ML0 1yN0 Pb0 1Bd0 Mn0 1Bd0 Rz0 1w10 Xb0 1w10 LX0 1w10 Xb0 1w10 Lz0 1C10 Jz0 1E10 OL0 1yN0 Un0 1qp0 Xb0 1qp0 11X0 1w10 Lz0 1HB0 LX0 1C10 FX0 1w10 Xb0 1qp0 Xb0 1BB0 LX0 1td0 Xb0 1qp0 Xb0 Rf0 8x50 iu0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 3Qp0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 3Qp0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 6i10 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|39e4",
		"America/Havana|HMT CST CDT|5t.A 50 40|012121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-1Meuu.o 72zu.o ML0 sld0 An0 1Nd0 Db0 1Nd0 An0 6Ep0 An0 1Nd0 An0 JDd0 Mn0 1Ap0 On0 1fd0 11X0 1qN0 WL0 1wp0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 14n0 1ld0 14L0 1kN0 15b0 1kp0 1cL0 1cN0 1fz0 1a10 1fz0 1fB0 11z0 14p0 1nX0 11B0 1nX0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 14n0 1ld0 14n0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 1a10 1in0 1a10 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1cM0 1cM0 1fA0 17c0 1o00 11A0 1qM0 11A0 1o00 11A0 1o00 14o0 1lc0 14o0 1lc0 11A0 6i00 Rc0 1wo0 U00 1tA0 Rc0 1wo0 U00 1wo0 U00 1zc0 U00 1qM0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0|21e5",
		"America/Hermosillo|LMT MST CST PST MDT|7n.Q 70 60 80 60|0121212131414141|-1UQF0 deL0 8lc0 17c0 10M0 1dd0 otX0 gmN0 P2N0 13Vd0 1lb0 14p0 1lb0 14p0 1lb0|64e4",
		"America/Indiana/Knox|CST CDT CWT CPT EST|60 50 50 50 50|0101023010101010101010101010101010101040101010101010101010101010101010101010101010101010141010101010101010101010101010101010101010101010101010101010101010|-261s0 1nX0 11B0 1nX0 SgN0 8x30 iw0 3NB0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 1fz0 1cN0 1cL0 1cN0 11z0 1o10 11z0 1o10 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 3Cn0 8wp0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 z8o0 1o00 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0",
		"America/Indiana/Marengo|CST CDT CWT CPT EST EDT|60 50 50 50 50 40|0101023010101010101010104545454545414545454545454545454545454545454545454545454545454545454545454545454|-261s0 1nX0 11B0 1nX0 SgN0 8x30 iw0 dyN0 11z0 6fd0 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 jrz0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1VA0 LA0 1BX0 1e6p0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0",
		"America/Indiana/Petersburg|CST CDT CWT CPT EST EDT|60 50 50 50 50 40|01010230101010101010101010104010101010101010101010141014545454545454545454545454545454545454545454545454545454545454|-261s0 1nX0 11B0 1nX0 SgN0 8x30 iw0 njX0 WN0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 3Fb0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 19co0 1o00 Rd0 1zb0 Oo0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0",
		"America/Indiana/Tell_City|CST CDT CWT CPT EST EDT|60 50 50 50 50 40|01010230101010101010101010101010454541010101010101010101010101010101010101010101010101010101010101010|-261s0 1nX0 11B0 1nX0 SgN0 8x30 iw0 1o10 11z0 g0p0 11z0 1o10 11z0 1qL0 WN0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 1fz0 1cN0 WL0 1qN0 1cL0 1cN0 1cL0 1cN0 caL0 1cL0 1cN0 1cL0 1qhd0 1o00 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0",
		"America/Indiana/Vevay|CST CDT CWT CPT EST EDT|60 50 50 50 50 40|010102304545454545454545454545454545454545454545454545454545454545454545454545454|-261s0 1nX0 11B0 1nX0 SgN0 8x30 iw0 kPB0 Awn0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1lnd0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0",
		"America/Indiana/Vincennes|CST CDT CWT CPT EST EDT|60 50 50 50 50 40|01010230101010101010101010101010454541014545454545454545454545454545454545454545454545454545454545454|-261s0 1nX0 11B0 1nX0 SgN0 8x30 iw0 1o10 11z0 g0p0 11z0 1o10 11z0 1qL0 WN0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 1fz0 1cN0 WL0 1qN0 1cL0 1cN0 1cL0 1cN0 caL0 1cL0 1cN0 1cL0 1qhd0 1o00 Rd0 1zb0 Oo0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0",
		"America/Indiana/Winamac|CST CDT CWT CPT EST EDT|60 50 50 50 50 40|01010230101010101010101010101010101010454541054545454545454545454545454545454545454545454545454545454545454|-261s0 1nX0 11B0 1nX0 SgN0 8x30 iw0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 1fz0 1cN0 1cL0 1cN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 jrz0 1cL0 1cN0 1cL0 1qhd0 1o00 Rd0 1za0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0",
		"America/Inuvik|-00 PST PDDT MST MDT|0 80 60 70 60|0121343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343|-FnA0 tWU0 1fA0 wPe0 2pz0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|35e2",
		"America/Iqaluit|-00 EWT EPT EST EDDT EDT CST CDT|0 40 40 50 30 40 60 50|01234353535353535353535353535353535353535353567353535353535353535353535353535353535353535353535353535353535353535353535353|-16K00 7nX0 iv0 LCL0 1fA0 zgO0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11C0 1nX0 11A0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|67e2",
		"America/Jamaica|KMT EST EDT|57.b 50 40|0121212121212121212121|-2l1uQ.N 2uM1Q.N 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0|94e4",
		"America/Juneau|PST PWT PPT PDT YDT YST AKST AKDT|80 70 70 70 80 90 90 80|01203030303030303030303030403030356767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676|-17T20 8x10 iy0 Vo10 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cM0 1cM0 1cL0 1cN0 1fz0 1a10 1fz0 co0 10q0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|33e3",
		"America/Kentucky/Louisville|CST CDT CWT CPT EST EDT|60 50 50 50 50 40|0101010102301010101010101010101010101454545454545414545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454|-261s0 1nX0 11B0 1nX0 3Fd0 Nb0 LPd0 11z0 RB0 8x30 iw0 Bb0 10N0 2bB0 8in0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 xz0 gso0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1VA0 LA0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0",
		"America/Kentucky/Monticello|CST CDT CWT CPT EST EDT|60 50 50 50 50 40|0101023010101010101010101010101010101010101010101010101010101010101010101454545454545454545454545454545454545454545454545454545454545454545454545454|-261s0 1nX0 11B0 1nX0 SgN0 8x30 iw0 SWp0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11A0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0",
		"America/La_Paz|CMT BOST BOT|4w.A 3w.A 40|012|-1x37r.o 13b0|19e5",
		"America/Lima|LMT PET PEST|58.A 50 40|0121212121212121|-2tyGP.o 1bDzP.o zX0 1aN0 1cL0 1cN0 1cL0 1PrB0 zX0 1O10 zX0 6Gp0 zX0 98p0 zX0|11e6",
		"America/Los_Angeles|PST PDT PWT PPT|80 70 70 70|010102301010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-261q0 1nX0 11B0 1nX0 SgN0 8x10 iy0 5Wp1 1VaX 3dA0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1a00 1fA0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|15e6",
		"America/Maceio|LMT BRT BRST|2m.Q 30 20|012121212121212121212121212121212121212121|-2glxB.8 HdLB.8 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 1EN0 FX0 1HB0 Lz0 dMN0 Lz0 8Q10 WL0 1tB0 5z0 2mN0 On0|93e4",
		"America/Managua|MMT CST EST CDT|5J.c 60 50 50|0121313121213131|-1quie.M 1yAMe.M 4mn0 9Up0 Dz0 1K10 Dz0 s3F0 1KH0 DB0 9In0 k8p0 19X0 1o30 11y0|22e5",
		"America/Manaus|LMT AMT AMST|40.4 40 30|01212121212121212121212121212121|-2glvX.U HdKX.U 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 dPB0 On0|19e5",
		"America/Martinique|FFMT AST ADT|44.k 40 30|0121|-2mPTT.E 2LPbT.E 19X0|39e4",
		"America/Matamoros|LMT CST CDT|6E 60 50|0121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-1UQG0 2FjC0 1nX0 i6p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 1fB0 WL0 1fB0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 U10 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|45e4",
		"America/Mazatlan|LMT MST CST PST MDT|75.E 70 60 80 60|0121212131414141414141414141414141414141414141414141414141414141414141414141414141414141414141|-1UQF0 deL0 8lc0 17c0 10M0 1dd0 otX0 gmN0 P2N0 13Vd0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 1fB0 WL0 1fB0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0|44e4",
		"America/Menominee|CST CDT CWT CPT EST|60 50 50 50 50|01010230101041010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-261s0 1nX0 11B0 1nX0 SgN0 8x30 iw0 1o10 11z0 LCN0 1fz0 6410 9Jb0 1cM0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|85e2",
		"America/Merida|LMT CST EST CDT|5W.s 60 50 50|0121313131313131313131313131313131313131313131313131313131313131313131313131313131313131|-1UQG0 2q2o0 2hz0 wu30 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 1fB0 WL0 1fB0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0|11e5",
		"America/Metlakatla|PST PWT PPT PDT AKST AKDT|80 70 70 70 90 80|0120303030303030303030303030303030454545454545454545454545454545454545454545454|-17T20 8x10 iy0 Vo10 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1hU10 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|14e2",
		"America/Mexico_City|LMT MST CST CDT CWT|6A.A 70 60 50 50|012121232324232323232323232323232323232323232323232323232323232323232323232323232323232323232323232|-1UQF0 deL0 8lc0 17c0 10M0 1dd0 gEn0 TX0 3xd0 Jb0 6zB0 SL0 e5d0 17b0 1Pff0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 1fB0 WL0 1fB0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0|20e6",
		"America/Miquelon|LMT AST PMST PMDT|3I.E 40 30 20|012323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232|-2mKkf.k 2LTAf.k gQ10 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|61e2",
		"America/Moncton|EST AST ADT AWT APT|50 40 30 30 30|012121212121212121212134121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2IsH0 CwN0 1in0 zAo0 An0 1Nd0 An0 1Nd0 An0 1Nd0 An0 1Nd0 An0 1Nd0 An0 1K10 Lz0 1zB0 NX0 1u10 Wn0 S20 8x50 iu0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 3Cp0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14n1 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 ReX 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|64e3",
		"America/Monterrey|LMT CST CDT|6F.g 60 50|0121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-1UQG0 2FjC0 1nX0 i6p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 1fB0 WL0 1fB0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0|41e5",
		"America/Montevideo|MMT UYT UYHST UYST UYT UYHST|3I.I 3u 30 20 30 2u|012121212121212121212121213434343434345454543453434343434343434343434343434343434343434|-20UIf.g 8jzJ.g 1cLu 1dcu 1cLu 1dcu 1cLu ircu 11zu 1o0u 11zu 1o0u 11zu 1qMu WLu 1qMu WLu 1qMu WLu 1qMu 11zu 1o0u 11zu NAu 11bu 2iMu zWu Dq10 19X0 pd0 jz0 cm10 19X0 1fB0 1on0 11d0 1oL0 1nB0 1fzu 1aou 1fzu 1aou 1fzu 3nAu Jb0 3MN0 1SLu 4jzu 2PB0 Lb0 3Dd0 1pb0 ixd0 An0 1MN0 An0 1wp0 On0 1wp0 Rb0 1zd0 On0 1wp0 Rb0 s8p0 1fB0 1ip0 11z0 1ld0 14n0 1o10 11z0 1o10 11z0 1o10 14n0 1ld0 14n0 1ld0 14n0 1o10 11z0 1o10 11z0 1o10 11z0|17e5",
		"America/Toronto|EST EDT EWT EPT|50 40 40 40|01010101010101010101010101010101010101010101012301010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-25TR0 1in0 11Wu 1nzu 1fD0 WJ0 1wr0 Nb0 1Ap0 On0 1zd0 On0 1wp0 TX0 1tB0 TX0 1tB0 TX0 1tB0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 4kM0 8x40 iv0 1o10 11z0 1nX0 11z0 1o10 11z0 1o10 1qL0 11D0 1nX0 11B0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|65e5",
		"America/Nassau|LMT EST EDT|59.u 50 40|012121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2kNuO.u 26XdO.u 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|24e4",
		"America/New_York|EST EDT EWT EPT|50 40 40 40|01010101010101010101010101010101010101010101010102301010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-261t0 1nX0 11B0 1nX0 11B0 1qL0 1a10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 RB0 8x40 iv0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|21e6",
		"America/Nipigon|EST EDT EWT EPT|50 40 40 40|010123010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-25TR0 1in0 Rnb0 3je0 8x40 iv0 19yN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|16e2",
		"America/Nome|NST NWT NPT BST BDT YST AKST AKDT|b0 a0 a0 b0 a0 90 90 80|012034343434343434343434343434343456767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676|-17SX0 8wW0 iB0 Qlb0 52O0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 cl0 10q0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|38e2",
		"America/Noronha|LMT FNT FNST|29.E 20 10|0121212121212121212121212121212121212121|-2glxO.k HdKO.k 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 1EN0 FX0 1HB0 Lz0 nsp0 WL0 1tB0 2L0 2pB0 On0|30e2",
		"America/North_Dakota/Beulah|MST MDT MWT MPT CST CDT|70 60 60 60 60 50|010102301010101010101010101010101010101010101010101010101010101010101010101010101010101010101014545454545454545454545454545454545454545454545454545454|-261r0 1nX0 11B0 1nX0 SgN0 8x20 ix0 QwN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Oo0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0",
		"America/North_Dakota/Center|MST MDT MWT MPT CST CDT|70 60 60 60 60 50|010102301010101010101010101010101010101010101010101010101014545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454|-261r0 1nX0 11B0 1nX0 SgN0 8x20 ix0 QwN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14o0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0",
		"America/North_Dakota/New_Salem|MST MDT MWT MPT CST CDT|70 60 60 60 60 50|010102301010101010101010101010101010101010101010101010101010101010101010101010101454545454545454545454545454545454545454545454545454545454545454545454|-261r0 1nX0 11B0 1nX0 SgN0 8x20 ix0 QwN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14o0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0",
		"America/Ojinaga|LMT MST CST CDT MDT|6V.E 70 60 50 60|0121212323241414141414141414141414141414141414141414141414141414141414141414141414141414141|-1UQF0 deL0 8lc0 17c0 10M0 1dd0 2zQN0 1lb0 14p0 1lb0 14q0 1lb0 14p0 1nX0 11B0 1nX0 1fB0 WL0 1fB0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 U10 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|23e3",
		"America/Pangnirtung|-00 AST AWT APT ADDT ADT EDT EST CST CDT|0 40 30 30 20 30 40 50 60 50|012314151515151515151515151515151515167676767689767676767676767676767676767676767676767676767676767676767676767676767676767|-1XiM0 PnG0 8x50 iu0 LCL0 1fA0 zgO0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1o00 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11C0 1nX0 11A0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|14e2",
		"America/Paramaribo|LMT PMT PMT NEGT SRT SRT|3E.E 3E.Q 3E.A 3u 3u 30|012345|-2nDUj.k Wqo0.c qanX.I 1dmLN.o lzc0|24e4",
		"America/Phoenix|MST MDT MWT|70 60 60|01010202010|-261r0 1nX0 11B0 1nX0 SgN0 4Al1 Ap0 1db0 SWqX 1cL0|42e5",
		"America/Port-au-Prince|PPMT EST EDT|4N 50 40|01212121212121212121212121212121212121212121|-28RHb 2FnMb 19X0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14q0 1o00 11A0 1o00 11A0 1o00 14o0 1lc0 14o0 1lc0 14o0 1o00 11A0 1o00 11A0 1o00 14o0 1lc0 14o0 1lc0 i6n0 1nX0 11B0 1nX0 d430 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|23e5",
		"America/Rio_Branco|LMT ACT ACST AMT|4v.c 50 40 40|01212121212121212121212121212131|-2glvs.M HdLs.M 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 NBd0 d5X0|31e4",
		"America/Porto_Velho|LMT AMT AMST|4f.A 40 30|012121212121212121212121212121|-2glvI.o HdKI.o 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0|37e4",
		"America/Puerto_Rico|AST AWT APT|40 30 30|0120|-17lU0 7XT0 iu0|24e5",
		"America/Rainy_River|CST CDT CWT CPT|60 50 50 50|010123010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-25TQ0 1in0 Rnb0 3je0 8x30 iw0 19yN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|842",
		"America/Rankin_Inlet|-00 CST CDDT CDT EST|0 60 40 50 50|012131313131313131313131313131313131313131313431313131313131313131313131313131313131313131313131313131313131313131313131|-vDc0 keu0 1fA0 zgO0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|26e2",
		"America/Recife|LMT BRT BRST|2j.A 30 20|0121212121212121212121212121212121212121|-2glxE.o HdLE.o 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 1EN0 FX0 1HB0 Lz0 nsp0 WL0 1tB0 2L0 2pB0 On0|33e5",
		"America/Regina|LMT MST MDT MWT MPT CST|6W.A 70 60 60 60 60|012121212121212121212121341212121212121212121212121215|-2AD51.o uHe1.o 1in0 s2L0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 66N0 1cL0 1cN0 19X0 1fB0 1cL0 1fB0 1cL0 1cN0 1cL0 M30 8x20 ix0 1ip0 1cL0 1ip0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 3NB0 1cL0 1cN0|19e4",
		"America/Resolute|-00 CST CDDT CDT EST|0 60 40 50 50|012131313131313131313131313131313131313131313431313131313431313131313131313131313131313131313131313131313131313131313131|-SnA0 GWS0 1fA0 zgO0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|229",
		"America/Santarem|LMT AMT AMST BRT|3C.M 40 30 30|0121212121212121212121212121213|-2glwl.c HdLl.c 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 NBd0|21e4",
		"America/Santiago|SMT CLT CLT CLST CLST|4G.K 50 40 40 30|010203131313131212421242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424|-2q2jh.e fJAh.e 5knG.K 1Vzh.e jRAG.K 1pbh.e 11d0 1oL0 11d0 1oL0 11d0 1oL0 11d0 1pb0 11d0 nHX0 op0 9Bz0 jb0 1oN0 ko0 Qeo0 WL0 1zd0 On0 1ip0 11z0 1o10 11z0 1qN0 WL0 1ld0 14n0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 WL0 1qN0 1cL0 1cN0 11z0 1o10 11z0 1qN0 WL0 1fB0 19X0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 17b0 1ip0 11z0 1ip0 1fz0 1fB0 11z0 1qN0 WL0 1qN0 WL0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 17b0 1ip0 11z0 1o10 19X0 1fB0 1nX0 G10 1EL0 Op0 1zb0 Rd0 1wn0 Rd0 46n0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Dd0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Dd0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Dd0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0|62e5",
		"America/Santo_Domingo|SDMT EST EDT EHDT AST|4E 50 40 4u 40|01213131313131414|-1ttjk 1lJMk Mn0 6sp0 Lbu 1Cou yLu 1RAu wLu 1QMu xzu 1Q0u xXu 1PAu 13jB0 e00|29e5",
		"America/Sao_Paulo|LMT BRT BRST|36.s 30 20|012121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212|-2glwR.w HdKR.w 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 pTd0 PX0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 1EN0 FX0 1HB0 Lz0 1EN0 Lz0 1C10 IL0 1HB0 Db0 1HB0 On0 1zd0 On0 1zd0 Lz0 1zd0 Rb0 1wN0 Wn0 1tB0 Rb0 1tB0 WL0 1tB0 Rb0 1zd0 On0 1HB0 FX0 1C10 Lz0 1Ip0 HX0 1zd0 On0 1HB0 IL0 1wp0 On0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 Rb0 1zd0 Lz0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 On0 1zd0 On0 1C10 Lz0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 Rb0 1wp0 On0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 On0 1zd0 On0 1C10 Lz0 1C10 Lz0 1C10 Lz0 1C10 On0 1zd0 Rb0 1wp0 On0 1C10 Lz0 1C10 On0 1zd0|20e6",
		"America/Scoresbysund|LMT CGT CGST EGST EGT|1r.Q 20 10 0 10|0121343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434|-2a5Ww.8 2z5ew.8 1a00 1cK0 1cL0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|452",
		"America/Sitka|PST PWT PPT PDT YST AKST AKDT|80 70 70 70 90 90 80|01203030303030303030303030303030345656565656565656565656565656565656565656565656565656565656565656565656565656565656565656565656565656565656565|-17T20 8x10 iy0 Vo10 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 co0 10q0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|90e2",
		"America/St_Johns|NST NDT NST NDT NWT NPT NDDT|3u.Q 2u.Q 3u 2u 2u 2u 1u|01010101010101010101010101010101010102323232323232324523232323232323232323232323232323232323232323232323232323232323232323232323232323232326232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232|-28oit.8 14L0 1nB0 1in0 1gm0 Dz0 1JB0 1cL0 1cN0 1cL0 1fB0 19X0 1fB0 19X0 1fB0 19X0 1fB0 19X0 1fB0 1cL0 1cN0 1cL0 1fB0 19X0 1fB0 19X0 1fB0 19X0 1fB0 19X0 1fB0 1cL0 1fB0 19X0 1fB0 19X0 10O0 eKX.8 19X0 1iq0 WL0 1qN0 WL0 1qN0 WL0 1tB0 TX0 1tB0 WL0 1qN0 WL0 1qN0 7UHu itu 1tB0 WL0 1qN0 WL0 1qN0 WL0 1qN0 WL0 1tB0 WL0 1ld0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14n1 1lb0 14p0 1nW0 11C0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zcX Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|11e4",
		"America/Swift_Current|LMT MST MDT MWT MPT CST|7b.k 70 60 60 60 60|012134121212121212121215|-2AD4M.E uHdM.E 1in0 UGp0 8x20 ix0 1o10 17b0 1ip0 11z0 1o10 11z0 1o10 11z0 isN0 1cL0 3Cp0 1cL0 1cN0 11z0 1qN0 WL0 pMp0|16e3",
		"America/Tegucigalpa|LMT CST CDT|5M.Q 60 50|01212121|-1WGGb.8 2ETcb.8 WL0 1qN0 WL0 GRd0 AL0|11e5",
		"America/Thule|LMT AST ADT|4z.8 40 30|012121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2a5To.Q 31NBo.Q 1cL0 1cN0 1cL0 1fB0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|656",
		"America/Thunder_Bay|CST EST EWT EPT EDT|60 50 40 40 40|0123141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141|-2q5S0 1iaN0 8x40 iv0 XNB0 1cL0 1cN0 1fz0 1cN0 1cL0 3Cp0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|11e4",
		"America/Vancouver|PST PDT PWT PPT|80 70 70 70|0102301010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-25TO0 1in0 UGp0 8x10 iy0 1o10 17b0 1ip0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|23e5",
		"America/Whitehorse|YST YDT YWT YPT YDDT PST PDT|90 80 80 80 70 80 70|0101023040565656565656565656565656565656565656565656565656565656565656565656565656565656565656565656565656565656565656565656565|-25TN0 1in0 1o10 13V0 Ser0 8x00 iz0 LCL0 1fA0 3NA0 vrd0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|23e3",
		"America/Winnipeg|CST CDT CWT CPT|60 50 50 50|010101023010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2aIi0 WL0 3ND0 1in0 Jap0 Rb0 aCN0 8x30 iw0 1tB0 11z0 1ip0 11z0 1o10 11z0 1o10 11z0 1rd0 10L0 1op0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 1cL0 1cN0 11z0 6i10 WL0 6i10 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1a00 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1a00 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 14o0 1lc0 14o0 1o00 11A0 1o00 11A0 1o00 14o0 1lc0 14o0 1lc0 14o0 1o00 11A0 1o00 11A0 1o00 14o0 1lc0 14o0 1lc0 14o0 1lc0 14o0 1o00 11A0 1o00 11A0 1o00 14o0 1lc0 14o0 1lc0 14o0 1o00 11A0 1o00 11A0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|66e4",
		"America/Yakutat|YST YWT YPT YDT AKST AKDT|90 80 80 80 90 80|01203030303030303030303030303030304545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454|-17T10 8x00 iz0 Vo10 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 cn0 10q0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|642",
		"America/Yellowknife|-00 MST MWT MPT MDDT MDT|0 70 60 60 50 60|012314151515151515151515151515151515151515151515151515151515151515151515151515151515151515151515151515151515151515151515151|-1pdA0 hix0 8x20 ix0 LCL0 1fA0 zgO0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|19e3",
		"Antarctica/Casey|-00 +08 +11|0 -80 -b0|0121212|-2q00 1DjS0 T90 40P0 KL0 blz0|10",
		"Antarctica/Davis|-00 +07 +05|0 -70 -50|01012121|-vyo0 iXt0 alj0 1D7v0 VB0 3Wn0 KN0|70",
		"Antarctica/DumontDUrville|-00 +10|0 -a0|0101|-U0o0 cfq0 bFm0|80",
		"Antarctica/Macquarie|AEST AEDT -00 MIST|-a0 -b0 0 -b0|0102010101010101010101010101010101010101010101010101010101010101010101010101010101010101013|-29E80 19X0 4SL0 1ayy0 Lvs0 1cM0 1o00 Rc0 1wo0 Rc0 1wo0 U00 1wo0 LA0 1C00 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 11A0 1qM0 WM0 1qM0 Oo0 1zc0 Oo0 1zc0 Oo0 1wo0 WM0 1tA0 WM0 1tA0 U00 1tA0 U00 1tA0 11A0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 11A0 1o00 1io0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1cM0 1a00 1io0 1cM0 1cM0 1cM0 1cM0 1cM0|1",
		"Antarctica/Mawson|-00 +06 +05|0 -60 -50|012|-CEo0 2fyk0|60",
		"Pacific/Auckland|NZMT NZST NZST NZDT|-bu -cu -c0 -d0|01020202020202020202020202023232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323|-1GCVu Lz0 1tB0 11zu 1o0u 11zu 1o0u 11zu 1o0u 14nu 1lcu 14nu 1lcu 1lbu 11Au 1nXu 11Au 1nXu 11Au 1nXu 11Au 1nXu 11Au 1qLu WMu 1qLu 11Au 1n1bu IM0 1C00 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1qM0 14o0 1lc0 14o0 1lc0 14o0 1lc0 17c0 1io0 17c0 1io0 17c0 1io0 17c0 1lc0 14o0 1lc0 14o0 1lc0 17c0 1io0 17c0 1io0 17c0 1lc0 14o0 1lc0 14o0 1lc0 17c0 1io0 17c0 1io0 17c0 1io0 17c0 1io0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1io0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00|14e5",
		"Antarctica/Palmer|-00 ARST ART ART ARST CLT CLST|0 30 40 30 20 40 30|0121212121234356565656565656565656565656565656565656565656565656565656565656565656565656565656565656565656565656565656565656|-cao0 nD0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 jsN0 14N0 11z0 1o10 11z0 1qN0 WL0 1qN0 WL0 1qN0 1cL0 1cN0 11z0 1o10 11z0 1qN0 WL0 1fB0 19X0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 17b0 1ip0 11z0 1ip0 1fz0 1fB0 11z0 1qN0 WL0 1qN0 WL0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 17b0 1ip0 11z0 1o10 19X0 1fB0 1nX0 G10 1EL0 Op0 1zb0 Rd0 1wn0 Rd0 46n0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Dd0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Dd0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Dd0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0|40",
		"Antarctica/Rothera|-00 -03|0 30|01|gOo0|130",
		"Antarctica/Syowa|-00 +03|0 -30|01|-vs00|20",
		"Antarctica/Troll|-00 +00 +02|0 0 -20|01212121212121212121212121212121212121212121212121212121212121212121|1puo0 hd0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|40",
		"Antarctica/Vostok|-00 +06|0 -60|01|-tjA0|25",
		"Europe/Oslo|CET CEST|-10 -20|010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2awM0 Qm0 W6o0 5pf0 WM0 1fA0 1cM0 1cM0 1cM0 1cM0 wJc0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1qM0 WM0 zpc0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|62e4",
		"Asia/Riyadh|LMT AST|-36.Q -30|01|-TvD6.Q|57e5",
		"Asia/Almaty|LMT +05 +06 +07|-57.M -50 -60 -70|012323232323232323232321232323232323232323232323232|-1Pc57.M eUo7.M 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0|15e5",
		"Asia/Amman|LMT EET EEST|-2n.I -20 -30|0121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-1yW2n.I 1HiMn.I KL0 1oN0 11b0 1oN0 11b0 1pd0 1dz0 1cp0 11b0 1op0 11b0 fO10 1db0 1e10 1cL0 1cN0 1cL0 1cN0 1fz0 1pd0 10n0 1ld0 14n0 1hB0 15b0 1ip0 19X0 1cN0 1cL0 1cN0 17b0 1ld0 14o0 1lc0 17c0 1io0 17c0 1io0 17c0 1So0 y00 1fc0 1dc0 1co0 1dc0 1cM0 1cM0 1cM0 1o00 11A0 1lc0 17c0 1cM0 1cM0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 4bX0 Dd0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0|25e5",
		"Asia/Anadyr|LMT +12 +13 +14 +11|-bN.U -c0 -d0 -e0 -b0|01232121212121212121214121212121212121212121212121212121212141|-1PcbN.U eUnN.U 23CL0 1db0 2q10 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 2sp0 WM0|13e3",
		"Asia/Aqtau|LMT +04 +05 +06|-3l.4 -40 -50 -60|012323232323232323232123232312121212121212121212|-1Pc3l.4 eUnl.4 24PX0 2pX0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cN0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0|15e4",
		"Asia/Aqtobe|LMT +04 +05 +06|-3M.E -40 -50 -60|0123232323232323232321232323232323232323232323232|-1Pc3M.E eUnM.E 23CL0 3Db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0|27e4",
		"Asia/Ashgabat|LMT +04 +05 +06|-3R.w -40 -50 -60|0123232323232323232323212|-1Pc3R.w eUnR.w 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0|41e4",
		"Asia/Atyrau|LMT +04 +05 +06|-3r.I -40 -50 -60|01232323232323232323212323232323232321212121212|-1Pc3r.I eUnr.I 24PX0 2pX0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 2sp0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0",
		"Asia/Baghdad|BMT AST ADT|-2V.A -30 -40|012121212121212121212121212121212121212121212121212121|-26BeV.A 2ACnV.A 11b0 1cp0 1dz0 1dd0 1db0 1cN0 1cp0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1de0 1dc0 1dc0 1dc0 1cM0 1dc0 1cM0 1dc0 1cM0 1dc0 1dc0 1dc0 1cM0 1dc0 1cM0 1dc0 1cM0 1dc0 1dc0 1dc0 1cM0 1dc0 1cM0 1dc0 1cM0 1dc0 1dc0 1dc0 1cM0 1dc0 1cM0 1dc0 1cM0 1dc0|66e5",
		"Asia/Qatar|LMT GST AST|-3q.8 -40 -30|012|-21Jfq.8 27BXq.8|96e4",
		"Asia/Baku|LMT +03 +04 +05|-3j.o -30 -40 -50|01232323232323232323232123232323232323232323232323232323232323232|-1Pc3j.o 1jUoj.o WCL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 1cM0 9Je0 1o00 11z0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00|27e5",
		"Asia/Bangkok|BMT ICT|-6G.4 -70|01|-218SG.4|15e6",
		"Asia/Barnaul|LMT +06 +07 +08|-5z -60 -70 -80|0123232323232323232323212323232321212121212121212121212121212121212|-21S5z pCnz 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 p90 LE0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0 3rd0",
		"Asia/Beirut|EET EEST|-20 -30|010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-21aq0 1on0 1410 1db0 19B0 1in0 1ip0 WL0 1lQp0 11b0 1oN0 11b0 1oN0 11b0 1pd0 11b0 1oN0 11b0 q6N0 En0 1oN0 11b0 1oN0 11b0 1oN0 11b0 1pd0 11b0 1oN0 11b0 1op0 11b0 dA10 17b0 1iN0 17b0 1iN0 17b0 1iN0 17b0 1vB0 SL0 1mp0 13z0 1iN0 17b0 1iN0 17b0 1jd0 12n0 1a10 1cL0 1cN0 1cL0 1cN0 1cL0 1fB0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0|22e5",
		"Asia/Bishkek|LMT +05 +06 +07|-4W.o -50 -60 -70|012323232323232323232321212121212121212121212121212|-1Pc4W.o eUnW.o 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2e00 1tX0 17b0 1ip0 17b0 1ip0 17b0 1ip0 17b0 1ip0 19X0 1cPu 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0|87e4",
		"Asia/Brunei|LMT BNT BNT|-7D.E -7u -80|012|-1KITD.E gDc9.E|42e4",
		"Asia/Kolkata|HMT BURT IST IST|-5R.k -6u -5u -6u|01232|-18LFR.k 1unn.k HB0 7zX0|15e6",
		"Asia/Chita|LMT +08 +09 +10|-7x.Q -80 -90 -a0|012323232323232323232321232323232323232323232323232323232323232312|-21Q7x.Q pAnx.Q 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0 3re0|33e4",
		"Asia/Choibalsan|LMT ULAT ULAT CHOST CHOT CHOT CHOST|-7C -70 -80 -a0 -90 -80 -90|0123434343434343434343434343434343434343434343456565656565656565656565656565656565656565656565|-2APHC 2UkoC cKn0 1da0 1dd0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1fB0 1cL0 1cN0 1cL0 1cN0 1cL0 6hD0 11z0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 3Db0 h1f0 1cJ0 1cP0 1cJ0 1cP0 1fx0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1fx0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1fx0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1fx0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1cJ0|38e3",
		"Asia/Shanghai|CST CDT|-80 -90|01010101010101010|-1c1I0 LX0 16p0 1jz0 1Myp0 Rb0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0|23e6",
		"Asia/Colombo|MMT +0530 +06 +0630|-5j.w -5u -60 -6u|01231321|-2zOtj.w 1rFbN.w 1zzu 7Apu 23dz0 11zu n3cu|22e5",
		"Asia/Dhaka|HMT BURT IST DACT BDT BDST|-5R.k -6u -5u -60 -60 -70|01213454|-18LFR.k 1unn.k HB0 m6n0 LqMu 1x6n0 1i00|16e6",
		"Asia/Damascus|LMT EET EEST|-2p.c -20 -30|01212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-21Jep.c Hep.c 17b0 1ip0 17b0 1ip0 17b0 1ip0 19X0 1xRB0 11X0 1oN0 10L0 1pB0 11b0 1oN0 10L0 1mp0 13X0 1oN0 11b0 1pd0 11b0 1oN0 11b0 1oN0 11b0 1oN0 11b0 1pd0 11b0 1oN0 11b0 1oN0 11b0 1oN0 11b0 1pd0 11b0 1oN0 Nb0 1AN0 Nb0 bcp0 19X0 1gp0 19X0 3ld0 1xX0 Vd0 1Bz0 Sp0 1vX0 10p0 1dz0 1cN0 1cL0 1db0 1db0 1g10 1an0 1ap0 1db0 1fd0 1db0 1cN0 1db0 1dd0 1db0 1cp0 1dz0 1c10 1dX0 1cN0 1db0 1dd0 1db0 1cN0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1db0 1cN0 1db0 1cN0 19z0 1fB0 1qL0 11B0 1on0 Wp0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0|26e5",
		"Asia/Dili|LMT TLT JST TLT WITA|-8m.k -80 -90 -90 -80|012343|-2le8m.k 1dnXm.k 8HA0 1ew00 Xld0|19e4",
		"Asia/Dubai|LMT GST|-3F.c -40|01|-21JfF.c|39e5",
		"Asia/Dushanbe|LMT +05 +06 +07|-4z.c -50 -60 -70|012323232323232323232321|-1Pc4z.c eUnz.c 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2hB0|76e4",
		"Asia/Famagusta|LMT EET EEST +03|-2f.M -20 -30 -30|01212121212121212121212121212121212121212121212121212121212121212121212121212121212123|-1Vc2f.M 2a3cf.M 1cL0 1qp0 Xz0 19B0 19X0 1fB0 1db0 1cp0 1cL0 1fB0 19X0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1fB0 1cL0 1cN0 1cL0 1cN0 1o30 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 15U0",
		"Asia/Gaza|EET EEST IST IDT|-20 -30 -20 -30|010101010101010101010101010101012323232323232323232323232320101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-1c2q0 5Rb0 10r0 1px0 10N0 1pz0 16p0 1jB0 16p0 1jx0 pBd0 Vz0 1oN0 11b0 1oO0 10N0 1pz0 10N0 1pb0 10N0 1pb0 10N0 1pb0 10N0 1pz0 10N0 1pb0 10N0 1pb0 11d0 1oL0 dW0 hfB0 Db0 1fB0 Rb0 npB0 11z0 1C10 IL0 1s10 10n0 1o10 WL0 1zd0 On0 1ld0 11z0 1o10 14n0 1o10 14n0 1nd0 12n0 1nd0 Xz0 1q10 12n0 M10 C00 17c0 1io0 17c0 1io0 17c0 1o00 1cL0 1fB0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 17c0 1io0 18N0 1bz0 19z0 1gp0 1610 1iL0 11z0 1o10 14o0 1lA1 SKX 1xd1 MKX 1AN0 1a00 1fA0 1cL0 1cN0 1nX0 1210 1nz0 1220 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1qL0|18e5",
		"Asia/Hebron|EET EEST IST IDT|-20 -30 -20 -30|01010101010101010101010101010101232323232323232323232323232010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-1c2q0 5Rb0 10r0 1px0 10N0 1pz0 16p0 1jB0 16p0 1jx0 pBd0 Vz0 1oN0 11b0 1oO0 10N0 1pz0 10N0 1pb0 10N0 1pb0 10N0 1pb0 10N0 1pz0 10N0 1pb0 10N0 1pb0 11d0 1oL0 dW0 hfB0 Db0 1fB0 Rb0 npB0 11z0 1C10 IL0 1s10 10n0 1o10 WL0 1zd0 On0 1ld0 11z0 1o10 14n0 1o10 14n0 1nd0 12n0 1nd0 Xz0 1q10 12n0 M10 C00 17c0 1io0 17c0 1io0 17c0 1o00 1cL0 1fB0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 17c0 1io0 18N0 1bz0 19z0 1gp0 1610 1iL0 12L0 1mN0 14o0 1lc0 Tb0 1xd1 MKX bB0 cn0 1cN0 1a00 1fA0 1cL0 1cN0 1nX0 1210 1nz0 1220 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1qL0|25e4",
		"Asia/Ho_Chi_Minh|LMT PLMT ICT IDT JST|-76.E -76.u -70 -80 -90|0123423232|-2yC76.E bK00.a 1h7b6.u 5lz0 18o0 3Oq0 k5b0 aW00 BAM0|90e5",
		"Asia/Hong_Kong|LMT HKT HKST JST|-7A.G -80 -90 -90|0121312121212121212121212121212121212121212121212121212121212121212121|-2CFHA.G 1sEP6.G 1cL0 ylu 93X0 1qQu 1tX0 Rd0 1In0 NB0 1cL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1kL0 14N0 1nX0 U10 1tz0 U10 1wn0 Rd0 1wn0 U10 1tz0 U10 1tz0 U10 1tz0 U10 1wn0 Rd0 1wn0 Rd0 1wn0 U10 1tz0 U10 1tz0 17d0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 s10 1Vz0 1cN0 1cL0 1cN0 1cL0 6fd0 14n0|73e5",
		"Asia/Hovd|LMT HOVT HOVT HOVST|-66.A -60 -70 -80|012323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232|-2APG6.A 2Uko6.A cKn0 1db0 1dd0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1fB0 1cL0 1cN0 1cL0 1cN0 1cL0 6hD0 11z0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 kEp0 1cJ0 1cP0 1cJ0 1cP0 1fx0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1fx0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1fx0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1fx0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1cJ0|81e3",
		"Asia/Irkutsk|IMT +07 +08 +09|-6V.5 -70 -80 -90|01232323232323232323232123232323232323232323232323232323232323232|-21zGV.5 pjXV.5 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0|60e4",
		"Europe/Istanbul|IMT EET EEST +04 +03|-1U.U -20 -30 -40 -30|012121212121212121212121212121212121212121212121212121234343434342121212121212121212121212121212121212121212121212121212121212124|-2ogNU.U dzzU.U 11b0 8tB0 1on0 1410 1db0 19B0 1in0 3Rd0 Un0 1oN0 11b0 zSp0 CL0 mN0 1Vz0 1gN0 1pz0 5Rd0 1fz0 1yp0 ML0 1kp0 17b0 1ip0 17b0 1fB0 19X0 1jB0 18L0 1ip0 17z0 qdd0 xX0 3S10 Tz0 dA10 11z0 1o10 11z0 1qN0 11z0 1ze0 11B0 WM0 1qO0 WI0 1nX0 1rB0 10L0 11B0 1in0 17d0 1in0 2pX0 19E0 1fU0 16Q0 1iI0 16Q0 1iI0 1Vd0 pb0 3Kp0 14o0 1de0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1a00 1fA0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WO0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 Xc0 1qo0 WM0 1qM0 11A0 1o00 1200 1nA0 11A0 1tA0 U00 15w0|13e6",
		"Asia/Jakarta|BMT JAVT WIB JST WIB WIB|-77.c -7k -7u -90 -80 -70|01232425|-1Q0Tk luM0 mPzO 8vWu 6kpu 4PXu xhcu|31e6",
		"Asia/Jayapura|LMT WIT ACST|-9m.M -90 -9u|0121|-1uu9m.M sMMm.M L4nu|26e4",
		"Asia/Jerusalem|JMT IST IDT IDDT|-2k.E -20 -30 -40|01212121212132121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-26Bek.E SyMk.E 5Rb0 10r0 1px0 10N0 1pz0 16p0 1jB0 16p0 1jx0 3LB0 Em0 or0 1cn0 1dB0 16n0 10O0 1ja0 1tC0 14o0 1cM0 1a00 11A0 1Na0 An0 1MP0 AJ0 1Kp0 LC0 1oo0 Wl0 EQN0 Db0 1fB0 Rb0 npB0 11z0 1C10 IL0 1s10 10n0 1o10 WL0 1zd0 On0 1ld0 11z0 1o10 14n0 1o10 14n0 1nd0 12n0 1nd0 Xz0 1q10 12n0 1hB0 1dX0 1ep0 1aL0 1eN0 17X0 1nf0 11z0 1tB0 19W0 1e10 17b0 1ep0 1gL0 18N0 1fz0 1eN0 17b0 1gq0 1gn0 19d0 1dz0 1c10 17X0 1hB0 1gn0 19d0 1dz0 1c10 17X0 1kp0 1dz0 1c10 1aL0 1eN0 1oL0 10N0 1oL0 10N0 1oL0 10N0 1rz0 W10 1rz0 W10 1rz0 10N0 1oL0 10N0 1oL0 10N0 1rz0 W10 1rz0 W10 1rz0 10N0 1oL0 10N0 1oL0 10N0 1oL0 10N0 1rz0 W10 1rz0 W10 1rz0 10N0 1oL0 10N0 1oL0 10N0 1rz0 W10 1rz0 W10 1rz0 W10 1rz0 10N0 1oL0 10N0 1oL0|81e4",
		"Asia/Kabul|AFT AFT|-40 -4u|01|-10Qs0|46e5",
		"Asia/Kamchatka|LMT +11 +12 +13|-ay.A -b0 -c0 -d0|012323232323232323232321232323232323232323232323232323232323212|-1SLKy.A ivXy.A 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 2sp0 WM0|18e4",
		"Asia/Karachi|LMT IST IST KART PKT PKST|-4s.c -5u -6u -50 -50 -60|012134545454|-2xoss.c 1qOKW.c 7zX0 eup0 LqMu 1fy00 1cL0 dK10 11b0 1610 1jX0|24e6",
		"Asia/Urumqi|LMT XJT|-5O.k -60|01|-1GgtO.k|32e5",
		"Asia/Kathmandu|LMT IST NPT|-5F.g -5u -5J|012|-21JhF.g 2EGMb.g|12e5",
		"Asia/Khandyga|LMT +08 +09 +10 +11|-92.d -80 -90 -a0 -b0|0123232323232323232323212323232323232323232323232343434343434343432|-21Q92.d pAp2.d 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 qK0 yN0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 17V0 7zD0|66e2",
		"Asia/Krasnoyarsk|LMT +06 +07 +08|-6b.q -60 -70 -80|01232323232323232323232123232323232323232323232323232323232323232|-21Hib.q prAb.q 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0|10e5",
		"Asia/Kuala_Lumpur|SMT MALT MALST MALT MALT JST MYT|-6T.p -70 -7k -7k -7u -90 -80|01234546|-2Bg6T.p 17anT.p 7hXE dM00 17bO 8Fyu 1so1u|71e5",
		"Asia/Kuching|LMT BORT BORT BORTST JST MYT|-7l.k -7u -80 -8k -90 -80|01232323232323232425|-1KITl.k gDbP.k 6ynu AnE 1O0k AnE 1NAk AnE 1NAk AnE 1NAk AnE 1O0k AnE 1NAk AnE pAk 8Fz0 1so10|13e4",
		"Asia/Macau|LMT MOT MOST CST|-7y.k -80 -90 -80|0121212121212121212121212121212121212121213|-2le7y.k 1XO34.k 1wn0 Rd0 1wn0 R9u 1wqu U10 1tz0 TVu 1tz0 17gu 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cJu 1cL0 1cN0 1fz0 1cN0 1cOu 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cJu 1cL0 1cN0 1fz0 1cN0 1cL0 KEp0|57e4",
		"Asia/Magadan|LMT +10 +11 +12|-a3.c -a0 -b0 -c0|012323232323232323232321232323232323232323232323232323232323232312|-1Pca3.c eUo3.c 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0 3Cq0|95e3",
		"Asia/Makassar|LMT MMT WITA JST|-7V.A -7V.A -80 -90|01232|-21JjV.A vfc0 myLV.A 8ML0|15e5",
		"Asia/Manila|PHT PHST JST|-80 -90 -90|010201010|-1kJI0 AL0 cK10 65X0 mXB0 vX0 VK10 1db0|24e6",
		"Asia/Nicosia|LMT EET EEST|-2d.s -20 -30|01212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-1Vc2d.s 2a3cd.s 1cL0 1qp0 Xz0 19B0 19X0 1fB0 1db0 1cp0 1cL0 1fB0 19X0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1fB0 1cL0 1cN0 1cL0 1cN0 1o30 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|32e4",
		"Asia/Novokuznetsk|LMT +06 +07 +08|-5M.M -60 -70 -80|012323232323232323232321232323232323232323232323232323232323212|-1PctM.M eULM.M 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 2sp0 WM0|55e4",
		"Asia/Novosibirsk|LMT +06 +07 +08|-5v.E -60 -70 -80|0123232323232323232323212323212121212121212121212121212121212121212|-21Qnv.E pAFv.E 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 ml0 Os0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0 4eN0|15e5",
		"Asia/Omsk|LMT +05 +06 +07|-4R.u -50 -60 -70|01232323232323232323232123232323232323232323232323232323232323232|-224sR.u pMLR.u 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0|12e5",
		"Asia/Oral|LMT +04 +05 +06|-3p.o -40 -50 -60|01232323232323232121212121212121212121212121212|-1Pc3p.o eUnp.o 23CL0 3Db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 2pB0 1cM0 1fA0 1cM0 1cM0 IM0 1EM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0|27e4",
		"Asia/Pontianak|LMT PMT WIB JST WIB WITA WIB|-7h.k -7h.k -7u -90 -80 -80 -70|012324256|-2ua7h.k XE00 munL.k 8Rau 6kpu 4PXu xhcu Wqnu|23e4",
		"Asia/Pyongyang|LMT KST JCST JST KST|-8n -8u -90 -90 -90|012341|-2um8n 97XR 12FXu jdA0 2Onc0|29e5",
		"Asia/Qyzylorda|LMT +04 +05 +06|-4l.Q -40 -50 -60|0123232323232323232323232323232323232323232323|-1Pc4l.Q eUol.Q 23CL0 3Db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 3ao0 1EM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0|73e4",
		"Asia/Rangoon|RMT BURT JST MMT|-6o.E -6u -90 -6u|0123|-21Jio.E SmnS.E 7j9u|48e5",
		"Asia/Sakhalin|LMT +09 +11 +12 +10|-9u.M -90 -b0 -c0 -a0|01232323232323232323232423232323232424242424242424242424242424242|-2AGVu.M 1BoMu.M 1qFa0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 2pB0 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0 3rd0|58e4",
		"Asia/Samarkand|LMT +04 +05 +06|-4r.R -40 -50 -60|01232323232323232323232|-1Pc4r.R eUor.R 23CL0 3Db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0|36e4",
		"Asia/Seoul|LMT KST JCST JST KST KDT KDT|-8r.Q -8u -90 -90 -90 -9u -a0|01234151515151515146464|-2um8r.Q 97XV.Q 12FXu jjA0 kKo0 2I0u OL0 1FB0 Rb0 1qN0 TX0 1tB0 TX0 1tB0 TX0 1tB0 TX0 2ap0 12FBu 11A0 1o00 11A0|23e6",
		"Asia/Singapore|SMT MALT MALST MALT MALT JST SGT SGT|-6T.p -70 -7k -7k -7u -90 -7u -80|012345467|-2Bg6T.p 17anT.p 7hXE dM00 17bO 8Fyu Mspu DTA0|56e5",
		"Asia/Srednekolymsk|LMT +10 +11 +12|-ae.Q -a0 -b0 -c0|01232323232323232323232123232323232323232323232323232323232323232|-1Pcae.Q eUoe.Q 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0|35e2",
		"Asia/Taipei|JWST JST CST CDT|-80 -90 -80 -90|01232323232323232323232323232323232323232|-1iw80 joM0 1yo0 Tz0 1ip0 1jX0 1cN0 11b0 1oN0 11b0 1oN0 11b0 1oN0 11b0 10N0 1BX0 10p0 1pz0 10p0 1pz0 10p0 1db0 1dd0 1db0 1cN0 1db0 1cN0 1db0 1cN0 1db0 1BB0 ML0 1Bd0 ML0 uq10 1db0 1cN0 1db0 97B0 AL0|74e5",
		"Asia/Tashkent|LMT +05 +06 +07|-4B.b -50 -60 -70|012323232323232323232321|-1Pc4B.b eUnB.b 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0|23e5",
		"Asia/Tbilisi|TBMT +03 +04 +05|-2X.b -30 -40 -50|0123232323232323232323212121232323232323232323212|-1Pc2X.b 1jUnX.b WCL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 1cK0 1cL0 1cN0 1cL0 1cN0 2pz0 1cL0 1fB0 3Nz0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 An0 Os0 WM0|11e5",
		"Asia/Tehran|LMT TMT IRST IRST IRDT IRDT|-3p.I -3p.I -3u -40 -50 -4u|01234325252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252|-2btDp.I 1d3c0 1huLT.I TXu 1pz0 sN0 vAu 1cL0 1dB0 1en0 pNB0 UL0 1cN0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cN0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cN0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cN0 1dz0 64p0 1dz0 1cN0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cN0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cN0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cN0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cN0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cN0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cN0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0|14e6",
		"Asia/Thimphu|LMT IST BTT|-5W.A -5u -60|012|-Su5W.A 1BGMs.A|79e3",
		"Asia/Tokyo|JCST JST JDT|-90 -90 -a0|0121212121|-1iw90 pKq0 QL0 1lB0 13X0 1zB0 NX0 1zB0 NX0|38e6",
		"Asia/Tomsk|LMT +06 +07 +08|-5D.P -60 -70 -80|0123232323232323232323212323232323232323232323212121212121212121212|-21NhD.P pxzD.P 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 co0 1bB0 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0 3Qp0|10e5",
		"Asia/Ulaanbaatar|LMT ULAT ULAT ULAST|-77.w -70 -80 -90|012323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232|-2APH7.w 2Uko7.w cKn0 1db0 1dd0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1fB0 1cL0 1cN0 1cL0 1cN0 1cL0 6hD0 11z0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 kEp0 1cJ0 1cP0 1cJ0 1cP0 1fx0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1fx0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1fx0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1fx0 1cP0 1cJ0 1cP0 1cJ0 1cP0 1cJ0|12e5",
		"Asia/Ust-Nera|LMT +08 +09 +12 +11 +10|-9w.S -80 -90 -c0 -b0 -a0|012343434343434343434345434343434343434343434343434343434343434345|-21Q9w.S pApw.S 23CL0 1d90 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 17V0 7zD0|65e2",
		"Asia/Vladivostok|LMT +09 +10 +11|-8L.v -90 -a0 -b0|01232323232323232323232123232323232323232323232323232323232323232|-1SJIL.v itXL.v 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0|60e4",
		"Asia/Yakutsk|LMT +08 +09 +10|-8C.W -80 -90 -a0|01232323232323232323232123232323232323232323232323232323232323232|-21Q8C.W pAoC.W 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0|28e4",
		"Asia/Yekaterinburg|LMT PMT +04 +05 +06|-42.x -3J.5 -40 -50 -60|012343434343434343434343234343434343434343434343434343434343434343|-2ag42.x 7mQh.s qBvJ.5 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0|14e5",
		"Asia/Yerevan|LMT +03 +04 +05|-2W -30 -40 -50|0123232323232323232323212121212323232323232323232323232323232|-1Pc2W 1jUnW WCL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 4RX0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0|13e5",
		"Atlantic/Azores|HMT AZOT AZOST AZOMT AZOT AZOST WET|1S.w 20 10 0 10 0 0|01212121212121212121212121212121212121212121232123212321232121212121212121212121212121212121212121454545454545454545454545454545456545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454|-2ldW5.s aPX5.s Sp0 LX0 1vc0 Tc0 1uM0 SM0 1vc0 Tc0 1vc0 SM0 1vc0 6600 1co0 3E00 17c0 1fA0 1a00 1io0 1a00 1io0 17c0 3I00 17c0 1cM0 1cM0 3Fc0 1cM0 1a00 1fA0 1io0 17c0 1cM0 1cM0 1a00 1fA0 1io0 1qM0 Dc0 1tA0 1cM0 1dc0 1400 gL0 IM0 s10 U00 dX0 Rc0 pd0 Rc0 gL0 Oo0 pd0 Rc0 gL0 Oo0 pd0 14o0 1cM0 1cP0 1cM0 1cM0 1cM0 1cM0 1cM0 3Co0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 qIl0 1cM0 1fA0 1cM0 1cM0 1cN0 1cL0 1cN0 1cM0 1cM0 1cM0 1cM0 1cN0 1cL0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cL0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|25e4",
		"Atlantic/Bermuda|LMT AST ADT|4j.i 40 30|0121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-1BnRE.G 1LTbE.G 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|65e3",
		"Atlantic/Canary|LMT CANT WET WEST|11.A 10 0 -10|01232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232|-1UtaW.o XPAW.o 1lAK0 1a10 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|54e4",
		"Atlantic/Cape_Verde|LMT CVT CVST CVT|1y.4 20 10 10|01213|-2xomp.U 1qOMp.U 7zX0 1djf0|50e4",
		"Atlantic/Faroe|LMT WET WEST|r.4 0 -10|01212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2uSnw.U 2Wgow.U 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|49e3",
		"Atlantic/Madeira|FMT MADT MADST MADMT WET WEST|17.A 10 0 -10 0 -10|01212121212121212121212121212121212121212121232123212321232121212121212121212121212121212121212121454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454|-2ldWQ.o aPWQ.o Sp0 LX0 1vc0 Tc0 1uM0 SM0 1vc0 Tc0 1vc0 SM0 1vc0 6600 1co0 3E00 17c0 1fA0 1a00 1io0 1a00 1io0 17c0 3I00 17c0 1cM0 1cM0 3Fc0 1cM0 1a00 1fA0 1io0 17c0 1cM0 1cM0 1a00 1fA0 1io0 1qM0 Dc0 1tA0 1cM0 1dc0 1400 gL0 IM0 s10 U00 dX0 Rc0 pd0 Rc0 gL0 Oo0 pd0 Rc0 gL0 Oo0 pd0 14o0 1cM0 1cP0 1cM0 1cM0 1cM0 1cM0 1cM0 3Co0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 qIl0 1cM0 1fA0 1cM0 1cM0 1cN0 1cL0 1cN0 1cM0 1cM0 1cM0 1cM0 1cN0 1cL0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|27e4",
		"Atlantic/Reykjavik|LMT IST ISST GMT|1s 10 0 0|012121212121212121212121212121212121212121212121212121212121212121213|-2uWmw mfaw 1Bd0 ML0 1LB0 Cn0 1LB0 3fX0 C10 HrX0 1cO0 LB0 1EL0 LA0 1C00 Oo0 1wo0 Rc0 1wo0 Rc0 1wo0 Rc0 1zc0 Oo0 1zc0 14o0 1lc0 14o0 1lc0 14o0 1o00 11A0 1lc0 14o0 1o00 14o0 1lc0 14o0 1lc0 14o0 1lc0 14o0 1lc0 14o0 1o00 14o0 1lc0 14o0 1lc0 14o0 1lc0 14o0 1lc0 14o0 1lc0 14o0 1o00 14o0 1lc0 14o0 1lc0 14o0 1lc0 14o0 1lc0 14o0 1o00 14o0|12e4",
		"Atlantic/South_Georgia|GST|20|0||30",
		"Atlantic/Stanley|SMT FKT FKST FKT FKST|3P.o 40 30 30 20|0121212121212134343212121212121212121212121212121212121212121212121212|-2kJw8.A 12bA8.A 19X0 1fB0 19X0 1ip0 19X0 1fB0 19X0 1fB0 19X0 1fB0 Cn0 1Cc10 WL0 1qL0 U10 1tz0 U10 1qM0 WN0 1qL0 WN0 1qL0 WN0 1qL0 WN0 1tz0 U10 1tz0 WN0 1qL0 WN0 1qL0 WN0 1qL0 WN0 1qL0 WN0 1tz0 WN0 1qL0 WN0 1qL0 WN0 1qL0 WN0 1qL0 WN0 1qN0 U10 1wn0 Rd0 1wn0 U10 1tz0 U10 1tz0 U10 1tz0 U10 1tz0 U10 1wn0 U10 1tz0 U10 1tz0 U10|21e2",
		"Australia/Sydney|AEST AEDT|-a0 -b0|0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101|-293lX xcX 10jd0 yL0 1cN0 1cL0 1fB0 19X0 17c10 LA0 1C00 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 14o0 1o00 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 U00 1qM0 WM0 1tA0 WM0 1tA0 U00 1tA0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 11A0 1o00 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 11A0 1o00 WM0 1qM0 14o0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0|40e5",
		"Australia/Adelaide|ACST ACDT|-9u -au|0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101|-293lt xcX 10jd0 yL0 1cN0 1cL0 1fB0 19X0 17c10 LA0 1C00 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 U00 1qM0 WM0 1tA0 WM0 1tA0 U00 1tA0 U00 1tA0 Oo0 1zc0 WM0 1qM0 Rc0 1zc0 U00 1tA0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 11A0 1o00 WM0 1qM0 14o0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0|11e5",
		"Australia/Brisbane|AEST AEDT|-a0 -b0|01010101010101010|-293lX xcX 10jd0 yL0 1cN0 1cL0 1fB0 19X0 17c10 LA0 H1A0 Oo0 1zc0 Oo0 1zc0 Oo0|20e5",
		"Australia/Broken_Hill|ACST ACDT|-9u -au|0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101|-293lt xcX 10jd0 yL0 1cN0 1cL0 1fB0 19X0 17c10 LA0 1C00 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 14o0 1o00 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 U00 1qM0 WM0 1tA0 WM0 1tA0 U00 1tA0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 11A0 1o00 WM0 1qM0 14o0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0|18e3",
		"Australia/Currie|AEST AEDT|-a0 -b0|0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101|-29E80 19X0 10jd0 yL0 1cN0 1cL0 1fB0 19X0 17c10 LA0 1C00 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 11A0 1qM0 WM0 1qM0 Oo0 1zc0 Oo0 1zc0 Oo0 1wo0 WM0 1tA0 WM0 1tA0 U00 1tA0 U00 1tA0 11A0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 11A0 1o00 1io0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1cM0 1a00 1io0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0|746",
		"Australia/Darwin|ACST ACDT|-9u -au|010101010|-293lt xcX 10jd0 yL0 1cN0 1cL0 1fB0 19X0|12e4",
		"Australia/Eucla|ACWST ACWDT|-8J -9J|0101010101010101010|-293kI xcX 10jd0 yL0 1cN0 1cL0 1gSp0 Oo0 l5A0 Oo0 iJA0 G00 zU00 IM0 1qM0 11A0 1o00 11A0|368",
		"Australia/Hobart|AEST AEDT|-a0 -b0|010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101|-29E80 19X0 10jd0 yL0 1cN0 1cL0 1fB0 19X0 VfB0 1cM0 1o00 Rc0 1wo0 Rc0 1wo0 U00 1wo0 LA0 1C00 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 11A0 1qM0 WM0 1qM0 Oo0 1zc0 Oo0 1zc0 Oo0 1wo0 WM0 1tA0 WM0 1tA0 U00 1tA0 U00 1tA0 11A0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 11A0 1o00 1io0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1cM0 1a00 1io0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0|21e4",
		"Australia/Lord_Howe|AEST LHST LHDT LHDT|-a0 -au -bu -b0|0121212121313131313131313131313131313131313131313131313131313131313131313131313131313131313131313131313131313131313|raC0 1zdu Rb0 1zd0 On0 1zd0 On0 1zd0 On0 1zd0 TXu 1qMu WLu 1tAu WLu 1tAu TXu 1tAu Onu 1zcu Onu 1zcu Onu 1zcu Rbu 1zcu Onu 1zcu Onu 1zcu 11zu 1o0u 11zu 1o0u 11zu 1o0u 11zu 1qMu WLu 11Au 1nXu 1qMu 11zu 1o0u 11zu 1o0u 11zu 1qMu WLu 1qMu 11zu 1o0u WLu 1qMu 14nu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1fAu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1fAu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1fzu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1fAu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1fAu 1cLu 1cMu 1cLu 1cMu|347",
		"Australia/Lindeman|AEST AEDT|-a0 -b0|010101010101010101010|-293lX xcX 10jd0 yL0 1cN0 1cL0 1fB0 19X0 17c10 LA0 H1A0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0|10",
		"Australia/Melbourne|AEST AEDT|-a0 -b0|0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101|-293lX xcX 10jd0 yL0 1cN0 1cL0 1fB0 19X0 17c10 LA0 1C00 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 U00 1qM0 WM0 1qM0 11A0 1tA0 U00 1tA0 U00 1tA0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 11A0 1o00 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 11A0 1o00 WM0 1qM0 14o0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0|39e5",
		"Australia/Perth|AWST AWDT|-80 -90|0101010101010101010|-293jX xcX 10jd0 yL0 1cN0 1cL0 1gSp0 Oo0 l5A0 Oo0 iJA0 G00 zU00 IM0 1qM0 11A0 1o00 11A0|18e5",
		"CET|CET CEST|-10 -20|01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2aFe0 11d0 1iO0 11A0 1o00 11A0 Qrc0 6i00 WM0 1fA0 1cM0 1cM0 1cM0 16M0 1gMM0 1a00 1fA0 1cM0 1cM0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00",
		"CST6CDT|CST CDT CWT CPT|60 50 50 50|010102301010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-261s0 1nX0 11B0 1nX0 SgN0 8x30 iw0 QwN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0",
		"Pacific/Easter|EMT EAST EASST EAST EASST|7h.s 70 60 60 50|0121212121212121212121212121234343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434|-1uSgG.w 1s4IG.w WL0 1zd0 On0 1ip0 11z0 1o10 11z0 1qN0 WL0 1ld0 14n0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 WL0 1qN0 1cL0 1cN0 11z0 1o10 11z0 1qN0 WL0 1fB0 19X0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 17b0 1ip0 11z0 1ip0 1fz0 1fB0 11z0 1qN0 WL0 1qN0 WL0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 17b0 1ip0 11z0 1o10 19X0 1fB0 1nX0 G10 1EL0 Op0 1zb0 Rd0 1wn0 Rd0 46n0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Dd0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Dd0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Dd0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1Nb0 Ap0|30e2",
		"EET|EET EEST|-20 -30|010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|hDB0 1a00 1fA0 1cM0 1cM0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00",
		"EST|EST|50|0|",
		"EST5EDT|EST EDT EWT EPT|50 40 40 40|010102301010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-261t0 1nX0 11B0 1nX0 SgN0 8x40 iv0 QwN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0",
		"Europe/Dublin|DMT IST GMT BST IST|p.l -y.D 0 -10 -10|01232323232324242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242|-2ax9y.D Rc0 1fzy.D 14M0 1fc0 1g00 1co0 1dc0 1co0 1oo0 1400 1dc0 19A0 1io0 1io0 WM0 1o00 14o0 1o00 17c0 1io0 17c0 1fA0 1a00 1lc0 17c0 1io0 17c0 1fA0 1a00 1io0 17c0 1io0 17c0 1fA0 1cM0 1io0 17c0 1fA0 1a00 1io0 17c0 1io0 17c0 1fA0 1a00 1io0 1qM0 Dc0 g5X0 14p0 1wn0 17d0 1io0 11A0 1o00 17c0 1fA0 1a00 1fA0 1cM0 1fA0 1a00 17c0 1fA0 1a00 1io0 17c0 1lc0 17c0 1fA0 1a00 1io0 17c0 1io0 17c0 1fA0 1a00 1a00 1qM0 WM0 1qM0 11A0 1o00 WM0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1tA0 IM0 90o0 U00 1tA0 U00 1tA0 U00 1tA0 U00 1tA0 WM0 1qM0 WM0 1qM0 WM0 1tA0 U00 1tA0 U00 1tA0 11z0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 14o0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|12e5",
		"Etc/GMT+0|GMT|0|0|",
		"Etc/GMT+1|-01|10|0|",
		"Etc/GMT+10|-10|a0|0|",
		"Etc/GMT+11|-11|b0|0|",
		"Etc/GMT+12|-12|c0|0|",
		"Etc/GMT+2|-02|20|0|",
		"Etc/GMT+3|-03|30|0|",
		"Etc/GMT+4|-04|40|0|",
		"Etc/GMT+5|-05|50|0|",
		"Etc/GMT+6|-06|60|0|",
		"Etc/GMT+7|-07|70|0|",
		"Etc/GMT+8|-08|80|0|",
		"Etc/GMT+9|-09|90|0|",
		"Etc/GMT-1|+01|-10|0|",
		"Etc/GMT-10|+10|-a0|0|",
		"Etc/GMT-11|+11|-b0|0|",
		"Etc/GMT-12|+12|-c0|0|",
		"Etc/GMT-13|+13|-d0|0|",
		"Etc/GMT-14|+14|-e0|0|",
		"Etc/GMT-2|+02|-20|0|",
		"Etc/GMT-3|+03|-30|0|",
		"Etc/GMT-4|+04|-40|0|",
		"Etc/GMT-5|+05|-50|0|",
		"Etc/GMT-6|+06|-60|0|",
		"Etc/GMT-7|+07|-70|0|",
		"Etc/GMT-8|+08|-80|0|",
		"Etc/GMT-9|+09|-90|0|",
		"Etc/UCT|UCT|0|0|",
		"Etc/UTC|UTC|0|0|",
		"Europe/Amsterdam|AMT NST NEST NET CEST CET|-j.w -1j.w -1k -k -20 -10|010101010101010101010101010101010101010101012323234545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545|-2aFcj.w 11b0 1iP0 11A0 1io0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1co0 1io0 1yo0 Pc0 1a00 1fA0 1Bc0 Mo0 1tc0 Uo0 1tA0 U00 1uo0 W00 1s00 VA0 1so0 Vc0 1sM0 UM0 1wo0 Rc0 1u00 Wo0 1rA0 W00 1s00 VA0 1sM0 UM0 1w00 fV0 BCX.w 1tA0 U00 1u00 Wo0 1sm0 601k WM0 1fA0 1cM0 1cM0 1cM0 16M0 1gMM0 1a00 1fA0 1cM0 1cM0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|16e5",
		"Europe/Andorra|WET CET CEST|0 -10 -20|012121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-UBA0 1xIN0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|79e3",
		"Europe/Astrakhan|LMT +03 +04 +05|-3c.c -30 -40 -50|012323232323232323212121212121212121212121212121212121212121212|-1Pcrc.c eUMc.c 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 2pB0 1cM0 1fA0 1cM0 3Co0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0 3rd0",
		"Europe/Athens|AMT EET EEST CEST CET|-1y.Q -20 -30 -20 -10|012123434121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2a61x.Q CNbx.Q mn0 kU10 9b0 3Es0 Xa0 1fb0 1dd0 k3X0 Nz0 SCp0 1vc0 SO0 1cM0 1a00 1ao0 1fc0 1a10 1fG0 1cg0 1dX0 1bX0 1cQ0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|35e5",
		"Europe/London|GMT BST BDST|0 -10 -20|0101010101010101010101010101010101010101010101010121212121210101210101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2axa0 Rc0 1fA0 14M0 1fc0 1g00 1co0 1dc0 1co0 1oo0 1400 1dc0 19A0 1io0 1io0 WM0 1o00 14o0 1o00 17c0 1io0 17c0 1fA0 1a00 1lc0 17c0 1io0 17c0 1fA0 1a00 1io0 17c0 1io0 17c0 1fA0 1cM0 1io0 17c0 1fA0 1a00 1io0 17c0 1io0 17c0 1fA0 1a00 1io0 1qM0 Dc0 2Rz0 Dc0 1zc0 Oo0 1zc0 Rc0 1wo0 17c0 1iM0 FA0 xB0 1fA0 1a00 14o0 bb0 LA0 xB0 Rc0 1wo0 11A0 1o00 17c0 1fA0 1a00 1fA0 1cM0 1fA0 1a00 17c0 1fA0 1a00 1io0 17c0 1lc0 17c0 1fA0 1a00 1io0 17c0 1io0 17c0 1fA0 1a00 1a00 1qM0 WM0 1qM0 11A0 1o00 WM0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1tA0 IM0 90o0 U00 1tA0 U00 1tA0 U00 1tA0 U00 1tA0 WM0 1qM0 WM0 1qM0 WM0 1tA0 U00 1tA0 U00 1tA0 11z0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 14o0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|10e6",
		"Europe/Belgrade|CET CEST|-10 -20|01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-19RC0 3IP0 WM0 1fA0 1cM0 1cM0 1rc0 Qo0 1vmo0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|12e5",
		"Europe/Berlin|CET CEST CEMT|-10 -20 -30|01010101010101210101210101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2aFe0 11d0 1iO0 11A0 1o00 11A0 Qrc0 6i00 WM0 1fA0 1cM0 1cM0 1cM0 kL0 Nc0 m10 WM0 1ao0 1cp0 dX0 jz0 Dd0 1io0 17c0 1fA0 1a00 1ehA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|41e5",
		"Europe/Prague|CET CEST|-10 -20|010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2aFe0 11d0 1iO0 11A0 1o00 11A0 Qrc0 6i00 WM0 1fA0 1cM0 16M0 1lc0 1tA0 17A0 11c0 1io0 17c0 1io0 17c0 1fc0 1ao0 1bNc0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|13e5",
		"Europe/Brussels|WET CET CEST WEST|0 -10 -20 -10|0121212103030303030303030303030303030303030303030303212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2ehc0 3zX0 11c0 1iO0 11A0 1o00 11A0 my0 Ic0 1qM0 Rc0 1EM0 UM0 1u00 10o0 1io0 1io0 17c0 1a00 1fA0 1cM0 1cM0 1io0 17c0 1fA0 1a00 1io0 1a30 1io0 17c0 1fA0 1a00 1io0 17c0 1cM0 1cM0 1a00 1io0 1cM0 1cM0 1a00 1fA0 1io0 17c0 1cM0 1cM0 1a00 1fA0 1io0 1qM0 Dc0 y00 5Wn0 WM0 1fA0 1cM0 16M0 1iM0 16M0 1C00 Uo0 1eeo0 1a00 1fA0 1cM0 1cM0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|21e5",
		"Europe/Bucharest|BMT EET EEST|-1I.o -20 -30|0121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-1xApI.o 20LI.o RA0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1Axc0 On0 1fA0 1a10 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cK0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cL0 1cN0 1cL0 1fB0 1nX0 11E0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|19e5",
		"Europe/Budapest|CET CEST|-10 -20|0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2aFe0 11d0 1iO0 11A0 1ip0 17b0 1op0 1tb0 Q2m0 3Ne0 WM0 1fA0 1cM0 1cM0 1oJ0 1dc0 1030 1fA0 1cM0 1cM0 1cM0 1cM0 1fA0 1a00 1iM0 1fA0 8Ha0 Rb0 1wN0 Rb0 1BB0 Lz0 1C20 LB0 SNX0 1a10 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|17e5",
		"Europe/Zurich|CET CEST|-10 -20|01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-19Lc0 11A0 1o00 11A0 1xG10 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|38e4",
		"Europe/Chisinau|CMT BMT EET EEST CEST CET MSK MSD|-1T -1I.o -20 -30 -20 -10 -30 -40|012323232323232323234545467676767676767676767323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232|-26jdT wGMa.A 20LI.o RA0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 27A0 2en0 39g0 WM0 1fA0 1cM0 V90 1t7z0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 gL0 WO0 1cM0 1cM0 1cK0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1fB0 1nX0 11D0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|67e4",
		"Europe/Copenhagen|CET CEST|-10 -20|0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2azC0 Tz0 VuO0 60q0 WM0 1fA0 1cM0 1cM0 1cM0 S00 1HA0 Nc0 1C00 Dc0 1Nc0 Ao0 1h5A0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|12e5",
		"Europe/Gibraltar|GMT BST BDST CET CEST|0 -10 -20 -10 -20|010101010101010101010101010101010101010101010101012121212121010121010101010101010101034343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343|-2axa0 Rc0 1fA0 14M0 1fc0 1g00 1co0 1dc0 1co0 1oo0 1400 1dc0 19A0 1io0 1io0 WM0 1o00 14o0 1o00 17c0 1io0 17c0 1fA0 1a00 1lc0 17c0 1io0 17c0 1fA0 1a00 1io0 17c0 1io0 17c0 1fA0 1cM0 1io0 17c0 1fA0 1a00 1io0 17c0 1io0 17c0 1fA0 1a00 1io0 1qM0 Dc0 2Rz0 Dc0 1zc0 Oo0 1zc0 Rc0 1wo0 17c0 1iM0 FA0 xB0 1fA0 1a00 14o0 bb0 LA0 xB0 Rc0 1wo0 11A0 1o00 17c0 1fA0 1a00 1fA0 1cM0 1fA0 1a00 17c0 1fA0 1a00 1io0 17c0 1lc0 17c0 1fA0 10Jz0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|30e3",
		"Europe/Helsinki|HMT EET EEST|-1D.N -20 -30|0121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-1WuND.N OULD.N 1dA0 1xGq0 1cM0 1cM0 1cM0 1cN0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|12e5",
		"Europe/Kaliningrad|CET CEST CET CEST MSK MSD EEST EET +03|-10 -20 -20 -30 -30 -40 -30 -20 -30|0101010101010232454545454545454546767676767676767676767676767676767676767676787|-2aFe0 11d0 1iO0 11A0 1o00 11A0 Qrc0 6i00 WM0 1fA0 1cM0 1cM0 Am0 Lb0 1en0 op0 1pNz0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cN0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0|44e4",
		"Europe/Kiev|KMT EET MSK CEST CET MSD EEST|-22.4 -20 -30 -20 -10 -40 -30|0123434252525252525252525256161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161|-1Pc22.4 eUo2.4 rnz0 2Hg0 WM0 1fA0 da0 1v4m0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 Db0 3220 1cK0 1cL0 1cN0 1cL0 1cN0 1cL0 1cQ0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|34e5",
		"Europe/Kirov|LMT +03 +04 +05|-3i.M -30 -40 -50|01232323232323232321212121212121212121212121212121212121212121|-22WM0 qH90 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 2pB0 1cM0 1fA0 1cM0 3Co0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0|48e4",
		"Europe/Lisbon|LMT WET WEST WEMT CET CEST|A.J 0 -10 -20 -10 -20|012121212121212121212121212121212121212121212321232123212321212121212121212121212121212121212121214121212121212121212121212121212124545454212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2ldXn.f aPWn.f Sp0 LX0 1vc0 Tc0 1uM0 SM0 1vc0 Tc0 1vc0 SM0 1vc0 6600 1co0 3E00 17c0 1fA0 1a00 1io0 1a00 1io0 17c0 3I00 17c0 1cM0 1cM0 3Fc0 1cM0 1a00 1fA0 1io0 17c0 1cM0 1cM0 1a00 1fA0 1io0 1qM0 Dc0 1tA0 1cM0 1dc0 1400 gL0 IM0 s10 U00 dX0 Rc0 pd0 Rc0 gL0 Oo0 pd0 Rc0 gL0 Oo0 pd0 14o0 1cM0 1cP0 1cM0 1cM0 1cM0 1cM0 1cM0 3Co0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 pvy0 1cM0 1cM0 1fA0 1cM0 1cM0 1cN0 1cL0 1cN0 1cM0 1cM0 1cM0 1cM0 1cN0 1cL0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|27e5",
		"Europe/Luxembourg|LMT CET CEST WET WEST WEST WET|-o.A -10 -20 0 -10 -20 -10|0121212134343434343434343434343434343434343434343434565651212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2DG0o.A t6mo.A TB0 1nX0 Up0 1o20 11A0 rW0 CM0 1qP0 R90 1EO0 UK0 1u20 10m0 1ip0 1in0 17e0 19W0 1fB0 1db0 1cp0 1in0 17d0 1fz0 1a10 1in0 1a10 1in0 17f0 1fA0 1a00 1io0 17c0 1cM0 1cM0 1a00 1io0 1cM0 1cM0 1a00 1fA0 1io0 17c0 1cM0 1cM0 1a00 1fA0 1io0 1qM0 Dc0 vA0 60L0 WM0 1fA0 1cM0 17c0 1io0 16M0 1C00 Uo0 1eeo0 1a00 1fA0 1cM0 1cM0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|54e4",
		"Europe/Madrid|WET WEST WEMT CET CEST|0 -10 -20 -10 -20|01010101010101010101010121212121234343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343|-28dd0 11A0 1go0 19A0 1co0 1dA0 b1A0 18o0 3I00 17c0 1fA0 1a00 1io0 1a00 1io0 17c0 iyo0 Rc0 18o0 1hc0 1io0 1a00 14o0 5aL0 MM0 1vc0 17A0 1i00 1bc0 1eo0 17d0 1in0 17A0 6hA0 10N0 XIL0 1a10 1in0 17d0 19X0 1cN0 1fz0 1a10 1fX0 1cp0 1cO0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|62e5",
		"Europe/Malta|CET CEST|-10 -20|0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2arB0 Lz0 1cN0 1db0 1410 1on0 Wp0 1qL0 17d0 1cL0 M3B0 5M20 WM0 1fA0 1co0 17c0 1iM0 16m0 1de0 1lc0 14m0 1lc0 WO0 1qM0 GTW0 On0 1C10 LA0 1C00 LA0 1EM0 LA0 1C00 LA0 1zc0 Oo0 1C00 Oo0 1co0 1cM0 1lA0 Xc0 1qq0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1iN0 19z0 1fB0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|42e4",
		"Europe/Minsk|MMT EET MSK CEST CET MSD EEST +03|-1O -20 -30 -20 -10 -40 -30 -30|01234343252525252525252525261616161616161616161616161616161616161617|-1Pc1O eUnO qNX0 3gQ0 WM0 1fA0 1cM0 Al0 1tsn0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 3Fc0 1cN0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0|19e5",
		"Europe/Monaco|PMT WET WEST WEMT CET CEST|-9.l 0 -10 -20 -10 -20|01212121212121212121212121212121212121212121212121232323232345454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454|-2nco9.l cNb9.l HA0 19A0 1iM0 11c0 1oo0 Wo0 1rc0 QM0 1EM0 UM0 1u00 10o0 1io0 1wo0 Rc0 1a00 1fA0 1cM0 1cM0 1io0 17c0 1fA0 1a00 1io0 1a00 1io0 17c0 1fA0 1a00 1io0 17c0 1cM0 1cM0 1a00 1io0 1cM0 1cM0 1a00 1fA0 1io0 17c0 1cM0 1cM0 1a00 1fA0 1io0 1qM0 Df0 2RV0 11z0 11B0 1ze0 WM0 1fA0 1cM0 1fa0 1aq0 16M0 1ekn0 1cL0 1fC0 1a00 1fA0 1cM0 1cM0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|38e3",
		"Europe/Moscow|MMT MMT MST MDST MSD MSK +05 EET EEST MSK|-2u.h -2v.j -3v.j -4v.j -40 -30 -50 -20 -30 -40|012132345464575454545454545454545458754545454545454545454545454545454545454595|-2ag2u.h 2pyW.W 1bA0 11X0 GN0 1Hb0 c4v.j ik0 3DA0 dz0 15A0 c10 2q10 iM10 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cN0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0|16e6",
		"Europe/Paris|PMT WET WEST CEST CET WEMT|-9.l 0 -10 -20 -10 -20|0121212121212121212121212121212121212121212121212123434352543434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434|-2nco8.l cNb8.l HA0 19A0 1iM0 11c0 1oo0 Wo0 1rc0 QM0 1EM0 UM0 1u00 10o0 1io0 1wo0 Rc0 1a00 1fA0 1cM0 1cM0 1io0 17c0 1fA0 1a00 1io0 1a00 1io0 17c0 1fA0 1a00 1io0 17c0 1cM0 1cM0 1a00 1io0 1cM0 1cM0 1a00 1fA0 1io0 17c0 1cM0 1cM0 1a00 1fA0 1io0 1qM0 Df0 Ik0 5M30 WM0 1fA0 1cM0 Vx0 hB0 1aq0 16M0 1ekn0 1cL0 1fC0 1a00 1fA0 1cM0 1cM0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|11e6",
		"Europe/Riga|RMT LST EET MSK CEST CET MSD EEST|-1A.y -2A.y -20 -30 -20 -10 -40 -30|010102345454536363636363636363727272727272727272727272727272727272727272727272727272727272727272727272727272727272727272727272|-25TzA.y 11A0 1iM0 ko0 gWm0 yDXA.y 2bX0 3fE0 WM0 1fA0 1cM0 1cM0 4m0 1sLy0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cN0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cN0 1o00 11A0 1o00 11A0 1qM0 3oo0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|64e4",
		"Europe/Rome|CET CEST|-10 -20|0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2arB0 Lz0 1cN0 1db0 1410 1on0 Wp0 1qL0 17d0 1cL0 M3B0 5M20 WM0 1fA0 1cM0 16M0 1iM0 16m0 1de0 1lc0 14m0 1lc0 WO0 1qM0 GTW0 On0 1C10 LA0 1C00 LA0 1EM0 LA0 1C00 LA0 1zc0 Oo0 1C00 Oo0 1C00 LA0 1zc0 Oo0 1C00 LA0 1C00 LA0 1zc0 Oo0 1C00 Oo0 1zc0 Oo0 1fC0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|39e5",
		"Europe/Samara|LMT +03 +04 +05|-3k.k -30 -40 -50|0123232323232323232121232323232323232323232323232323232323212|-22WM0 qH90 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 2pB0 1cM0 1fA0 2y10 14m0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 2sp0 WM0|12e5",
		"Europe/Saratov|LMT +03 +04 +05|-34.i -30 -40 -50|012323232323232321212121212121212121212121212121212121212121212|-22WM0 qH90 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 2pB0 1cM0 1cM0 1cM0 1fA0 1cM0 3Co0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0 5810",
		"Europe/Simferopol|SMT EET MSK CEST CET MSD EEST MSK|-2g -20 -30 -20 -10 -40 -30 -40|012343432525252525252525252161616525252616161616161616161616161616161616172|-1Pc2g eUog rEn0 2qs0 WM0 1fA0 1cM0 3V0 1u0L0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1Q00 4eL0 1cL0 1cN0 1cL0 1cN0 dX0 WL0 1cN0 1cL0 1fB0 1o30 11B0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11z0 1nW0|33e4",
		"Europe/Sofia|EET CET CEST EEST|-20 -10 -20 -30|01212103030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030|-168L0 WM0 1fA0 1cM0 1cM0 1cN0 1mKH0 1dd0 1fb0 1ap0 1fb0 1a20 1fy0 1a30 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cK0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1fB0 1nX0 11E0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|12e5",
		"Europe/Stockholm|CET CEST|-10 -20|01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2azC0 TB0 2yDe0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|15e5",
		"Europe/Tallinn|TMT CET CEST EET MSK MSD EEST|-1D -10 -20 -20 -30 -40 -30|012103421212454545454545454546363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363|-26oND teD 11A0 1Ta0 4rXl KSLD 2FX0 2Jg0 WM0 1fA0 1cM0 18J0 1sTX0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cN0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o10 11A0 1qM0 5QM0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|41e4",
		"Europe/Tirane|LMT CET CEST|-1j.k -10 -20|01212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2glBj.k 14pcj.k 5LC0 WM0 4M0 1fCK0 10n0 1op0 11z0 1pd0 11z0 1qN0 WL0 1qp0 Xb0 1qp0 Xb0 1qp0 11z0 1lB0 11z0 1qN0 11z0 1iN0 16n0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|42e4",
		"Europe/Ulyanovsk|LMT +03 +04 +05 +02|-3d.A -30 -40 -50 -20|01232323232323232321214121212121212121212121212121212121212121212|-22WM0 qH90 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 2pB0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0 3rd0",
		"Europe/Uzhgorod|CET CEST MSK MSD EET EEST|-10 -20 -30 -40 -20 -30|010101023232323232323232320454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454|-1cqL0 6i00 WM0 1fA0 1cM0 1ml0 1Cp0 1r3W0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1Q00 1Nf0 2pw0 1cL0 1cN0 1cL0 1cN0 1cL0 1cQ0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|11e4",
		"Europe/Vienna|CET CEST|-10 -20|0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2aFe0 11d0 1iO0 11A0 1o00 11A0 3KM0 14o0 LA00 6i00 WM0 1fA0 1cM0 1cM0 1cM0 400 2qM0 1a00 1cM0 1cM0 1io0 17c0 1gHa0 19X0 1cP0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|18e5",
		"Europe/Vilnius|WMT KMT CET EET MSK CEST MSD EEST|-1o -1z.A -10 -20 -30 -20 -40 -30|012324525254646464646464646473737373737373737352537373737373737373737373737373737373737373737373737373737373737373737373|-293do 6ILM.o 1Ooz.A zz0 Mfd0 29W0 3is0 WM0 1fA0 1cM0 LV0 1tgL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cN0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11B0 1o00 11A0 1qM0 8io0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|54e4",
		"Europe/Volgograd|LMT +03 +04 +05|-2V.E -30 -40 -50|01232323232323232121212121212121212121212121212121212121212121|-21IqV.E psLV.E 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 2pB0 1cM0 1cM0 1cM0 1fA0 1cM0 3Co0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0|10e5",
		"Europe/Warsaw|WMT CET CEST EET EEST|-1o -10 -20 -20 -30|012121234312121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2ctdo 1LXo 11d0 1iO0 11A0 1o00 11A0 1on0 11A0 6zy0 HWP0 5IM0 WM0 1fA0 1cM0 1dz0 1mL0 1en0 15B0 1aq0 1nA0 11A0 1io0 17c0 1fA0 1a00 iDX0 LA0 1cM0 1cM0 1C00 Oo0 1cM0 1cM0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1C00 LA0 uso0 1a00 1fA0 1cM0 1cM0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cN0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|17e5",
		"Europe/Zaporozhye|CUT EET MSK CEST CET MSD EEST|-2k -20 -30 -20 -10 -40 -30|01234342525252525252525252526161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161|-1Pc2k eUok rdb0 2RE0 WM0 1fA0 8m0 1v9a0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cK0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cQ0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|77e4",
		"HST|HST|a0|0|",
		"Indian/Chagos|LMT IOT IOT|-4N.E -50 -60|012|-2xosN.E 3AGLN.E|30e2",
		"Indian/Christmas|CXT|-70|0||21e2",
		"Indian/Cocos|CCT|-6u|0||596",
		"Indian/Kerguelen|-00 +05|0 -50|01|-MG00|130",
		"Indian/Mahe|LMT SCT|-3F.M -40|01|-2yO3F.M|79e3",
		"Indian/Maldives|MMT MVT|-4S -50|01|-olgS|35e4",
		"Indian/Mauritius|LMT MUT MUST|-3O -40 -50|012121|-2xorO 34unO 14L0 12kr0 11z0|15e4",
		"Indian/Reunion|LMT RET|-3F.Q -40|01|-2mDDF.Q|84e4",
		"Pacific/Kwajalein|MHT KWAT MHT|-b0 c0 -c0|012|-AX0 W9X0|14e3",
		"MET|MET MEST|-10 -20|01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2aFe0 11d0 1iO0 11A0 1o00 11A0 Qrc0 6i00 WM0 1fA0 1cM0 1cM0 1cM0 16M0 1gMM0 1a00 1fA0 1cM0 1cM0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00",
		"MST|MST|70|0|",
		"MST7MDT|MST MDT MWT MPT|70 60 60 60|010102301010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-261r0 1nX0 11B0 1nX0 SgN0 8x20 ix0 QwN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0",
		"Pacific/Chatham|CHAST CHAST CHADT|-cf -cJ -dJ|012121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212|-WqAf 1adef IM0 1C00 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1qM0 14o0 1lc0 14o0 1lc0 14o0 1lc0 17c0 1io0 17c0 1io0 17c0 1io0 17c0 1lc0 14o0 1lc0 14o0 1lc0 17c0 1io0 17c0 1io0 17c0 1lc0 14o0 1lc0 14o0 1lc0 17c0 1io0 17c0 1io0 17c0 1io0 17c0 1io0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1io0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00|600",
		"PST8PDT|PST PDT PWT PPT|80 70 70 70|010102301010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-261q0 1nX0 11B0 1nX0 SgN0 8x10 iy0 QwN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0",
		"Pacific/Apia|LMT WSST SST SDT WSDT WSST|bq.U bu b0 a0 -e0 -d0|01232345454545454545454545454545454545454545454545454545454|-2nDMx.4 1yW03.4 2rRbu 1ff0 1a00 CI0 AQ0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1io0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00|37e3",
		"Pacific/Bougainville|PGT JST BST|-a0 -90 -b0|0102|-16Wy0 7CN0 2MQp0|18e4",
		"Pacific/Chuuk|CHUT|-a0|0||49e3",
		"Pacific/Efate|LMT VUT VUST|-bd.g -b0 -c0|0121212121212121212121|-2l9nd.g 2Szcd.g 1cL0 1oN0 10L0 1fB0 19X0 1fB0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1fB0 Lz0 1Nd0 An0|66e3",
		"Pacific/Enderbury|PHOT PHOT PHOT|c0 b0 -d0|012|nIc0 B8n0|1",
		"Pacific/Fakaofo|TKT TKT|b0 -d0|01|1Gfn0|483",
		"Pacific/Fiji|LMT FJT FJST|-bT.I -c0 -d0|0121212121212121212121212121212121212121212121212121212121212121|-2bUzT.I 3m8NT.I LA0 1EM0 IM0 nJc0 LA0 1o00 Rc0 1wo0 Ao0 1Nc0 Ao0 1Q00 xz0 1SN0 uM0 1SM0 uM0 1VA0 s00 1VA0 uM0 1SM0 uM0 1SM0 uM0 1SM0 uM0 1VA0 s00 1VA0 s00 1VA0 uM0 1SM0 uM0 1SM0 uM0 1SM0 uM0 1VA0 s00 1VA0 uM0 1SM0 uM0 1SM0 uM0 1SM0 uM0 1VA0 s00 1VA0 s00 1VA0 uM0 1SM0 uM0 1SM0 uM0 1SM0 uM0|88e4",
		"Pacific/Funafuti|TVT|-c0|0||45e2",
		"Pacific/Galapagos|LMT ECT GALT|5W.o 50 60|012|-1yVS1.A 2dTz1.A|25e3",
		"Pacific/Gambier|LMT GAMT|8X.M 90|01|-2jof0.c|125",
		"Pacific/Guadalcanal|LMT SBT|-aD.M -b0|01|-2joyD.M|11e4",
		"Pacific/Guam|GST ChST|-a0 -a0|01|1fpq0|17e4",
		"Pacific/Honolulu|HST HDT HST|au 9u a0|010102|-1thLu 8x0 lef0 8Pz0 46p0|37e4",
		"Pacific/Kiritimati|LINT LINT LINT|aE a0 -e0|012|nIaE B8nk|51e2",
		"Pacific/Kosrae|KOST KOST|-b0 -c0|010|-AX0 1bdz0|66e2",
		"Pacific/Majuro|MHT MHT|-b0 -c0|01|-AX0|28e3",
		"Pacific/Marquesas|LMT MART|9i 9u|01|-2joeG|86e2",
		"Pacific/Pago_Pago|LMT NST BST SST|bm.M b0 b0 b0|0123|-2nDMB.c 2gVzB.c EyM0|37e2",
		"Pacific/Nauru|LMT NRT JST NRT|-b7.E -bu -90 -c0|01213|-1Xdn7.E PvzB.E 5RCu 1ouJu|10e3",
		"Pacific/Niue|NUT NUT NUT|bk bu b0|012|-KfME 17y0a|12e2",
		"Pacific/Norfolk|NMT NFT NFST NFT|-bc -bu -cu -b0|01213|-Kgbc W01G On0 1COp0|25e4",
		"Pacific/Noumea|LMT NCT NCST|-b5.M -b0 -c0|01212121|-2l9n5.M 2EqM5.M xX0 1PB0 yn0 HeP0 Ao0|98e3",
		"Pacific/Palau|PWT|-90|0||21e3",
		"Pacific/Pitcairn|PNT PST|8u 80|01|18Vku|56",
		"Pacific/Pohnpei|PONT|-b0|0||34e3",
		"Pacific/Port_Moresby|PGT|-a0|0||25e4",
		"Pacific/Rarotonga|CKT CKHST CKT|au 9u a0|012121212121212121212121212|lyWu IL0 1zcu Onu 1zcu Onu 1zcu Rbu 1zcu Onu 1zcu Onu 1zcu Onu 1zcu Onu 1zcu Onu 1zcu Rbu 1zcu Onu 1zcu Onu 1zcu Onu|13e3",
		"Pacific/Tahiti|LMT TAHT|9W.g a0|01|-2joe1.I|18e4",
		"Pacific/Tarawa|GILT|-c0|0||29e3",
		"Pacific/Tongatapu|+1220 +13 +14|-ck -d0 -e0|0121212121212121212121212121212121212121212121212121|-1aB0k 2n5dk 15A0 1wo0 xz0 1Q10 xz0 zWN0 s00 1VA0 uM0 1SM0 uM0 1SM0 uM0 1SM0 uM0 1VA0 s00 1VA0 s00 1VA0 uM0 1SM0 uM0 1SM0 uM0 1SM0 uM0 1VA0 s00 1VA0 uM0 1SM0 uM0 1SM0 uM0 1SM0 uM0 1VA0 s00 1VA0 s00 1VA0 uM0 1SM0 uM0 1SM0 uM0 1SM0 uM0|75e3",
		"Pacific/Wake|WAKT|-c0|0||16e3",
		"Pacific/Wallis|WFT|-c0|0||94",
		"WET|WET WEST|0 -10|010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|hDB0 1a00 1fA0 1cM0 1cM0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00"
	],
	"links": [
		"Africa/Abidjan|Africa/Bamako",
		"Africa/Abidjan|Africa/Banjul",
		"Africa/Abidjan|Africa/Conakry",
		"Africa/Abidjan|Africa/Dakar",
		"Africa/Abidjan|Africa/Freetown",
		"Africa/Abidjan|Africa/Lome",
		"Africa/Abidjan|Africa/Nouakchott",
		"Africa/Abidjan|Africa/Ouagadougou",
		"Africa/Abidjan|Africa/Sao_Tome",
		"Africa/Abidjan|Africa/Timbuktu",
		"Africa/Abidjan|Atlantic/St_Helena",
		"Africa/Cairo|Egypt",
		"Africa/Johannesburg|Africa/Maseru",
		"Africa/Johannesburg|Africa/Mbabane",
		"Africa/Khartoum|Africa/Juba",
		"Africa/Lagos|Africa/Bangui",
		"Africa/Lagos|Africa/Brazzaville",
		"Africa/Lagos|Africa/Douala",
		"Africa/Lagos|Africa/Kinshasa",
		"Africa/Lagos|Africa/Libreville",
		"Africa/Lagos|Africa/Luanda",
		"Africa/Lagos|Africa/Malabo",
		"Africa/Lagos|Africa/Niamey",
		"Africa/Lagos|Africa/Porto-Novo",
		"Africa/Maputo|Africa/Blantyre",
		"Africa/Maputo|Africa/Bujumbura",
		"Africa/Maputo|Africa/Gaborone",
		"Africa/Maputo|Africa/Harare",
		"Africa/Maputo|Africa/Kigali",
		"Africa/Maputo|Africa/Lubumbashi",
		"Africa/Maputo|Africa/Lusaka",
		"Africa/Nairobi|Africa/Addis_Ababa",
		"Africa/Nairobi|Africa/Asmara",
		"Africa/Nairobi|Africa/Asmera",
		"Africa/Nairobi|Africa/Dar_es_Salaam",
		"Africa/Nairobi|Africa/Djibouti",
		"Africa/Nairobi|Africa/Kampala",
		"Africa/Nairobi|Africa/Mogadishu",
		"Africa/Nairobi|Indian/Antananarivo",
		"Africa/Nairobi|Indian/Comoro",
		"Africa/Nairobi|Indian/Mayotte",
		"Africa/Tripoli|Libya",
		"America/Adak|America/Atka",
		"America/Adak|US/Aleutian",
		"America/Anchorage|US/Alaska",
		"America/Argentina/Buenos_Aires|America/Buenos_Aires",
		"America/Argentina/Catamarca|America/Argentina/ComodRivadavia",
		"America/Argentina/Catamarca|America/Catamarca",
		"America/Argentina/Cordoba|America/Cordoba",
		"America/Argentina/Cordoba|America/Rosario",
		"America/Argentina/Jujuy|America/Jujuy",
		"America/Argentina/Mendoza|America/Mendoza",
		"America/Atikokan|America/Coral_Harbour",
		"America/Chicago|US/Central",
		"America/Curacao|America/Aruba",
		"America/Curacao|America/Kralendijk",
		"America/Curacao|America/Lower_Princes",
		"America/Denver|America/Shiprock",
		"America/Denver|Navajo",
		"America/Denver|US/Mountain",
		"America/Detroit|US/Michigan",
		"America/Edmonton|Canada/Mountain",
		"America/Fort_Wayne|America/Indiana/Indianapolis",
		"America/Fort_Wayne|America/Indianapolis",
		"America/Fort_Wayne|US/East-Indiana",
		"America/Halifax|Canada/Atlantic",
		"America/Havana|Cuba",
		"America/Indiana/Knox|America/Knox_IN",
		"America/Indiana/Knox|US/Indiana-Starke",
		"America/Jamaica|Jamaica",
		"America/Kentucky/Louisville|America/Louisville",
		"America/Los_Angeles|US/Pacific",
		"America/Los_Angeles|US/Pacific-New",
		"America/Manaus|Brazil/West",
		"America/Mazatlan|Mexico/BajaSur",
		"America/Mexico_City|Mexico/General",
		"America/New_York|US/Eastern",
		"America/Noronha|Brazil/DeNoronha",
		"America/Panama|America/Cayman",
		"America/Phoenix|US/Arizona",
		"America/Port_of_Spain|America/Anguilla",
		"America/Port_of_Spain|America/Antigua",
		"America/Port_of_Spain|America/Dominica",
		"America/Port_of_Spain|America/Grenada",
		"America/Port_of_Spain|America/Guadeloupe",
		"America/Port_of_Spain|America/Marigot",
		"America/Port_of_Spain|America/Montserrat",
		"America/Port_of_Spain|America/St_Barthelemy",
		"America/Port_of_Spain|America/St_Kitts",
		"America/Port_of_Spain|America/St_Lucia",
		"America/Port_of_Spain|America/St_Thomas",
		"America/Port_of_Spain|America/St_Vincent",
		"America/Port_of_Spain|America/Tortola",
		"America/Port_of_Spain|America/Virgin",
		"America/Regina|Canada/East-Saskatchewan",
		"America/Regina|Canada/Saskatchewan",
		"America/Rio_Branco|America/Porto_Acre",
		"America/Rio_Branco|Brazil/Acre",
		"America/Santiago|Chile/Continental",
		"America/Sao_Paulo|Brazil/East",
		"America/St_Johns|Canada/Newfoundland",
		"America/Tijuana|America/Ensenada",
		"America/Tijuana|America/Santa_Isabel",
		"America/Tijuana|Mexico/BajaNorte",
		"America/Toronto|America/Montreal",
		"America/Toronto|Canada/Eastern",
		"America/Vancouver|Canada/Pacific",
		"America/Whitehorse|Canada/Yukon",
		"America/Winnipeg|Canada/Central",
		"Asia/Ashgabat|Asia/Ashkhabad",
		"Asia/Bangkok|Asia/Phnom_Penh",
		"Asia/Bangkok|Asia/Vientiane",
		"Asia/Dhaka|Asia/Dacca",
		"Asia/Dubai|Asia/Muscat",
		"Asia/Ho_Chi_Minh|Asia/Saigon",
		"Asia/Hong_Kong|Hongkong",
		"Asia/Jerusalem|Asia/Tel_Aviv",
		"Asia/Jerusalem|Israel",
		"Asia/Kathmandu|Asia/Katmandu",
		"Asia/Kolkata|Asia/Calcutta",
		"Asia/Macau|Asia/Macao",
		"Asia/Makassar|Asia/Ujung_Pandang",
		"Asia/Nicosia|Europe/Nicosia",
		"Asia/Qatar|Asia/Bahrain",
		"Asia/Rangoon|Asia/Yangon",
		"Asia/Riyadh|Asia/Aden",
		"Asia/Riyadh|Asia/Kuwait",
		"Asia/Seoul|ROK",
		"Asia/Shanghai|Asia/Chongqing",
		"Asia/Shanghai|Asia/Chungking",
		"Asia/Shanghai|Asia/Harbin",
		"Asia/Shanghai|PRC",
		"Asia/Singapore|Singapore",
		"Asia/Taipei|ROC",
		"Asia/Tehran|Iran",
		"Asia/Thimphu|Asia/Thimbu",
		"Asia/Tokyo|Japan",
		"Asia/Ulaanbaatar|Asia/Ulan_Bator",
		"Asia/Urumqi|Asia/Kashgar",
		"Atlantic/Faroe|Atlantic/Faeroe",
		"Atlantic/Reykjavik|Iceland",
		"Australia/Adelaide|Australia/South",
		"Australia/Brisbane|Australia/Queensland",
		"Australia/Broken_Hill|Australia/Yancowinna",
		"Australia/Darwin|Australia/North",
		"Australia/Hobart|Australia/Tasmania",
		"Australia/Lord_Howe|Australia/LHI",
		"Australia/Melbourne|Australia/Victoria",
		"Australia/Perth|Australia/West",
		"Australia/Sydney|Australia/ACT",
		"Australia/Sydney|Australia/Canberra",
		"Australia/Sydney|Australia/NSW",
		"Etc/GMT+0|Etc/GMT",
		"Etc/GMT+0|Etc/GMT-0",
		"Etc/GMT+0|Etc/GMT0",
		"Etc/GMT+0|Etc/Greenwich",
		"Etc/GMT+0|GMT",
		"Etc/GMT+0|GMT+0",
		"Etc/GMT+0|GMT-0",
		"Etc/GMT+0|GMT0",
		"Etc/GMT+0|Greenwich",
		"Etc/UCT|UCT",
		"Etc/UTC|Etc/Universal",
		"Etc/UTC|Etc/Zulu",
		"Etc/UTC|UTC",
		"Etc/UTC|Universal",
		"Etc/UTC|Zulu",
		"Europe/Belgrade|Europe/Ljubljana",
		"Europe/Belgrade|Europe/Podgorica",
		"Europe/Belgrade|Europe/Sarajevo",
		"Europe/Belgrade|Europe/Skopje",
		"Europe/Belgrade|Europe/Zagreb",
		"Europe/Chisinau|Europe/Tiraspol",
		"Europe/Dublin|Eire",
		"Europe/Helsinki|Europe/Mariehamn",
		"Europe/Istanbul|Asia/Istanbul",
		"Europe/Istanbul|Turkey",
		"Europe/Lisbon|Portugal",
		"Europe/London|Europe/Belfast",
		"Europe/London|Europe/Guernsey",
		"Europe/London|Europe/Isle_of_Man",
		"Europe/London|Europe/Jersey",
		"Europe/London|GB",
		"Europe/London|GB-Eire",
		"Europe/Moscow|W-SU",
		"Europe/Oslo|Arctic/Longyearbyen",
		"Europe/Oslo|Atlantic/Jan_Mayen",
		"Europe/Prague|Europe/Bratislava",
		"Europe/Rome|Europe/San_Marino",
		"Europe/Rome|Europe/Vatican",
		"Europe/Warsaw|Poland",
		"Europe/Zurich|Europe/Busingen",
		"Europe/Zurich|Europe/Vaduz",
		"Pacific/Auckland|Antarctica/McMurdo",
		"Pacific/Auckland|Antarctica/South_Pole",
		"Pacific/Auckland|NZ",
		"Pacific/Chatham|NZ-CHAT",
		"Pacific/Chuuk|Pacific/Truk",
		"Pacific/Chuuk|Pacific/Yap",
		"Pacific/Easter|Chile/EasterIsland",
		"Pacific/Guam|Pacific/Saipan",
		"Pacific/Honolulu|Pacific/Johnston",
		"Pacific/Honolulu|US/Hawaii",
		"Pacific/Kwajalein|Kwajalein",
		"Pacific/Pago_Pago|Pacific/Midway",
		"Pacific/Pago_Pago|Pacific/Samoa",
		"Pacific/Pago_Pago|US/Samoa",
		"Pacific/Pohnpei|Pacific/Ponape"
	]
}
},{}],47:[function(require,module,exports){
var moment = module.exports = require("./moment-timezone");
moment.tz.load(require('./data/packed/latest.json'));

},{"./data/packed/latest.json":46,"./moment-timezone":48}],48:[function(require,module,exports){
//! moment-timezone.js
//! version : 0.5.11
//! Copyright (c) JS Foundation and other contributors
//! license : MIT
//! github.com/moment/moment-timezone

(function (root, factory) {
	"use strict";

	/*global define*/
	if (typeof define === 'function' && define.amd) {
		define(['moment'], factory);                 // AMD
	} else if (typeof module === 'object' && module.exports) {
		module.exports = factory(require('moment')); // Node
	} else {
		factory(root.moment);                        // Browser
	}
}(this, function (moment) {
	"use strict";

	// Do not load moment-timezone a second time.
	// if (moment.tz !== undefined) {
	// 	logError('Moment Timezone ' + moment.tz.version + ' was already loaded ' + (moment.tz.dataVersion ? 'with data from ' : 'without any data') + moment.tz.dataVersion);
	// 	return moment;
	// }

	var VERSION = "0.5.11",
		zones = {},
		links = {},
		names = {},
		guesses = {},
		cachedGuess,

		momentVersion = moment.version.split('.'),
		major = +momentVersion[0],
		minor = +momentVersion[1];

	// Moment.js version check
	if (major < 2 || (major === 2 && minor < 6)) {
		logError('Moment Timezone requires Moment.js >= 2.6.0. You are using Moment.js ' + moment.version + '. See momentjs.com');
	}

	/************************************
		Unpacking
	************************************/

	function charCodeToInt(charCode) {
		if (charCode > 96) {
			return charCode - 87;
		} else if (charCode > 64) {
			return charCode - 29;
		}
		return charCode - 48;
	}

	function unpackBase60(string) {
		var i = 0,
			parts = string.split('.'),
			whole = parts[0],
			fractional = parts[1] || '',
			multiplier = 1,
			num,
			out = 0,
			sign = 1;

		// handle negative numbers
		if (string.charCodeAt(0) === 45) {
			i = 1;
			sign = -1;
		}

		// handle digits before the decimal
		for (i; i < whole.length; i++) {
			num = charCodeToInt(whole.charCodeAt(i));
			out = 60 * out + num;
		}

		// handle digits after the decimal
		for (i = 0; i < fractional.length; i++) {
			multiplier = multiplier / 60;
			num = charCodeToInt(fractional.charCodeAt(i));
			out += num * multiplier;
		}

		return out * sign;
	}

	function arrayToInt (array) {
		for (var i = 0; i < array.length; i++) {
			array[i] = unpackBase60(array[i]);
		}
	}

	function intToUntil (array, length) {
		for (var i = 0; i < length; i++) {
			array[i] = Math.round((array[i - 1] || 0) + (array[i] * 60000)); // minutes to milliseconds
		}

		array[length - 1] = Infinity;
	}

	function mapIndices (source, indices) {
		var out = [], i;

		for (i = 0; i < indices.length; i++) {
			out[i] = source[indices[i]];
		}

		return out;
	}

	function unpack (string) {
		var data = string.split('|'),
			offsets = data[2].split(' '),
			indices = data[3].split(''),
			untils  = data[4].split(' ');

		arrayToInt(offsets);
		arrayToInt(indices);
		arrayToInt(untils);

		intToUntil(untils, indices.length);

		return {
			name       : data[0],
			abbrs      : mapIndices(data[1].split(' '), indices),
			offsets    : mapIndices(offsets, indices),
			untils     : untils,
			population : data[5] | 0
		};
	}

	/************************************
		Zone object
	************************************/

	function Zone (packedString) {
		if (packedString) {
			this._set(unpack(packedString));
		}
	}

	Zone.prototype = {
		_set : function (unpacked) {
			this.name       = unpacked.name;
			this.abbrs      = unpacked.abbrs;
			this.untils     = unpacked.untils;
			this.offsets    = unpacked.offsets;
			this.population = unpacked.population;
		},

		_index : function (timestamp) {
			var target = +timestamp,
				untils = this.untils,
				i;

			for (i = 0; i < untils.length; i++) {
				if (target < untils[i]) {
					return i;
				}
			}
		},

		parse : function (timestamp) {
			var target  = +timestamp,
				offsets = this.offsets,
				untils  = this.untils,
				max     = untils.length - 1,
				offset, offsetNext, offsetPrev, i;

			for (i = 0; i < max; i++) {
				offset     = offsets[i];
				offsetNext = offsets[i + 1];
				offsetPrev = offsets[i ? i - 1 : i];

				if (offset < offsetNext && tz.moveAmbiguousForward) {
					offset = offsetNext;
				} else if (offset > offsetPrev && tz.moveInvalidForward) {
					offset = offsetPrev;
				}

				if (target < untils[i] - (offset * 60000)) {
					return offsets[i];
				}
			}

			return offsets[max];
		},

		abbr : function (mom) {
			return this.abbrs[this._index(mom)];
		},

		offset : function (mom) {
			return this.offsets[this._index(mom)];
		}
	};

	/************************************
		Current Timezone
	************************************/

	function OffsetAt(at) {
		var timeString = at.toTimeString();
		var abbr = timeString.match(/\([a-z ]+\)/i);
		if (abbr && abbr[0]) {
			// 17:56:31 GMT-0600 (CST)
			// 17:56:31 GMT-0600 (Central Standard Time)
			abbr = abbr[0].match(/[A-Z]/g);
			abbr = abbr ? abbr.join('') : undefined;
		} else {
			// 17:56:31 CST
			// 17:56:31 GMT+0800 (台北標準時間)
			abbr = timeString.match(/[A-Z]{3,5}/g);
			abbr = abbr ? abbr[0] : undefined;
		}

		if (abbr === 'GMT') {
			abbr = undefined;
		}

		this.at = +at;
		this.abbr = abbr;
		this.offset = at.getTimezoneOffset();
	}

	function ZoneScore(zone) {
		this.zone = zone;
		this.offsetScore = 0;
		this.abbrScore = 0;
	}

	ZoneScore.prototype.scoreOffsetAt = function (offsetAt) {
		this.offsetScore += Math.abs(this.zone.offset(offsetAt.at) - offsetAt.offset);
		if (this.zone.abbr(offsetAt.at).replace(/[^A-Z]/g, '') !== offsetAt.abbr) {
			this.abbrScore++;
		}
	};

	function findChange(low, high) {
		var mid, diff;

		while ((diff = ((high.at - low.at) / 12e4 | 0) * 6e4)) {
			mid = new OffsetAt(new Date(low.at + diff));
			if (mid.offset === low.offset) {
				low = mid;
			} else {
				high = mid;
			}
		}

		return low;
	}

	function userOffsets() {
		var startYear = new Date().getFullYear() - 2,
			last = new OffsetAt(new Date(startYear, 0, 1)),
			offsets = [last],
			change, next, i;

		for (i = 1; i < 48; i++) {
			next = new OffsetAt(new Date(startYear, i, 1));
			if (next.offset !== last.offset) {
				change = findChange(last, next);
				offsets.push(change);
				offsets.push(new OffsetAt(new Date(change.at + 6e4)));
			}
			last = next;
		}

		for (i = 0; i < 4; i++) {
			offsets.push(new OffsetAt(new Date(startYear + i, 0, 1)));
			offsets.push(new OffsetAt(new Date(startYear + i, 6, 1)));
		}

		return offsets;
	}

	function sortZoneScores (a, b) {
		if (a.offsetScore !== b.offsetScore) {
			return a.offsetScore - b.offsetScore;
		}
		if (a.abbrScore !== b.abbrScore) {
			return a.abbrScore - b.abbrScore;
		}
		return b.zone.population - a.zone.population;
	}

	function addToGuesses (name, offsets) {
		var i, offset;
		arrayToInt(offsets);
		for (i = 0; i < offsets.length; i++) {
			offset = offsets[i];
			guesses[offset] = guesses[offset] || {};
			guesses[offset][name] = true;
		}
	}

	function guessesForUserOffsets (offsets) {
		var offsetsLength = offsets.length,
			filteredGuesses = {},
			out = [],
			i, j, guessesOffset;

		for (i = 0; i < offsetsLength; i++) {
			guessesOffset = guesses[offsets[i].offset] || {};
			for (j in guessesOffset) {
				if (guessesOffset.hasOwnProperty(j)) {
					filteredGuesses[j] = true;
				}
			}
		}

		for (i in filteredGuesses) {
			if (filteredGuesses.hasOwnProperty(i)) {
				out.push(names[i]);
			}
		}

		return out;
	}

	function rebuildGuess () {

		// use Intl API when available and returning valid time zone
		try {
			var intlName = Intl.DateTimeFormat().resolvedOptions().timeZone;
			if (intlName){
				var name = names[normalizeName(intlName)];
				if (name) {
					return name;
				}
				logError("Moment Timezone found " + intlName + " from the Intl api, but did not have that data loaded.");
			}
		} catch (e) {
			// Intl unavailable, fall back to manual guessing.
		}

		var offsets = userOffsets(),
			offsetsLength = offsets.length,
			guesses = guessesForUserOffsets(offsets),
			zoneScores = [],
			zoneScore, i, j;

		for (i = 0; i < guesses.length; i++) {
			zoneScore = new ZoneScore(getZone(guesses[i]), offsetsLength);
			for (j = 0; j < offsetsLength; j++) {
				zoneScore.scoreOffsetAt(offsets[j]);
			}
			zoneScores.push(zoneScore);
		}

		zoneScores.sort(sortZoneScores);

		return zoneScores.length > 0 ? zoneScores[0].zone.name : undefined;
	}

	function guess (ignoreCache) {
		if (!cachedGuess || ignoreCache) {
			cachedGuess = rebuildGuess();
		}
		return cachedGuess;
	}

	/************************************
		Global Methods
	************************************/

	function normalizeName (name) {
		return (name || '').toLowerCase().replace(/\//g, '_');
	}

	function addZone (packed) {
		var i, name, split, normalized;

		if (typeof packed === "string") {
			packed = [packed];
		}

		for (i = 0; i < packed.length; i++) {
			split = packed[i].split('|');
			name = split[0];
			normalized = normalizeName(name);
			zones[normalized] = packed[i];
			names[normalized] = name;
			if (split[5]) {
				addToGuesses(normalized, split[2].split(' '));
			}
		}
	}

	function getZone (name, caller) {
		name = normalizeName(name);

		var zone = zones[name];
		var link;

		if (zone instanceof Zone) {
			return zone;
		}

		if (typeof zone === 'string') {
			zone = new Zone(zone);
			zones[name] = zone;
			return zone;
		}

		// Pass getZone to prevent recursion more than 1 level deep
		if (links[name] && caller !== getZone && (link = getZone(links[name], getZone))) {
			zone = zones[name] = new Zone();
			zone._set(link);
			zone.name = names[name];
			return zone;
		}

		return null;
	}

	function getNames () {
		var i, out = [];

		for (i in names) {
			if (names.hasOwnProperty(i) && (zones[i] || zones[links[i]]) && names[i]) {
				out.push(names[i]);
			}
		}

		return out.sort();
	}

	function addLink (aliases) {
		var i, alias, normal0, normal1;

		if (typeof aliases === "string") {
			aliases = [aliases];
		}

		for (i = 0; i < aliases.length; i++) {
			alias = aliases[i].split('|');

			normal0 = normalizeName(alias[0]);
			normal1 = normalizeName(alias[1]);

			links[normal0] = normal1;
			names[normal0] = alias[0];

			links[normal1] = normal0;
			names[normal1] = alias[1];
		}
	}

	function loadData (data) {
		addZone(data.zones);
		addLink(data.links);
		tz.dataVersion = data.version;
	}

	function zoneExists (name) {
		if (!zoneExists.didShowError) {
			zoneExists.didShowError = true;
				logError("moment.tz.zoneExists('" + name + "') has been deprecated in favor of !moment.tz.zone('" + name + "')");
		}
		return !!getZone(name);
	}

	function needsOffset (m) {
		return !!(m._a && (m._tzm === undefined));
	}

	function logError (message) {
		if (typeof console !== 'undefined' && typeof console.error === 'function') {
			console.error(message);
		}
	}

	/************************************
		moment.tz namespace
	************************************/

	function tz (input) {
		var args = Array.prototype.slice.call(arguments, 0, -1),
			name = arguments[arguments.length - 1],
			zone = getZone(name),
			out  = moment.utc.apply(null, args);

		if (zone && !moment.isMoment(input) && needsOffset(out)) {
			out.add(zone.parse(out), 'minutes');
		}

		out.tz(name);

		return out;
	}

	tz.version      = VERSION;
	tz.dataVersion  = '';
	tz._zones       = zones;
	tz._links       = links;
	tz._names       = names;
	tz.add          = addZone;
	tz.link         = addLink;
	tz.load         = loadData;
	tz.zone         = getZone;
	tz.zoneExists   = zoneExists; // deprecated in 0.1.0
	tz.guess        = guess;
	tz.names        = getNames;
	tz.Zone         = Zone;
	tz.unpack       = unpack;
	tz.unpackBase60 = unpackBase60;
	tz.needsOffset  = needsOffset;
	tz.moveInvalidForward   = true;
	tz.moveAmbiguousForward = false;

	/************************************
		Interface with Moment.js
	************************************/

	var fn = moment.fn;

	moment.tz = tz;

	moment.defaultZone = null;

	moment.updateOffset = function (mom, keepTime) {
		var zone = moment.defaultZone,
			offset;

		if (mom._z === undefined) {
			if (zone && needsOffset(mom) && !mom._isUTC) {
				mom._d = moment.utc(mom._a)._d;
				mom.utc().add(zone.parse(mom), 'minutes');
			}
			mom._z = zone;
		}
		if (mom._z) {
			offset = mom._z.offset(mom);
			if (Math.abs(offset) < 16) {
				offset = offset / 60;
			}
			if (mom.utcOffset !== undefined) {
				mom.utcOffset(-offset, keepTime);
			} else {
				mom.zone(offset, keepTime);
			}
		}
	};

	fn.tz = function (name) {
		if (name) {
			this._z = getZone(name);
			if (this._z) {
				moment.updateOffset(this);
			} else {
				logError("Moment Timezone has no data for " + name + ". See http://momentjs.com/timezone/docs/#/data-loading/.");
			}
			return this;
		}
		if (this._z) { return this._z.name; }
	};

	function abbrWrap (old) {
		return function () {
			if (this._z) { return this._z.abbr(this); }
			return old.call(this);
		};
	}

	function resetZoneWrap (old) {
		return function () {
			this._z = null;
			return old.apply(this, arguments);
		};
	}

	fn.zoneName = abbrWrap(fn.zoneName);
	fn.zoneAbbr = abbrWrap(fn.zoneAbbr);
	fn.utc      = resetZoneWrap(fn.utc);

	moment.tz.setDefault = function(name) {
		if (major < 2 || (major === 2 && minor < 9)) {
			logError('Moment Timezone setDefault() requires Moment.js >= 2.9.0. You are using Moment.js ' + moment.version + '.');
		}
		moment.defaultZone = name ? getZone(name) : null;
		return moment;
	};

	// Cloning a moment should include the _z property.
	var momentProperties = moment.momentProperties;
	if (Object.prototype.toString.call(momentProperties) === '[object Array]') {
		// moment 2.8.1+
		momentProperties.push('_z');
		momentProperties.push('_a');
	} else if (momentProperties) {
		// moment 2.7.0
		momentProperties._z = null;
	}

	// INJECT DATA

	return moment;
}));

},{"moment":49}],49:[function(require,module,exports){
//! moment.js
//! version : 2.18.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, (function () { 'use strict';

var hookCallback;

function hooks () {
    return hookCallback.apply(null, arguments);
}

// This is done to register the method called with moment()
// without creating circular dependencies.
function setHookCallback (callback) {
    hookCallback = callback;
}

function isArray(input) {
    return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
}

function isObject(input) {
    // IE8 will treat undefined and null as object if it wasn't for
    // input != null
    return input != null && Object.prototype.toString.call(input) === '[object Object]';
}

function isObjectEmpty(obj) {
    var k;
    for (k in obj) {
        // even if its not own property I'd still call it non-empty
        return false;
    }
    return true;
}

function isUndefined(input) {
    return input === void 0;
}

function isNumber(input) {
    return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
}

function isDate(input) {
    return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
}

function map(arr, fn) {
    var res = [], i;
    for (i = 0; i < arr.length; ++i) {
        res.push(fn(arr[i], i));
    }
    return res;
}

function hasOwnProp(a, b) {
    return Object.prototype.hasOwnProperty.call(a, b);
}

function extend(a, b) {
    for (var i in b) {
        if (hasOwnProp(b, i)) {
            a[i] = b[i];
        }
    }

    if (hasOwnProp(b, 'toString')) {
        a.toString = b.toString;
    }

    if (hasOwnProp(b, 'valueOf')) {
        a.valueOf = b.valueOf;
    }

    return a;
}

function createUTC (input, format, locale, strict) {
    return createLocalOrUTC(input, format, locale, strict, true).utc();
}

function defaultParsingFlags() {
    // We need to deep clone this object.
    return {
        empty           : false,
        unusedTokens    : [],
        unusedInput     : [],
        overflow        : -2,
        charsLeftOver   : 0,
        nullInput       : false,
        invalidMonth    : null,
        invalidFormat   : false,
        userInvalidated : false,
        iso             : false,
        parsedDateParts : [],
        meridiem        : null,
        rfc2822         : false,
        weekdayMismatch : false
    };
}

function getParsingFlags(m) {
    if (m._pf == null) {
        m._pf = defaultParsingFlags();
    }
    return m._pf;
}

var some;
if (Array.prototype.some) {
    some = Array.prototype.some;
} else {
    some = function (fun) {
        var t = Object(this);
        var len = t.length >>> 0;

        for (var i = 0; i < len; i++) {
            if (i in t && fun.call(this, t[i], i, t)) {
                return true;
            }
        }

        return false;
    };
}

var some$1 = some;

function isValid(m) {
    if (m._isValid == null) {
        var flags = getParsingFlags(m);
        var parsedParts = some$1.call(flags.parsedDateParts, function (i) {
            return i != null;
        });
        var isNowValid = !isNaN(m._d.getTime()) &&
            flags.overflow < 0 &&
            !flags.empty &&
            !flags.invalidMonth &&
            !flags.invalidWeekday &&
            !flags.nullInput &&
            !flags.invalidFormat &&
            !flags.userInvalidated &&
            (!flags.meridiem || (flags.meridiem && parsedParts));

        if (m._strict) {
            isNowValid = isNowValid &&
                flags.charsLeftOver === 0 &&
                flags.unusedTokens.length === 0 &&
                flags.bigHour === undefined;
        }

        if (Object.isFrozen == null || !Object.isFrozen(m)) {
            m._isValid = isNowValid;
        }
        else {
            return isNowValid;
        }
    }
    return m._isValid;
}

function createInvalid (flags) {
    var m = createUTC(NaN);
    if (flags != null) {
        extend(getParsingFlags(m), flags);
    }
    else {
        getParsingFlags(m).userInvalidated = true;
    }

    return m;
}

// Plugins that add properties should also add the key here (null value),
// so we can properly clone ourselves.
var momentProperties = hooks.momentProperties = [];

function copyConfig(to, from) {
    var i, prop, val;

    if (!isUndefined(from._isAMomentObject)) {
        to._isAMomentObject = from._isAMomentObject;
    }
    if (!isUndefined(from._i)) {
        to._i = from._i;
    }
    if (!isUndefined(from._f)) {
        to._f = from._f;
    }
    if (!isUndefined(from._l)) {
        to._l = from._l;
    }
    if (!isUndefined(from._strict)) {
        to._strict = from._strict;
    }
    if (!isUndefined(from._tzm)) {
        to._tzm = from._tzm;
    }
    if (!isUndefined(from._isUTC)) {
        to._isUTC = from._isUTC;
    }
    if (!isUndefined(from._offset)) {
        to._offset = from._offset;
    }
    if (!isUndefined(from._pf)) {
        to._pf = getParsingFlags(from);
    }
    if (!isUndefined(from._locale)) {
        to._locale = from._locale;
    }

    if (momentProperties.length > 0) {
        for (i = 0; i < momentProperties.length; i++) {
            prop = momentProperties[i];
            val = from[prop];
            if (!isUndefined(val)) {
                to[prop] = val;
            }
        }
    }

    return to;
}

var updateInProgress = false;

// Moment prototype object
function Moment(config) {
    copyConfig(this, config);
    this._d = new Date(config._d != null ? config._d.getTime() : NaN);
    if (!this.isValid()) {
        this._d = new Date(NaN);
    }
    // Prevent infinite loop in case updateOffset creates new moment
    // objects.
    if (updateInProgress === false) {
        updateInProgress = true;
        hooks.updateOffset(this);
        updateInProgress = false;
    }
}

function isMoment (obj) {
    return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
}

function absFloor (number) {
    if (number < 0) {
        // -0 -> 0
        return Math.ceil(number) || 0;
    } else {
        return Math.floor(number);
    }
}

function toInt(argumentForCoercion) {
    var coercedNumber = +argumentForCoercion,
        value = 0;

    if (coercedNumber !== 0 && isFinite(coercedNumber)) {
        value = absFloor(coercedNumber);
    }

    return value;
}

// compare two arrays, return the number of differences
function compareArrays(array1, array2, dontConvert) {
    var len = Math.min(array1.length, array2.length),
        lengthDiff = Math.abs(array1.length - array2.length),
        diffs = 0,
        i;
    for (i = 0; i < len; i++) {
        if ((dontConvert && array1[i] !== array2[i]) ||
            (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
            diffs++;
        }
    }
    return diffs + lengthDiff;
}

function warn(msg) {
    if (hooks.suppressDeprecationWarnings === false &&
            (typeof console !==  'undefined') && console.warn) {
        console.warn('Deprecation warning: ' + msg);
    }
}

function deprecate(msg, fn) {
    var firstTime = true;

    return extend(function () {
        if (hooks.deprecationHandler != null) {
            hooks.deprecationHandler(null, msg);
        }
        if (firstTime) {
            var args = [];
            var arg;
            for (var i = 0; i < arguments.length; i++) {
                arg = '';
                if (typeof arguments[i] === 'object') {
                    arg += '\n[' + i + '] ';
                    for (var key in arguments[0]) {
                        arg += key + ': ' + arguments[0][key] + ', ';
                    }
                    arg = arg.slice(0, -2); // Remove trailing comma and space
                } else {
                    arg = arguments[i];
                }
                args.push(arg);
            }
            warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + (new Error()).stack);
            firstTime = false;
        }
        return fn.apply(this, arguments);
    }, fn);
}

var deprecations = {};

function deprecateSimple(name, msg) {
    if (hooks.deprecationHandler != null) {
        hooks.deprecationHandler(name, msg);
    }
    if (!deprecations[name]) {
        warn(msg);
        deprecations[name] = true;
    }
}

hooks.suppressDeprecationWarnings = false;
hooks.deprecationHandler = null;

function isFunction(input) {
    return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
}

function set (config) {
    var prop, i;
    for (i in config) {
        prop = config[i];
        if (isFunction(prop)) {
            this[i] = prop;
        } else {
            this['_' + i] = prop;
        }
    }
    this._config = config;
    // Lenient ordinal parsing accepts just a number in addition to
    // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
    // TODO: Remove "ordinalParse" fallback in next major release.
    this._dayOfMonthOrdinalParseLenient = new RegExp(
        (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
            '|' + (/\d{1,2}/).source);
}

function mergeConfigs(parentConfig, childConfig) {
    var res = extend({}, parentConfig), prop;
    for (prop in childConfig) {
        if (hasOwnProp(childConfig, prop)) {
            if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                res[prop] = {};
                extend(res[prop], parentConfig[prop]);
                extend(res[prop], childConfig[prop]);
            } else if (childConfig[prop] != null) {
                res[prop] = childConfig[prop];
            } else {
                delete res[prop];
            }
        }
    }
    for (prop in parentConfig) {
        if (hasOwnProp(parentConfig, prop) &&
                !hasOwnProp(childConfig, prop) &&
                isObject(parentConfig[prop])) {
            // make sure changes to properties don't modify parent config
            res[prop] = extend({}, res[prop]);
        }
    }
    return res;
}

function Locale(config) {
    if (config != null) {
        this.set(config);
    }
}

var keys;

if (Object.keys) {
    keys = Object.keys;
} else {
    keys = function (obj) {
        var i, res = [];
        for (i in obj) {
            if (hasOwnProp(obj, i)) {
                res.push(i);
            }
        }
        return res;
    };
}

var keys$1 = keys;

var defaultCalendar = {
    sameDay : '[Today at] LT',
    nextDay : '[Tomorrow at] LT',
    nextWeek : 'dddd [at] LT',
    lastDay : '[Yesterday at] LT',
    lastWeek : '[Last] dddd [at] LT',
    sameElse : 'L'
};

function calendar (key, mom, now) {
    var output = this._calendar[key] || this._calendar['sameElse'];
    return isFunction(output) ? output.call(mom, now) : output;
}

var defaultLongDateFormat = {
    LTS  : 'h:mm:ss A',
    LT   : 'h:mm A',
    L    : 'MM/DD/YYYY',
    LL   : 'MMMM D, YYYY',
    LLL  : 'MMMM D, YYYY h:mm A',
    LLLL : 'dddd, MMMM D, YYYY h:mm A'
};

function longDateFormat (key) {
    var format = this._longDateFormat[key],
        formatUpper = this._longDateFormat[key.toUpperCase()];

    if (format || !formatUpper) {
        return format;
    }

    this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
        return val.slice(1);
    });

    return this._longDateFormat[key];
}

var defaultInvalidDate = 'Invalid date';

function invalidDate () {
    return this._invalidDate;
}

var defaultOrdinal = '%d';
var defaultDayOfMonthOrdinalParse = /\d{1,2}/;

function ordinal (number) {
    return this._ordinal.replace('%d', number);
}

var defaultRelativeTime = {
    future : 'in %s',
    past   : '%s ago',
    s  : 'a few seconds',
    ss : '%d seconds',
    m  : 'a minute',
    mm : '%d minutes',
    h  : 'an hour',
    hh : '%d hours',
    d  : 'a day',
    dd : '%d days',
    M  : 'a month',
    MM : '%d months',
    y  : 'a year',
    yy : '%d years'
};

function relativeTime (number, withoutSuffix, string, isFuture) {
    var output = this._relativeTime[string];
    return (isFunction(output)) ?
        output(number, withoutSuffix, string, isFuture) :
        output.replace(/%d/i, number);
}

function pastFuture (diff, output) {
    var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
    return isFunction(format) ? format(output) : format.replace(/%s/i, output);
}

var aliases = {};

function addUnitAlias (unit, shorthand) {
    var lowerCase = unit.toLowerCase();
    aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
}

function normalizeUnits(units) {
    return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
}

function normalizeObjectUnits(inputObject) {
    var normalizedInput = {},
        normalizedProp,
        prop;

    for (prop in inputObject) {
        if (hasOwnProp(inputObject, prop)) {
            normalizedProp = normalizeUnits(prop);
            if (normalizedProp) {
                normalizedInput[normalizedProp] = inputObject[prop];
            }
        }
    }

    return normalizedInput;
}

var priorities = {};

function addUnitPriority(unit, priority) {
    priorities[unit] = priority;
}

function getPrioritizedUnits(unitsObj) {
    var units = [];
    for (var u in unitsObj) {
        units.push({unit: u, priority: priorities[u]});
    }
    units.sort(function (a, b) {
        return a.priority - b.priority;
    });
    return units;
}

function makeGetSet (unit, keepTime) {
    return function (value) {
        if (value != null) {
            set$1(this, unit, value);
            hooks.updateOffset(this, keepTime);
            return this;
        } else {
            return get(this, unit);
        }
    };
}

function get (mom, unit) {
    return mom.isValid() ?
        mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
}

function set$1 (mom, unit, value) {
    if (mom.isValid()) {
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
    }
}

// MOMENTS

function stringGet (units) {
    units = normalizeUnits(units);
    if (isFunction(this[units])) {
        return this[units]();
    }
    return this;
}


function stringSet (units, value) {
    if (typeof units === 'object') {
        units = normalizeObjectUnits(units);
        var prioritized = getPrioritizedUnits(units);
        for (var i = 0; i < prioritized.length; i++) {
            this[prioritized[i].unit](units[prioritized[i].unit]);
        }
    } else {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
            return this[units](value);
        }
    }
    return this;
}

function zeroFill(number, targetLength, forceSign) {
    var absNumber = '' + Math.abs(number),
        zerosToFill = targetLength - absNumber.length,
        sign = number >= 0;
    return (sign ? (forceSign ? '+' : '') : '-') +
        Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
}

var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

var formatFunctions = {};

var formatTokenFunctions = {};

// token:    'M'
// padded:   ['MM', 2]
// ordinal:  'Mo'
// callback: function () { this.month() + 1 }
function addFormatToken (token, padded, ordinal, callback) {
    var func = callback;
    if (typeof callback === 'string') {
        func = function () {
            return this[callback]();
        };
    }
    if (token) {
        formatTokenFunctions[token] = func;
    }
    if (padded) {
        formatTokenFunctions[padded[0]] = function () {
            return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
        };
    }
    if (ordinal) {
        formatTokenFunctions[ordinal] = function () {
            return this.localeData().ordinal(func.apply(this, arguments), token);
        };
    }
}

function removeFormattingTokens(input) {
    if (input.match(/\[[\s\S]/)) {
        return input.replace(/^\[|\]$/g, '');
    }
    return input.replace(/\\/g, '');
}

function makeFormatFunction(format) {
    var array = format.match(formattingTokens), i, length;

    for (i = 0, length = array.length; i < length; i++) {
        if (formatTokenFunctions[array[i]]) {
            array[i] = formatTokenFunctions[array[i]];
        } else {
            array[i] = removeFormattingTokens(array[i]);
        }
    }

    return function (mom) {
        var output = '', i;
        for (i = 0; i < length; i++) {
            output += isFunction(array[i]) ? array[i].call(mom, format) : array[i];
        }
        return output;
    };
}

// format date using native date object
function formatMoment(m, format) {
    if (!m.isValid()) {
        return m.localeData().invalidDate();
    }

    format = expandFormat(format, m.localeData());
    formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

    return formatFunctions[format](m);
}

function expandFormat(format, locale) {
    var i = 5;

    function replaceLongDateFormatTokens(input) {
        return locale.longDateFormat(input) || input;
    }

    localFormattingTokens.lastIndex = 0;
    while (i >= 0 && localFormattingTokens.test(format)) {
        format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
        localFormattingTokens.lastIndex = 0;
        i -= 1;
    }

    return format;
}

var match1         = /\d/;            //       0 - 9
var match2         = /\d\d/;          //      00 - 99
var match3         = /\d{3}/;         //     000 - 999
var match4         = /\d{4}/;         //    0000 - 9999
var match6         = /[+-]?\d{6}/;    // -999999 - 999999
var match1to2      = /\d\d?/;         //       0 - 99
var match3to4      = /\d\d\d\d?/;     //     999 - 9999
var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999
var match1to3      = /\d{1,3}/;       //       0 - 999
var match1to4      = /\d{1,4}/;       //       0 - 9999
var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

var matchUnsigned  = /\d+/;           //       0 - inf
var matchSigned    = /[+-]?\d+/;      //    -inf - inf

var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

// any word (or two) characters or numbers including two/three word month in arabic.
// includes scottish gaelic two word and hyphenated months
var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;


var regexes = {};

function addRegexToken (token, regex, strictRegex) {
    regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
        return (isStrict && strictRegex) ? strictRegex : regex;
    };
}

function getParseRegexForToken (token, config) {
    if (!hasOwnProp(regexes, token)) {
        return new RegExp(unescapeFormat(token));
    }

    return regexes[token](config._strict, config._locale);
}

// Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
function unescapeFormat(s) {
    return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
        return p1 || p2 || p3 || p4;
    }));
}

function regexEscape(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

var tokens = {};

function addParseToken (token, callback) {
    var i, func = callback;
    if (typeof token === 'string') {
        token = [token];
    }
    if (isNumber(callback)) {
        func = function (input, array) {
            array[callback] = toInt(input);
        };
    }
    for (i = 0; i < token.length; i++) {
        tokens[token[i]] = func;
    }
}

function addWeekParseToken (token, callback) {
    addParseToken(token, function (input, array, config, token) {
        config._w = config._w || {};
        callback(input, config._w, config, token);
    });
}

function addTimeToArrayFromToken(token, input, config) {
    if (input != null && hasOwnProp(tokens, token)) {
        tokens[token](input, config._a, config, token);
    }
}

var YEAR = 0;
var MONTH = 1;
var DATE = 2;
var HOUR = 3;
var MINUTE = 4;
var SECOND = 5;
var MILLISECOND = 6;
var WEEK = 7;
var WEEKDAY = 8;

var indexOf;

if (Array.prototype.indexOf) {
    indexOf = Array.prototype.indexOf;
} else {
    indexOf = function (o) {
        // I know
        var i;
        for (i = 0; i < this.length; ++i) {
            if (this[i] === o) {
                return i;
            }
        }
        return -1;
    };
}

var indexOf$1 = indexOf;

function daysInMonth(year, month) {
    return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

// FORMATTING

addFormatToken('M', ['MM', 2], 'Mo', function () {
    return this.month() + 1;
});

addFormatToken('MMM', 0, 0, function (format) {
    return this.localeData().monthsShort(this, format);
});

addFormatToken('MMMM', 0, 0, function (format) {
    return this.localeData().months(this, format);
});

// ALIASES

addUnitAlias('month', 'M');

// PRIORITY

addUnitPriority('month', 8);

// PARSING

addRegexToken('M',    match1to2);
addRegexToken('MM',   match1to2, match2);
addRegexToken('MMM',  function (isStrict, locale) {
    return locale.monthsShortRegex(isStrict);
});
addRegexToken('MMMM', function (isStrict, locale) {
    return locale.monthsRegex(isStrict);
});

addParseToken(['M', 'MM'], function (input, array) {
    array[MONTH] = toInt(input) - 1;
});

addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
    var month = config._locale.monthsParse(input, token, config._strict);
    // if we didn't find a month name, mark the date as invalid.
    if (month != null) {
        array[MONTH] = month;
    } else {
        getParsingFlags(config).invalidMonth = input;
    }
});

// LOCALES

var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;
var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
function localeMonths (m, format) {
    if (!m) {
        return isArray(this._months) ? this._months :
            this._months['standalone'];
    }
    return isArray(this._months) ? this._months[m.month()] :
        this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
}

var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
function localeMonthsShort (m, format) {
    if (!m) {
        return isArray(this._monthsShort) ? this._monthsShort :
            this._monthsShort['standalone'];
    }
    return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
        this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
}

function handleStrictParse(monthName, format, strict) {
    var i, ii, mom, llc = monthName.toLocaleLowerCase();
    if (!this._monthsParse) {
        // this is not used
        this._monthsParse = [];
        this._longMonthsParse = [];
        this._shortMonthsParse = [];
        for (i = 0; i < 12; ++i) {
            mom = createUTC([2000, i]);
            this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
            this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
        }
    }

    if (strict) {
        if (format === 'MMM') {
            ii = indexOf$1.call(this._shortMonthsParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf$1.call(this._longMonthsParse, llc);
            return ii !== -1 ? ii : null;
        }
    } else {
        if (format === 'MMM') {
            ii = indexOf$1.call(this._shortMonthsParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._longMonthsParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf$1.call(this._longMonthsParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._shortMonthsParse, llc);
            return ii !== -1 ? ii : null;
        }
    }
}

function localeMonthsParse (monthName, format, strict) {
    var i, mom, regex;

    if (this._monthsParseExact) {
        return handleStrictParse.call(this, monthName, format, strict);
    }

    if (!this._monthsParse) {
        this._monthsParse = [];
        this._longMonthsParse = [];
        this._shortMonthsParse = [];
    }

    // TODO: add sorting
    // Sorting makes sure if one month (or abbr) is a prefix of another
    // see sorting in computeMonthsParse
    for (i = 0; i < 12; i++) {
        // make the regex if we don't have it already
        mom = createUTC([2000, i]);
        if (strict && !this._longMonthsParse[i]) {
            this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
            this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
        }
        if (!strict && !this._monthsParse[i]) {
            regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
            this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
        }
        // test the regex
        if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
            return i;
        } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
            return i;
        } else if (!strict && this._monthsParse[i].test(monthName)) {
            return i;
        }
    }
}

// MOMENTS

function setMonth (mom, value) {
    var dayOfMonth;

    if (!mom.isValid()) {
        // No op
        return mom;
    }

    if (typeof value === 'string') {
        if (/^\d+$/.test(value)) {
            value = toInt(value);
        } else {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (!isNumber(value)) {
                return mom;
            }
        }
    }

    dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
    mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
    return mom;
}

function getSetMonth (value) {
    if (value != null) {
        setMonth(this, value);
        hooks.updateOffset(this, true);
        return this;
    } else {
        return get(this, 'Month');
    }
}

function getDaysInMonth () {
    return daysInMonth(this.year(), this.month());
}

var defaultMonthsShortRegex = matchWord;
function monthsShortRegex (isStrict) {
    if (this._monthsParseExact) {
        if (!hasOwnProp(this, '_monthsRegex')) {
            computeMonthsParse.call(this);
        }
        if (isStrict) {
            return this._monthsShortStrictRegex;
        } else {
            return this._monthsShortRegex;
        }
    } else {
        if (!hasOwnProp(this, '_monthsShortRegex')) {
            this._monthsShortRegex = defaultMonthsShortRegex;
        }
        return this._monthsShortStrictRegex && isStrict ?
            this._monthsShortStrictRegex : this._monthsShortRegex;
    }
}

var defaultMonthsRegex = matchWord;
function monthsRegex (isStrict) {
    if (this._monthsParseExact) {
        if (!hasOwnProp(this, '_monthsRegex')) {
            computeMonthsParse.call(this);
        }
        if (isStrict) {
            return this._monthsStrictRegex;
        } else {
            return this._monthsRegex;
        }
    } else {
        if (!hasOwnProp(this, '_monthsRegex')) {
            this._monthsRegex = defaultMonthsRegex;
        }
        return this._monthsStrictRegex && isStrict ?
            this._monthsStrictRegex : this._monthsRegex;
    }
}

function computeMonthsParse () {
    function cmpLenRev(a, b) {
        return b.length - a.length;
    }

    var shortPieces = [], longPieces = [], mixedPieces = [],
        i, mom;
    for (i = 0; i < 12; i++) {
        // make the regex if we don't have it already
        mom = createUTC([2000, i]);
        shortPieces.push(this.monthsShort(mom, ''));
        longPieces.push(this.months(mom, ''));
        mixedPieces.push(this.months(mom, ''));
        mixedPieces.push(this.monthsShort(mom, ''));
    }
    // Sorting makes sure if one month (or abbr) is a prefix of another it
    // will match the longer piece.
    shortPieces.sort(cmpLenRev);
    longPieces.sort(cmpLenRev);
    mixedPieces.sort(cmpLenRev);
    for (i = 0; i < 12; i++) {
        shortPieces[i] = regexEscape(shortPieces[i]);
        longPieces[i] = regexEscape(longPieces[i]);
    }
    for (i = 0; i < 24; i++) {
        mixedPieces[i] = regexEscape(mixedPieces[i]);
    }

    this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
    this._monthsShortRegex = this._monthsRegex;
    this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
    this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
}

// FORMATTING

addFormatToken('Y', 0, 0, function () {
    var y = this.year();
    return y <= 9999 ? '' + y : '+' + y;
});

addFormatToken(0, ['YY', 2], 0, function () {
    return this.year() % 100;
});

addFormatToken(0, ['YYYY',   4],       0, 'year');
addFormatToken(0, ['YYYYY',  5],       0, 'year');
addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

// ALIASES

addUnitAlias('year', 'y');

// PRIORITIES

addUnitPriority('year', 1);

// PARSING

addRegexToken('Y',      matchSigned);
addRegexToken('YY',     match1to2, match2);
addRegexToken('YYYY',   match1to4, match4);
addRegexToken('YYYYY',  match1to6, match6);
addRegexToken('YYYYYY', match1to6, match6);

addParseToken(['YYYYY', 'YYYYYY'], YEAR);
addParseToken('YYYY', function (input, array) {
    array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
});
addParseToken('YY', function (input, array) {
    array[YEAR] = hooks.parseTwoDigitYear(input);
});
addParseToken('Y', function (input, array) {
    array[YEAR] = parseInt(input, 10);
});

// HELPERS

function daysInYear(year) {
    return isLeapYear(year) ? 366 : 365;
}

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// HOOKS

hooks.parseTwoDigitYear = function (input) {
    return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
};

// MOMENTS

var getSetYear = makeGetSet('FullYear', true);

function getIsLeapYear () {
    return isLeapYear(this.year());
}

function createDate (y, m, d, h, M, s, ms) {
    // can't just apply() to create a date:
    // https://stackoverflow.com/q/181348
    var date = new Date(y, m, d, h, M, s, ms);

    // the date constructor remaps years 0-99 to 1900-1999
    if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
        date.setFullYear(y);
    }
    return date;
}

function createUTCDate (y) {
    var date = new Date(Date.UTC.apply(null, arguments));

    // the Date.UTC function remaps years 0-99 to 1900-1999
    if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
        date.setUTCFullYear(y);
    }
    return date;
}

// start-of-first-week - start-of-year
function firstWeekOffset(year, dow, doy) {
    var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
        fwd = 7 + dow - doy,
        // first-week day local weekday -- which local weekday is fwd
        fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

    return -fwdlw + fwd - 1;
}

// https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
    var localWeekday = (7 + weekday - dow) % 7,
        weekOffset = firstWeekOffset(year, dow, doy),
        dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
        resYear, resDayOfYear;

    if (dayOfYear <= 0) {
        resYear = year - 1;
        resDayOfYear = daysInYear(resYear) + dayOfYear;
    } else if (dayOfYear > daysInYear(year)) {
        resYear = year + 1;
        resDayOfYear = dayOfYear - daysInYear(year);
    } else {
        resYear = year;
        resDayOfYear = dayOfYear;
    }

    return {
        year: resYear,
        dayOfYear: resDayOfYear
    };
}

function weekOfYear(mom, dow, doy) {
    var weekOffset = firstWeekOffset(mom.year(), dow, doy),
        week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
        resWeek, resYear;

    if (week < 1) {
        resYear = mom.year() - 1;
        resWeek = week + weeksInYear(resYear, dow, doy);
    } else if (week > weeksInYear(mom.year(), dow, doy)) {
        resWeek = week - weeksInYear(mom.year(), dow, doy);
        resYear = mom.year() + 1;
    } else {
        resYear = mom.year();
        resWeek = week;
    }

    return {
        week: resWeek,
        year: resYear
    };
}

function weeksInYear(year, dow, doy) {
    var weekOffset = firstWeekOffset(year, dow, doy),
        weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
    return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
}

// FORMATTING

addFormatToken('w', ['ww', 2], 'wo', 'week');
addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

// ALIASES

addUnitAlias('week', 'w');
addUnitAlias('isoWeek', 'W');

// PRIORITIES

addUnitPriority('week', 5);
addUnitPriority('isoWeek', 5);

// PARSING

addRegexToken('w',  match1to2);
addRegexToken('ww', match1to2, match2);
addRegexToken('W',  match1to2);
addRegexToken('WW', match1to2, match2);

addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
    week[token.substr(0, 1)] = toInt(input);
});

// HELPERS

// LOCALES

function localeWeek (mom) {
    return weekOfYear(mom, this._week.dow, this._week.doy).week;
}

var defaultLocaleWeek = {
    dow : 0, // Sunday is the first day of the week.
    doy : 6  // The week that contains Jan 1st is the first week of the year.
};

function localeFirstDayOfWeek () {
    return this._week.dow;
}

function localeFirstDayOfYear () {
    return this._week.doy;
}

// MOMENTS

function getSetWeek (input) {
    var week = this.localeData().week(this);
    return input == null ? week : this.add((input - week) * 7, 'd');
}

function getSetISOWeek (input) {
    var week = weekOfYear(this, 1, 4).week;
    return input == null ? week : this.add((input - week) * 7, 'd');
}

// FORMATTING

addFormatToken('d', 0, 'do', 'day');

addFormatToken('dd', 0, 0, function (format) {
    return this.localeData().weekdaysMin(this, format);
});

addFormatToken('ddd', 0, 0, function (format) {
    return this.localeData().weekdaysShort(this, format);
});

addFormatToken('dddd', 0, 0, function (format) {
    return this.localeData().weekdays(this, format);
});

addFormatToken('e', 0, 0, 'weekday');
addFormatToken('E', 0, 0, 'isoWeekday');

// ALIASES

addUnitAlias('day', 'd');
addUnitAlias('weekday', 'e');
addUnitAlias('isoWeekday', 'E');

// PRIORITY
addUnitPriority('day', 11);
addUnitPriority('weekday', 11);
addUnitPriority('isoWeekday', 11);

// PARSING

addRegexToken('d',    match1to2);
addRegexToken('e',    match1to2);
addRegexToken('E',    match1to2);
addRegexToken('dd',   function (isStrict, locale) {
    return locale.weekdaysMinRegex(isStrict);
});
addRegexToken('ddd',   function (isStrict, locale) {
    return locale.weekdaysShortRegex(isStrict);
});
addRegexToken('dddd',   function (isStrict, locale) {
    return locale.weekdaysRegex(isStrict);
});

addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
    var weekday = config._locale.weekdaysParse(input, token, config._strict);
    // if we didn't get a weekday name, mark the date as invalid
    if (weekday != null) {
        week.d = weekday;
    } else {
        getParsingFlags(config).invalidWeekday = input;
    }
});

addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
    week[token] = toInt(input);
});

// HELPERS

function parseWeekday(input, locale) {
    if (typeof input !== 'string') {
        return input;
    }

    if (!isNaN(input)) {
        return parseInt(input, 10);
    }

    input = locale.weekdaysParse(input);
    if (typeof input === 'number') {
        return input;
    }

    return null;
}

function parseIsoWeekday(input, locale) {
    if (typeof input === 'string') {
        return locale.weekdaysParse(input) % 7 || 7;
    }
    return isNaN(input) ? null : input;
}

// LOCALES

var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
function localeWeekdays (m, format) {
    if (!m) {
        return isArray(this._weekdays) ? this._weekdays :
            this._weekdays['standalone'];
    }
    return isArray(this._weekdays) ? this._weekdays[m.day()] :
        this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];
}

var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
function localeWeekdaysShort (m) {
    return (m) ? this._weekdaysShort[m.day()] : this._weekdaysShort;
}

var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
function localeWeekdaysMin (m) {
    return (m) ? this._weekdaysMin[m.day()] : this._weekdaysMin;
}

function handleStrictParse$1(weekdayName, format, strict) {
    var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
    if (!this._weekdaysParse) {
        this._weekdaysParse = [];
        this._shortWeekdaysParse = [];
        this._minWeekdaysParse = [];

        for (i = 0; i < 7; ++i) {
            mom = createUTC([2000, 1]).day(i);
            this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
            this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
            this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
        }
    }

    if (strict) {
        if (format === 'dddd') {
            ii = indexOf$1.call(this._weekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else if (format === 'ddd') {
            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf$1.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        }
    } else {
        if (format === 'dddd') {
            ii = indexOf$1.call(this._weekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else if (format === 'ddd') {
            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._weekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf$1.call(this._minWeekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._weekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        }
    }
}

function localeWeekdaysParse (weekdayName, format, strict) {
    var i, mom, regex;

    if (this._weekdaysParseExact) {
        return handleStrictParse$1.call(this, weekdayName, format, strict);
    }

    if (!this._weekdaysParse) {
        this._weekdaysParse = [];
        this._minWeekdaysParse = [];
        this._shortWeekdaysParse = [];
        this._fullWeekdaysParse = [];
    }

    for (i = 0; i < 7; i++) {
        // make the regex if we don't have it already

        mom = createUTC([2000, 1]).day(i);
        if (strict && !this._fullWeekdaysParse[i]) {
            this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\.?') + '$', 'i');
            this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\.?') + '$', 'i');
            this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\.?') + '$', 'i');
        }
        if (!this._weekdaysParse[i]) {
            regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
            this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
        }
        // test the regex
        if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
            return i;
        } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
            return i;
        } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
            return i;
        } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
            return i;
        }
    }
}

// MOMENTS

function getSetDayOfWeek (input) {
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }
    var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
    if (input != null) {
        input = parseWeekday(input, this.localeData());
        return this.add(input - day, 'd');
    } else {
        return day;
    }
}

function getSetLocaleDayOfWeek (input) {
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }
    var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
    return input == null ? weekday : this.add(input - weekday, 'd');
}

function getSetISODayOfWeek (input) {
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }

    // behaves the same as moment#day except
    // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
    // as a setter, sunday should belong to the previous week.

    if (input != null) {
        var weekday = parseIsoWeekday(input, this.localeData());
        return this.day(this.day() % 7 ? weekday : weekday - 7);
    } else {
        return this.day() || 7;
    }
}

var defaultWeekdaysRegex = matchWord;
function weekdaysRegex (isStrict) {
    if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            computeWeekdaysParse.call(this);
        }
        if (isStrict) {
            return this._weekdaysStrictRegex;
        } else {
            return this._weekdaysRegex;
        }
    } else {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            this._weekdaysRegex = defaultWeekdaysRegex;
        }
        return this._weekdaysStrictRegex && isStrict ?
            this._weekdaysStrictRegex : this._weekdaysRegex;
    }
}

var defaultWeekdaysShortRegex = matchWord;
function weekdaysShortRegex (isStrict) {
    if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            computeWeekdaysParse.call(this);
        }
        if (isStrict) {
            return this._weekdaysShortStrictRegex;
        } else {
            return this._weekdaysShortRegex;
        }
    } else {
        if (!hasOwnProp(this, '_weekdaysShortRegex')) {
            this._weekdaysShortRegex = defaultWeekdaysShortRegex;
        }
        return this._weekdaysShortStrictRegex && isStrict ?
            this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
    }
}

var defaultWeekdaysMinRegex = matchWord;
function weekdaysMinRegex (isStrict) {
    if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            computeWeekdaysParse.call(this);
        }
        if (isStrict) {
            return this._weekdaysMinStrictRegex;
        } else {
            return this._weekdaysMinRegex;
        }
    } else {
        if (!hasOwnProp(this, '_weekdaysMinRegex')) {
            this._weekdaysMinRegex = defaultWeekdaysMinRegex;
        }
        return this._weekdaysMinStrictRegex && isStrict ?
            this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
    }
}


function computeWeekdaysParse () {
    function cmpLenRev(a, b) {
        return b.length - a.length;
    }

    var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [],
        i, mom, minp, shortp, longp;
    for (i = 0; i < 7; i++) {
        // make the regex if we don't have it already
        mom = createUTC([2000, 1]).day(i);
        minp = this.weekdaysMin(mom, '');
        shortp = this.weekdaysShort(mom, '');
        longp = this.weekdays(mom, '');
        minPieces.push(minp);
        shortPieces.push(shortp);
        longPieces.push(longp);
        mixedPieces.push(minp);
        mixedPieces.push(shortp);
        mixedPieces.push(longp);
    }
    // Sorting makes sure if one weekday (or abbr) is a prefix of another it
    // will match the longer piece.
    minPieces.sort(cmpLenRev);
    shortPieces.sort(cmpLenRev);
    longPieces.sort(cmpLenRev);
    mixedPieces.sort(cmpLenRev);
    for (i = 0; i < 7; i++) {
        shortPieces[i] = regexEscape(shortPieces[i]);
        longPieces[i] = regexEscape(longPieces[i]);
        mixedPieces[i] = regexEscape(mixedPieces[i]);
    }

    this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
    this._weekdaysShortRegex = this._weekdaysRegex;
    this._weekdaysMinRegex = this._weekdaysRegex;

    this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
    this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
    this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
}

// FORMATTING

function hFormat() {
    return this.hours() % 12 || 12;
}

function kFormat() {
    return this.hours() || 24;
}

addFormatToken('H', ['HH', 2], 0, 'hour');
addFormatToken('h', ['hh', 2], 0, hFormat);
addFormatToken('k', ['kk', 2], 0, kFormat);

addFormatToken('hmm', 0, 0, function () {
    return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
});

addFormatToken('hmmss', 0, 0, function () {
    return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
        zeroFill(this.seconds(), 2);
});

addFormatToken('Hmm', 0, 0, function () {
    return '' + this.hours() + zeroFill(this.minutes(), 2);
});

addFormatToken('Hmmss', 0, 0, function () {
    return '' + this.hours() + zeroFill(this.minutes(), 2) +
        zeroFill(this.seconds(), 2);
});

function meridiem (token, lowercase) {
    addFormatToken(token, 0, 0, function () {
        return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
    });
}

meridiem('a', true);
meridiem('A', false);

// ALIASES

addUnitAlias('hour', 'h');

// PRIORITY
addUnitPriority('hour', 13);

// PARSING

function matchMeridiem (isStrict, locale) {
    return locale._meridiemParse;
}

addRegexToken('a',  matchMeridiem);
addRegexToken('A',  matchMeridiem);
addRegexToken('H',  match1to2);
addRegexToken('h',  match1to2);
addRegexToken('k',  match1to2);
addRegexToken('HH', match1to2, match2);
addRegexToken('hh', match1to2, match2);
addRegexToken('kk', match1to2, match2);

addRegexToken('hmm', match3to4);
addRegexToken('hmmss', match5to6);
addRegexToken('Hmm', match3to4);
addRegexToken('Hmmss', match5to6);

addParseToken(['H', 'HH'], HOUR);
addParseToken(['k', 'kk'], function (input, array, config) {
    var kInput = toInt(input);
    array[HOUR] = kInput === 24 ? 0 : kInput;
});
addParseToken(['a', 'A'], function (input, array, config) {
    config._isPm = config._locale.isPM(input);
    config._meridiem = input;
});
addParseToken(['h', 'hh'], function (input, array, config) {
    array[HOUR] = toInt(input);
    getParsingFlags(config).bigHour = true;
});
addParseToken('hmm', function (input, array, config) {
    var pos = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos));
    array[MINUTE] = toInt(input.substr(pos));
    getParsingFlags(config).bigHour = true;
});
addParseToken('hmmss', function (input, array, config) {
    var pos1 = input.length - 4;
    var pos2 = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos1));
    array[MINUTE] = toInt(input.substr(pos1, 2));
    array[SECOND] = toInt(input.substr(pos2));
    getParsingFlags(config).bigHour = true;
});
addParseToken('Hmm', function (input, array, config) {
    var pos = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos));
    array[MINUTE] = toInt(input.substr(pos));
});
addParseToken('Hmmss', function (input, array, config) {
    var pos1 = input.length - 4;
    var pos2 = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos1));
    array[MINUTE] = toInt(input.substr(pos1, 2));
    array[SECOND] = toInt(input.substr(pos2));
});

// LOCALES

function localeIsPM (input) {
    // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
    // Using charAt should be more compatible.
    return ((input + '').toLowerCase().charAt(0) === 'p');
}

var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
function localeMeridiem (hours, minutes, isLower) {
    if (hours > 11) {
        return isLower ? 'pm' : 'PM';
    } else {
        return isLower ? 'am' : 'AM';
    }
}


// MOMENTS

// Setting the hour should keep the time, because the user explicitly
// specified which hour he wants. So trying to maintain the same hour (in
// a new timezone) makes sense. Adding/subtracting hours does not follow
// this rule.
var getSetHour = makeGetSet('Hours', true);

// months
// week
// weekdays
// meridiem
var baseConfig = {
    calendar: defaultCalendar,
    longDateFormat: defaultLongDateFormat,
    invalidDate: defaultInvalidDate,
    ordinal: defaultOrdinal,
    dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
    relativeTime: defaultRelativeTime,

    months: defaultLocaleMonths,
    monthsShort: defaultLocaleMonthsShort,

    week: defaultLocaleWeek,

    weekdays: defaultLocaleWeekdays,
    weekdaysMin: defaultLocaleWeekdaysMin,
    weekdaysShort: defaultLocaleWeekdaysShort,

    meridiemParse: defaultLocaleMeridiemParse
};

// internal storage for locale config files
var locales = {};
var localeFamilies = {};
var globalLocale;

function normalizeLocale(key) {
    return key ? key.toLowerCase().replace('_', '-') : key;
}

// pick the locale from the array
// try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
// substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
function chooseLocale(names) {
    var i = 0, j, next, locale, split;

    while (i < names.length) {
        split = normalizeLocale(names[i]).split('-');
        j = split.length;
        next = normalizeLocale(names[i + 1]);
        next = next ? next.split('-') : null;
        while (j > 0) {
            locale = loadLocale(split.slice(0, j).join('-'));
            if (locale) {
                return locale;
            }
            if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                //the next array item is better than a shallower substring of this one
                break;
            }
            j--;
        }
        i++;
    }
    return null;
}

function loadLocale(name) {
    var oldLocale = null;
    // TODO: Find a better way to register and load all the locales in Node
    if (!locales[name] && (typeof module !== 'undefined') &&
            module && module.exports) {
        try {
            oldLocale = globalLocale._abbr;
            require('./locale/' + name);
            // because defineLocale currently also sets the global locale, we
            // want to undo that for lazy loaded locales
            getSetGlobalLocale(oldLocale);
        } catch (e) { }
    }
    return locales[name];
}

// This function will load locale and then set the global locale.  If
// no arguments are passed in, it will simply return the current global
// locale key.
function getSetGlobalLocale (key, values) {
    var data;
    if (key) {
        if (isUndefined(values)) {
            data = getLocale(key);
        }
        else {
            data = defineLocale(key, values);
        }

        if (data) {
            // moment.duration._locale = moment._locale = data;
            globalLocale = data;
        }
    }

    return globalLocale._abbr;
}

function defineLocale (name, config) {
    if (config !== null) {
        var parentConfig = baseConfig;
        config.abbr = name;
        if (locales[name] != null) {
            deprecateSimple('defineLocaleOverride',
                    'use moment.updateLocale(localeName, config) to change ' +
                    'an existing locale. moment.defineLocale(localeName, ' +
                    'config) should only be used for creating a new locale ' +
                    'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
            parentConfig = locales[name]._config;
        } else if (config.parentLocale != null) {
            if (locales[config.parentLocale] != null) {
                parentConfig = locales[config.parentLocale]._config;
            } else {
                if (!localeFamilies[config.parentLocale]) {
                    localeFamilies[config.parentLocale] = [];
                }
                localeFamilies[config.parentLocale].push({
                    name: name,
                    config: config
                });
                return null;
            }
        }
        locales[name] = new Locale(mergeConfigs(parentConfig, config));

        if (localeFamilies[name]) {
            localeFamilies[name].forEach(function (x) {
                defineLocale(x.name, x.config);
            });
        }

        // backwards compat for now: also set the locale
        // make sure we set the locale AFTER all child locales have been
        // created, so we won't end up with the child locale set.
        getSetGlobalLocale(name);


        return locales[name];
    } else {
        // useful for testing
        delete locales[name];
        return null;
    }
}

function updateLocale(name, config) {
    if (config != null) {
        var locale, parentConfig = baseConfig;
        // MERGE
        if (locales[name] != null) {
            parentConfig = locales[name]._config;
        }
        config = mergeConfigs(parentConfig, config);
        locale = new Locale(config);
        locale.parentLocale = locales[name];
        locales[name] = locale;

        // backwards compat for now: also set the locale
        getSetGlobalLocale(name);
    } else {
        // pass null for config to unupdate, useful for tests
        if (locales[name] != null) {
            if (locales[name].parentLocale != null) {
                locales[name] = locales[name].parentLocale;
            } else if (locales[name] != null) {
                delete locales[name];
            }
        }
    }
    return locales[name];
}

// returns locale data
function getLocale (key) {
    var locale;

    if (key && key._locale && key._locale._abbr) {
        key = key._locale._abbr;
    }

    if (!key) {
        return globalLocale;
    }

    if (!isArray(key)) {
        //short-circuit everything else
        locale = loadLocale(key);
        if (locale) {
            return locale;
        }
        key = [key];
    }

    return chooseLocale(key);
}

function listLocales() {
    return keys$1(locales);
}

function checkOverflow (m) {
    var overflow;
    var a = m._a;

    if (a && getParsingFlags(m).overflow === -2) {
        overflow =
            a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
            a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
            a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
            a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
            a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
            a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
            -1;

        if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
            overflow = DATE;
        }
        if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
            overflow = WEEK;
        }
        if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
            overflow = WEEKDAY;
        }

        getParsingFlags(m).overflow = overflow;
    }

    return m;
}

// iso 8601 regex
// 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;
var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

var isoDates = [
    ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
    ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
    ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
    ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
    ['YYYY-DDD', /\d{4}-\d{3}/],
    ['YYYY-MM', /\d{4}-\d\d/, false],
    ['YYYYYYMMDD', /[+-]\d{10}/],
    ['YYYYMMDD', /\d{8}/],
    // YYYYMM is NOT allowed by the standard
    ['GGGG[W]WWE', /\d{4}W\d{3}/],
    ['GGGG[W]WW', /\d{4}W\d{2}/, false],
    ['YYYYDDD', /\d{7}/]
];

// iso time formats and regexes
var isoTimes = [
    ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
    ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
    ['HH:mm:ss', /\d\d:\d\d:\d\d/],
    ['HH:mm', /\d\d:\d\d/],
    ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
    ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
    ['HHmmss', /\d\d\d\d\d\d/],
    ['HHmm', /\d\d\d\d/],
    ['HH', /\d\d/]
];

var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

// date from iso format
function configFromISO(config) {
    var i, l,
        string = config._i,
        match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
        allowTime, dateFormat, timeFormat, tzFormat;

    if (match) {
        getParsingFlags(config).iso = true;

        for (i = 0, l = isoDates.length; i < l; i++) {
            if (isoDates[i][1].exec(match[1])) {
                dateFormat = isoDates[i][0];
                allowTime = isoDates[i][2] !== false;
                break;
            }
        }
        if (dateFormat == null) {
            config._isValid = false;
            return;
        }
        if (match[3]) {
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(match[3])) {
                    // match[2] should be 'T' or space
                    timeFormat = (match[2] || ' ') + isoTimes[i][0];
                    break;
                }
            }
            if (timeFormat == null) {
                config._isValid = false;
                return;
            }
        }
        if (!allowTime && timeFormat != null) {
            config._isValid = false;
            return;
        }
        if (match[4]) {
            if (tzRegex.exec(match[4])) {
                tzFormat = 'Z';
            } else {
                config._isValid = false;
                return;
            }
        }
        config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
        configFromStringAndFormat(config);
    } else {
        config._isValid = false;
    }
}

// RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
var basicRfcRegex = /^((?:Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d?\d\s(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(?:\d\d)?\d\d\s)(\d\d:\d\d)(\:\d\d)?(\s(?:UT|GMT|[ECMP][SD]T|[A-IK-Za-ik-z]|[+-]\d{4}))$/;

// date and time from ref 2822 format
function configFromRFC2822(config) {
    var string, match, dayFormat,
        dateFormat, timeFormat, tzFormat;
    var timezones = {
        ' GMT': ' +0000',
        ' EDT': ' -0400',
        ' EST': ' -0500',
        ' CDT': ' -0500',
        ' CST': ' -0600',
        ' MDT': ' -0600',
        ' MST': ' -0700',
        ' PDT': ' -0700',
        ' PST': ' -0800'
    };
    var military = 'YXWVUTSRQPONZABCDEFGHIKLM';
    var timezone, timezoneIndex;

    string = config._i
        .replace(/\([^\)]*\)|[\n\t]/g, ' ') // Remove comments and folding whitespace
        .replace(/(\s\s+)/g, ' ') // Replace multiple-spaces with a single space
        .replace(/^\s|\s$/g, ''); // Remove leading and trailing spaces
    match = basicRfcRegex.exec(string);

    if (match) {
        dayFormat = match[1] ? 'ddd' + ((match[1].length === 5) ? ', ' : ' ') : '';
        dateFormat = 'D MMM ' + ((match[2].length > 10) ? 'YYYY ' : 'YY ');
        timeFormat = 'HH:mm' + (match[4] ? ':ss' : '');

        // TODO: Replace the vanilla JS Date object with an indepentent day-of-week check.
        if (match[1]) { // day of week given
            var momentDate = new Date(match[2]);
            var momentDay = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][momentDate.getDay()];

            if (match[1].substr(0,3) !== momentDay) {
                getParsingFlags(config).weekdayMismatch = true;
                config._isValid = false;
                return;
            }
        }

        switch (match[5].length) {
            case 2: // military
                if (timezoneIndex === 0) {
                    timezone = ' +0000';
                } else {
                    timezoneIndex = military.indexOf(match[5][1].toUpperCase()) - 12;
                    timezone = ((timezoneIndex < 0) ? ' -' : ' +') +
                        (('' + timezoneIndex).replace(/^-?/, '0')).match(/..$/)[0] + '00';
                }
                break;
            case 4: // Zone
                timezone = timezones[match[5]];
                break;
            default: // UT or +/-9999
                timezone = timezones[' GMT'];
        }
        match[5] = timezone;
        config._i = match.splice(1).join('');
        tzFormat = ' ZZ';
        config._f = dayFormat + dateFormat + timeFormat + tzFormat;
        configFromStringAndFormat(config);
        getParsingFlags(config).rfc2822 = true;
    } else {
        config._isValid = false;
    }
}

// date from iso format or fallback
function configFromString(config) {
    var matched = aspNetJsonRegex.exec(config._i);

    if (matched !== null) {
        config._d = new Date(+matched[1]);
        return;
    }

    configFromISO(config);
    if (config._isValid === false) {
        delete config._isValid;
    } else {
        return;
    }

    configFromRFC2822(config);
    if (config._isValid === false) {
        delete config._isValid;
    } else {
        return;
    }

    // Final attempt, use Input Fallback
    hooks.createFromInputFallback(config);
}

hooks.createFromInputFallback = deprecate(
    'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
    'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
    'discouraged and will be removed in an upcoming major release. Please refer to ' +
    'http://momentjs.com/guides/#/warnings/js-date/ for more info.',
    function (config) {
        config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
    }
);

// Pick the first defined of two or three arguments.
function defaults(a, b, c) {
    if (a != null) {
        return a;
    }
    if (b != null) {
        return b;
    }
    return c;
}

function currentDateArray(config) {
    // hooks is actually the exported moment object
    var nowValue = new Date(hooks.now());
    if (config._useUTC) {
        return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
    }
    return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
}

// convert an array to a date.
// the array should mirror the parameters below
// note: all values past the year are optional and will default to the lowest possible value.
// [year, month, day , hour, minute, second, millisecond]
function configFromArray (config) {
    var i, date, input = [], currentDate, yearToUse;

    if (config._d) {
        return;
    }

    currentDate = currentDateArray(config);

    //compute day of the year from weeks and weekdays
    if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
        dayOfYearFromWeekInfo(config);
    }

    //if the day of the year is set, figure out what it is
    if (config._dayOfYear != null) {
        yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

        if (config._dayOfYear > daysInYear(yearToUse) || config._dayOfYear === 0) {
            getParsingFlags(config)._overflowDayOfYear = true;
        }

        date = createUTCDate(yearToUse, 0, config._dayOfYear);
        config._a[MONTH] = date.getUTCMonth();
        config._a[DATE] = date.getUTCDate();
    }

    // Default to current date.
    // * if no year, month, day of month are given, default to today
    // * if day of month is given, default month and year
    // * if month is given, default only year
    // * if year is given, don't default anything
    for (i = 0; i < 3 && config._a[i] == null; ++i) {
        config._a[i] = input[i] = currentDate[i];
    }

    // Zero out whatever was not defaulted, including time
    for (; i < 7; i++) {
        config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
    }

    // Check for 24:00:00.000
    if (config._a[HOUR] === 24 &&
            config._a[MINUTE] === 0 &&
            config._a[SECOND] === 0 &&
            config._a[MILLISECOND] === 0) {
        config._nextDay = true;
        config._a[HOUR] = 0;
    }

    config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
    // Apply timezone offset from input. The actual utcOffset can be changed
    // with parseZone.
    if (config._tzm != null) {
        config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
    }

    if (config._nextDay) {
        config._a[HOUR] = 24;
    }
}

function dayOfYearFromWeekInfo(config) {
    var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

    w = config._w;
    if (w.GG != null || w.W != null || w.E != null) {
        dow = 1;
        doy = 4;

        // TODO: We need to take the current isoWeekYear, but that depends on
        // how we interpret now (local, utc, fixed offset). So create
        // a now version of current config (take local/utc/offset flags, and
        // create now).
        weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(createLocal(), 1, 4).year);
        week = defaults(w.W, 1);
        weekday = defaults(w.E, 1);
        if (weekday < 1 || weekday > 7) {
            weekdayOverflow = true;
        }
    } else {
        dow = config._locale._week.dow;
        doy = config._locale._week.doy;

        var curWeek = weekOfYear(createLocal(), dow, doy);

        weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

        // Default to current week.
        week = defaults(w.w, curWeek.week);

        if (w.d != null) {
            // weekday -- low day numbers are considered next week
            weekday = w.d;
            if (weekday < 0 || weekday > 6) {
                weekdayOverflow = true;
            }
        } else if (w.e != null) {
            // local weekday -- counting starts from begining of week
            weekday = w.e + dow;
            if (w.e < 0 || w.e > 6) {
                weekdayOverflow = true;
            }
        } else {
            // default to begining of week
            weekday = dow;
        }
    }
    if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
        getParsingFlags(config)._overflowWeeks = true;
    } else if (weekdayOverflow != null) {
        getParsingFlags(config)._overflowWeekday = true;
    } else {
        temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }
}

// constant that refers to the ISO standard
hooks.ISO_8601 = function () {};

// constant that refers to the RFC 2822 form
hooks.RFC_2822 = function () {};

// date from string and format string
function configFromStringAndFormat(config) {
    // TODO: Move this to another part of the creation flow to prevent circular deps
    if (config._f === hooks.ISO_8601) {
        configFromISO(config);
        return;
    }
    if (config._f === hooks.RFC_2822) {
        configFromRFC2822(config);
        return;
    }
    config._a = [];
    getParsingFlags(config).empty = true;

    // This array is used to make a Date, either with `new Date` or `Date.UTC`
    var string = '' + config._i,
        i, parsedInput, tokens, token, skipped,
        stringLength = string.length,
        totalParsedInputLength = 0;

    tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

    for (i = 0; i < tokens.length; i++) {
        token = tokens[i];
        parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
        // console.log('token', token, 'parsedInput', parsedInput,
        //         'regex', getParseRegexForToken(token, config));
        if (parsedInput) {
            skipped = string.substr(0, string.indexOf(parsedInput));
            if (skipped.length > 0) {
                getParsingFlags(config).unusedInput.push(skipped);
            }
            string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
            totalParsedInputLength += parsedInput.length;
        }
        // don't parse if it's not a known token
        if (formatTokenFunctions[token]) {
            if (parsedInput) {
                getParsingFlags(config).empty = false;
            }
            else {
                getParsingFlags(config).unusedTokens.push(token);
            }
            addTimeToArrayFromToken(token, parsedInput, config);
        }
        else if (config._strict && !parsedInput) {
            getParsingFlags(config).unusedTokens.push(token);
        }
    }

    // add remaining unparsed input length to the string
    getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
    if (string.length > 0) {
        getParsingFlags(config).unusedInput.push(string);
    }

    // clear _12h flag if hour is <= 12
    if (config._a[HOUR] <= 12 &&
        getParsingFlags(config).bigHour === true &&
        config._a[HOUR] > 0) {
        getParsingFlags(config).bigHour = undefined;
    }

    getParsingFlags(config).parsedDateParts = config._a.slice(0);
    getParsingFlags(config).meridiem = config._meridiem;
    // handle meridiem
    config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

    configFromArray(config);
    checkOverflow(config);
}


function meridiemFixWrap (locale, hour, meridiem) {
    var isPm;

    if (meridiem == null) {
        // nothing to do
        return hour;
    }
    if (locale.meridiemHour != null) {
        return locale.meridiemHour(hour, meridiem);
    } else if (locale.isPM != null) {
        // Fallback
        isPm = locale.isPM(meridiem);
        if (isPm && hour < 12) {
            hour += 12;
        }
        if (!isPm && hour === 12) {
            hour = 0;
        }
        return hour;
    } else {
        // this is not supposed to happen
        return hour;
    }
}

// date from string and array of format strings
function configFromStringAndArray(config) {
    var tempConfig,
        bestMoment,

        scoreToBeat,
        i,
        currentScore;

    if (config._f.length === 0) {
        getParsingFlags(config).invalidFormat = true;
        config._d = new Date(NaN);
        return;
    }

    for (i = 0; i < config._f.length; i++) {
        currentScore = 0;
        tempConfig = copyConfig({}, config);
        if (config._useUTC != null) {
            tempConfig._useUTC = config._useUTC;
        }
        tempConfig._f = config._f[i];
        configFromStringAndFormat(tempConfig);

        if (!isValid(tempConfig)) {
            continue;
        }

        // if there is any input that was not parsed add a penalty for that format
        currentScore += getParsingFlags(tempConfig).charsLeftOver;

        //or tokens
        currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

        getParsingFlags(tempConfig).score = currentScore;

        if (scoreToBeat == null || currentScore < scoreToBeat) {
            scoreToBeat = currentScore;
            bestMoment = tempConfig;
        }
    }

    extend(config, bestMoment || tempConfig);
}

function configFromObject(config) {
    if (config._d) {
        return;
    }

    var i = normalizeObjectUnits(config._i);
    config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
        return obj && parseInt(obj, 10);
    });

    configFromArray(config);
}

function createFromConfig (config) {
    var res = new Moment(checkOverflow(prepareConfig(config)));
    if (res._nextDay) {
        // Adding is smart enough around DST
        res.add(1, 'd');
        res._nextDay = undefined;
    }

    return res;
}

function prepareConfig (config) {
    var input = config._i,
        format = config._f;

    config._locale = config._locale || getLocale(config._l);

    if (input === null || (format === undefined && input === '')) {
        return createInvalid({nullInput: true});
    }

    if (typeof input === 'string') {
        config._i = input = config._locale.preparse(input);
    }

    if (isMoment(input)) {
        return new Moment(checkOverflow(input));
    } else if (isDate(input)) {
        config._d = input;
    } else if (isArray(format)) {
        configFromStringAndArray(config);
    } else if (format) {
        configFromStringAndFormat(config);
    }  else {
        configFromInput(config);
    }

    if (!isValid(config)) {
        config._d = null;
    }

    return config;
}

function configFromInput(config) {
    var input = config._i;
    if (isUndefined(input)) {
        config._d = new Date(hooks.now());
    } else if (isDate(input)) {
        config._d = new Date(input.valueOf());
    } else if (typeof input === 'string') {
        configFromString(config);
    } else if (isArray(input)) {
        config._a = map(input.slice(0), function (obj) {
            return parseInt(obj, 10);
        });
        configFromArray(config);
    } else if (isObject(input)) {
        configFromObject(config);
    } else if (isNumber(input)) {
        // from milliseconds
        config._d = new Date(input);
    } else {
        hooks.createFromInputFallback(config);
    }
}

function createLocalOrUTC (input, format, locale, strict, isUTC) {
    var c = {};

    if (locale === true || locale === false) {
        strict = locale;
        locale = undefined;
    }

    if ((isObject(input) && isObjectEmpty(input)) ||
            (isArray(input) && input.length === 0)) {
        input = undefined;
    }
    // object construction must be done this way.
    // https://github.com/moment/moment/issues/1423
    c._isAMomentObject = true;
    c._useUTC = c._isUTC = isUTC;
    c._l = locale;
    c._i = input;
    c._f = format;
    c._strict = strict;

    return createFromConfig(c);
}

function createLocal (input, format, locale, strict) {
    return createLocalOrUTC(input, format, locale, strict, false);
}

var prototypeMin = deprecate(
    'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
    function () {
        var other = createLocal.apply(null, arguments);
        if (this.isValid() && other.isValid()) {
            return other < this ? this : other;
        } else {
            return createInvalid();
        }
    }
);

var prototypeMax = deprecate(
    'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
    function () {
        var other = createLocal.apply(null, arguments);
        if (this.isValid() && other.isValid()) {
            return other > this ? this : other;
        } else {
            return createInvalid();
        }
    }
);

// Pick a moment m from moments so that m[fn](other) is true for all
// other. This relies on the function fn to be transitive.
//
// moments should either be an array of moment objects or an array, whose
// first element is an array of moment objects.
function pickBy(fn, moments) {
    var res, i;
    if (moments.length === 1 && isArray(moments[0])) {
        moments = moments[0];
    }
    if (!moments.length) {
        return createLocal();
    }
    res = moments[0];
    for (i = 1; i < moments.length; ++i) {
        if (!moments[i].isValid() || moments[i][fn](res)) {
            res = moments[i];
        }
    }
    return res;
}

// TODO: Use [].sort instead?
function min () {
    var args = [].slice.call(arguments, 0);

    return pickBy('isBefore', args);
}

function max () {
    var args = [].slice.call(arguments, 0);

    return pickBy('isAfter', args);
}

var now = function () {
    return Date.now ? Date.now() : +(new Date());
};

var ordering = ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'];

function isDurationValid(m) {
    for (var key in m) {
        if (!(ordering.indexOf(key) !== -1 && (m[key] == null || !isNaN(m[key])))) {
            return false;
        }
    }

    var unitHasDecimal = false;
    for (var i = 0; i < ordering.length; ++i) {
        if (m[ordering[i]]) {
            if (unitHasDecimal) {
                return false; // only allow non-integers for smallest unit
            }
            if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                unitHasDecimal = true;
            }
        }
    }

    return true;
}

function isValid$1() {
    return this._isValid;
}

function createInvalid$1() {
    return createDuration(NaN);
}

function Duration (duration) {
    var normalizedInput = normalizeObjectUnits(duration),
        years = normalizedInput.year || 0,
        quarters = normalizedInput.quarter || 0,
        months = normalizedInput.month || 0,
        weeks = normalizedInput.week || 0,
        days = normalizedInput.day || 0,
        hours = normalizedInput.hour || 0,
        minutes = normalizedInput.minute || 0,
        seconds = normalizedInput.second || 0,
        milliseconds = normalizedInput.millisecond || 0;

    this._isValid = isDurationValid(normalizedInput);

    // representation for dateAddRemove
    this._milliseconds = +milliseconds +
        seconds * 1e3 + // 1000
        minutes * 6e4 + // 1000 * 60
        hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
    // Because of dateAddRemove treats 24 hours as different from a
    // day when working around DST, we need to store them separately
    this._days = +days +
        weeks * 7;
    // It is impossible translate months into days without knowing
    // which months you are are talking about, so we have to store
    // it separately.
    this._months = +months +
        quarters * 3 +
        years * 12;

    this._data = {};

    this._locale = getLocale();

    this._bubble();
}

function isDuration (obj) {
    return obj instanceof Duration;
}

function absRound (number) {
    if (number < 0) {
        return Math.round(-1 * number) * -1;
    } else {
        return Math.round(number);
    }
}

// FORMATTING

function offset (token, separator) {
    addFormatToken(token, 0, 0, function () {
        var offset = this.utcOffset();
        var sign = '+';
        if (offset < 0) {
            offset = -offset;
            sign = '-';
        }
        return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
    });
}

offset('Z', ':');
offset('ZZ', '');

// PARSING

addRegexToken('Z',  matchShortOffset);
addRegexToken('ZZ', matchShortOffset);
addParseToken(['Z', 'ZZ'], function (input, array, config) {
    config._useUTC = true;
    config._tzm = offsetFromString(matchShortOffset, input);
});

// HELPERS

// timezone chunker
// '+10:00' > ['10',  '00']
// '-1530'  > ['-15', '30']
var chunkOffset = /([\+\-]|\d\d)/gi;

function offsetFromString(matcher, string) {
    var matches = (string || '').match(matcher);

    if (matches === null) {
        return null;
    }

    var chunk   = matches[matches.length - 1] || [];
    var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
    var minutes = +(parts[1] * 60) + toInt(parts[2]);

    return minutes === 0 ?
      0 :
      parts[0] === '+' ? minutes : -minutes;
}

// Return a moment from input, that is local/utc/zone equivalent to model.
function cloneWithOffset(input, model) {
    var res, diff;
    if (model._isUTC) {
        res = model.clone();
        diff = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
        // Use low-level api, because this fn is low-level api.
        res._d.setTime(res._d.valueOf() + diff);
        hooks.updateOffset(res, false);
        return res;
    } else {
        return createLocal(input).local();
    }
}

function getDateOffset (m) {
    // On Firefox.24 Date#getTimezoneOffset returns a floating point.
    // https://github.com/moment/moment/pull/1871
    return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
}

// HOOKS

// This function will be called whenever a moment is mutated.
// It is intended to keep the offset in sync with the timezone.
hooks.updateOffset = function () {};

// MOMENTS

// keepLocalTime = true means only change the timezone, without
// affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
// 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
// +0200, so we adjust the time as needed, to be valid.
//
// Keeping the time actually adds/subtracts (one hour)
// from the actual represented time. That is why we call updateOffset
// a second time. In case it wants us to change the offset again
// _changeInProgress == true case, then we have to adjust, because
// there is no such time in the given timezone.
function getSetOffset (input, keepLocalTime, keepMinutes) {
    var offset = this._offset || 0,
        localAdjust;
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }
    if (input != null) {
        if (typeof input === 'string') {
            input = offsetFromString(matchShortOffset, input);
            if (input === null) {
                return this;
            }
        } else if (Math.abs(input) < 16 && !keepMinutes) {
            input = input * 60;
        }
        if (!this._isUTC && keepLocalTime) {
            localAdjust = getDateOffset(this);
        }
        this._offset = input;
        this._isUTC = true;
        if (localAdjust != null) {
            this.add(localAdjust, 'm');
        }
        if (offset !== input) {
            if (!keepLocalTime || this._changeInProgress) {
                addSubtract(this, createDuration(input - offset, 'm'), 1, false);
            } else if (!this._changeInProgress) {
                this._changeInProgress = true;
                hooks.updateOffset(this, true);
                this._changeInProgress = null;
            }
        }
        return this;
    } else {
        return this._isUTC ? offset : getDateOffset(this);
    }
}

function getSetZone (input, keepLocalTime) {
    if (input != null) {
        if (typeof input !== 'string') {
            input = -input;
        }

        this.utcOffset(input, keepLocalTime);

        return this;
    } else {
        return -this.utcOffset();
    }
}

function setOffsetToUTC (keepLocalTime) {
    return this.utcOffset(0, keepLocalTime);
}

function setOffsetToLocal (keepLocalTime) {
    if (this._isUTC) {
        this.utcOffset(0, keepLocalTime);
        this._isUTC = false;

        if (keepLocalTime) {
            this.subtract(getDateOffset(this), 'm');
        }
    }
    return this;
}

function setOffsetToParsedOffset () {
    if (this._tzm != null) {
        this.utcOffset(this._tzm, false, true);
    } else if (typeof this._i === 'string') {
        var tZone = offsetFromString(matchOffset, this._i);
        if (tZone != null) {
            this.utcOffset(tZone);
        }
        else {
            this.utcOffset(0, true);
        }
    }
    return this;
}

function hasAlignedHourOffset (input) {
    if (!this.isValid()) {
        return false;
    }
    input = input ? createLocal(input).utcOffset() : 0;

    return (this.utcOffset() - input) % 60 === 0;
}

function isDaylightSavingTime () {
    return (
        this.utcOffset() > this.clone().month(0).utcOffset() ||
        this.utcOffset() > this.clone().month(5).utcOffset()
    );
}

function isDaylightSavingTimeShifted () {
    if (!isUndefined(this._isDSTShifted)) {
        return this._isDSTShifted;
    }

    var c = {};

    copyConfig(c, this);
    c = prepareConfig(c);

    if (c._a) {
        var other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
        this._isDSTShifted = this.isValid() &&
            compareArrays(c._a, other.toArray()) > 0;
    } else {
        this._isDSTShifted = false;
    }

    return this._isDSTShifted;
}

function isLocal () {
    return this.isValid() ? !this._isUTC : false;
}

function isUtcOffset () {
    return this.isValid() ? this._isUTC : false;
}

function isUtc () {
    return this.isValid() ? this._isUTC && this._offset === 0 : false;
}

// ASP.NET json date format regex
var aspNetRegex = /^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;

// from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
// somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
// and further modified to allow for strings containing both week and day
var isoRegex = /^(-)?P(?:(-?[0-9,.]*)Y)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)W)?(?:(-?[0-9,.]*)D)?(?:T(?:(-?[0-9,.]*)H)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)S)?)?$/;

function createDuration (input, key) {
    var duration = input,
        // matching against regexp is expensive, do it on demand
        match = null,
        sign,
        ret,
        diffRes;

    if (isDuration(input)) {
        duration = {
            ms : input._milliseconds,
            d  : input._days,
            M  : input._months
        };
    } else if (isNumber(input)) {
        duration = {};
        if (key) {
            duration[key] = input;
        } else {
            duration.milliseconds = input;
        }
    } else if (!!(match = aspNetRegex.exec(input))) {
        sign = (match[1] === '-') ? -1 : 1;
        duration = {
            y  : 0,
            d  : toInt(match[DATE])                         * sign,
            h  : toInt(match[HOUR])                         * sign,
            m  : toInt(match[MINUTE])                       * sign,
            s  : toInt(match[SECOND])                       * sign,
            ms : toInt(absRound(match[MILLISECOND] * 1000)) * sign // the millisecond decimal point is included in the match
        };
    } else if (!!(match = isoRegex.exec(input))) {
        sign = (match[1] === '-') ? -1 : 1;
        duration = {
            y : parseIso(match[2], sign),
            M : parseIso(match[3], sign),
            w : parseIso(match[4], sign),
            d : parseIso(match[5], sign),
            h : parseIso(match[6], sign),
            m : parseIso(match[7], sign),
            s : parseIso(match[8], sign)
        };
    } else if (duration == null) {// checks for null or undefined
        duration = {};
    } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
        diffRes = momentsDifference(createLocal(duration.from), createLocal(duration.to));

        duration = {};
        duration.ms = diffRes.milliseconds;
        duration.M = diffRes.months;
    }

    ret = new Duration(duration);

    if (isDuration(input) && hasOwnProp(input, '_locale')) {
        ret._locale = input._locale;
    }

    return ret;
}

createDuration.fn = Duration.prototype;
createDuration.invalid = createInvalid$1;

function parseIso (inp, sign) {
    // We'd normally use ~~inp for this, but unfortunately it also
    // converts floats to ints.
    // inp may be undefined, so careful calling replace on it.
    var res = inp && parseFloat(inp.replace(',', '.'));
    // apply sign while we're at it
    return (isNaN(res) ? 0 : res) * sign;
}

function positiveMomentsDifference(base, other) {
    var res = {milliseconds: 0, months: 0};

    res.months = other.month() - base.month() +
        (other.year() - base.year()) * 12;
    if (base.clone().add(res.months, 'M').isAfter(other)) {
        --res.months;
    }

    res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

    return res;
}

function momentsDifference(base, other) {
    var res;
    if (!(base.isValid() && other.isValid())) {
        return {milliseconds: 0, months: 0};
    }

    other = cloneWithOffset(other, base);
    if (base.isBefore(other)) {
        res = positiveMomentsDifference(base, other);
    } else {
        res = positiveMomentsDifference(other, base);
        res.milliseconds = -res.milliseconds;
        res.months = -res.months;
    }

    return res;
}

// TODO: remove 'name' arg after deprecation is removed
function createAdder(direction, name) {
    return function (val, period) {
        var dur, tmp;
        //invert the arguments, but complain about it
        if (period !== null && !isNaN(+period)) {
            deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' +
            'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
            tmp = val; val = period; period = tmp;
        }

        val = typeof val === 'string' ? +val : val;
        dur = createDuration(val, period);
        addSubtract(this, dur, direction);
        return this;
    };
}

function addSubtract (mom, duration, isAdding, updateOffset) {
    var milliseconds = duration._milliseconds,
        days = absRound(duration._days),
        months = absRound(duration._months);

    if (!mom.isValid()) {
        // No op
        return;
    }

    updateOffset = updateOffset == null ? true : updateOffset;

    if (milliseconds) {
        mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
    }
    if (days) {
        set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
    }
    if (months) {
        setMonth(mom, get(mom, 'Month') + months * isAdding);
    }
    if (updateOffset) {
        hooks.updateOffset(mom, days || months);
    }
}

var add      = createAdder(1, 'add');
var subtract = createAdder(-1, 'subtract');

function getCalendarFormat(myMoment, now) {
    var diff = myMoment.diff(now, 'days', true);
    return diff < -6 ? 'sameElse' :
            diff < -1 ? 'lastWeek' :
            diff < 0 ? 'lastDay' :
            diff < 1 ? 'sameDay' :
            diff < 2 ? 'nextDay' :
            diff < 7 ? 'nextWeek' : 'sameElse';
}

function calendar$1 (time, formats) {
    // We want to compare the start of today, vs this.
    // Getting start-of-today depends on whether we're local/utc/offset or not.
    var now = time || createLocal(),
        sod = cloneWithOffset(now, this).startOf('day'),
        format = hooks.calendarFormat(this, sod) || 'sameElse';

    var output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);

    return this.format(output || this.localeData().calendar(format, this, createLocal(now)));
}

function clone () {
    return new Moment(this);
}

function isAfter (input, units) {
    var localInput = isMoment(input) ? input : createLocal(input);
    if (!(this.isValid() && localInput.isValid())) {
        return false;
    }
    units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
    if (units === 'millisecond') {
        return this.valueOf() > localInput.valueOf();
    } else {
        return localInput.valueOf() < this.clone().startOf(units).valueOf();
    }
}

function isBefore (input, units) {
    var localInput = isMoment(input) ? input : createLocal(input);
    if (!(this.isValid() && localInput.isValid())) {
        return false;
    }
    units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
    if (units === 'millisecond') {
        return this.valueOf() < localInput.valueOf();
    } else {
        return this.clone().endOf(units).valueOf() < localInput.valueOf();
    }
}

function isBetween (from, to, units, inclusivity) {
    inclusivity = inclusivity || '()';
    return (inclusivity[0] === '(' ? this.isAfter(from, units) : !this.isBefore(from, units)) &&
        (inclusivity[1] === ')' ? this.isBefore(to, units) : !this.isAfter(to, units));
}

function isSame (input, units) {
    var localInput = isMoment(input) ? input : createLocal(input),
        inputMs;
    if (!(this.isValid() && localInput.isValid())) {
        return false;
    }
    units = normalizeUnits(units || 'millisecond');
    if (units === 'millisecond') {
        return this.valueOf() === localInput.valueOf();
    } else {
        inputMs = localInput.valueOf();
        return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
    }
}

function isSameOrAfter (input, units) {
    return this.isSame(input, units) || this.isAfter(input,units);
}

function isSameOrBefore (input, units) {
    return this.isSame(input, units) || this.isBefore(input,units);
}

function diff (input, units, asFloat) {
    var that,
        zoneDelta,
        delta, output;

    if (!this.isValid()) {
        return NaN;
    }

    that = cloneWithOffset(input, this);

    if (!that.isValid()) {
        return NaN;
    }

    zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

    units = normalizeUnits(units);

    if (units === 'year' || units === 'month' || units === 'quarter') {
        output = monthDiff(this, that);
        if (units === 'quarter') {
            output = output / 3;
        } else if (units === 'year') {
            output = output / 12;
        }
    } else {
        delta = this - that;
        output = units === 'second' ? delta / 1e3 : // 1000
            units === 'minute' ? delta / 6e4 : // 1000 * 60
            units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
            units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
            units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
            delta;
    }
    return asFloat ? output : absFloor(output);
}

function monthDiff (a, b) {
    // difference in months
    var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
        // b is in (anchor - 1 month, anchor + 1 month)
        anchor = a.clone().add(wholeMonthDiff, 'months'),
        anchor2, adjust;

    if (b - anchor < 0) {
        anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
        // linear across the month
        adjust = (b - anchor) / (anchor - anchor2);
    } else {
        anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
        // linear across the month
        adjust = (b - anchor) / (anchor2 - anchor);
    }

    //check for negative zero, return zero if negative zero
    return -(wholeMonthDiff + adjust) || 0;
}

hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

function toString () {
    return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
}

function toISOString() {
    if (!this.isValid()) {
        return null;
    }
    var m = this.clone().utc();
    if (m.year() < 0 || m.year() > 9999) {
        return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
    }
    if (isFunction(Date.prototype.toISOString)) {
        // native implementation is ~50x faster, use it when we can
        return this.toDate().toISOString();
    }
    return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
}

/**
 * Return a human readable representation of a moment that can
 * also be evaluated to get a new moment which is the same
 *
 * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
 */
function inspect () {
    if (!this.isValid()) {
        return 'moment.invalid(/* ' + this._i + ' */)';
    }
    var func = 'moment';
    var zone = '';
    if (!this.isLocal()) {
        func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
        zone = 'Z';
    }
    var prefix = '[' + func + '("]';
    var year = (0 <= this.year() && this.year() <= 9999) ? 'YYYY' : 'YYYYYY';
    var datetime = '-MM-DD[T]HH:mm:ss.SSS';
    var suffix = zone + '[")]';

    return this.format(prefix + year + datetime + suffix);
}

function format (inputString) {
    if (!inputString) {
        inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
    }
    var output = formatMoment(this, inputString);
    return this.localeData().postformat(output);
}

function from (time, withoutSuffix) {
    if (this.isValid() &&
            ((isMoment(time) && time.isValid()) ||
             createLocal(time).isValid())) {
        return createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
    } else {
        return this.localeData().invalidDate();
    }
}

function fromNow (withoutSuffix) {
    return this.from(createLocal(), withoutSuffix);
}

function to (time, withoutSuffix) {
    if (this.isValid() &&
            ((isMoment(time) && time.isValid()) ||
             createLocal(time).isValid())) {
        return createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
    } else {
        return this.localeData().invalidDate();
    }
}

function toNow (withoutSuffix) {
    return this.to(createLocal(), withoutSuffix);
}

// If passed a locale key, it will set the locale for this
// instance.  Otherwise, it will return the locale configuration
// variables for this instance.
function locale (key) {
    var newLocaleData;

    if (key === undefined) {
        return this._locale._abbr;
    } else {
        newLocaleData = getLocale(key);
        if (newLocaleData != null) {
            this._locale = newLocaleData;
        }
        return this;
    }
}

var lang = deprecate(
    'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
    function (key) {
        if (key === undefined) {
            return this.localeData();
        } else {
            return this.locale(key);
        }
    }
);

function localeData () {
    return this._locale;
}

function startOf (units) {
    units = normalizeUnits(units);
    // the following switch intentionally omits break keywords
    // to utilize falling through the cases.
    switch (units) {
        case 'year':
            this.month(0);
            /* falls through */
        case 'quarter':
        case 'month':
            this.date(1);
            /* falls through */
        case 'week':
        case 'isoWeek':
        case 'day':
        case 'date':
            this.hours(0);
            /* falls through */
        case 'hour':
            this.minutes(0);
            /* falls through */
        case 'minute':
            this.seconds(0);
            /* falls through */
        case 'second':
            this.milliseconds(0);
    }

    // weeks are a special case
    if (units === 'week') {
        this.weekday(0);
    }
    if (units === 'isoWeek') {
        this.isoWeekday(1);
    }

    // quarters are also special
    if (units === 'quarter') {
        this.month(Math.floor(this.month() / 3) * 3);
    }

    return this;
}

function endOf (units) {
    units = normalizeUnits(units);
    if (units === undefined || units === 'millisecond') {
        return this;
    }

    // 'date' is an alias for 'day', so it should be considered as such.
    if (units === 'date') {
        units = 'day';
    }

    return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
}

function valueOf () {
    return this._d.valueOf() - ((this._offset || 0) * 60000);
}

function unix () {
    return Math.floor(this.valueOf() / 1000);
}

function toDate () {
    return new Date(this.valueOf());
}

function toArray () {
    var m = this;
    return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
}

function toObject () {
    var m = this;
    return {
        years: m.year(),
        months: m.month(),
        date: m.date(),
        hours: m.hours(),
        minutes: m.minutes(),
        seconds: m.seconds(),
        milliseconds: m.milliseconds()
    };
}

function toJSON () {
    // new Date(NaN).toJSON() === null
    return this.isValid() ? this.toISOString() : null;
}

function isValid$2 () {
    return isValid(this);
}

function parsingFlags () {
    return extend({}, getParsingFlags(this));
}

function invalidAt () {
    return getParsingFlags(this).overflow;
}

function creationData() {
    return {
        input: this._i,
        format: this._f,
        locale: this._locale,
        isUTC: this._isUTC,
        strict: this._strict
    };
}

// FORMATTING

addFormatToken(0, ['gg', 2], 0, function () {
    return this.weekYear() % 100;
});

addFormatToken(0, ['GG', 2], 0, function () {
    return this.isoWeekYear() % 100;
});

function addWeekYearFormatToken (token, getter) {
    addFormatToken(0, [token, token.length], 0, getter);
}

addWeekYearFormatToken('gggg',     'weekYear');
addWeekYearFormatToken('ggggg',    'weekYear');
addWeekYearFormatToken('GGGG',  'isoWeekYear');
addWeekYearFormatToken('GGGGG', 'isoWeekYear');

// ALIASES

addUnitAlias('weekYear', 'gg');
addUnitAlias('isoWeekYear', 'GG');

// PRIORITY

addUnitPriority('weekYear', 1);
addUnitPriority('isoWeekYear', 1);


// PARSING

addRegexToken('G',      matchSigned);
addRegexToken('g',      matchSigned);
addRegexToken('GG',     match1to2, match2);
addRegexToken('gg',     match1to2, match2);
addRegexToken('GGGG',   match1to4, match4);
addRegexToken('gggg',   match1to4, match4);
addRegexToken('GGGGG',  match1to6, match6);
addRegexToken('ggggg',  match1to6, match6);

addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
    week[token.substr(0, 2)] = toInt(input);
});

addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
    week[token] = hooks.parseTwoDigitYear(input);
});

// MOMENTS

function getSetWeekYear (input) {
    return getSetWeekYearHelper.call(this,
            input,
            this.week(),
            this.weekday(),
            this.localeData()._week.dow,
            this.localeData()._week.doy);
}

function getSetISOWeekYear (input) {
    return getSetWeekYearHelper.call(this,
            input, this.isoWeek(), this.isoWeekday(), 1, 4);
}

function getISOWeeksInYear () {
    return weeksInYear(this.year(), 1, 4);
}

function getWeeksInYear () {
    var weekInfo = this.localeData()._week;
    return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
}

function getSetWeekYearHelper(input, week, weekday, dow, doy) {
    var weeksTarget;
    if (input == null) {
        return weekOfYear(this, dow, doy).year;
    } else {
        weeksTarget = weeksInYear(input, dow, doy);
        if (week > weeksTarget) {
            week = weeksTarget;
        }
        return setWeekAll.call(this, input, week, weekday, dow, doy);
    }
}

function setWeekAll(weekYear, week, weekday, dow, doy) {
    var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
        date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

    this.year(date.getUTCFullYear());
    this.month(date.getUTCMonth());
    this.date(date.getUTCDate());
    return this;
}

// FORMATTING

addFormatToken('Q', 0, 'Qo', 'quarter');

// ALIASES

addUnitAlias('quarter', 'Q');

// PRIORITY

addUnitPriority('quarter', 7);

// PARSING

addRegexToken('Q', match1);
addParseToken('Q', function (input, array) {
    array[MONTH] = (toInt(input) - 1) * 3;
});

// MOMENTS

function getSetQuarter (input) {
    return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
}

// FORMATTING

addFormatToken('D', ['DD', 2], 'Do', 'date');

// ALIASES

addUnitAlias('date', 'D');

// PRIOROITY
addUnitPriority('date', 9);

// PARSING

addRegexToken('D',  match1to2);
addRegexToken('DD', match1to2, match2);
addRegexToken('Do', function (isStrict, locale) {
    // TODO: Remove "ordinalParse" fallback in next major release.
    return isStrict ?
      (locale._dayOfMonthOrdinalParse || locale._ordinalParse) :
      locale._dayOfMonthOrdinalParseLenient;
});

addParseToken(['D', 'DD'], DATE);
addParseToken('Do', function (input, array) {
    array[DATE] = toInt(input.match(match1to2)[0], 10);
});

// MOMENTS

var getSetDayOfMonth = makeGetSet('Date', true);

// FORMATTING

addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

// ALIASES

addUnitAlias('dayOfYear', 'DDD');

// PRIORITY
addUnitPriority('dayOfYear', 4);

// PARSING

addRegexToken('DDD',  match1to3);
addRegexToken('DDDD', match3);
addParseToken(['DDD', 'DDDD'], function (input, array, config) {
    config._dayOfYear = toInt(input);
});

// HELPERS

// MOMENTS

function getSetDayOfYear (input) {
    var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
    return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
}

// FORMATTING

addFormatToken('m', ['mm', 2], 0, 'minute');

// ALIASES

addUnitAlias('minute', 'm');

// PRIORITY

addUnitPriority('minute', 14);

// PARSING

addRegexToken('m',  match1to2);
addRegexToken('mm', match1to2, match2);
addParseToken(['m', 'mm'], MINUTE);

// MOMENTS

var getSetMinute = makeGetSet('Minutes', false);

// FORMATTING

addFormatToken('s', ['ss', 2], 0, 'second');

// ALIASES

addUnitAlias('second', 's');

// PRIORITY

addUnitPriority('second', 15);

// PARSING

addRegexToken('s',  match1to2);
addRegexToken('ss', match1to2, match2);
addParseToken(['s', 'ss'], SECOND);

// MOMENTS

var getSetSecond = makeGetSet('Seconds', false);

// FORMATTING

addFormatToken('S', 0, 0, function () {
    return ~~(this.millisecond() / 100);
});

addFormatToken(0, ['SS', 2], 0, function () {
    return ~~(this.millisecond() / 10);
});

addFormatToken(0, ['SSS', 3], 0, 'millisecond');
addFormatToken(0, ['SSSS', 4], 0, function () {
    return this.millisecond() * 10;
});
addFormatToken(0, ['SSSSS', 5], 0, function () {
    return this.millisecond() * 100;
});
addFormatToken(0, ['SSSSSS', 6], 0, function () {
    return this.millisecond() * 1000;
});
addFormatToken(0, ['SSSSSSS', 7], 0, function () {
    return this.millisecond() * 10000;
});
addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
    return this.millisecond() * 100000;
});
addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
    return this.millisecond() * 1000000;
});


// ALIASES

addUnitAlias('millisecond', 'ms');

// PRIORITY

addUnitPriority('millisecond', 16);

// PARSING

addRegexToken('S',    match1to3, match1);
addRegexToken('SS',   match1to3, match2);
addRegexToken('SSS',  match1to3, match3);

var token;
for (token = 'SSSS'; token.length <= 9; token += 'S') {
    addRegexToken(token, matchUnsigned);
}

function parseMs(input, array) {
    array[MILLISECOND] = toInt(('0.' + input) * 1000);
}

for (token = 'S'; token.length <= 9; token += 'S') {
    addParseToken(token, parseMs);
}
// MOMENTS

var getSetMillisecond = makeGetSet('Milliseconds', false);

// FORMATTING

addFormatToken('z',  0, 0, 'zoneAbbr');
addFormatToken('zz', 0, 0, 'zoneName');

// MOMENTS

function getZoneAbbr () {
    return this._isUTC ? 'UTC' : '';
}

function getZoneName () {
    return this._isUTC ? 'Coordinated Universal Time' : '';
}

var proto = Moment.prototype;

proto.add               = add;
proto.calendar          = calendar$1;
proto.clone             = clone;
proto.diff              = diff;
proto.endOf             = endOf;
proto.format            = format;
proto.from              = from;
proto.fromNow           = fromNow;
proto.to                = to;
proto.toNow             = toNow;
proto.get               = stringGet;
proto.invalidAt         = invalidAt;
proto.isAfter           = isAfter;
proto.isBefore          = isBefore;
proto.isBetween         = isBetween;
proto.isSame            = isSame;
proto.isSameOrAfter     = isSameOrAfter;
proto.isSameOrBefore    = isSameOrBefore;
proto.isValid           = isValid$2;
proto.lang              = lang;
proto.locale            = locale;
proto.localeData        = localeData;
proto.max               = prototypeMax;
proto.min               = prototypeMin;
proto.parsingFlags      = parsingFlags;
proto.set               = stringSet;
proto.startOf           = startOf;
proto.subtract          = subtract;
proto.toArray           = toArray;
proto.toObject          = toObject;
proto.toDate            = toDate;
proto.toISOString       = toISOString;
proto.inspect           = inspect;
proto.toJSON            = toJSON;
proto.toString          = toString;
proto.unix              = unix;
proto.valueOf           = valueOf;
proto.creationData      = creationData;

// Year
proto.year       = getSetYear;
proto.isLeapYear = getIsLeapYear;

// Week Year
proto.weekYear    = getSetWeekYear;
proto.isoWeekYear = getSetISOWeekYear;

// Quarter
proto.quarter = proto.quarters = getSetQuarter;

// Month
proto.month       = getSetMonth;
proto.daysInMonth = getDaysInMonth;

// Week
proto.week           = proto.weeks        = getSetWeek;
proto.isoWeek        = proto.isoWeeks     = getSetISOWeek;
proto.weeksInYear    = getWeeksInYear;
proto.isoWeeksInYear = getISOWeeksInYear;

// Day
proto.date       = getSetDayOfMonth;
proto.day        = proto.days             = getSetDayOfWeek;
proto.weekday    = getSetLocaleDayOfWeek;
proto.isoWeekday = getSetISODayOfWeek;
proto.dayOfYear  = getSetDayOfYear;

// Hour
proto.hour = proto.hours = getSetHour;

// Minute
proto.minute = proto.minutes = getSetMinute;

// Second
proto.second = proto.seconds = getSetSecond;

// Millisecond
proto.millisecond = proto.milliseconds = getSetMillisecond;

// Offset
proto.utcOffset            = getSetOffset;
proto.utc                  = setOffsetToUTC;
proto.local                = setOffsetToLocal;
proto.parseZone            = setOffsetToParsedOffset;
proto.hasAlignedHourOffset = hasAlignedHourOffset;
proto.isDST                = isDaylightSavingTime;
proto.isLocal              = isLocal;
proto.isUtcOffset          = isUtcOffset;
proto.isUtc                = isUtc;
proto.isUTC                = isUtc;

// Timezone
proto.zoneAbbr = getZoneAbbr;
proto.zoneName = getZoneName;

// Deprecations
proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);

function createUnix (input) {
    return createLocal(input * 1000);
}

function createInZone () {
    return createLocal.apply(null, arguments).parseZone();
}

function preParsePostFormat (string) {
    return string;
}

var proto$1 = Locale.prototype;

proto$1.calendar        = calendar;
proto$1.longDateFormat  = longDateFormat;
proto$1.invalidDate     = invalidDate;
proto$1.ordinal         = ordinal;
proto$1.preparse        = preParsePostFormat;
proto$1.postformat      = preParsePostFormat;
proto$1.relativeTime    = relativeTime;
proto$1.pastFuture      = pastFuture;
proto$1.set             = set;

// Month
proto$1.months            =        localeMonths;
proto$1.monthsShort       =        localeMonthsShort;
proto$1.monthsParse       =        localeMonthsParse;
proto$1.monthsRegex       = monthsRegex;
proto$1.monthsShortRegex  = monthsShortRegex;

// Week
proto$1.week = localeWeek;
proto$1.firstDayOfYear = localeFirstDayOfYear;
proto$1.firstDayOfWeek = localeFirstDayOfWeek;

// Day of Week
proto$1.weekdays       =        localeWeekdays;
proto$1.weekdaysMin    =        localeWeekdaysMin;
proto$1.weekdaysShort  =        localeWeekdaysShort;
proto$1.weekdaysParse  =        localeWeekdaysParse;

proto$1.weekdaysRegex       =        weekdaysRegex;
proto$1.weekdaysShortRegex  =        weekdaysShortRegex;
proto$1.weekdaysMinRegex    =        weekdaysMinRegex;

// Hours
proto$1.isPM = localeIsPM;
proto$1.meridiem = localeMeridiem;

function get$1 (format, index, field, setter) {
    var locale = getLocale();
    var utc = createUTC().set(setter, index);
    return locale[field](utc, format);
}

function listMonthsImpl (format, index, field) {
    if (isNumber(format)) {
        index = format;
        format = undefined;
    }

    format = format || '';

    if (index != null) {
        return get$1(format, index, field, 'month');
    }

    var i;
    var out = [];
    for (i = 0; i < 12; i++) {
        out[i] = get$1(format, i, field, 'month');
    }
    return out;
}

// ()
// (5)
// (fmt, 5)
// (fmt)
// (true)
// (true, 5)
// (true, fmt, 5)
// (true, fmt)
function listWeekdaysImpl (localeSorted, format, index, field) {
    if (typeof localeSorted === 'boolean') {
        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';
    } else {
        format = localeSorted;
        index = format;
        localeSorted = false;

        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';
    }

    var locale = getLocale(),
        shift = localeSorted ? locale._week.dow : 0;

    if (index != null) {
        return get$1(format, (index + shift) % 7, field, 'day');
    }

    var i;
    var out = [];
    for (i = 0; i < 7; i++) {
        out[i] = get$1(format, (i + shift) % 7, field, 'day');
    }
    return out;
}

function listMonths (format, index) {
    return listMonthsImpl(format, index, 'months');
}

function listMonthsShort (format, index) {
    return listMonthsImpl(format, index, 'monthsShort');
}

function listWeekdays (localeSorted, format, index) {
    return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
}

function listWeekdaysShort (localeSorted, format, index) {
    return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
}

function listWeekdaysMin (localeSorted, format, index) {
    return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
}

getSetGlobalLocale('en', {
    dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
    ordinal : function (number) {
        var b = number % 10,
            output = (toInt(number % 100 / 10) === 1) ? 'th' :
            (b === 1) ? 'st' :
            (b === 2) ? 'nd' :
            (b === 3) ? 'rd' : 'th';
        return number + output;
    }
});

// Side effect imports
hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', getSetGlobalLocale);
hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', getLocale);

var mathAbs = Math.abs;

function abs () {
    var data           = this._data;

    this._milliseconds = mathAbs(this._milliseconds);
    this._days         = mathAbs(this._days);
    this._months       = mathAbs(this._months);

    data.milliseconds  = mathAbs(data.milliseconds);
    data.seconds       = mathAbs(data.seconds);
    data.minutes       = mathAbs(data.minutes);
    data.hours         = mathAbs(data.hours);
    data.months        = mathAbs(data.months);
    data.years         = mathAbs(data.years);

    return this;
}

function addSubtract$1 (duration, input, value, direction) {
    var other = createDuration(input, value);

    duration._milliseconds += direction * other._milliseconds;
    duration._days         += direction * other._days;
    duration._months       += direction * other._months;

    return duration._bubble();
}

// supports only 2.0-style add(1, 's') or add(duration)
function add$1 (input, value) {
    return addSubtract$1(this, input, value, 1);
}

// supports only 2.0-style subtract(1, 's') or subtract(duration)
function subtract$1 (input, value) {
    return addSubtract$1(this, input, value, -1);
}

function absCeil (number) {
    if (number < 0) {
        return Math.floor(number);
    } else {
        return Math.ceil(number);
    }
}

function bubble () {
    var milliseconds = this._milliseconds;
    var days         = this._days;
    var months       = this._months;
    var data         = this._data;
    var seconds, minutes, hours, years, monthsFromDays;

    // if we have a mix of positive and negative values, bubble down first
    // check: https://github.com/moment/moment/issues/2166
    if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
            (milliseconds <= 0 && days <= 0 && months <= 0))) {
        milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
        days = 0;
        months = 0;
    }

    // The following code bubbles up values, see the tests for
    // examples of what that means.
    data.milliseconds = milliseconds % 1000;

    seconds           = absFloor(milliseconds / 1000);
    data.seconds      = seconds % 60;

    minutes           = absFloor(seconds / 60);
    data.minutes      = minutes % 60;

    hours             = absFloor(minutes / 60);
    data.hours        = hours % 24;

    days += absFloor(hours / 24);

    // convert days to months
    monthsFromDays = absFloor(daysToMonths(days));
    months += monthsFromDays;
    days -= absCeil(monthsToDays(monthsFromDays));

    // 12 months -> 1 year
    years = absFloor(months / 12);
    months %= 12;

    data.days   = days;
    data.months = months;
    data.years  = years;

    return this;
}

function daysToMonths (days) {
    // 400 years have 146097 days (taking into account leap year rules)
    // 400 years have 12 months === 4800
    return days * 4800 / 146097;
}

function monthsToDays (months) {
    // the reverse of daysToMonths
    return months * 146097 / 4800;
}

function as (units) {
    if (!this.isValid()) {
        return NaN;
    }
    var days;
    var months;
    var milliseconds = this._milliseconds;

    units = normalizeUnits(units);

    if (units === 'month' || units === 'year') {
        days   = this._days   + milliseconds / 864e5;
        months = this._months + daysToMonths(days);
        return units === 'month' ? months : months / 12;
    } else {
        // handle milliseconds separately because of floating point math errors (issue #1867)
        days = this._days + Math.round(monthsToDays(this._months));
        switch (units) {
            case 'week'   : return days / 7     + milliseconds / 6048e5;
            case 'day'    : return days         + milliseconds / 864e5;
            case 'hour'   : return days * 24    + milliseconds / 36e5;
            case 'minute' : return days * 1440  + milliseconds / 6e4;
            case 'second' : return days * 86400 + milliseconds / 1000;
            // Math.floor prevents floating point math errors here
            case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
            default: throw new Error('Unknown unit ' + units);
        }
    }
}

// TODO: Use this.as('ms')?
function valueOf$1 () {
    if (!this.isValid()) {
        return NaN;
    }
    return (
        this._milliseconds +
        this._days * 864e5 +
        (this._months % 12) * 2592e6 +
        toInt(this._months / 12) * 31536e6
    );
}

function makeAs (alias) {
    return function () {
        return this.as(alias);
    };
}

var asMilliseconds = makeAs('ms');
var asSeconds      = makeAs('s');
var asMinutes      = makeAs('m');
var asHours        = makeAs('h');
var asDays         = makeAs('d');
var asWeeks        = makeAs('w');
var asMonths       = makeAs('M');
var asYears        = makeAs('y');

function get$2 (units) {
    units = normalizeUnits(units);
    return this.isValid() ? this[units + 's']() : NaN;
}

function makeGetter(name) {
    return function () {
        return this.isValid() ? this._data[name] : NaN;
    };
}

var milliseconds = makeGetter('milliseconds');
var seconds      = makeGetter('seconds');
var minutes      = makeGetter('minutes');
var hours        = makeGetter('hours');
var days         = makeGetter('days');
var months       = makeGetter('months');
var years        = makeGetter('years');

function weeks () {
    return absFloor(this.days() / 7);
}

var round = Math.round;
var thresholds = {
    ss: 44,         // a few seconds to seconds
    s : 45,         // seconds to minute
    m : 45,         // minutes to hour
    h : 22,         // hours to day
    d : 26,         // days to month
    M : 11          // months to year
};

// helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
    return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
}

function relativeTime$1 (posNegDuration, withoutSuffix, locale) {
    var duration = createDuration(posNegDuration).abs();
    var seconds  = round(duration.as('s'));
    var minutes  = round(duration.as('m'));
    var hours    = round(duration.as('h'));
    var days     = round(duration.as('d'));
    var months   = round(duration.as('M'));
    var years    = round(duration.as('y'));

    var a = seconds <= thresholds.ss && ['s', seconds]  ||
            seconds < thresholds.s   && ['ss', seconds] ||
            minutes <= 1             && ['m']           ||
            minutes < thresholds.m   && ['mm', minutes] ||
            hours   <= 1             && ['h']           ||
            hours   < thresholds.h   && ['hh', hours]   ||
            days    <= 1             && ['d']           ||
            days    < thresholds.d   && ['dd', days]    ||
            months  <= 1             && ['M']           ||
            months  < thresholds.M   && ['MM', months]  ||
            years   <= 1             && ['y']           || ['yy', years];

    a[2] = withoutSuffix;
    a[3] = +posNegDuration > 0;
    a[4] = locale;
    return substituteTimeAgo.apply(null, a);
}

// This function allows you to set the rounding function for relative time strings
function getSetRelativeTimeRounding (roundingFunction) {
    if (roundingFunction === undefined) {
        return round;
    }
    if (typeof(roundingFunction) === 'function') {
        round = roundingFunction;
        return true;
    }
    return false;
}

// This function allows you to set a threshold for relative time strings
function getSetRelativeTimeThreshold (threshold, limit) {
    if (thresholds[threshold] === undefined) {
        return false;
    }
    if (limit === undefined) {
        return thresholds[threshold];
    }
    thresholds[threshold] = limit;
    if (threshold === 's') {
        thresholds.ss = limit - 1;
    }
    return true;
}

function humanize (withSuffix) {
    if (!this.isValid()) {
        return this.localeData().invalidDate();
    }

    var locale = this.localeData();
    var output = relativeTime$1(this, !withSuffix, locale);

    if (withSuffix) {
        output = locale.pastFuture(+this, output);
    }

    return locale.postformat(output);
}

var abs$1 = Math.abs;

function toISOString$1() {
    // for ISO strings we do not use the normal bubbling rules:
    //  * milliseconds bubble up until they become hours
    //  * days do not bubble at all
    //  * months bubble up until they become years
    // This is because there is no context-free conversion between hours and days
    // (think of clock changes)
    // and also not between days and months (28-31 days per month)
    if (!this.isValid()) {
        return this.localeData().invalidDate();
    }

    var seconds = abs$1(this._milliseconds) / 1000;
    var days         = abs$1(this._days);
    var months       = abs$1(this._months);
    var minutes, hours, years;

    // 3600 seconds -> 60 minutes -> 1 hour
    minutes           = absFloor(seconds / 60);
    hours             = absFloor(minutes / 60);
    seconds %= 60;
    minutes %= 60;

    // 12 months -> 1 year
    years  = absFloor(months / 12);
    months %= 12;


    // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
    var Y = years;
    var M = months;
    var D = days;
    var h = hours;
    var m = minutes;
    var s = seconds;
    var total = this.asSeconds();

    if (!total) {
        // this is the same as C#'s (Noda) and python (isodate)...
        // but not other JS (goog.date)
        return 'P0D';
    }

    return (total < 0 ? '-' : '') +
        'P' +
        (Y ? Y + 'Y' : '') +
        (M ? M + 'M' : '') +
        (D ? D + 'D' : '') +
        ((h || m || s) ? 'T' : '') +
        (h ? h + 'H' : '') +
        (m ? m + 'M' : '') +
        (s ? s + 'S' : '');
}

var proto$2 = Duration.prototype;

proto$2.isValid        = isValid$1;
proto$2.abs            = abs;
proto$2.add            = add$1;
proto$2.subtract       = subtract$1;
proto$2.as             = as;
proto$2.asMilliseconds = asMilliseconds;
proto$2.asSeconds      = asSeconds;
proto$2.asMinutes      = asMinutes;
proto$2.asHours        = asHours;
proto$2.asDays         = asDays;
proto$2.asWeeks        = asWeeks;
proto$2.asMonths       = asMonths;
proto$2.asYears        = asYears;
proto$2.valueOf        = valueOf$1;
proto$2._bubble        = bubble;
proto$2.get            = get$2;
proto$2.milliseconds   = milliseconds;
proto$2.seconds        = seconds;
proto$2.minutes        = minutes;
proto$2.hours          = hours;
proto$2.days           = days;
proto$2.weeks          = weeks;
proto$2.months         = months;
proto$2.years          = years;
proto$2.humanize       = humanize;
proto$2.toISOString    = toISOString$1;
proto$2.toString       = toISOString$1;
proto$2.toJSON         = toISOString$1;
proto$2.locale         = locale;
proto$2.localeData     = localeData;

// Deprecations
proto$2.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', toISOString$1);
proto$2.lang = lang;

// Side effect imports

// FORMATTING

addFormatToken('X', 0, 0, 'unix');
addFormatToken('x', 0, 0, 'valueOf');

// PARSING

addRegexToken('x', matchSigned);
addRegexToken('X', matchTimestamp);
addParseToken('X', function (input, array, config) {
    config._d = new Date(parseFloat(input, 10) * 1000);
});
addParseToken('x', function (input, array, config) {
    config._d = new Date(toInt(input));
});

// Side effect imports


hooks.version = '2.18.1';

setHookCallback(createLocal);

hooks.fn                    = proto;
hooks.min                   = min;
hooks.max                   = max;
hooks.now                   = now;
hooks.utc                   = createUTC;
hooks.unix                  = createUnix;
hooks.months                = listMonths;
hooks.isDate                = isDate;
hooks.locale                = getSetGlobalLocale;
hooks.invalid               = createInvalid;
hooks.duration              = createDuration;
hooks.isMoment              = isMoment;
hooks.weekdays              = listWeekdays;
hooks.parseZone             = createInZone;
hooks.localeData            = getLocale;
hooks.isDuration            = isDuration;
hooks.monthsShort           = listMonthsShort;
hooks.weekdaysMin           = listWeekdaysMin;
hooks.defineLocale          = defineLocale;
hooks.updateLocale          = updateLocale;
hooks.locales               = listLocales;
hooks.weekdaysShort         = listWeekdaysShort;
hooks.normalizeUnits        = normalizeUnits;
hooks.relativeTimeRounding = getSetRelativeTimeRounding;
hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
hooks.calendarFormat        = getCalendarFormat;
hooks.prototype             = proto;

return hooks;

})));

},{}],50:[function(require,module,exports){
'use strict';

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var Currency = require('./../../lang/Currency'),
    Money = require('./../../lang/Money');

var DataType = require('./DataType'),
    Field = require('./Field');

module.exports = function () {
	'use strict';

	/**
  * A complex field built from many fields.
  *
  * @public
  * @param {String} name
  * @param {Array<Field>} componentType
  */

	var Component = function () {
		function Component(name, fields, reviver) {
			_classCallCheck(this, Component);

			this._name = name;
			this._fields = fields || [];
			this._reviver = reviver;
		}

		/**
   * Name of the component.
   *
   * @public
   * @returns {String}
   */

		_createClass(Component, [{
			key: 'toString',
			value: function toString() {
				return '[Component (name=' + this._name + ')]';
			}
		}, {
			key: 'name',
			get: function get() {
				return this._name;
			}

			/**
    * Type of the component.
    *
    * @public
    * @returns {ComponentType}
    */

		}, {
			key: 'fields',
			get: function get() {
				return this._fields;
			}

			/**
    * The reviver used to rebuild the entire component.
    *
    * @returns {Function}
    */

		}, {
			key: 'reviver',
			get: function get() {
				return this._reviver;
			}

			/**
    * The builds a {@link Component} for {@link Money}.
    *
    * @public
    * @returns {Component}
    */

		}], [{
			key: 'forMoney',
			value: function forMoney(name) {
				return new Component(name, [new Field('decimal', DataType.DECIMAL), new Field('currency', DataType.forEnum(Currency, 'Currency'))], function (x) {
					return Money.parse(x);
				});
			}
		}]);

		return Component;
	}();

	return Component;
}();

},{"./../../lang/Currency":15,"./../../lang/Money":20,"./DataType":51,"./Field":52}],51:[function(require,module,exports){
'use strict';

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var assert = require('./../../lang/assert'),
    Day = require('./../../lang/Day'),
    Decimal = require('./../../lang/Decimal'),
    Enum = require('./../../lang/Enum'),
    is = require('./../../lang/is'),
    Timestamp = require('./../../lang/Timestamp');

module.exports = function () {
	'use strict';

	/**
  * The formal definition of a data type which is used by an {@link Attribute}.
  *
  * @public
  * @param {String} description
  * @param {Function=} enumerationType
  */

	var DataType = function () {
		function DataType(description, enumerationType, reviver) {
			_classCallCheck(this, DataType);

			assert.argumentIsRequired(description, 'description', String);
			assert.argumentIsOptional(enumerationType, 'enumerationType', Function);
			assert.argumentIsOptional(reviver, 'reviver', Function);

			if (enumerationType) {
				assert.argumentIsValid(enumerationType, 'enumerationType', extendsEnumeration, 'is an enumeration');
			}

			this._description = description;
			this._enumerationType = enumerationType || null;

			var reviverToUse = void 0;

			if (reviver) {
				reviverToUse = reviver;
			} else if (enumerationType) {
				reviverToUse = function reviverToUse(x) {
					return Enum.fromCode(enumerationType, x);
				};
			} else {
				reviverToUse = function reviverToUse(x) {
					return x;
				};
			}

			this._reviver = reviverToUse;
		}

		/**
   * Description of the data type.
   *
   * @public
   * @returns {String}
   */

		_createClass(DataType, [{
			key: 'toString',
			value: function toString() {
				return '[DataType (description=' + this._description + ')]';
			}
		}, {
			key: 'description',
			get: function get() {
				return this._description;
			}

			/**
    * The {@Enumeration} type, if applicable.
    *
    * @public
    * @returns {Function|null}
    */

		}, {
			key: 'enumerationType',
			get: function get() {
				return this._enumerationType;
			}

			/**
    * A function which "revives" a value after serialization to JSON.
    *
    * @public
    * @returns {Function}reviver
    */

		}, {
			key: 'reviver',
			get: function get() {
				return this._reviver;
			}

			/**
    * Return a {@link DataType} instance for use with an {@link @Enum}.
    *
    * @public
    * @param {Function} enumerationType - A class that extends {@link Enum}
    * @param description - The description
    * @returns {DataType}
    */

		}], [{
			key: 'forEnum',
			value: function forEnum(enumerationType, description) {
				return new DataType(description, enumerationType);
			}

			/**
    * References a string.
    *
    * @public
    * @returns {DataType}
    */

		}, {
			key: 'STRING',
			get: function get() {
				return dataTypeString;
			}

			/**
    * References a number.
    *
    * @public
    * @returns {DataType}
    */

		}, {
			key: 'NUMBER',
			get: function get() {
				return dataTypeNumber;
			}

			/**
    * References a Boolean value.
    *
    * @public
    * @returns {DataType}
    */

		}, {
			key: 'BOOLEAN',
			get: function get() {
				return dataTypeBoolean;
			}

			/**
    * References an object (serialized as JSON).
    *
    * @public
    * @returns {DataType}
    */

		}, {
			key: 'OBJECT',
			get: function get() {
				return dataTypeObject;
			}

			/**
    * References a {@link Decimal} instance.
    *
    * @public
    * @returns {DataType}
    */

		}, {
			key: 'DECIMAL',
			get: function get() {
				return dataTypeDecimal;
			}

			/**
    * References a {@link Day} instance.
    *
    * @public
    * @returns {DataType}
    */

		}, {
			key: 'DAY',
			get: function get() {
				return dataTypeDay;
			}

			/**
    * References a {@link Timestamp} instance.
    *
    * @public
    * @returns {DataType}
    */

		}, {
			key: 'TIMESTAMP',
			get: function get() {
				return dataTypeTimestamp;
			}
		}]);

		return DataType;
	}();

	function extendsEnumeration(EnumerationType) {
		return is.extension(Enum, EnumerationType);
	}

	var dataTypeString = new DataType('String');
	var dataTypeNumber = new DataType('Number');
	var dataTypeBoolean = new DataType('Boolean');
	var dataTypeObject = new DataType('Object');

	var dataTypeDecimal = new DataType('Decimal', null, function (x) {
		return Decimal.parse(x);
	});
	var dataTypeDay = new DataType('Day', null, function (x) {
		return Day.parse(x);
	});
	var dataTypeTimestamp = new DataType('Timestamp', null, function (x) {
		return Timestamp.parse(x);
	});

	var dataTypes = [dataTypeString, dataTypeNumber, dataTypeBoolean, dataTypeObject, dataTypeDecimal, dataTypeDay, dataTypeTimestamp];

	return DataType;
}();

},{"./../../lang/Day":16,"./../../lang/Decimal":17,"./../../lang/Enum":19,"./../../lang/Timestamp":21,"./../../lang/assert":24,"./../../lang/is":29}],52:[function(require,module,exports){
'use strict';

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

module.exports = function () {
	'use strict';

	/**
  * A simple field.
  *
  * @public
  * @param {String} name
  * @param {DataType} dataType
  * @param {Boolean} optional
  */

	var Field = function () {
		function Field(name, dataType, optional) {
			_classCallCheck(this, Field);

			this._name = name;
			this._dataType = dataType;
			this._optional = optional || false;
		}

		/**
   * Name of the field.
   *
   * @public
   * @returns {String}
   */

		_createClass(Field, [{
			key: 'toString',
			value: function toString() {
				return '[Field (name=' + this._name + ')]';
			}
		}, {
			key: 'name',
			get: function get() {
				return this._name;
			}

			/**
    * Type of the field.
    *
    * @public
    * @returns {DataType}
    */

		}, {
			key: 'dataType',
			get: function get() {
				return this._dataType;
			}

			/**
    * Indicates if the field can be omitted without violating the schema.
    *
    * @public
    * @returns {Boolean}
    */

		}, {
			key: 'optional',
			get: function get() {
				return this._optional;
			}
		}]);

		return Field;
	}();

	return Field;
}();

},{}],53:[function(require,module,exports){
'use strict';

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _toConsumableArray(arr) {
	if (Array.isArray(arr)) {
		for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
			arr2[i] = arr[i];
		}return arr2;
	} else {
		return Array.from(arr);
	}
}

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var assert = require('./../../lang/assert'),
    functions = require('./../../lang/functions'),
    is = require('./../../lang/is');

var LinkedList = require('./../../collections/LinkedList'),
    Tree = require('./../../collections/Tree');

var Component = require('./Component'),
    Field = require('./Field');

module.exports = function () {
	'use strict';

	/**
  * A schema definition, can be used for serialization and deserialization.
  *
  * @public
  * @param {String} name - The name of the schema
  * @param {Array<Field>} fields
  * @param {Array<Component>} components
  * @param {Boolean=} strict
  */

	var Schema = function () {
		function Schema(name, fields, components, strict) {
			_classCallCheck(this, Schema);

			this._name = name;

			this._fields = fields || [];
			this._components = components || [];

			this._strict = is.boolean(strict) && strict;

			this._revivers = getReviverItems(this._fields, this._components);
		}

		/**
   * Name of the table.
   *
   * @public
   * @returns {String}
   */

		_createClass(Schema, [{
			key: 'validate',

			/**
    * Returns true, if an object complies with the schema.
    *
    * @public
    * @param {*} candidate
    */
			value: function validate(candidate) {
				var returnVal = is.object(candidate);

				return false;
			}

			/**
    * Generates a function suitable for use by JSON.parse.
    *
    * @public
    * @returns {Function}
    */

		}, {
			key: 'getReviver',
			value: function getReviver() {
				var head = this._revivers;
				var node = null;

				var advance = function advance(key) {
					if (node === null) {
						node = head;
					} else {
						node = node.getNext();
					}

					var item = node.getValue();

					if (key !== item.name) {
						if (item.reset || key === '' && node === head) {
							node = null;
						} else if (item.optional) {
							item = advance(key);
						} else {
							throw new Error('Schema parsing is using strict mode, unexpected key found [ ' + key + ' / ' + item.name + ' ]');
						}
					}

					return item;
				};

				return function (key, value) {
					return advance(key).reviver(value);
				};
			}

			/**
    * Returns a function that will generate a *new* reviver function
    * (see {@link Schema#getReviver}.
    *
    * @public
    * @returns {Function}
    */

		}, {
			key: 'getReviverFactory',
			value: function getReviverFactory() {
				var _this = this;

				return function () {
					return _this.getReviver();
				};
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[Schema (name=' + this._name + ')]';
			}
		}, {
			key: 'name',
			get: function get() {
				return this._name;
			}

			/**
    * The fields of the table.
    *
    * @public
    * @returns {Array<Fields>}
    */

		}, {
			key: 'fields',
			get: function get() {
				return [].concat(_toConsumableArray(this._fields));
			}

			/**
    * The components of the table.
    *
    * @public
    * @returns {Array<Component>}
    */

		}, {
			key: 'components',
			get: function get() {
				return [].concat(_toConsumableArray(this._components));
			}

			/**
    * If true, only the explicitly defined fields and components will
    * be serialized.
    *
    * @public
    * @returns {*|boolean}
    */

		}, {
			key: 'strict',
			get: function get() {
				return this._strict;
			}
		}]);

		return Schema;
	}();

	var ReviverItem = function () {
		function ReviverItem(name, reviver, optional, reset) {
			_classCallCheck(this, ReviverItem);

			this._name = name;
			this._reviver = reviver || functions.getTautology();
			this._optional = is.boolean(optional) && optional;
			this._reset = is.boolean(reset) && reset;
		}

		_createClass(ReviverItem, [{
			key: 'name',
			get: function get() {
				return this._name;
			}
		}, {
			key: 'reviver',
			get: function get() {
				return this._reviver;
			}
		}, {
			key: 'optional',
			get: function get() {
				return this._optional;
			}
		}, {
			key: 'reset',
			get: function get() {
				return this._reset;
			}
		}]);

		return ReviverItem;
	}();

	function getReviverItems(fields, components) {
		var root = new Tree(new ReviverItem(null, null, false, true));

		// 2017/08/26, BRI. The Field and Component types could inherit a common
		// type, allowing the following duplication to be avoided with polymorphism.

		fields.forEach(function (field) {
			var names = field.name.split('.');

			var node = root;

			names.forEach(function (name, i) {
				if (names.length === i + 1) {
					node.addChild(new ReviverItem(name, field.dataType.reviver, field.optional));
				} else {
					var child = node.findChild(function (n) {
						return n.name === name;
					});

					if (!child) {
						child = node.addChild(new ReviverItem(name));
					}

					node = child;
				}
			});
		});

		components.forEach(function (component) {
			var node = root;

			var names = component.name.split('.');

			names.forEach(function (name, i) {
				if (names.length === i + 1) {
					node = node.addChild(new ReviverItem(name, component.reviver));
				} else {
					var child = node.findChild(function (n) {
						return n.name === name;
					});

					if (!child) {
						child = node.addChild(new ReviverItem(name));
					}

					node = child;
				}
			});

			component.fields.forEach(function (f) {
				return node.addChild(new ReviverItem(f.name, f.dataType.reviver));
			});
		});

		var head = null;
		var current = null;

		var addItemToList = function addItemToList(item, node) {
			var itemToUse = item;

			if (!node.getIsLeaf()) {
				var required = node.search(function (i, n) {
					return n.getIsLeaf() && !i.optional;
				}, true, false) !== null;

				if (!required) {
					itemToUse = new ReviverItem(item.name, item.reviver, true, item.reset);
				}
			} else {
				itemToUse = item;
			}

			if (current === null) {
				current = head = new LinkedList(itemToUse);
			} else {
				current = current.insert(itemToUse);
			}
		};

		root.walk(addItemToList, false, true);

		return head;
	}

	return Schema;
}();

},{"./../../collections/LinkedList":1,"./../../collections/Tree":4,"./../../lang/assert":24,"./../../lang/functions":28,"./../../lang/is":29,"./Component":50,"./Field":52}],54:[function(require,module,exports){
'use strict';

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var assert = require('./../../../lang/assert');

var Component = require('./../Component'),
    DataType = require('./../DataType'),
    Field = require('./../Field');

module.exports = function () {
	'use strict';

	/**
  * A fluent interface for building a {@link Component} instance.
  *
  * @public
  * @param {String} name - The name of the schema
  */

	var ComponentBuilder = function () {
		function ComponentBuilder(name) {
			_classCallCheck(this, ComponentBuilder);

			this._component = new Component(name);
		}

		/**
   * The {@link Schema} current schema instance.
   *
   * @public
   * @returns {Component}
   */

		_createClass(ComponentBuilder, [{
			key: 'withField',

			/**
    * Adds a new {@link Field} to the schema and returns the current instance.
    *
    * @public
    * @param {String} name
    * @param {DataType} dataType
    * @returns {ComponentBuilder}
    */
			value: function withField(name, dataType) {
				assert.argumentIsRequired(name, 'name', String);
				assert.argumentIsRequired(dataType, 'dataType', DataType, 'DataType');

				var fields = this._component.fields.concat([new Field(name, dataType)]);

				this._component = new Component(this._component.name, fields, this._component.reviver);

				return this;
			}

			/**
    * Adds a "reviver" function for use with JSON.parse.
    *
    * @public
    * @param {String} name
    * @param {DataType} dataType
    * @returns {ComponentBuilder}
    */

		}, {
			key: 'withReviver',
			value: function withReviver(reviver) {
				assert.argumentIsRequired(reviver, 'reviver', Function);

				this._component = new Component(this._component.name, this._component.fields, reviver);

				return this;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[ComponentBuilder (name=' + this._name + ')]';
			}
		}, {
			key: 'component',
			get: function get() {
				return this._component;
			}
		}]);

		return ComponentBuilder;
	}();

	return ComponentBuilder;
}();

},{"./../../../lang/assert":24,"./../Component":50,"./../DataType":51,"./../Field":52}],55:[function(require,module,exports){
'use strict';

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var assert = require('./../../../lang/assert'),
    is = require('./../../../lang/is');

var Component = require('./../Component'),
    DataType = require('./../DataType'),
    Field = require('./../Field'),
    Schema = require('./../Schema');

var ComponentBuilder = require('./ComponentBuilder');

module.exports = function () {
	'use strict';

	/**
  * A fluent interface for building a {@link Schema} instance.
  *
  * @public
  * @param {String} name - The name of the schema
  */

	var SchemaBuilder = function () {
		function SchemaBuilder(name) {
			_classCallCheck(this, SchemaBuilder);

			this._schema = new Schema(name);
		}

		/**
   * The {@link Schema} current schema instance.
   *
   * @public
   * @returns {Schema}
   */

		_createClass(SchemaBuilder, [{
			key: 'withField',

			/**
    * Adds a new {@link Field} to the schema and returns the current instance.
    *
    * @public
    * @param {String} name - The name of the new field.
    * @param {DataType} dataType - The type of the new field.
    * @param {Boolean=} optional - If true, the field is not required and may be omitted.
    * @returns {SchemaBuilder}
    */
			value: function withField(name, dataType, optional) {
				assert.argumentIsRequired(name, 'name', String);
				assert.argumentIsRequired(dataType, 'dataType', DataType, 'DataType');
				assert.argumentIsOptional(optional, 'optional', Boolean);

				var optionalToUse = is.boolean(optional) && optional;
				var fields = this._schema.fields.concat([new Field(name, dataType, optionalToUse)]);

				this._schema = new Schema(this._schema.name, fields, this._schema.components, this._schema.strict);

				return this;
			}

			/**
    * Adds a new {@link Component} to the schema, using a {@link ComponentBuilder}
    * and returns the current instance.
    *
    * @public
    * @param {String} name - The name of the new component.
    * @param {Function} callback - A callback to which the {@link ComponentBuilder} is passed synchronously.
    * @returns {SchemaBuilder}
    */

		}, {
			key: 'withComponentBuilder',
			value: function withComponentBuilder(name, callback) {
				assert.argumentIsRequired(name, 'name', String);

				var componentBuilder = new ComponentBuilder(name);

				callback(componentBuilder);

				return this.withComponent(componentBuilder.component);
			}

			/**
    * Adds a new {@link Component} to the schema and returns the current instance.
    *
    * @public
    * @param {Component} component - The new component to add.
    * @returns {SchemaBuilder}
    */

		}, {
			key: 'withComponent',
			value: function withComponent(component) {
				assert.argumentIsRequired(component, 'component', Component, 'Component');

				var components = this._schema.components.concat([component]);

				this._schema = new Schema(this._schema.name, this._schema.fields, components, this._schema.strict);

				return this;
			}

			/**
    * Creates a new {@link SchemaBuilder}.
    *
    * @public
    * @param {String} name
    * @returns {SchemaBuilder}
    */

		}, {
			key: 'toString',
			value: function toString() {
				return '[SchemaBuilder (name=' + this._name + ')]';
			}
		}, {
			key: 'schema',
			get: function get() {
				return this._schema;
			}
		}], [{
			key: 'withName',
			value: function withName(name) {
				assert.argumentIsRequired(name, 'name', String);

				return new SchemaBuilder(name);
			}
		}]);

		return SchemaBuilder;
	}();

	return SchemaBuilder;
}();

},{"./../../../lang/assert":24,"./../../../lang/is":29,"./../Component":50,"./../DataType":51,"./../Field":52,"./../Schema":53,"./ComponentBuilder":54}],56:[function(require,module,exports){
'use strict';

var Specification = require('./Specification');

module.exports = function () {
	'use strict';

	return Specification.AndSpecification;
}();

},{"./Specification":65}],57:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var assert = require('./../lang/assert');

var Specification = require('./Specification');

module.exports = function () {
	'use strict';

	var ContainedSpecification = function (_Specification) {
		_inherits(ContainedSpecification, _Specification);

		function ContainedSpecification(value) {
			_classCallCheck(this, ContainedSpecification);

			var _this = _possibleConstructorReturn(this, (ContainedSpecification.__proto__ || Object.getPrototypeOf(ContainedSpecification)).call(this));

			assert.argumentIsArray(value, 'value');

			_this._value = value;
			return _this;
		}

		_createClass(ContainedSpecification, [{
			key: '_evaluate',
			value: function _evaluate(data) {
				return this._value.some(function (candidate) {
					return candidate === data;
				});
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[ContainedSpecification]';
			}
		}]);

		return ContainedSpecification;
	}(Specification);

	return ContainedSpecification;
}();

},{"./../lang/assert":24,"./Specification":65}],58:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Specification = require('./Specification');

module.exports = function () {
	'use strict';

	var ContainsSpecification = function (_Specification) {
		_inherits(ContainsSpecification, _Specification);

		function ContainsSpecification(value) {
			_classCallCheck(this, ContainsSpecification);

			var _this = _possibleConstructorReturn(this, (ContainsSpecification.__proto__ || Object.getPrototypeOf(ContainsSpecification)).call(this));

			_this._value = value;
			return _this;
		}

		_createClass(ContainsSpecification, [{
			key: '_evaluate',
			value: function _evaluate(data) {
				var _this2 = this;

				return Array.isArray(data) && data.some(function (candidate) {
					return candidate === _this2._value;
				});
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[ContainsSpecification]';
			}
		}]);

		return ContainsSpecification;
	}(Specification);

	return ContainsSpecification;
}();

},{"./Specification":65}],59:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Specification = require('./Specification');

module.exports = function () {
	'use strict';

	var FailSpecification = function (_Specification) {
		_inherits(FailSpecification, _Specification);

		function FailSpecification(value) {
			_classCallCheck(this, FailSpecification);

			return _possibleConstructorReturn(this, (FailSpecification.__proto__ || Object.getPrototypeOf(FailSpecification)).call(this));
		}

		_createClass(FailSpecification, [{
			key: '_evaluate',
			value: function _evaluate(data) {
				return false;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[FailSpecification]';
			}
		}]);

		return FailSpecification;
	}(Specification);

	return FailSpecification;
}();

},{"./Specification":65}],60:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var is = require('./../lang/is');

var Specification = require('./Specification');

module.exports = function () {
	'use strict';

	var NanSpecification = function (_Specification) {
		_inherits(NanSpecification, _Specification);

		function NanSpecification() {
			_classCallCheck(this, NanSpecification);

			return _possibleConstructorReturn(this, (NanSpecification.__proto__ || Object.getPrototypeOf(NanSpecification)).call(this));
		}

		_createClass(NanSpecification, [{
			key: '_evaluate',
			value: function _evaluate(data) {
				return is.nan(data);
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[NanSpecification]';
			}
		}]);

		return NanSpecification;
	}(Specification);

	return NanSpecification;
}();

},{"./../lang/is":29,"./Specification":65}],61:[function(require,module,exports){
'use strict';

var Specification = require('./Specification');

module.exports = function () {
	'use strict';

	return Specification.NotSpecification;
}();

},{"./Specification":65}],62:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var is = require('./../lang/is');

var Specification = require('./Specification');

module.exports = function () {
	'use strict';

	var NumericSpecification = function (_Specification) {
		_inherits(NumericSpecification, _Specification);

		function NumericSpecification() {
			_classCallCheck(this, NumericSpecification);

			return _possibleConstructorReturn(this, (NumericSpecification.__proto__ || Object.getPrototypeOf(NumericSpecification)).call(this));
		}

		_createClass(NumericSpecification, [{
			key: '_evaluate',
			value: function _evaluate(data) {
				return is.number(data);
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[NumericSpecification]';
			}
		}]);

		return NumericSpecification;
	}(Specification);

	return NumericSpecification;
}();

},{"./../lang/is":29,"./Specification":65}],63:[function(require,module,exports){
'use strict';

var Specification = require('./Specification');

module.exports = function () {
	'use strict';

	return Specification.OrSpecification;
}();

},{"./Specification":65}],64:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Specification = require('./Specification');

module.exports = function () {
	'use strict';

	var PassSpecification = function (_Specification) {
		_inherits(PassSpecification, _Specification);

		function PassSpecification(value) {
			_classCallCheck(this, PassSpecification);

			return _possibleConstructorReturn(this, (PassSpecification.__proto__ || Object.getPrototypeOf(PassSpecification)).call(this));
		}

		_createClass(PassSpecification, [{
			key: '_evaluate',
			value: function _evaluate(data) {
				return true;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[PassSpecification]';
			}
		}]);

		return PassSpecification;
	}(Specification);

	return PassSpecification;
}();

},{"./Specification":65}],65:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var assert = require('./../lang/assert');

module.exports = function () {
	'use strict';

	var Specification = function () {
		function Specification() {
			_classCallCheck(this, Specification);
		}

		_createClass(Specification, [{
			key: 'evaluate',
			value: function evaluate(data) {
				return this._evaluate(data);
			}
		}, {
			key: '_evaluate',
			value: function _evaluate(data) {
				return false;
			}
		}, {
			key: 'and',
			value: function and(other) {
				assert.argumentIsRequired(other, 'other', Specification, 'Specification');

				return new AndSpecification(this, other);
			}
		}, {
			key: 'or',
			value: function or(other) {
				assert.argumentIsRequired(other, 'other', Specification, 'Specification');

				return new OrSpecification(this, other);
			}
		}, {
			key: 'not',
			value: function not() {
				return new NotSpecification(this);
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[Specification]';
			}
		}]);

		return Specification;
	}();

	var AndSpecification = function (_Specification) {
		_inherits(AndSpecification, _Specification);

		function AndSpecification(specificationOne, specificationTwo) {
			_classCallCheck(this, AndSpecification);

			var _this = _possibleConstructorReturn(this, (AndSpecification.__proto__ || Object.getPrototypeOf(AndSpecification)).call(this));

			assert.argumentIsRequired(specificationOne, 'specificationOne', Specification, 'Specification');
			assert.argumentIsRequired(specificationTwo, 'specificationTwo', Specification, 'Specification');

			_this._specificationOne = specificationOne;
			_this._specificationTwo = specificationTwo;
			return _this;
		}

		_createClass(AndSpecification, [{
			key: '_evaluate',
			value: function _evaluate(data) {
				return this._specificationOne.evaluate(data) && this._specificationTwo.evaluate(data);
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[AndSpecification]';
			}
		}]);

		return AndSpecification;
	}(Specification);

	var OrSpecification = function (_Specification2) {
		_inherits(OrSpecification, _Specification2);

		function OrSpecification(specificationOne, specificationTwo) {
			_classCallCheck(this, OrSpecification);

			var _this2 = _possibleConstructorReturn(this, (OrSpecification.__proto__ || Object.getPrototypeOf(OrSpecification)).call(this));

			assert.argumentIsRequired(specificationOne, 'specificationOne', Specification, 'Specification');
			assert.argumentIsRequired(specificationTwo, 'specificationTwo', Specification, 'Specification');

			_this2._specificationOne = specificationOne;
			_this2._specificationTwo = specificationTwo;
			return _this2;
		}

		_createClass(OrSpecification, [{
			key: '_evaluate',
			value: function _evaluate(data) {
				return this._specificationOne.evaluate(data) || this._specificationTwo.evaluate(data);
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[OrSpecification]';
			}
		}]);

		return OrSpecification;
	}(Specification);

	var NotSpecification = function (_Specification3) {
		_inherits(NotSpecification, _Specification3);

		function NotSpecification(otherSpecification) {
			_classCallCheck(this, NotSpecification);

			var _this3 = _possibleConstructorReturn(this, (NotSpecification.__proto__ || Object.getPrototypeOf(NotSpecification)).call(this));

			assert.argumentIsRequired(otherSpecification, 'otherSpecification', Specification, 'Specification');

			_this3._otherSpecification = otherSpecification;
			return _this3;
		}

		_createClass(NotSpecification, [{
			key: '_evaluate',
			value: function _evaluate(data) {
				return !this._otherSpecification.evaluate(data);
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[NotSpecification]';
			}
		}]);

		return NotSpecification;
	}(Specification);

	Specification.AndSpecification = AndSpecification;
	Specification.OrSpecification = OrSpecification;
	Specification.NotSpecification = NotSpecification;

	return Specification;
}();

},{"./../lang/assert":24}],66:[function(require,module,exports){
'use strict';

var LinkedList = require('./../../../collections/LinkedList');

describe('When "doe" is used to start a linked list', function () {
	'use strict';

	var doe;

	beforeEach(function () {
		doe = new LinkedList('doe');
	});

	describe('and "me" is added to "doe"', function () {
		var me;

		beforeEach(function () {
			me = doe.insert('me');
		});

		describe('and "ray" is inserted between "doe" and "me"', function () {
			var ray;

			beforeEach(function () {
				ray = doe.insert('ray');
			});

			it('the "ray" node should not be the the tail', function () {
				expect(me.getIsTail()).toEqual(true);
			});

			it('the "ray" node should have a value of "ray"', function () {
				expect(me.getValue()).toEqual('me');
			});

			it('the "me" node should still be the the tail', function () {
				expect(me.getIsTail()).toEqual(true);
			});

			it('the "doe" node should reference the "ray" node', function () {
				expect(doe.getNext()).toBe(ray);
			});

			it('the "ray" node should reference the "me" node', function () {
				expect(ray.getNext()).toBe(me);
			});
		});

		it('the "me" node should be the the tail', function () {
			expect(me.getIsTail()).toEqual(true);
		});

		it('the "me" node should have a value of "me"', function () {
			expect(me.getValue()).toEqual('me');
		});

		it('the "doe" node should not be the tail', function () {
			expect(doe.getIsTail()).toEqual(false);
		});

		it('the "doe" node should still have the correct value', function () {
			expect(doe.getValue()).toEqual('doe');
		});

		it('the "doe" node should reference the "me" node', function () {
			expect(doe.getNext()).toBe(me);
		});
	});

	it('should be the the tail', function () {
		expect(doe.getIsTail()).toEqual(true);
	});

	it('should have a value of "doe"', function () {
		expect(doe.getValue()).toEqual('doe');
	});
});

},{"./../../../collections/LinkedList":1}],67:[function(require,module,exports){
'use strict';

var Queue = require('./../../../collections/Queue');

describe('When a Queue is constructed', function () {
	'use strict';

	var queue;

	beforeEach(function () {
		queue = new Queue();
	});

	it('should be empty', function () {
		expect(queue.empty()).toEqual(true);
	});

	it('should throw if "peek" is called', function () {
		expect(function () {
			queue.peek();
		}).toThrow(new Error('Queue is empty'));
	});

	it('should throw if "dequeue" is called', function () {
		expect(function () {
			queue.peek();
		}).toThrow(new Error('Queue is empty'));
	});

	describe('and an object is enqueued', function () {
		var first = 1;

		beforeEach(function () {
			queue.enqueue(first);
		});

		it('should not be empty', function () {
			expect(queue.empty()).toEqual(false);
		});

		describe('and we peek at the top of the queue', function () {
			var peek;

			beforeEach(function () {
				peek = queue.peek();
			});

			it('the peek result should be the item enqueued', function () {
				expect(peek).toBe(first);
			});

			it('should not be empty', function () {
				expect(queue.empty()).toEqual(false);
			});
		});

		describe('and an object is dequeued', function () {
			var dequeue;

			beforeEach(function () {
				dequeue = queue.dequeue();
			});

			it('the dequeue result should be the item enqueued', function () {
				expect(dequeue).toBe(first);
			});

			it('should be empty', function () {
				expect(queue.empty()).toEqual(true);
			});
		});

		describe('and a second object is enqueued', function () {
			var second = { name: "second" };

			beforeEach(function () {
				queue.enqueue(second);
			});

			it('should not be empty', function () {
				expect(queue.empty()).toEqual(false);
			});

			describe('and we peek at the top of the queue', function () {
				var peek;

				beforeEach(function () {
					peek = queue.peek();
				});

				it('the peek result should be the first item enqueued', function () {
					expect(peek).toBe(first);
				});

				it('should not be empty', function () {
					expect(queue.empty()).toEqual(false);
				});
			});

			describe('and an object is dequeued', function () {
				var dequeue;

				beforeEach(function () {
					dequeue = queue.dequeue();
				});

				it('the dequeue result should be the first item enqueued', function () {
					expect(dequeue).toBe(first);
				});

				it('should not be empty', function () {
					expect(queue.empty()).toEqual(false);
				});
			});

			describe('and the queue is exported to an array', function () {
				var a;

				beforeEach(function () {
					a = queue.toArray();
				});

				it('should return an array with two items', function () {
					expect(a.length).toEqual(2);
				});

				it('the first item should be the first item enqueued', function () {
					expect(a[0]).toBe(first);
				});

				it('the second item should be the second item enqueued', function () {
					expect(a[1]).toBe(second);
				});

				it('should not be empty', function () {
					expect(queue.empty()).toEqual(false);
				});
			});

			describe('and the queue is scanned', function () {
				var spy;

				beforeEach(function () {
					spy = jasmine.createSpy();

					queue.scan(spy);
				});

				it('should call the delegate one time for each item in the queue', function () {
					expect(spy.calls.count()).toEqual(2);
				});

				it('should pass the first item to be pushed to the delegate first', function () {
					expect(spy.calls.argsFor(0)[0]).toBe(first);
				});

				it('should pass the second item to be pushed to the delegate second', function () {
					expect(spy.calls.argsFor(1)[0]).toBe(second);
				});

				it('should not be empty', function () {
					expect(queue.empty()).toEqual(false);
				});
			});
		});
	});
});

},{"./../../../collections/Queue":2}],68:[function(require,module,exports){
'use strict';

var Stack = require('./../../../collections/Stack');

describe('When a Stack is constructed', function () {
	'use strict';

	var stack;

	beforeEach(function () {
		stack = new Stack();
	});

	it('should be empty', function () {
		expect(stack.empty()).toEqual(true);
	});

	it('should throw if "peek" is called', function () {
		expect(function () {
			stack.peek();
		}).toThrow(new Error('Stack is empty'));
	});

	it('should throw if "pop" is called', function () {
		expect(function () {
			stack.peek();
		}).toThrow(new Error('Stack is empty'));
	});

	describe('and an object is pushed onto the stack', function () {
		var first = 1;

		beforeEach(function () {
			stack.push(first);
		});

		it('should not be empty', function () {
			expect(stack.empty()).toEqual(false);
		});

		describe('and we peek at the top of the stack', function () {
			var peek;

			beforeEach(function () {
				peek = stack.peek();
			});

			it('the peek result should be the item pushed onto the stack', function () {
				expect(peek).toBe(first);
			});

			it('should not be empty', function () {
				expect(stack.empty()).toEqual(false);
			});
		});

		describe('and an object is popped from the stack', function () {
			var pop;

			beforeEach(function () {
				pop = stack.pop();
			});

			it('the pop result should be the item pushed onto the stack', function () {
				expect(pop).toBe(first);
			});

			it('should be empty', function () {
				expect(stack.empty()).toEqual(true);
			});
		});

		describe('and a second object is pushed onto the stack', function () {
			var second = { name: "second" };

			beforeEach(function () {
				stack.push(second);
			});

			it('should not be empty', function () {
				expect(stack.empty()).toEqual(false);
			});

			describe('and we peek at the top of the stack', function () {
				var peek;

				beforeEach(function () {
					peek = stack.peek();
				});

				it('the peek result should be the second item pushed onto the stack', function () {
					expect(peek).toBe(second);
				});

				it('should not be empty', function () {
					expect(stack.empty()).toEqual(false);
				});
			});

			describe('and an object is popped from the stack', function () {
				var pop;

				beforeEach(function () {
					pop = stack.pop();
				});

				it('the pop result should be the second item pushed onto the stack', function () {
					expect(pop).toBe(second);
				});

				it('should not be empty', function () {
					expect(stack.empty()).toEqual(false);
				});
			});

			describe('and the queue is exported to an array', function () {
				var a;

				beforeEach(function () {
					a = stack.toArray();
				});

				it('should return an array with two items', function () {
					expect(a.length).toEqual(2);
				});

				it('the first item should be the second item pushed', function () {
					expect(a[0]).toBe(second);
				});

				it('the second item should be the first item pushed', function () {
					expect(a[1]).toBe(first);
				});

				it('should not be empty', function () {
					expect(stack.empty()).toEqual(false);
				});
			});

			describe('and the stack is scanned', function () {
				var spy;

				beforeEach(function () {
					spy = jasmine.createSpy();

					stack.scan(spy);
				});

				it('should call the delegate one time for each item in the queue', function () {
					expect(spy.calls.count()).toEqual(2);
				});

				it('should pass the second item to be pushed to the delegate first', function () {
					expect(spy.calls.argsFor(0)[0]).toBe(second);
				});

				it('should pass the first item to be pushed to the delegate second', function () {
					expect(spy.calls.argsFor(1)[0]).toBe(first);
				});
			});
		});
	});
});

},{"./../../../collections/Stack":3}],69:[function(require,module,exports){
'use strict';

var Tree = require('./../../../collections/Tree');

describe('When a Tree is constructed', function () {
	'use strict';

	var root;
	var one;

	beforeEach(function () {
		root = new Tree(one = {});
	});

	it('should be the root node', function () {
		expect(root.getIsRoot()).toEqual(true);
	});

	it('should be a leaf node', function () {
		expect(root.getIsLeaf()).toEqual(true);
	});

	it('should have to correct node value', function () {
		expect(root.getValue()).toBe(one);
	});

	describe('When a child is added', function () {
		var child;
		var two;

		beforeEach(function () {
			child = root.addChild(two = {});
		});

		it('should be a leaf node', function () {
			expect(child.getIsLeaf()).toEqual(true);
		});

		it('should have to correct node value', function () {
			expect(child.getValue()).toBe(two);
		});

		it('should should be the child of the root node', function () {
			expect(child.getParent()).toBe(root);
		});

		it('should not have a parent which is considered a leaf node', function () {
			expect(root.getIsLeaf()).toEqual(false);
		});

		it('should be in the parents collection of children', function () {
			expect(root.getChildren().find(function (c) {
				return c === child;
			})).toBe(child);
		});
	});
});

},{"./../../../collections/Tree":4}],70:[function(require,module,exports){
'use strict';

var ComparatorBuilder = require('./../../../../collections/sorting/ComparatorBuilder');

describe('When a ComparatorBuilder is composed with two comparators', function () {
    'use strict';

    var comparatorBuilder;

    var comparatorOne;
    var comparatorTwo;

    var first = { x: 0, y: 0, toString: function toString() {
            return '[first]';
        } };
    var second = { x: 1, y: 0, toString: function toString() {
            return '[second]';
        } };
    var third = { x: 1, y: 1, toString: function toString() {
            return '[third]';
        } };

    beforeEach(function () {
        comparatorOne = jasmine.createSpy('comparatorOne').and.callFake(function (a, b) {
            return a.x - b.x;
        });

        comparatorTwo = jasmine.createSpy('comparatorTwo').and.callFake(function (a, b) {
            return a.y - b.y;
        });

        comparatorBuilder = ComparatorBuilder.startWith(comparatorOne).thenBy(comparatorTwo);
    });

    describe('and the ComparatorBuilder sorts an array (which requires both comparators)', function () {
        var arrayToSort;

        beforeEach(function () {
            arrayToSort = [third, first, second];

            arrayToSort.sort(comparatorBuilder.toComparator());
        });

        it('the first comparator should be invoked', function () {
            expect(comparatorOne).toHaveBeenCalled();
        });

        it('the second comparator should be invoked', function () {
            expect(comparatorTwo).toHaveBeenCalled();
        });

        it('the sorted array should be in the correct order', function () {
            expect(arrayToSort[0]).toBe(first);
            expect(arrayToSort[1]).toBe(second);
            expect(arrayToSort[2]).toBe(third);
        });
    });

    describe('and the ComparatorBuilder is inverted', function () {
        beforeEach(function () {
            comparatorBuilder = comparatorBuilder.invert();
        });

        describe('and the ComparatorBuilder sorts an array (which requires both comparators)', function () {
            var arrayToSort;

            beforeEach(function () {
                arrayToSort = [third, first, second];

                arrayToSort.sort(comparatorBuilder.toComparator());
            });

            it('the first comparator should be invoked', function () {
                expect(comparatorOne).toHaveBeenCalled();
            });

            it('the second comparator should be invoked', function () {
                expect(comparatorTwo).toHaveBeenCalled();
            });

            it('the sorted array should be in the correct order', function () {
                expect(arrayToSort[0]).toBe(third);
                expect(arrayToSort[1]).toBe(second);
                expect(arrayToSort[2]).toBe(first);
            });
        });
    });
});

},{"./../../../../collections/sorting/ComparatorBuilder":5}],71:[function(require,module,exports){
'use strict';

var comparators = require('./../../../../collections/sorting/comparators');

describe('When using the "compareDates" comparator', function () {
	'use strict';

	var first = new Date(2015, 12, 1);
	var second = new Date(2015, 12, 31);
	var third = new Date(2016, 1, 31);

	describe('to sort an array of Date instances', function () {
		var arrayToSort;

		beforeEach(function () {
			arrayToSort = [second, first, third];

			arrayToSort.sort(comparators.compareDates);
		});

		it('the array should be in the correct order', function () {
			expect(arrayToSort[0]).toBe(first);
			expect(arrayToSort[1]).toBe(second);
			expect(arrayToSort[2]).toBe(third);
		});
	});

	describe('to sort an array that contains something other than Date instances', function () {
		it('an error should be thrown', function () {
			expect(function () {
				var arrayToSort = [second, first, third, '1-1-2017'];

				arrayToSort.sort(comparators.compareDates);
			}).toThrow();
		});
	});
});

describe('When using the "compareNumbers" comparator', function () {
	'use strict';

	var first = -1;
	var second = Math.E;
	var third = Math.PI;

	describe('to sort an array of numbers', function () {
		var arrayToSort;

		beforeEach(function () {
			arrayToSort = [second, first, third];

			arrayToSort.sort(comparators.compareNumbers);
		});

		it('the array should be in the correct order', function () {
			expect(arrayToSort[0]).toBe(first);
			expect(arrayToSort[1]).toBe(second);
			expect(arrayToSort[2]).toBe(third);
		});
	});

	describe('to sort an array that contains something other than numbers', function () {
		it('an error should be thrown', function () {
			expect(function () {
				var arrayToSort = [second, first, third, null];

				arrayToSort.sort(comparators.compareNumbers);
			}).toThrow();
		});
	});
});

describe('When using the "compareStrings" comparator', function () {
	'use strict';

	var first = '';
	var second = 'Bye now';
	var third = 'Hi there';

	describe('to sort an array of strings', function () {
		var arrayToSort;

		beforeEach(function () {
			arrayToSort = [third, first, second];

			arrayToSort.sort(comparators.compareStrings);
		});

		it('the array should be in the correct order', function () {
			expect(arrayToSort[0]).toBe(first);
			expect(arrayToSort[1]).toBe(second);
			expect(arrayToSort[2]).toBe(third);
		});
	});

	describe('to sort an array that contains something other than strings', function () {
		it('an error should be thrown', function () {
			expect(function () {
				var arrayToSort = [second, first, third, 7];

				arrayToSort.sort(comparators.compareStrings);
			}).toThrow();
		});
	});
});

},{"./../../../../collections/sorting/comparators":6}],72:[function(require,module,exports){
'use strict';

var CompoundMap = require('./../../../../collections/specialized/CompoundMap');

describe('When an CompoundMap is constructed', function () {
	'use strict';

	describe('with a depth of one', function () {
		var map;

		beforeEach(function () {
			map = new CompoundMap(1);
		});

		describe('and an item with one key is put into the map', function () {
			var value;
			var key;

			beforeEach(function () {
				map.put(value = 'bryan', key = 'b');
			});

			it('should have the item', function () {
				expect(map.has(key)).toEqual(true);
			});

			it('should return the value when asked', function () {
				expect(map.get(key)).toEqual(value);
			});
		});

		describe('and an item with one key is put into the map', function () {
			it('should throw an error', function () {
				expect(function () {
					map.put('bryan', 'b', 'r');
				}).toThrow();
			});
		});
	});

	describe('with a depth of two', function () {
		var map;

		beforeEach(function () {
			map = new CompoundMap(2);
		});

		describe('and an item with two keys is put into the map', function () {
			var value;

			var keyOne;
			var keyTwo;

			beforeEach(function () {
				map.put(value = 'bryan', keyOne = 'b', keyTwo = 'r');
			});

			it('should have the item', function () {
				expect(map.has(keyOne, keyTwo)).toEqual(true);
			});

			it('should return the value when asked', function () {
				expect(map.get(keyOne, keyTwo)).toEqual(value);
			});

			describe('and another items, with the same keys, is put into the map', function () {
				var replaced;

				beforeEach(function () {
					map.put(replaced = 'brock', keyOne, keyTwo);
				});

				it('should have the item', function () {
					expect(map.has(keyOne, keyTwo)).toEqual(true);
				});

				it('should return the value when asked', function () {
					expect(map.get(keyOne, keyTwo)).toEqual(replaced);
				});
			});

			describe('and another items, with the same first key, is put into the map', function () {
				var valueB;

				var keyOneB;
				var keyTwoB;

				beforeEach(function () {
					map.put(valueB = 'bob', keyOneB = keyOne, keyTwoB = 'o');
				});

				it('should have the item', function () {
					expect(map.has(keyOneB, keyTwoB)).toEqual(true);
				});

				it('should return the value when asked', function () {
					expect(map.get(keyOneB, keyTwoB)).toEqual(valueB);
				});

				it('should still have the original item', function () {
					expect(map.has(keyOne, keyTwo)).toEqual(true);
				});

				it('should still return the original value when asked', function () {
					expect(map.get(keyOne, keyTwo)).toEqual(value);
				});
			});
		});

		describe('and an item with one key is put into the map', function () {
			it('should throw an error', function () {
				expect(function () {
					map.put('bryan', 'b');
				}).toThrow();
			});
		});
	});
});

},{"./../../../../collections/specialized/CompoundMap":7}],73:[function(require,module,exports){
'use strict';

var Disposable = require('./../../../../lang/Disposable');
var DisposableStack = require('./../../../../collections/specialized/DisposableStack');

describe('When an DisposableStack is constructed', function () {
	'use strict';

	var disposeStack;

	beforeEach(function () {
		disposeStack = new DisposableStack();
	});

	it('should be disposable', function () {
		expect(disposeStack instanceof Disposable).toEqual(true);
	});

	describe('and a Disposable item is added to the stack', function () {
		var disposableOne;
		var spyOne;

		var disposeOrder;

		beforeEach(function () {
			disposeStack.push(disposableOne = Disposable.fromAction(spyOne = jasmine.createSpy('spyOne').and.callFake(function () {
				disposeOrder.push(disposableOne);
			})));
		});

		describe('and the stack is disposed', function () {
			beforeEach(function () {
				disposeOrder = [];

				disposeStack.dispose();
			});

			it('the item should be disposed', function () {
				expect(disposableOne.getIsDisposed()).toEqual(true);
			});

			it('the dispose logic should have been triggered', function () {
				expect(spyOne).toHaveBeenCalled();
			});

			describe('and another item is added to the stack', function () {
				it('should throw an error', function () {
					expect(function () {
						disposeStack.push(Disposable.fromAction(function () {}));
					}).toThrow();
				});
			});
		});

		describe('and the another item is added to the stack', function () {
			var disposableTwo;
			var spyTwo;

			beforeEach(function () {
				disposeStack.push(disposableTwo = Disposable.fromAction(spyTwo = jasmine.createSpy('spyTwo').and.callFake(function () {
					disposeOrder.push(disposableTwo);
				})));
			});

			describe('and the stack is disposed', function () {
				beforeEach(function () {
					disposeOrder = [];

					disposeStack.dispose();
				});

				it('the first item should be disposed', function () {
					expect(disposableOne.getIsDisposed()).toEqual(true);
				});

				it('the dispose logic for the first item have been triggered', function () {
					expect(spyOne).toHaveBeenCalled();
				});

				it('the second item should be disposed', function () {
					expect(disposableTwo.getIsDisposed()).toEqual(true);
				});

				it('the dispose logic for the second item have been triggered', function () {
					expect(spyTwo).toHaveBeenCalled();
				});

				it('the second item should be disposed first (per "stack" rules)', function () {
					expect(disposeOrder[0]).toBe(disposableTwo);
				});

				it('the first item should be disposed next (per "stack" rules)', function () {
					expect(disposeOrder[1]).toBe(disposableOne);
				});
			});
		});
	});

	describe('and the "pushPromise" function is used to add a DisposableItem to the stack', function () {
		var promise;
		var resolveAction;

		beforeEach(function () {
			promise = new Promise(function (resolveCallback) {
				resolveAction = resolveCallback;
			});

			DisposableStack.pushPromise(disposeStack, promise);
		});

		describe('and the promise resolves', function () {
			var spyOne;
			var disposableOne;

			beforeEach(function (done) {
				resolveAction(disposableOne = Disposable.fromAction(spyOne = jasmine.createSpy('spyOne')));

				promise.then(function () {
					done();
				});
			});

			describe('and the stack is disposed', function () {
				beforeEach(function () {
					disposeStack.dispose();
				});

				it('the dispose logic should have been triggered', function () {
					expect(spyOne).toHaveBeenCalled();
				});
			});
		});
	});

	describe('and the "pushPromise" function is used to add two DisposableItems to the stack', function () {
		var promise;

		var resolveActionOne;
		var resolveActionTwo;

		beforeEach(function () {
			promise = Promise.all([new Promise(function (resolveCallback) {
				resolveActionOne = resolveCallback;
			}), new Promise(function (resolveCallback) {
				resolveActionTwo = resolveCallback;
			})]);

			DisposableStack.pushPromise(disposeStack, promise);
		});

		describe('and the promise resolves', function () {
			var spyOne;
			var disposableOne;

			var spyTwo;
			var disposableTwo;

			var disposeOrder;

			beforeEach(function (done) {
				disposeOrder = [];

				resolveActionTwo(disposableTwo = Disposable.fromAction(spyTwo = jasmine.createSpy('spyTwo').and.callFake(function () {
					disposeOrder.push(disposableTwo);
				})));

				setTimeout(function () {
					resolveActionOne(disposableOne = Disposable.fromAction(spyOne = jasmine.createSpy('spyOne').and.callFake(function () {
						disposeOrder.push(disposableOne);
					})));
				}, 5);

				promise.then(function () {
					done();
				});
			});

			describe('and the stack is disposed', function () {
				beforeEach(function () {
					disposeStack.dispose();
				});

				it('the first item should be disposed', function () {
					expect(disposableOne.getIsDisposed()).toEqual(true);
				});

				it('the dispose logic for the first item have been triggered', function () {
					expect(spyOne).toHaveBeenCalled();
				});

				it('the second item should be disposed', function () {
					expect(disposableTwo.getIsDisposed()).toEqual(true);
				});

				it('the dispose logic for the second item have been triggered', function () {
					expect(spyTwo).toHaveBeenCalled();
				});

				it('the second item should be disposed first (per "stack" rules)', function () {
					expect(disposeOrder[0]).toBe(disposableTwo);
				});

				it('the first item should be disposed next (per "stack" rules)', function () {
					expect(disposeOrder[1]).toBe(disposableOne);
				});
			});
		});
	});
});

},{"./../../../../collections/specialized/DisposableStack":8,"./../../../../lang/Disposable":18}],74:[function(require,module,exports){
'use strict';

var EvictingList = require('./../../../../collections/specialized/EvictingList');

describe('When an EvictingList is constructed (with no capacity)', function () {
	'use strict';

	var list;

	beforeEach(function () {
		list = new EvictingList();
	});

	it('should be empty', function () {
		expect(list.empty()).toEqual(true);
	});

	it('should have a capacity of 10', function () {
		expect(list.getCapacity()).toEqual(10);
	});

	describe('when dumped to an array', function () {
		var array;

		beforeEach(function () {
			array = list.toArray();
		});

		it('should be empty', function () {
			expect(array.length).toEqual(0);
		});
	});
});

describe('When an EvictingList is constructed (with a capacity of 1)', function () {
	'use strict';

	var list;

	beforeEach(function () {
		list = new EvictingList(1);
	});

	it('should be empty', function () {
		expect(list.empty()).toEqual(true);
	});

	it('should have a capacity of 1', function () {
		expect(list.getCapacity()).toEqual(1);
	});

	describe('when dumped to an array', function () {
		var array;

		beforeEach(function () {
			array = list.toArray();
		});

		it('should be empty', function () {
			expect(array.length).toEqual(0);
		});
	});

	describe('when the an item is added to the list', function () {
		var a;

		beforeEach(function () {
			list.add(a = {});
		});

		it('peek should return the item', function () {
			expect(list.peek()).toBe(a);
		});

		it('should not be empty', function () {
			expect(list.empty()).toEqual(false);
		});

		describe('when dumped to an array', function () {
			var array;

			beforeEach(function () {
				array = list.toArray();
			});

			it('should contain one item', function () {
				expect(array.length).toEqual(1);
			});

			it('the first item should be the item added', function () {
				expect(array[0]).toEqual(a);
			});
		});

		describe('when a second item is added to the list', function () {
			var b;

			beforeEach(function () {
				list.add(b = {});
			});

			it('should not be empty', function () {
				expect(list.empty()).toEqual(false);
			});

			it('peek should return the second item', function () {
				expect(list.peek()).toBe(b);
			});

			describe('when dumped to an array', function () {
				var array;

				beforeEach(function () {
					array = list.toArray();
				});

				it('should contain one item', function () {
					expect(array.length).toEqual(1);
				});

				it('the first item in the array should be the most recent item', function () {
					expect(array[0]).toBe(b);
				});
			});
		});
	});
});

describe('When an EvictingList is constructed (with a capacity of 3)', function () {
	'use strict';

	var list;

	beforeEach(function () {
		list = new EvictingList(3);
	});

	it('should be empty', function () {
		expect(list.empty()).toEqual(true);
	});

	it('should have a capacity of 3', function () {
		expect(list.getCapacity()).toEqual(3);
	});

	describe('and five items are added to the list', function () {
		var a;
		var b;
		var c;
		var d;
		var e;

		beforeEach(function () {
			list.add(a = {});
			list.add(b = {});
			list.add(c = {});
			list.add(d = {});
			list.add(e = {});
		});

		it('should not be empty', function () {
			expect(list.empty()).toEqual(false);
		});

		describe('when dumped to an array', function () {
			var array;

			beforeEach(function () {
				array = list.toArray();
			});

			it('should contain three items', function () {
				expect(array.length).toEqual(3);
			});

			it('the first item should be the most recent item added', function () {
				expect(array[0]).toBe(e);
			});

			it('the second item should be the second most recent item added', function () {
				expect(array[1]).toBe(d);
			});

			it('the third item should be the third most recent item addedd', function () {
				expect(array[2]).toBe(c);
			});
		});

		describe('and 100 more items are added to the list', function () {
			var items = [];

			beforeEach(function () {
				for (var i = 0; i < 100; i++) {
					list.add(items[i] = {});
				}
			});

			describe('when dumped to an array', function () {
				var array;

				beforeEach(function () {
					array = list.toArray();
				});

				it('should contain three items', function () {
					expect(array.length).toEqual(3);
				});

				it('the first item should be the most recent item added', function () {
					expect(array[0]).toBe(items[99]);
				});

				it('the second item should be the second most recent item added', function () {
					expect(array[1]).toBe(items[98]);
				});

				it('the third item should be the third most recent item addedd', function () {
					expect(array[2]).toBe(items[97]);
				});
			});
		});
	});
});

},{"./../../../../collections/specialized/EvictingList":9}],75:[function(require,module,exports){
'use strict';

var EvictingMap = require('./../../../../collections/specialized/EvictingMap');

describe('When an EvictingMap is constructed (with no capacity)', function () {
	'use strict';

	var map;

	beforeEach(function () {
		map = new EvictingMap();
	});

	it('should be empty', function () {
		expect(map.empty()).toEqual(true);
	});

	it('should have a capacity of 10', function () {
		expect(map.getCapacity()).toEqual(10);
	});
});

describe('When an EvictingMap is constructed (with a capacity of 1)', function () {
	'use strict';

	var map;

	beforeEach(function () {
		map = new EvictingMap(1);
	});

	it('should be empty', function () {
		expect(map.empty()).toEqual(true);
	});

	it('should have a capacity of 1', function () {
		expect(map.getCapacity()).toEqual(1);
	});

	describe('when an item is added to the map', function () {
		var a;

		beforeEach(function () {
			a = { key: 'a' };

			map.put(a.key, a);
		});

		it('get should return the item', function () {
			expect(map.get(a.key)).toBe(a);
		});

		it('should not be empty', function () {
			expect(map.empty()).toEqual(false);
		});

		it('should have one item', function () {
			expect(map.getSize()).toEqual(1);
		});

		describe('when a second item is added to the map', function () {
			var b;

			beforeEach(function () {
				b = { key: 'b' };

				map.put(b.key, b);
			});

			it('get should return the second item', function () {
				expect(map.get(b.key)).toBe(b);
			});

			it('get should not return the first item', function () {
				expect(map.get(a.key)).toEqual(null);
			});

			it('should not be empty', function () {
				expect(map.empty()).toEqual(false);
			});

			it('should have one item', function () {
				expect(map.getSize()).toEqual(1);
			});

			describe('when a third item is added to the map', function () {
				var c;

				beforeEach(function () {
					c = { key: 'c' };

					map.put(c.key, c);
				});

				it('get should return the third item', function () {
					expect(map.get(c.key)).toBe(c);
				});

				it('get should not return the first item', function () {
					expect(map.get(a.key)).toEqual(null);
				});

				it('get should not return the second item', function () {
					expect(map.get(b.key)).toEqual(null);
				});

				it('should not be empty', function () {
					expect(map.empty()).toEqual(false);
				});

				it('should have one item', function () {
					expect(map.getSize()).toEqual(1);
				});
			});
		});

		describe('when the first item is removed from the map', function () {
			beforeEach(function () {
				map.remove('a');
			});

			it('should be empty', function () {
				expect(map.empty()).toEqual(true);
			});

			it('should have zero items', function () {
				expect(map.getSize()).toEqual(0);
			});

			describe('when the item is added to the map again', function () {
				beforeEach(function () {
					map.put(a.key, a);
				});

				it('get should return the item', function () {
					expect(map.get(a.key)).toBe(a);
				});

				it('should not be empty', function () {
					expect(map.empty()).toEqual(false);
				});

				it('should have one item', function () {
					expect(map.getSize()).toEqual(1);
				});
			});
		});
	});
});

describe('When an EvictingMap is constructed (with a capacity of 3)', function () {
	'use strict';

	var map;

	beforeEach(function () {
		map = new EvictingMap(3);
	});

	it('should be empty', function () {
		expect(map.empty()).toEqual(true);
	});

	it('should have a capacity of 3', function () {
		expect(map.getCapacity()).toEqual(3);
	});

	describe('when three items are added to the map', function () {
		var a;
		var b;
		var c;

		beforeEach(function () {
			a = { key: 'a' };
			b = { key: 'b' };
			c = { key: 'c' };

			map.put(a.key, a);
			map.put(b.key, b);
			map.put(c.key, c);
		});

		it('get "a" should return the first item', function () {
			expect(map.get(a.key)).toBe(a);
		});

		it('get "b" should return the second item', function () {
			expect(map.get(b.key)).toBe(b);
		});

		it('get "c" should return the third item', function () {
			expect(map.get(c.key)).toBe(c);
		});

		it('should not be empty', function () {
			expect(map.empty()).toEqual(false);
		});

		it('should have three items', function () {
			expect(map.getSize()).toEqual(3);
		});

		describe('when a fourth item is added to the map', function () {
			var d;

			beforeEach(function () {
				d = { key: 'd' };

				map.put(d.key, d);
			});

			it('get "a" should not return the first item', function () {
				expect(map.get(a.key)).toEqual(null);
			});

			it('get "b" should return the second item', function () {
				expect(map.get(b.key)).toBe(b);
			});

			it('get "c" should return the third item', function () {
				expect(map.get(c.key)).toBe(c);
			});

			it('get "d" should return the fourth item', function () {
				expect(map.get(d.key)).toBe(d);
			});

			it('should not be empty', function () {
				expect(map.empty()).toEqual(false);
			});

			it('should have three items', function () {
				expect(map.getSize()).toEqual(3);
			});

			describe('after getting item "b" from map', function () {
				beforeEach(function () {
					map.get(b.key);
				});

				describe('when a fifth item is added to the list', function () {
					var e;

					beforeEach(function () {
						e = { key: 'e' };

						map.put(e.key, e);
					});

					it('get "a" should not return the first item', function () {
						expect(map.get(a.key)).toEqual(null);
					});

					it('get "b" should return the second item', function () {
						expect(map.get(b.key)).toBe(b);
					});

					it('get "c" should not return the third item', function () {
						expect(map.get(c.key)).toEqual(null);
					});

					it('get "d" should return the fourth item', function () {
						expect(map.get(d.key)).toBe(d);
					});

					it('get "e" should return the fifth item', function () {
						expect(map.get(e.key)).toBe(e);
					});

					it('should not be empty', function () {
						expect(map.empty()).toEqual(false);
					});

					it('should have three items', function () {
						expect(map.getSize()).toEqual(3);
					});
				});
			});
		});
	});
});

},{"./../../../../collections/specialized/EvictingMap":10}],76:[function(require,module,exports){
'use strict';

var PriorityQueue = require('./../../../../collections/specialized/PriorityQueue');

describe('When a Queue is constructed, using a "ladies first" comparator', function () {
	'use strict';

	var queue;

	var comparator = function comparator(a, b) {
		var aLady = a.lady ? -1 : 0;
		var bLady = b.lady ? -1 : 0;

		var result = aLady - bLady;

		if (result === 0) {
			result = a.name.localeCompare(b.name);
		}

		return result;
	};

	beforeEach(function () {
		queue = new PriorityQueue(comparator);
	});

	it('should be empty', function () {
		expect(queue.empty()).toEqual(true);
	});

	it('should throw if "peek" is called', function () {
		expect(function () {
			queue.peek();
		}).toThrow(new Error('Queue is empty'));
	});

	it('should throw if "dequeue" is called', function () {
		expect(function () {
			queue.peek();
		}).toThrow(new Error('Queue is empty'));
	});

	describe('and an three objects are enqueued: Kim, Bryan, and Erica', function () {
		var kim, bryan, erica;

		beforeEach(function () {
			queue.enqueue(kim = { name: 'kim', lady: true });
			queue.enqueue(bryan = { name: 'bryan', lady: false });
			queue.enqueue(erica = { name: 'erica', lady: true });
		});

		it('should not be empty', function () {
			expect(queue.empty()).toEqual(false);
		});

		describe('and we peek at the top of the queue', function () {
			var peek;

			beforeEach(function () {
				peek = queue.peek();
			});

			it('the peek result should be erica', function () {
				expect(peek).toBe(erica);
			});

			it('should not be empty', function () {
				expect(queue.empty()).toEqual(false);
			});
		});

		describe('and an object is dequeued', function () {
			var dequeue;

			beforeEach(function () {
				dequeue = queue.dequeue();
			});

			it('the dequeue result should be erica', function () {
				expect(dequeue).toBe(erica);
			});

			it('should not be empty', function () {
				expect(queue.empty()).toEqual(false);
			});

			describe('and an second object is dequeued', function () {
				var dequeue;

				beforeEach(function () {
					dequeue = queue.dequeue();
				});

				it('the dequeue result should be kim', function () {
					expect(dequeue).toBe(kim);
				});

				it('should not be empty', function () {
					expect(queue.empty()).toEqual(false);
				});

				describe('and a third object is dequeued', function () {
					var dequeue;

					beforeEach(function () {
						dequeue = queue.dequeue();
					});

					it('the dequeue result should be bryan', function () {
						expect(dequeue).toBe(bryan);
					});

					it('should be empty', function () {
						expect(queue.empty()).toEqual(true);
					});
				});
			});
		});

		describe('and the queue is exported to an array', function () {
			var a;

			beforeEach(function () {
				a = queue.toArray();
			});

			it('should return an array with three items', function () {
				expect(a.length).toEqual(3);
			});

			it('the first item should be erica', function () {
				expect(a[0]).toBe(erica);
			});

			it('the second item should be kim', function () {
				expect(a[1]).toBe(kim);
			});

			it('the third item should be bryan', function () {
				expect(a[2]).toBe(bryan);
			});

			it('should not be empty', function () {
				expect(queue.empty()).toEqual(false);
			});
		});

		describe('and the queue is scanned', function () {
			var spy;

			beforeEach(function () {
				spy = jasmine.createSpy();

				queue.scan(spy);
			});

			it('should call the delegate one time for each item in the queue', function () {
				expect(spy.calls.count()).toEqual(3);
			});

			it('should pass erica to the delegate first', function () {
				expect(spy.calls.argsFor(0)[0]).toBe(erica);
			});

			it('should pass kim to the delegate second', function () {
				expect(spy.calls.argsFor(1)[0]).toBe(kim);
			});

			it('should pass bryan to the delegate thrid', function () {
				expect(spy.calls.argsFor(2)[0]).toBe(bryan);
			});

			it('should not be empty', function () {
				expect(queue.empty()).toEqual(false);
			});
		});
	});
});

},{"./../../../../collections/specialized/PriorityQueue":11}],77:[function(require,module,exports){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
	return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
	return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

var CommandHandler = require('./../../../commands/CommandHandler');

describe('When a CommandHandler is created from a function', function () {
	'use strict';

	var commandHandler;
	var spy;
	var result;

	beforeEach(function () {
		commandHandler = CommandHandler.fromFunction(spy = jasmine.createSpy('spy').and.returnValue(result = 123));
	});

	it('returns a CommandHandler instance', function () {
		expect(commandHandler instanceof CommandHandler).toEqual(true);
	});

	describe('and the command is executed', function () {
		var commandData;
		var commandResult;

		beforeEach(function () {
			commandResult = commandHandler.process(commandData = {});
		});

		it('should invoke the wrapped function', function () {
			expect(spy).toHaveBeenCalledWith(commandData);
		});

		it('should return the wrapped function\'s result', function () {
			expect(commandResult).toEqual(result);
		});
	});

	describe('and the command processor is converted to a function', function () {
		var commandFunction;

		beforeEach(function () {
			commandFunction = CommandHandler.toFunction(commandHandler);
		});

		it('returns a function', function () {
			expect(typeof commandFunction === 'undefined' ? 'undefined' : _typeof(commandFunction)).toEqual('function');
		});

		describe('and the converted function is invoked', function () {
			var commandData;
			var commandResult;

			beforeEach(function () {
				commandResult = commandFunction(commandData = {});
			});

			it('should invoke the wrapped function', function () {
				expect(spy).toHaveBeenCalledWith(commandData);
			});

			it('should return the wrapped function\'s result', function () {
				expect(commandResult).toEqual(result);
			});
		});
	});
});

},{"./../../../commands/CommandHandler":12}],78:[function(require,module,exports){
'use strict';

var CommandHandler = require('./../../../commands/CommandHandler');
var CompositeCommandHandler = require('./../../../commands/CompositeCommandHandler');

describe('When a CompositeCommandHandler is created', function () {
	'use strict';

	var commandHandler;
	var spyOne;
	var spyTwo;

	var resultOne;
	var resultTwo;

	beforeEach(function () {
		resultOne = true;
		resultTwo = true;

		commandHandler = new CompositeCommandHandler(CommandHandler.fromFunction(spyOne = jasmine.createSpy('spyOne').and.callFake(function () {
			return resultOne;
		})), CommandHandler.fromFunction(spyTwo = jasmine.createSpy('spyTwo').and.callFake(function () {
			return resultTwo;
		})));
	});

	describe('and the command is executed', function () {
		var commandData;
		var commandResult;

		beforeEach(function () {
			commandResult = commandHandler.process(commandData = {});
		});

		it('should invoke the wrapped functions', function () {
			expect(spyOne).toHaveBeenCalledWith(commandData);
			expect(spyTwo).toHaveBeenCalledWith(commandData);
		});
	});

	describe('and the command is executed, but the first command fails', function () {
		var commandData;
		var commandResult;

		beforeEach(function () {
			resultOne = false;
			resultTwo = false;

			commandResult = commandHandler.process(commandData = {});
		});

		it('should invoke the first command', function () {
			expect(spyOne).toHaveBeenCalledWith(commandData);
		});

		it('should not invoke the first command', function () {
			expect(spyTwo).not.toHaveBeenCalledWith(commandData);
		});
	});
});

},{"./../../../commands/CommandHandler":12,"./../../../commands/CompositeCommandHandler":13}],79:[function(require,module,exports){
'use strict';

var CommandHandler = require('./../../../commands/CommandHandler');
var MappedCommandHandler = require('./../../../commands/MappedCommandHandler');

describe('When a MappedCommandHandler is created with two mapped commands', function () {
	'use strict';

	var commandHandler;

	var spyOne;
	var spyTwo;

	var selectorOne;
	var selectorTwo;

	var resultOne;
	var resultTwo;

	beforeEach(function () {
		selectorOne = 'one';
		selectorTwo = 'two';

		resultOne = 'a';
		resultTwo = 'b';

		commandHandler = new MappedCommandHandler(function (data) {
			return data.commandType || null;
		});

		commandHandler.addCommandHandler(selectorOne, CommandHandler.fromFunction(spyOne = jasmine.createSpy('spyOne').and.callFake(function () {
			return resultOne;
		})));
		commandHandler.addCommandHandler(selectorTwo, CommandHandler.fromFunction(spyTwo = jasmine.createSpy('spyTwo').and.callFake(function () {
			return resultTwo;
		})));
	});

	describe('and the command is process with data for the first handler', function () {
		var commandData;
		var commandResult;

		beforeEach(function () {
			commandResult = commandHandler.process(commandData = { commandType: selectorOne });
		});

		it('should invoke wrapped function for the first handler', function () {
			expect(spyOne).toHaveBeenCalledWith(commandData);
		});

		it('should return the result from the first handler', function () {
			expect(commandResult).toEqual(resultOne);
		});

		it('should not invoke wrapped function for the secoond handler', function () {
			expect(spyTwo).not.toHaveBeenCalledWith(commandData);
		});
	});

	describe('and the command is process with data for the second handler', function () {
		var commandData;
		var commandResult;

		beforeEach(function () {
			commandResult = commandHandler.process(commandData = { commandType: selectorTwo });
		});

		it('should invoke wrapped function for the second handler', function () {
			expect(spyTwo).toHaveBeenCalledWith(commandData);
		});

		it('should return the result from the second handler', function () {
			expect(commandResult).toEqual(resultTwo);
		});

		it('should not invoke wrapped function for the first handler', function () {
			expect(spyOne).not.toHaveBeenCalledWith(commandData);
		});
	});
});

},{"./../../../commands/CommandHandler":12,"./../../../commands/MappedCommandHandler":14}],80:[function(require,module,exports){
'use strict';

var Day = require('./../../../lang/Day');

describe('When "2017-08-31 is parsed as a Day', function () {
	'use strict';

	var day;

	beforeEach(function () {
		day = Day.parse('2017-08-31');
	});

	it('the year should be 2017', function () {
		expect(day.year).toEqual(2017);
	});

	it('the month should be 8', function () {
		expect(day.month).toEqual(8);
	});

	it('the day should be 31', function () {
		expect(day.day).toEqual(31);
	});

	describe('and the Day instance is formatted', function () {
		it('should output "2017-08-31"', function () {
			expect(day.format()).toEqual('2017-08-31');
		});
	});
});

describe('When an invalid string is parsed as a Day', function () {
	function expectError(value) {
		expect(function () {
			Day.parse(value);
		}).toThrow();
	}

	it('an error should be thrown parsing a null value', function () {
		expectError(null);
	});

	it('an error should be thrown parsing a undefined value', function () {
		expectError(null);
	});

	it('an error should be thrown parsing a Date instance', function () {
		expectError(new Date());
	});

	it('an error should be thrown parsing an object', function () {
		expectError({});
	});

	it('an error should be thrown parsing an number', function () {
		expectError(new Date().getTime());
	});

	it('an should be thrown when using 13 months', function () {
		expectError('2017-13-01');
	});

	it('an should be thrown when using 32 days in January', function () {
		expectError('2017-01-32');
	});

	it('an should be thrown when using 30 days in February', function () {
		expectError('2017-02-30');
	});

	it('an should be thrown when using 32 days in March', function () {
		expectError('2017-03-32');
	});

	it('an should be thrown when using 31 days in April', function () {
		expectError('2017-04-31');
	});

	it('an should be thrown when using 32 days in May', function () {
		expectError('2017-05-32');
	});

	it('an should be thrown when using 31 days in June', function () {
		expectError('2017-06-31');
	});

	it('an should be thrown when using 32 days in July', function () {
		expectError('2017-07-32');
	});

	it('an should be thrown when using 32 days in August', function () {
		expectError('2017-08-32');
	});

	it('an should be thrown when using 31 days in September', function () {
		expectError('2017-02-31');
	});

	it('an should be thrown when using 32 days in October', function () {
		expectError('2017-10-32');
	});

	it('an should be thrown when using 31 days in November', function () {
		expectError('2017-11-31');
	});

	it('an should be thrown when using 32 days in December', function () {
		expectError('2017-12-32');
	});
});

describe('When checking to see if a Day is valid', function () {
	'use strict';

	it('should consider Jan 1, 2017 to be valid', function () {
		expect(Day.validate(2017, 1, 1)).toEqual(true);
	});

	it('should consider Dec 31, 2017 to be valid', function () {
		expect(Day.validate(2017, 12, 31)).toEqual(true);
	});

	it('should not consider Feb 29, 2017 to be valid', function () {
		expect(Day.validate(2017, 2, 29)).toEqual(false);
	});

	it('should not consider Feb 29, 2018 to be valid', function () {
		expect(Day.validate(2018, 2, 29)).toEqual(false);
	});

	it('should not consider Feb 29, 2019 to be valid', function () {
		expect(Day.validate(2019, 2, 29)).toEqual(false);
	});

	it('should consider Feb 29, 2020 to be valid', function () {
		expect(Day.validate(2020, 2, 29)).toEqual(true);
	});
});

describe('When adding days to a Day', function () {
	'use strict';

	it('should return January 2, 2017 when adding 1 day to January 1, 2017', function () {
		var now = new Day(2017, 1, 1);
		var then = now.addDays(1);

		expect(then.year).toEqual(2017);
		expect(then.month).toEqual(1);
		expect(then.day).toEqual(2);
	});

	it('should return March 1, 2017 when adding 1 day to Feb 28, 2017', function () {
		var now = new Day(2017, 2, 28);
		var then = now.addDays(1);

		expect(then.year).toEqual(2017);
		expect(then.month).toEqual(3);
		expect(then.day).toEqual(1);
	});

	it('should return Feb 29, 2020 when adding 1 day Feb 28, 2020', function () {
		var now = new Day(2020, 2, 28);
		var then = now.addDays(1);

		expect(then.year).toEqual(2020);
		expect(then.month).toEqual(2);
		expect(then.day).toEqual(29);
	});

	it('should return Aug 18, 2018 when adding 400 days to Jul 14, 2017', function () {
		var now = new Day(2017, 7, 14);
		var then = now.addDays(400);

		expect(then.year).toEqual(2018);
		expect(then.month).toEqual(8);
		expect(then.day).toEqual(18);
	});

	it('should return Aug 18, 2017 when subtracting 1 day from Aug 19, 2017 (using inverse)', function () {
		var now = new Day(2017, 8, 19);
		var then = now.subtractDays(1);

		expect(then.year).toEqual(2017);
		expect(then.month).toEqual(8);
		expect(then.day).toEqual(18);
	});

	it('should return Aug 18, 2017 when adding 1 "inverse" day to Aug 19, 2017', function () {
		var now = new Day(2017, 8, 19);
		var then = now.addDays(1, true);

		expect(then.year).toEqual(2017);
		expect(then.month).toEqual(8);
		expect(then.day).toEqual(18);
	});

	it('should return Aug 18, 2017 when adding -1 day to Aug 19, 2017', function () {
		var now = new Day(2017, 8, 19);
		var then = now.addDays(-1);

		expect(then.year).toEqual(2017);
		expect(then.month).toEqual(8);
		expect(then.day).toEqual(18);
	});

	it('should return Jul 30, 2017 when subtracting 2 days from Aug 1, 2017', function () {
		var now = new Day(2017, 8, 1);
		var then = now.addDays(2, true);

		expect(then.year).toEqual(2017);
		expect(then.month).toEqual(7);
		expect(then.day).toEqual(30);
	});

	it('should return Dec 31, 2017 when subtracting 2 days from Jan 10, 2018', function () {
		var now = new Day(2018, 1, 10);
		var then = now.addDays(10, true);

		expect(then.year).toEqual(2017);
		expect(then.month).toEqual(12);
		expect(then.day).toEqual(31);
	});

	it('should return Feb 29, 2020 when subtracting 1 day from Mar 1, 2020', function () {
		var now = new Day(2020, 3, 1);
		var then = now.addDays(1, true);

		expect(then.year).toEqual(2020);
		expect(then.month).toEqual(2);
		expect(then.day).toEqual(29);
	});

	it('should return Mar 1, 2020 when adding 0 days from Mar 1, 2020', function () {
		var now = new Day(2020, 3, 1);
		var then = now.addDays(0);

		expect(then.year).toEqual(2020);
		expect(then.month).toEqual(3);
		expect(then.day).toEqual(1);
	});
});

},{"./../../../lang/Day":16}],81:[function(require,module,exports){
'use strict';

var Decimal = require('./../../../lang/Decimal');

describe('When adding values that cause floating point problems (e.g. 1.1 + 2.2 != 3.3)', function () {
	'use strict';

	var a;
	var b;
	var c;

	beforeEach(function () {
		a = new Decimal(1.1);
		b = new Decimal(2.2);

		c = a.add(b);
	});

	describe('and exported to a floating point value', function () {
		var f;

		beforeEach(function () {
			f = c.toFloat();
		});

		it('should sum to 3.3 (not 3.3000000000000003)', function () {
			expect(f).toEqual(3.3);
		});
	});
});

describe('When working with values that loss of precision occurs with floating point math (e.g. 100 trillion plus one third)', function () {
	'use strict';

	var a;
	var b;
	var c;

	beforeEach(function () {
		a = new Decimal(100000000000000);
		b = new Decimal(1 / 8);

		c = a.add(b);
	});

	describe('and exported to a fixed string', function () {
		var f;

		beforeEach(function () {
			f = c.toFixed();
		});

		it('should maintain precision', function () {
			expect(f).toEqual("100000000000000.125");
		});
	});
});

describe('When accessing the "Zero" singleton', function () {
	'use strict';

	var zero;

	beforeEach(function () {
		zero = Decimal.ZERO;
	});

	it('should not be positive', function () {
		expect(zero.getIsPositive()).toEqual(false);
	});

	it('should not be negative', function () {
		expect(zero.getIsNegative()).toEqual(false);
	});

	it('should be zero', function () {
		expect(zero.getIsZero()).toEqual(true);
	});

	it('should approximate zero', function () {
		expect(zero.getIsZero(true)).toEqual(true);
	});

	it('the floating point export should equal zero', function () {
		expect(zero.toFloat()).toEqual(0);
	});

	it('the fixed export should equal "0"', function () {
		expect(zero.toFixed()).toEqual('0');
	});
});

describe('When instantiating a Decimal', function () {
	'use strict';

	describe('from an object', function () {
		it('should throw', function () {
			expect(function () {
				var d = new Decimal({});
			}).toThrow();
		});
	});

	describe('from a null value', function () {
		it('should throw', function () {
			expect(function () {
				var d = new Decimal(null);
			}).toThrow();
		});
	});

	describe('from an undefined value', function () {
		it('should throw', function () {
			expect(function () {
				var d = new Decimal(undefined);
			}).toThrow();
		});
	});

	describe('from the number forty two', function () {
		var d;

		beforeEach(function () {
			d = new Decimal(42);
		});

		it('should not be positive', function () {
			expect(d.getIsPositive()).toEqual(true);
		});

		it('should not be negative', function () {
			expect(d.getIsNegative()).toEqual(false);
		});

		it('should be zero', function () {
			expect(d.getIsZero()).toEqual(false);
		});

		it('should approximate zero', function () {
			expect(d.getIsZero(true)).toEqual(false);
		});

		it('the floating point export should equal the meaning of life', function () {
			expect(d.toFloat()).toEqual(42);
		});

		it('the fixed export should equal "42"', function () {
			expect(d.toFixed()).toEqual('42');
		});

		describe('and adding the number one', function () {
			var e;

			beforeEach(function () {
				e = d.add(1);
			});

			it('should return a Decimal instance', function () {
				expect(e instanceof Decimal).toEqual(true);
			});

			it('should be a different instance', function () {
				expect(e).not.toBe(d);
			});

			it('should equal forty three', function () {
				expect(e.toFloat()).toEqual(43);
			});

			it('should not mutate the original instance', function () {
				expect(d.toFloat()).toEqual(42);
			});
		});

		describe('and adding a Decimal having a value of one', function () {
			var e;
			var x;

			beforeEach(function () {
				e = d.add(x = new Decimal(1));
			});

			it('should return a Decimal instance', function () {
				expect(e instanceof Decimal).toEqual(true);
			});

			it('should be a different instance', function () {
				expect(e).not.toBe(d);
			});

			it('should equal forty three', function () {
				expect(e.toFloat()).toEqual(43);
			});

			it('should not mutate the original instance', function () {
				expect(d.toFloat()).toEqual(42);
			});

			it('should not mutate the operand', function () {
				expect(x.toFloat()).toEqual(1);
			});
		});

		describe('and dividing by zero', function () {
			it('should throw', function () {
				expect(function () {
					var e = d.divideBy(0);
				}).toThrow();
			});
		});
	});

	describe('from the string "1"', function () {
		var d;

		beforeEach(function () {
			d = new Decimal("1");
		});

		it('should be positive', function () {
			expect(d.getIsPositive()).toEqual(true);
		});

		it('should not be negative', function () {
			expect(d.getIsNegative()).toEqual(false);
		});

		it('should be zero', function () {
			expect(d.getIsZero()).toEqual(false);
		});

		it('the fixed export should equal "1"', function () {
			expect(d.toFixed()).toEqual('1');
		});
	});
});

},{"./../../../lang/Decimal":17}],82:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Disposable = require('./../../../lang/Disposable');

describe('When a Disposable is extended', function () {
	'use strict';

	var TestDisposable = function (_Disposable) {
		_inherits(TestDisposable, _Disposable);

		function TestDisposable() {
			_classCallCheck(this, TestDisposable);

			var _this = _possibleConstructorReturn(this, (TestDisposable.__proto__ || Object.getPrototypeOf(TestDisposable)).call(this));

			_this._disposeSpy = jasmine.createSpy('disposeAction');
			return _this;
		}

		_createClass(TestDisposable, [{
			key: 'getDisposeSpy',
			value: function getDisposeSpy() {
				return this._disposeSpy;
			}
		}, {
			key: '_onDispose',
			value: function _onDispose() {
				this._disposeSpy();
			}
		}]);

		return TestDisposable;
	}(Disposable);

	var testDisposable;

	beforeEach(function () {
		testDisposable = new TestDisposable();
	});

	it('should not indicate that it has been disposed', function () {
		expect(testDisposable.getIsDisposed()).toEqual(false);
	});

	it('should not have triggered the dispose action', function () {
		expect(testDisposable.getDisposeSpy()).not.toHaveBeenCalled();
	});

	describe("and the instance is disposed", function () {
		beforeEach(function () {
			testDisposable.dispose();
		});

		it('should not indicate that it has been disposed', function () {
			expect(testDisposable.getIsDisposed()).toEqual(true);
		});

		it('should have triggered the dispose action', function () {
			expect(testDisposable.getDisposeSpy().calls.count()).toEqual(1);
		});

		describe("and the instance is disposed again", function () {
			beforeEach(function () {
				testDisposable.dispose();
			});

			it('should not indicate that it has been disposed', function () {
				expect(testDisposable.getIsDisposed()).toEqual(true);
			});

			it('should not dispose action again', function () {
				expect(testDisposable.getDisposeSpy().calls.count()).toEqual(1);
			});
		});
	});
});

describe('When a Disposable.fromAction creates a Disposable', function () {
	'use strict';

	var testDisposable;
	var testDisposableSpy;

	beforeEach(function () {
		testDisposable = Disposable.fromAction(testDisposableSpy = jasmine.createSpy('testDisposableSpy'));
	});

	it('should be an instance of Disposable', function () {
		expect(testDisposable instanceof Disposable).toEqual(true);
	});

	it('should not indicate that it has been disposed', function () {
		expect(testDisposable.getIsDisposed()).toEqual(false);
	});

	it('should not have triggered the dispose action', function () {
		expect(testDisposableSpy).not.toHaveBeenCalled();
	});

	describe("and the instance is disposed", function () {
		beforeEach(function () {
			testDisposable.dispose();
		});

		it('should not indicate that it has been disposed', function () {
			expect(testDisposable.getIsDisposed()).toEqual(true);
		});

		it('should have triggered the dispose action', function () {
			expect(testDisposableSpy.calls.count()).toEqual(1);
		});

		describe("and the instance is disposed again", function () {
			beforeEach(function () {
				testDisposable.dispose();
			});

			it('should not indicate that it has been disposed', function () {
				expect(testDisposable.getIsDisposed()).toEqual(true);
			});

			it('should not dispose action again', function () {
				expect(testDisposableSpy.calls.count()).toEqual(1);
			});
		});
	});
});

},{"./../../../lang/Disposable":18}],83:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Enum = require('./../../../lang/Enum');

describe('When Enum is extended (as types EnumA and EnumB) and type items are added to each (X and Y)', function () {
	'use strict';

	var EnumA = function (_Enum) {
		_inherits(EnumA, _Enum);

		function EnumA(code, description) {
			_classCallCheck(this, EnumA);

			return _possibleConstructorReturn(this, (EnumA.__proto__ || Object.getPrototypeOf(EnumA)).call(this, code, description));
		}

		return EnumA;
	}(Enum);

	var EnumB = function (_Enum2) {
		_inherits(EnumB, _Enum2);

		function EnumB(code, description) {
			_classCallCheck(this, EnumB);

			return _possibleConstructorReturn(this, (EnumB.__proto__ || Object.getPrototypeOf(EnumB)).call(this, code, description));
		}

		return EnumB;
	}(Enum);

	var ax = new EnumA('x', 'A-X');
	var ay = new EnumA('y', 'A-Y');
	var bx = new EnumB('x', 'B-X');
	var by = new EnumB('y', 'B-Y');

	it('should be able to find X in EnumA using the code', function () {
		expect(Enum.fromCode(EnumA, 'x')).toBe(ax);
	});

	it('should be able to find Y in EnumA using the code', function () {
		expect(Enum.fromCode(EnumA, 'y')).toBe(ay);
	});

	it('should be able to find X in EnumB using the code', function () {
		expect(Enum.fromCode(EnumB, 'x')).toBe(bx);
	});

	it('should be able to find Y in EnumB using the code', function () {
		expect(Enum.fromCode(EnumB, 'y')).toBe(by);
	});

	describe('and a duplicate item (A-x) is added', function () {
		var axx = new EnumA('x', 'A-XX');

		it('should be still find the original instance in EnumA for X', function () {
			expect(Enum.fromCode(EnumA, 'x')).toBe(ax);
		});

		it('should should equal the original instance (for X)', function () {
			expect(Enum.fromCode(EnumA, 'x').equals(axx)).toBe(true);
		});
	});
});

},{"./../../../lang/Enum":19}],84:[function(require,module,exports){
'use strict';

var Timestamp = require('./../../../lang/Timestamp');

describe('When Timestamp is created from a timestamp (1502372574350)', function () {
	'use strict';

	var instance;

	beforeEach(function () {
		instance = new Timestamp(1502372574350);
	});

	it('should not have instantiated the underlying moment', function () {
		expect(instance._moment).toEqual(null);
	});

	it('should know the timestamp', function () {
		expect(instance.timestamp).toEqual(1502372574350);
	});

	describe('and the "moment" property is accessed', function () {
		var m;

		beforeEach(function () {
			m = instance.moment;
		});

		it('should not have instantiated the underlying moment', function () {
			expect(instance._moment).not.toEqual(null);
		});

		it('should return a moment', function () {
			expect(m.isValid()).toEqual(true);
		});

		describe('and the "moment" property is accessed (again)', function () {
			var n;

			beforeEach(function () {
				n = instance.moment;
			});

			it('should return the same moment', function () {
				expect(m).toBe(n);
			});
		});
	});
});

},{"./../../../lang/Timestamp":21}],85:[function(require,module,exports){
'use strict';

var Enum = require('./../../../lang/Enum'),
    Timezones = require('./../../../lang/Timezones');

describe('When accessing static items', function () {
	'use strict';

	it('The timezone for Chicago should return the expected item', function () {
		expect(Timezones.AMERICA_CHICAGO.code).toEqual('America/Chicago');
	});

	it('The timezone for New York should return the expected item', function () {
		expect(Timezones.AMERICA_NEW_YORK.code).toEqual('America/New_York');
	});
});

},{"./../../../lang/Enum":19,"./../../../lang/Timezones":22}],86:[function(require,module,exports){
'use strict';

var array = require('./../../../lang/array');

describe('when reducing an array to unique values', function () {
	'use strict';

	describe('and using the first four rows of pascals triangle', function () {
		var unique;

		beforeEach(function () {
			unique = array.unique([1, 1, 1, 1, 2, 1, 1, 3, 3, 1]);
		});

		it('should only contain 3 unique elements', function () {
			expect(unique.length).toEqual(3);
		});

		it('should contain 1', function () {
			expect(unique.indexOf(1)).toEqual(0);
		});

		it('should contain 2', function () {
			expect(unique.indexOf(2)).toEqual(1);
		});

		it('should contain 3', function () {
			expect(unique.indexOf(3)).toEqual(2);
		});
	});
});

describe('when reducing an array of objects to unique values', function () {
	'use strict';

	describe('and using the first four rows of pascals triangle', function () {
		var unique;

		var one;
		var two;
		var three;

		beforeEach(function () {
			unique = array.uniqueBy([one = { x: 1 }, { x: 1 }, { x: 1 }, { x: 1 }, two = { x: 2 }, { x: 1 }, { x: 1 }, three = { x: 3 }, { x: 3 }, { x: 1 }], function (obj) {
				return obj.x;
			});
		});

		it('should only contain 3 unique elements', function () {
			expect(unique.length).toEqual(3);
		});

		it('should contain the first item whose value is one', function () {
			expect(unique[0]).toBe(one);
		});

		it('should contain the first item whose value is two', function () {
			expect(unique[1]).toBe(two);
		});

		it('should contain the first item whose value is three', function () {
			expect(unique[2]).toBe(three);
		});
	});
});

describe('when partitioning an array of three items', function () {
	'use strict';

	var original;

	beforeEach(function () {
		original = [1, 2, 3];
	});

	describe('using a partition size of 10', function () {
		var partitions;

		beforeEach(function () {
			partitions = array.partition(original, 10);
		});

		it('should return an array', function () {
			expect(partitions instanceof Array).toEqual(true);
		});

		it('should return a copy of the original array', function () {
			expect(partitions).not.toBe(original);
		});

		it('should contain one partition', function () {
			expect(partitions.length).toEqual(1);
		});

		it('the first partition should contain three items', function () {
			expect(partitions[0].length).toEqual(3);
		});

		it('the first partition item should be the first item', function () {
			expect(partitions[0][0]).toBe(original[0]);
		});

		it('the second partition item should be the first item', function () {
			expect(partitions[0][1]).toBe(original[1]);
		});

		it('the third partition item should be the first item', function () {
			expect(partitions[0][2]).toBe(original[2]);
		});
	});

	describe('using a partition size of two', function () {
		var partitions;

		beforeEach(function () {
			partitions = array.partition(original, 2);
		});

		it('should return an array', function () {
			expect(partitions instanceof Array).toEqual(true);
		});

		it('should return a copy of the original array', function () {
			expect(partitions).not.toBe(original);
		});

		it('should contain two partition', function () {
			expect(partitions.length).toEqual(2);
		});

		it('the first partition should contain two items', function () {
			expect(partitions[0].length).toEqual(2);
		});

		it('the second partition should contain one item', function () {
			expect(partitions[1].length).toEqual(1);
		});

		it('the first item of the first partition should be the first item', function () {
			expect(partitions[0][0]).toBe(original[0]);
		});

		it('the second item of the first partition should be the second item', function () {
			expect(partitions[0][1]).toBe(original[1]);
		});

		it('the first item of the second partition should be the third item', function () {
			expect(partitions[1][0]).toBe(original[2]);
		});
	});
});

describe('when flattening an array', function () {
	'use strict';

	var arrayOne;
	var arrayTwo;

	var itemA;
	var itemB;
	var itemC;
	var itemD;

	beforeEach(function () {
		arrayOne = [itemA = 'a', itemB = 'b', itemC = ['c']];
		arrayTwo = [itemD = 'd'];
	});

	describe('without using recursion', function () {
		var result;

		beforeEach(function () {
			result = array.flatten([arrayOne, arrayTwo], false);
		});

		it('the first item should be "a"', function () {
			expect(result[0]).toBe(itemA);
		});

		it('the second item should be "b"', function () {
			expect(result[1]).toBe(itemB);
		});

		it('the third item should be "c"', function () {
			expect(result[2]).toBe(itemC);
		});

		it('the forth item should be "d"', function () {
			expect(result[3]).toBe(itemD);
		});
	});

	describe('and using recursion', function () {
		var result;

		beforeEach(function () {
			result = array.flatten([arrayOne, arrayTwo], true);
		});

		it('the first item should be "a"', function () {
			expect(result[0]).toBe(itemA);
		});

		it('the second item should be "b"', function () {
			expect(result[1]).toBe(itemB);
		});

		it('the third item should be "c"', function () {
			expect(result[2]).toBe('c');
		});

		it('the forth item should be "d"', function () {
			expect(result[3]).toBe(itemD);
		});
	});
});

describe('when grouping an array', function () {
	'use strict';

	describe('and using objects containing the first three rows of pascals triangle', function () {
		var groups;

		beforeEach(function () {
			groups = array.groupBy([{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 2 }, { value: 1 }], function (item) {
				return item.value;
			});
		});

		it('should only contain 2 keys', function () {
			expect(Object.keys(groups).length).toEqual(2);
		});

		it('should have a key for number one', function () {
			expect(groups.hasOwnProperty(1)).toEqual(true);
		});

		it('should have five items grouped for the number one', function () {
			expect(groups[1].length).toEqual(5);
		});

		it('should an object with a value of one for each item grouped for the number one', function () {
			var group = groups[1];

			for (var i = 0; i < group.length; i++) {
				expect(group[i].value).toEqual(1);
			}
		});

		it('should have one item grouped for the number two', function () {
			expect(groups[2].length).toEqual(1);
		});

		it('should an object with a value of two for each item grouped for the number two', function () {
			var group = groups[2];

			for (var i = 0; i < group.length; i++) {
				expect(group[i].value).toEqual(2);
			}
		});
	});

	describe('when indexing an array', function () {
		describe('and using objects containing the first three prime numbers', function () {
			var groups;

			var one;
			var two;
			var three;

			beforeEach(function () {
				groups = array.indexBy([one = { value: 1 }, two = { value: 2 }, three = { value: 3 }], function (item) {
					return item.value;
				});
			});

			it('should contain 3 keys', function () {
				expect(Object.keys(groups).length).toEqual(3);
			});

			it('should have a key for number one', function () {
				expect(groups.hasOwnProperty(1)).toEqual(true);
			});

			it('should have a key for number two', function () {
				expect(groups.hasOwnProperty(2)).toEqual(true);
			});

			it('should have a key for number three', function () {
				expect(groups.hasOwnProperty(3)).toEqual(true);
			});

			it('should have the first object at key one', function () {
				expect(groups[1]).toBe(one);
			});

			it('should have the first object at key one', function () {
				expect(groups[2]).toBe(two);
			});

			it('should have the first object at key one', function () {
				expect(groups[3]).toBe(three);
			});
		});
	});
});

describe('when calculating the "difference" between two arrays', function () {
	describe('and the arrays are empty', function () {
		var difference;

		beforeEach(function () {
			difference = array.difference([], []);
		});

		it('should be an array', function () {
			expect(difference instanceof Array).toEqual(true);
		});

		it('should be empty', function () {
			expect(difference.length).toEqual(0);
		});
	});

	describe('and first array is [1,2] and the second array is [2,3]', function () {
		var difference;

		beforeEach(function () {
			difference = array.difference([1, 2], [2, 3]);
		});

		it('should be an array', function () {
			expect(difference instanceof Array).toEqual(true);
		});

		it('should contain one element', function () {
			expect(difference.length).toEqual(1);
		});

		it('the first element should be 1', function () {
			expect(difference[0]).toEqual(1);
		});
	});

	describe('and first array is [2,3] and the second array is [1,2]', function () {
		var difference;

		beforeEach(function () {
			difference = array.difference([2, 3], [1, 2]);
		});

		it('should be an array', function () {
			expect(difference instanceof Array).toEqual(true);
		});

		it('should contain one element', function () {
			expect(difference.length).toEqual(1);
		});

		it('the first element should be 3', function () {
			expect(difference[0]).toEqual(3);
		});
	});

	describe('and first array has a unique object and both arrays share an object', function () {
		var same;
		var unique;

		var difference;

		beforeEach(function () {
			same = {};

			difference = array.difference([same, unique = {}], [same]);
		});

		it('should be an array', function () {
			expect(difference instanceof Array).toEqual(true);
		});

		it('should contain one element', function () {
			expect(difference.length).toEqual(1);
		});

		it('the first element should be the unique object', function () {
			expect(difference[0]).toBe(unique);
		});
	});

	describe('and second array has a unique object and both arrays share an object', function () {
		var same;
		var unique;

		var difference;

		beforeEach(function () {
			same = {};

			difference = array.difference([same], [same, unique = {}]);
		});

		it('should be an array', function () {
			expect(difference instanceof Array).toEqual(true);
		});

		it('should contain zero elements', function () {
			expect(difference.length).toEqual(0);
		});
	});
});

describe('when calculating the "union" of two arrays', function () {
	describe('and the arrays are empty', function () {
		var union;

		beforeEach(function () {
			union = array.union([], []);
		});

		it('should be an array', function () {
			expect(union instanceof Array).toEqual(true);
		});

		it('should be empty', function () {
			expect(union.length).toEqual(0);
		});
	});

	describe('and first array is [1,2] and the second array is [2,3]', function () {
		var union;

		beforeEach(function () {
			union = array.union([1, 2], [2, 3]);
		});

		it('should be an array', function () {
			expect(union instanceof Array).toEqual(true);
		});

		it('should contain three elements', function () {
			expect(union.length).toEqual(3);
		});

		it('the first element should be 1', function () {
			expect(union[0]).toEqual(1);
		});

		it('the second element should be 2', function () {
			expect(union[1]).toEqual(2);
		});

		it('the third element should be 3', function () {
			expect(union[2]).toEqual(3);
		});
	});

	describe('and first array has a unique object and both arrays share an object', function () {
		var same;
		var unique;

		var difference;

		beforeEach(function () {
			same = {};

			difference = array.union([same, unique = {}], [same]);
		});

		it('should be an array', function () {
			expect(difference instanceof Array).toEqual(true);
		});

		it('should contain two elements', function () {
			expect(difference.length).toEqual(2);
		});

		it('the first element the should be "same" object', function () {
			expect(difference[0]).toBe(same);
		});

		it('the second element the should be "unique" object', function () {
			expect(difference[1]).toBe(unique);
		});
	});
});

describe('when calculating the "intersection" of two arrays', function () {
	describe('and the arrays are empty', function () {
		var intersection;

		beforeEach(function () {
			intersection = array.intersection([], []);
		});

		it('should be an array', function () {
			expect(intersection instanceof Array).toEqual(true);
		});

		it('should be empty', function () {
			expect(intersection.length).toEqual(0);
		});
	});

	describe('and first array is [1,2] and the second array is [2,3]', function () {
		var intersection;

		beforeEach(function () {
			intersection = array.intersection([1, 2], [2, 3]);
		});

		it('should be an array', function () {
			expect(intersection instanceof Array).toEqual(true);
		});

		it('should contain one element', function () {
			expect(intersection.length).toEqual(1);
		});

		it('the first element should be 2', function () {
			expect(intersection[0]).toEqual(2);
		});
	});

	describe('and first array has a unique object and both arrays share an object', function () {
		var same;
		var unique;

		var intersection;

		beforeEach(function () {
			same = {};

			intersection = array.intersection([same, unique = {}], [same]);
		});

		it('should be an array', function () {
			expect(intersection instanceof Array).toEqual(true);
		});

		it('should contain one elements', function () {
			expect(intersection.length).toEqual(1);
		});

		it('the first element the "same" object', function () {
			expect(intersection[0]).toBe(same);
		});
	});
});

describe('when calculating the "symmetric difference" of two arrays', function () {
	describe('and the arrays are empty', function () {
		var difference;

		beforeEach(function () {
			difference = array.differenceSymmetric([], []);
		});

		it('should be an array', function () {
			expect(difference instanceof Array).toEqual(true);
		});

		it('should be empty', function () {
			expect(difference.length).toEqual(0);
		});
	});

	describe('and first array is [1,2] and the second array is [2,3]', function () {
		var difference;

		beforeEach(function () {
			difference = array.differenceSymmetric([1, 2], [2, 3]);
		});

		it('should be an array', function () {
			expect(difference instanceof Array).toEqual(true);
		});

		it('should contain two elements', function () {
			expect(difference.length).toEqual(2);
		});

		it('the first element should be 1', function () {
			expect(difference[0]).toEqual(1);
		});

		it('the second element should be 3', function () {
			expect(difference[1]).toEqual(3);
		});
	});

	describe('and first array has a unique object and both arrays share an object', function () {
		var same;
		var unique;

		var difference;

		beforeEach(function () {
			same = {};

			difference = array.differenceSymmetric([same, unique = {}], [same]);
		});

		it('should be an array', function () {
			expect(difference instanceof Array).toEqual(true);
		});

		it('should contain one elements', function () {
			expect(difference.length).toEqual(1);
		});

		it('the first element the "unique" object', function () {
			expect(difference[0]).toBe(unique);
		});
	});
});

},{"./../../../lang/array":23}],87:[function(require,module,exports){
'use strict';

var attributes = require('./../../../lang/attributes');

describe('When "attributes.has" is used to check a top-level property', function () {
	'use strict';

	var target;

	beforeEach(function () {
		target = {
			test: 123
		};
	});

	describe("and the property exists", function () {
		it("should return true", function () {
			expect(attributes.has(target, "test")).toEqual(true);
		});
	});

	describe("and the property does not exist", function () {
		it("should return true", function () {
			expect(attributes.has(target, "name")).toEqual(false);
		});
	});
});

describe('When "attributes.has" is used to check a top-level property (with an array)', function () {
	'use strict';

	var target;

	beforeEach(function () {
		target = {
			test: 123
		};
	});

	describe("and the property exists", function () {
		it("should return true", function () {
			expect(attributes.has(target, ["test"])).toEqual(true);
		});
	});

	describe("and the property does not exist", function () {
		it("should return true", function () {
			expect(attributes.has(target, ["name"])).toEqual(false);
		});
	});
});

describe('When "attributes.has" is used to check a second-level property', function () {
	'use strict';

	var target;

	beforeEach(function () {
		target = {
			nested: {
				test: 123
			},
			a: undefined,
			b: null
		};
	});

	describe("and the property exists", function () {
		it("should return true", function () {
			expect(attributes.has(target, "nested.test")).toEqual(true);
		});
	});

	describe("and the property does not exist", function () {
		it("should return true", function () {
			expect(attributes.has(target, "nested.name")).toEqual(false);
		});
	});

	describe("and the top-level property does not exist", function () {
		it("should return true", function () {
			expect(attributes.has(target, "wrong.name")).toEqual(false);
		});
	});

	describe("and the top-level property exists, but is undefined", function () {
		it("should return true", function () {
			expect(attributes.has(target, "a.name")).toEqual(false);
		});
	});

	describe("and the top-level property exists, but is null", function () {
		it("should return true", function () {
			expect(attributes.has(target, "b.name")).toEqual(false);
		});
	});
});

describe('When "attributes.has" is used to check a second-level property (with an array)', function () {
	'use strict';

	var target;

	beforeEach(function () {
		target = {
			nested: {
				test: 123
			}
		};
	});

	describe("and the property exists", function () {
		it("should return true", function () {
			expect(attributes.has(target, ["nested", "test"])).toEqual(true);
		});
	});

	describe("and the property does not exist", function () {
		it("should return true", function () {
			expect(attributes.has(target, ["nested", "name"])).toEqual(false);
		});
	});

	describe("and the top-level property does not exist", function () {
		it("should return true", function () {
			expect(attributes.has(target, ["wrong", "name"])).toEqual(false);
		});
	});
});

describe('When "attributes.has" is called with an empty string', function () {
	'use strict';

	var target;

	beforeEach(function () {
		target = {
			test: 123
		};
	});

	it("should return false", function () {
		expect(attributes.has(target, "")).toEqual(false);
	});
});

describe('When "attributes.has" is called with a zero-length array', function () {
	'use strict';

	var target;

	beforeEach(function () {
		target = {
			test: 123
		};
	});

	it("should return false", function () {
		expect(attributes.has(target, [])).toEqual(false);
	});
});

describe('When "attributes.read" is used to get a top-level property', function () {
	'use strict';

	var target;

	beforeEach(function () {
		target = {
			nested: {
				test: 123
			}
		};
	});

	describe("and the property exists", function () {
		it("should return the property value", function () {
			expect(attributes.read(target, "nested.test")).toEqual(123);
		});
	});

	describe("and the property does not exist", function () {
		it("should be undefined", function () {
			expect(attributes.read(target, "nested.name")).toBe(undefined);
		});
	});
});

describe('When "attributes.read" is used to get a top-level property (with an array)', function () {
	'use strict';

	var target;

	beforeEach(function () {
		target = {
			nested: {
				test: 123
			}
		};
	});

	describe("and the property exists", function () {
		it("should return the property value", function () {
			expect(attributes.read(target, ["nested", "test"])).toEqual(123);
		});
	});

	describe("and the property does not exist", function () {
		it("should be undefined", function () {
			expect(attributes.read(target, ["nested", "name"])).toBe(undefined);
		});
	});
});

describe('When "attributes.read" is used to get a second-level property', function () {
	'use strict';

	var target;

	beforeEach(function () {
		target = {
			nested: {
				test: 123
			}
		};
	});

	describe("and the property exists", function () {
		it("should return the property value", function () {
			expect(attributes.read(target, "nested.test")).toEqual(123);
		});
	});

	describe("and the property does not exist", function () {
		it("should be undefined", function () {
			expect(attributes.read(target, "nested.name")).toBe(undefined);
		});
	});

	describe("and the top-level property does not exist", function () {
		it("should be undefined", function () {
			expect(attributes.read(target, "wrong.name")).toBe(undefined);
		});
	});
});

describe('When "attributes.read" is used to get a second-level property (with an array)', function () {
	'use strict';

	var target;

	beforeEach(function () {
		target = {
			nested: {
				test: 123
			}
		};
	});

	describe("and the property exists", function () {
		it("should return the property value", function () {
			expect(attributes.read(target, ["nested", "test"])).toEqual(123);
		});
	});

	describe("and the property does not exist", function () {
		it("should be undefined", function () {
			expect(attributes.read(target, ["nested", "name"])).toBe(undefined);
		});
	});

	describe("and the top-level property does not exist", function () {
		it("should be undefined", function () {
			expect(attributes.read(target, ["wrong", "name"])).toBe(undefined);
		});
	});
});

describe('When "attributes.read" is called with an empty string', function () {
	'use strict';

	var target;

	beforeEach(function () {
		target = {
			test: 123
		};
	});

	it("should return an undefined value", function () {
		expect(attributes.read(target, "")).toBe(undefined);
	});
});

describe('When "attributes.read" is called with a zero-length array', function () {
	'use strict';

	var target;

	beforeEach(function () {
		target = {
			test: 123
		};
	});

	it("should return an undefined value", function () {
		expect(attributes.read(target, [])).toBe(undefined);
	});
});

describe('When "attributes.write" is used to set a top-level property', function () {
	'use strict';

	var target;

	beforeEach(function () {
		target = {
			test: 123
		};
	});

	describe("and the property exists", function () {
		beforeEach(function () {
			attributes.write(target, "test", "four-five-six");
		});

		it("the property value should be overwritten", function () {
			expect(target.test).toEqual("four-five-six");
		});
	});

	describe("and the property does not exist", function () {
		beforeEach(function () {
			attributes.write(target, "name", "Alice");
		});

		it("the property value should be created and set", function () {
			expect(target.name).toEqual("Alice");
		});
	});
});

describe('When "attributes.write" is used to set a top-level property (with an array)', function () {
	'use strict';

	var target;

	beforeEach(function () {
		target = {
			test: 123
		};
	});

	describe("and the property exists", function () {
		beforeEach(function () {
			attributes.write(target, ["test"], "four-five-six");
		});

		it("the property value should be overwritten", function () {
			expect(target.test).toEqual("four-five-six");
		});
	});

	describe("and the property does not exist", function () {
		beforeEach(function () {
			attributes.write(target, ["name"], "Alice");
		});

		it("the property value should be created and set", function () {
			expect(target.name).toEqual("Alice");
		});
	});
});

describe('When "attributes.write" is used to set a second-level property', function () {
	'use strict';

	var target;

	beforeEach(function () {
		target = {
			nested: {
				test: 123
			}
		};
	});

	describe("and the property exists", function () {
		beforeEach(function () {
			attributes.write(target, "nested.test", "four-five-six");
		});

		it("the property value should be overwritten", function () {
			expect(target.nested.test).toEqual("four-five-six");
		});
	});

	describe("and the second-level property does not exist", function () {
		beforeEach(function () {
			attributes.write(target, "nested.name", "Alice");
		});

		it("the property value should be created and set", function () {
			expect(target.nested.name).toEqual("Alice");
		});
	});

	describe("and the top-level property does not exist", function () {
		beforeEach(function () {
			attributes.write(target, "x.y", "z");
		});

		it("the top-level and second properties value should be created and set", function () {
			expect(target.x.y).toEqual("z");
		});
	});
});

describe('When "attributes.write" is used to set a second-level property (using an array)', function () {
	'use strict';

	var target;

	beforeEach(function () {
		target = {
			nested: {
				test: 123
			}
		};
	});

	describe("and the property exists", function () {
		beforeEach(function () {
			attributes.write(target, ["nested", "test"], "four-five-six");
		});

		it("the property value should be overwritten", function () {
			expect(target.nested.test).toEqual("four-five-six");
		});
	});

	describe("and the second-level property does not exist", function () {
		beforeEach(function () {
			attributes.write(target, ["nested", "name"], "Alice");
		});

		it("the property value should be created and set", function () {
			expect(target.nested.name).toEqual("Alice");
		});
	});

	describe("and the top-level property does not exist", function () {
		beforeEach(function () {
			attributes.write(target, ["x", "y"], "z");
		});

		it("the top-level and second properties value should be created and set", function () {
			expect(target.x.y).toEqual("z");
		});
	});
});

describe('When "attributes.erase" is used to remove a top-level property', function () {
	'use strict';

	var target;

	beforeEach(function () {
		target = {
			test: 123
		};
	});

	describe("and the property exists", function () {
		beforeEach(function () {
			attributes.erase(target, "test");
		});

		it("the property value not exist", function () {
			expect(target.hasOwnProperty("test")).toEqual(false);
		});
	});

	describe("and the property does not exist", function () {
		beforeEach(function () {
			attributes.erase(target, "name");
		});

		it("the target should be unaffected", function () {
			expect(target.hasOwnProperty("test")).toEqual(true);
		});
	});
});

describe('When "attributes.erase" is used to remove a top-level property (using an array)', function () {
	'use strict';

	var target;

	beforeEach(function () {
		target = {
			test: 123
		};
	});

	describe("and the property exists", function () {
		beforeEach(function () {
			attributes.erase(target, ["test"]);
		});

		it("the property value not exist", function () {
			expect(target.hasOwnProperty("test")).toEqual(false);
		});
	});

	describe("and the property does not exist", function () {
		beforeEach(function () {
			attributes.erase(target, ["name"]);
		});

		it("the target should be unaffected", function () {
			expect(target.hasOwnProperty("test")).toEqual(true);
		});
	});
});

describe('When "attributes.erase" is used to remove a second-level property', function () {
	'use strict';

	var target;

	beforeEach(function () {
		target = {
			nested: {
				test: 123
			}
		};
	});

	describe("and the property exists", function () {
		beforeEach(function () {
			attributes.erase(target, "nested.test");
		});

		it("the property value not exist", function () {
			expect(target.hasOwnProperty("nested")).toEqual(true);
			expect(target.nested.hasOwnProperty("test")).toEqual(false);
		});
	});

	describe("and the second-level property does not exist", function () {
		beforeEach(function () {
			attributes.erase(target, "nested.name");
		});

		it("the target should be unaffected", function () {
			expect(target.hasOwnProperty("nested")).toEqual(true);
			expect(target.nested.hasOwnProperty("test")).toEqual(true);
		});
	});

	describe("and the top-level property does not exist", function () {
		beforeEach(function () {
			attributes.erase(target, "x.y");
		});

		it("the target should be unaffected", function () {
			expect(target.hasOwnProperty("nested")).toEqual(true);
			expect(target.nested.hasOwnProperty("test")).toEqual(true);
		});
	});
});

describe('When "attributes.erase" is used to remove a second-level property (using an array)', function () {
	'use strict';

	var target;

	beforeEach(function () {
		target = {
			nested: {
				test: 123
			}
		};
	});

	describe("and the property exists", function () {
		beforeEach(function () {
			attributes.erase(target, ["nested", "test"]);
		});

		it("the property value not exist", function () {
			expect(target.hasOwnProperty("nested")).toEqual(true);
			expect(target.nested.hasOwnProperty("test")).toEqual(false);
		});
	});

	describe("and the second-level property does not exist", function () {
		beforeEach(function () {
			attributes.erase(target, ["nested", "name"]);
		});

		it("the target should be unaffected", function () {
			expect(target.hasOwnProperty("nested")).toEqual(true);
			expect(target.nested.hasOwnProperty("test")).toEqual(true);
		});
	});

	describe("and the top-level property does not exist", function () {
		beforeEach(function () {
			attributes.erase(target, ["x", "y"]);
		});

		it("the target should be unaffected", function () {
			expect(target.hasOwnProperty("nested")).toEqual(true);
			expect(target.nested.hasOwnProperty("test")).toEqual(true);
		});
	});
});

describe('When "attributes.read" is used with a null separator', function () {
	'use strict';

	var target;

	beforeEach(function () {
		target = {
			'some.key': 1
		};
	});

	describe("and the property exists", function () {
		it("should return the property value", function () {
			expect(attributes.read(target, 'some.key', null)).toEqual(1);
		});
	});

	describe("and the property does not exist", function () {
		it("should be undefined", function () {
			expect(attributes.read(target, 'another.key', null)).toEqual(undefined);
		});
	});
});

describe('When "attributes.read" is used with a non-default separator', function () {
	'use strict';

	var target;

	beforeEach(function () {
		target = {
			nested: {
				test: 1
			}
		};
	});

	describe("and the property exists", function () {
		it("should return the property value", function () {
			expect(attributes.read(target, 'nested|test', '|')).toEqual(1);
		});
	});

	describe("and the property does not exist", function () {
		it("should be undefined", function () {
			expect(attributes.read(target, 'another|key', '|')).toEqual(undefined);
		});
	});
});

},{"./../../../lang/attributes":25}],88:[function(require,module,exports){
'use strict';

var connection = require('./../../../lang/connection');

describe('When "getIsSecure is invoked', function () {
	'use strict';

	it('should return true, if passed true', function () {
		expect(connection.getIsSecure(true)).toEqual(true);
	});

	it('should return false, if passed false', function () {
		expect(connection.getIsSecure(false)).toEqual(false);
	});

	it('should return false, if passed undefined', function () {
		expect(connection.getIsSecure(undefined)).toEqual(false);
	});

	it('should return false, if passed null', function () {
		expect(connection.getIsSecure(undefined)).toEqual(false);
	});
});

},{"./../../../lang/connection":26}],89:[function(require,module,exports){
'use strict';

var dateUtilities = require('./../../../lang/date');

describe('When extracting the "short" day of week', function () {
	'use strict';

	var july = 7 - 1;

	it("07/27/2016 should resove to 'Wed'", function () {
		expect(dateUtilities.getShortDay(new Date(2016, july, 27))).toEqual('Wed');
	});
});

},{"./../../../lang/date":27}],90:[function(require,module,exports){
'use strict';

var functions = require('./../../../lang/functions');

describe('when using the tautology function', function () {
	'use strict';

	var tautology;

	beforeEach(function () {
		tautology = functions.getTautology();
	});

	it('if null is passed, null should be returned', function () {
		expect(tautology(null)).toEqual(null);
	});

	it('if undefined is passed, undefined should be returned', function () {
		expect(tautology(undefined)).toEqual(undefined);
	});

	it('if Math.PI is passed, Math.PI should be returned', function () {
		expect(tautology(Math.PI)).toEqual(Math.PI);
	});

	it('if an object is passed, the object should be returned', function () {
		var x;

		expect(tautology(x = {})).toBe(x);
	});
});

},{"./../../../lang/functions":28}],91:[function(require,module,exports){
'use strict';

var is = require('./../../../lang/is');

describe('When checking the number 3', function () {
	'use strict';

	var candidate;

	beforeEach(function () {
		candidate = 3;
	});

	it("it should be a number", function () {
		expect(is.number(candidate)).toEqual(true);
	});

	it("it should not be nan", function () {
		expect(is.nan(candidate)).toEqual(false);
	});

	it("it should be an integer", function () {
		expect(is.integer(candidate)).toEqual(true);
	});

	it("it should be an large integer", function () {
		expect(is.large(candidate)).toEqual(true);
	});

	it("it should be positive", function () {
		expect(is.positive(candidate)).toEqual(true);
	});

	it("it should not be negative", function () {
		expect(is.negative(candidate)).toEqual(false);
	});

	it("it should not be a string", function () {
		expect(is.string(candidate)).toEqual(false);
	});

	it("it should not be a Date", function () {
		expect(is.date(candidate)).toEqual(false);
	});

	it("it should not be a function", function () {
		expect(is.fn(candidate)).toEqual(false);
	});

	it("it should not be an array", function () {
		expect(is.array(candidate)).toEqual(false);
	});

	it("it should not be a boolean", function () {
		expect(is.boolean(candidate)).toEqual(false);
	});

	it("it should not be an object", function () {
		expect(is.object(candidate)).toEqual(false);
	});

	it("it should not be null", function () {
		expect(is.null(candidate)).toEqual(false);
	});

	it("it should not be undefined", function () {
		expect(is.undefined(candidate)).toEqual(false);
	});
});

describe('When checking the Math.PI', function () {
	'use strict';

	var candidate;

	beforeEach(function () {
		candidate = Math.PI;
	});

	it("it should be a number", function () {
		expect(is.number(candidate)).toEqual(true);
	});

	it("it should not be nan", function () {
		expect(is.nan(candidate)).toEqual(false);
	});

	it("it should not be an integer", function () {
		expect(is.integer(candidate)).toEqual(false);
	});

	it("it should not be an large integer", function () {
		expect(is.large(candidate)).toEqual(false);
	});

	it("it should be positive", function () {
		expect(is.positive(candidate)).toEqual(true);
	});

	it("it should not be negative", function () {
		expect(is.negative(candidate)).toEqual(false);
	});

	it("it should not be a string", function () {
		expect(is.string(candidate)).toEqual(false);
	});

	it("it should not be a Date", function () {
		expect(is.date(candidate)).toEqual(false);
	});

	it("it should not be a function", function () {
		expect(is.fn(candidate)).toEqual(false);
	});

	it("it should not be an array", function () {
		expect(is.array(candidate)).toEqual(false);
	});

	it("it should not be a boolean", function () {
		expect(is.boolean(candidate)).toEqual(false);
	});

	it("it should not be an object", function () {
		expect(is.object(candidate)).toEqual(false);
	});

	it("it should not be null", function () {
		expect(is.null(candidate)).toEqual(false);
	});

	it("it should not be undefined", function () {
		expect(is.undefined(candidate)).toEqual(false);
	});
});

describe('When checking the Number.NaN', function () {
	'use strict';

	var candidate;

	beforeEach(function () {
		candidate = Number.NaN;
	});

	it("it should not be a number", function () {
		expect(is.number(candidate)).toEqual(false);
	});

	it("it should be nan", function () {
		expect(is.nan(candidate)).toEqual(true);
	});

	it("it should not be an integer", function () {
		expect(is.integer(candidate)).toEqual(false);
	});

	it("it should not be an large integer", function () {
		expect(is.large(candidate)).toEqual(false);
	});

	it("it should not be positive", function () {
		expect(is.positive(candidate)).toEqual(false);
	});

	it("it should not be negative", function () {
		expect(is.negative(candidate)).toEqual(false);
	});

	it("it should not be a string", function () {
		expect(is.string(candidate)).toEqual(false);
	});

	it("it should not be a Date", function () {
		expect(is.date(candidate)).toEqual(false);
	});

	it("it should not be a function", function () {
		expect(is.fn(candidate)).toEqual(false);
	});

	it("it should not be an array", function () {
		expect(is.array(candidate)).toEqual(false);
	});

	it("it should not be a boolean", function () {
		expect(is.boolean(candidate)).toEqual(false);
	});

	it("it should not be an object", function () {
		expect(is.object(candidate)).toEqual(false);
	});

	it("it should not be null", function () {
		expect(is.null(candidate)).toEqual(false);
	});

	it("it should not be undefined", function () {
		expect(is.undefined(candidate)).toEqual(false);
	});
});

describe('When checking the string "3"', function () {
	'use strict';

	var candidate;

	beforeEach(function () {
		candidate = "3";
	});

	it("it should not be a number", function () {
		expect(is.number(candidate)).toEqual(false);
	});

	it("it should not be nan", function () {
		expect(is.nan(candidate)).toEqual(false);
	});

	it("it should not be an integer", function () {
		expect(is.integer(candidate)).toEqual(false);
	});

	it("it should not be an large integer", function () {
		expect(is.large(candidate)).toEqual(false);
	});

	it("it should not be positive", function () {
		expect(is.positive(candidate)).toEqual(false);
	});

	it("it should not be negative", function () {
		expect(is.negative(candidate)).toEqual(false);
	});

	it("it should be a string", function () {
		expect(is.string(candidate)).toEqual(true);
	});

	it("it should not be a Date", function () {
		expect(is.date(candidate)).toEqual(false);
	});

	it("it should not be a function", function () {
		expect(is.fn(candidate)).toEqual(false);
	});

	it("it should not be an array", function () {
		expect(is.array(candidate)).toEqual(false);
	});

	it("it should not be a boolean", function () {
		expect(is.boolean(candidate)).toEqual(false);
	});

	it("it should not be an object", function () {
		expect(is.object(candidate)).toEqual(false);
	});

	it("it should not be null", function () {
		expect(is.null(candidate)).toEqual(false);
	});

	it("it should not be undefined", function () {
		expect(is.undefined(candidate)).toEqual(false);
	});
});

describe('When checking the date 08/29/2016', function () {
	'use strict';

	var candidate;

	beforeEach(function () {
		candidate = new Date(2016, 7, 29);
	});

	it("it should not be a number", function () {
		expect(is.number(candidate)).toEqual(false);
	});

	it("it should not be nan", function () {
		expect(is.nan(candidate)).toEqual(false);
	});

	it("it should not be an integer", function () {
		expect(is.integer(candidate)).toEqual(false);
	});

	it("it should not be an large integer", function () {
		expect(is.large(candidate)).toEqual(false);
	});

	it("it should not be positive", function () {
		expect(is.positive(candidate)).toEqual(false);
	});

	it("it should not be negative", function () {
		expect(is.negative(candidate)).toEqual(false);
	});

	it("it should not be a string", function () {
		expect(is.string(candidate)).toEqual(false);
	});

	it("it should be a Date", function () {
		expect(is.date(candidate)).toEqual(true);
	});

	it("it should be an object", function () {
		expect(is.object(candidate)).toEqual(true);
	});

	it("it should not be a function", function () {
		expect(is.fn(candidate)).toEqual(false);
	});

	it("it should not be an array", function () {
		expect(is.array(candidate)).toEqual(false);
	});

	it("it should not be a boolean", function () {
		expect(is.boolean(candidate)).toEqual(false);
	});

	it("it should not be null", function () {
		expect(is.null(candidate)).toEqual(false);
	});

	it("it should not be undefined", function () {
		expect(is.undefined(candidate)).toEqual(false);
	});
});

describe('When checking the "expect" function', function () {
	'use strict';

	var candidate;

	beforeEach(function () {
		candidate = expect;
	});

	it("it should not be a number", function () {
		expect(is.number(candidate)).toEqual(false);
	});

	it("it should not be nan", function () {
		expect(is.nan(candidate)).toEqual(false);
	});

	it("it should not be an integer", function () {
		expect(is.integer(candidate)).toEqual(false);
	});

	it("it should not be an large integer", function () {
		expect(is.large(candidate)).toEqual(false);
	});

	it("it should not be positive", function () {
		expect(is.positive(candidate)).toEqual(false);
	});

	it("it should not be negative", function () {
		expect(is.negative(candidate)).toEqual(false);
	});

	it("it should not be a string", function () {
		expect(is.string(candidate)).toEqual(false);
	});

	it("it should not be a Date", function () {
		expect(is.date(candidate)).toEqual(false);
	});

	it("it should be a function", function () {
		expect(is.fn(candidate)).toEqual(true);
	});

	it("it should not be an array", function () {
		expect(is.array(candidate)).toEqual(false);
	});

	it("it should not be a boolean", function () {
		expect(is.boolean(candidate)).toEqual(false);
	});

	it("it should not be an object", function () {
		expect(is.object(candidate)).toEqual(false);
	});

	it("it should not be null", function () {
		expect(is.null(candidate)).toEqual(false);
	});

	it("it should not be undefined", function () {
		expect(is.undefined(candidate)).toEqual(false);
	});
});

describe('When checking an empty object', function () {
	'use strict';

	var candidate;

	beforeEach(function () {
		candidate = {};
	});

	it("it should not be a number", function () {
		expect(is.number(candidate)).toEqual(false);
	});

	it("it should not be nan", function () {
		expect(is.nan(candidate)).toEqual(false);
	});

	it("it should not be an integer", function () {
		expect(is.integer(candidate)).toEqual(false);
	});

	it("it should not be an large integer", function () {
		expect(is.large(candidate)).toEqual(false);
	});

	it("it should not be positive", function () {
		expect(is.positive(candidate)).toEqual(false);
	});

	it("it should not be negative", function () {
		expect(is.negative(candidate)).toEqual(false);
	});

	it("it should not be a string", function () {
		expect(is.string(candidate)).toEqual(false);
	});

	it("it should not be a Date", function () {
		expect(is.date(candidate)).toEqual(false);
	});

	it("it should not be a function", function () {
		expect(is.fn(candidate)).toEqual(false);
	});

	it("it should not be an array", function () {
		expect(is.array(candidate)).toEqual(false);
	});

	it("it should not be a boolean", function () {
		expect(is.boolean(candidate)).toEqual(false);
	});

	it("it should be an object", function () {
		expect(is.object(candidate)).toEqual(true);
	});

	it("it should not be null", function () {
		expect(is.null(candidate)).toEqual(false);
	});

	it("it should not be undefined", function () {
		expect(is.undefined(candidate)).toEqual(false);
	});
});

describe('When checking a null value', function () {
	'use strict';

	var candidate;

	beforeEach(function () {
		candidate = null;
	});

	it("it should not be a number", function () {
		expect(is.number(candidate)).toEqual(false);
	});

	it("it should not be nan", function () {
		expect(is.nan(candidate)).toEqual(false);
	});

	it("it should not be an integer", function () {
		expect(is.integer(candidate)).toEqual(false);
	});

	it("it should not be an large integer", function () {
		expect(is.large(candidate)).toEqual(false);
	});

	it("it should not be positive", function () {
		expect(is.positive(candidate)).toEqual(false);
	});

	it("it should not be negative", function () {
		expect(is.negative(candidate)).toEqual(false);
	});

	it("it should not be a string", function () {
		expect(is.string(candidate)).toEqual(false);
	});

	it("it should not be a Date", function () {
		expect(is.date(candidate)).toEqual(false);
	});

	it("it should not be a function", function () {
		expect(is.fn(candidate)).toEqual(false);
	});

	it("it should not be an array", function () {
		expect(is.array(candidate)).toEqual(false);
	});

	it("it should not be a boolean", function () {
		expect(is.boolean(candidate)).toEqual(false);
	});

	it("it should not be an object", function () {
		expect(is.object(candidate)).toEqual(false);
	});

	it("it should be null", function () {
		expect(is.null(candidate)).toEqual(true);
	});

	it("it should not be undefined", function () {
		expect(is.undefined(candidate)).toEqual(false);
	});
});

describe('When checking an undefined value', function () {
	'use strict';

	var candidate;

	beforeEach(function () {
		candidate = undefined;
	});

	it("it should not be a number", function () {
		expect(is.number(candidate)).toEqual(false);
	});

	it("it should not be nan", function () {
		expect(is.nan(candidate)).toEqual(false);
	});

	it("it should not be an integer", function () {
		expect(is.integer(candidate)).toEqual(false);
	});

	it("it should not be an large integer", function () {
		expect(is.large(candidate)).toEqual(false);
	});

	it("it should not be positive", function () {
		expect(is.positive(candidate)).toEqual(false);
	});

	it("it should not be negative", function () {
		expect(is.negative(candidate)).toEqual(false);
	});

	it("it should not be a string", function () {
		expect(is.string(candidate)).toEqual(false);
	});

	it("it should not be a Date", function () {
		expect(is.date(candidate)).toEqual(false);
	});

	it("it should not be a function", function () {
		expect(is.fn(candidate)).toEqual(false);
	});

	it("it should not be an array", function () {
		expect(is.array(candidate)).toEqual(false);
	});

	it("it should not be a boolean", function () {
		expect(is.boolean(candidate)).toEqual(false);
	});

	it("it should not be an object", function () {
		expect(is.object(candidate)).toEqual(false);
	});

	it("it should not be null", function () {
		expect(is.null(candidate)).toEqual(false);
	});

	it("it should be undefined", function () {
		expect(is.undefined(candidate)).toEqual(true);
	});
});

describe('When checking a large integer (exceeding 32-bits)', function () {
	'use strict';

	var candidate;

	beforeEach(function () {
		candidate = 1502373984424;
	});

	it("it should be a number", function () {
		expect(is.number(candidate)).toEqual(true);
	});

	it("it should not be nan", function () {
		expect(is.nan(candidate)).toEqual(false);
	});

	it("it should be an integer", function () {
		expect(is.integer(candidate)).toEqual(false);
	});

	it("it should be an large integer", function () {
		expect(is.large(candidate)).toEqual(true);
	});

	it("it should be positive", function () {
		expect(is.positive(candidate)).toEqual(true);
	});

	it("it should not be negative", function () {
		expect(is.negative(candidate)).toEqual(false);
	});

	it("it should not be a string", function () {
		expect(is.string(candidate)).toEqual(false);
	});

	it("it should not be a Date", function () {
		expect(is.date(candidate)).toEqual(false);
	});

	it("it should not be a function", function () {
		expect(is.fn(candidate)).toEqual(false);
	});

	it("it should not be an array", function () {
		expect(is.array(candidate)).toEqual(false);
	});

	it("it should not be a boolean", function () {
		expect(is.boolean(candidate)).toEqual(false);
	});

	it("it should not be an object", function () {
		expect(is.object(candidate)).toEqual(false);
	});

	it("it should not be null", function () {
		expect(is.null(candidate)).toEqual(false);
	});

	it("it should not be undefined", function () {
		expect(is.undefined(candidate)).toEqual(false);
	});
});

},{"./../../../lang/is":29}],92:[function(require,module,exports){
'use strict';

var mask = require('./../../../lang/mask');

describe('When testing the suitibility of an bit-based enumeration item', function () {
	it('zero should be valid', function () {
		expect(mask.checkItem(0)).toEqual(true);
	});

	it('one should be valid', function () {
		expect(mask.checkItem(1)).toEqual(true);
	});

	it('two should be valid', function () {
		expect(mask.checkItem(2)).toEqual(true);
	});

	it('three should not be valid', function () {
		expect(mask.checkItem(3)).toEqual(false);
	});

	it('four should be valid', function () {
		expect(mask.checkItem(4)).toEqual(true);
	});

	it('five should not be valid', function () {
		expect(mask.checkItem(5)).toEqual(false);
	});

	it('4095 should not be valid', function () {
		expect(mask.checkItem(4095)).toEqual(false);
	});

	it('4096 should be valid', function () {
		expect(mask.checkItem(4096)).toEqual(true);
	});

	it('4097 should not be valid', function () {
		expect(mask.checkItem(4097)).toEqual(false);
	});
});

describe('When working with an empty flags collection', function () {
	'use strict';

	var FLAG_ONE = 1;
	var FLAG_TWO = 16;
	var FLAG_THREE = 512;

	var flags;

	beforeEach(function () {
		flags = mask.getEmpty();
	});

	it('should not contain flag one', function () {
		expect(mask.has(flags, FLAG_ONE)).toEqual(false);
	});

	it('should not contain flag two', function () {
		expect(mask.has(flags, FLAG_TWO)).toEqual(false);
	});

	it('should not contain flag three', function () {
		expect(mask.has(flags, FLAG_THREE)).toEqual(false);
	});

	describe('and adding the first flag', function () {
		var updated;

		beforeEach(function () {
			updated = mask.add(flags, FLAG_ONE);
		});

		it('should contain flag one', function () {
			expect(mask.has(updated, FLAG_ONE)).toEqual(true);
		});

		it('should not contain flag two', function () {
			expect(mask.has(updated, FLAG_TWO)).toEqual(false);
		});

		it('should not contain flag three', function () {
			expect(mask.has(updated, FLAG_THREE)).toEqual(false);
		});

		describe('and adding the third flag', function () {
			var again;

			beforeEach(function () {
				again = mask.add(updated, FLAG_THREE);
			});

			it('should contain flag one', function () {
				expect(mask.has(again, FLAG_ONE)).toEqual(true);
			});

			it('should not contain flag two', function () {
				expect(mask.has(again, FLAG_TWO)).toEqual(false);
			});

			it('should contain flag three', function () {
				expect(mask.has(again, FLAG_THREE)).toEqual(true);
			});
		});

		describe('and removing the first flag', function () {
			var again;

			beforeEach(function () {
				again = mask.remove(updated, FLAG_ONE);
			});

			it('should be empty', function () {
				expect(again).toEqual(mask.getEmpty());
			});

			it('should not contain flag one', function () {
				expect(mask.has(again, FLAG_ONE)).toEqual(false);
			});

			it('should not contain flag two', function () {
				expect(mask.has(again, FLAG_TWO)).toEqual(false);
			});

			it('should not contain flag three', function () {
				expect(mask.has(again, FLAG_THREE)).toEqual(false);
			});
		});

		describe('and adding the first flag again', function () {
			var again;

			beforeEach(function () {
				again = mask.add(updated, FLAG_ONE);
			});

			it('should be unchanged', function () {
				expect(again).toEqual(updated);
			});

			it('should contain flag one', function () {
				expect(mask.has(again, FLAG_ONE)).toEqual(true);
			});

			it('should not contain flag two', function () {
				expect(mask.has(again, FLAG_TWO)).toEqual(false);
			});

			it('should not contain flag three', function () {
				expect(mask.has(again, FLAG_THREE)).toEqual(false);
			});
		});
	});
});

},{"./../../../lang/mask":30}],93:[function(require,module,exports){
'use strict';

var math = require('./../../../lang/math');

describe('When using math.approximate', function () {
	'use strict';

	describe("and comparing identical integers", function () {
		it("should return true", function () {
			expect(math.approximate(12, 12)).toEqual(true);
		});
	});

	describe("and comparing identical decimals literals", function () {
		it("should return true", function () {
			expect(math.approximate(0.3, 0.3)).toEqual(true);
		});
	});

	describe("and comparing identical derived decimals derived with addition", function () {
		it("should return true", function () {
			expect(math.approximate(0.1 + 0.2, 0.3)).toEqual(true);
		});
	});

	describe("and comparing identical derived decimals derived with division and multiplication", function () {
		it("should return true", function () {
			expect(math.approximate(100.33 / 3 * 3, 100.33)).toEqual(true);
		});
	});

	describe("and comparing an integer with undefined", function () {
		it("should return false", function () {
			expect(math.approximate(123, undefined)).toEqual(false);
		});
	});

	describe("and comparing a decimal with undefined", function () {
		it("should return false", function () {
			expect(math.approximate(123.45, undefined)).toEqual(false);
		});
	});

	describe("and comparing an integer with null", function () {
		it("should return false", function () {
			expect(math.approximate(123, null)).toEqual(false);
		});
	});

	describe("and comparing a decimal with null", function () {
		it("should return false", function () {
			expect(math.approximate(123.45, null)).toEqual(false);
		});
	});

	describe("and comparing strings", function () {
		it("should return false", function () {
			expect(math.approximate('hi', 'there')).toEqual(false);
		});
	});
});

},{"./../../../lang/math":31}],94:[function(require,module,exports){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
	return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
	return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

var memoize = require('./../../../lang/memoize');

describe('When using memoize.simple', function () {
	'use strict';

	describe("on a function that takes a tenth of second to complete", function () {
		var spy;
		var memo;

		var counter;

		beforeEach(function () {
			counter = 0;

			spy = jasmine.createSpy('spy').and.callFake(function (x) {
				counter = counter + 1;

				return counter;
			});

			memo = memoize.simple(spy);
		});

		it('the memoized function should not have been called', function () {
			expect(spy).not.toHaveBeenCalled();
		});

		describe("and the memoized function is called", function () {
			var paramOne;
			var resultOne;

			beforeEach(function () {
				resultOne = memo(paramOne = 'a');
			});

			it('the memoized function to have been called', function () {
				expect(spy.calls.count()).toEqual(1);
			});

			it('the memoized function to have been called with the correct parameters', function () {
				expect(spy).toHaveBeenCalledWith(paramOne);
			});

			it('the result should be a number', function () {
				expect(typeof resultOne === 'undefined' ? 'undefined' : _typeof(resultOne)).toEqual('number');
			});

			describe("and the memoized function is with the same value again", function () {
				var resultTwo;

				beforeEach(function () {
					resultTwo = memo(paramOne);
				});

				it('the memoized function not to have been called again', function () {
					expect(spy.calls.count()).toEqual(1);
				});

				it('the memoized function should have returned the cached value', function () {
					expect(resultTwo).toEqual(resultOne);
				});
			});

			describe("and the memoized function is called with another value", function () {
				var paramTwo;
				var resultTwo;

				beforeEach(function () {
					resultTwo = memo(paramTwo = 'b');
				});

				it('the memoized function to have been called', function () {
					expect(spy.calls.count()).toEqual(2);
				});

				it('the memoized function to have been called with the correct parameters', function () {
					expect(spy).toHaveBeenCalledWith(paramTwo);
				});

				it('the result should be a number', function () {
					expect(typeof resultTwo === 'undefined' ? 'undefined' : _typeof(resultTwo)).toEqual('number');
				});
			});
		});
	});
});

},{"./../../../lang/memoize":32}],95:[function(require,module,exports){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
	return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
	return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

var object = require('./../../../lang/object');

describe('When cloning an object', function () {
	'use strict';

	var target;
	var clone;

	describe('that is empty', function () {
		beforeEach(function () {
			clone = object.clone(target = {});
		});

		it('the clone should be an object', function () {
			expect(typeof clone === 'undefined' ? 'undefined' : _typeof(clone)).toEqual('object');
		});

		it('the clone should not reference the source object', function () {
			expect(clone).not.toBe(target);
		});
	});

	describe('that has a string-based property', function () {
		beforeEach(function () {
			clone = object.clone(target = { property: 'hi' });
		});

		it('the property value should equal the source property value', function () {
			expect(clone.property).toEqual(target.property);
		});
	});

	describe('that has a number-based property', function () {
		beforeEach(function () {
			clone = object.clone(target = { property: 23 });
		});

		it('the property value should equal the source property value', function () {
			expect(clone.property).toEqual(target.property);
		});
	});

	describe('that has an object-based property', function () {
		beforeEach(function () {
			clone = object.clone(target = { property: {} });
		});

		it('the clone should be an object', function () {
			expect(_typeof(clone.property)).toEqual('object');
		});

		it('the property value should not be a reference to the property value on the source object', function () {
			expect(clone.property).not.toBe(target.property);
		});
	});

	describe('that has an array-based property', function () {
		beforeEach(function () {
			clone = object.clone(target = { property: [] });
		});

		it('the clone should be an object', function () {
			expect(_typeof(clone.property)).toEqual('object');
		});

		it('the property value should not be a reference to the property value on the source object', function () {
			expect(clone.property).not.toBe(target.property);
		});
	});
});

describe('When merging objects', function () {
	var a;
	var b;

	var merged;

	describe('that are flat', function () {
		beforeEach(function () {
			merged = object.merge(a = { a: 1, b: 0 }, b = { b: 2, z: 26 });
		});

		it('should not provide a reference to the first source', function () {
			expect(merged).not.toBe(a);
		});

		it('should not provide a reference to the second source', function () {
			expect(merged).not.toBe(b);
		});

		it('should take exclusive properties from the first source', function () {
			expect(merged.a).toEqual(a.a);
		});

		it('should take exclusive properties from the second source', function () {
			expect(merged.z).toEqual(b.z);
		});

		it('should take shared properties from the second source', function () {
			expect(merged.b).toEqual(b.b);
		});
	});

	describe('that have nesting', function () {
		beforeEach(function () {
			merged = object.merge(a = { a: { a: 1, b: 0 } }, b = { a: { b: 2, z: 26 } });
		});

		it('should not provide a reference to the (nested) first source', function () {
			expect(merged.a).not.toBe(a.a);
		});

		it('should not provide a reference to the (nested) second source', function () {
			expect(merged.a).not.toBe(b.a);
		});

		it('should take exclusive properties from the (nested) first source', function () {
			expect(merged.a.a).toEqual(a.a.a);
		});

		it('should take exclusive properties from the (nested) second source', function () {
			expect(merged.a.z).toEqual(b.a.z);
		});

		it('should take shared properties from the (nested) second source', function () {
			expect(merged.a.b).toEqual(b.a.b);
		});
	});
});

describe('When when extracting keys', function () {
	describe('from an object that has "a" and "b" properties', function () {
		var keys;

		beforeEach(function () {
			keys = object.keys({ a: 1, b: 1 });
		});

		it('should have with two items', function () {
			expect(keys.length).toEqual(2);
		});

		it('should contain an "a" value', function () {
			expect(keys[0] === 'a' || keys[1] === 'a').toEqual(true);
		});

		it('should contain a "b" value', function () {
			expect(keys[0] === 'b' || keys[1] === 'b').toEqual(true);
		});

		it('should not contain a "toString" value', function () {
			expect(keys[0] === 'toString' || keys[1] === 'toString').toEqual(false);
		});
	});
});

describe('When running a deep comparison', function () {
	describe('against two matching strings', function () {
		it('the result should be true', function () {
			expect(object.equals('abc', 'abc')).toEqual(true);
		});
	});

	describe('against two different strings', function () {
		it('the result should be true', function () {
			expect(object.equals('abc', 'xyz')).toEqual(false);
		});
	});

	describe('against an array containing the same strings', function () {
		it('the result should be false', function () {
			expect(object.equals(['a', 'b'], ['a', 'b'])).toEqual(true);
		});
	});

	describe('against an array of different sizes', function () {
		it('the result should be false', function () {
			expect(object.equals(['a', 'b'], ['a', 'b', 'c'])).toEqual(false);
		});
	});

	describe('against objects where one object has an extra property', function () {
		it('the result should be false', function () {
			expect(object.equals({ first: 'bryan' }, { first: 'bryan', last: 'ingle' })).toEqual(false);
		});
	});

	describe('against an complex object, with the same properties and values', function () {
		it('the result should be true', function () {
			var a = {
				hi: {
					my: {
						name: ['Elvis', 'Presley'],
						home: 'Graceland'
					}
				}
			};

			var b = {
				hi: {
					my: {
						name: ['Elvis', 'Presley'],
						home: 'Graceland'
					}
				}
			};

			expect(object.equals(a, b)).toEqual(true);
		});
	});

	describe('against an complex object, with the different properties and values', function () {
		it('the result should be false', function () {
			var a = {
				hi: {
					my: {
						name: ['Elvis', 'Presley'],
						home: 'Graceland'
					}
				}
			};

			var b = {
				hi: {
					my: {
						name: ['Johnny', 'Cash'],
						home: 'Tennessee'
					}
				}
			};

			expect(object.equals(a, b)).toEqual(false);
		});
	});

	describe('against two empty arrays', function () {
		it('the result should be true', function () {
			expect(object.equals([], [])).toEqual(true);
		});
	});
});

},{"./../../../lang/object":33}],96:[function(require,module,exports){
'use strict';

var promise = require('./../../../lang/promise');

describe('When a timeout is set for a promise', function () {
	'use strict';

	describe('on a promise that has already been resolved', function () {
		var originalPromise;
		var timeoutPromise;

		var result;

		beforeEach(function () {
			originalPromise = Promise.resolve(result = 'instant');
			timeoutPromise = promise.timeout(originalPromise, 10);
		});

		it('it will resolve', function (done) {
			timeoutPromise.then(function (r) {
				expect(r).toBe(result);

				done();
			});
		});
	});

	describe('on a promise that has already been rejected', function () {
		var originalPromise;
		var timeoutPromise;

		var result;

		beforeEach(function () {
			originalPromise = Promise.reject(result = 'instant');
			timeoutPromise = promise.timeout(originalPromise, 10);
		});

		it('it reject normally', function (done) {
			timeoutPromise.catch(function (r) {
				expect(r).toBe(result);

				done();
			});
		});
	});

	describe('on a promise that resolves quickly', function () {
		var originalPromise;
		var timeoutPromise;

		var result;

		beforeEach(function () {
			originalPromise = new Promise(function (resolveCallback, rejectCallback) {
				setTimeout(function () {
					resolveCallback(result = 'quick');
				}, 5);
			});

			timeoutPromise = promise.timeout(originalPromise, 10);
		});

		it('it will resolve', function (done) {
			timeoutPromise.then(function (r) {
				expect(r).toBe(result);

				done();
			});
		});
	});

	describe('on a promise that rejects quickly', function () {
		var originalPromise;
		var timeoutPromise;

		var result;

		beforeEach(function () {
			originalPromise = new Promise(function (resolveCallback, rejectCallback) {
				setTimeout(function () {
					rejectCallback(result = 'quick');
				}, 5);
			});

			timeoutPromise = promise.timeout(originalPromise, 10);
		});

		it('it reject normally', function (done) {
			timeoutPromise.catch(function (r) {
				expect(r).toBe(result);

				done();
			});
		});
	});

	describe('on a promise that resolves slowly', function () {
		var originalPromise;
		var timeoutPromise;

		var result;

		beforeEach(function () {
			originalPromise = new Promise(function (resolveCallback, rejectCallback) {
				setTimeout(function () {
					resolveCallback(result = 'slow');
				}, 20);
			});

			timeoutPromise = promise.timeout(originalPromise, 10);
		});

		it('will reject due to timeout', function (done) {
			timeoutPromise.catch(function () {
				expect(true).toBe(true);

				done();
			});
		});
	});

	describe('on a promise that rejects slowly', function () {
		var originalPromise;
		var timeoutPromise;

		var result;

		beforeEach(function () {
			originalPromise = new Promise(function (resolveCallback, rejectCallback) {
				setTimeout(function () {
					rejectCallback(result = 'slow');
				}, 20);
			});

			timeoutPromise = promise.timeout(originalPromise, 10);
		});

		it('it reject normally', function (done) {
			timeoutPromise.catch(function (r) {
				expect(r).not.toBe(result);

				done();
			});
		});
	});

	describe('on a promise that will never resolve', function () {
		var originalPromise;
		var timeoutPromise;

		beforeEach(function () {
			originalPromise = new Promise(function (resolveCallback, rejectCallback) {
				return;
			});

			timeoutPromise = promise.timeout(originalPromise, 10);
		});

		it('will reject due to timeout', function (done) {
			timeoutPromise.catch(function () {
				expect(true).toBe(true);

				done();
			});
		});
	});
});

describe('When using the "promise.map" function', function () {
	'use strict';

	describe('with an asynchronous, promise-based mapper', function () {
		describe('and the array has zero items', function () {
			var mapPromise;

			var mapItems;
			var mapSpy;

			beforeEach(function () {
				mapItems = [];
			});

			describe('and the concurrency level is zero', function () {
				beforeEach(function () {
					mapPromise = promise.map(mapItems, mapSpy = jasmine.createSpy('mapSpy'), 0);
				});

				it('the result should be an empty array', function (done) {
					mapPromise.then(function (results) {
						expect(results.length).toEqual(0);

						done();
					});
				});

				it('the mapping function should not have been called', function (done) {
					mapPromise.then(function (results) {
						expect(mapSpy).not.toHaveBeenCalled();

						done();
					});
				});
			});

			describe('and the concurrency level is six', function () {
				beforeEach(function () {
					mapPromise = promise.map(mapItems, mapSpy = jasmine.createSpy('mapSpy'), 6);
				});

				it('the result should be an empty array', function (done) {
					mapPromise.then(function (results) {
						expect(results.length).toEqual(0);

						done();
					});
				});

				it('the mapping function should not have been called', function (done) {
					mapPromise.then(function (results) {
						expect(mapSpy).not.toHaveBeenCalled();

						done();
					});
				});
			});
		});

		describe('and the array has three items', function () {
			var mapPromise;

			var mapItems;
			var mapSpy;

			var first;
			var second;
			var third;

			beforeEach(function () {
				mapItems = [first = {}, second = {}, third = {}];
			});

			describe('and the concurrency level is zero', function () {
				beforeEach(function () {
					mapPromise = promise.map(mapItems, mapSpy = getMapSpy(), 0);
				});

				it('the maximum concurrency level should be three', function (done) {
					mapPromise.then(function (results) {
						expect(getMaximumConcurrency(results)).toEqual(3);

						done();
					});
				});

				it('the actual concurrency for the first item should be three', function (done) {
					mapPromise.then(function (results) {
						expect(getConcurrency(results, 0)).toEqual(3);

						done();
					});
				});

				it('the result for the first item should be first', function (done) {
					mapPromise.then(function (results) {
						expect(results[0].item).toBe(first);

						done();
					});
				});

				it('the result for the second item should be second', function (done) {
					mapPromise.then(function (results) {
						expect(results[1].item).toBe(second);

						done();
					});
				});

				it('the result for the third item should be third', function (done) {
					mapPromise.then(function (results) {
						expect(results[2].item).toBe(third);

						done();
					});
				});
			});

			describe('and the concurrency level is one', function () {
				beforeEach(function () {
					mapPromise = promise.map(mapItems, mapSpy = getMapSpy(), 1);
				});

				it('the maximum concurrency level should be one', function (done) {
					mapPromise.then(function (results) {
						expect(getMaximumConcurrency(results)).toEqual(1);

						done();
					});
				});

				it('the actual concurrency for the first item should be one', function (done) {
					mapPromise.then(function (results) {
						expect(getConcurrency(results, 0)).toEqual(1);

						done();
					});
				});

				it('the result for the first item should be first', function (done) {
					mapPromise.then(function (results) {
						expect(results[0].item).toBe(first);

						done();
					});
				});

				it('the result for the second item should be second', function (done) {
					mapPromise.then(function (results) {
						expect(results[1].item).toBe(second);

						done();
					});
				});

				it('the result for the third item should be third', function (done) {
					mapPromise.then(function (results) {
						expect(results[2].item).toBe(third);

						done();
					});
				});
			});

			describe('and the concurrency level is two', function () {
				beforeEach(function () {
					mapPromise = promise.map(mapItems, mapSpy = getMapSpy(), 2);
				});

				it('the maximum concurrency level should be two', function (done) {
					mapPromise.then(function (results) {
						expect(getMaximumConcurrency(results)).toEqual(2);

						done();
					});
				});

				it('the actual concurrency for the first item should be two', function (done) {
					mapPromise.then(function (results) {
						expect(getConcurrency(results, 0)).toEqual(2);

						done();
					});
				});

				it('the result for the first item should be first', function (done) {
					mapPromise.then(function (results) {
						expect(results[0].item).toBe(first);

						done();
					});
				});

				it('the result for the second item should be second', function (done) {
					mapPromise.then(function (results) {
						expect(results[1].item).toBe(second);

						done();
					});
				});

				it('the result for the third item should be third', function (done) {
					mapPromise.then(function (results) {
						expect(results[2].item).toBe(third);

						done();
					});
				});
			});

			describe('and the concurrency level is three', function () {
				beforeEach(function () {
					mapPromise = promise.map(mapItems, mapSpy = getMapSpy(), 3);
				});

				it('the maximum concurrency level should be three', function (done) {
					mapPromise.then(function (results) {
						expect(getMaximumConcurrency(results)).toEqual(3);

						done();
					});
				});

				it('the actual concurrency for the first item should be three', function (done) {
					mapPromise.then(function (results) {
						expect(getConcurrency(results, 0)).toEqual(3);

						done();
					});
				});

				it('the result for the first item should be first', function (done) {
					mapPromise.then(function (results) {
						expect(results[0].item).toBe(first);

						done();
					});
				});

				it('the result for the second item should be second', function (done) {
					mapPromise.then(function (results) {
						expect(results[1].item).toBe(second);

						done();
					});
				});

				it('the result for the third item should be third', function (done) {
					mapPromise.then(function (results) {
						expect(results[2].item).toBe(third);

						done();
					});
				});
			});

			describe('and the concurrency level is four', function () {
				beforeEach(function () {
					mapPromise = promise.map(mapItems, mapSpy = getMapSpy(), 4);
				});

				it('the maximum concurrency level should be three', function (done) {
					mapPromise.then(function (results) {
						expect(getMaximumConcurrency(results)).toEqual(3);

						done();
					});
				});

				it('the actual concurrency for the first item should be three', function (done) {
					mapPromise.then(function (results) {
						expect(getConcurrency(results, 0)).toEqual(3);

						done();
					});
				});

				it('the result for the first item should be first', function (done) {
					mapPromise.then(function (results) {
						expect(results[0].item).toBe(first);

						done();
					});
				});

				it('the result for the second item should be second', function (done) {
					mapPromise.then(function (results) {
						expect(results[1].item).toBe(second);

						done();
					});
				});

				it('the result for the third item should be third', function (done) {
					mapPromise.then(function (results) {
						expect(results[2].item).toBe(third);

						done();
					});
				});
			});
		});

		describe('and the array has four items (with a concurrency level of two)', function () {
			var mapPromise;

			var mapItems;
			var mapSpy;

			var first;
			var second;
			var third;
			var fourth;

			beforeEach(function () {
				mapItems = [first = {}, second = {}, third = {}, fourth = {}];
			});

			describe('and the first item takes a long time to process', function () {
				beforeEach(function () {
					mapPromise = promise.map(mapItems, mapSpy = jasmine.createSpy('mapSpy').and.callFake(function (item) {
						var delay;

						if (item === first) {
							delay = 30;
						} else {
							delay = 5;
						}

						var startDate = new Date();

						return new Promise(function (resolveCallback, rejectCallback) {
							setTimeout(function () {
								var endDate = new Date();

								resolveCallback({
									item: item,
									start: startDate.getTime(),
									end: endDate.getTime()
								});
							}, delay);
						});
					}), 2);
				});

				it('the result for the first item should be first', function (done) {
					mapPromise.then(function (results) {
						expect(results[0].item).toBe(first);

						done();
					});
				});

				it('the result for the second item should be second', function (done) {
					mapPromise.then(function (results) {
						expect(results[1].item).toBe(second);

						done();
					});
				});

				it('the result for the third item should be third', function (done) {
					mapPromise.then(function (results) {
						expect(results[2].item).toBe(third);

						done();
					});
				});

				it('the result for the fourth item should be fourth', function (done) {
					mapPromise.then(function (results) {
						expect(results[3].item).toBe(fourth);

						done();
					});
				});
			});
		});

		var getMapSpy = function getMapSpy() {
			return jasmine.createSpy('mapSpy').and.callFake(function (item) {
				var startDate = new Date();

				return new Promise(function (resolveCallback, rejectCallback) {
					setTimeout(function () {
						var endDate = new Date();

						resolveCallback({
							item: item,
							start: startDate.getTime(),
							end: endDate.getTime()
						});
					}, 5);
				});
			});
		};
	});

	describe('with an synchronous mapper', function () {
		describe('and the array has no items (with an infinite concurrency level)', function () {
			var mapPromise;

			var mapItems;
			var mapSpy;

			beforeEach(function () {
				mapPromise = promise.map(mapItems = [], mapSpy = jasmine.createSpy('mapSpy'));
			});

			it('the result will be an array', function (done) {
				mapPromise.then(function (results) {
					expect(results instanceof Array).toEqual(true);

					done();
				});
			});

			it('the resulting array will be the same size as the input array', function (done) {
				mapPromise.then(function (results) {
					expect(results.length).toEqual(mapItems.length);

					done();
				});
			});

			it('the mapper function will be not have been called', function (done) {
				mapPromise.then(function (results) {
					expect(mapSpy.calls.count()).toEqual(0);

					done();
				});
			});
		});

		describe('and the array has two items (with an infinite concurrency level)', function () {
			var mapPromise;

			var mapItems;
			var mapSpy;

			beforeEach(function () {
				mapPromise = promise.map(mapItems = ['x', 'y'], mapSpy = jasmine.createSpy('mapSpy'));
			});

			it('the result will be an array', function (done) {
				mapPromise.then(function (results) {
					expect(results instanceof Array).toEqual(true);

					done();
				});
			});

			it('the resulting array have two items', function (done) {
				mapPromise.then(function (results) {
					expect(results.length).toEqual(2);

					done();
				});
			});

			it('the mapper function to have been called twice', function (done) {
				mapPromise.then(function (results) {
					expect(mapSpy.calls.count()).toEqual(2);

					done();
				});
			});

			it('the mapper function will have been called once with the first item', function (done) {
				mapPromise.then(function (results) {
					expect(mapSpy).toHaveBeenCalledWith(mapItems[0]);

					done();
				});
			});

			it('the mapper function will have been called once with the second item', function (done) {
				mapPromise.then(function (results) {
					expect(mapSpy).toHaveBeenCalledWith(mapItems[1]);

					done();
				});
			});
		});
	});

	var getConcurrency = function getConcurrency(results, index) {
		var current = results[index];

		var concurrency = 0;

		for (var i = 0; i < results.length; i++) {
			var other = results[i];

			if (!(other.end <= current.start || other.start >= current.end)) {
				concurrency = concurrency + 1;
			}
		}

		return concurrency;
	};

	var getMaximumConcurrency = function getMaximumConcurrency(results) {
		var maximum = 0;

		for (var i = 0; i < results.length; i++) {
			maximum = Math.max(getConcurrency(results, i), maximum);
		}

		return maximum;
	};
});

describe('When processing a "pipeline" of promises', function () {
	'use strict';

	describe('and no executors are specified', function () {
		var input;
		var p;

		beforeEach(function () {
			p = promise.pipeline([], input = {});
		});

		it('should return the original input', function (done) {
			p.then(function (result) {
				expect(result).toBe(input);

				done();
			});
		});
	});

	describe('and one asynchronous executor is specified', function () {
		var input;

		var spyOne;

		var p;

		beforeEach(function () {
			var delayedSquare = function delayedSquare(x) {
				return new Promise(function (resolveCallback) {
					setTimeout(function () {
						resolveCallback(x * x);
					}, 10);
				});
			};

			spyOne = jasmine.createSpy('spyOne').and.callFake(delayedSquare);

			p = promise.pipeline([spyOne], input = 2);
		});

		it('the first executor should be called with the input', function (done) {
			p.then(function (result) {
				expect(spyOne).toHaveBeenCalledWith(2);

				done();
			});
		});

		it('the promise should return the correct result', function (done) {
			p.then(function (result) {
				expect(result).toEqual(4);

				done();
			});
		});
	});

	describe('and two asynchronous executors are specified', function () {
		var input;

		var spyOne;
		var spyTwo;

		var p;

		beforeEach(function () {
			var delayedSquare = function delayedSquare(x) {
				return new Promise(function (resolveCallback) {
					setTimeout(function () {
						resolveCallback(x * x);
					}, 10);
				});
			};

			spyOne = jasmine.createSpy('spyOne').and.callFake(delayedSquare);
			spyTwo = jasmine.createSpy('spyTwo').and.callFake(delayedSquare);

			p = promise.pipeline([spyOne, spyTwo], input = 2);
		});

		it('the first executor should be called with the input', function (done) {
			p.then(function (result) {
				expect(spyOne).toHaveBeenCalledWith(2);

				done();
			});
		});

		it('the second executor should be called with the result of the first executor', function (done) {
			p.then(function (result) {
				expect(spyTwo).toHaveBeenCalledWith(4);

				done();
			});
		});

		it('the promise should return the correct result', function (done) {
			p.then(function (result) {
				expect(result).toEqual(16);

				done();
			});
		});
	});

	describe('and one synchronous executor is specified', function () {
		var input;

		var spyOne;

		var p;

		beforeEach(function () {
			var synchronousSquare = function synchronousSquare(x) {
				return x * x;
			};

			spyOne = jasmine.createSpy('spyOne').and.callFake(synchronousSquare);

			p = promise.pipeline([spyOne], input = 2);
		});

		it('the first executor should be called with the input', function (done) {
			p.then(function (result) {
				expect(spyOne).toHaveBeenCalledWith(2);

				done();
			});
		});

		it('the promise should return the correct result', function (done) {
			p.then(function (result) {
				expect(result).toEqual(4);

				done();
			});
		});
	});

	describe('and two synchronous executors are specified', function () {
		var input;

		var spyOne;
		var spyTwo;

		var p;

		beforeEach(function () {
			var synchronousSquare = function synchronousSquare(x) {
				return x * x;
			};

			spyOne = jasmine.createSpy('spyOne').and.callFake(synchronousSquare);
			spyTwo = jasmine.createSpy('spyTwo').and.callFake(synchronousSquare);

			p = promise.pipeline([spyOne, spyTwo], input = 2);
		});

		it('the first executor should be called with the input', function (done) {
			p.then(function (result) {
				expect(spyOne).toHaveBeenCalledWith(2);

				done();
			});
		});

		it('the second executor should be called with the result of the first executor', function (done) {
			p.then(function (result) {
				expect(spyTwo).toHaveBeenCalledWith(4);

				done();
			});
		});

		it('the promise should return the correct result', function (done) {
			p.then(function (result) {
				expect(result).toEqual(16);

				done();
			});
		});
	});

	describe('and an executor throws an exception', function () {
		var input;

		var spyOne;
		var spyTwo;

		var p;

		beforeEach(function () {
			var synchronousException = function synchronousException(x) {
				throw new Exception('oops');
			};

			var synchronousSquare = function synchronousSquare(x) {
				return x * x;
			};

			spyOne = jasmine.createSpy('spyOne').and.callFake(synchronousException);
			spyTwo = jasmine.createSpy('spyTwo').and.callFake(synchronousSquare);

			p = promise.pipeline([spyOne, spyTwo], input = 2);
		});

		it('the promise should reject', function (done) {
			p.catch(function (error) {
				expect(error instanceof Error).toEqual(true);

				done();
			});
		});

		it('the first executor should be called with the input', function (done) {
			p.catch(function (error) {
				expect(spyOne).toHaveBeenCalledWith(2);

				done();
			});
		});

		it('the second executor not have should be called with the result of the first executor', function (done) {
			p.catch(function (error) {
				expect(spyTwo).not.toHaveBeenCalled();

				done();
			});
		});
	});
});

describe('When "promise.build" is used to create a promise', function () {
	'use strict';

	describe('and the executor resolves', function () {
		var p;

		beforeEach(function () {
			p = promise.build(function (r, x) {
				r('ok');
			});
		});

		it('the promise should be fulfilled', function (done) {
			p.then(function (result) {
				expect(result).toEqual('ok');

				done();
			});
		});
	});

	describe('and the executor rejects', function () {
		var p;

		beforeEach(function () {
			p = promise.build(function (r, x) {
				x('not ok');
			});
		});

		it('the promise should be fulfilled', function (done) {
			p.catch(function (result) {
				expect(result).toEqual('not ok');

				done();
			});
		});
	});

	describe('and the executor throws an error', function () {
		var p;
		var e;

		beforeEach(function () {
			p = promise.build(function (r, x) {
				e = new Error('oops');

				throw e;
			});
		});

		it('the promise should be rejected', function (done) {
			p.catch(function (error) {
				expect(error).toBe(e);

				done();
			});
		});
	});
});

},{"./../../../lang/promise":34}],97:[function(require,module,exports){
'use strict';

var random = require('./../../../lang/random');

describe('When generating a random number, restricting the range to one integer', function () {
	'use strict';

	var result;
	var value;

	beforeEach(function () {
		result = random.range(value = 42, value);
	});

	it('should be the value', function () {
		expect(result).toEqual(value);
	});
});

describe('When generating a random number with a range of multiple values', function () {
	'use strict';

	var result;
	var minimum;
	var maximum;

	beforeEach(function () {
		minimum = -2;
		maximum = 1;
	});

	it('should generate a value within the range', function () {
		var range = maximum - minimum;

		for (var i = 0; i < range * 10; i++) {
			var result = random.range(minimum, maximum);

			expect(result < minimum).toEqual(false);
			expect(result > maximum).toEqual(false);
		}
	});
});

},{"./../../../lang/random":35}],98:[function(require,module,exports){
'use strict';

var string = require('./../../../lang/string');

describe('When converting a string to "start" casing', function () {
	'use strict';

	var result;

	beforeEach(function () {
		result = string.startCase('The quick brown Fox');
	});

	it('should convert the first character (after each space) to a capital letter', function () {
		expect(result).toEqual('The Quick Brown Fox');
	});
});

describe('When truncating a string', function () {
	'use strict';

	var base;

	beforeEach(function () {
		base = '1234567890';
	});

	describe('to more characters than the base string', function () {
		var result;

		beforeEach(function () {
			result = string.truncate(base, base.length + 1);
		});

		it('should return the base string', function () {
			expect(result).toEqual(base);
		});
	});

	describe('to the same number of characters than the base string', function () {
		var result;

		beforeEach(function () {
			result = string.truncate(base, base.length);
		});

		it('should return the base string', function () {
			expect(result).toEqual(base);
		});
	});

	describe('to fewer characters than the base string', function () {
		var result;
		var length;

		beforeEach(function () {
			result = string.truncate(base, length = 2);
		});

		it('the result should be the correct number of characters', function () {
			expect(result.length).toEqual(length + 4);
		});

		it('the first characters should be from the base string', function () {
			for (var i = 0; i < length; i++) {
				expect(result.substring(i, i + 1)).toEqual(base.substring(i, i + 1));
			}
		});

		it('the final characters should be the base string', function () {
			expect(result.substring(result.length - 4, result.length)).toEqual(' ...');
		});
	});
});

describe('When left padding a string', function () {
	'use strict';

	var base;

	beforeEach(function () {
		base = 'base';
	});

	describe('with fewer characters than the base string', function () {
		var result;

		beforeEach(function () {
			result = string.padLeft(base, base.length, 'x');
		});

		it('should return the base string', function () {
			expect(result).toEqual(base);
		});
	});

	describe('with one more character than the base string', function () {
		var result;
		var repeat;

		beforeEach(function () {
			result = string.padLeft(base, base.length + 1, repeat = 'x');
		});

		it('the result should be the correct number of characters', function () {
			expect(result.length).toEqual(base.length + 1);
		});

		it('the first character should be the repeating character', function () {
			expect(result.substring(0, 1)).toEqual(repeat);
		});

		it('the final characters should be the base string', function () {
			expect(result.substring(1, result.length)).toEqual(base);
		});
	});

	describe('with many more character than the base string', function () {
		var result;
		var repeat;
		var count;

		beforeEach(function () {
			result = string.padLeft(base, count = 10, repeat = 'x');
		});

		it('the result should be the correct number of characters', function () {
			expect(result.length).toEqual(count);
		});

		it('the first characters should be the repeating character', function () {
			var prefix = count - base.length;

			for (var i = 0; i < prefix; i++) {
				expect(result.substring(i, i + 1)).toEqual(repeat);
			}
		});

		it('the final characters should be the base string', function () {
			expect(result.substring(count - base.length, result.length)).toEqual(base);
		});
	});
});

describe('When a formattable string ("&startDate={0}&endDate={1}"', function () {
	'use strict';

	var stringToFormat;

	beforeEach(function () {
		stringToFormat = '&startDate={0}&endDate={1}';
	});

	it('formatted with ("2017-08-31" and  "2017-09-30")', function () {
		expect(string.format(stringToFormat, '2017-08-31', '2017-09-30')).toEqual('&startDate=2017-08-31&endDate=2017-09-30');
	});

	it('formatted with ("0" and  "0")', function () {
		expect(string.format(stringToFormat, 0, 0)).toEqual('&startDate=0&endDate=0');
	});

	it('formatted with ("hello")', function () {
		expect(string.format(stringToFormat, 'hello')).toEqual('&startDate=hello&endDate={1}');
	});

	it('formatted with ("xin" and "bryan" and "dave")', function () {
		expect(string.format(stringToFormat, 'xin', 'bryan', 'dave')).toEqual('&startDate=xin&endDate=bryan');
	});

	it('formatted with nothing', function () {
		expect(string.format(stringToFormat)).toEqual('&startDate={0}&endDate={1}');
	});
});

},{"./../../../lang/string":36}],99:[function(require,module,exports){
'use strict';

var EventMap = require('./../../../messaging/EventMap');

describe('When an EventMap is constructed', function () {
	'use strict';

	var eventMap;

	beforeEach(function () {
		eventMap = new EventMap();
	});

	describe('and a handler is registered', function () {
		var eventName;
		var eventHandler;

		beforeEach(function () {
			eventMap.register(eventName = 'hi', eventHandler = jasmine.createSpy('eventHandler'));
		});

		it('should report the event as not empty', function () {
			expect(eventMap.getIsEmpty(eventName)).toBe(false);
		});

		describe('and the event fires', function () {
			var eventData;

			beforeEach(function () {
				eventMap.fire(eventName, eventData = {});
			});

			it('should notify the handler', function () {
				expect(eventHandler).toHaveBeenCalledWith(eventData, eventMap);
			});
		});

		describe('and the an unrelated event fires', function () {
			var eventData;

			beforeEach(function () {
				eventMap.fire('blah', eventData = {});
			});

			it('should not notify the handler', function () {
				expect(eventHandler).not.toHaveBeenCalled();
			});
		});

		describe('and the handler is unregistered', function () {
			beforeEach(function () {
				eventMap.unregister(eventName, eventHandler);
			});

			it('should report the event as empty', function () {
				expect(eventMap.getIsEmpty(eventName)).toBe(true);
			});
		});

		describe('and the handler is unregistered (using the wrong event name)', function () {
			beforeEach(function () {
				eventMap.unregister('blah', eventHandler);
			});

			it('should not report the event as empty', function () {
				expect(eventMap.getIsEmpty(eventName)).toBe(false);
			});
		});

		describe('and the handler is unregistered (using the wrong handler)', function () {
			beforeEach(function () {
				eventMap.unregister(eventName, function () {});
			});

			it('should not report the event as empty', function () {
				expect(eventMap.getIsEmpty(eventName)).toBe(false);
			});
		});

		describe('and another handler is registered', function () {
			var eventHandlerTwo;

			beforeEach(function () {
				eventMap.register(eventName, eventHandlerTwo = jasmine.createSpy('eventHandlerTwo'));
			});

			it('should report the event as not empty', function () {
				expect(eventMap.getIsEmpty(eventName)).toBe(false);
			});

			describe('and the event fires', function () {
				var eventData;

				beforeEach(function () {
					eventMap.fire(eventName, eventData = {});
				});

				it('should notify the first handler', function () {
					expect(eventHandler).toHaveBeenCalledWith(eventData, eventMap);
				});

				it('should notify the second handler', function () {
					expect(eventHandlerTwo).toHaveBeenCalledWith(eventData, eventMap);
				});
			});

			describe('and the an unrelated event fires', function () {
				var eventData;

				beforeEach(function () {
					eventMap.fire('blah', eventData = {});
				});

				it('should not notify the first handler', function () {
					expect(eventHandler).not.toHaveBeenCalled();
				});

				it('should not notify the second handler', function () {
					expect(eventHandlerTwo).not.toHaveBeenCalled();
				});
			});

			describe('and the handler is unregistered', function () {
				beforeEach(function () {
					eventMap.unregister(eventName, eventHandler);
				});

				it('should report the event as empty', function () {
					expect(eventMap.getIsEmpty(eventName)).toBe(false);
				});

				describe('and the event fires', function () {
					var eventData;

					beforeEach(function () {
						eventMap.fire(eventName, eventData = {});
					});

					it('should not notify the first handler', function () {
						expect(eventHandler).not.toHaveBeenCalledWith(eventData, eventMap);
					});

					it('should notify the second handler', function () {
						expect(eventHandlerTwo).toHaveBeenCalledWith(eventData, eventMap);
					});
				});

				describe('and the second handler is unregistered', function () {
					beforeEach(function () {
						eventMap.unregister(eventName, eventHandlerTwo);
					});

					it('should report the event as empty', function () {
						expect(eventMap.getIsEmpty(eventName)).toBe(true);
					});

					describe('and the event fires', function () {
						var eventData;

						beforeEach(function () {
							eventMap.fire(eventName, eventData = {});
						});

						it('should not notify the first handler', function () {
							expect(eventHandler).not.toHaveBeenCalledWith(eventData, eventMap);
						});

						it('should not notify the second handler', function () {
							expect(eventHandlerTwo).not.toHaveBeenCalledWith(eventData, eventMap);
						});
					});
				});
			});
		});
	});
});

},{"./../../../messaging/EventMap":39}],100:[function(require,module,exports){
'use strict';

var Disposable = require('./../../../lang/Disposable');
var Event = require('./../../../messaging/Event');

describe('When an Event is constructed', function () {
	'use strict';

	var event;
	var context;

	beforeEach(function () {
		event = new Event(context = {});
	});

	describe('and an event handler is registered', function () {
		var spyOne;
		var bindingOne;

		beforeEach(function () {
			bindingOne = event.register(spyOne = jasmine.createSpy('spyOne'));
		});

		it('should return a Disposable instance', function () {
			expect(bindingOne instanceof Disposable).toEqual(true);
		});

		describe('and the event fires', function () {
			var data;

			beforeEach(function () {
				event.fire(data = {});
			});

			it('should notify the observer', function () {
				expect(spyOne).toHaveBeenCalledWith(context, data);
			});
		});

		describe('and another event handler is registered', function () {
			var spyTwo;
			var bindingTwo;

			beforeEach(function () {
				bindingTwo = event.register(spyTwo = jasmine.createSpy('spyTwo'));
			});

			it('should return a Disposable instance', function () {
				expect(bindingTwo instanceof Disposable).toEqual(true);
			});

			describe('and the event fires', function () {
				var data;

				beforeEach(function () {
					event.fire(data = {});
				});

				it('should notify both observers', function () {
					expect(spyOne).toHaveBeenCalledWith(context, data);
					expect(spyTwo).toHaveBeenCalledWith(context, data);
				});
			});

			describe('and the first observer is disposed ', function () {
				var data;

				beforeEach(function () {
					bindingOne.dispose();
				});

				describe('and the event fires', function () {
					var data;

					beforeEach(function () {
						event.fire(data = {});
					});

					it('should not notify the first observer', function () {
						expect(spyOne).not.toHaveBeenCalledWith(context, data);
					});

					it('should notify the second observer', function () {
						expect(spyTwo).toHaveBeenCalledWith(context, data);
					});
				});
			});
		});
	});

	describe('and multiple observers are added which dispose themselves', function () {
		var spyOne;
		var spyTwo;

		var bindingOne;
		var bindingTwo;

		beforeEach(function () {
			bindingOne = event.register(spyOne = jasmine.createSpy('spyOne').and.callFake(function () {
				bindingOne.dispose();
			}));
			bindingTwo = event.register(spyTwo = jasmine.createSpy('spyTwo').and.callFake(function () {
				bindingTwo.dispose();
			}));
		});

		describe('and the event fires', function () {
			var data;

			beforeEach(function () {
				event.fire(data = {});
			});

			it('should notify both observer', function () {
				expect(spyOne).toHaveBeenCalledWith(context, data);
				expect(spyTwo).toHaveBeenCalledWith(context, data);
			});

			describe('and the event fires again', function () {
				var data;

				beforeEach(function () {
					spyOne.calls.reset();
					spyTwo.calls.reset();

					event.fire(data = {});
				});

				it('should not notify either observer', function () {
					expect(spyOne).not.toHaveBeenCalledWith(context, data);
					expect(spyTwo).not.toHaveBeenCalledWith(context, data);
				});
			});
		});
	});

	describe('and two observers are added which dispose each other', function () {
		var spyOne;
		var spyTwo;

		var bindingOne;
		var bindingTwo;

		beforeEach(function () {
			bindingOne = event.register(spyOne = jasmine.createSpy('spyOne').and.callFake(function () {
				bindingTwo.dispose();
			}));
			bindingTwo = event.register(spyTwo = jasmine.createSpy('spyTwo').and.callFake(function () {
				bindingOne.dispose();
			}));
		});

		describe('and the event fires', function () {
			var data;

			beforeEach(function () {
				event.fire(data = {});
			});

			it('should notify both observer', function () {
				expect(spyOne).toHaveBeenCalledWith(context, data);
				expect(spyTwo).toHaveBeenCalledWith(context, data);
			});

			describe('and the event fires again', function () {
				var data;

				beforeEach(function () {
					spyOne.calls.reset();
					spyTwo.calls.reset();

					event.fire(data = {});
				});

				it('should not notify either observer', function () {
					expect(spyOne).not.toHaveBeenCalledWith(context, data);
					expect(spyTwo).not.toHaveBeenCalledWith(context, data);
				});
			});
		});
	});
});

},{"./../../../lang/Disposable":18,"./../../../messaging/Event":38}],101:[function(require,module,exports){
'use strict';

var Disposable = require('./../../../lang/Disposable');
var Model = require('./../../../models/Model');

describe('When an Model is constructed with "firstName" and "lastName" properties', function () {
	'use strict';

	var model;

	beforeEach(function () {
		model = new Model(['firstName', 'lastName']);
	});

	describe('and a transaction observer is registered', function () {
		var spy;
		var binding;

		beforeEach(function () {
			binding = model.onTransactionCommitted(spy = jasmine.createSpy('spy'));
		});

		it('should return a Disposable instance', function () {
			expect(binding instanceof Disposable).toEqual(true);
		});

		it('should return null values for each property', function () {
			expect(model.firstName).toBe(null);
			expect(model.lastName).toBe(null);
		});

		describe('and both properties are updated', function () {
			var data;

			beforeEach(function () {
				model.firstName = 'Bryan';
				model.lastName = 'Ingle';
			});

			it('two transactions should occur', function () {
				expect(spy.calls.count()).toEqual(2);
			});

			it('the first transaction should have updated the "first name" property', function () {
				var argsOne = spy.calls.argsFor(0);

				expect(argsOne[0].firstName).toEqual('Bryan');
				expect(argsOne[0].sequence).toEqual(0);

				expect(argsOne[1]).toBe(model);
			});

			it('the second transaction should have updated the "last name" property', function () {
				var argsOne = spy.calls.argsFor(1);

				expect(argsOne[0].lastName).toEqual('Ingle');
				expect(argsOne[0].sequence).toEqual(1);

				expect(argsOne[1]).toBe(model);
			});
		});

		describe('and both properties are updated with an explicit transaction', function () {
			var data;

			beforeEach(function () {
				model.executeTransaction(function (m) {
					m.firstName = 'Bryan';
					m.lastName = 'Ingle';
				});
			});

			it('one transaction should occur', function () {
				expect(spy.calls.count()).toEqual(1);
			});

			it('the first transaction should have updated the "first name" property', function () {
				var argsOne = spy.calls.argsFor(0);

				expect(argsOne[0].firstName).toEqual('Bryan');
				expect(argsOne[0].lastName).toEqual('Ingle');
				expect(argsOne[0].sequence).toEqual(0);

				expect(argsOne[1]).toBe(model);
			});
		});

		describe('and both properties are to undefined values', function () {
			var data;

			beforeEach(function () {
				model.firstName = undefined;
				model.lastName = undefined;
			});

			it('no transactions should occur', function () {
				expect(spy.calls.count()).toEqual(0);
			});

			it('the properties should return null values', function () {
				expect(model.firstName).toBe(null);
				expect(model.lastName).toBe(null);
			});

			describe('and both are updated to non-null values', function () {
				beforeEach(function () {
					model.firstName = 0;
					model.lastName = '';
				});

				it('two transactions should occur', function () {
					expect(spy.calls.count()).toEqual(2);
				});

				it('the first transaction should have updated the "first name" property to zero', function () {
					var argsOne = spy.calls.argsFor(0);

					expect(argsOne[0].firstName).toBe(0);
					expect(argsOne[0].sequence).toEqual(0);

					expect(argsOne[1]).toBe(model);
				});

				it('the second transaction should have updated the "last name" property to a zero-length string', function () {
					var argsOne = spy.calls.argsFor(1);

					expect(argsOne[0].lastName).toBe('');
					expect(argsOne[0].sequence).toEqual(1);

					expect(argsOne[1]).toBe(model);
				});
			});
		});
	});
});

},{"./../../../lang/Disposable":18,"./../../../models/Model":40}],102:[function(require,module,exports){
'use strict';

var RestParser = require('./../../../../network/rest/RestParser');

describe('Using a customized JSON REST parser is created', function () {
	'use strict';

	var parser;
	var spy;

	beforeEach(function () {
		function parserFactory() {
			return spy = jasmine.createSpy('spy').and.callFake(function (k, v) {
				return k === 'fizz' ? 3 : v;
			});
		}

		parser = RestParser.getJsonParser(parserFactory);
	});

	describe('and JSON string is parsed (that represents a simple object)', function () {
		var serialzied;
		var deserialzied;

		beforeEach(function () {
			deserialzied = parser.parse(serialzied = '{"fizz":"three","bang":5}');
		});

		it('the "reviver" function should have been called', function () {
			expect(spy).toHaveBeenCalled();
		});

		it('the resulting object should have a "fizz" property with value of 3 (an override)', function () {
			expect(deserialzied.fizz).toEqual(3);
		});

		it('the resulting object should have a "bang" property with a value of 5', function () {
			expect(deserialzied.bang).toEqual(5);
		});
	});
});

describe('Using another customized JSON REST parser is created', function () {
	'use strict';

	var parser;
	var spy;

	beforeEach(function () {
		function parserFactory() {
			return spy = jasmine.createSpy('spy').and.callFake(function (k, v) {
				return k === 'fizz' ? 3 : v;
			});
		}

		parser = RestParser.getJsonParser(parserFactory);
	});

	describe('and JSON string is parsed (that represents an array of simple objects)', function () {
		var serialzied;
		var deserialzied;

		beforeEach(function () {
			deserialzied = parser.parse(serialzied = '[{"fizz":"three","bang":5},{"fizz":"four","bang":6}]');
		});

		it('the "reviver" function should have been called', function () {
			expect(spy).toHaveBeenCalled();
		});

		it('the resulting object should be an array', function () {
			expect(Array.isArray(deserialzied)).toEqual(true);
		});

		it('the first object should have a "fizz" property with value of 3 (an override)', function () {
			expect(deserialzied[0].fizz).toEqual(3);
		});

		it('the first object should have a "bang" property with a value of 5', function () {
			expect(deserialzied[0].bang).toEqual(5);
		});

		it('the second object should have a "fizz" property with value of 3 (an override)', function () {
			expect(deserialzied[1].fizz).toEqual(3);
		});

		it('the second object should have a "bang" property with a value of 6', function () {
			expect(deserialzied[1].bang).toEqual(6);
		});
	});
});

},{"./../../../../network/rest/RestParser":43}],103:[function(require,module,exports){
'use strict';

var Currency = require('./../../../../lang/Currency');
var Day = require('./../../../../lang/Day');
var Money = require('./../../../../lang/Money');

var Component = require('./../../../../serialization/json/Component');
var Field = require('./../../../../serialization/json/Field');
var DataType = require('./../../../../serialization/json/DataType');
var Schema = require('./../../../../serialization/json/Schema');

describe('When a person schema is created (first and last names)', function () {
	'use strict';

	var schema;

	beforeEach(function () {
		schema = new Schema('person', [new Field('first', DataType.STRING), new Field('last', DataType.STRING)]);
	});

	describe('and a schema-compliant object is created', function () {
		var object;

		beforeEach(function () {
			object = {
				first: 'bryan',
				last: 'ingle'
			};
		});

		describe('and the object is "stringified" as JSON', function () {
			var serialized;

			beforeEach(function () {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', function () {
				var deserialized;

				beforeEach(function () {
					deserialized = JSON.parse(serialized, schema.getReviver());
				});

				it('should have a "first" property with the expected value', function () {
					expect(deserialized.first).toEqual('bryan');
				});

				it('should have a "last" property with the expected value', function () {
					expect(deserialized.last).toEqual('ingle');
				});
			});
		});
	});

	describe('and a schema-compliant array is created', function () {
		var object;

		beforeEach(function () {
			object = [{
				first: 'bryan',
				last: 'ingle'
			}, {
				first: 'borja',
				last: 'yanes'
			}];
		});

		describe('and the object is "stringified" as JSON', function () {
			var serialized;

			beforeEach(function () {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', function () {
				var deserialized;

				beforeEach(function () {
					try {
						deserialized = JSON.parse(serialized, schema.getReviver());
					} catch (e) {
						console.log(e);
					}
				});

				it('should be an array with two items', function () {
					expect(deserialized.length).toEqual(2);
				});

				it('the first item should have a "first" property with the expected value', function () {
					expect(deserialized[0].first).toEqual('bryan');
				});

				it('the first item should have a "last" property with the expected value', function () {
					expect(deserialized[0].last).toEqual('ingle');
				});

				it('the second item should have a "first" property with the expected value', function () {
					expect(deserialized[1].first).toEqual('borja');
				});

				it('the second item should have a "last" property with the expected value', function () {
					expect(deserialized[1].last).toEqual('yanes');
				});
			});
		});
	});
});

describe('When a person schema is created (first and last names, with optional middle name)', function () {
	'use strict';

	var schema;

	beforeEach(function () {
		schema = new Schema('person', [new Field('first', DataType.STRING), new Field('middle', DataType.STRING, true), new Field('last', DataType.STRING)]);
	});

	describe('and a schema-compliant object is created (with middle name)', function () {
		var object;

		beforeEach(function () {
			object = {
				first: 'bryan',
				middle: 'ray',
				last: 'ingle'
			};
		});

		describe('and the object is "stringified" as JSON', function () {
			var serialized;

			beforeEach(function () {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', function () {
				var deserialized;

				beforeEach(function () {
					deserialized = JSON.parse(serialized, schema.getReviver());
				});

				it('should have a "first" property with the expected value', function () {
					expect(deserialized.first).toEqual('bryan');
				});

				it('should have a "middle" property with the expected value', function () {
					expect(deserialized.middle).toEqual('ray');
				});

				it('should have a "last" property with the expected value', function () {
					expect(deserialized.last).toEqual('ingle');
				});
			});
		});
	});

	describe('and a schema-compliant object is created (without middle name)', function () {
		var object;

		beforeEach(function () {
			object = {
				first: 'bryan',
				last: 'ingle'
			};
		});

		describe('and the object is "stringified" as JSON', function () {
			var serialized;

			beforeEach(function () {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', function () {
				var deserialized;

				beforeEach(function () {
					deserialized = JSON.parse(serialized, schema.getReviver());
				});

				it('should have a "first" property with the expected value', function () {
					expect(deserialized.first).toEqual('bryan');
				});

				it('should not have a "middle" property', function () {
					expect(deserialized.hasOwnProperty('middle')).toEqual(false);
				});

				it('should have a "last" property with the expected value', function () {
					expect(deserialized.last).toEqual('ingle');
				});
			});
		});
	});
});

describe('When a person schema is created (grouped first and last names with a birthday)', function () {
	'use strict';

	var schema;

	beforeEach(function () {
		schema = new Schema('person', [new Field('name.first', DataType.STRING), new Field('name.last', DataType.STRING), new Field('birthday', DataType.DAY)]);
	});

	describe('and a schema-compliant object is created', function () {
		var object;

		beforeEach(function () {
			object = {
				name: {
					first: 'bryan',
					last: 'ingle'
				},
				birthday: new Day(1974, 10, 20)
			};
		});

		describe('and the object is "stringified" as JSON', function () {
			var serialized;

			beforeEach(function () {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', function () {
				var deserialized;

				beforeEach(function () {
					try {
						deserialized = JSON.parse(serialized, schema.getReviver());
					} catch (e) {
						console.log(e);
					}
				});

				it('should have a "name.first" property with the expected value', function () {
					expect(deserialized.name.first).toEqual('bryan');
				});

				it('should have a "name.last" property with the expected value', function () {
					expect(deserialized.name.last).toEqual('ingle');
				});

				it('should have a "birthday" property with the expected value', function () {
					expect(deserialized.birthday.year).toEqual(1974);
					expect(deserialized.birthday.month).toEqual(10);
					expect(deserialized.birthday.day).toEqual(20);
				});
			});
		});
	});
});

describe('When an account schema is created (using the Money component)', function () {
	'use strict';

	var schema;

	beforeEach(function () {
		schema = new Schema('account', [new Field('number', DataType.NUMBER)], [Component.forMoney('balance')]);
	});

	describe('and a schema-compliant object is created', function () {
		var object;

		beforeEach(function () {
			object = {
				number: 123456789,
				balance: new Money(314.15, Currency.USD)
			};
		});

		describe('and the object is "stringified" as JSON', function () {
			var serialized;

			beforeEach(function () {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', function () {
				var deserialized;

				beforeEach(function () {
					try {
						deserialized = JSON.parse(serialized, schema.getReviver());
					} catch (e) {
						console.log(e);
					}
				});

				it('should have a "number" property with the expected value', function () {
					expect(deserialized.number).toEqual(123456789);
				});

				it('should have a "balance" property with the expected value', function () {
					expect(deserialized.balance.currency).toEqual(Currency.USD);
					expect(deserialized.balance.decimal.getIsEqual(314.15)).toEqual(true);
				});
			});
		});
	});
});

describe('When an account schema is created (using the Money component with nesting)', function () {
	'use strict';

	var schema;

	beforeEach(function () {
		schema = new Schema('account', [new Field('number', DataType.NUMBER)], [Component.forMoney('balances.yesterday'), Component.forMoney('balances.today')]);
	});

	describe('and a schema-compliant object is created', function () {
		var object;

		beforeEach(function () {
			object = {
				number: 987654321,
				balances: {
					yesterday: new Money(314.15, Currency.USD),
					today: new Money(271.83, Currency.USD)
				}
			};
		});

		describe('and the object is "stringified" as JSON', function () {
			var serialized;

			beforeEach(function () {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', function () {
				var deserialized;

				beforeEach(function () {
					try {
						deserialized = JSON.parse(serialized, schema.getReviver());
					} catch (e) {
						console.log(e);
					}
				});

				it('should have a "number" property with the expected value', function () {
					expect(deserialized.number).toEqual(987654321);
				});

				it('should have a "balances.yesterday" property with the expected value', function () {
					expect(deserialized.balances.yesterday.currency).toEqual(Currency.USD);
					expect(deserialized.balances.yesterday.decimal.getIsEqual(314.15)).toEqual(true);
				});

				it('should have a "balances.today" property with the expected value', function () {
					expect(deserialized.balances.today.currency).toEqual(Currency.USD);
					expect(deserialized.balances.today.decimal.getIsEqual(271.83)).toEqual(true);
				});
			});
		});
	});

	describe('and a schema-compliant array is created', function () {
		var object;

		beforeEach(function () {
			object = [{
				number: 987654321,
				balances: {
					yesterday: new Money(314.15, Currency.USD),
					today: new Money(271.83, Currency.USD)
				}
			}, {
				number: 123456789,
				balances: {
					yesterday: new Money(141.42, Currency.USD),
					today: new Money(173.20, Currency.USD)
				}
			}];
		});

		describe('and the object is "stringified" as JSON', function () {
			var serialized;

			beforeEach(function () {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', function () {
				var deserialized;

				beforeEach(function () {
					try {
						deserialized = JSON.parse(serialized, schema.getReviver());
					} catch (e) {
						console.log(e);
					}
				});

				it('should be an array with two items', function () {
					expect(deserialized.length).toEqual(2);
				});

				it('the first item should have a "number" property with the expected value', function () {
					expect(deserialized[0].number).toEqual(987654321);
				});

				it('the first item should have a "balances.yesterday" property with the expected value', function () {
					expect(deserialized[0].balances.yesterday.currency).toEqual(Currency.USD);
					expect(deserialized[0].balances.yesterday.decimal.getIsEqual(314.15)).toEqual(true);
				});

				it('the first item should have a "balances.today" property with the expected value', function () {
					expect(deserialized[0].balances.today.currency).toEqual(Currency.USD);
					expect(deserialized[0].balances.today.decimal.getIsEqual(271.83)).toEqual(true);
				});

				it('the second item should have a "number" property with the expected value', function () {
					expect(deserialized[1].number).toEqual(123456789);
				});

				it('the second item should have a "balances.yesterday" property with the expected value', function () {
					expect(deserialized[1].balances.yesterday.currency).toEqual(Currency.USD);
					expect(deserialized[1].balances.yesterday.decimal.getIsEqual(141.42)).toEqual(true);
				});

				it('the second item should have a "balances.today" property with the expected value', function () {
					expect(deserialized[1].balances.today.currency).toEqual(Currency.USD);
					expect(deserialized[1].balances.today.decimal.getIsEqual(173.20)).toEqual(true);
				});
			});
		});
	});
});

describe('When a schema is created (having a nested group of optional fields)', function () {
	'use strict';

	var schema;

	beforeEach(function () {
		schema = new Schema('thing', [new Field('required.a', DataType.NUMBER), new Field('optional.b', DataType.NUMBER, true), new Field('optional.c', DataType.NUMBER, true), new Field('name', DataType.STRING)]);
	});

	describe('and a schema-compliant object is created (using one optional field)', function () {
		var object;

		beforeEach(function () {
			object = {
				required: {
					a: 1
				},
				optional: {
					b: 2
				},
				name: 'swamp'
			};
		});

		describe('and the object is "stringified" as JSON', function () {
			var serialized;

			beforeEach(function () {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', function () {
				var deserialized;

				beforeEach(function () {
					deserialized = JSON.parse(serialized, schema.getReviver());
				});

				it('should have a "required" property', function () {
					expect(deserialized.hasOwnProperty('required')).toEqual(true);
				});

				it('should have a "required.a" property, with the expected value', function () {
					expect(deserialized.required.a).toEqual(1);
				});

				it('should have an "optional" property', function () {
					expect(deserialized.hasOwnProperty('optional')).toEqual(true);
				});

				it('should have a "optional.b" property, with the expected value', function () {
					expect(deserialized.optional.b).toEqual(2);
				});

				it('should not have a "optional.c" property', function () {
					expect(deserialized.optional.hasOwnProperty('c')).toEqual(false);
				});

				it('should have a "name" property, with the expected value', function () {
					expect(deserialized.name).toEqual('swamp');
				});
			});
		});
	});

	describe('and a schema-compliant object is created (using no optional fields)', function () {
		var object;

		beforeEach(function () {
			object = {
				required: {
					a: 1
				},
				name: 'swamp'
			};
		});

		describe('and the object is "stringified" as JSON', function () {
			var serialized;

			beforeEach(function () {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', function () {
				var deserialized;

				beforeEach(function () {
					deserialized = JSON.parse(serialized, schema.getReviver());
				});

				it('should have a "required" property', function () {
					expect(deserialized.hasOwnProperty('required')).toEqual(true);
				});

				it('should have a "required.a" property, with the expected value', function () {
					expect(deserialized.required.a).toEqual(1);
				});

				it('should not have an "optional" property', function () {
					expect(deserialized.hasOwnProperty('optional')).toEqual(false);
				});

				it('should have a "name" property, with the expected value', function () {
					expect(deserialized.name).toEqual('swamp');
				});
			});
		});
	});
});

},{"./../../../../lang/Currency":15,"./../../../../lang/Day":16,"./../../../../lang/Money":20,"./../../../../serialization/json/Component":50,"./../../../../serialization/json/DataType":51,"./../../../../serialization/json/Field":52,"./../../../../serialization/json/Schema":53}],104:[function(require,module,exports){
'use strict';

var Component = require('./../../../../../serialization/json/Component');
var DataType = require('./../../../../../serialization/json/DataType');
var SchemaBuilder = require('./../../../../../serialization/json/builders/SchemaBuilder');

describe('When using the schema builder to create a "Person" schema', function () {
	'use strict';

	var schemaBuilder;

	beforeEach(function () {
		schemaBuilder = SchemaBuilder.withName('person');
	});

	describe('that has a string-typed "name" field and a number-typed "age" field', function () {
		beforeEach(function () {
			schemaBuilder = schemaBuilder.withField('name', DataType.STRING).withField('age', DataType.NUMBER);
		});

		describe('and the schema is pulled', function () {
			var schema;

			beforeEach(function () {
				schema = schemaBuilder.schema;
			});

			it('the name should be "person"', function () {
				expect(schema.name).toEqual('person');
			});

			it('there should be two fields', function () {
				expect(schema.fields.length).toEqual(2);
			});

			it('the first field should be string-typed and called "name"', function () {
				expect(schema.fields[0].name).toEqual('name');
				expect(schema.fields[0].dataType).toEqual(DataType.STRING);
			});

			it('the second field should be number-typed and called "age"', function () {
				expect(schema.fields[1].name).toEqual('age');
				expect(schema.fields[1].dataType).toEqual(DataType.NUMBER);
			});

			it('there should be no components', function () {
				expect(schema.components.length).toEqual(0);
			});
		});

		describe('and a "wallet" component is added to the schema', function () {
			beforeEach(function () {
				schemaBuilder = schemaBuilder.withComponent(Component.forMoney('wallet'));
			});

			describe('and the schema is pulled', function () {
				var schema;

				beforeEach(function () {
					schema = schemaBuilder.schema;
				});

				it('the name should be "person"', function () {
					expect(schema.name).toEqual('person');
				});

				it('there should be two fields', function () {
					expect(schema.fields.length).toEqual(2);
				});

				it('the first field should be string-typed and called "name"', function () {
					expect(schema.fields[0].name).toEqual('name');
					expect(schema.fields[0].dataType).toEqual(DataType.STRING);
				});

				it('the second field should be number-typed and called "age"', function () {
					expect(schema.fields[1].name).toEqual('age');
					expect(schema.fields[1].dataType).toEqual(DataType.NUMBER);
				});

				it('there should be one component', function () {
					expect(schema.components.length).toEqual(1);
				});

				it('the component should be named "wallet"', function () {
					expect(schema.components[0].name).toEqual('wallet');
				});
			});
		});

		describe('and a "custom" component is added to the schema (using a component builder)', function () {
			var reviver;

			beforeEach(function () {
				schemaBuilder = schemaBuilder.withComponentBuilder('custom', function (cb) {
					cb.withField('b', DataType.STRING).withField('a', DataType.NUMBER).withReviver(reviver = function reviver(x) {
						return 'hola amigo';
					});
				});
			});

			describe('and the schema is pulled', function () {
				var schema;

				beforeEach(function () {
					schema = schemaBuilder.schema;
				});

				it('the name should be "person"', function () {
					expect(schema.name).toEqual('person');
				});

				it('there should be two fields', function () {
					expect(schema.fields.length).toEqual(2);
				});

				it('the first field should be string-typed and called "name"', function () {
					expect(schema.fields[0].name).toEqual('name');
					expect(schema.fields[0].dataType).toEqual(DataType.STRING);
				});

				it('the second field should be number-typed and called "age"', function () {
					expect(schema.fields[1].name).toEqual('age');
					expect(schema.fields[1].dataType).toEqual(DataType.NUMBER);
				});

				it('there should be one component', function () {
					expect(schema.components.length).toEqual(1);
				});

				it('the component should be named "custom"', function () {
					expect(schema.components[0].name).toEqual('custom');
				});

				it('there component should have two fields', function () {
					expect(schema.components[0].fields.length).toEqual(2);
				});

				it('the component\'s first field should be string-typed and called "b"', function () {
					expect(schema.components[0].fields[0].name).toEqual('b');
					expect(schema.components[0].fields[0].dataType).toEqual(DataType.STRING);
				});

				it('the component\'s second field should be number-typed and called "a"', function () {
					expect(schema.components[0].fields[1].name).toEqual('a');
					expect(schema.components[0].fields[1].dataType).toEqual(DataType.NUMBER);
				});

				it('there component reviver function should be correct', function () {
					expect(schema.components[0].reviver).toBe(reviver);
				});
			});
		});
	});
});

},{"./../../../../../serialization/json/Component":50,"./../../../../../serialization/json/DataType":51,"./../../../../../serialization/json/builders/SchemaBuilder":55}],105:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Specification = require('./../../../specifications/Specification');
var AndSpecification = require('./../../../specifications/AndSpecification');

describe('When an AndSpecification is constructed', function () {
	'use strict';

	var SpecPass = function (_Specification) {
		_inherits(SpecPass, _Specification);

		function SpecPass() {
			_classCallCheck(this, SpecPass);

			var _this = _possibleConstructorReturn(this, (SpecPass.__proto__ || Object.getPrototypeOf(SpecPass)).call(this));

			_this._spy = jasmine.createSpy('spyPass').and.returnValue(true);
			return _this;
		}

		_createClass(SpecPass, [{
			key: '_evaluate',
			value: function _evaluate(data) {
				return this._spy(data);
			}
		}]);

		return SpecPass;
	}(Specification);

	var SpecFail = function (_Specification2) {
		_inherits(SpecFail, _Specification2);

		function SpecFail() {
			_classCallCheck(this, SpecFail);

			var _this2 = _possibleConstructorReturn(this, (SpecFail.__proto__ || Object.getPrototypeOf(SpecFail)).call(this));

			_this2._spy = jasmine.createSpy('spyPass').and.returnValue(false);
			return _this2;
		}

		_createClass(SpecFail, [{
			key: '_evaluate',
			value: function _evaluate(data) {
				return this._spy(data);
			}
		}]);

		return SpecFail;
	}(Specification);

	describe('with two specifications that will pass', function () {
		var specification;

		var specPassOne;
		var specPassTwo;

		var data;
		var result;

		beforeEach(function () {
			specification = new AndSpecification(specPassOne = new SpecPass(), specPassTwo = new SpecPass());

			result = specification.evaluate(data = {});
		});

		it('should call the first specification', function () {
			expect(specPassOne._spy).toHaveBeenCalledWith(data);
		});

		it('should call the second specification', function () {
			expect(specPassTwo._spy).toHaveBeenCalledWith(data);
		});

		it('should evaluate to true', function () {
			expect(result).toEqual(true);
		});
	});

	describe('where the first specifications will fail', function () {
		var specification;

		var specPassOne;
		var specPassTwo;

		var data;
		var result;

		beforeEach(function () {
			specification = new AndSpecification(specPassOne = new SpecFail(), specPassTwo = new SpecPass());

			result = specification.evaluate(data = {});
		});

		it('should call the first specification', function () {
			expect(specPassOne._spy).toHaveBeenCalledWith(data);
		});

		it('should not call the second specification', function () {
			expect(specPassTwo._spy).not.toHaveBeenCalledWith(data);
		});

		it('should evaluate to false', function () {
			expect(result).toEqual(false);
		});
	});
});

},{"./../../../specifications/AndSpecification":56,"./../../../specifications/Specification":65}],106:[function(require,module,exports){
'use strict';

var ContainedSpecification = require('./../../../specifications/ContainedSpecification');

describe('When a ContainedSpecification is constructed', function () {
	'use strict';

	var specification;
	var specificationValue;

	beforeEach(function () {
		specification = new ContainedSpecification(specificationValue = ['xyz', 123]);
	});

	describe('and a string, contained in the array, is evaluated', function () {
		var result;

		beforeEach(function () {
			result = specification.evaluate('xyz');
		});

		it('should pass', function () {
			expect(result).toEqual(true);
		});
	});

	describe('and a string, not contained in the array, is evaluated', function () {
		var result;

		beforeEach(function () {
			result = specification.evaluate('abc');
		});

		it('should not pass', function () {
			expect(result).toEqual(false);
		});
	});

	describe('and a number, contained in the array, is evaluated', function () {
		var result;

		beforeEach(function () {
			result = specification.evaluate(123);
		});

		it('should pass', function () {
			expect(result).toEqual(true);
		});
	});

	describe('and a number, not contained in the array, is evaluated', function () {
		var result;

		beforeEach(function () {
			result = specification.evaluate(1);
		});

		it('should not pass', function () {
			expect(result).toEqual(false);
		});
	});
});

},{"./../../../specifications/ContainedSpecification":57}],107:[function(require,module,exports){
'use strict';

var ContainsSpecification = require('./../../../specifications/ContainsSpecification');

describe('When a ContainsSpecification is constructed', function () {
	'use strict';

	var specification;
	var specificationValue;

	beforeEach(function () {
		specification = new ContainsSpecification(specificationValue = 'xyz');
	});

	describe('and an array, containing the desired value, is evaluated', function () {
		var result;

		beforeEach(function () {
			result = specification.evaluate(['abc', 'def', specificationValue, 1, 2, 3]);
		});

		it('should pass', function () {
			expect(result).toEqual(true);
		});
	});

	describe('and an array, missing the desired value, is evaluated', function () {
		var result;

		beforeEach(function () {
			result = specification.evaluate(['abc', 'def', 1, 2, 3]);
		});

		it('should fail', function () {
			expect(result).toEqual(false);
		});
	});

	describe('and an object is evaluated', function () {
		var result;

		beforeEach(function () {
			result = specification.evaluate({ abc: 'xyz', xyz: 'abc' });
		});

		it('should fail', function () {
			expect(result).toEqual(false);
		});
	});
});

},{"./../../../specifications/ContainsSpecification":58}],108:[function(require,module,exports){
'use strict';

var FailSpecification = require('./../../../specifications/FailSpecification');

describe('When a FailSpecification is constructed', function () {
	'use strict';

	var specification;
	var specificationValue;

	beforeEach(function () {
		specification = new FailSpecification(specificationValue = 'ignored');
	});

	describe('and a string is evaluated', function () {
		var result;

		beforeEach(function () {
			result = specification.evaluate('abc');
		});

		it('should not pass', function () {
			expect(result).toEqual(false);
		});
	});

	describe('and a null value is evaluated', function () {
		var result;

		beforeEach(function () {
			result = specification.evaluate(null);
		});

		it('should not pass', function () {
			expect(result).toEqual(false);
		});
	});

	describe('and an undefined value is evaluated', function () {
		var result;

		beforeEach(function () {
			result = specification.evaluate(undefined);
		});

		it('should not pass', function () {
			expect(result).toEqual(false);
		});
	});
});

},{"./../../../specifications/FailSpecification":59}],109:[function(require,module,exports){
'use strict';

var NanSpecification = require('./../../../specifications/NanSpecification');

describe('When a NanSpecification is constructed', function () {
	'use strict';

	var specification;

	beforeEach(function () {
		specification = new NanSpecification();
	});

	describe('and a string is evaluated', function () {
		var result;

		beforeEach(function () {
			result = specification.evaluate('abc');
		});

		it('should not pass', function () {
			expect(result).toEqual(false);
		});
	});

	describe('and a null value is evaluated', function () {
		var result;

		beforeEach(function () {
			result = specification.evaluate(null);
		});

		it('should not pass', function () {
			expect(result).toEqual(false);
		});
	});

	describe('and an undefined value is evaluated', function () {
		var result;

		beforeEach(function () {
			result = specification.evaluate(undefined);
		});

		it('should not pass', function () {
			expect(result).toEqual(false);
		});
	});

	describe('and an integer value is evaluated', function () {
		var result;

		beforeEach(function () {
			result = specification.evaluate(1);
		});

		it('should not pass', function () {
			expect(result).toEqual(false);
		});
	});

	describe('and a NaN value is evaluated', function () {
		var result;

		beforeEach(function () {
			result = specification.evaluate(parseFloat(null));
		});

		it('should pass', function () {
			expect(result).toEqual(true);
		});
	});
});

},{"./../../../specifications/NanSpecification":60}],110:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var NotSpecification = require('./../../../specifications/NotSpecification');
var Specification = require('./../../../specifications/Specification');

describe('When a NotSpecification is constructed', function () {
	'use strict';

	var DelegateSpecification = function (_Specification) {
		_inherits(DelegateSpecification, _Specification);

		function DelegateSpecification(fn) {
			_classCallCheck(this, DelegateSpecification);

			var _this = _possibleConstructorReturn(this, (DelegateSpecification.__proto__ || Object.getPrototypeOf(DelegateSpecification)).call(this));

			_this._fn = fn;
			return _this;
		}

		_createClass(DelegateSpecification, [{
			key: '_evaluate',
			value: function _evaluate(data) {
				return this._fn(data);
			}
		}]);

		return DelegateSpecification;
	}(Specification);

	describe('with a specification that always fails', function () {
		var specification;
		var spy;

		var result;

		beforeEach(function () {
			specification = new NotSpecification(new DelegateSpecification(spy = jasmine.createSpy('fn').and.callFake(function (data) {
				return false;
			})));

			result = specification.evaluate('abc');
		});

		it('should call the wrapped specification', function () {
			expect(spy).toHaveBeenCalled();
		});

		it('should pass', function () {
			expect(result).toEqual(true);
		});
	});

	describe('with a specification that always passes', function () {
		var specification;
		var spy;

		var result;

		beforeEach(function () {
			specification = new NotSpecification(new DelegateSpecification(spy = jasmine.createSpy('fn').and.callFake(function (data) {
				return true;
			})));

			result = specification.evaluate('abc');
		});

		it('should call the wrapped specification', function () {
			expect(spy).toHaveBeenCalled();
		});

		it('should pass', function () {
			expect(result).toEqual(false);
		});
	});
});

describe('When a Specification (that always fails) is constructed', function () {
	'use strict';

	var DelegateSpecification = function (_Specification2) {
		_inherits(DelegateSpecification, _Specification2);

		function DelegateSpecification(fn) {
			_classCallCheck(this, DelegateSpecification);

			var _this2 = _possibleConstructorReturn(this, (DelegateSpecification.__proto__ || Object.getPrototypeOf(DelegateSpecification)).call(this));

			_this2._fn = fn;
			return _this2;
		}

		_createClass(DelegateSpecification, [{
			key: '_evaluate',
			value: function _evaluate(data) {
				return this._fn(data);
			}
		}]);

		return DelegateSpecification;
	}(Specification);

	describe('and inverted', function () {
		var specification;
		var spy;

		var result;

		beforeEach(function () {
			specification = new DelegateSpecification(spy = jasmine.createSpy('fn').and.callFake(function (data) {
				return false;
			}));

			specification = specification.not();

			result = specification.evaluate('abc');
		});

		it('should call the original specification', function () {
			expect(spy).toHaveBeenCalled();
		});

		it('should pass', function () {
			expect(result).toEqual(true);
		});
	});
});

describe('When a Specification (that always succeeds) is constructed', function () {
	'use strict';

	var DelegateSpecification = function (_Specification3) {
		_inherits(DelegateSpecification, _Specification3);

		function DelegateSpecification(fn) {
			_classCallCheck(this, DelegateSpecification);

			var _this3 = _possibleConstructorReturn(this, (DelegateSpecification.__proto__ || Object.getPrototypeOf(DelegateSpecification)).call(this));

			_this3._fn = fn;
			return _this3;
		}

		_createClass(DelegateSpecification, [{
			key: '_evaluate',
			value: function _evaluate(data) {
				return this._fn(data);
			}
		}]);

		return DelegateSpecification;
	}(Specification);

	describe('and inverted', function () {
		var specification;
		var spy;

		var result;

		beforeEach(function () {
			specification = new DelegateSpecification(spy = jasmine.createSpy('fn').and.callFake(function (data) {
				return true;
			}));

			specification = specification.not();

			result = specification.evaluate('abc');
		});

		it('should call the original specification', function () {
			expect(spy).toHaveBeenCalled();
		});

		it('should pass', function () {
			expect(result).toEqual(false);
		});
	});
});

},{"./../../../specifications/NotSpecification":61,"./../../../specifications/Specification":65}],111:[function(require,module,exports){
'use strict';

var NumericSpecification = require('./../../../specifications/NumericSpecification');

describe('When a NumericSpecification is constructed', function () {
	'use strict';

	var specification;

	beforeEach(function () {
		specification = new NumericSpecification();
	});

	describe('and a string is evaluated', function () {
		var result;

		beforeEach(function () {
			result = specification.evaluate('abc');
		});

		it('should not pass', function () {
			expect(result).toEqual(false);
		});
	});

	describe('and a null value is evaluated', function () {
		var result;

		beforeEach(function () {
			result = specification.evaluate(null);
		});

		it('should not pass', function () {
			expect(result).toEqual(false);
		});
	});

	describe('and an undefined value is evaluated', function () {
		var result;

		beforeEach(function () {
			result = specification.evaluate(undefined);
		});

		it('should not pass', function () {
			expect(result).toEqual(false);
		});
	});

	describe('and a number value is evaluated', function () {
		var result;

		beforeEach(function () {
			result = specification.evaluate(0);
		});

		it('should pass', function () {
			expect(result).toEqual(true);
		});
	});
});

},{"./../../../specifications/NumericSpecification":62}],112:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Specification = require('./../../../specifications/Specification');
var OrSpecification = require('./../../../specifications/OrSpecification');

describe('When an OrSpecification is constructed', function () {
	'use strict';

	var SpecPass = function (_Specification) {
		_inherits(SpecPass, _Specification);

		function SpecPass() {
			_classCallCheck(this, SpecPass);

			var _this = _possibleConstructorReturn(this, (SpecPass.__proto__ || Object.getPrototypeOf(SpecPass)).call(this));

			_this._spy = jasmine.createSpy('spyPass').and.returnValue(true);
			return _this;
		}

		_createClass(SpecPass, [{
			key: '_evaluate',
			value: function _evaluate(data) {
				return this._spy(data);
			}
		}]);

		return SpecPass;
	}(Specification);

	var SpecFail = function (_Specification2) {
		_inherits(SpecFail, _Specification2);

		function SpecFail() {
			_classCallCheck(this, SpecFail);

			var _this2 = _possibleConstructorReturn(this, (SpecFail.__proto__ || Object.getPrototypeOf(SpecFail)).call(this));

			_this2._spy = jasmine.createSpy('spyPass').and.returnValue(false);
			return _this2;
		}

		_createClass(SpecFail, [{
			key: '_evaluate',
			value: function _evaluate(data) {
				return this._spy(data);
			}
		}]);

		return SpecFail;
	}(Specification);

	describe('with two specifications that will pass', function () {
		var specification;

		var specPassOne;
		var specPassTwo;

		var data;
		var result;

		beforeEach(function () {
			specification = new OrSpecification(specPassOne = new SpecPass(), specPassTwo = new SpecPass());

			result = specification.evaluate(data = {});
		});

		it('should call the first specification', function () {
			expect(specPassOne._spy).toHaveBeenCalledWith(data);
		});

		it('should not call the second specification', function () {
			expect(specPassTwo._spy).not.toHaveBeenCalledWith(data);
		});

		it('should evaluate to false', function () {
			expect(result).toEqual(true);
		});
	});

	describe('with two specifications that will fail', function () {
		var specification;

		var specPassOne;
		var specPassTwo;

		var data;
		var result;

		beforeEach(function () {
			specification = new OrSpecification(specPassOne = new SpecFail(), specPassTwo = new SpecFail());

			result = specification.evaluate(data = {});
		});

		it('should call the first specification', function () {
			expect(specPassOne._spy).toHaveBeenCalledWith(data);
		});

		it('should call the second specification', function () {
			expect(specPassTwo._spy).toHaveBeenCalledWith(data);
		});

		it('should evaluate to false', function () {
			expect(result).toEqual(false);
		});
	});
});

},{"./../../../specifications/OrSpecification":63,"./../../../specifications/Specification":65}],113:[function(require,module,exports){
'use strict';

var PassSpecification = require('./../../../specifications/PassSpecification');

describe('When a PassSpecification is constructed', function () {
	'use strict';

	var specification;
	var specificationValue;

	beforeEach(function () {
		specification = new PassSpecification(specificationValue = 'ignored');
	});

	describe('and a string is evaluated', function () {
		var result;

		beforeEach(function () {
			result = specification.evaluate('abc');
		});

		it('should pass', function () {
			expect(result).toEqual(true);
		});
	});

	describe('and a null value is evaluated', function () {
		var result;

		beforeEach(function () {
			result = specification.evaluate(null);
		});

		it('should pass', function () {
			expect(result).toEqual(true);
		});
	});

	describe('and an undefined value is evaluated', function () {
		var result;

		beforeEach(function () {
			result = specification.evaluate(undefined);
		});

		it('should pass', function () {
			expect(result).toEqual(true);
		});
	});
});

},{"./../../../specifications/PassSpecification":64}],114:[function(require,module,exports){
'use strict';

var RateLimiter = require('./../../../timing/RateLimiter');

describe('When a RateLimiter is constructed (1 execution per 25 milliseconds)', function () {
	'use strict';

	var limiter;

	var windowMaximumCount;
	var windowDurationMilliseconds;
	var concurrency;

	beforeEach(function () {
		limiter = new RateLimiter(windowMaximumCount = 1, windowDurationMilliseconds = 25, concurrency = null);
	});

	describe('and tasks are scheduled', function () {
		var spies;
		var promises;

		var start;

		beforeEach(function () {
			start = new Date();

			spies = [];
			promises = [];

			for (var i = 0; i < 10; i++) {
				var spy = jasmine.createSpy('spy');

				spies.push(spy);

				promises.push(limiter.enqueue(spy));
			}
		});

		it('the tasks should serialized', function (done) {
			var promise = null;

			var getValidatedPromise = function getValidatedPromise(promise, index) {
				return promise.then(function () {
					for (var i = 0; i < spies.length; i++) {
						var count;

						if (i > index) {
							count = 0;
						} else {
							count = 1;
						}

						expect(spies[i].calls.count()).toEqual(count);
					}
				});
			};

			for (var i = 0; i < promises.length; i++) {
				var p = getValidatedPromise(promises[i], i);

				if (promise === null) {
					promise = p;
				} else {
					promise = promise.then(function () {
						return p;
					});
				}
			}

			promise.then(function () {
				done();
			});
		});

		it('the tasks not finish before the earliest possible moment', function (done) {
			var promise = null;

			var getValidatedPromise = function getValidatedPromise(promise, index) {
				return promise.then(function () {
					var end = new Date();
					var duration = end.getTime() - start.getTime();

					var shortestPossibleDuration = Math.floor(index / windowMaximumCount) * windowDurationMilliseconds;

					expect(duration + 1).not.toBeLessThan(shortestPossibleDuration);
				});
			};

			for (var i = 0; i < promises.length; i++) {
				var p = getValidatedPromise(promises[i], i);

				if (promise === null) {
					promise = p;
				} else {
					promise = promise.then(function () {
						return p;
					});
				}
			}

			promise.then(function () {
				done();
			});
		});
	});

	describe('and failing tasks are scheduled', function () {
		var spies;
		var promises;
		var error;

		var start;

		beforeEach(function () {
			start = new Date();

			spies = [];
			promises = [];

			error = new Error('oops');

			for (var i = 0; i < 2; i++) {
				var spy = jasmine.createSpy('spy').and.callFake(function () {
					throw error;
				});

				spies.push(spy);

				promises.push(limiter.enqueue(spy));
			}
		});

		it('each task should be executed', function (done) {
			var promise = null;

			var getValidatedPromise = function getValidatedPromise(promise, index) {
				return promise.catch(function (error) {
					var end = new Date();
					var duration = end.getTime() - start.getTime();

					var shortestPossibleDuration = Math.floor(index / windowMaximumCount) * windowDurationMilliseconds;

					expect(duration + 1).not.toBeLessThan(shortestPossibleDuration);
					expect(error).toBe(error);
				});
			};

			for (var i = 0; i < promises.length; i++) {
				var p = getValidatedPromise(promises[i], i);

				if (promise === null) {
					promise = p;
				} else {
					promise = promise.then(function () {
						return p;
					});
				}
			}

			promise.then(function () {
				done();
			});
		});
	});
});

describe('When a RateLimiter is constructed (2 execution per 25 milliseconds)', function () {
	'use strict';

	var limiter;

	var windowMaximumCount;
	var windowDurationMilliseconds;
	var concurrency;

	beforeEach(function () {
		limiter = new RateLimiter(windowMaximumCount = 2, windowDurationMilliseconds = 25, concurrency = null);
	});

	describe('and tasks are scheduled', function () {
		var spies;
		var promises;

		var start;

		beforeEach(function () {
			start = new Date();

			spies = [];
			promises = [];

			for (var i = 0; i < 10; i++) {
				var spy = jasmine.createSpy('spy');

				spies.push(spy);

				promises.push(limiter.enqueue(spy));
			}
		});

		it('the tasks not finish before the earliest possible moment', function (done) {
			var promise = null;

			var getValidatedPromise = function getValidatedPromise(promise, index) {
				return promise.then(function () {
					var end = new Date();
					var duration = end.getTime() - start.getTime();

					var shortestPossibleDuration = Math.floor(index / windowMaximumCount) * windowDurationMilliseconds;

					expect(duration + 1).not.toBeLessThan(shortestPossibleDuration);
				});
			};

			for (var i = 0; i < promises.length; i++) {
				var p = getValidatedPromise(promises[i], i);

				if (promise === null) {
					promise = p;
				} else {
					promise = promise.then(function () {
						return p;
					});
				}
			}

			promise.then(function () {
				done();
			});
		});
	});
});

},{"./../../../timing/RateLimiter":118}],115:[function(require,module,exports){
'use strict';

var Scheduler = require('./../../../timing/Scheduler');

describe('When a Scheduler is constructed', function () {
	'use strict';

	var scheduler;

	beforeEach(function () {
		scheduler = new Scheduler();
	});

	describe('and task is scheduled', function () {
		var spy;
		var milliseconds;
		var promise;

		beforeEach(function () {
			promise = scheduler.schedule(spy = jasmine.createSpy('spy'), milliseconds = 10, 'A scheduled task');
		});

		it('should not execute the task synchronously', function () {
			expect(spy).not.toHaveBeenCalled();
		});

		it('should execute the task asynchronously', function (done) {
			promise.then(function () {
				expect(spy.calls.count()).toEqual(1);
			}).then(function () {
				done();
			});
		});
	});

	describe('and is disposed', function () {
		beforeEach(function () {
			scheduler.dispose();
		});

		it('and a task is scheduled', function () {
			var spy;
			var success;

			beforeEach(function (done) {
				scheduler.schedule(spy = jasmine.createSpy('spy'), 10, 'A scheduled task').then(function () {
					success = true;
				}).catch(function () {
					success = false;
				}).then(function () {
					done();
				});
			});

			it('should reject the promise', function () {
				expect(success).toEqual(false);
			});

			it('should not invoke the underlying task', function () {
				expect(spy).not.toHaveBeenCalled();
			});
		});
	});
});

describe('When a backoff is used', function () {
	'use strict';

	var scheduler;

	beforeEach(function () {
		scheduler = new Scheduler();
	});

	describe('that succeeds immediately', function () {
		var spyAction;
		var spyFailure;

		var actualResult;
		var successfulResult;

		beforeEach(function (done) {
			spyAction = jasmine.createSpy('spyAction').and.callFake(function () {
				return successfulResult = 'ok computer';
			});

			spyFailure = jasmine.createSpy('spyFailure');

			scheduler.backoff(spyAction, 5, 'succeeds immediately', 1, spyFailure).then(function (r) {
				actualResult = r;

				done();
			});
		});

		it('should call the "backoff" action one time', function () {
			expect(spyAction.calls.count()).toEqual(1);
		});

		it('the promise result should match the expected result', function () {
			expect(actualResult).toEqual(successfulResult);
		});

		it('should never call the "failure" action', function () {
			expect(spyFailure.calls.count()).toEqual(0);
		});
	});

	describe('that fails once before succeeding (by throwing error)', function () {
		var spyAction;
		var spyFailure;

		var actualResult;
		var successfulResult;

		var x;

		beforeEach(function (done) {
			x = 0;

			spyAction = jasmine.createSpy('spyAction').and.callFake(function () {
				if (++x > 1) {
					return successfulResult = 'ok computer';
				} else {
					throw new Error('nope...');
				}
			});

			spyFailure = jasmine.createSpy('spyFailure');

			scheduler.backoff(spyAction, 5, 'succeeds immediately', 5, spyFailure).then(function (r) {
				actualResult = r;

				done();
			});
		});

		it('should call the "backoff" action two times', function () {
			expect(spyAction.calls.count()).toEqual(2);
		});

		it('the promise result should match the expected result', function () {
			expect(actualResult).toEqual(successfulResult);
		});

		it('the "failure" action should be called once', function () {
			expect(spyFailure.calls.count()).toEqual(1);
		});
	});

	describe('that fails twice before succeeding (by returning a specific "failure" value)', function () {
		var spyAction;
		var spyFailure;

		var actualResult;
		var successfulResult;

		var x;

		beforeEach(function (done) {
			x = 0;

			spyAction = jasmine.createSpy('spyAction').and.callFake(function () {
				if (++x > 2) {
					return successfulResult = ['ok computer'];
				} else {
					return [];
				}
			});

			spyFailure = jasmine.createSpy('spyFailure');

			scheduler.backoff(spyAction, 5, 'succeeds immediately', 5, spyFailure, []).then(function (r) {
				actualResult = r;

				done();
			});
		});

		it('should call the "backoff" action three times', function () {
			expect(spyAction.calls.count()).toEqual(3);
		});

		it('the promise result should match the expected result', function () {
			expect(actualResult).toEqual(successfulResult);
		});

		it('the "failure" action should be called twice', function () {
			expect(spyFailure.calls.count()).toEqual(2);
		});
	});

	describe('final failure is declared after four attempts', function () {
		var spyAction;
		var spyFailure;

		var actualResult;
		var successfulResult;

		beforeEach(function (done) {
			spyAction = jasmine.createSpy('spyAction').and.callFake(function () {
				throw new Error('not gonna happen');
			});

			spyFailure = jasmine.createSpy('spyFailure');

			scheduler.backoff(spyAction, 5, 'succeeds immediately', 3, spyFailure, []).catch(function (r) {
				actualResult = r;

				done();
			});
		});

		it('should call the "backoff" action four times', function () {
			expect(spyAction.calls.count()).toEqual(4);
		});

		it('the "failure" action should be called four times', function () {
			expect(spyFailure.calls.count()).toEqual(4);
		});
	});
});

},{"./../../../timing/Scheduler":119}],116:[function(require,module,exports){
'use strict';

var Serializer = require('./../../../timing/Serializer');

describe('When a Serializer is used to schedule four tasks', function () {
	'use strict';

	var serializer;

	var spies;
	var promises;
	var results;

	beforeEach(function () {
		serializer = new Serializer();

		spies = [];
		promises = [];
		results = [];

		for (var i = 0; i < 4; i++) {
			var spy = getSpy(results, false);

			spies.push(spy);
			promises.push(serializer.enqueue(spy));
		}
	});

	describe('and the tasks complete', function () {
		beforeEach(function (done) {
			Promise.all(promises).then(function () {
				done();
			});
		});

		it('the first task should have been executed', function () {
			expect(spies[0]).toHaveBeenCalled();
		});

		it('the second task should have been executed', function () {
			expect(spies[1]).toHaveBeenCalled();
		});

		it('the third task should have been executed', function () {
			expect(spies[2]).toHaveBeenCalled();
		});

		it('the fourth task should have been executed', function () {
			expect(spies[3]).toHaveBeenCalled();
		});

		it('the first task should complete before the second task starts', function () {
			expect(results[0].end <= results[1].start).toEqual(true);
		});

		it('the second task should complete before the third task starts', function () {
			expect(results[1].end <= results[2].start).toEqual(true);
		});

		it('the third task should complete before the fourth task starts', function () {
			expect(results[2].end <= results[3].start).toEqual(true);
		});
	});
});

describe('When a Serializer is used to schedule a task that throws', function () {
	var serializer;
	var promise;
	var reject;

	beforeEach(function (done) {
		serializer = new Serializer();

		reject = false;

		promise = serializer.enqueue(function () {
			throw new Error('Boom');
		}).catch(function (e) {
			reject = true;

			done();
		});
	});

	it('should reject the promise', function () {
		expect(reject).toEqual(true);
	});
});

describe('When a Serializer is used to schedule a task that rejects', function () {
	var serializer;
	var promise;
	var reject;

	beforeEach(function (done) {
		serializer = new Serializer();

		reject = false;

		promise = serializer.enqueue(function () {
			return Promise.reject('Boom Boom');
		}).catch(function (e) {
			reject = true;

			done();
		});
	});

	it('should reject the promise', function () {
		expect(reject).toEqual(true);
	});
});

function getSpy(results, fail) {
	return jasmine.createSpy('spy').and.callFake(function () {
		return new Promise(function (resolveCallback, rejectCallback) {
			var start = new Date();

			setTimeout(function () {
				var end = new Date();

				results.push({
					start: start.getTime(),
					end: end.getTime()
				});

				if (fail) {
					rejectCallback();
				} else {
					resolveCallback();
				}
			}, 5);
		});
	});
}

},{"./../../../timing/Serializer":120}],117:[function(require,module,exports){
'use strict';

var WindowCounter = require('./../../../timing/WindowCounter');

describe('When a WindowCounter is constructed', function () {
	'use strict';

	var duration;
	var windows;

	var counter;

	beforeEach(function () {
		counter = new WindowCounter(duration = 15, windows = 100);
	});

	describe('and the counter is immediately incremented', function () {
		var a;

		beforeEach(function () {
			counter.increment(a = 42);
		});

		it('the current count should be the amount added', function () {
			expect(counter.getCurrent()).toEqual(a);
		});

		describe('and the counter is immediately incremented, again', function () {
			var b;

			beforeEach(function () {
				counter.increment(b = 99);
			});

			it('the current count should be the sum of the amounts added', function () {
				expect(counter.getCurrent()).toEqual(a + b);
			});
		});

		describe('and the counter is incremented after the current window expires', function () {
			var b;

			beforeEach(function (done) {
				setTimeout(function () {
					counter.increment(b = 3);

					done();
				}, duration + duration / 2);
			});

			it('the previous count should be the sum of the previous window', function () {
				expect(counter.getPrevious()).toEqual(a);
			});

			it('the current count should be the amount added', function () {
				expect(counter.getCurrent()).toEqual(b);
			});

			it('the average count should be the sum of the previous window', function () {
				expect(counter.getAverage()).toEqual(a);
			});
		});
	});
});

},{"./../../../timing/WindowCounter":121}],118:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var assert = require('./../lang/assert'),
    Disposable = require('./../lang/Disposable'),
    promise = require('./../lang/promise');

var Queue = require('./../collections/Queue'),
    Scheduler = require('./Scheduler');

module.exports = function () {
	'use strict';

	/**
  * A work queue that restricts the rate at which items are
  * processed.
  *
  * @public
  * @param {number} - windowMaximumCount - The maximum number of items which can be processed during a timeframe.
  * @param {number} - windowDurationMilliseconds - The number of milliseconds in the timeframe.
  * @extends {Disposable}
  */

	var RateLimiter = function (_Disposable) {
		_inherits(RateLimiter, _Disposable);

		function RateLimiter(windowMaximumCount, windowDurationMilliseconds) {
			_classCallCheck(this, RateLimiter);

			var _this = _possibleConstructorReturn(this, (RateLimiter.__proto__ || Object.getPrototypeOf(RateLimiter)).call(this));

			assert.argumentIsRequired(windowMaximumCount, 'windowMaximumCount', Number);
			assert.argumentIsRequired(windowDurationMilliseconds, 'windowDurationMilliseconds', Number);

			_this._windowMaximumCount = windowMaximumCount;
			_this._windowDurationMilliseconds = windowDurationMilliseconds;

			_this._scheduler = new Scheduler();

			_this._workQueue = new Queue();

			_this._windowStart = null;
			_this._windowCounter = 0;
			return _this;
		}

		/**
   * Adds an item to the work queue and returns a promise that will
   * resolve after the item completes execution.
   *
   * @param {Function} actionToEnqueue - The action to execute.
   * @returns {Promise}
   */

		_createClass(RateLimiter, [{
			key: 'enqueue',
			value: function enqueue(actionToEnqueue) {
				var _this2 = this;

				return promise.build(function (resolveCallback, rejectCallback) {
					assert.argumentIsRequired(actionToEnqueue, 'actionToEnqueue', Function);

					if (_this2.getIsDisposed()) {
						throw new Error('Unable to enqueue action, the rate limiter has been disposed.');
					}

					_this2._workQueue.enqueue(function () {
						Promise.resolve().then(function () {
							return actionToEnqueue();
						}).then(function (result) {
							resolveCallback(result);
						}).catch(function (error) {
							rejectCallback(error);
						}).then(function () {
							checkStart.call(_this2);
						});
					});

					checkStart.call(_this2);
				});
			}
		}, {
			key: '_onDispose',
			value: function _onDispose() {
				this._scheduler.dispose();

				this._workQueue = null;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[RateLimiter]';
			}
		}]);

		return RateLimiter;
	}(Disposable);

	function checkStart() {
		var _this3 = this;

		if (this.getIsDisposed()) {
			return;
		}

		if (this._workQueue.empty()) {
			return;
		}

		if (this._windowStart === null) {
			var timestamp = new Date();

			this._windowStart = timestamp.getTime();
			this._windowCounter = 0;

			var resetWindow = function resetWindow() {
				_this3._windowStart = null;
				_this3._windowCounter = 0;

				checkStart.call(_this3);
			};

			this._scheduler.schedule(resetWindow, this._windowDurationMilliseconds, 'Rate Limiter Window Reset');
		}

		if (this._windowCounter < this._windowMaximumCount) {
			this._windowCounter = this._windowCounter + 1;

			var actionToExecute = this._workQueue.dequeue();

			actionToExecute();
		}
	}

	return RateLimiter;
}();

},{"./../collections/Queue":2,"./../lang/Disposable":18,"./../lang/assert":24,"./../lang/promise":34,"./Scheduler":119}],119:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var assert = require('./../lang/assert'),
    Disposable = require('./../lang/Disposable'),
    is = require('./../lang/is'),
    object = require('./../lang/object'),
    promise = require('./../lang/promise');

module.exports = function () {
	'use strict';

	/**
  * An object that wraps asynchronous delays (i.e. timeout and interval).
  *
  * @public
  * @extends {Disposable}
  */

	var Scheduler = function (_Disposable) {
		_inherits(Scheduler, _Disposable);

		function Scheduler() {
			_classCallCheck(this, Scheduler);

			var _this = _possibleConstructorReturn(this, (Scheduler.__proto__ || Object.getPrototypeOf(Scheduler)).call(this));

			_this._timeoutBindings = {};
			_this._intervalBindings = {};
			return _this;
		}

		/**
   * Schedules an action to execute in the future, returning a Promise.
   *
   * @param {Function} actionToSchedule - The action to execute.
   * @param {number} millisecondDelay - Milliseconds before the action can be started.
   * @param {string=} actionDescription - A description of the action, used for logging purposes.
   * @returns {Promise}
   */

		_createClass(Scheduler, [{
			key: 'schedule',
			value: function schedule(actionToSchedule, millisecondDelay, actionDescription) {
				var _this2 = this;

				return Promise.resolve().then(function () {
					assert.argumentIsRequired(actionToSchedule, 'actionToSchedule', Function);
					assert.argumentIsRequired(millisecondDelay, 'millisecondDelay', Number);
					assert.argumentIsOptional(actionDescription, 'actionDescription', String);

					if (_this2.getIsDisposed()) {
						throw new Error('The Scheduler has been disposed.');
					}

					var token = void 0;

					var schedulePromise = promise.build(function (resolveCallback, rejectCallback) {
						var wrappedAction = function wrappedAction() {
							delete _this2._timeoutBindings[token];

							try {
								resolveCallback(actionToSchedule());
							} catch (e) {
								rejectCallback(e);
							}
						};

						token = setTimeout(wrappedAction, millisecondDelay);
					});

					_this2._timeoutBindings[token] = Disposable.fromAction(function () {
						clearTimeout(token);

						delete _this2._timeoutBindings[token];
					});

					return schedulePromise;
				});
			}
		}, {
			key: 'repeat',
			value: function repeat(actionToRepeat, millisecondInterval, actionDescription) {
				var _this3 = this;

				assert.argumentIsRequired(actionToRepeat, 'actionToRepeat', Function);
				assert.argumentIsRequired(millisecondInterval, 'millisecondInterval', Number);
				assert.argumentIsOptional(actionDescription, 'actionDescription', String);

				if (this.getIsDisposed()) {
					throw new Error('The Scheduler has been disposed.');
				}

				var wrappedAction = function wrappedAction() {
					try {
						actionToRepeat();
					} catch (e) {}
				};

				var token = setInterval(wrappedAction, millisecondInterval);

				this._intervalBindings[token] = Disposable.fromAction(function () {
					clearInterval(token);

					delete _this3._intervalBindings[token];
				});

				return this._intervalBindings[token];
			}

			/**
    * Attempts an action, repeating if necessary, using an exponential backoff.
    *
    * @param {Function} actionToBackoff - The action to attempt. If it fails -- because an error is thrown, a promise is rejected, or the function returns a falsey value -- the action will be invoked again.
    * @param {number=} millisecondDelay - The amount of time to wait to execute the action. Subsequent failures are multiply this value by 2 ^ [number of failures]. So, a 1000 millisecond backoff would schedule attempts using the following delays: 0, 1000, 2000, 4000, 8000, etc. If not specified, the first attemopt will execute immediately, then a value of 1000 will be used.
    * @param {string=} actionDescription - Description of the action to attempt, used for logging purposes.
    * @param {number=} maximumAttempts - The number of attempts to before giving up.
    * @param {Function=} maximumAttempts - If provided, will be invoked if a function is considered to be failing.
    * @param {Object=} failureValue - If provided, will consider the result to have failed, if this value is returned (a deep equality check is used). If not provided, a "falsey" value will trigger a retry.
    */

		}, {
			key: 'backoff',
			value: function backoff(actionToBackoff, millisecondDelay, actionDescription, maximumAttempts, failureCallback, failureValue) {
				var _this4 = this;

				return Promise.resolve().then(function () {
					assert.argumentIsRequired(actionToBackoff, 'actionToBackoff', Function);
					assert.argumentIsOptional(millisecondDelay, 'millisecondDelay', Number);
					assert.argumentIsOptional(actionDescription, 'actionDescription', String);
					assert.argumentIsOptional(maximumAttempts, 'maximumAttempts', Number);
					assert.argumentIsOptional(failureCallback, 'failureCallback', Function);

					if (_this4.getIsDisposed()) {
						throw new Error('The Scheduler has been disposed.');
					}

					var scheduleBackoff = function scheduleBackoff(failureCount) {
						if (failureCount > 0 && is.fn(failureCallback)) {
							failureCallback(failureCount);
						}

						if (maximumAttempts > 0 && failureCount > maximumAttempts) {
							return Promise.reject('Maximum failures reached for ' + actionDescription);
						}

						var backoffDelay = void 0;

						if (failureCount === 0) {
							backoffDelay = millisecondDelay || 0;
						} else {
							backoffDelay = (millisecondDelay || 1000) * Math.pow(2, failureCount);
						}

						var successPredicate = void 0;

						if (is.undefined(failureValue)) {
							successPredicate = function successPredicate(value) {
								return value;
							};
						} else {
							successPredicate = function successPredicate(value) {
								return !object.equals(value, failureValue);
							};
						}

						return _this4.schedule(actionToBackoff, backoffDelay, (actionDescription || 'unspecified') + ', attempt ' + (failureCount + 1)).then(function (result) {
							if (successPredicate(result)) {
								return result;
							} else {
								return scheduleBackoff(++failureCount);
							}
						}).catch(function (e) {
							return scheduleBackoff(++failureCount);
						});
					};

					return scheduleBackoff(0);
				});
			}
		}, {
			key: '_onDispose',
			value: function _onDispose() {
				var _this5 = this;

				object.keys(this._timeoutBindings).forEach(function (key) {
					_this5._timeoutBindings[key].dispose();
				});

				object.keys(this._intervalBindings).forEach(function (key) {
					_this5._intervalBindings[key].dispose();
				});

				this._timeoutBindings = null;
				this._intervalBindings = null;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[Scheduler]';
			}
		}], [{
			key: 'schedule',
			value: function schedule(actionToSchedule, millisecondDelay, actionDescription) {
				var scheduler = new Scheduler();

				scheduler.schedule(actionToSchedule, millisecondDelay, actionDescription).then(function (result) {
					scheduler.dispose();

					return result;
				}).catch(function (e) {
					scheduler.dispose();

					throw e;
				});
			}
		}]);

		return Scheduler;
	}(Disposable);

	return Scheduler;
}();

},{"./../lang/Disposable":18,"./../lang/assert":24,"./../lang/is":29,"./../lang/object":33,"./../lang/promise":34}],120:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var assert = require('./../lang/assert'),
    Disposable = require('./../lang/Disposable'),
    promise = require('./../lang/promise');

var Queue = require('./../collections/Queue');

module.exports = function () {
	'use strict';

	/**
  * A work queue that processes actions in sequence.
  *
  * @public
  * @extends {Disposable}
  */

	var Serializer = function (_Disposable) {
		_inherits(Serializer, _Disposable);

		function Serializer() {
			_classCallCheck(this, Serializer);

			var _this = _possibleConstructorReturn(this, (Serializer.__proto__ || Object.getPrototypeOf(Serializer)).call(this));

			_this._workQueue = new Queue();

			_this._enqueued = 0;
			_this._processed = 0;

			_this._running = false;
			return _this;
		}

		/**
   * Gets the sequence of the item that was last processed.
   *
   * @public
   * @returns {Number}
   */

		_createClass(Serializer, [{
			key: 'getCurrent',
			value: function getCurrent() {
				return this._processed;
			}

			/**
    * The the total number of items that have been added to the queue.
    *
    * @public
    * @returns {Number}
    */

		}, {
			key: 'getTotal',
			value: function getTotal() {
				return this._enqueued;
			}

			/**
    * The number of items that are currently pending.
    *
    * @public
    * @returns {Number}
    */

		}, {
			key: 'getPending',
			value: function getPending() {
				return this._enqueued - this._processed;
			}

			/**
    * Indicates if a work item is currently being processed.
    * 
    * @public
    * @returns {Boolean}
    */

		}, {
			key: 'getRunning',
			value: function getRunning() {
				return this._running;
			}

			/**
    * Adds a new action to the processing queue. If the action
    * is asynchronous, the action should return a promise.
    *
    * @public
    * @param {Function} actionToEnqueue
    * @returns {Promise} - A promise which resolves once the action has been processed.
    */

		}, {
			key: 'enqueue',
			value: function enqueue(actionToEnqueue) {
				var _this2 = this;

				return promise.build(function (resolveCallback, rejectCallback) {
					assert.argumentIsRequired(actionToEnqueue, 'actionToEnqueue', Function);

					if (_this2.getIsDisposed()) {
						throw new Error('Unable to add action to the Serializer, it has been disposed.');
					}

					_this2._enqueued = _this2._enqueued + 1;

					_this2._getWorkQueue().enqueue(function () {
						return Promise.resolve().then(function () {
							if (_this2.getIsDisposed()) {
								throw new Error('Unable to process Serializer action, the serializer has been disposed.');
							}

							_this2._processed = _this2._processed + 1;

							return actionToEnqueue();
						}).then(function (result) {
							resolveCallback(result);
						}).catch(function (error) {
							rejectCallback(error);
						});
					});

					checkStart.call(_this2);
				});
			}

			/**
    * Allows an inheriting class to override the internal {@link Queue} implementation.
    * 
    * @protected
    * @returns {Queue|*}
    */

		}, {
			key: '_getWorkQueue',
			value: function _getWorkQueue() {
				return this._workQueue;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[Serializer]';
			}
		}]);

		return Serializer;
	}(Disposable);

	function checkStart() {
		var _this3 = this;

		var workQueue = this._getWorkQueue();

		if (workQueue.empty() || this._running) {
			return;
		}

		this._running = true;

		var actionToExecute = workQueue.dequeue();

		actionToExecute().then(function () {
			_this3._running = false;

			checkStart.call(_this3);
		});
	}

	return Serializer;
}();

},{"./../collections/Queue":2,"./../lang/Disposable":18,"./../lang/assert":24,"./../lang/promise":34}],121:[function(require,module,exports){
'use strict';

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var assert = require('./../lang/assert'),
    Queue = require('./../collections/Queue');

module.exports = function () {
	'use strict';

	var WindowCounter = function () {
		function WindowCounter(duration, windows) {
			_classCallCheck(this, WindowCounter);

			assert.argumentIsRequired(duration, 'duration', Number);
			assert.argumentIsRequired(windows, 'windows', Number);

			this._duration = duration;

			this._windows = [new Window(getTime(), this._duration)];
			this._maximum = Math.max(windows, 2);

			this._previousCount = 0;
		}

		_createClass(WindowCounter, [{
			key: 'increment',
			value: function increment(count) {
				assert.argumentIsRequired(count, 'count', Number);

				advance.call(this).increment(count);
			}
		}, {
			key: 'getCurrent',
			value: function getCurrent() {
				return advance.call(this).getCount();
			}
		}, {
			key: 'getPrevious',
			value: function getPrevious() {
				advance.call(this);

				var returnVal = void 0;

				if (this._windows.length > 1) {
					returnVal = this._windows[1].getCount();
				} else {
					returnVal = 0;
				}

				return returnVal;
			}
		}, {
			key: 'getAverage',
			value: function getAverage() {
				var current = advance.call(this);
				var previousWindows = this._windows.length - 1;

				var returnVal = void 0;

				if (previousWindows > 0) {
					returnVal = this._previousCount / previousWindows;
				} else {
					returnVal = 0;
				}

				return returnVal;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[WindowCounter]';
			}
		}]);

		return WindowCounter;
	}();

	function advance() {
		var now = getTime();

		while (!this._windows[0].contains(now)) {
			var previous = this._windows[0];
			var current = new Window(previous.getEnd(), this._duration);

			this._windows.unshift(current);

			this._previousCount = this._previousCount + previous.getCount();

			if (this._windows.length > this._maximum) {
				var removed = this._windows.pop();

				this._previousCount = this._previousCount - removed.getCount();
			}
		}

		return this._windows[0];
	}

	function getTime() {
		return new Date().getTime();
	}

	var Window = function () {
		function Window(start, duration) {
			_classCallCheck(this, Window);

			this._start = start;
			this._end = start + duration;

			this._count = 0;
		}

		_createClass(Window, [{
			key: 'contains',
			value: function contains(now) {
				return !(now < this._start || now > this._end);
			}
		}, {
			key: 'increment',
			value: function increment(count) {
				this._count = this._count + count;
			}
		}, {
			key: 'getStart',
			value: function getStart() {
				return this._start;
			}
		}, {
			key: 'getEnd',
			value: function getEnd() {
				return this._end;
			}
		}, {
			key: 'getCount',
			value: function getCount() {
				return this._count;
			}
		}]);

		return Window;
	}();

	return WindowCounter;
}();

},{"./../collections/Queue":2,"./../lang/assert":24}]},{},[66,67,70,71,72,73,74,75,76,68,69,77,78,79,86,87,88,89,80,81,82,83,90,91,92,93,94,95,96,97,98,84,85,99,100,101,102,104,103,105,106,107,108,109,110,111,112,113,114,115,116,117]);
