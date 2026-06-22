import * as assert from '@barchart/common-js/lang/assert.js';

import DataProvider from './DataProvider.js';
import DataOperationAdjustment from './DataOperationAdjustment.js';
import DataOperationContainer from './DataOperationContainer.js';
import DataOperationResult from './DataOperationResult.js';
import DataOperationStage from './DataOperationStage.js';

/**
 * An operation that runs within the context of a {@link DataSession}.
 *
 * @public
 * @abstract
 */
export default class DataOperation {
	#children;
	#processed;
	#processing;

	constructor() {
		this.#processing = false;
		this.#processed = false;

		this.#children = null;
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
	 * @param {string} session
	 * @param {string|null} name
	 * @returns {Promise}
	 */
	async process(dataProvider, session, name) {
		this._validateDataProvider(dataProvider);

		if (this.#processing || this.#processed) {
			throw new Error('Unable to process DataOperation, the operation is already processing.');
		}

		this.#processing = true;
		this.#children = [ ];

		const result = await this._process(dataProvider, session, name);

		this.#processing = false;
		this.#processed = true;

		const children = this.#children;

		return new DataOperationResult(this, result, children);
	}

	/**
	 * @protected
	 * @async
	 * @ignore
	 * @param {DataProvider} dataProvider
	 * @param {string} session
	 * @param {string|null} name
	 * @returns {Promise<*>}
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
		if (!this.#processing) {
			throw new Error('A new data operation can only be spawned during the processing of the operation.');
		}

		this.#children.push(new DataOperationContainer(operation, priority || operation.stage, adjustment || operation.adjustment));
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
	 * @returns {boolean}
	 */
	equals(other) {
		assert.argumentIsOptional(other, 'other', DataOperation, 'DataOperation');

		return this._equals(other);
	}

	/**
	 * @protected
	 * @param {DataOperation=} other
	 * @returns {boolean}
	 */
	_equals(other) {
		return other === this;
	}

	_validateDataProvider(dataProvider) {
		assert.argumentIsRequired(dataProvider, 'dataProvider', DataProvider, 'DataProvider');
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[DataOperation]';
	}
}
