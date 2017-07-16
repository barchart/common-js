const assert = require('./../lang/assert'),
	Disposable = require('./../lang/Disposable'),
	is = require('./../lang/is'),
	object = require('./../lang/object'),
	promise = require('./../lang/promise');

module.exports = (() => {
	'use strict';

	/**
	 * An object that wraps asynchronous delays (i.e. timeout and interval).
	 */
	class Scheduler extends Disposable {
		constructor() {
			super();

			this._timeoutBindings = {};
			this._intervalBindings = {};
		}

		/**
		 * Schedules an action to execute in the future, returning a Promise.
		 *
		 * @param {Function} actionToSchedule - The action to execute.
		 * @param {number} millisecondDelay - Milliseconds before the action can be started.
		 * @param {string=} actionDescription - A description of the action, used for logging purposes.
		 * @returns {Promise}
		 */
		schedule(actionToSchedule, millisecondDelay, actionDescription) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(actionToSchedule, 'actionToSchedule', Function);
					assert.argumentIsRequired(millisecondDelay, 'millisecondDelay', Number);
					assert.argumentIsOptional(actionDescription, 'actionDescription', String);

					if (this.getIsDisposed()) {
						throw new Error('The Scheduler has been disposed.');
					}

					let token;

					const schedulePromise = promise.build((resolveCallback, rejectCallback) => {
						const wrappedAction = () => {
							delete this._timeoutBindings[token];

							try {
								resolveCallback(actionToSchedule());
							} catch (e) {
								rejectCallback(e);
							}
						};

						token = setTimeout(wrappedAction, millisecondDelay);
					});

					this._timeoutBindings[token] = Disposable.fromAction(() => {
						clearTimeout(token);

						delete this._timeoutBindings[token];
					});

					return schedulePromise;
				});
		}

		repeat(actionToRepeat, millisecondInterval, actionDescription) {
			assert.argumentIsRequired(actionToRepeat, 'actionToRepeat', Function);
			assert.argumentIsRequired(millisecondInterval, 'millisecondInterval', Number);
			assert.argumentIsOptional(actionDescription, 'actionDescription', String);

			if (this.getIsDisposed()) {
				throw new Error('The Scheduler has been disposed.');
			}

			const wrappedAction = () => {
				try {
					actionToRepeat();
				} catch (e) {

				}
			};

			const token = setInterval(wrappedAction, millisecondInterval);

			this._intervalBindings[token] = Disposable.fromAction(() => {
				clearInterval(token);

				delete this._intervalBindings[token];
			});

			return this._intervalBindings[token];
		}

		/**
		 * Attempts an action, repeating if necessary, using an exponential backoff.
		 *
		 * @param {Function} actionToBackoff - The action to attempt. If it fails -- because an error is thrown, a promise is rejected, or the function returns a falsey value -- the action will be invoked again.
		 * @param {number=} millisecondDelay - The amount of time to wait to execute the action. Subsequent failures are multiply this value by 2 ^ [number of failures]. So, a 1000 millisecond backoff would schedule attempts using the following delays: 0, 1000, 2000, 4000, 8000, etc. If not specified, the first attemopt will execute immediately, then a value of 1000 will be used.
		 * @param {string=} actionDescription - Description of the action to attempt, used for logging purposes.
		 * @param {number=} maximumAttempts - The number of attempts to before giving up.
		 * @param {Function=} maximumAttempts - If provided, will be invoked if a function is considered to be failing.
		 * @param {Object=} failureValue - If provided, will consider the result to have failed, if this value is returned (a deep equality check is used). If not provided, a "falsey" value will trigger a retry.
		 */
		backoff(actionToBackoff, millisecondDelay, actionDescription, maximumAttempts, failureCallback, failureValue) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(actionToBackoff, 'actionToBackoff', Function);
					assert.argumentIsOptional(millisecondDelay, 'millisecondDelay', Number);
					assert.argumentIsOptional(actionDescription, 'actionDescription', String);
					assert.argumentIsOptional(maximumAttempts, 'maximumAttempts', Number);
					assert.argumentIsOptional(failureCallback, 'failureCallback', Function);

					if (this.getIsDisposed()) {
						throw new Error('The Scheduler has been disposed.');
					}

					const scheduleBackoff = (failureCount) => {
						if (failureCount > 0 && is.fn(failureCallback)) {
							failureCallback(failureCount);
						}

						if (maximumAttempts > 0 && failureCount > maximumAttempts) {
							return Promise.reject(`Maximum failures reached for ${actionDescription}`);
						}

						let backoffDelay;

						if (failureCount === 0) {
							backoffDelay = (millisecondDelay || 0);
						} else {
							backoffDelay = (millisecondDelay || 1000) * Math.pow(2, failureCount);
						}

						let successPredicate;

						if (is.undefined(failureValue)) {
							successPredicate = (value) => value;
						} else {
							successPredicate = (value) => {
								return !object.equals(value, failureValue);
							};
						}

						return this.schedule(actionToBackoff, backoffDelay, (actionDescription || 'unspecified') + ', attempt ' + (failureCount + 1))
							.then((result) => {
								if (successPredicate(result)) {
									return result;
								} else {
									return scheduleBackoff(++failureCount);
								}
							}).catch((e) => {
								return scheduleBackoff(++failureCount);
							});
					};

					return scheduleBackoff(0);
				});
		}

		_onDispose() {
			object.keys(this._timeoutBindings).forEach((key) => {
				this._timeoutBindings[key].dispose();
			});

			object.keys(this._intervalBindings).forEach((key) => {
				this._intervalBindings[key].dispose();
			});

			this._timeoutBindings = null;
			this._intervalBindings = null;
		}

		static schedule(actionToSchedule, millisecondDelay, actionDescription) {
			const scheduler = new Scheduler();

			scheduler.schedule(actionToSchedule, millisecondDelay, actionDescription)
				.then((result) => {
					scheduler.dispose();

					return result;
				}).catch((e) => {
				scheduler.dispose();

				throw e;
			});
		}

		toString() {
			return '[Scheduler]';
		}
	}

	return Scheduler;
})();
