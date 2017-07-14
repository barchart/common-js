const assert = require('./../lang/assert'),
	promise = require('./../lang/promise');

const Queue = require('./../collections/Queue');

module.exports = (() => {
	'use strict';

	/**
	 * Processes actions in sequence.
	 *
	 * @public
	 */
	class Serializer {
		constructor() {
			this._workQueue = new Queue();

			this._running = false;
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

				this._workQueue.enqueue(() => {
					return Promise.resolve()
						.then(() => {
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