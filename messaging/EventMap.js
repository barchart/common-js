var Event = require('./Event');

module.exports = (() => {
	'use strict';

	class EventMap {
		constructor() {
			this._events = {};
		}

		fire(eventName, data) {
			let event = this._events[eventName];

			if (event) {
				event.fire(data);
			}
		}

		register(eventName, handler) {
			if (typeof eventName !== 'string') {
				throw new Error('An event name must be a string.');
			}

			let event = this._events[eventName];

			if (!event) {
				event = this._events[eventName] = new Event(this);
			}

			event.register(handler);
		}

		unregister(eventName, handler) {
			if (typeof eventName !== 'string') {
				throw new Error('An event name must be a string.');
			}

			let event = this._events[eventName];

			if (event) {
				event.unregister(handler);

				if (event.getIsEmpty()) {
					delete this._events[eventName];
				}
			}
		}

		clear(eventName) {
			if (typeof eventName !== 'string') {
				throw new Error('An event name must be a string.');
			}

			let event = this._events[eventName];

			if (event) {
				event.clear();

				delete this._events[eventName];
			}
		}

		getIsEmpty(eventName) {
			let event = this._events[eventName];

			let returnVal;

			if (event) {
				returnVal = event.getIsEmpty();
			} else {
				returnVal = true;
			}

			return returnVal;
		}

		getKeys() {
			let keys = [];

			for (let key in this._events) {
				if (this._events.hasOwnProperty(key)) {
					keys.push(key);
				}
			}

			return keys;
		}

		hasKey(key) {
			return this._events.hasOwnProperty(key);
		}

		toString() {
			return '[EventMap]';
		}
	}

	return EventMap;
})();