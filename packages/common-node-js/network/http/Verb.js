const Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
	'use strict';

	/**
	 * An enumeration for HTTP verbs.
	 *
	 * @public
	 * @extends {Enum}
	 */
	class Verb extends Enum {
		constructor(code) {
			super(code, code);
		}

		/**
		 * The http verb name, in caps.
		 *
		 * @public
		 * @returns {String}
		 */
		getCode() {
			return this.code;
		}

		/**
		 * HTTP DELETE verb.
		 *
		 * @public
		 * @returns {Verb}
		 */
		static get DELETE() {
			return verbDelete;
		}

		/**
		 * HTTP GET verb.
		 *
		 * @public
		 * @returns {Verb}
		 */
		static get GET() {
			return verbGet;
		}

		/**
		 * HTTP OPTIONS verb.
		 *
		 * @public
		 * @returns {Verb}
		 */
		static get OPTIONS() {
			return verbOptions;
		}

		/**
		 * HTTP POST verb.
		 *
		 * @public
		 * @returns {Verb}
		 */
		static get POST() {
			return verbPost;
		}

		/**
		 * HTTP PUT verb.
		 *
		 * @public
		 * @returns {Verb}
		 */
		static get PUT() {
			return verbPut;
		}

		toString() {
			return '[Verb (code=' + this.code + ')]';
		}
	}

	const verbDelete = new Verb('DELETE');
	const verbGet = new Verb('GET');
	const verbOptions = new Verb('OPTIONS');
	const verbPost = new Verb('POST');
	const verbPut = new Verb('PUT');

	return Verb;
})();