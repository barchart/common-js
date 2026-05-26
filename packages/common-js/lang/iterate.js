const is = require('./is'),
	promise = require('./promise');

module.exports = (() => {
	/**
	 * A looping mechanism that allows iteration to continue asynchronously.
	 *
	 * @public
	 * @function
	 * @async
	 * @param {Iterable} iterable
	 * @param {LoopProcessorCallback} processor
	 * @returns {Promise<void>}
	 */
	async function iterate(iterable, processor) {
		return promise.build((resolveCallback, rejectCallback) => {
			if (!is.iterable(iterable)) {
				rejectCallback('Unable to iterate, the "iterable" argument must have an iterator.');

				return;
			}

			if (!is.fn(processor)) {
				rejectCallback('Unable to iterate, the "processor" argument must be a function.');

				return;
			}

			const processNext = (i, p, r) => {
				const next = i.next();

				if (next.done) {
					return r();
				}

				const c = (interrupt) => {
					if (interrupt === false) {
						return r();
					}

					processNext(i, p, r);
				};

				p(next.value, c);
			};

			processNext(iterable[Symbol.iterator](), processor, resolveCallback);
		});
	}

	/**
	 * A callback used to process a single item (taken from the iterable object).
	 *
	 * @public
	 * @callback LoopProcessorCallback
	 * @param {*} item - The item to process (taken from the iterable object).
	 * @param {LoopContinueCallback} callback - Consumer will invoke when ready to continue.
	 */

	/**
	 * A callback which is invoked to indicate item processing is complete and loop
	 * should continue processing (with the next item from the iterable object).
	 *
	 * @public
	 * @callback LoopContinueCallback
	 * @returns {*} - If false, loop breaks.
	 */

	return iterate;
})();
