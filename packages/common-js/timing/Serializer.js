import * as assert from './../lang/assert.js';
import * as promise from './../lang/promise.js';

import Disposable from './../lang/Disposable.js';
import Queue from './../collections/Queue.js';

/**
 * A work queue that processes actions in sequence.
 *
 * @public
 * @extends {Disposable}
 */
export default class Serializer extends Disposable {
	#workQueue;
	#enqueued;
	#processed;
	#running;

	constructor() {
		super();

		this.#workQueue = new Queue();

		this.#enqueued = 0;
		this.#processed = 0;

		this.#running = false;
	}

	/**
	 * Gets the sequence of the item that was last processed.
	 *
	 * @public
	 * @returns {number}
	 */
	getCurrent() {
		return this.#processed;
	}

	/**
	 * The total number of items that have been added to the queue.
	 *
	 * @public
	 * @returns {number}
	 */
	getTotal() {
		return this.#enqueued;
	}

	/**
	 * The number of items that are currently pending.
	 *
	 * @public
	 * @returns {number}
	 */
	getPending() {
		return this.#enqueued - this.#processed;
	}

	/**
	 * Indicates if a work item is currently being processed.
	 * 
	 * @public
	 * @returns {boolean}
	 */
	getRunning() {
		return this.#running;
	}

	/**
	 * Adds a new action to the processing queue. If the action
	 * is asynchronous, the action should return a promise.
	 *
	 * @public
	 * @param {Function} actionToEnqueue
	 * @returns {Promise} - A promise which resolves once the action has been processed.
	 */
	enqueue(actionToEnqueue) {
		return promise.build((resolveCallback, rejectCallback) => {
			assert.argumentIsRequired(actionToEnqueue, 'actionToEnqueue', Function);

			if (this.getIsDisposed()) {
				throw new Error('Unable to add action to the Serializer, it has been disposed.');
			}

			this.#enqueued = this.#enqueued + 1;

			this._getWorkQueue().enqueue(() => {
				return Promise.resolve()
					.then(() => {
						if (this.getIsDisposed()) {
							throw new Error('Unable to process Serializer action, the serializer has been disposed.');
						}

						this.#processed = this.#processed + 1;

						return actionToEnqueue();
					}).then((result) => {
						resolveCallback(result);
					}).catch((error) => {
						rejectCallback(error);
					});
			});

			this.#checkStart();
		});
	}

	/**
	 * Allows an inheriting class to override the internal {@link Queue} implementation.
	 * 
	 * @protected
	 * @returns {Queue|*}
	 */
	_getWorkQueue() {
		return this.#workQueue;
	}

	#checkStart() {
		const workQueue = this._getWorkQueue();

		if (workQueue.empty() || this.#running) {
			return;
		}

		this.#running = true;

		const actionToExecute = workQueue.dequeue();

		actionToExecute()
			.then(() => {
				this.#running = false;

				this.#checkStart();
			});
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Serializer]';
	}
}
