import * as assert from '@barchart/common-js/lang/assert.js';

import DataOperationAdjustment from './DataOperationAdjustment.js';
import DataOperationStage from './DataOperationStage.js';

/**
 * @typedef {import('./DataOperation.js').default} DataOperation
 */

/**
 * A container for a {@link DataOperation}.
 *
 * @public
 */
export default class DataOperationContainer {
	#adjustment;
	#operation;
	#order;
	#stage;

	/**
	 * @param {DataOperation} operation - The operation.
	 * @param {DataOperationStage=} stage - The stage.
	 * @param {DataOperationAdjustment=} adjustment - The adjustment.
	 * @param {number=} order - The order.
	 */
	constructor(operation, stage, adjustment, order) {
		assert.argumentIsOptional(stage, 'stage', DataOperationStage, 'DataOperationStage');
		assert.argumentIsOptional(adjustment, 'adjustment', DataOperationAdjustment, 'DataOperationAdjustment');
		assert.argumentIsOptional(order, 'order', Number);

		this.#operation = operation;

		this.#stage = stage || null;
		this.#adjustment = adjustment || null;

		this.#order = order || null;
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
	 * The stage (priority) to use when determining the relative ordering
	 * for the operation.
	 *
	 * @public
	 * @returns {DataOperationStage}
	 */
	get stage() {
		return this.#stage;
	}

	/**
	 * Sets the stage.
	 *
	 * @public
	 * @param {*} value
	 */
	set stage(value) {
		assert.argumentIsOptional(value, 'value', DataOperationStage, 'DataOperationStage');

		this.#stage = value;
	}

	/**
	 * The adjustment (among ) to use when determining the relative ordering
	 * for the operation.
	 *
	 * @public
	 * @returns {DataOperationAdjustment}
	 */
	get adjustment() {
		return this.#adjustment;
	}

	/**
	 * Sets the adjustment.
	 *
	 * @public
	 * @param {*} value
	 */
	set adjustment(value) {
		assert.argumentIsOptional(value, 'value', DataOperationAdjustment, 'DataOperationAdjustment');

		this.#adjustment = value;
	}

	/**
	 * The sequence number of the operation (assigned when added to the processing queue).
	 *
	 * @public
	 * @returns {number}
	 */
	get order() {
		return this.#order;
	}

	/**
	 * Sets the order.
	 *
	 * @public
	 * @param {*} value
	 */
	set order(value) {
		assert.argumentIsOptional(value, 'value', Number);

		this.#order = value;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[DataOperationContainer]';
	}
}
