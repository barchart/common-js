const assert = require('./../lang/assert'),
	Disposable = require('./../lang/Disposable'),
	Event = require('./Event');

module.exports = (() => {
	'use strict';

	/**
	 * A container for {@link Event} instances where each event is
	 * keyed by name.
	 */
	class EventMap extends Disposable {
		constructor() {
			super();

			this._events = {};
		}

		/**
		 * Fires the appropriate event which is mapped to the event name.
		 * See {@link Event#fire} for more information.
		 *
		 * @public
		 * @param {String} eventName - The event's name.
		 * @param {*} data - The data to provide to observers.
		 */
		fire(eventName, data) {
			const event = this._events[eventName];

			if (event) {
				event.fire(data);
			}
		}

		/**
		 * Registers a handler. See {@link Event#register} for more information.
		 *
		 * @public
		 * @param {String} eventName - The event's name.
		 * @param {Function} handler
		 */
		register(eventName, handler) {
			assert.argumentIsRequired(eventName, 'eventName', String);

			if (this.getIsDisposed()) {
				throw new Error('The event has been disposed.');
			}

			let event = this._events[eventName];

			if (!event) {
				event = this._events[eventName] = new Event(this);
			}

			return event.register(handler);
		}

		/**
		 * Removes a handler. See {@link Event#unregister} for more information.
		 *
		 * @public
		 * @param {String} eventName - The event's name.
		 * @param {Function} handler
		 */
		unregister(eventName, handler) {
			assert.argumentIsRequired(eventName, 'eventName', String);

			const event = this._events[eventName];

			if (event) {
				event.unregister(handler);

				if (event.getIsEmpty()) {
					delete this._events[eventName];
				}
			}
		}

		/**
		 * Clears an event's handlers. See {@link Event#clear} for more information.
		 *
		 * @public
		 * @param {String} eventName - The event's name.
		 */
		clear(eventName) {
			assert.argumentIsRequired(eventName, 'eventName', String);

			const event = this._events[eventName];

			if (event) {
				event.clear();

				delete this._events[eventName];
			}
		}

		/**
		 * Returns true, if no handlers are currently registered for the
		 * specified event. See {@link Event#getIsEmpty} for more information.
		 *
		 * @returns {boolean}
		 */
		getIsEmpty(eventName) {
			const event = this._events[eventName];

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
		 * @returns {Array<String>}
		 */
		getKeys() {
			const keys = [];

			for (let key in this._events) {
				if (this._events.hasOwnProperty(key)) {
					keys.push(key);
				}
			}

			return keys;
		}

		/**
		 * Returns true, if an event with the given name exists.
		 *
		 * @param {String} key
		 * @returns {boolean}
		 */
		hasKey(key) {
			return this._events.hasOwnProperty(key);
		}

		_onDispose() {
			let keys = this.getKeys();

			for (let i = 0; i < keys.length; i++) {
				let key = keys[i];

				this._events[key].dispose();
			}

			this._events = { };
		}

		toString() {
			return '[EventMap]';
		}
	}

	return EventMap;
})();
