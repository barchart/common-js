const assert = require('./../../lang/assert'),
	Enum = require('./../../lang/Enum');

module.exports = (() => {
	'use strict';

	/**
	 * An enumeration that describes potential reasons for API failure.
	 *
	 * @public
	 * @extends {Enum}
	 * @param {String} code - The enumeration code (and description)
	 * @param {String} template - The template string for formatting human-readable messages.
	 */
	class FailureType extends Enum {
		constructor(code, template) {
			super(code, code);

			assert.argumentIsRequired(template, 'template', String);

			this._template = template;
		}

		/**
		 * The template string for formatting human-readable messages.
		 *
		 * @public
		 * @returns {String}
		 */
		get template() {
			return this._template;
		}

		/**
		 * Unable to initiate request due to missing data.
		 *
		 * @static
		 * @returns {FailureType}
		 */
		static get REQUEST_CONSTRUCTION_FAILURE() {
			return gatewayFailureRequestConstructionFailure;
		}

		/**
		 * Unable to initiate request because user identity could not be determined.
		 *
		 * @static
		 * @returns {FailureType}
		 */
		static get REQUEST_IDENTITY_FAILURE() {
			return gatewayFailureRequestIdentifyFailure;
		}

		/**
		 * Request initiated; however, user authorization failed.
		 *
		 * @static
		 * @returns {FailureType}
		 */
		static get REQUEST_AUTHORIZATION_FAILURE() {
			return gatewayFailureRequestAuthorizationFailure;
		}

		toString() {
			return `[FailureType (code=${this.code})]`;
		}
	}

	const gatewayFailureRequestConstructionFailure = new FailureType('REQUEST_CONSTRUCTION_FAILURE', '{U|root.description} operation cannot be executed, some required information is missing.');
	const gatewayFailureRequestIdentifyFailure = new FailureType('REQUEST_IDENTITY_FAILURE', 'Unable to process {U|root.description} operation because your identify could not be determined.');
	const gatewayFailureRequestAuthorizationFailure = new FailureType('REQUEST_AUTHORIZATION_FAILURE', '{U|root.description} operation failed due to authentication failure.');

	return FailureType;
})();