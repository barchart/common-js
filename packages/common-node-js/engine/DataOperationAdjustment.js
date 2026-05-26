const assert = require('@barchart/common-js/lang/assert'),
	Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
	'use strict';

	/**
	 * An enumeration used to adjust the processing priority of
	 * {@link DataOperation} instances (among other operations
	 * which share the same {@link DataOperationStage}).
	 *
	 * @public
	 * @extends {Enum}
	 * @param {String} code
	 * @param {Number} priority
	 */
	class DataOperationAdjustment extends Enum {
		constructor(code, priority) {
			super(code, code);

			assert.argumentIsRequired(priority, 'priority', Number);

			this._priority = priority;
		}

		/**
		 * The relative order in which operations should be processed (lower
		 * means sooner, higher means later).
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get priority() {
			return this._priority;
		}

		/**
		 * Increased priority level — other operations at the same {@link DataOperationStage}
		 * level should be processed later.
		 *
		 * @public
		 * @static
		 * @returns {DataOperationAdjustment}
		 */
		static get PRIORITIZE() {
			return prioritize;
		}

		/**
		 * Normal priority level — operation will not be given any preference
		 * over other operations at the same {@link DataOperationStage} level.
		 *
		 * @public
		 * @static
		 * @returns {DataOperationAdjustment}
		 */
		static get NONE() {
			return none;
		}

		/**
		 * Reduced priority level — other operations at the same {@link DataOperationStage}
		 * level should be processed first.
		 *
		 * @public
		 * @static
		 * @returns {DataOperationAdjustment}
		 */
		static get DEFER() {
			return defer;
		}

		toString() {
			return '[DataOperationAdjustment]';
		}
	}

	const prioritize = new DataOperationAdjustment('PRIORITIZE', -1);
	const none = new DataOperationAdjustment('NONE', 0);
	const defer = new DataOperationAdjustment('DEFER', 1);

	return DataOperationAdjustment;
})();
