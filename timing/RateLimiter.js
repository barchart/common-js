var _ = require('lodash');
var log4js = require('log4js');
var when = require('when');
var guard = require('when/guard');

var assert = require('./../lang/assert');
var Disposable = require('./../lang/Disposable');

var Queue = require('./../collections/Queue');
var Scheduler = require('./Scheduler');

module.exports = function() {
	'use strict';

	var logger = log4js.getLogger('common/timing/RateLimiter');

	var RateLimiter = Disposable.extend({
		init: function(windowMaximumCount, windowDurationMilliseconds) {
			this._super();

			assert.argumentIsRequired(windowMaximumCount, 'windowMaximumCount', Number);
			assert.argumentIsRequired(windowDurationMilliseconds, 'windowDurationMilliseconds', Number);

			this._windowMaximumCount = windowMaximumCount;
			this._windowDurationMilliseconds = windowDurationMilliseconds;

			this._scheduler = new Scheduler();

			this._workQueue = new Queue();

			this._windowStart = null;
			this._windowCounter = 0;
		},

		enqueue: function(actionToEnqueue) {
			assert.argumentIsRequired(actionToEnqueue, 'actionToEnqueue', Function);

			var that = this;

			if (that.getIsDisposed()) {
				throw new Error('Unable to enqueue action, the rate limiter has been disposed.');
			}

			var deferred = when.defer();

			that._workQueue.enqueue(function() {
				return when.try(function() {
					return actionToEnqueue();
				}).then(function(result) {
					deferred.resolve(result);
				});
			});

			checkStart.call(that);

			return deferred.promise;
		},

		_onDispose: function() {
			this._scheduler.dispose();

			this._workQueue = null;
		},

		toString: function() {
			return '[RateLimiter]';
		}
	});

	function checkStart() {
		var that = this;

		if (that.getIsDisposed()) {
			return;
		}

		if (that._workQueue.empty()) {
			return;
		}

		if (that._windowStart === null) {
			var timestamp = new Date();

			that._windowStart = timestamp.getTime();
			that._windowCounter = 0;

			var resetWindow = function() {
				that._windowStart = null;
				that._windowCounter = 0;

				checkStart.call(that);
			};

			that._scheduler.schedule(resetWindow, that._windowDurationMilliseconds, 'Rate Limiter Window Reset');
		}

		if (that._windowCounter < this._windowMaximumCount) {
			that._windowCounter = that._windowCounter + 1;

			var actionToExecute = that._workQueue.dequeue();

			actionToExecute().then(function() {
				checkStart.call(that);
			});
		}
	}

	return RateLimiter;
}();