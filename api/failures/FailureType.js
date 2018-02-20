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
		 * One or more data points is missing.
		 *
		 * @static
		 * @returns {FailureType}
		 */
		static get REQUEST_CONSTRUCTION_FAILURE() {
			return failureTypeRequestConstructionFailure;
		}

		/**
		 * A data point is missing.
		 *
		 * @static
		 * @returns {FailureType}
		 */
		static get REQUEST_PARAMETER_MISSING_FAILURE() {
			return failureTypeRequestParameterMissingFailure;
		}

		/**
		 * User identity could not be determined.
		 *
		 * @static
		 * @returns {FailureType}
		 */
		static get REQUEST_IDENTITY_FAILURE() {
			return failureTypeRequestIdentifyFailure;
		}

		/**
		 * User authorization failed.
		 *
		 * @static
		 * @returns {FailureType}
		 */
		static get REQUEST_AUTHORIZATION_FAILURE() {
			return failureTypeRequestAuthorizationFailure;
		}

		toString() {
			return `[FailureType (code=${this.code})]`;
		}
	}

	const failureTypeRequestConstructionFailure = new FailureType('REQUEST_CONSTRUCTION_FAILURE', '{u|root.endpoint.description} failed, some required information is missing.');
	const failureTypeRequestParameterMissingFailure = new FailureType('REQUEST_PARAMETER_MISSING', 'The {L|name} field is required.');
	const failureTypeRequestIdentifyFailure = new FailureType('REQUEST_IDENTITY_FAILURE', 'Unable to process {L|root.endpoint.description} operation because your identity could not be determined.');
	const failureTypeRequestAuthorizationFailure = new FailureType('REQUEST_AUTHORIZATION_FAILURE', '{u|root.endpoint.description} operation failed due to authentication failure.');

	return FailureType;
})();