const is = require('./../../../lang/is');

module.exports = (() => {
	'use strict';

	/**
	 * Encapsulates credential detection logic.
	 *
	 * @public
	 * @param {Function} usernameExtractor
	 * @param {Function=} passwordExtractor
	 */
	class Credentials {
		constructor(usernameExtractor, passwordExtractor) {
			this._usernameExtractor = usernameExtractor;
			this._passwordExtractor = passwordExtractor;
		}

		/**
		 * The password extractor.
		 *
		 * @public
		 * @returns {Function}
		 */
		get usernameExtractor() {
			return this._usernameExtractor;
		}

		/**
		 * The password extractor.
		 *
		 * @public
		 * @returns {Function}
		 */
		get passwordExtractor() {
			return this._passwordExtractor;
		}

		/**
		 * Throws an {@link Error} if the instance is invalid.
		 *
		 * @public
		 */
		validate() {
			if (!is.fn(this.usernameExtractor)) {
				throw new Error('Credentials username extractor must be a function.');
			}

			if (!is.fn(this.passwordExtractor)) {
				throw new Error('Credentials password extractor must be a function.');
			}
		}

		toString() {
			return `[Credentials]`;
		}
	}

	return Credentials;
})();