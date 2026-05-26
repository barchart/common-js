const assert = require('@barchart/common-js/lang/assert');

const DataProvider = require('./DataProvider'),
	DataOperationAdjustment = require('./DataOperationAdjustment'),
	DataOperationContainer = require('./DataOperationContainer'),
	DataOperationResult = require('./DataOperationResult'),
	DataOperationStage = require('./DataOperationStage');

module.exports = (() => {
	'use strict';
	
	/**
	 * An operation that runs within the context of a {@link DataSession}.
	 *
	 * @public
	 * @abstract
	 */
	class DataOperation {
		constructor() {
			this._processing = false;
			this._processed = false;

			this._children = null;
		}

		/**
		 * Priority of the operation.
		 *
		 * @public
		 * @returns {DataOperationStage}
		 */
		get stage() {
			return DataOperationStage.PROCESS;
		}

		/**
		 * Priority of the operation (among other operations sharing the
		 * same {@link DataOperationStage}).
		 *
		 * @public
		 * @returns {DataOperationAdjustment}
		 */
		get adjustment() {
			return DataOperationAdjustment.NONE;
		}

		/**
		 * Processes the current instance and returns an array of additional
		 * {@link DataOperation} instances arising from the execution of the
		 * current instance.
		 *
		 * @public
		 * @async
		 * @param {DataProvider} dataProvider
		 * @param {String} session
		 * @param {String|null} name
		 * @returns {Promise}
		 */
		async process(dataProvider, session, name) {
			return Promise.resolve()
				.then(() => {
					this._validateDataProvider(dataProvider);

					if (this._processing || this._processed) {
						throw new Error('Unable to process DataOperation, the operation is already processing.');
					}

					this._processing = true;
					this._children = [ ];

					return Promise.resolve()
						.then(() => {
							return this._process(dataProvider, session, name);
						}).then((result) => {
							this._processing = false;
							this._processed = true;

							const children = this._children;

							return new DataOperationResult(this, result, children);
						});
				});
		}

		/**
		 * @protected
		 * @async
		 * @ignore
		 * @param {DataProvider} dataProvider
		 * @param {String} session
		 * @param {String|null} name
		 * @returns {*}
		 */
		async _process(dataProvider, session, name) {
			return;
		}

		/**
		 * Allows an operation to schedule another operation (only to be used
		 * during processing of the current operation).
		 *
		 * @protected
		 * @param {DataOperation} operation
		 * @param {DataOperationStage=} priority
		 * @param {DataOperationAdjustment=} adjustment
		 */
		_spawn(operation, priority, adjustment) {
			if (!this._processing) {
				throw new Error('A new data operation can only be spawned during the processing of the operation.');
			}

			this._children.push(new DataOperationContainer(operation, priority || operation.stage, adjustment || operation.adjustment));
		}

		/**
		 * Transforms the result of the current operation, given the results of any other
		 * operations that were spawned during the current operation's processing.
		 *
		 * @public
		 * @param {DataOperationResult} currentResult
		 * @param {Array<DataOperationResult>} spawnResults
		 * @returns {DataOperationResult}
		 */
		transformResult(currentResult, spawnResults) {
			return new DataOperationResult(currentResult.operation, this._transformResult(currentResult.result, spawnResults.map(spawnResult => spawnResult ? spawnResult.result : null)), currentResult.children);
		}

		/**
		 * @protected
		 * @param {*} currentResult
		 * @param {Array<*>} spawnResults
		 * @returns {*}
		 */
		_transformResult(currentResult, spawnResults) {
			return currentResult;
		}

		/**
		 * Indicates if the operation is "equal" to another {@link DataOperation}.
		 *
		 * @public
		 * @param {DataOperation=} other
		 * @returns {Boolean}
		 */
		equals(other) {
			assert.argumentIsOptional(other, 'other', DataOperation, 'DataOperation');

			return this._equals(other);
		}

		/**
		 * @protected
		 * @param {DataOperation=} other
		 * @returns {Boolean}
		 */
		_equals(other) {
			return other === this;
		}

		_validateDataProvider(dataProvider) {
			assert.argumentIsRequired(dataProvider, 'dataProvider', DataProvider, 'DataProvider');
		}

		toString() {
			return '[DataOperation]';
		}
	}

	return DataOperation;
})();
