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
	 */
	class Serializer extends Disposable {
		constructor() {
			super();

			this._workQueue = new Queue();

			this._counter = 0;
			this._current = 0;

			this._running = false;
		}

		getCurrent() {
			return this._current;
		}

		getTotal() {
			return this._counter;
		}

		getPending() {
			return this._counter - this._current;
		}

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

				this._counter = this._counter + 1;

				this._workQueue.enqueue(() => {
					return Promise.resolve()
						.then(() => {
							if (this.getIsDisposed()) {
								throw new Error('Unable to process Serializer action, the serializer has been disposed.');
							}

							this._current = this._current + 1;

							return actionToEnqueue();
						}).then((result) => {
							resolveCallback(result);
						}).catch((error) => {
							rejectCallback(error);
						}).then(() => {
							this._running = false;

							checkStart.call(this);
						});
				});

				checkStart.call(this);
			});
		}

		_onDispose() {
			while (!this._stack.empty()) {
				this._stack.pop().dispose();
			}
		}

		toString() {
			return '[Serializer]';
		}
	}

	function checkStart() {
		if (this._workQueue.empty() || this._running) {
			return;
		}

		this._running = true;

		const actionToExecute = this._workQueue.dequeue();

		actionToExecute();
	}

	return Serializer;
})();