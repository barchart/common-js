const assert = require('./assert');

module.exports = (() => {
	'use strict';

	class Disposable {
		constructor() {
			this._disposed = false;
		}

		dispose() {
			if (this._disposed) {
				return;
			}

			this._disposed = true;

			this._onDispose();
		}

		_onDispose() {
			return;
		}

		getIsDisposed() {
			return this._disposed || false;
		}

		toString() {
			return '[Disposable]';
		}

		static fromAction(disposeAction) {
			assert.argumentIsRequired(disposeAction, 'disposeAction', Function);

			return new DisposableAction(disposeAction);
		}

		static getEmpty() {
			return Disposable.fromAction(() => {
				return;
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
