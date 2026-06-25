/**
 * The data access mechanism for a {@link DataOperation}. This is intended
 * to be short-lived and may cache objects not yet written to the underlying
 * data store.
 *
 * @public
 * @interface
 */
export default class DataProvider {
	#options;

	/**
	 * @param {object=} options - The options.
	 */
	constructor(options) {
		this.#options = options || null;
	}

	/**
	 * Return configuration options.
	 *
	 * @public
	 * @returns {object|null}
	 */
	getOptions() {
		return this.#options;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[DataProvider]';
	}
}
