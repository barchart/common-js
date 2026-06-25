import Enum from '@barchart/common-js/lang/Enum.js';

/**
 * An enumeration for HTTP verbs.
 *
 * @public
 * @extends {Enum}
 */
export default class Verb extends Enum {
	/**
	 * @param {string} code - The code.
	 */
	constructor(code) {
		super(code, code);
	}

	/**
	 * The http verb name, in caps.
	 *
	 * @public
	 * @returns {string}
	 */
	getCode() {
		return this.code;
	}

	/**
	 * HTTP DELETE verb.
	 *
	 * @public
	 * @static
	 * @returns {Verb}
	 */
	static get DELETE() {
		return verbDelete;
	}

	/**
	 * HTTP GET verb.
	 *
	 * @public
	 * @static
	 * @returns {Verb}
	 */
	static get GET() {
		return verbGet;
	}

	/**
	 * HTTP OPTIONS verb.
	 *
	 * @public
	 * @static
	 * @returns {Verb}
	 */
	static get OPTIONS() {
		return verbOptions;
	}

	/**
	 * HTTP POST verb.
	 *
	 * @public
	 * @static
	 * @returns {Verb}
	 */
	static get POST() {
		return verbPost;
	}

	/**
	 * HTTP PUT verb.
	 *
	 * @public
	 * @static
	 * @returns {Verb}
	 */
	static get PUT() {
		return verbPut;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Verb (code=' + this.code + ')]';
	}
}

const verbDelete = new Verb('DELETE');
const verbGet = new Verb('GET');
const verbOptions = new Verb('OPTIONS');
const verbPost = new Verb('POST');
const verbPut = new Verb('PUT');
