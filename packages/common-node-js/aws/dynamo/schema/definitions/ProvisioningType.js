const Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
	'use strict';

	/**
	 * Defines billing mode for table (or index).
	 *
	 * @public
	 * @extends {Enum}
	 * @param {String} code
	 * @param {String} description
	 * @param {String} key
	 */
	class ProvisioningType extends Enum {
		constructor(code, description, key) {
			super(code, description);

			this._key = key;
		}

		/**
		 * The string used to build an AWS-compliant table schema.
		 *
		 * @public
		 * @returns {string}
		 */
		get key() {
			return this._key;
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

		toString() {
			return `[ProvisioningType (code=${this.code})]`;
		}
	}

	const provisioned = new ProvisioningType('PROVISIONED', 'Provisioned', 'PROVISIONED');
	const onDemand = new ProvisioningType('ON_DEMAND', 'Pay per request', 'PAY_PER_REQUEST');

	return ProvisioningType;
})();
