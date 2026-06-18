import * as assert from './assert.js';

/**
 * An object that has an end-of-life process.
 *
 * @public
 */
export default class Disposable {

	#disposed;

	constructor() {
		this.#disposed = false;
	}

	/**
	 * Indicates if the dispose action has been executed.
	 *
	 * @public
	 * @returns {boolean}
	 */
	get disposed() {
		return this.#disposed;
	}

	/**
	 * Invokes end-of-life logic. Once this function has been
	 * invoked, further interaction with the object is not
	 * recommended.
	 *
	 * @public
	 */
	dispose() {
		if (this.#disposed) {
			return;
		}

		this.#disposed = true;

		this._onDispose();
	}

	/**
	 * @protected
	 * @abstract
	 * @ignore
	 */
	_onDispose() {

	}

	/**
	 * Returns true if the {@link Disposable#dispose} function has been invoked.
	 *
	 * @public
	 * @deprecated
	 * @returns {boolean}
	 */
	getIsDisposed() {
		return this.#disposed;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Disposable]';
	}

	/**
	 * Creates and returns a {@link Disposable} object with end-of-life logic
	 * delegated to a function.
	 *
	 * @public
	 * @static
	 * @param {Function} disposeAction
	 * @returns {Disposable}
	 */
	static fromAction(disposeAction) {
		assert.argumentIsRequired(disposeAction, 'disposeAction', Function);

		return new DisposableAction(disposeAction);
	}

	/**
	 * Creates and returns a {@link Disposable} object whose end-of-life
	 * logic does nothing.
	 *
	 * @public
	 * @static
	 * @returns {Disposable}
	 */
	static getEmpty() {
		return Disposable.fromAction(() => {

		});
	}
}

class DisposableAction extends Disposable {
	#disposeAction;

	/**
     * @param {Function} disposeAction
     */
	constructor(disposeAction) {
		super();

		this.#disposeAction = disposeAction;
	}

	/**
	 * @protected
	 * @override
	 */
	_onDispose() {
		this.#disposeAction();
		this.#disposeAction = null;
	}

	toString() {
		return '[DisposableAction]';
	}
}
