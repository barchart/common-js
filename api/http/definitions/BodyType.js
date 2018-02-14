const Enum = require('./../../../lang/Enum');

module.exports = (() => {
	'use strict';

	/**
	 * Defines the mechanism used to select the body of the
	 * request from the request payload.
	 *
	 * @public
	 * @extends {Enum}
	 * @param {String} code
	 * @param {String} description
	 */
	class BodyType extends Enum {
		constructor(code, description) {
			super(code, description);
		}

		/**
		 * Uses no body for the request.
		 *
		 * @static
		 * @returns {BodyType}
		 */
		static get NONE() {
			return bodyTypeNone;
		}
		
		/**
		 * Uses the entire payload as the request body.
		 *
		 * @static
		 * @returns {BodyType}
		 */
		static get ENTIRE() {
			return bodyTypeEntire;
		}

		/**
		 * Uses a single property, selected using a variable name, from the payload
		 * as the request body.
		 *
		 * @static
		 * @returns {BodyType}
		 */
		static get VARIABLE() {
			return bodyTypeVariable;
		}

		toString() {
			return `[BodyType (description=${this.description})]`;
		}
	}

	const bodyTypeNone = new BodyType('NONE', 'none');
	const bodyTypeEntire = new BodyType('ENTIRE', 'entire');
	const bodyTypeVariable = new BodyType('VARIABLE', 'variable');

	return BodyType;
})();