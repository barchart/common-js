import * as assert from './../lang/assert.js';

import Disposable from './../lang/Disposable.js';
import Event from './Event.js';

/**
 * A container for {@link Event} instances where each event is
 * keyed by name.
 *
 * @public
 * @extends {Disposable}
 */
export default class EventMap extends Disposable {
	#events;

	constructor() {
		super();

		this.#events = {};
	}

	/**
	 * Fires the appropriate event which is mapped to the event name.
	 * See {@link Event#fire} for more information.
	 *
	 * @public
	 * @param {string} eventName - The event's name.
	 * @param {*} data - The data to provide to observers.
	 */
	fire(eventName, data) {
		const event = this.#events[eventName];

		if (event) {
			event.fire(data);
		}
	}

	/**
	 * Registers a handler. See {@link Event#register} for more information.
	 *
	 * @public
	 * @param {string} eventName - The event's name.
	 * @param {Function} handler
	 * @returns {Disposable}
	 */
	register(eventName, handler) {
		assert.argumentIsRequired(eventName, 'eventName', String);

		if (this.disposed) {
			throw new Error('The event has been disposed.');
		}

		let event = this.#events[eventName];

		if (!event) {
			event = this.#events[eventName] = new Event(this);
		}

		return event.register(handler);
	}

	/**
	 * Removes a handler. See {@link Event#unregister} for more information.
	 *
	 * @public
	 * @param {string} eventName - The event's name.
	 * @param {Function} handler
	 */
	unregister(eventName, handler) {
		assert.argumentIsRequired(eventName, 'eventName', String);

		const event = this.#events[eventName];

		if (event) {
			event.unregister(handler);

			if (event.getIsEmpty()) {
				delete this.#events[eventName];
			}
		}
	}

	/**
	 * Clears an event's handlers. See {@link Event#clear} for more information.
	 *
	 * @public
	 * @param {string} eventName - The event's name.
	 */
	clear(eventName) {
		assert.argumentIsRequired(eventName, 'eventName', String);

		const event = this.#events[eventName];

		if (event) {
			event.clear();

			delete this.#events[eventName];
		}
	}

	/**
	 * Returns true, if no handlers are currently registered for the
	 * specified event. See {@link Event#getIsEmpty} for more information.
	 *
	 * @public
	 * @param {string} eventName
	 * @returns {boolean}
	 */
	getIsEmpty(eventName) {
		const event = this.#events[eventName];

		let returnVal;

		if (event) {
			returnVal = event.getIsEmpty();
		} else {
			returnVal = true;
		}

		return returnVal;
	}

	/**
	 * Returns an array of all the event names.
	 *
	 * @public
	 * @returns {Array<string>}
	 */
	getKeys() {
		const keys = [];

		for (let key in this.#events) {
			if (this.#events.hasOwnProperty(key)) {
				keys.push(key);
			}
		}

		return keys;
	}

	/**
	 * Returns true, if an event with the given name exists.
	 *
	 * @public
	 * @param {string} key
	 * @returns {boolean}
	 */
	hasKey(key) {
		return this.#events.hasOwnProperty(key);
	}

	/**
	 * @protected
	 * @override
	 */
	_onDispose() {
		let keys = this.getKeys();

		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];

			this.#events[key].dispose();
		}

		this.#events = { };
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[EventMap]';
	}
}
