import Enum from '@barchart/common-js/lang/Enum.js';

/**
 * Defines billing mode for table (or index).
 *
 * @public
 * @extends {Enum}
 */
export default class ProvisioningType extends Enum {
	#key;

	/**
	 * @param {string} code
	 * @param {string} description
	 * @param {string} key
	 */
	constructor(code, description, key) {
		super(code, description);

		this.#key = key;
	}

	/**
	 * The string used to build an AWS-compliant table schema.
	 *
	 * @public
	 * @returns {string}
	 */
	get key() {
		return this.#key;
	}

	/**
	 * PROVISIONED.
	 *
	 * @public
	 * @static
	 * @return {ProvisioningType}
	 */
	static get PROVISIONED() {
		return provisioned;
	}

	/**
	 * PAY PER REQUEST.
	 *
	 * @public
	 * @static
	 * @return {ProvisioningType}
	 */
	static get ON_DEMAND() {
		return onDemand;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[ProvisioningType (code=${this.code})]`;
	}
}

const provisioned = new ProvisioningType('PROVISIONED', 'Provisioned', 'PROVISIONED');
const onDemand = new ProvisioningType('ON_DEMAND', 'Pay per request', 'PAY_PER_REQUEST');
