import * as assert from './../lang/assert.js';
import * as is from './../lang/is.js';
import * as promise from './../lang/promise.js';

import Disposable from './../lang/Disposable.js';
import Queue from './../collections/Queue.js';
import Scheduler from './Scheduler.js';

/**
 * A work queue that restricts the rate at which items are
 * processed.
 *
 * @public
 * @extends {Disposable}
 */
export default class RateLimiter extends Disposable {
	#windowMaximumCount;
	#windowDurationMilliseconds;
	#scheduler;
	#workQueue;
	#windowStart;
	#windowCounter;

	/**
	 * @param {number} windowMaximumCount - The maximum number of items which can be processed during a timeframe (positive integer).
	 * @param {number} windowDurationMilliseconds - The number of milliseconds in the timeframe (positive integer).
	 */
	constructor(windowMaximumCount, windowDurationMilliseconds) {
		super();

		assert.argumentIsValid(windowMaximumCount, 'windowMaximumCount', x => is.integer(x) && is.positive(x));
		assert.argumentIsValid(windowDurationMilliseconds, 'windowDurationMilliseconds', x => is.integer(x) && is.positive(x));

		this.#windowMaximumCount = windowMaximumCount;
		this.#windowDurationMilliseconds = windowDurationMilliseconds;

		this.#scheduler = new Scheduler();

		this.#workQueue = new Queue();

		this.#windowStart = null;
		this.#windowCounter = 0;
	}

	/**
	 * Adds an item to the work queue and returns a promise that will
	 * resolve after the item completes execution.
	 *
	 * @public
	 * @param {Function} actionToEnqueue - The action to execute.
	 * @returns {Promise}
	 */
	enqueue(actionToEnqueue) {
		return promise.build((resolveCallback, rejectCallback) => {
			assert.argumentIsRequired(actionToEnqueue, 'actionToEnqueue', Function);

			if (this.disposed) {
				throw new Error('Unable to enqueue action, the rate limiter has been disposed.');
			}

			this.#workQueue.enqueue(async () => {
				try {
					const result = await actionToEnqueue();

					resolveCallback(result);
				} catch (error) {
					rejectCallback(error);
				} finally {
					this.#checkStart();
				}
			});

			this.#checkStart();
		});
	}

	/**
	 * @protected
	 * @override
	 */
	_onDispose() {
		this.#scheduler.dispose();

		this.#workQueue = null;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[RateLimiter]';
	}

	#checkStart() {
		if (this.disposed) {
			return;
		}

		if (this.#workQueue.empty()) {
			return;
		}

		if (this.#windowStart === null) {
			const timestamp = new Date();

			this.#windowStart = timestamp.getTime();
			this.#windowCounter = 0;

			const resetWindow = () => {
				this.#windowStart = null;
				this.#windowCounter = 0;

				this.#checkStart();
			};

			this.#scheduler.schedule(resetWindow, this.#windowDurationMilliseconds, 'Rate Limiter Window Reset');
		}

		if (this.#windowCounter < this.#windowMaximumCount) {
			this.#windowCounter = this.#windowCounter + 1;

			const actionToExecute = this.#workQueue.dequeue();

			actionToExecute();
		}
	}
}
