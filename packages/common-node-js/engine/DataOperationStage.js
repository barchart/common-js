const assert = require('@barchart/common-js/lang/assert'),
	Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
	'use strict';

	/**
	 * An enumeration used to describe the processing priority of
	 * {@link DataOperation} instances.
	 *
	 * @public
	 * @extends {Enum}
	 * @param {String} code
	 * @param {Number} priority
	 */
	class DataOperationStage extends Enum {
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
		 * Highest priority. An operation with this priority level will be added
		 * to the beginning of the queue.
		 *
		 * @public
		 * @static
		 * @returns {DataOperationStage}
		 */
		static get INTERRUPT() {
			return interrupt;
		}

		/**
		 * Normal priority level — occurring before any persistence level operations.
		 *
		 * @public
		 * @static
		 * @returns {DataOperationStage}
		 */
		static get PROCESS() {
			return process;
		}

		/**
		 * Normal priority level — occurring after any {@link DataOperationStage.PROCESS} operations.
		 *
		 * @public
		 * @static
		 * @returns {DataOperationStage}
		 */
		static get FINALIZE() {
			return finalize;
		}

		/**
		 * Persistence priority level — occurring after all normal priority operations.
		 *
		 * @public
		 * @static
		 * @returns {DataOperationStage}
		 */
		static get SAVE() {
			return save;
		}

		/**
		 * Persistence priority level — occurring after any {@link DataOperationStage.SAVE} operations.
		 *
		 * @public
		 * @static
		 * @returns {DataOperationStage}
		 */
		static get UPDATE() {
			return update;
		}

		/**
		 * Persistence priority level — occurring after any {@link DataOperationStage.UPDATE} operations.
		 *
		 * @public
		 * @static
		 * @returns {DataOperationStage}
		 */
		static get DELETE() {
			return purge;
		}

		/**
		 * Low priority. Occurs after all persistence priority operations but before any
		 * {@link DataOperationStage.RESULTS} operations.
		 *
		 * @public
		 * @static
		 * @returns {DataOperationStage}
		 */
		static get POSTPONE() {
			return postpone;
		}

		/**
		 * Low priority. Occurs after all other types of operations.
		 *
		 * @public
		 * @static
		 * @returns {DataOperationStage}
		 */
		static get RESULTS() {
			return results;
		}

		toString() {
			return '[DataOperationStage]';
		}
	}

	const interrupt = new DataOperationStage('INTERRUPT', -1);
	const process = new DataOperationStage('PROCESS', 0);
	const finalize = new DataOperationStage('FINALIZE', 1);
	const save = new DataOperationStage('SAVE', 2);
	const update = new DataOperationStage('UPDATE', 3);
	const purge = new DataOperationStage('DELETE', 4);
	const postpone = new DataOperationStage('TERMINAL', 5);
	const results = new DataOperationStage('RESULTS', 6);

	return DataOperationStage;
})();
