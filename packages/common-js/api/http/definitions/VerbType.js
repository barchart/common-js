import Enum from './../../../lang/Enum.js';

/**
 * An HTTP verb.
 *
 * @public
 * @extends {Enum}
 */
export default class VerbType extends Enum {
	/**
	 * @param {string} description
	 */
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

	/**
	 * PATCH.
	 *
	 * @static
	 * @returns {VerbType}
	 */
	static get PATCH() {
		return verbTypePatch;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[VerbType (description=${this.description})]`;
	}
}

const verbTypeDelete = new VerbType('DELETE');
const verbTypeGet = new VerbType('GET');
const verbTypePost = new VerbType('POST');
const verbTypePut = new VerbType('PUT');
const verbTypePatch = new VerbType('PATCH');
