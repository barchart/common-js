import * as assert from './../lang/assert.js';

import Disposable from './../lang/Disposable.js';

/**
 * An implementation of the observer pattern.
 *
 * @public
 * @extends {Disposable}
 */
export default class Event extends Disposable {
	#sender;
	#observers;

	/**
	 * @param {*} sender - The object which owns the event.
	 */
	constructor(sender) {
		super();

		this.#sender = sender || null;

		this.#observers = [ ];
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

		this.#addRegistration(handler);

		return Disposable.fromAction(() => {
			if (this.disposed) {
				return;
			}

			this.#removeRegistration(handler);
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

		this.#removeRegistration(handler);
	}

	/**
	 * Removes all handlers from the event.
	 *
	 * @public
	 */
	clear() {
		this.#observers = [];
	}

	/**
	 * Triggers the event, calling all previously registered handlers.
	 *
	 * @public
	 * @param {*} data - The data to pass each handler.
	 */
	fire(data) {
		let observers = this.#observers;

		for (let i = 0; i < observers.length; i++) {
			let observer = observers[i];

			observer(data, this.#sender);
		}
	}

	/**
	 * Returns true if no handlers are currently registered.
	 *
	 * @public
	 * @returns {boolean}
	 */
	getIsEmpty() {
		return this.#observers.length === 0;
	}

	/**
	 * @protected
	 * @override
	 */
	_onDispose() {
		this.#observers = null;
	}

	#addRegistration(handler) {
		let copiedObservers = this.#observers.slice();

		copiedObservers.push(handler);

		this.#observers = copiedObservers;
	}

	#removeRegistration(handler) {
		const indicesToRemove = [];

		for (let i = 0; i < this.#observers.length; i++) {
			let candidate = this.#observers[i];

			if (candidate === handler) {
				indicesToRemove.push(i);
			}
		}

		if (indicesToRemove.length > 0) {
			const copiedObservers = this.#observers.slice();

			for (let j = indicesToRemove.length - 1; !(j < 0); j--) {
				copiedObservers.splice(indicesToRemove[j], 1);
			}

			this.#observers = copiedObservers;
		}
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Event]';
	}
}
