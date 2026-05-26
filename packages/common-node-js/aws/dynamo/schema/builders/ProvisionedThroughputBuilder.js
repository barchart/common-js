const assert = require('@barchart/common-js/lang/assert');

const ProvisionedThroughput = require('./../definitions/ProvisionedThroughput');

module.exports = (() => {
	'use strict';

	/**
	 * Fluent interface for building a {@link ProvisionedThroughput} instance.
	 *
	 * @public
	 * @param {Number=} read
	 * @param {Number=} write
	 */
	class ProvisionedThroughputBuilder {
		constructor(read, write) {
			assert.argumentIsOptional(read, 'read', Number);
			assert.argumentIsOptional(write, 'write', Number);

			this._provisionedThroughput = new ProvisionedThroughput(read, write);
		}

		/**
		 * The {@link ProvisionedThroughput}, given all the information provided thus far.
		 *
		 * @public
		 * @returns {ProvisionedThroughput}
		 */
		get provisionedThroughput() {
			return this._provisionedThroughput;
		}

		/**
		 * Sets the read capacity units and returns the current instance.
		 *
		 * @public
		 * @param {Number} value
		 * @returns {ProvisionedThroughputBuilder}
		 */
		withRead(value) {
			assert.argumentIsRequired(value, 'value', Number);

			this._provisionedThroughput = new ProvisionedThroughput(value, this._provisionedThroughput.write);

			return this;
		}

		/**
		 * Sets the write capacity units and returns the current instance.
		 *
		 * @public
		 * @param {Number} value
		 * @returns {ProvisionedThroughputBuilder}
		 */
		withWrite(value) {
			assert.argumentIsRequired(value, 'value', Number);

			this._provisionedThroughput = new ProvisionedThroughput(this._provisionedThroughput.read, value);

			return this;
		}

		toString() {
			return '[ProvisionedThroughputBuilder]';
		}
	}

	return ProvisionedThroughputBuilder;
})();