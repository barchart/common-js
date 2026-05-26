module.exports = (() => {
	'use strict';

	class DataProviderFactory {
		constructor() {
			this._started = false;
		}

		start() {
			if (this._started) {
				throw new Error(this.toString() + ' has already been started.');
			}

			this._started = true;

			return Promise.resolve()
				.then(() => {
					this._start();
				}).then(() => {
					return this;
				});
		}

		_start() {
			return true;
		}

		build(configuration) {
			if (!this._started) {
				throw new Error('Unable to build data provider, the data provider factory has not been started.');
			}

			return Promise.resolve()
				.then(() => {
					return this._build(configuration);
				});
		}

		_build(configuration) {
			return null;
		}

		toString() {
			return '[DataProviderFactory]';
		}
	}

	return DataProviderFactory;
})();