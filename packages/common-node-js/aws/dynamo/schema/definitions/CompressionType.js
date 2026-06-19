import Enum from '@barchart/common-js/lang/Enum.js';

/**
 * Defines a compression algorithm that used to compress data.
 *
 * @public
 * @extends {Enum}
 */
export default class CompressionType extends Enum {
	/**
	 * @param {string} code
	 */
	constructor(code) {
		super(code, code);
	}

	/**
	 * DEFLATE.
	 *
	 * @static
	 * @returns {CompressionType}
	 */
	static get DEFLATE() {
		return compressionTypeDeflate;
	}

	/**
	 * ZIP.
	 *
	 * @static
	 * @returns {CompressionType}
	 */
	static get ZIP() {
		return compressionTypeZip;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[CompressionType (code=${this.code})]`;
	}
}

const compressionTypeDeflate = new CompressionType('DEFLATE');
const compressionTypeZip = new CompressionType('ZIP');
