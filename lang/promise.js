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
		}
	};
})();