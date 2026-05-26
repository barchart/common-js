const Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
	'use strict';

	/**
	 * Defines an compression algorithm that used to compress data.
	 *
	 * @public
	 * @extends {Enum}
	 * @param {String} code
	 */
	class CompressionType extends Enum {
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

		toString() {
			return `[CompressionType (code=${this.code})]`;
		}
	}

	const compressionTypeDeflate = new CompressionType('DEFLATE');
	const compressionTypeZip = new CompressionType('ZIP');

	return CompressionType;
})();