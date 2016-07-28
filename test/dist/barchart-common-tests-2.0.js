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

	var Queue = function () {
		function Queue() {
			_classCallCheck(this, Queue);

			this._array = [];
		}

		_createClass(Queue, [{
			key: 'enqueue',
			value: function enqueue(item) {
				this._array.push(item);

				return item;
			}
		}, {
			key: 'dequeue',
			value: function dequeue() {
				if (this.empty()) {
					throw new Error('Queue is empty');
				}

				return this._array.shift();
			}
		}, {
			key: 'peek',
			value: function peek() {
				if (this.empty()) {
					throw new Error('Queue is empty');
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

var assert = require('./../../lang/assert');
var comparators = require('./comparators');

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

},{"./../../lang/assert":11,"./comparators":4}],4:[function(require,module,exports){
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

},{"./../../lang/assert":11}],5:[function(require,module,exports){
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

},{"./../../lang/assert":11}],6:[function(require,module,exports){
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

},{"./../../lang/assert":11}],7:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DelegateCommandHandler).call(this));

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

},{"./../lang/assert":11}],8:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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
var CommandHandler = require('./CommandHandler');

module.exports = function () {
	'use strict';

	var CompositeCommandHandler = function (_CommandHandler) {
		_inherits(CompositeCommandHandler, _CommandHandler);

		function CompositeCommandHandler(commandHandlerA, commandHandlerB) {
			_classCallCheck(this, CompositeCommandHandler);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CompositeCommandHandler).call(this));

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

},{"./../lang/assert":11,"./CommandHandler":7}],9:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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
var CommandHandler = require('./CommandHandler');

module.exports = function () {
	'use strict';

	var MappedCommandHandler = function (_CommandHandler) {
		_inherits(MappedCommandHandler, _CommandHandler);

		function MappedCommandHandler(nameExtractor) {
			_classCallCheck(this, MappedCommandHandler);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MappedCommandHandler).call(this));

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

				var returnRef;

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

},{"./../lang/assert":11,"./CommandHandler":7}],10:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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

	var Disposable = function () {
		function Disposable() {
			_classCallCheck(this, Disposable);

			this._disposed = false;
		}

		_createClass(Disposable, [{
			key: 'dispose',
			value: function dispose() {
				if (this._disposed) {
					return;
				}

				this._disposed = true;

				this._onDispose();
			}
		}, {
			key: '_onDispose',
			value: function _onDispose() {
				return;
			}
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
		}], [{
			key: 'fromAction',
			value: function fromAction(disposeAction) {
				assert.argumentIsRequired(disposeAction, 'disposeAction', Function);

				return new DisposableAction(disposeAction);
			}
		}]);

		return Disposable;
	}();

	var DisposableAction = function (_Disposable) {
		_inherits(DisposableAction, _Disposable);

		function DisposableAction(disposeAction) {
			_classCallCheck(this, DisposableAction);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DisposableAction).call(this, disposeAction));

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

},{"./assert":11}],11:[function(require,module,exports){
'use strict';

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
				(function () {
					var itemValidator = void 0;

					if (typeof itemConstraint === 'function') {
						itemValidator = function itemValidator(value, index) {
							return itemConstraint(value, variableName + '[' + index + ']');
						};
					} else {
						itemValidator = function itemValidator(value, index) {
							return checkArgumentType(value, variableName, itemConstraint, itemConstraintDescription, index);
						};
					}

					variable.forEach(function (v, i) {
						itemValidator(v, i);
					});
				})();
			}
		},

		areEqual: function areEqual(a, b, descriptionA, descriptionB) {
			if (a !== b) {
				throw new Error('The objects must be equal ([' + (descriptionA || a.toString()) + ' and ' + (descriptionB || b.toString()));
			}
		},

		areNotEqual: function areNotEqual(a, b, descriptionA, descriptionB) {
			if (a === b) {
				throw new Error('The objects cannot be equal ([' + (descriptionA || a.toString()) + ' and ' + (descriptionB || b.toString()));
			}
		}
	};

	function checkArgumentType(variable, variableName, type, typeDescription, index) {
		if (type === String) {
			if (typeof variable !== 'string') {
				throwInvalidTypeError(variableName, 'string', index);
			}
		} else if (type === Number) {
			if (typeof variable !== 'number') {
				throwInvalidTypeError(variableName, 'number', index);
			}
		} else if (type === Function) {
			if (typeof variable !== 'function') {
				throwInvalidTypeError(variableName, 'function', index);
			}
		} else if (type === Boolean) {
			if (typeof variable !== 'boolean') {
				throwInvalidTypeError(variableName, 'boolean', index);
			}
		} else if (type === Date) {
			if (!(variable instanceof Date)) {
				throwInvalidTypeError(variableName, 'date', index);
			}
		} else if (type === Array) {
			if (!Array.isArray(variable)) {
				throwInvalidTypeError(variableName, 'array', index);
			}
		} else if (!(variable instanceof (type || Object))) {
			throwInvalidTypeError(variableName, typeDescription, index);
		}
	}

	function throwInvalidTypeError(variableName, typeDescription, index) {
		var message = void 0;

		if (typeof index === 'number') {
			message = 'The argument [' + (variableName || 'unspecified') + '], at index [' + index.toString() + '] must be a ' + (typeDescription || 'unknown');
		} else {
			message = 'The argument [' + (variableName || 'unspecified') + '] must be a ' + (typeDescription || 'Object');
		}

		throw new Error(message);
	}

	return assert;
}();

},{}],12:[function(require,module,exports){
'use strict';

var assert = require('./assert');

module.exports = function () {
	'use strict';

	var attributes = {
		has: function has(target, propertyNames) {
			assert.argumentIsRequired(target, 'target', Object);

			if (Array.isArray(propertyNames)) {
				assert.argumentIsArray(propertyNames, 'propertyNames', String);
			} else {
				assert.argumentIsRequired(propertyNames, 'propertyNames', String);
			}

			var propertyNameArray = getPropertyNameArray(propertyNames);
			var propertyTarget = getPropertyTarget(target, propertyNameArray, false);

			return propertyTarget !== null && propertyTarget.hasOwnProperty(last(propertyNameArray));
		},

		read: function read(target, propertyNames) {
			assert.argumentIsRequired(target, 'target', Object);

			if (Array.isArray(propertyNames)) {
				assert.argumentIsArray(propertyNames, 'propertyNames', String);
			} else {
				assert.argumentIsRequired(propertyNames, 'propertyNames', String);
			}

			var propertyNameArray = getPropertyNameArray(propertyNames);
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

		write: function write(target, propertyNames, value) {
			assert.argumentIsRequired(target, 'target', Object);

			if (Array.isArray(propertyNames)) {
				assert.argumentIsArray(propertyNames, 'propertyNames', String);
			} else {
				assert.argumentIsRequired(propertyNames, 'propertyNames', String);
			}

			var propertyNameArray = getPropertyNameArray(propertyNames);
			var propertyTarget = getPropertyTarget(target, propertyNameArray, true);

			var propertyName = last(propertyNameArray);

			propertyTarget[propertyName] = value;
		},

		erase: function erase(target, propertyNames) {
			if (!attributes.has(target, propertyNames)) {
				return;
			}

			var propertyNameArray = getPropertyNameArray(propertyNames);
			var propertyTarget = getPropertyTarget(target, propertyNameArray, true);

			var propertyName = last(propertyNameArray);

			delete propertyTarget[propertyName];
		}
	};

	function getPropertyNameArray(propertyNames) {
		var returnRef;

		if (Array.isArray(propertyNames)) {
			returnRef = propertyNames;
		} else {
			returnRef = propertyNames.split('.');
		}

		return returnRef;
	}

	function getPropertyTarget(target, propertyNameArray, create) {
		var returnRef = void 0;

		var propertyTarget = target;

		for (var i = 0; i < propertyNameArray.length - 1; i++) {
			var propertyName = propertyNameArray[i];

			if (propertyTarget.hasOwnProperty(propertyName)) {
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

},{"./assert":11}],13:[function(require,module,exports){
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

	var months = [{ short: 'Jan' }, { short: 'Feb' }, { short: 'Mar' }, { short: 'Apr' }, { short: 'May' }, { short: 'Jun' }, { short: 'Jul' }, { short: 'Aug' }, { short: 'Sep' }, { short: 'Oct' }, { short: 'Nov' }, { short: 'Dev' }];

	return utilities;
}();

},{}],14:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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

var Disposable = require('./../lang/Disposable');

module.exports = function () {
	'use strict';

	var Event = function (_Disposable) {
		_inherits(Event, _Disposable);

		function Event(sender) {
			_classCallCheck(this, Event);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Event).call(this));

			_this._sender = sender || null;

			_this._observers = [];
			return _this;
		}

		_createClass(Event, [{
			key: 'register',
			value: function register(handler) {
				var _this2 = this;

				if (typeof handler !== 'function') {
					throw new Error('Event handler must be a function.');
				}

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
				if (typeof handler !== 'function') {
					throw new Error('Event handler must be a function.');
				}

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
		var indiciesToRemove = [];

		for (var i = 0; i < this._observers.length; i++) {
			var candidate = this._observers[i];

			if (candidate === handler) {
				indiciesToRemove.push(i);
			}
		}

		if (indiciesToRemove.length > 0) {
			var copiedObservers = this._observers.slice();

			for (var j = indiciesToRemove.length - 1; !(j < 0); j--) {
				copiedObservers.splice(indiciesToRemove[j], 1);
			}

			this._observers = copiedObservers;
		}
	}

	return Event;
}();

},{"./../lang/Disposable":10}],15:[function(require,module,exports){
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

var Event = require('./Event');

module.exports = function () {
	'use strict';

	var EventMap = function () {
		function EventMap() {
			_classCallCheck(this, EventMap);

			this._events = {};
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
				if (typeof eventName !== 'string') {
					throw new Error('An event name must be a string.');
				}

				var event = this._events[eventName];

				if (!event) {
					event = this._events[eventName] = new Event(this);
				}

				event.register(handler);
			}
		}, {
			key: 'unregister',
			value: function unregister(eventName, handler) {
				if (typeof eventName !== 'string') {
					throw new Error('An event name must be a string.');
				}

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
				if (typeof eventName !== 'string') {
					throw new Error('An event name must be a string.');
				}

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
			key: 'toString',
			value: function toString() {
				return '[EventMap]';
			}
		}]);

		return EventMap;
	}();

	return EventMap;
}();

},{"./Event":14}],16:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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
var Disposable = require('./../lang/Disposable');
var Event = require('./../messaging/Event');

module.exports = function () {
	'use strict';

	var Model = function (_Disposable) {
		_inherits(Model, _Disposable);

		function Model(propertyNames, propertyObservers) {
			_classCallCheck(this, Model);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Model).call(this));

			_this._propertyNames = propertyNames;

			_this._transactionCommit = new Event(_this);

			_this._transactionOpen = false;
			_this._transactionData = null;

			_this._sequence = 0;

			var observers = propertyObservers || {};

			for (var i = 0; i < _this._propertyNames.length; i++) {
				var propertyName = propertyNames[i];

				createProperty.call(_this, propertyName, observers[propertyName] || emptyFunction);
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

	function createProperty(propertyName, propertyObserver) {
		var _this2 = this;

		var propertyValue;

		Object.defineProperty(this, propertyName, {
			get: function get() {
				return propertyValue;
			},
			set: function set(value) {
				if (propertyValue === value) {
					return;
				}

				propertyValue = value;

				var implicit = !_this2._transactionOpen;

				if (implicit) {
					_this2.beginTransaction();
				}

				_this2._transactionData = _this2._transactionData || {};
				_this2._transactionData[propertyName] = propertyValue;

				propertyObserver();

				if (implicit) {
					_this2.endTransaction();
				}
			}
		});
	}

	return Model;
}();

},{"./../lang/Disposable":10,"./../lang/assert":11,"./../messaging/Event":14}],17:[function(require,module,exports){

},{}],18:[function(require,module,exports){
arguments[4][17][0].apply(exports,arguments)
},{"dup":17}],19:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

(function () {
  try {
    cachedSetTimeout = setTimeout;
  } catch (e) {
    cachedSetTimeout = function () {
      throw new Error('setTimeout is not defined');
    }
  }
  try {
    cachedClearTimeout = clearTimeout;
  } catch (e) {
    cachedClearTimeout = function () {
      throw new Error('clearTimeout is not defined');
    }
  }
} ())
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = cachedSetTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    cachedClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        cachedSetTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],20:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],21:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],22:[function(require,module,exports){
"use strict";
var layouts = require('../layouts')
, consoleLog = console.log.bind(console);

function consoleAppender (layout, timezoneOffset) {
  layout = layout || layouts.colouredLayout;
  return function(loggingEvent) {
    consoleLog(layout(loggingEvent, timezoneOffset));
  };
}

function configure(config) {
  var layout;
  if (config.layout) {
    layout = layouts.layout(config.layout.type, config.layout);
  }
  return consoleAppender(layout, config.timezoneOffset);
}

exports.appender = consoleAppender;
exports.configure = configure;

},{"../layouts":25}],23:[function(require,module,exports){
"use strict";
var levels = require("./levels");
var DEFAULT_FORMAT = ':remote-addr - -' +
  ' ":method :url HTTP/:http-version"' +
  ' :status :content-length ":referrer"' +
  ' ":user-agent"';
/**
 * Log requests with the given `options` or a `format` string.
 *
 * Options:
 *
 *   - `format`        Format string, see below for tokens
 *   - `level`         A log4js levels instance. Supports also 'auto'
 *
 * Tokens:
 *
 *   - `:req[header]` ex: `:req[Accept]`
 *   - `:res[header]` ex: `:res[Content-Length]`
 *   - `:http-version`
 *   - `:response-time`
 *   - `:remote-addr`
 *   - `:date`
 *   - `:method`
 *   - `:url`
 *   - `:referrer`
 *   - `:user-agent`
 *   - `:status`
 *
 * @param {String|Function|Object} format or options
 * @return {Function}
 * @api public
 */

function getLogger(logger4js, options) {
	if ('object' == typeof options) {
		options = options || {};
	} else if (options) {
		options = { format: options };
	} else {
		options = {};
	}

	var thislogger = logger4js
  , level = levels.toLevel(options.level, levels.INFO)
  , fmt = options.format || DEFAULT_FORMAT
  , nolog = options.nolog ? createNoLogCondition(options.nolog) : null;

  return function (req, res, next) {
    // mount safety
    if (req._logging) return next();

		// nologs
		if (nolog && nolog.test(req.originalUrl)) return next();
		if (thislogger.isLevelEnabled(level) || options.level === 'auto') {

			var start = new Date()
			, statusCode
			, writeHead = res.writeHead
			, url = req.originalUrl;

			// flag as logging
			req._logging = true;

			// proxy for statusCode.
			res.writeHead = function(code, headers){
				res.writeHead = writeHead;
				res.writeHead(code, headers);
				res.__statusCode = statusCode = code;
				res.__headers = headers || {};

				//status code response level handling
				if(options.level === 'auto'){
					level = levels.INFO;
					if(code >= 300) level = levels.WARN;
					if(code >= 400) level = levels.ERROR;
				} else {
					level = levels.toLevel(options.level, levels.INFO);
				}
			};

			//hook on end request to emit the log entry of the HTTP request.
			res.on('finish', function() {
				res.responseTime = new Date() - start;
				//status code response level handling
				if(res.statusCode && options.level === 'auto'){
					level = levels.INFO;
					if(res.statusCode >= 300) level = levels.WARN;
					if(res.statusCode >= 400) level = levels.ERROR;
				}
				if (thislogger.isLevelEnabled(level)) {
          var combined_tokens = assemble_tokens(req, res, options.tokens || []);
					if (typeof fmt === 'function') {
						var line = fmt(req, res, function(str){ return format(str, combined_tokens); });
						if (line) thislogger.log(level, line);
					} else {
						thislogger.log(level, format(fmt, combined_tokens));
					}
				}
			});
		}

    //ensure next gets always called
    next();
  };
}

/**
 * Adds custom {token, replacement} objects to defaults, overwriting the defaults if any tokens clash
 *
 * @param  {IncomingMessage} req
 * @param  {ServerResponse} res
 * @param  {Array} custom_tokens [{ token: string-or-regexp, replacement: string-or-replace-function }]
 * @return {Array}
 */
function assemble_tokens(req, res, custom_tokens) {
  var array_unique_tokens = function(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
      for(var j=i+1; j<a.length; ++j) {
        if(a[i].token == a[j].token) { // not === because token can be regexp object
          a.splice(j--, 1);
        }
      }
    }
    return a;
  };

  var default_tokens = [];
  default_tokens.push({ token: ':url', replacement: req.originalUrl });
  default_tokens.push({ token: ':protocol', replacement: req.protocol });
  default_tokens.push({ token: ':hostname', replacement: req.hostname });
  default_tokens.push({ token: ':method', replacement: req.method });
  default_tokens.push({ token: ':status', replacement: res.__statusCode || res.statusCode });
  default_tokens.push({ token: ':response-time', replacement: res.responseTime });
  default_tokens.push({ token: ':date', replacement: new Date().toUTCString() });
  default_tokens.push({ token: ':referrer', replacement: req.headers.referer || req.headers.referrer || '' });
  default_tokens.push({ token: ':http-version', replacement: req.httpVersionMajor + '.' + req.httpVersionMinor });
  default_tokens.push({ token: ':remote-addr', replacement: req.headers['x-forwarded-for'] || req.ip || req._remoteAddress ||
    (req.socket && (req.socket.remoteAddress || (req.socket.socket && req.socket.socket.remoteAddress))) });
  default_tokens.push({ token: ':user-agent', replacement: req.headers['user-agent'] });
  default_tokens.push({ token: ':content-length', replacement: (res._headers && res._headers['content-length']) ||
      (res.__headers && res.__headers['Content-Length']) || '-' });
  default_tokens.push({ token: /:req\[([^\]]+)\]/g, replacement: function(_, field) {
    return req.headers[field.toLowerCase()];
  } });
  default_tokens.push({ token: /:res\[([^\]]+)\]/g, replacement: function(_, field) {
    return res._headers ?
      (res._headers[field.toLowerCase()] || res.__headers[field])
      : (res.__headers && res.__headers[field]);
  } });

  return array_unique_tokens(custom_tokens.concat(default_tokens));
};

/**
 * Return formatted log line.
 *
 * @param  {String} str
 * @param  {IncomingMessage} req
 * @param  {ServerResponse} res
 * @return {String}
 * @api private
 */

function format(str, tokens) {
  for (var i = 0; i < tokens.length; i++) {
    str = str.replace(tokens[i].token, tokens[i].replacement);
  }
  return str;
}

/**
 * Return RegExp Object about nolog
 *
 * @param  {String} nolog
 * @return {RegExp}
 * @api private
 *
 * syntax
 *  1. String
 *   1.1 "\\.gif"
 *         NOT LOGGING http://example.com/hoge.gif and http://example.com/hoge.gif?fuga
 *         LOGGING http://example.com/hoge.agif
 *   1.2 in "\\.gif|\\.jpg$"
 *         NOT LOGGING http://example.com/hoge.gif and
 *           http://example.com/hoge.gif?fuga and http://example.com/hoge.jpg?fuga
 *         LOGGING http://example.com/hoge.agif,
 *           http://example.com/hoge.ajpg and http://example.com/hoge.jpg?hoge
 *   1.3 in "\\.(gif|jpe?g|png)$"
 *         NOT LOGGING http://example.com/hoge.gif and http://example.com/hoge.jpeg
 *         LOGGING http://example.com/hoge.gif?uid=2 and http://example.com/hoge.jpg?pid=3
 *  2. RegExp
 *   2.1 in /\.(gif|jpe?g|png)$/
 *         SAME AS 1.3
 *  3. Array
 *   3.1 ["\\.jpg$", "\\.png", "\\.gif"]
 *         SAME AS "\\.jpg|\\.png|\\.gif"
 */
function createNoLogCondition(nolog) {
  var regexp = null;

	if (nolog) {
    if (nolog instanceof RegExp) {
      regexp = nolog;
    }

    if (typeof nolog === 'string') {
      regexp = new RegExp(nolog);
    }

    if (Array.isArray(nolog)) {
      var regexpsAsStrings = nolog.map(
        function convertToStrings(o) {
          return o.source ? o.source : o;
        }
      );
      regexp = new RegExp(regexpsAsStrings.join('|'));
    }
  }

  return regexp;
}

exports.connectLogger = getLogger;

},{"./levels":26}],24:[function(require,module,exports){
"use strict";
exports.ISO8601_FORMAT = "yyyy-MM-dd hh:mm:ss.SSS";
exports.ISO8601_WITH_TZ_OFFSET_FORMAT = "yyyy-MM-ddThh:mm:ssO";
exports.DATETIME_FORMAT = "dd MM yyyy hh:mm:ss.SSS";
exports.ABSOLUTETIME_FORMAT = "hh:mm:ss.SSS";

function padWithZeros(vNumber, width) {
  var numAsString = vNumber + "";
  while (numAsString.length < width) {
    numAsString = "0" + numAsString;
  }
  return numAsString;
}
  
function addZero(vNumber) {
  return padWithZeros(vNumber, 2);
}

/**
 * Formats the TimeOffest
 * Thanks to http://www.svendtofte.com/code/date_format/
 * @private
 */
function offset(timezoneOffset) {
  // Difference to Greenwich time (GMT) in hours
  var os = Math.abs(timezoneOffset);
  var h = String(Math.floor(os/60));
  var m = String(os%60);
  if (h.length == 1) {
    h = "0" + h;
  }
  if (m.length == 1) {
    m = "0" + m;
  }
  return timezoneOffset < 0 ? "+"+h+m : "-"+h+m;
}

exports.asString = function(/*format,*/ date, timezoneOffset) {
  var format = exports.ISO8601_FORMAT;
  if (typeof(date) === "string") {
    format = arguments[0];
    date = arguments[1];
    timezoneOffset = arguments[2];
  }
  // make the date independent of the system timezone by working with UTC
  if (timezoneOffset === undefined) {
    timezoneOffset = date.getTimezoneOffset();
  }
  date.setUTCMinutes(date.getUTCMinutes() - timezoneOffset);
  var vDay = addZero(date.getUTCDate());
  var vMonth = addZero(date.getUTCMonth()+1);
  var vYearLong = addZero(date.getUTCFullYear());
  var vYearShort = addZero(date.getUTCFullYear().toString().substring(2,4));
  var vYear = (format.indexOf("yyyy") > -1 ? vYearLong : vYearShort);
  var vHour  = addZero(date.getUTCHours());
  var vMinute = addZero(date.getUTCMinutes());
  var vSecond = addZero(date.getUTCSeconds());
  var vMillisecond = padWithZeros(date.getUTCMilliseconds(), 3);
  var vTimeZone = offset(timezoneOffset);
  date.setUTCMinutes(date.getUTCMinutes() + timezoneOffset);
  var formatted = format
    .replace(/dd/g, vDay)
    .replace(/MM/g, vMonth)
    .replace(/y{1,4}/g, vYear)
    .replace(/hh/g, vHour)
    .replace(/mm/g, vMinute)
    .replace(/ss/g, vSecond)
    .replace(/SSS/g, vMillisecond)
    .replace(/O/g, vTimeZone);
  return formatted;

};

},{}],25:[function(require,module,exports){
(function (process){
"use strict";
var dateFormat = require('./date_format')
, os = require('os')
, eol = os.EOL || '\n'
, util = require('util')
, replacementRegExp = /%[sdj]/g
, layoutMakers = {
  "messagePassThrough": function() { return messagePassThroughLayout; }, 
  "basic": function() { return basicLayout; }, 
  "colored": function() { return colouredLayout; }, 
  "coloured": function() { return colouredLayout; }, 
  "pattern": function (config) {
    return patternLayout(config && config.pattern, config && config.tokens);
	},
  "dummy": function() { return dummyLayout; }
}
, colours = {
  ALL: "grey", 
  TRACE: "blue", 
  DEBUG: "cyan", 
  INFO: "green", 
  WARN: "yellow", 
  ERROR: "red", 
  FATAL: "magenta", 
  OFF: "grey"
};

function wrapErrorsWithInspect(items) {
  return items.map(function(item) {
    if ((item instanceof Error) && item.stack) {
      return { inspect: function() { return util.format(item) + '\n' + item.stack; } };
    } else {
      return item;
    }
  });
}

function formatLogData(logData) {
  var data = Array.isArray(logData) ? logData : Array.prototype.slice.call(arguments);
  return util.format.apply(util, wrapErrorsWithInspect(data));
}

var styles = {
    //styles
  'bold'      : [1,  22],
  'italic'    : [3,  23],
  'underline' : [4,  24],
  'inverse'   : [7,  27],
  //grayscale
  'white'     : [37, 39],
  'grey'      : [90, 39],
  'black'     : [90, 39],
  //colors
  'blue'      : [34, 39],
  'cyan'      : [36, 39],
  'green'     : [32, 39],
  'magenta'   : [35, 39],
  'red'       : [31, 39],
  'yellow'    : [33, 39]
};

function colorizeStart(style) {
  return style ? '\x1B[' + styles[style][0] + 'm' : '';
}
function colorizeEnd(style) {
  return style ? '\x1B[' + styles[style][1] + 'm' : '';
}
/**
 * Taken from masylum's fork (https://github.com/masylum/log4js-node)
 */
function colorize (str, style) {
  return colorizeStart(style) + str + colorizeEnd(style);
}

function timestampLevelAndCategory(loggingEvent, colour, timezoneOffest) {
  var output = colorize(
    formatLogData(
      '[%s] [%s] %s - '
      , dateFormat.asString(loggingEvent.startTime, timezoneOffest)
      , loggingEvent.level
      , loggingEvent.categoryName
    )
    , colour
  );
  return output;
}

/**
 * BasicLayout is a simple layout for storing the logs. The logs are stored
 * in following format:
 * <pre>
 * [startTime] [logLevel] categoryName - message\n
 * </pre>
 *
 * @author Stephan Strittmatter
 */
function basicLayout (loggingEvent, timezoneOffset) {
  return timestampLevelAndCategory(loggingEvent, undefined, timezoneOffset) + formatLogData(loggingEvent.data);
}

/**
 * colouredLayout - taken from masylum's fork.
 * same as basicLayout, but with colours.
 */
function colouredLayout (loggingEvent, timezoneOffset) {
  return timestampLevelAndCategory(
    loggingEvent,
    colours[loggingEvent.level.toString()],
    timezoneOffset
  ) + formatLogData(loggingEvent.data);
}

function messagePassThroughLayout (loggingEvent) {
  return formatLogData(loggingEvent.data);
}

function dummyLayout(loggingEvent) {
  return loggingEvent.data[0];
}

/**
 * PatternLayout
 * Format for specifiers is %[padding].[truncation][field]{[format]}
 * e.g. %5.10p - left pad the log level by 5 characters, up to a max of 10
 * Fields can be any of:
 *  - %r time in toLocaleTimeString format
 *  - %p log level
 *  - %c log category
 *  - %h hostname
 *  - %m log data
 *  - %d date in various formats
 *  - %% %
 *  - %n newline
 *  - %z pid
 *  - %x{<tokenname>} add dynamic tokens to your log. Tokens are specified in the tokens parameter
 * You can use %[ and %] to define a colored block.
 *
 * Tokens are specified as simple key:value objects. 
 * The key represents the token name whereas the value can be a string or function
 * which is called to extract the value to put in the log message. If token is not
 * found, it doesn't replace the field.
 *
 * A sample token would be: { "pid" : function() { return process.pid; } }
 *
 * Takes a pattern string, array of tokens and returns a layout function.
 * @param {String} Log format pattern String
 * @param {object} map object of different tokens
 * @param {number} timezone offset in minutes
 * @return {Function}
 * @author Stephan Strittmatter
 * @author Jan Schmidle
 */
function patternLayout (pattern, tokens, timezoneOffset) {
  var TTCC_CONVERSION_PATTERN  = "%r %p %c - %m%n";
  var regex = /%(-?[0-9]+)?(\.?[0-9]+)?([\[\]cdhmnprzxy%])(\{([^\}]+)\})?|([^%]+)/;
  
  pattern = pattern || TTCC_CONVERSION_PATTERN;

  function categoryName(loggingEvent, specifier) {
    var loggerName = loggingEvent.categoryName;
    if (specifier) {
      var precision = parseInt(specifier, 10);
      var loggerNameBits = loggerName.split(".");
      if (precision < loggerNameBits.length) {
        loggerName = loggerNameBits.slice(loggerNameBits.length - precision).join(".");
      }
    }
    return loggerName;
  }

  function formatAsDate(loggingEvent, specifier) {
    var format = dateFormat.ISO8601_FORMAT;
    if (specifier) {
      format = specifier;
      // Pick up special cases
      if (format == "ISO8601") {
        format = dateFormat.ISO8601_FORMAT;
      } else if (format == "ISO8601_WITH_TZ_OFFSET") {
        format = dateFormat.ISO8601_WITH_TZ_OFFSET_FORMAT; 
      } else if (format == "ABSOLUTE") {
        format = dateFormat.ABSOLUTETIME_FORMAT;
      } else if (format == "DATE") {
        format = dateFormat.DATETIME_FORMAT;
      }
    }
    // Format the date
    return dateFormat.asString(format, loggingEvent.startTime, timezoneOffset);
  }
  
  function hostname() {
    return os.hostname().toString();
  }

  function formatMessage(loggingEvent) {
    return formatLogData(loggingEvent.data);
  }
  
  function endOfLine() {
    return eol;
  }

  function logLevel(loggingEvent) {
    return loggingEvent.level.toString();
  }

  function startTime(loggingEvent) {
    return dateFormat.asString('hh:mm:ss', loggingEvent.startTime, timezoneOffset);
  }

  function startColour(loggingEvent) {
    return colorizeStart(colours[loggingEvent.level.toString()]);
  }

  function endColour(loggingEvent) {
    return colorizeEnd(colours[loggingEvent.level.toString()]);
  }

  function percent() {
    return '%';
  }

  function pid(loggingEvent) {
    if (loggingEvent && loggingEvent.pid) {
      return loggingEvent.pid;
    } else {
      return process.pid;
    }
  }
  
  function clusterInfo(loggingEvent, specifier) {
    if (loggingEvent.cluster && specifier) {
      return specifier
        .replace('%m', loggingEvent.cluster.master)
        .replace('%w', loggingEvent.cluster.worker)
        .replace('%i', loggingEvent.cluster.workerId);
    } else if (loggingEvent.cluster) {
      return loggingEvent.cluster.worker+'@'+loggingEvent.cluster.master;
    } else {
      return pid();
    }
  }

  function userDefined(loggingEvent, specifier) {
    if (typeof(tokens[specifier]) !== 'undefined') {
      if (typeof(tokens[specifier]) === 'function') {
        return tokens[specifier](loggingEvent);
      } else {
        return tokens[specifier];
      }
    }
    return null;
  }

  var replacers = {
    'c': categoryName,
    'd': formatAsDate,
    'h': hostname,
    'm': formatMessage,
    'n': endOfLine,
    'p': logLevel,
    'r': startTime,
    '[': startColour,
    ']': endColour,
    'y': clusterInfo,
    'z': pid,
    '%': percent,
    'x': userDefined
  };

  function replaceToken(conversionCharacter, loggingEvent, specifier) {
    return replacers[conversionCharacter](loggingEvent, specifier);
  }

  function truncate(truncation, toTruncate) {
    var len;
    if (truncation) {
      len = parseInt(truncation.substr(1), 10);
      return toTruncate.substring(0, len);
    }

    return toTruncate;
  }

  function pad(padding, toPad) {
    var len;
    if (padding) {
      if (padding.charAt(0) == "-") {
        len = parseInt(padding.substr(1), 10);
        // Right pad with spaces
        while (toPad.length < len) {
          toPad += " ";
        }
      } else {
        len = parseInt(padding, 10);
        // Left pad with spaces
        while (toPad.length < len) {
          toPad = " " + toPad;
        }
      }
    }
    return toPad;
  }
  
  return function(loggingEvent) {
    var formattedString = "";
    var result;
    var searchString = pattern;
    
    while ((result = regex.exec(searchString))) {
      var matchedString = result[0];
      var padding = result[1];
      var truncation = result[2];
      var conversionCharacter = result[3];
      var specifier = result[5];
      var text = result[6];
      
      // Check if the pattern matched was just normal text
      if (text) {
        formattedString += "" + text;
      } else {
        // Create a raw replacement string based on the conversion
        // character and specifier
        var replacement = replaceToken(conversionCharacter, loggingEvent, specifier);

        // Format the replacement according to any padding or
        // truncation specified
        replacement = truncate(truncation, replacement);
        replacement = pad(padding, replacement);
        formattedString += replacement;
      }
      searchString = searchString.substr(result.index + result[0].length);
    }
    return formattedString;
  };

}

module.exports = {
  basicLayout: basicLayout, 
  messagePassThroughLayout: messagePassThroughLayout, 
  patternLayout: patternLayout, 
  colouredLayout: colouredLayout, 
  coloredLayout: colouredLayout, 
  dummyLayout: dummyLayout,
  addLayout: function(name, serializerGenerator) {
    layoutMakers[name] = serializerGenerator;
  },
  layout: function(name, config) {
    return layoutMakers[name] && layoutMakers[name](config);
  }
};

}).call(this,require('_process'))
},{"./date_format":24,"_process":19,"os":17,"util":31}],26:[function(require,module,exports){
"use strict";

function Level(level, levelStr) {
  this.level = level;
  this.levelStr = levelStr;
}

/**
 * converts given String to corresponding Level
 * @param {String} sArg String value of Level OR Log4js.Level
 * @param {Log4js.Level} defaultLevel default Level, if no String representation
 * @return Level object
 * @type Log4js.Level
 */
function toLevel(sArg, defaultLevel) {
  if (!sArg) {
    return defaultLevel;
  }
  if (typeof sArg === "string") {
    return module.exports[sArg.toUpperCase()] || defaultLevel;
  }
  return toLevel(sArg.toString());
}

Level.prototype.toString = function() {
  return this.levelStr;
};

Level.prototype.isLessThanOrEqualTo = function(otherLevel) {
  if (typeof otherLevel === "string") {
    otherLevel = toLevel(otherLevel);
  }
  return this.level <= otherLevel.level;
};

Level.prototype.isGreaterThanOrEqualTo = function(otherLevel) {
  if (typeof otherLevel === "string") {
    otherLevel = toLevel(otherLevel);
  }
  return this.level >= otherLevel.level;
};

Level.prototype.isEqualTo = function(otherLevel) {
  if (typeof otherLevel == "string") {
    otherLevel = toLevel(otherLevel);
  }
  return this.level === otherLevel.level;
};

module.exports = {
  ALL: new Level(Number.MIN_VALUE, "ALL"),
  TRACE: new Level(5000, "TRACE"),
  DEBUG: new Level(10000, "DEBUG"),
  INFO: new Level(20000, "INFO"),
  WARN: new Level(30000, "WARN"),
  ERROR: new Level(40000, "ERROR"),
  FATAL: new Level(50000, "FATAL"),
  MARK: new Level(9007199254740992, "MARK"), // 2^53
  OFF: new Level(Number.MAX_VALUE, "OFF"),
  toLevel: toLevel
};

},{}],27:[function(require,module,exports){
(function (process){
"use strict";
/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview log4js is a library to log in JavaScript in similar manner
 * than in log4j for Java. The API should be nearly the same.
 *
 * <h3>Example:</h3>
 * <pre>
 *  var logging = require('log4js');
 *  //add an appender that logs all messages to stdout.
 *  logging.addAppender(logging.consoleAppender());
 *  //add an appender that logs "some-category" to a file
 *  logging.addAppender(logging.fileAppender("file.log"), "some-category");
 *  //get a logger
 *  var log = logging.getLogger("some-category");
 *  log.setLevel(logging.levels.TRACE); //set the Level
 *
 *  ...
 *
 *  //call the log
 *  log.trace("trace me" );
 * </pre>
 *
 * NOTE: the authors below are the original browser-based log4js authors
 * don't try to contact them about bugs in this version :)
 * @version 1.0
 * @author Stephan Strittmatter - http://jroller.com/page/stritti
 * @author Seth Chisamore - http://www.chisamore.com
 * @since 2005-05-20
 * @static
 * Website: http://log4js.berlios.de
 */
var events = require('events')
, fs = require('fs')
, path = require('path')
, util = require('util')
, layouts = require('./layouts')
, levels = require('./levels')
, loggerModule = require('./logger')
, LoggingEvent = loggerModule.LoggingEvent
, Logger = loggerModule.Logger
, ALL_CATEGORIES = '[all]'
, appenders = {}
, loggers = {}
, appenderMakers = {}
, appenderShutdowns = {}
, defaultConfig =   {
  appenders: [
    { type: "console" }
  ],
  replaceConsole: false
};

require('./appenders/console');

function hasLogger(logger) {
  return loggers.hasOwnProperty(logger);
}


function getBufferedLogger(categoryName) {
    var base_logger = getLogger(categoryName);
    var logger = {};
    logger.temp = [];
    logger.target = base_logger;
    logger.flush = function () {
        for (var i = 0; i < logger.temp.length; i++) {
            var log = logger.temp[i];
            logger.target[log.level](log.message);
            delete logger.temp[i];
        }
    };
    logger.trace = function (message) { logger.temp.push({level: 'trace', message: message}); };
    logger.debug = function (message) { logger.temp.push({level: 'debug', message: message}); };
    logger.info = function (message) { logger.temp.push({level: 'info', message: message}); };
    logger.warn = function (message) { logger.temp.push({level: 'warn', message: message}); };
    logger.error = function (message) { logger.temp.push({level: 'error', message: message}); };
    logger.fatal = function (message) { logger.temp.push({level: 'fatal', message: message}); };

    return logger;
}

function normalizeCategory (category) {
  return  category + '.';
}

function doesLevelEntryContainsLogger (levelCategory, loggerCategory) {  
  var normalizedLevelCategory = normalizeCategory(levelCategory);
  var normalizedLoggerCategory = normalizeCategory(loggerCategory);
  return normalizedLoggerCategory.substring(0, normalizedLevelCategory.length) == normalizedLevelCategory;
}

function doesAppenderContainsLogger (appenderCategory, loggerCategory) {
  var normalizedAppenderCategory = normalizeCategory(appenderCategory);
  var normalizedLoggerCategory = normalizeCategory(loggerCategory);
  return normalizedLoggerCategory.substring(0, normalizedAppenderCategory.length) == normalizedAppenderCategory;
}


/**
 * Get a logger instance. Instance is cached on categoryName level.
 * @param  {String} categoryName name of category to log to.
 * @return {Logger} instance of logger for the category
 * @static
 */
function getLogger (loggerCategoryName) {

  // Use default logger if categoryName is not specified or invalid
  if (typeof loggerCategoryName !== "string") {
    loggerCategoryName = Logger.DEFAULT_CATEGORY;
  }

  if (!hasLogger(loggerCategoryName)) {

    var level = undefined;

    // If there's a "levels" entry in the configuration
    if (levels.config) {
      // Goes through the categories in the levels configuration entry, starting by the "higher" ones.
      var keys = Object.keys(levels.config).sort();
      for (var idx = 0; idx < keys.length; idx++) {
        var levelCategory = keys[idx];
        if (doesLevelEntryContainsLogger(levelCategory, loggerCategoryName)) {
          // level for the logger
          level = levels.config[levelCategory];
        }
      }
    }
  
    // Create the logger for this name if it doesn't already exist
    loggers[loggerCategoryName] = new Logger(loggerCategoryName, level);

    var appenderList;
    for(var appenderCategory in appenders) {
      if (doesAppenderContainsLogger(appenderCategory, loggerCategoryName)) {
        appenderList = appenders[appenderCategory];
        appenderList.forEach(function(appender) {
          loggers[loggerCategoryName].addListener("log", appender);
        });
      }
    }
    if (appenders[ALL_CATEGORIES]) {
      appenderList = appenders[ALL_CATEGORIES];
      appenderList.forEach(function(appender) {
        loggers[loggerCategoryName].addListener("log", appender);
      });
    }
  }
  
  return loggers[loggerCategoryName];
}

/**
 * args are appender, then zero or more categories
 */
function addAppender () {
  var args = Array.prototype.slice.call(arguments);
  var appender = args.shift();
  if (args.length === 0 || args[0] === undefined) {
    args = [ ALL_CATEGORIES ];
  }
  //argument may already be an array
  if (Array.isArray(args[0])) {
    args = args[0];
  }
  
  args.forEach(function(appenderCategory) {
    addAppenderToCategory(appender, appenderCategory);
    
    if (appenderCategory === ALL_CATEGORIES) {
      addAppenderToAllLoggers(appender);
    } else {

      for(var loggerCategory in loggers) {
        if (doesAppenderContainsLogger(appenderCategory,loggerCategory)) {
          loggers[loggerCategory].addListener("log", appender);
        }
      }
      
    }
  });
}

function addAppenderToAllLoggers(appender) {
  for (var logger in loggers) {
    if (hasLogger(logger)) {
      loggers[logger].addListener("log", appender);
    }
  }
}

function addAppenderToCategory(appender, category) {
  if (!appenders[category]) {
    appenders[category] = [];
  }
  appenders[category].push(appender);
}

function clearAppenders () {
  appenders = {};
  for (var logger in loggers) {
    if (hasLogger(logger)) {
      loggers[logger].removeAllListeners("log");
    }
  }
}

function configureAppenders(appenderList, options) {
  clearAppenders();
  if (appenderList) {
    appenderList.forEach(function(appenderConfig) {
      loadAppender(appenderConfig.type);
      var appender;
      appenderConfig.makers = appenderMakers;
      try {
        appender = appenderMakers[appenderConfig.type](appenderConfig, options);
        addAppender(appender, appenderConfig.category);
      } catch(e) {
        throw new Error("log4js configuration problem for " + util.inspect(appenderConfig), e);
      }
    });
  }
}

function configureLevels(_levels) {
  levels.config = _levels; // Keep it so we can create loggers later using this cfg
  if (_levels) {
    var keys = Object.keys(levels.config).sort();
    for (var idx in keys) {
      var category = keys[idx];
      if(category === ALL_CATEGORIES) {
        setGlobalLogLevel(_levels[category]);
      }        
      for(var loggerCategory in loggers) {
        if (doesLevelEntryContainsLogger(category, loggerCategory)) {
          loggers[loggerCategory].setLevel(_levels[category]);
        }
      }
    }
  }
}

function setGlobalLogLevel(level) {
  Logger.prototype.level = levels.toLevel(level, levels.TRACE);
}

/**
 * Get the default logger instance.
 * @return {Logger} instance of default logger
 * @static
 */
function getDefaultLogger () {
  return getLogger(Logger.DEFAULT_CATEGORY);
}

var configState = {};

function loadConfigurationFile(filename) {
  if (filename) {
    return JSON.parse(fs.readFileSync(filename, "utf8"));
  }
  return undefined;
}

function configureOnceOff(config, options) {
  if (config) {
    try {
      configureLevels(config.levels);
      configureAppenders(config.appenders, options);
      
      if (config.replaceConsole) {
        replaceConsole();
      } else {
        restoreConsole();
      }
    } catch (e) {
      throw new Error(
        "Problem reading log4js config " + util.inspect(config) + 
          ". Error was \"" + e.message + "\" (" + e.stack + ")"
      );
    }
  }
}

function reloadConfiguration(options) {
  var mtime = getMTime(configState.filename);
  if (!mtime) return;
  
  if (configState.lastMTime && (mtime.getTime() > configState.lastMTime.getTime())) {
    configureOnceOff(loadConfigurationFile(configState.filename), options);
  }
  configState.lastMTime = mtime;
}

function getMTime(filename) {
  var mtime;
  try {
    mtime = fs.statSync(configState.filename).mtime;
  } catch (e) {
    getLogger('log4js').warn('Failed to load configuration file ' + filename);
  }
  return mtime;
}

function initReloadConfiguration(filename, options) {
  if (configState.timerId) {
    clearInterval(configState.timerId);
    delete configState.timerId;
  }
  configState.filename = filename;
  configState.lastMTime = getMTime(filename);
  configState.timerId = setInterval(reloadConfiguration, options.reloadSecs*1000, options);
}

function configure(configurationFileOrObject, options) {
  var config = configurationFileOrObject;
  config = config || process.env.LOG4JS_CONFIG;
  options = options || {};
  
  if (config === undefined || config === null || typeof(config) === 'string') {
    if (options.reloadSecs) {
      initReloadConfiguration(config, options);
    }
    config = loadConfigurationFile(config) || defaultConfig;
  } else {
    if (options.reloadSecs) {
      getLogger('log4js').warn(
        'Ignoring configuration reload parameter for "object" configuration.'
      );
    }
  }
  configureOnceOff(config, options);
}

var originalConsoleFunctions = {
  log: console.log,
  debug: console.debug,
  info: console.info,
  warn: console.warn,
  error: console.error
};

function replaceConsole(logger) {
  function replaceWith(fn) {
    return function() {
      fn.apply(logger, arguments);
    };
  }
  logger = logger || getLogger("console");
  ['log','debug','info','warn','error'].forEach(function (item) {
    console[item] = replaceWith(item === 'log' ? logger.info : logger[item]);
  });
}

function restoreConsole() {
  ['log', 'debug', 'info', 'warn', 'error'].forEach(function (item) {
    console[item] = originalConsoleFunctions[item];
  });
}

/**
 * Load an appenderModule based on the provided appender filepath. Will first
 * check if the appender path is a subpath of the log4js "lib/appenders" directory.
 * If not, it will attempt to load the the appender as complete path.
 *
 * @param {string} appender The filepath for the appender.
 * @returns {Object|null} The required appender or null if appender could not be loaded.
 * @private
 */
function requireAppender(appender) {
  var appenderModule;
  try {
    appenderModule = require('./appenders/' + appender);
  } catch (e) {
    appenderModule = require(appender);
  }
  return appenderModule;
}

/**
 * Load an appender. Provided the appender path to be loaded. If appenderModule is defined,
 * it will be used in place of requiring the appender module.
 *
 * @param {string} appender The path to the appender module.
 * @param {Object|void} [appenderModule] The pre-required appender module. When provided,
 * instead of requiring the appender by its path, this object will be used.
 * @returns {void}
 * @private
 */
function loadAppender(appender, appenderModule) {
  appenderModule = appenderModule || requireAppender(appender);

  if (!appenderModule) {
    throw new Error("Invalid log4js appender: " + util.inspect(appender));
  }

  module.exports.appenders[appender] = appenderModule.appender.bind(appenderModule);
  if (appenderModule.shutdown) {
    appenderShutdowns[appender] = appenderModule.shutdown.bind(appenderModule);
  }
  appenderMakers[appender] = appenderModule.configure.bind(appenderModule);
}

/**
 * Shutdown all log appenders. This will first disable all writing to appenders
 * and then call the shutdown function each appender.
 *
 * @params {Function} cb - The callback to be invoked once all appenders have
 *  shutdown. If an error occurs, the callback will be given the error object
 *  as the first argument.
 * @returns {void}
 */
function shutdown(cb) {
  // First, disable all writing to appenders. This prevents appenders from
  // not being able to be drained because of run-away log writes.
  loggerModule.disableAllLogWrites();

  // Call each of the shutdown functions in parallel
  var completed = 0;
  var error;
  var shutdownFcts = [];
  var complete = function(err) {
    error = error || err;
    completed++;
    if (completed >= shutdownFcts.length) {
      cb(error);
    }
  };
  for (var category in appenderShutdowns) {
    if (appenderShutdowns.hasOwnProperty(category)) {
      shutdownFcts.push(appenderShutdowns[category]);
    }
  }
  if (!shutdownFcts.length) {
    return cb();
  }
  shutdownFcts.forEach(function(shutdownFct) { shutdownFct(complete); });
}

module.exports = {
  getBufferedLogger: getBufferedLogger,
  getLogger: getLogger,
  getDefaultLogger: getDefaultLogger,
  hasLogger: hasLogger,
  
  addAppender: addAppender,
  loadAppender: loadAppender,
  clearAppenders: clearAppenders,
  configure: configure,
  shutdown: shutdown,
  
  replaceConsole: replaceConsole,
  restoreConsole: restoreConsole,
  
  levels: levels,
  setGlobalLogLevel: setGlobalLogLevel,
  
  layouts: layouts,
  appenders: {},
  appenderMakers: appenderMakers,
  connectLogger: require('./connect-logger').connectLogger
};

//set ourselves up
configure();


}).call(this,require('_process'))
},{"./appenders/console":22,"./connect-logger":23,"./layouts":25,"./levels":26,"./logger":28,"_process":19,"events":20,"fs":18,"path":29,"util":31}],28:[function(require,module,exports){
"use strict";
var levels = require('./levels')
, util = require('util')
, events = require('events')
, DEFAULT_CATEGORY = '[default]';

var logWritesEnabled = true;

/**
 * Models a logging event.
 * @constructor
 * @param {String} categoryName name of category
 * @param {Log4js.Level} level level of message
 * @param {Array} data objects to log
 * @param {Log4js.Logger} logger the associated logger
 * @author Seth Chisamore
 */
function LoggingEvent (categoryName, level, data, logger) {
  this.startTime = new Date();
  this.categoryName = categoryName;
  this.data = data;
  this.level = level;
  this.logger = logger;
}

/**
 * Logger to log messages.
 * use {@see Log4js#getLogger(String)} to get an instance.
 * @constructor
 * @param name name of category to log to
 * @author Stephan Strittmatter
 */
function Logger (name, level) {
  this.category = name || DEFAULT_CATEGORY;

  if (level) {
    this.setLevel(level);
  }
}
util.inherits(Logger, events.EventEmitter);
Logger.DEFAULT_CATEGORY = DEFAULT_CATEGORY;
Logger.prototype.level = levels.TRACE;

Logger.prototype.setLevel = function(level) {
  this.level = levels.toLevel(level, this.level || levels.TRACE);
};

Logger.prototype.removeLevel = function() {
  delete this.level;
};

Logger.prototype.log = function() {
  var logLevel = levels.toLevel(arguments[0], levels.INFO);
  if (!this.isLevelEnabled(logLevel)) {
    return;
  }
  var numArgs = arguments.length - 1;
  var args = new Array(numArgs);
  for (var i = 0; i < numArgs; i++) {
    args[i] = arguments[i + 1];
  }
  this._log(logLevel, args);
};

Logger.prototype.isLevelEnabled = function(otherLevel) {
  return this.level.isLessThanOrEqualTo(otherLevel);
};

['Trace','Debug','Info','Warn','Error','Fatal', 'Mark'].forEach(
  function(levelString) {
    var level = levels.toLevel(levelString);
    Logger.prototype['is'+levelString+'Enabled'] = function() {
      return this.isLevelEnabled(level);
    };

    Logger.prototype[levelString.toLowerCase()] = function () {
      if (logWritesEnabled && this.isLevelEnabled(level)) {
        var numArgs = arguments.length;
        var args = new Array(numArgs);
        for (var i = 0; i < numArgs; i++) {
          args[i] = arguments[i];
        }
        this._log(level, args);
      }
    };
  }
);

Logger.prototype._log = function(level, data) {
  var loggingEvent = new LoggingEvent(this.category, level, data, this);
  this.emit('log', loggingEvent);
};

/**
 * Disable all log writes.
 * @returns {void}
 */
function disableAllLogWrites() {
  logWritesEnabled = false;
}

/**
 * Enable log writes.
 * @returns {void}
 */
function enableAllLogWrites() {
  logWritesEnabled = true;
}

exports.LoggingEvent = LoggingEvent;
exports.Logger = Logger;
exports.disableAllLogWrites = disableAllLogWrites;
exports.enableAllLogWrites = enableAllLogWrites;

},{"./levels":26,"events":20,"util":31}],29:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":19}],30:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],31:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":30,"_process":19,"inherits":21}],32:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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

	var AndSpecification = function (_Specification) {
		_inherits(AndSpecification, _Specification);

		function AndSpecification(specificationOne, specificationTwo) {
			_classCallCheck(this, AndSpecification);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AndSpecification).call(this));

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

	return AndSpecification;
}();

},{"./../lang/assert":11,"./Specification":38}],33:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ContainedSpecification).call(this));

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

},{"./../lang/assert":11,"./Specification":38}],34:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ContainsSpecification).call(this));

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

},{"./Specification":38}],35:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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

			return _possibleConstructorReturn(this, Object.getPrototypeOf(FailSpecification).call(this));
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

},{"./Specification":38}],36:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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

	var OrSpecification = function (_Specification) {
		_inherits(OrSpecification, _Specification);

		function OrSpecification(specificationOne, specificationTwo) {
			_classCallCheck(this, OrSpecification);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(OrSpecification).call(this));

			assert.argumentIsRequired(specificationOne, 'specificationOne', Specification, 'Specification');
			assert.argumentIsRequired(specificationTwo, 'specificationTwo', Specification, 'Specification');

			_this._specificationOne = specificationOne;
			_this._specificationTwo = specificationTwo;
			return _this;
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

	return OrSpecification;
}();

},{"./../lang/assert":11,"./Specification":38}],37:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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

			return _possibleConstructorReturn(this, Object.getPrototypeOf(PassSpecification).call(this));
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

},{"./Specification":38}],38:[function(require,module,exports){
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
			key: 'toString',
			value: function toString() {
				return '[Specification]';
			}
		}]);

		return Specification;
	}();

	return Specification;
}();

},{}],39:[function(require,module,exports){
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

},{"./../../../collections/Stack":2}],40:[function(require,module,exports){
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

},{"./../../../../collections/sorting/ComparatorBuilder":3}],41:[function(require,module,exports){
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

},{"./../../../../collections/sorting/comparators":4}],42:[function(require,module,exports){
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

},{"./../../../../collections/specialized/EvictingList":5}],43:[function(require,module,exports){
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

},{"./../../../../collections/specialized/EvictingMap":6}],44:[function(require,module,exports){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
	return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
	return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
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

},{"./../../../commands/CommandHandler":7}],45:[function(require,module,exports){
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

},{"./../../../commands/CommandHandler":7,"./../../../commands/CompositeCommandHandler":8}],46:[function(require,module,exports){
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

},{"./../../../commands/CommandHandler":7,"./../../../commands/MappedCommandHandler":9}],47:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TestDisposable).call(this));

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

},{"./../../../lang/Disposable":10}],48:[function(require,module,exports){
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
			}
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

},{"./../../../lang/attributes":12}],49:[function(require,module,exports){
'use strict';

var dateUtilities = require('./../../../lang/date');

describe('When extracting the "short" day of week', function () {
	'use strict';

	var july = 7 - 1;

	it("07/27/2016 should resove to 'Wed'", function () {
		expect(dateUtilities.getShortDay(new Date(2016, july, 27))).toEqual('Wed');
	});
});

},{"./../../../lang/date":13}],50:[function(require,module,exports){
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

},{"./../../../messaging/EventMap":15}],51:[function(require,module,exports){
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

},{"./../../../lang/Disposable":10,"./../../../messaging/Event":14}],52:[function(require,module,exports){
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

		describe('and both properties are updated', function () {
			var data;

			beforeEach(function () {
				model.firstName = 'Bryan';
				model.lastName = 'Ingle';
			});

			it('two transactions should be occur', function () {
				expect(spy.calls.count()).toEqual(2);
			});

			it('the first transaction should have updated the "first name" property', function () {
				var argsOne = spy.calls.argsFor(0);

				expect(argsOne[0].firstName).toEqual('Bryan');
				expect(argsOne[0].sequence).toEqual(0);

				expect(argsOne[1]).toBe(model);
			});

			it('the first transaction should have updated the "last name" property', function () {
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

			it('one transactions should be occur', function () {
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
	});
});

},{"./../../../lang/Disposable":10,"./../../../models/Model":16}],53:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SpecPass).call(this));

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

			var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(SpecFail).call(this));

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

},{"./../../../specifications/AndSpecification":32,"./../../../specifications/Specification":38}],54:[function(require,module,exports){
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

},{"./../../../specifications/ContainedSpecification":33}],55:[function(require,module,exports){
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

},{"./../../../specifications/ContainsSpecification":34}],56:[function(require,module,exports){
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

},{"./../../../specifications/FailSpecification":35}],57:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SpecPass).call(this));

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

			var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(SpecFail).call(this));

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

},{"./../../../specifications/OrSpecification":36,"./../../../specifications/Specification":38}],58:[function(require,module,exports){
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

},{"./../../../specifications/PassSpecification":37}],59:[function(require,module,exports){
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

					expect(duration).not.toBeLessThan(shortestPossibleDuration);
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

					expect(duration).not.toBeLessThan(shortestPossibleDuration);
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

					expect(duration).not.toBeLessThan(shortestPossibleDuration);
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

},{"./../../../timing/RateLimiter":61}],60:[function(require,module,exports){
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

},{"./../../../timing/Scheduler":62}],61:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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

var log4js = require('log4js');

var assert = require('./../lang/assert');
var Disposable = require('./../lang/Disposable');

var Queue = require('./../collections/Queue');
var Scheduler = require('./Scheduler');

module.exports = function () {
	'use strict';

	var logger = log4js.getLogger('common/timing/RateLimiter');

	var RateLimiter = function (_Disposable) {
		_inherits(RateLimiter, _Disposable);

		function RateLimiter(windowMaximumCount, windowDurationMilliseconds) {
			_classCallCheck(this, RateLimiter);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(RateLimiter).call(this));

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

				return new Promise(function (resolveCallback, rejectCallback) {
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

},{"./../collections/Queue":1,"./../lang/Disposable":10,"./../lang/assert":11,"./Scheduler":62,"log4js":27}],62:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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
var Disposable = require('./../lang/Disposable');

module.exports = function () {
    'use strict';

    var Scheduler = function (_Disposable) {
        _inherits(Scheduler, _Disposable);

        function Scheduler() {
            _classCallCheck(this, Scheduler);

            var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Scheduler).call(this));

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

                var schedulePromise = new Promise(function (resolveCallback, rejectCallback) {
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
        }, {
            key: 'backoff',
            value: function backoff(actionToBackoff, millisecondDelay, actionDescription, maximumAttempts) {
                var _this4 = this;

                assert.argumentIsRequired(actionToBackoff, 'actionToBackoff', Function);
                assert.argumentIsOptional(millisecondDelay, 'millisecondDelay', Number);
                assert.argumentIsOptional(actionDescription, 'actionDescription', String);
                assert.argumentIsOptional(maximumAttempts, 'maximumAttempts', Number);

                if (this.getIsDisposed()) {
                    throw new Error('The Scheduler has been disposed.');
                }

                var scheduleBackoff = function scheduleBackoff(failureCount) {
                    if (maximumAttempts > 0 && failureCount > maximumAttempts) {
                        return Promise.reject('Maximum failures reaacked for ' + actionDescription);
                    }

                    var backoffDelay = void 0;

                    if (failureCount === 0) {
                        backoffDelay = millisecondDelay;
                    } else {
                        backoffDelay = (millisecondDelay || 1000) * Math.pow(2, failureCount);
                    }

                    return _this4.schedule(actionToBackoff, backoffDelay, (actionDescription || 'unspecified') + ', attempt ' + (failureCount + 1)).then(function (result) {
                        if (result) {
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

                Object.keys(this._timeoutBindings).forEach(function (key) {
                    _this5._timeoutBindings[key].dispose();
                });

                Object.keys(this._intervalBindings).forEach(function (key) {
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

},{"./../lang/Disposable":10,"./../lang/assert":11}]},{},[40,41,42,43,39,44,45,46,48,49,47,50,51,52,53,54,55,56,57,58,59,60]);
