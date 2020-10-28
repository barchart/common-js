const assert = require('./../../lang/assert'),
	attributes = require('./../../lang/attributes');

const FailureType = require('./FailureType');

module.exports = (() => {
	'use strict';

	/**
	 * One of the reason(s) for API failure, including any specific data that
	 * allows a human-readable message to be generated.
	 *
	 * @public
	 * @param {FailureType} type
	 * @param {Object=} data
	 */
	class FailureReasonItem {
		constructor(type, data) {
			assert.argumentIsRequired(type, 'type', FailureType, 'FailureType');

			this._type = type;
			this._data = data || null;
		}

		/**
		 * The {@link FailureType} of the item.
		 *
		 * @public
		 * @returns {FailureType}
		 */
		get type() {
			return this._type;
		}

		/**
		 * The data.
		 *
		 * @public
		 * @return {Object}
		 */
		get data() {
			return this._data;
		}

		/**
		 * Formats a human-readable message, describing the failure.
		 *
		 * @public
		 * @param {Object=} root - Root data from the {@link FailureReason}.
		 * @returns {String}
		 */
		format(root) {
			return this._type.template.replace(tokenRegex, (full, ignored, casing, token) => {
				let tokenToUse;
				let dataToRead;

				if (token.startsWith(rootPrefix)) {
					tokenToUse = token.slice(rootLength);
					dataToRead = root;
				} else {
					tokenToUse = token;
					dataToRead = this._data;
				}

				let replacement = attributes.read(dataToRead, tokenToUse);

				if (replacement) {
					if (casing === 'l') {
						replacement = `${replacement.slice(0, 1).toLowerCase()}${replacement.slice(1)}`;
					} else if (casing === 'u') {
						replacement = `${replacement.slice(0, 1).toUpperCase()}${replacement.slice(1)}`;
					} else if (casing === 'U') {
						replacement = `${replacement.toUpperCase()}`;
					} else if (casing === 'L') {
						replacement = `${replacement.toLowerCase()}`;
					}
				}

				return replacement;
			});
		}

		toString() {
			return '[FailureReasonItem]';
		}
	}

	const tokenRegex = /{(([U|L|l|u])\|)?([a-zA-Z.]*)}/g;

	const rootPrefix = 'root.';
	const rootLength = rootPrefix.length;


	return FailureReasonItem;
})();
