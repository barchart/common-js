import * as assert from '@barchart/common-js/lang/assert.js';

import Enum from '@barchart/common-js/lang/Enum.js';

/**
 * An enumeration used to adjust the processing priority of
 * {@link DataOperation} instances (among other operations
 * which share the same {@link DataOperationStage}).
 *
 * @public
 * @extends {Enum}
 */
export default class DataOperationAdjustment extends Enum {
	#priority;

	/**
	 * @param {string} code - The code.
	 * @param {number} priority - The priority.
	 */
	constructor(code, priority) {
		super(code, code);

		assert.argumentIsRequired(priority, 'priority', Number);

		this.#priority = priority;
	}

	/**
	 * The relative order in which operations should be processed (lower
	 * means sooner, higher means later).
	 *
	 * @public
	 * @returns {number}
	 */
	get priority() {
		return this.#priority;
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

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[DataOperationAdjustment]';
	}
}

const prioritize = new DataOperationAdjustment('PRIORITIZE', -1);
const none = new DataOperationAdjustment('NONE', 0);
const defer = new DataOperationAdjustment('DEFER', 1);
