const assert = require('./../lang/assert'),
	Disposable = require('./../lang/Disposable'),
	promise = require('./../lang/promise');

const Queue = require('./../collections/Queue');

module.exports = (() => {
	'use strict';

	/**
	 * A work queue that processes actions in sequence.
	 *
	 * @public
	 * @extends {Disposable}
	 */
	class Serializer extends Disposable {
		constructor() {
			super();

			this._workQueue = new Queue();

			this._enqueued = 0;
			this._processed = 0;

			this._running = false;
		}

		/**
		 * Gets the sequence of the item that was last processed.
		 *
		 * @public
		 * @returns {Number}
		 */
		getCurrent() {
			return this._processed;
		}

		/**
		 * The the total number of items that have been added to the queue.
		 *
		 * @public
		 * @returns {Number}
		 */
		getTotal() {
			return this._enqueued;
		}

		/**
		 * The number of items that are currently pending.
		 *
		 * @public
		 * @returns {Number}
		 */
		getPending() {
			return this._enqueued - this._processed;
		}

		/**
		 * Indicates if a work item is currently being processed.
		 * 
		 * @public
		 * @returns {Boolean}
		 */
		getRunning() {
			return this._running;
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

				this._enqueued = this._enqueued + 1;

				this._getWorkQueue().enqueue(() => {
					return Promise.resolve()
						.then(() => {
							if (this.getIsDisposed()) {
								throw new Error('Unable to process Serializer action, the serializer has been disposed.');
							}

							this._processed = this._processed + 1;

							return actionToEnqueue();
						}).then((result) => {
							resolveCallback(result);
						}).catch((error) => {
							rejectCallback(error);
						});
				});

				checkStart.call(this);
			});
		}

		/**
		 * Allows an inheriting class to override the internal {@link Queue} implementation.
		 * 
		 * @protected
		 * @returns {Queue|*}
		 */
		_getWorkQueue() {
			return this._workQueue;
		}
		
		toString() {
			return '[Serializer]';
		}
	}

	function checkStart() {
		const workQueue = this._getWorkQueue();

		if (workQueue.empty() || this._running) {
			return;
		}

		this._running = true;

		const actionToExecute = workQueue.dequeue();

		actionToExecute()
			.then(() => {
				this._running = false;

				checkStart.call(this);
			});
	}

	return Serializer;
})();