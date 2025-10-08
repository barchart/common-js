const assert = require('./assert');

module.exports = (() => {
	'use strict';

	/**
	 * An object that has an end-of-life process.
	 *
	 * @public
	 */
	class Disposable {
		constructor() {
			this._disposed = false;
		}

		/**
		 * Indicates if the dispose action has been executed.
		 *
		 * @public
		 * @returns {boolean}
		 */
		get disposed() {
			return this._disposed;
		}

		/**
		 * Invokes end-of-life logic. Once this function has been
		 * invoked, further interaction with the object is not
		 * recommended.
		 *
		 * @public
		 */
		dispose() {
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
			return this._disposed;
		}

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
		constructor(disposeAction) {
			super(disposeAction);

			this._disposeAction = disposeAction;
		}

		_onDispose() {
			this._disposeAction();
			this._disposeAction = null;
		}

		toString() {
			return '[DisposableAction]';
		}
	}

	return Disposable;
})();
