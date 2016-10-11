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

			const c = Math.max(0, concurrency || 0);

			let mapPromise;

			if (c === 0 || items.length === 0) {
				mapPromise = Promise.all(items.map((item) => Promise.resolve(mapper(item))));
			} else {
				let total = items.length;
				let active = 0;
				let complete = 0;
				let failure = false;

				const results = Array.of(total);

				const executors = items.map((item, index) => {
					return () => {
						return Promise.resolve()
							.then(() => {
								return mapper(item);
							}).then((result) => {
								results[index] = result;
							});
					};
				});

				mapPromise = new Promise((resolveCallback, rejectCallback) => {
					const execute = () => {
						if (!(executors.length > 0 && c > active && !failure)) {
							return;
						}

						active = active + 1;

						const executor = executors.shift();

						executor()
							.then(() => {
								if (failure) {
									return;
								}

								active = active - 1;
								complete = complete + 1;

								if (complete < total) {
									execute();
								} else {
									resolveCallback(results);
								}
							}).catch((error) => {
								failure = false;

								rejectCallback(error);
							});

						execute();
					};

					execute();
				});
			}

			return mapPromise;
		},

		pipeline(executors, input) {
			assert.argumentIsArray(executors, 'executors', Function);

			return executors.reduce((previous, executor) => previous.then((result) => executor(result)), Promise.resolve(input));
		}
	};
})();