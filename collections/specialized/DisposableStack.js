var Stack = require('./../Stack');

var assert = require('./../../lang/assert');
var Disposable = require('./../../lang/Disposable');

module.exports = function() {
	'use strict';

	var DisposableStack = Disposable.extend({
		init: function() {
			this._super();

			this._stack = new Stack();
		},

		push: function(disposable) {
			assert.argumentIsRequired(disposable, 'disposable', Disposable, 'Disposable');

			if (this.getIsDisposed()) {
				throw new Error('Unable to push item onto DisposableStack because it has been disposed.');
			}

			this._stack.push(disposable);
		},

		_onDispose: function() {
			while (!this._stack.empty()) {
				this._stack.pop().dispose();
			}
		},

		toString: function() {
			return '[DisposableStack]';
		}
	});

	DisposableStack.fromArray = function(bindings) {
		assert.argumentIsArray(bindings, 'bindings', Disposable, 'Disposable');

		var returnRef = new DisposableStack();

		for (var i = 0; i < bindings.length; i++) {
			returnRef.push(bindings[i]);
		}

		return returnRef;
	};

	return DisposableStack;
}();