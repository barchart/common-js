const is = require('@barchart/common-js/lang/is');

module.exports = (() => {
	'use strict';

	/**
	 * The throughput of a {@link Table} or {@link Index}.
	 *
	 * @public
	 * @param {Number} read - The read capacity units.
	 * @param {Number} write - The write capacity units.
	 */
	class ProvisionedThroughput {
		constructor(read, write) {
			this._read = read;
			this._write = write;
		}

		/**
		 * Read capacity units.
		 *
		 * @public
		 * @returns {Number}
		 */
		get read() {
			return this._read;
		}

		/**
		 * Write capacity units.
		 *
		 * @public
		 * @returns {Number}
		 */
		get write() {
			return this._write;
		}

		/**
		 * Throws an {@link Error} if the instance is invalid.
		 *
		 * @public
		 */
		validate() {
			if (!is.integer(this._read)) {
				throw new Error('Read capacity must be an integer.');
			}

			if (this._read < 0) {
				throw new Error('Read capacity must be positive');
			}

			if (!is.integer(this._write)) {
				throw new Error('Write capacity must be an integer.');
			}

			if (this._write < 0) {
				throw new Error('Write capacity must be positive');
			}
		}

		/**
		 * Generates an object which is suitable for use by the AWS SDK.
		 *
		 * @public
		 * @returns {Object}
		 */
		toProvisionedThroughputSchema() {
			return {
				ReadCapacityUnits: this._read,
				WriteCapacityUnits: this._write
			};
		}

		/**
		 * Returns true of this provisioned throughput level shares the same
		 * property values as the other provisioned throughput level.
		 *
		 * @public
		 * @param {ProvisionedThroughput} other - The provisioned throughput level to compare.
		 * @returns {Boolean}
		 */
		equals(other) {
			return other === this || (other instanceof ProvisionedThroughput && this._read === other.read && this._write === other.write);
		}

		toString() {
			return '[ProvisionedThroughput]';
		}
	}

	return ProvisionedThroughput;
})();