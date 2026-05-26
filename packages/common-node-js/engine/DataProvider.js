module.exports = (() => {
	'use strict';

	/**
	 * The data access mechanism for a {@link DataOperation}. This is intended
	 * to be short-lived and may cache objects not yet written to the underlying
	 * data store.
	 *
	 * @public
	 * @interface
	 * @param {Object=} options
	 */
	class DataProvider {
		constructor(options) {
			this._options = options || null;
		}

		/**
		 * Return configuration options.
		 *
		 * @public
		 * @return {Object|null}
		 */
		getOptions() {
			return this._options;
		}

		toString() {
			return '[DataProvider]';
		}
	}

	return DataProvider;
})();
