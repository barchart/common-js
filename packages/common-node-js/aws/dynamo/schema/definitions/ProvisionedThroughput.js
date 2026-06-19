import * as is from '@barchart/common-js/lang/is.js';

/**
 * The throughput of a {@link Table} or {@link Index}.
 *
 * @public
 */
export default class ProvisionedThroughput {
	#read;
	#write;

	/**
	 * @param {number} read - The read capacity units.
	 * @param {number} write - The write capacity units.
	 */
	constructor(read, write) {
		this.#read = read;
		this.#write = write;
	}

	/**
	 * Read capacity units.
	 *
	 * @public
	 * @returns {number}
	 */
	get read() {
		return this.#read;
	}

	/**
	 * Write capacity units.
	 *
	 * @public
	 * @returns {number}
	 */
	get write() {
		return this.#write;
	}

	/**
	 * Throws an {@link Error} if the instance is invalid.
	 *
	 * @public
	 */
	validate() {
		if (!is.integer(this.#read)) {
			throw new Error('Read capacity must be an integer.');
		}

		if (this.#read < 0) {
			throw new Error('Read capacity must be positive');
		}

		if (!is.integer(this.#write)) {
			throw new Error('Write capacity must be an integer.');
		}

		if (this.#write < 0) {
			throw new Error('Write capacity must be positive');
		}
	}

	/**
	 * Generates an object which is suitable for use by the AWS SDK.
	 *
	 * @public
	 * @returns {object}
	 */
	toProvisionedThroughputSchema() {
		return {
			ReadCapacityUnits: this.#read,
			WriteCapacityUnits: this.#write
		};
	}

	/**
	 * Returns true of this provisioned throughput level shares the same
	 * property values as the other provisioned throughput level.
	 *
	 * @public
	 * @param {ProvisionedThroughput} other - The provisioned throughput level to compare.
	 * @returns {boolean}
	 */
	equals(other) {
		return other === this || (other instanceof ProvisionedThroughput && this.#read === other.read && this.#write === other.write);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[ProvisionedThroughput]';
	}
}
