const Stack = require('./../Stack');

const assert = require('./../../lang/assert'),
	Disposable = require('./../../lang/Disposable'),
	is = require('./../../lang/is');

module.exports = (() => {
	'use strict';

	/**
	 * A stack of {@link Disposable} instances which itself inherits {@Disposable}.
	 * When {@link DisposableStack#dispose} is called, then each item in the collection
	 * is disposed in order.
	 *
	 * @public
	 * @extends {Disposable}
	 */
	class DisposableStack extends Disposable {
		constructor() {
			super();

			this._stack = new Stack();
		}

		/**
		 * Adds a new {@link Disposable} instance to the stack.
		 *
		 * @public
		 * @param {Disposable} disposable - The item to add.
		 */
		push(disposable) {
			assert.argumentIsRequired(disposable, 'disposable', Disposable, 'Disposable');

			if (this.getIsDisposed()) {
				throw new Error('Unable to push item onto DisposableStack because it has been disposed.');
			}

			this._stack.push(disposable);
		}

		_onDispose() {
			while (!this._stack.empty()) {
				this._stack.pop().dispose();
			}
		}

		static fromArray(bindings) {
			assert.argumentIsArray(bindings, 'bindings', Disposable, 'Disposable');

			const returnRef = new DisposableStack();

			for (let i = 0; i < bindings.length; i++) {
				returnRef.push(bindings[i]);
			}

			return returnRef;
		}

		static pushPromise(stack, promise) {
			assert.argumentIsRequired(stack, 'stack', DisposableStack, 'DisposableStack');
			assert.argumentIsRequired(promise, 'promise');

			return promise.then((b) => {
				let bindings;

				if (is.array(b)) {
					bindings = b;
				} else {
					bindings = [ b ];
				}

				bindings.forEach(binding => stack.push(binding));
			});
		}
	}

	return DisposableStack;
})();