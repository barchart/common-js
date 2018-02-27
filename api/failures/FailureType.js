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
			return requestConstructionFailure;
		}

		/**
		 * A data point is missing.
		 *
		 * @static
		 * @returns {FailureType}
		 */
		static get REQUEST_PARAMETER_MISSING() {
			return requestParameterMissing;
		}

		/**
		 * A data point is malformed.
		 *
		 * @static
		 * @returns {FailureType}
		 */
		static get REQUEST_PARAMETER_MALFORMED() {
			return requestParameterMalformed;
		}

		/**
		 * User identity could not be determined.
		 *
		 * @static
		 * @returns {FailureType}
		 */
		static get REQUEST_IDENTITY_FAILURE() {
			return requestIdentifyFailure;
		}

		/**
		 * User authorization failed.
		 *
		 * @static
		 * @returns {FailureType}
		 */
		static get REQUEST_AUTHORIZATION_FAILURE() {
			return requestAuthorizationFailure;
		}

		/**
		 * The request data cannot be parsed or interpreted.
		 *
		 * @static
		 * @returns {FailureType}
		 */
		static get REQUEST_INPUT_MALFORMED() {
			return requestInputMalformed;
		}

		/**
		 * The request failed for unspecified reasons.
		 *
		 * @static
		 * @returns {FailureType}
		 */
		static get REQUEST_GENERAL_FAILURE() {
			return requestGeneralFailure;
		}

		/**
		 * Returns an HTTP status code that would be suitable for use with the
		 * failure type.
		 *
		 * @param {FailureType} type
		 * @returns {Number}
		 */
		static getHttpStatusCode(type) {
			assert.argumentIsRequired(type, 'type', FailureType, 'FailureType');

			let returnVal;

			if (type === FailureType.REQUEST_IDENTITY_FAILURE) {
				returnVal = 401;
			} else if (type === FailureType.REQUEST_AUTHORIZATION_FAILURE) {
				returnVal = 403;
			} else {
				returnVal = 400;
			}

			return returnVal;
		}

		toString() {
			return `[FailureType (code=${this.code})]`;
		}
	}

	const requestConstructionFailure = new FailureType('REQUEST_CONSTRUCTION_FAILURE', 'An attempt to {L|root.endpoint.description} failed because some required information is missing.');
	const requestParameterMissing = new FailureType('REQUEST_PARAMETER_MISSING', 'The "{L|name}" field is required.');
	const requestParameterMalformed = new FailureType('REQUEST_PARAMETER_MALFORMED', 'The "{L|name}" field cannot be interpreted.');
	const requestIdentifyFailure = new FailureType('REQUEST_IDENTITY_FAILURE', 'An attempt to {L|root.endpoint.description} failed because your identity could not be determined.');
	const requestAuthorizationFailure = new FailureType('REQUEST_AUTHORIZATION_FAILURE', 'An attempt to {L|root.endpoint.description} failed. You are not authorized to perform this action.');
	const requestInputMalformed = new FailureType('REQUEST_INPUT_MALFORMED', 'An attempt to {L|root.endpoint.description} failed, the data structure is invalid.');
	const requestGeneralFailure = new FailureType('REQUEST_GENERAL_FAILURE', 'An attempt to {L|root.endpoint.description} failed for unspecified reason(s).');

	return FailureType;
})();