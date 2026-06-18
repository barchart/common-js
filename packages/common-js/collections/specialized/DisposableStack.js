import * as assert from './../../lang/assert.js';
import * as is from './../../lang/is.js';

import Stack from './../Stack.js';
import Disposable from './../../lang/Disposable.js';

/**
 * A stack of {@link Disposable} instances which itself inherits {@Disposable}.
 * When {@link DisposableStack#dispose} is called, then each item in the collection
 * is disposed in order.
 *
 * @public
 * @extends {Disposable}
 */
export default class DisposableStack extends Disposable {
	#stack;

	constructor() {
		super();

		this.#stack = new Stack();
	}

	/**
	 * Adds a new {@link Disposable} instance to the stack.
	 *
	 * @public
	 * @param {Disposable} disposable - The item to add.
	 */
	push(disposable) {
		assert.argumentIsRequired(disposable, 'disposable', Disposable, 'Disposable');

		if (this.disposed) {
			throw new Error('Unable to push item onto DisposableStack because it has been disposed.');
		}

		this.#stack.push(disposable);
	}

	/**
	 * @protected
	 * @override
	 */
	_onDispose() {
		while (!this.#stack.empty()) {
			this.#stack.pop().dispose();
		}
	}

	/**
	 * @public
	 * @static
	 * @param {*} bindings
	 * @returns {DisposableStack}
	 */
	static fromArray(bindings) {
		assert.argumentIsArray(bindings, 'bindings', Disposable, 'Disposable');

		const returnRef = new DisposableStack();

		for (let i = 0; i < bindings.length; i++) {
			returnRef.push(bindings[i]);
		}

		return returnRef;
	}

	/**
	 * @public
	 * @static
	 * @param {*} stack
	 * @param {*} promise
	 * @returns {Promise}
	 */
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
