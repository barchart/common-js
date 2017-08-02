const assert = require('./../lang/assert'),
	Disposable = require('./../lang/Disposable');

module.exports = (() => {
	'use strict';

	/**
	 * An implementation of the observer pattern.
	 *
	 * @param {*} sender - The object which owns the event.
	 */
	class Event extends Disposable {
		constructor(sender) {
			super();

			this._sender = sender || null;

			this._observers = [];
		}

		/**
		 * Registers an event handler which will receive a notification when
		 * {@link Event#fire} is called.
		 *
		 * @public
		 * @param {Function} handler - The function which will be called each time the event fires. The first argument will be the event data. The second argument will be the event owner (i.e. sender).
		 * @returns {Disposable}
		 */
		register(handler) {
			assert.argumentIsRequired(handler, 'handler', Function);

			addRegistration.call(this, handler);

			return Disposable.fromAction(() => {
				if (this.getIsDisposed()) {
					return;
				}

				removeRegistration.call(this, handler);
			});
		}

		/**
		 * Removes registration for an event handler. That is, the handler will
		 * no longer be called if the event fires.
		 *
		 * @public
		 * @param {Function} handler
		 */
		unregister(handler) {
			assert.argumentIsRequired(handler, 'handler', Function);

			removeRegistration.call(this, handler);
		}

		/**
		 * Removes all handlers from the event.
		 *
		 * @public
		 */
		clear() {
			this._observers = [];
		}

		/**
		 * Triggers the event, calling all previously registered handlers.
		 *
		 * @public
		 * @param {*) data - The data to pass each handler.
		 */
		fire(data) {
			let observers = this._observers;

			for (let i = 0; i < observers.length; i++) {
				let observer = observers[i];

				observer(data, this._sender);
			}
		}

		/**
		 * Returns true, if no handlers are currently registered.
		 *
		 * @returns {boolean}
		 */
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
		const indicesToRemove = [];

		for (let i = 0; i < this._observers.length; i++) {
			let candidate = this._observers[i];

			if (candidate === handler) {
				indicesToRemove.push(i);
			}
		}

		if (indicesToRemove.length > 0) {
			const copiedObservers = this._observers.slice();

			for (let j = indicesToRemove.length - 1; !(j < 0); j--) {
				copiedObservers.splice(indicesToRemove[j], 1);
			}

			this._observers = copiedObservers;
		}
	}

	return Event;
})();
