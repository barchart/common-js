var assert = require('./assert');

module.exports = (() => {
	'use strict';

	return {
		timeout(promise, timeout) {
			assert.argumentIsRequired(promise, 'promise', Promise, 'Promise');
			assert.argumentIsRequired(timeout, 'timeout', Number);

			if (!(timeout > 0)) {
				throw new Error('Promise timeout must be greater than zero.');
			}

			return new Promise((resolveCallback, rejectCallback) => {
				let pending = true;

				let token = setTimeout(() => {
					if (pending) {
						pending = false;

						rejectCallback(`Promise timed out after ${timeout} milliseconds`);
					}
				}, timeout);

				promise.then((result) => {
					if (pending) {
						pending = false;
						clearTimeout(token);

						resolveCallback(result);
					}
				}).catch((error) => {
					if (pending) {
						pending = false;
						clearTimeout(token);

						rejectCallback(error);
					}
				});
			});
		},

		map(items, mapper, concurrency) {
			assert.argumentIsArray(items, 'items');
			assert.argumentIsRequired(mapper, 'mapper', Function);
			assert.argumentIsOptional(concurrency, 'concurrency', Number);

			if (items.length === 0) {
				return Promise.resolve([ ]);
			}

			return new Promise((resolveCallback, rejectCallback) => {
				const concurrencyToUse = Math.max(1, concurrency || 0);

				let current = 0;

				let active = 0;
				let complete = 0;

				let results = Array.of(items.length);

				const start = (index) => {
					current = index;
					active = active + 1;

					const item = items[current];

					Promise.resolve()
						.then(() => {
							return mapper(item);
						}).then((result) => {
							results[index] = result;

							active = active - 1;
							complete = complete + 1;

							if (complete === items.length) {
								resolveCallback(results);
							} else if (active < concurrencyToUse && complete < items.length) {
								start(current + 1);
							}
						}).catch((error) => {
							rejectCallback(error);
						});
				};

				for (var i = 0; i < items.length && active < concurrencyToUse && complete < items.length; i++) {
					start(i);
				}
			});
		}
	};
})();