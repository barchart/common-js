const Enum = require('./../../../lang/Enum');

module.exports = (() => {
	'use strict';

	/**
	 * An HTTP verb.
	 *
	 * @public
	 * @extends {Enum}
	 * @param {String} description
	 */
	class VerbType extends Enum {
		constructor(description) {
			super(description, description);
		}

		/**
		 * DELETE.
		 *
		 * @static
		 * @returns {VerbType}
		 */
		static get DELETE() {
			return verbTypeDelete;
		}

		/**
		 * GET.
		 *
		 * @static
		 * @returns {VerbType}
		 */
		static get GET() {
			return verbTypeGet;
		}

		/**
		 * POST.
		 *
		 * @static
		 * @returns {VerbType}
		 */
		static get POST() {
			return verbTypePost;
		}

		/**
		 * PUT.
		 *
		 * @static
		 * @returns {VerbType}
		 */
		static get PUT() {
			return verbTypePut;
		}

		toString() {
			return `[VerbType (description=${this.description})]`;
		}
	}

	const verbTypeDelete = new VerbType('DELETE');
	const verbTypeGet = new VerbType('GET');
	const verbTypePost = new VerbType('POST');
	const verbTypePut = new VerbType('PUT');

	return VerbType;
})();