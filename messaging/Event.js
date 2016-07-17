var Disposable = require('./../lang/Disposable');

module.exports = (() => {
	'use strict';

	class Event extends Disposable {
		constructor(sender) {
			super();

			this._sender = sender || null;

			this._observers = [];
		}

		register(handler) {
			if (typeof handler !== 'function') {
				throw new Error('Event handler must be a function.');
			}

			addRegistration.call(this, handler);

			return Disposable.fromAction(() => {
				if (this.getIsDisposed()) {
					return;
				}

				removeRegistration.call(this, handler);
			});
		}

		unregister(handler) {
			if (typeof handler !== 'function') {
				throw new Error('Event handler must be a function.');
			}

			removeRegistration.call(this, handler);
		}

		clear() {
			this._observers = [];
		}

		fire(data) {
			let observers = this._observers;

			for (let i = 0; i < observers.length; i++) {
				let observer = observers[i];

				observer(data, this._sender);
			}
		}

		getIsEmpty() {
			return this._observers.length === 0;
		}

		_onDispose() {
			this._observers = null;
		}

		toString() {
			return '[Event]';
		}
	}

	function addRegistration(handler) {
		let copiedObservers = this._observers.slice();

		copiedObservers.push(handler);

		this._observers = copiedObservers;
	}

	function removeRegistration(handler) {
		const indiciesToRemove = [];

		for (let i = 0; i < this._observers.length; i++) {
			let candidate = this._observers[i];

			if (candidate === handler) {
				indiciesToRemove.push(i);
			}
		}

		if (indiciesToRemove.length > 0) {
			const copiedObservers = this._observers.slice();

			for (let j = indiciesToRemove.length - 1; !(j < 0); j--) {
				copiedObservers.splice(indiciesToRemove[j], 1);
			}

			this._observers = copiedObservers;
		}
	}

	return Event;
})();