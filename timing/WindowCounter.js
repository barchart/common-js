var _ = require('lodash');
var Class = require('class.extend');
var log4js = require('log4js');

var assert = require('./../lang/assert');

module.exports = function() {
	'use strict';

	var logger = log4js.getLogger('common/timing/WindowCounter');

	var WindowCounter = Class.extend({
		init: function(duration) {
			assert.argumentIsRequired(duration, 'duration', Number);

			this._duration = duration;

			this._current = new Window(getTime(), this._duration);
			this._previous = null;

			this._previousCount = 0;
			this._previousWindows = 0;
		},

		increment: function(count) {
			assert.argumentIsRequired(count, 'count', Number);

			advance.call(this).increment(count);
		},

		getCurrent: function() {
			return advance.call(this).getCount();
		},

		getPrevious: function() {
			var current = advance.call(this);

			return this._previous.getCount();
		},

		getAverage: function() {
			var current = advance.call(this);

			return (this._current.getCount() + this._previousCount) / (this._previousWindows + 1);
		},

		toString: function() {
			return '[WindowCounter]';
		}
	});

	function advance() {
		var now = getTime();

		while (!this._current.contains(now)) {
			this._previous = this._current;
			this._current = new Window(this._previous.getEnd(), this._duration);

			this._previousCount = this._previousCount + this._previous.getCount();
			this._previousWindows = this._previousWindows + 1;
		}

		return this._current;
	}

	function getTime() {
		return (new Date()).getTime();
	}

	var Window = Class.extend({
		init: function(start, duration) {
			this._start = start;
			this._end = start + duration;

			this._count = 0;
		},

		contains: function(now) {
			return !(now < this._start || now > this._end);
		},

		increment: function(count) {
			this._count = this._count + count;
		},

		getStart: function() {
			return this._start;
		},

		getEnd: function() {
			return this._end;
		},

		getCount: function() {
			return this._count;
		}
	});

	return WindowCounter;
}();