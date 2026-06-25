import * as array from '@barchart/common-js/lang/array.js';
import * as is from '@barchart/common-js/lang/is.js';

import IndexType from './IndexType.js';
import Key from './Key.js';
import KeyType from './KeyType.js';
import Projection from './Projection.js';
import ProvisioningType from './ProvisioningType.js';

/**
 * @typedef {import('./ProvisionedThroughput.js').default} ProvisionedThroughput
 */

/**
 * The definition for a DynamoDB index.
 *
 * @public
 */
export default class Index {
	#keys;
	#name;
	#projection;
	#provisionedThroughput;
	#type;

	/**
	 * @param {string} name - The name.
	 * @param {IndexType} type - The type.
	 * @param {Array<Key>} keys - The keys.
	 * @param {Projection} projection - The projection.
	 * @param {ProvisionedThroughput} provisionedThroughput - The provisioned throughput.
	 */
	constructor(name, type, keys, projection, provisionedThroughput) {
		this.#name = name;
		this.#type = type || null;

		this.#keys = keys || [ ];

		this.#projection = projection || null;
		this.#provisionedThroughput = provisionedThroughput || null;
	}

	/**
	 * Name of the index.
	 *
	 * @public
	 * @returns {string}
	 */
	get name() {
		return this.#name;
	}

	/**
	 * Type of the index.
	 *
	 * @public
	 * @returns {IndexType}
	 */
	get type() {
		return this.#type;
	}

	/**
	 * The index's keys.
	 *
	 * @public
	 * @returns {Array<Key>}
	 */
	get keys() {
		return [...this.#keys];
	}

	/**
	 * The index's {@link Projection}.
	 *
	 * @public
	 * @returns {Projection}
	 */
	get projection() {
		return this.#projection;
	}

	/**
	 * The provisioning (payment) method for the table.
	 *
	 * @public
	 * @returns {ProvisioningType}
	 */
	get provisioningType() {
		if (this.#provisionedThroughput === null) {
			return ProvisioningType.ON_DEMAND;
		} else {
			return ProvisioningType.PROVISIONED;
		}
	}


	/**
	 * The index's {@link ProvisionedThroughput}, if applicable to the {@link IndexType}.
	 *
	 * @public
	 * @returns {ProvisionedThroughput|null}
	 */
	get provisionedThroughput() {
		return this.#provisionedThroughput;
	}

	/**
	 * Throws an {@link Error} if the instance is invalid.
	 *
	 * @public
	 */
	validate() {
		if (!is.string(this.#name) || this.#name.length < 1) {
			throw new Error('Index name is invalid.');
		}

		if (!(this.#type instanceof IndexType)) {
			throw new Error('Index type is invalid.');
		}

		if (!is.array(this.#keys)) {
			throw new Error('Index must have an array of keys.');
		}

		if (!this.#keys.every(k => k instanceof Key)) {
			throw new Error('Index key array can only contain Key instances.');
		}

		if (this.#keys.filter(k => k.keyType === KeyType.HASH).length !== 1) {
			throw new Error('Index must have one hash key.');
		}

		if (this.#keys.filter(k => k.keyType === KeyType.RANGE).length > 1) {
			throw new Error('Table must not have more than one range key.');
		}

		if (!array.unique(this.#keys.map(k => k.attribute.name))) {
			throw new Error('Index key names must be unique (only one key with a given name).');
		}

		if (!(this.#projection instanceof Projection)) {
			throw new Error('Index must have a projection definition.');
		}

		this.#projection.validate();

		if (this.#type.separateProvisioning) {
			if (this.#provisionedThroughput) {
				this.#provisionedThroughput.validate();
			}
		} else if (this.#provisionedThroughput !== null) {
			throw new Error('Index type does not require separate throughput provisioning');
		}
	}

	/**
	 * Generates an object which is suitable for use by the AWS SDK.
	 *
	 * @public
	 * @returns {object}
	 */
	toIndexSchema() {
		this.validate();

		const schema = {
			IndexName: this.#name
		};

		schema.KeySchema = this.#keys.map(k => k.toKeySchema());
		schema.Projection = this.#projection.toProjectionSchema();

		if (this.type.separateProvisioning && this.#provisionedThroughput) {
			if (this.provisioningType === ProvisioningType.PROVISIONED) {
				schema.BillingMode = ProvisioningType.PROVISIONED.key;
				schema.ProvisionedThroughput = this.#provisionedThroughput.toProvisionedThroughputSchema();
			} else {
				schema.BillingMode = ProvisioningType.ON_DEMAND.key;
			}
		}

		return schema;
	}

	/**
	 * Returns true of this index shares the same property values as the other index.
	 *
	 * @public
	 * @param {Index} other - The index to compare.
	 * @param {boolean} relaxed - If true, provisioned throughput is not compared.
	 * @returns {boolean}
	 */
	equals(other, relaxed) {
		if (other === this) {
			return true;
		}

		let returnVal = other instanceof Index;

		if (returnVal) {
			returnVal = returnVal = this.#name === other.name;
			returnVal = returnVal = this.#type === other.type;

			returnVal = returnVal && this.#keys.length === other.keys.length;
			returnVal = returnVal && this.#keys.every(k => other.keys.some(ok => ok.equals(k, relaxed)));

			returnVal = returnVal && this.#projection.equals(other.projection, relaxed);

			if (!(is.boolean(relaxed) && relaxed) && this.type.separateProvisioning) {
				if (this.#provisionedThroughput && other.provisionedThroughput) {
					returnVal = returnVal && this.#provisionedThroughput.equals(other.provisionedThroughput);
				} else {
					returnVal = returnVal && this.#provisionedThroughput === other.provisionedThroughput;
				}
			}
		}

		return returnVal;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[Index (name=${this.#name})]`;
	}
}
