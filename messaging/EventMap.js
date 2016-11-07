var _ = require('lodash');

var assert = require('./../lang/assert');
var Class = require('class.extend');

var Event = require('./Event');

module.exports = function() {
	'use strict';

	var EventMap = Class.extend({
		init: function() {
			this._events = {};
		},

		fire: function(eventName, data) {
			var event = this._events[eventName];

			if (event) {
				event.fire(data);
			}
		},

		register: function(eventName, handler) {
			assert.argumentIsRequired(eventName, 'eventName', String);

			var event = this._events[eventName];

			if (!event) {
				event = this._events[eventName] = new Event(this);
			}

			event.register(handler);
		},

		unregister: function(eventName, handler) {
			assert.argumentIsRequired(eventName, 'eventName', String);

			var event = this._events[eventName];

			if (event) {
				event.unregister(handler);

				if (event.getIsEmpty()) {
					delete this._events[eventName];
				}
			}
		},

		clear(eventName) {
			assert.argumentIsRequired(eventName, 'eventName', String);

			var event = this._events[eventName];

			if (event) {
				event.clear();

				delete this._events[eventName];
			}
		},

		getIsEmpty(eventName) {
			var event = this._events[eventName];

			var returnVal;

			if (event) {
				returnVal = event.getIsEmpty();
			} else {
				returnVal = true;
			}

			return returnVal;
		},

		getKeys() {
			var keys = [];

			for (var key in this._events) {
				if (this._events.hasOwnProperty(key)) {
					keys.push(key);
				}
			}

			return keys;
		},

		hasKey(key) {
			return this._events.hasOwnProperty(key);
		},

		toString() {
			return '[EventMap]';
		}
	});

	return EventMap;
}();