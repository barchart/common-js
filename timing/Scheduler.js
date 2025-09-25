const assert = require('./../lang/assert'),
	Disposable = require('./../lang/Disposable'),
	is = require('./../lang/is'),
	object = require('./../lang/object'),
	promise = require('./../lang/promise');

module.exports = (() => {
	'use strict';

	/**
	 * An object that wraps asynchronous delays (i.e. timeout and interval).
	 *
	 * @public
	 * @extends {Disposable}
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
		 * @public
		 * @async
		 * @param {Function} actionToSchedule - The action to execute.
		 * @param {number} millisecondDelay - Milliseconds before the action can be started.
		 * @param {string=} actionDescription - A description of the action, used for logging purposes.
		 * @returns {Promise}
		 */
		async schedule(actionToSchedule, millisecondDelay, actionDescription) {
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
							const disposable = this._timeoutBindings[token];

							// 2021/05/18, BRI. Invoking dispose cases the clearTimeout function to run.
							// Running clearTimeout should not be necessary because the timer has elapsed
							// and the callback is being invoked. However, failing to call clearTimeout in
							// a Node.js environment (after version 10) leads to a memory leak. Notice that
							// this function has a reference to the Scheduler instance (via closure). In my
							// view, this is breaking change between versions 10 and 12 of Node.js. I have
							// been unable to locate any documentation regarding this change; however, a changes
							// to did occur (which becomes obvious when inspecting the data structure returned by
							// the setTimeout function).

							if (disposable) {
								disposable.dispose();
							}

							try {
								resolveCallback(actionToSchedule());
							} catch (e) {
								rejectCallback(e);
							}
						};

						token = setTimeout(wrappedAction, millisecondDelay);

						this._timeoutBindings[token] = Disposable.fromAction(() => {
							clearTimeout(token);

							delete this._timeoutBindings[token];
						});
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
		 * @public
		 * @async
		 * @param {Function} actionToBackoff - The action to attempt. If it fails -- because an error is thrown, a promise is rejected, or the function returns a falsey value -- the action will be invoked again.
		 * @param {number=} millisecondDelay - The amount of time to wait to execute the action. Subsequent failures are multiply this value by 2 ^ [number of failures]. So, a 1000 millisecond backoff would schedule attempts using the following delays: 0, 1000, 2000, 4000, 8000, etc. If not specified, the first attempt will execute immediately, then a value of 1000 will be used.
		 * @param {string=} actionDescription - Description of the action to attempt, used for logging purposes.
		 * @param {number=} maximumAttempts - The number of attempts to before giving up.
		 * @param {Function=} failureCallback - If provided, will be invoked if a function is considered to be failing.
		 * @param {Object=} failureValue - If provided, will consider the result to have failed, if this value is returned (a deep equality check is used). If not provided, an undefined value will trigger a retry.
		 * @param {number=} maximumDelay - The maximum delay that can be used for the backoff. If not provided, the delay will continue to double until the maximum number of attempts is reached.
		 * @returns {Promise}
		 */
		backoff(actionToBackoff, millisecondDelay, actionDescription, maximumAttempts, failureCallback, failureValue, maximumDelay) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(actionToBackoff, 'actionToBackoff', Function);
					assert.argumentIsOptional(millisecondDelay, 'millisecondDelay', Number);
					assert.argumentIsOptional(actionDescription, 'actionDescription', String);
					assert.argumentIsOptional(maximumAttempts, 'maximumAttempts', Number);
					assert.argumentIsOptional(failureCallback, 'failureCallback', Function);
					assert.argumentIsOptional(maximumDelay, 'maximumDelay', Number);

					if (this.getIsDisposed()) {
						throw new Error('The Scheduler has been disposed.');
					}

					const processAction = (attempts) => {
						return Promise.resolve()
							.then(() => {
								let delay;

								if (attempts === 0) {
									delay = 0;
								} else {
									delay = (millisecondDelay || 1000) * Math.pow(2, attempts - 1);
									if (maximumDelay && delay > maximumDelay) {
										delay = maximumDelay;
									}
								}

								if (delay === 0) {
									return Promise.resolve()
										.then(() => {
											return actionToBackoff();
										});
								} else {
									return this.schedule(actionToBackoff, delay, `Attempt [ ${attempts} ] for [ ${(actionDescription || 'unnamed action')} ]`);
								}
							}).then((result) => {
								let resultPromise;

								if (!is.undefined(failureValue) && object.equals(result, failureValue)) {
									resultPromise = Promise.reject(`Attempt [ ${attempts} ] for [ ${(actionDescription || 'unnamed action')} ] failed due to invalid result`);
								} else {
									resultPromise = Promise.resolve(result);
								}

								return resultPromise;
							}).catch((e) => {
								if (is.fn(failureCallback)) {
									failureCallback(attempts);
								}

								return Promise.reject(e);
							});
					};

					let attempts = 0;

					const processActionRecursive = () => {
						return processAction(attempts++)
							.catch((e) => {
								if (maximumAttempts > 0 && attempts === maximumAttempts) {
									let message = `Maximum failures reached for ${(actionDescription || 'unnamed action')}`;

									let rejectPromise;

									if (is.object(e)) {
										e.backoff = message;

										rejectPromise = Promise.reject(e);
									} else {
										rejectPromise = Promise.reject(message);
									}

									return rejectPromise;
								} else {
									return processActionRecursive();
								}
							});
					};

					return processActionRecursive();
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

		static async schedule(actionToSchedule, millisecondDelay, actionDescription) {
			const scheduler = new Scheduler();

			let result;

			try {
				result = await scheduler.schedule(actionToSchedule, millisecondDelay, actionDescription);
			} finally {
				scheduler.dispose();
			}

			return result;
		}

		static async backoff(actionToBackoff, millisecondDelay, actionDescription, maximumAttempts, failureCallback, failureValue, maximumDelay) {
			const scheduler = new Scheduler();

			let result;

			try {
				result = await scheduler.backoff(actionToBackoff, millisecondDelay, actionDescription, maximumAttempts, failureCallback, failureValue, maximumDelay);
			} finally {
				scheduler.dispose();
			}

			return result;
		}

		toString() {
			return '[Scheduler]';
		}
	}

	return Scheduler;
})();
