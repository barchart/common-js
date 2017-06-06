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
  * A queue collection.
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
    * Removes the next item from the queue and returns it.
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
    * Returns the next item in the queue (without removing it).
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

module.exports = function () {
	'use strict';

	var Stack = function () {
		function Stack() {
			_classCallCheck(this, Stack);

			this._array = [];
		}

		_createClass(Stack, [{
			key: 'push',
			value: function push(item) {
				this._array.unshift(item);

				return item;
			}
		}, {
			key: 'pop',
			value: function pop() {
				if (this.empty()) {
					throw new Error('Stack is empty');
				}

				return this._array.shift();
			}
		}, {
			key: 'peek',
			value: function peek() {
				if (this.empty()) {
					throw new Error('Stack is empty');
				}

				return this._array[0];
			}
		}, {
			key: 'empty',
			value: function empty() {
				return this._array.length === 0;
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

},{}],3:[function(require,module,exports){
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

	var Tree = function () {
		function Tree(value, parent) {
			_classCallCheck(this, Tree);

			this._value = value;

			this._parent = parent || null;
			this._children = [];
		}

		_createClass(Tree, [{
			key: 'getParent',
			value: function getParent() {
				return this._parent;
			}
		}, {
			key: 'getChildren',
			value: function getChildren() {
				return this._children;
			}
		}, {
			key: 'getValue',
			value: function getValue() {
				return this._value;
			}
		}, {
			key: 'getIsLeaf',
			value: function getIsLeaf() {
				return this._children.length === 0;
			}
		}, {
			key: 'getIsRoot',
			value: function getIsRoot() {
				return this._parent === null;
			}
		}, {
			key: 'addChild',
			value: function addChild(value) {
				var returnRef = new Tree(value, this);

				this._children.push(returnRef);

				return returnRef;
			}
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
		}, {
			key: 'walk',
			value: function walk(walkAction, childrenFirst, includeCurrentNode) {
				var predicate = function predicate(value, node) {
					walkAction(value, node);

					return false;
				};

				this.search(predicate, childrenFirst, includeCurrentNode);
			}
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

	return Tree;
}();

},{}],4:[function(require,module,exports){
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

	var ComparatorBuilder = function () {
		function ComparatorBuilder(comparator, invert, previous) {
			_classCallCheck(this, ComparatorBuilder);

			assert.argumentIsRequired(comparator, 'comparator', Function);
			assert.argumentIsOptional(invert, 'invert', Boolean);

			this._comparator = comparator;
			this._invert = invert || false;
			this._previous = previous || null;
		}

		_createClass(ComparatorBuilder, [{
			key: 'thenBy',
			value: function thenBy(comparator, invert) {
				assert.argumentIsRequired(comparator, 'comparator', Function);
				assert.argumentIsOptional(invert, 'invert', Boolean);

				return new ComparatorBuilder(comparator, invert, this);
			}
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

},{"./../../lang/assert":14,"./comparators":5}],5:[function(require,module,exports){
'use strict';

var assert = require('./../../lang/assert');

module.exports = function () {
	'use strict';

	return {
		compareDates: function compareDates(a, b) {
			assert.argumentIsRequired(a, 'a', Date);
			assert.argumentIsRequired(b, 'b', Date);

			return a - b;
		},

		compareNumbers: function compareNumbers(a, b) {
			assert.argumentIsRequired(a, 'a', Number);
			assert.argumentIsRequired(b, 'b', Number);

			return a - b;
		},

		compareStrings: function compareStrings(a, b) {
			assert.argumentIsRequired(a, 'a', String);
			assert.argumentIsRequired(b, 'b', String);

			return a.localeCompare(b);
		},

		empty: function empty(a, b) {
			return 0;
		}
	};
}();

},{"./../../lang/assert":14}],6:[function(require,module,exports){
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

	var DisposableStack = function (_Disposable) {
		_inherits(DisposableStack, _Disposable);

		function DisposableStack() {
			_classCallCheck(this, DisposableStack);

			var _this = _possibleConstructorReturn(this, (DisposableStack.__proto__ || Object.getPrototypeOf(DisposableStack)).call(this));

			_this._stack = new Stack();
			return _this;
		}

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

},{"./../../lang/Disposable":12,"./../../lang/assert":14,"./../../lang/is":17,"./../Stack":2}],7:[function(require,module,exports){
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

		_createClass(EvictingList, [{
			key: 'add',
			value: function add(item) {
				this._array[this._head = getNextIndex(this._head, this._capacity)] = item;
			}
		}, {
			key: 'peek',
			value: function peek() {
				if (this.empty()) {
					throw new Error('EvictingList is empty');
				}

				return this._array[this._head];
			}
		}, {
			key: 'empty',
			value: function empty() {
				return this._head === null;
			}
		}, {
			key: 'getCapacity',
			value: function getCapacity() {
				return this._capacity;
			}
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

},{"./../../lang/assert":14}],8:[function(require,module,exports){
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

		_createClass(EvictingMap, [{
			key: 'has',
			value: function has(key) {
				return this._map.hasOwnProperty(key);
			}
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
		}, {
			key: 'empty',
			value: function empty() {
				return this._size === 0;
			}
		}, {
			key: 'getSize',
			value: function getSize() {
				return this._size;
			}
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

},{"./../../lang/assert":14}],9:[function(require,module,exports){
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

	var CommandHandler = function () {
		function CommandHandler() {
			_classCallCheck(this, CommandHandler);
		}

		_createClass(CommandHandler, [{
			key: 'process',
			value: function process(data) {
				return this._process(data);
			}
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
		}], [{
			key: 'toFunction',
			value: function toFunction(commandHandler) {
				assert.argumentIsRequired(commandHandler, 'commandHandler', CommandHandler, 'CommandHandler');

				return function (data) {
					return commandHandler.process(data);
				};
			}
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

},{"./../lang/assert":14}],10:[function(require,module,exports){
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

},{"./../lang/assert":14,"./CommandHandler":9}],11:[function(require,module,exports){
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

},{"./../lang/assert":14,"./CommandHandler":9}],12:[function(require,module,exports){
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
    * @param disposeAction {Function}
    *
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

},{"./assert":14}],13:[function(require,module,exports){
'use strict';

var assert = require('./assert');
var is = require('./is');

module.exports = function () {
	'use strict';

	var array = {
		unique: function unique(a) {
			assert.argumentIsArray(a, 'a');

			return a.filter(function (item, index, array) {
				return array.indexOf(item) === index;
			});
		},
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
		dropRight: function dropRight(a) {
			assert.argumentIsArray(a, 'a');

			var returnRef = Array.from(a);

			if (returnRef.length !== 0) {
				returnRef.pop();
			}

			return returnRef;
		},
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
		flatten: function flatten(a, recursive) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsOptional(recursive, 'recursive', Boolean);

			var empty = [];

			var flat = empty.concat.apply(empty, a);

			if (recursive && flat.some(function (x) {
				return is.array(x);
			})) {
				flat = array.flatten(flat, true);
			}

			return flat;
		},

		/**
   * Breaks an array into smaller arrays.
   *
   * @param a
   * @param size
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
		differenceSymmetric: function differenceSymmetric(a, b) {
			return array.union(array.difference(a, b), array.difference(b, a));
		},

		/**
   * Set union operation (using strict equality).
   *
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

	return array;
}();

},{"./assert":14,"./is":17}],14:[function(require,module,exports){
'use strict';

var is = require('./is');

module.exports = function () {
	'use strict';

	var assert = {
		argumentIsRequired: function argumentIsRequired(variable, variableName, type, typeDescription) {
			checkArgumentType(variable, variableName, type, typeDescription);
		},
		argumentIsOptional: function argumentIsOptional(variable, variableName, type, typeDescription) {
			if (variable === null || variable === undefined) {
				return;
			}

			checkArgumentType(variable, variableName, type, typeDescription);
		},
		argumentIsArray: function argumentIsArray(variable, variableName, itemConstraint, itemConstraintDescription) {
			assert.argumentIsRequired(variable, variableName, Array);

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
			message = 'The argument [' + (variableName || 'unspecified') + '], at index [' + index.toString() + '] must be a [' + (typeDescription || 'unknown') + ']';
		} else {
			message = 'The argument [' + (variableName || 'unspecified') + '] must be a ' + (typeDescription || 'Object');
		}

		throw new Error(message);
	}

	return assert;
}();

},{"./is":17}],15:[function(require,module,exports){
'use strict';

var assert = require('./assert'),
    is = require('./is');

module.exports = function () {
	'use strict';

	var attributes = {
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
		erase: function erase(target, propertyNames, separator) {
			if (!attributes.has(target, propertyNames)) {
				return;
			}

			var propertyNameArray = getPropertyNameArray(propertyNames, separator);
			var propertyTarget = getPropertyTarget(target, propertyNameArray, true);

			var propertyName = last(propertyNameArray);

			delete propertyTarget[propertyName];
		}
	};

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

	return attributes;
}();

},{"./assert":14,"./is":17}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
	return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
	return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

module.exports = function () {
	'use strict';

	return {
		number: function number(candidate) {
			return typeof candidate === 'number' && !isNaN(candidate);
		},
		nan: function nan(candidate) {
			return typeof candidate === 'number' && isNaN(candidate);
		},
		string: function string(candidate) {
			return typeof candidate === 'string';
		},
		date: function date(candidate) {
			return candidate instanceof Date;
		},
		fn: function fn(candidate) {
			return typeof candidate === 'function';
		},
		array: function array(candidate) {
			return Array.isArray(candidate);
		},
		boolean: function boolean(candidate) {
			return typeof candidate === 'boolean';
		},
		object: function object(candidate) {
			return (typeof candidate === 'undefined' ? 'undefined' : _typeof(candidate)) === 'object' && candidate !== null;
		},
		null: function _null(candidate) {
			return candidate === null;
		},
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
		})
	};
}();

},{}],18:[function(require,module,exports){
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

},{"./assert":14,"./is":17}],19:[function(require,module,exports){
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

},{"./is":17}],20:[function(require,module,exports){
'use strict';

var array = require('./array'),
    is = require('./is');

module.exports = function () {
	'use strict';

	var object = {
		/**
   * <p>Performs "deep" equality check on two objects.</p>
   *
   * <p>Array items are compared, object properties are compared, and
   * finally "primitive" values are checked using strict equality rules.</p>
   *
   * @param {Object} a
   * @param {Object} b
   *
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
   * @param {Object} source - The object to copy.
   *
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
   * @param {Object} a
   * @param {Object} b
   *
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
   * @param {Object} target - The object to interrogate.
   *
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

},{"./array":13,"./is":17}],21:[function(require,module,exports){
'use strict';

var assert = require('./assert');

module.exports = function () {
	'use strict';

	var utilities = {
		timeout: function timeout(promise, _timeout) {
			return Promise.resolve().then(function () {
				assert.argumentIsRequired(promise, 'promise', Promise, 'Promise');
				assert.argumentIsRequired(_timeout, 'timeout', Number);

				if (!(_timeout > 0)) {
					throw new Error('Promise timeout must be greater than zero.');
				}

				return utilities.build(function (resolveCallback, rejectCallback) {
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
		map: function map(items, mapper, concurrency) {
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

					mapPromise = utilities.build(function (resolveCallback, rejectCallback) {
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

	return utilities;
}();

},{"./assert":14}],22:[function(require,module,exports){
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

},{"./assert":14,"./is":17}],23:[function(require,module,exports){
'use strict';

var assert = require('./assert'),
    is = require('./is');

module.exports = function () {
	'use strict';

	return {
		startCase: function startCase(s) {
			return s.split(' ').reduce(function (phrase, word) {
				if (word.length !== 0) {
					phrase.push(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
				}

				return phrase;
			}, []).join(' ');
		},
		truncate: function truncate(s, length) {
			if (is.string(s) && s.length > length) {
				return s.substring(0, length) + ' ...';
			} else {
				return s;
			}
		},
		padLeft: function padLeft(s, length, character) {
			assert.argumentIsRequired(s, 's', String);
			assert.argumentIsRequired(length, 'length', Number);
			assert.argumentIsRequired(character, 'character', String);

			if (character.length !== 1) {
				throw new Error('The "character" argument must be one character in length.');
			}

			return character.repeat(length - s.length) + s;
		}
	};
}();

},{"./assert":14,"./is":17}],24:[function(require,module,exports){
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

	var Event = function (_Disposable) {
		_inherits(Event, _Disposable);

		function Event(sender) {
			_classCallCheck(this, Event);

			var _this = _possibleConstructorReturn(this, (Event.__proto__ || Object.getPrototypeOf(Event)).call(this));

			_this._sender = sender || null;

			_this._observers = [];
			return _this;
		}

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
		}, {
			key: 'unregister',
			value: function unregister(handler) {
				assert.argumentIsRequired(handler, 'handler', Function);

				removeRegistration.call(this, handler);
			}
		}, {
			key: 'clear',
			value: function clear() {
				this._observers = [];
			}
		}, {
			key: 'fire',
			value: function fire(data) {
				var observers = this._observers;

				for (var i = 0; i < observers.length; i++) {
					var observer = observers[i];

					observer(data, this._sender);
				}
			}
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

},{"./../lang/Disposable":12,"./../lang/assert":14}],25:[function(require,module,exports){
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

	var EventMap = function (_Disposable) {
		_inherits(EventMap, _Disposable);

		function EventMap() {
			_classCallCheck(this, EventMap);

			var _this = _possibleConstructorReturn(this, (EventMap.__proto__ || Object.getPrototypeOf(EventMap)).call(this));

			_this._events = {};
			return _this;
		}

		_createClass(EventMap, [{
			key: 'fire',
			value: function fire(eventName, data) {
				var event = this._events[eventName];

				if (event) {
					event.fire(data);
				}
			}
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

},{"./../lang/Disposable":12,"./../lang/assert":14,"./Event":24}],26:[function(require,module,exports){
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

},{"./../lang/Disposable":12,"./../lang/assert":14,"./../lang/is":17,"./../messaging/Event":24}],27:[function(require,module,exports){
'use strict';

var Specification = require('./Specification');

module.exports = function () {
	'use strict';

	return Specification.AndSpecification;
}();

},{"./Specification":34}],28:[function(require,module,exports){
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

},{"./../lang/assert":14,"./Specification":34}],29:[function(require,module,exports){
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

},{"./Specification":34}],30:[function(require,module,exports){
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

},{"./Specification":34}],31:[function(require,module,exports){
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

},{"./../lang/is":17,"./Specification":34}],32:[function(require,module,exports){
'use strict';

var Specification = require('./Specification');

module.exports = function () {
	'use strict';

	return Specification.OrSpecification;
}();

},{"./Specification":34}],33:[function(require,module,exports){
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

},{"./Specification":34}],34:[function(require,module,exports){
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

	Specification.AndSpecification = AndSpecification;
	Specification.OrSpecification = OrSpecification;

	return Specification;
}();

},{"./../lang/assert":14}],35:[function(require,module,exports){
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

			it('the peek result the item pushed onto the stack', function () {
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

			it('the pop result the item pushed onto the stack', function () {
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

				it('the peek result the second item pushed onto the stack', function () {
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

				it('the pop result the second item pushed onto the stack', function () {
					expect(pop).toBe(second);
				});

				it('should not be empty', function () {
					expect(stack.empty()).toEqual(false);
				});
			});
		});
	});
});

},{"./../../../collections/Stack":2}],36:[function(require,module,exports){
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

},{"./../../../collections/Tree":3}],37:[function(require,module,exports){
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

},{"./../../../../collections/sorting/ComparatorBuilder":4}],38:[function(require,module,exports){
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

},{"./../../../../collections/sorting/comparators":5}],39:[function(require,module,exports){
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

},{"./../../../../collections/specialized/DisposableStack":6,"./../../../../lang/Disposable":12}],40:[function(require,module,exports){
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

},{"./../../../../collections/specialized/EvictingList":7}],41:[function(require,module,exports){
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

},{"./../../../../collections/specialized/EvictingMap":8}],42:[function(require,module,exports){
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

},{"./../../../commands/CommandHandler":9}],43:[function(require,module,exports){
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

},{"./../../../commands/CommandHandler":9,"./../../../commands/CompositeCommandHandler":10}],44:[function(require,module,exports){
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

},{"./../../../commands/CommandHandler":9,"./../../../commands/MappedCommandHandler":11}],45:[function(require,module,exports){
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

},{"./../../../lang/Disposable":12}],46:[function(require,module,exports){
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

},{"./../../../lang/array":13}],47:[function(require,module,exports){
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

},{"./../../../lang/attributes":15}],48:[function(require,module,exports){
'use strict';

var dateUtilities = require('./../../../lang/date');

describe('When extracting the "short" day of week', function () {
	'use strict';

	var july = 7 - 1;

	it("07/27/2016 should resove to 'Wed'", function () {
		expect(dateUtilities.getShortDay(new Date(2016, july, 27))).toEqual('Wed');
	});
});

},{"./../../../lang/date":16}],49:[function(require,module,exports){
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

},{"./../../../lang/is":17}],50:[function(require,module,exports){
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

},{"./../../../lang/mask":18}],51:[function(require,module,exports){
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

},{"./../../../lang/math":19}],52:[function(require,module,exports){
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

},{"./../../../lang/object":20}],53:[function(require,module,exports){
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

},{"./../../../lang/promise":21}],54:[function(require,module,exports){
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

},{"./../../../lang/random":22}],55:[function(require,module,exports){
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

},{"./../../../lang/string":23}],56:[function(require,module,exports){
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

},{"./../../../messaging/EventMap":25}],57:[function(require,module,exports){
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

},{"./../../../lang/Disposable":12,"./../../../messaging/Event":24}],58:[function(require,module,exports){
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

},{"./../../../lang/Disposable":12,"./../../../models/Model":26}],59:[function(require,module,exports){
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

},{"./../../../specifications/AndSpecification":27,"./../../../specifications/Specification":34}],60:[function(require,module,exports){
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

},{"./../../../specifications/ContainedSpecification":28}],61:[function(require,module,exports){
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

},{"./../../../specifications/ContainsSpecification":29}],62:[function(require,module,exports){
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

},{"./../../../specifications/FailSpecification":30}],63:[function(require,module,exports){
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

},{"./../../../specifications/NumericSpecification":31}],64:[function(require,module,exports){
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

},{"./../../../specifications/OrSpecification":32,"./../../../specifications/Specification":34}],65:[function(require,module,exports){
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

},{"./../../../specifications/PassSpecification":33}],66:[function(require,module,exports){
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

},{"./../../../timing/RateLimiter":70}],67:[function(require,module,exports){
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

		it('should not create a memory leak', function (done) {
			var before = 0;

			for (var tb in scheduler._timeoutBindings) {
				before++;
			}

			expect(before).toEqual(1);

			promise.then(function () {
				var after = 0;

				for (var tb in scheduler._timeoutBindings) {
					after++;
				}

				expect(after).toEqual(0);
			}).then(function () {
				done();
			});
		});
	});

	describe('and is disposed', function () {
		var spy;

		beforeEach(function () {
			spy = jasmine.createSpy('spy');

			scheduler.dispose();
		});

		it('should throw if an attempt is made to schedule a task', function () {
			expect(function () {
				scheduler.schedule(spy, 100, 'A scheduled task');
			}).toThrow(new Error('The Scheduler has been disposed.'));
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

},{"./../../../timing/Scheduler":71}],68:[function(require,module,exports){
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

},{"./../../../timing/Serializer":72}],69:[function(require,module,exports){
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

},{"./../../../timing/WindowCounter":73}],70:[function(require,module,exports){
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

		_createClass(RateLimiter, [{
			key: 'enqueue',
			value: function enqueue(actionToEnqueue) {
				var _this2 = this;

				assert.argumentIsRequired(actionToEnqueue, 'actionToEnqueue', Function);

				if (this.getIsDisposed()) {
					throw new Error('Unable to enqueue action, the rate limiter has been disposed.');
				}

				return promise.build(function (resolveCallback, rejectCallback) {
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

},{"./../collections/Queue":1,"./../lang/Disposable":12,"./../lang/assert":14,"./../lang/promise":21,"./Scheduler":71}],71:[function(require,module,exports){
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

	var Scheduler = function (_Disposable) {
		_inherits(Scheduler, _Disposable);

		function Scheduler() {
			_classCallCheck(this, Scheduler);

			var _this = _possibleConstructorReturn(this, (Scheduler.__proto__ || Object.getPrototypeOf(Scheduler)).call(this));

			_this._timeoutBindings = {};
			_this._intervalBindings = {};
			return _this;
		}

		_createClass(Scheduler, [{
			key: 'schedule',
			value: function schedule(actionToSchedule, millisecondDelay, actionDescription) {
				var _this2 = this;

				assert.argumentIsRequired(actionToSchedule, 'actionToSchedule', Function);
				assert.argumentIsRequired(millisecondDelay, 'millisecondDelay', Number);
				assert.argumentIsOptional(actionDescription, 'actionDescription', String);

				if (this.getIsDisposed()) {
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

				this._timeoutBindings[token] = Disposable.fromAction(function () {
					clearTimeout(token);

					delete _this2._timeoutBindings[token];
				});

				return schedulePromise;
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
    * @param {number=} millisecondDelay - The amount of time to wait after the first failure. Subsequent failures are multiply this value by 2 ^ [number of failures]. So, a 1000 millisecond backoff would schedule attempts using the following delays: 0, 1000, 2000, 4000, 8000, etc.
    * @param {string=} actionDescription - Description of the action to attempt, used for logging purposes.
    * @param {number=} maximumAttempts - The number of attempts to before giving up.
    * @param {Function=} maximumAttempts - If provided, will be invoked if a function is considered to be failing.
    * @param {Object=} failureValue - If provided, will consider the result to have failed, if this value is returned (a deep equality check is used). If not provided, a "falsey" value will trigger a retry.
    */

		}, {
			key: 'backoff',
			value: function backoff(actionToBackoff, millisecondDelay, actionDescription, maximumAttempts, failureCallback, failureValue) {
				var _this4 = this;

				assert.argumentIsRequired(actionToBackoff, 'actionToBackoff', Function);
				assert.argumentIsOptional(millisecondDelay, 'millisecondDelay', Number);
				assert.argumentIsOptional(actionDescription, 'actionDescription', String);
				assert.argumentIsOptional(maximumAttempts, 'maximumAttempts', Number);
				assert.argumentIsOptional(failureCallback, 'failureCallback', Function);

				if (this.getIsDisposed()) {
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
						backoffDelay = millisecondDelay;
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

},{"./../lang/Disposable":12,"./../lang/assert":14,"./../lang/is":17,"./../lang/object":20,"./../lang/promise":21}],72:[function(require,module,exports){
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
    promise = require('./../lang/promise');

var Queue = require('./../collections/Queue');

module.exports = function () {
	'use strict';

	/**
  * Processes actions in sequence.
  *
  * @public
  */

	var Serializer = function () {
		function Serializer() {
			_classCallCheck(this, Serializer);

			this._workQueue = new Queue();

			this._running = false;
		}

		/**
   * Adds a new action to the processing queue. If the action
   * is asynchronous, the action should return a promise.
   *
   * @public
   * @param {Function} actionToEnqueue
   * @returns {Promise} - A promise which resolves once the action has been processed.
   */

		_createClass(Serializer, [{
			key: 'enqueue',
			value: function enqueue(actionToEnqueue) {
				var _this = this;

				assert.argumentIsRequired(actionToEnqueue, 'actionToEnqueue', Function);

				return promise.build(function (resolveCallback, rejectCallback) {
					_this._workQueue.enqueue(function () {
						return Promise.resolve().then(function () {
							return actionToEnqueue();
						}).then(function (result) {
							resolveCallback(result);
						}).catch(function (error) {
							rejectCallback(error);
						}).then(function () {
							_this._running = false;

							checkStart.call(_this);
						});
					});

					checkStart.call(_this);
				});
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[Serializer]';
			}
		}]);

		return Serializer;
	}();

	function checkStart() {
		if (this._workQueue.empty() || this._running) {
			return;
		}

		this._running = true;

		var actionToExecute = this._workQueue.dequeue();

		actionToExecute();
	}

	return Serializer;
}();

},{"./../collections/Queue":1,"./../lang/assert":14,"./../lang/promise":21}],73:[function(require,module,exports){
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

},{"./../collections/Queue":1,"./../lang/assert":14}]},{},[37,38,39,40,41,35,36,42,43,44,46,47,48,45,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69]);
