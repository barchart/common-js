const assert = require('@barchart/common-js/lang/assert');

const DataOperationAdjustment = require('./DataOperationAdjustment'),
	DataOperationStage = require('./DataOperationStage');

module.exports = (() => {
	'use strict';

	/**
	 * A container for a {@link DataOperation}.
	 *
	 * @public
	 * @param {DataOperation} operation
	 * @param {DataOperationStage=} stage
	 * @param {DataOperationAdjustment=} adjustment
	 * @param {Number=} order
	 */
	class DataOperationContainer {
		constructor(operation, stage, adjustment, order) {
			assert.argumentIsOptional(stage, 'stage', DataOperationStage, 'DataOperationStage');
			assert.argumentIsOptional(adjustment, 'adjustment', DataOperationAdjustment, 'DataOperationAdjustment');
			assert.argumentIsOptional(order, 'order', Number);

			this._operation = operation;

			this._stage = stage || null;
			this._adjustment = adjustment || null;

			this._order = order || null;
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
		 * The stage (priority) to use when determining the relative ordering
		 * for the operation.
		 *
		 * @public
		 * @returns {DataOperationStage}
		 */
		get stage() {
			return this._stage;
		}

		set stage(value) {
			assert.argumentIsOptional(value, 'value', DataOperationStage, 'DataOperationStage');

			this._stage = value;
		}

		/**
		 * The adjustment (among ) to use when determining the relative ordering
		 * for the operation.
		 *
		 * @public
		 * @returns {DataOperationStage}
		 */
		get adjustment() {
			return this._adjustment;
		}

		set adjustment(value) {
			assert.argumentIsOptional(value, 'value', DataOperationAdjustment, 'DataOperationAdjustment');

			this._adjustment = value;
		}

		/**
		 * The sequence number of the operation (assigned when added to the processing queue).
		 *
		 * @public
		 * @returns {Number}
		 */
		get order() {
			return this._order;
		}

		set order(value) {
			assert.argumentIsOptional(value, 'value', Number);

			this._order = value;
		}

		toString() {
			return '[DataOperationContainer]';
		}
	}

	return DataOperationContainer;
})();
