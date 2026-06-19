
/**
 * @typedef {import('./DataOperation.js').default} DataOperation
 */
/**
 * The result of a {@link DataOperation#process} invocation.
 *
 * @public
 */
export default class DataOperationResult {
	#children;
	#operation;
	#result;

	/**
	 * @param {DataOperation} operation - The operation.
	 * @param {*} result - The operation's result.
	 * @param {Array<DataOperation>} children - Operations spawned during processing of the current operation.
	 */
	constructor(operation, result, children) {
		this.#operation = operation;
		this.#result = result;
		this.#children = children || [ ];
	}

	/**
	 * The operation.
	 *
	 * @public
	 * @returns {DataOperation}
	 */
	get operation() {
		return this.#operation;
	}

	/**
	 * The operation's result.
	 *
	 * @public
	 * @returns {*}
	 */
	get result() {
		return this.#result;
	}

	/**
	 * Operations spawned during processing of the current operation.
	 *
	 * @public
	 * @returns {Array<DataOperation>}
	 */
	get children() {
		return this.#children;
	}

	/**
	 * Returns the initial.
	 *
	 * @public
	 * @static
	 * @returns {*}
	 */
	static getInitial() {
		return new DataOperationResult(null, null, [ ]);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[DataOperationResult]';
	}
}
