var assert = require('./../lang/assert');
var Disposable = require('./../lang/Disposable');
var promise = require('./../lang/promise');

var Queue = require('./../collections/Queue');
var Scheduler = require('./Scheduler');

module.exports = (() => {
	'use strict';

	class RateLimiter extends Disposable {
		constructor(windowMaximumCount, windowDurationMilliseconds) {
			super();

			assert.argumentIsRequired(windowMaximumCount, 'windowMaximumCount', Number);
			assert.argumentIsRequired(windowDurationMilliseconds, 'windowDurationMilliseconds', Number);

			this._windowMaximumCount = windowMaximumCount;
			this._windowDurationMilliseconds = windowDurationMilliseconds;

			this._scheduler = new Scheduler();

			this._workQueue = new Queue();

			this._windowStart = null;
			this._windowCounter = 0;
		}

		enqueue(actionToEnqueue) {
			assert.argumentIsRequired(actionToEnqueue, 'actionToEnqueue', Function);

			if (this.getIsDisposed()) {
				throw new Error('Unable to enqueue action, the rate limiter has been disposed.');
			}

			return promise.build((resolveCallback, rejectCallback) => {
				this._workQueue.enqueue(() => {
					Promise.resolve()
						.then(() => {
							return actionToEnqueue();
						}).then((result) => {
							resolveCallback(result);
						}).catch((error) => {
							rejectCallback(error);
						}).then(() => {
							checkStart.call(this);
						});
				});

				checkStart.call(this);
			});
		}

		_onDispose() {
			this._scheduler.dispose();

			this._workQueue = null;
		}

		toString() {
			return '[RateLimiter]';
		}
	}

	function checkStart() {
		if (this.getIsDisposed()) {
			return;
		}

		if (this._workQueue.empty()) {
			return;
		}

		if (this._windowStart === null) {
			const timestamp = new Date();

			this._windowStart = timestamp.getTime();
			this._windowCounter = 0;

			const resetWindow = () => {
				this._windowStart = null;
				this._windowCounter = 0;

				checkStart.call(this);
			};

			this._scheduler.schedule(resetWindow, this._windowDurationMilliseconds, 'Rate Limiter Window Reset');
		}

		if (this._windowCounter < this._windowMaximumCount) {
			this._windowCounter = this._windowCounter + 1;

			const actionToExecute = this._workQueue.dequeue();

			actionToExecute();
		}
	}

	return RateLimiter;
})();