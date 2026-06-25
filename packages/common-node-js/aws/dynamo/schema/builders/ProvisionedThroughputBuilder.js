import * as assert from '@barchart/common-js/lang/assert.js';

import ProvisionedThroughput from './../definitions/ProvisionedThroughput.js';

/**
 * Fluent interface for building a {@link ProvisionedThroughput} instance.
 *
 * @public
 */
export default class ProvisionedThroughputBuilder {
	#provisionedThroughput;

	/**
	 * @param {number=} read - The read.
	 * @param {number=} write - The write.
	 */
	constructor(read, write) {
		assert.argumentIsOptional(read, 'read', Number);
		assert.argumentIsOptional(write, 'write', Number);

		this.#provisionedThroughput = new ProvisionedThroughput(read, write);
	}

	/**
	 * The {@link ProvisionedThroughput}, given all the information provided thus far.
	 *
	 * @public
	 * @returns {ProvisionedThroughput}
	 */
	get provisionedThroughput() {
		return this.#provisionedThroughput;
	}

	/**
	 * Sets the read capacity units and returns the current instance.
	 *
	 * @public
	 * @param {number} value
	 * @returns {ProvisionedThroughputBuilder}
	 */
	withRead(value) {
		assert.argumentIsRequired(value, 'value', Number);

		this.#provisionedThroughput = new ProvisionedThroughput(value, this.#provisionedThroughput.write);

		return this;
	}

	/**
	 * Sets the write capacity units and returns the current instance.
	 *
	 * @public
	 * @param {number} value
	 * @returns {ProvisionedThroughputBuilder}
	 */
	withWrite(value) {
		assert.argumentIsRequired(value, 'value', Number);

		this.#provisionedThroughput = new ProvisionedThroughput(this.#provisionedThroughput.read, value);

		return this;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[ProvisionedThroughputBuilder]';
	}
}
