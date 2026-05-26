module.exports = (() => {
	'use strict';

	/**
	 * The result of a {@link DataOperation#process} invocation.
	 *
	 * @public
	 * @param {DataOperation} operation - The operation.
	 * @param {*} result - The operation's result.
	 * @param {Array<DataOperation>} children - Operations spawned during processing of the current operation.
	 */
	class DataOperationResult {
		constructor(operation, result, children) {
			this._operation = operation;
			this._result = result;
			this._children = children || [ ];
		}

		/**
		 * The operation.
		 *
		 * @public
		 * @returns {DataOperation}
		 */
		get operation() {
			return this._operation;
		}

		/**
		 * The operation's result.
		 *
		 * @public
		 * @returns {*}
		 */
		get result() {
			return this._result;
		}

		/**
		 * Operations spawned during processing of the current operation.
		 *
		 * @public
		 * @returns {Array<DataOperation>}
		 */
		get children() {
			return this._children;
		}

		static getInitial() {
			return new DataOperationResult(null, null, [ ]);
		}

		toString() {
			return '[DataOperationResult]';
		}
	}

	return DataOperationResult;
})();
