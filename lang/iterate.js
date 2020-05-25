module.exports = (() => {
	/**
	 * A looping mechanism that allows iteration to continue asynchronously.
	 *
	 * @public
	 * @function
	 * @param {Iterable} iterable
	 * @param {LoopProcessorCallback=} processor
	 * @returns {Promise<void>}
	 */
	function iterate(iterable, processor) {
		return Promise.build((resolveCallback, rejectCallback) => {
			if (!is.iterable(iterable)) {
				rejectCallback('Unable run loop function, the "iterable" argument must have an Iterator.');
				return;
			}

			if (!is.fn(processor)) {
				rejectCallback('Unable run loop function, the "processor" argument must be a function.');
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
	 * A callback used to process a loop item.
	 *
	 * @public
	 * @callback LoopProcessorCallback
	 * @param {*} item
	 * @param {LoopContinueCallback} - Consumer will invoke when ready to continue.
	 */

	/**
	 * A callback which is invoked to indicate a loop should continue processing.
	 *
	 * @public
	 * @callback LoopContinueCallback
	 * @@returns {Boolean=} - If false, loop breaks.
	 */

	return iterate;
})();
