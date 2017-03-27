const assert = require('./../lang/assert'),
	Disposable = require('./../lang/Disposable'),
	Event = require('./Event');

module.exports = (() => {
	'use strict';

	class EventMap extends Disposable {
		constructor() {
			super();

			this._events = {};
		}

		fire(eventName, data) {
			const event = this._events[eventName];

			if (event) {
				event.fire(data);
			}
		}

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

		clear(eventName) {
			assert.argumentIsRequired(eventName, 'eventName', String);

			const event = this._events[eventName];

			if (event) {
				event.clear();

				delete this._events[eventName];
			}
		}

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

		getKeys() {
			const keys = [];

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
