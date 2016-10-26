var _ = require('lodash');
var Class = require('class.extend');
var log4js = require('log4js');

var assert = require('./../lang/assert');
var Queue = require('./../collections/Queue');

module.exports = function() {
	'use strict';

	var logger = log4js.getLogger('common/timing/WindowCounter');

	var WindowCounter = Class.extend({
		init: function(duration, windows) {
			assert.argumentIsRequired(duration, 'duration', Number);
			assert.argumentIsRequired(windows, 'windows', Number);

			this._duration = duration;

			this._windows = [ new Window(getTime(), this._duration) ];
			this._maximum = Math.max(windows, 2);

			this._previousCount = 0;
		},

		increment: function(count) {
			assert.argumentIsRequired(count, 'count', Number);

			advance.call(this).increment(count);
		},

		getCurrent: function() {
			return advance.call(this).getCount();
		},

		getAverage: function() {
			var current = advance.call(this);

			return (current.getCount() + this._previousCount) / this._windows.length;
		},

		toString: function() {
			return '[WindowCounter]';
		}
	});

	function advance() {
		var now = getTime();

		while (!this._windows[0].contains(now)) {
			var previous = this._windows[0];
			var current = new Window(previous.getEnd(), this._duration);

			this._windows.unshift(current);

			this._previousCount = this._previousCount + previous.getCount();

			if (this._windows.length > this._maximum) {
				var removed = this._windows.pop();
				
				this._previousCount = this._previousCount - removed.getCount();
			}
		}

		return this._windows[0];
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