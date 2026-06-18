import * as assert from './../../lang/assert.js';
import * as attributes from './../../lang/attributes.js';

import FailureType from './FailureType.js';

/**
 * One of the reason(s) for API failure, including any specific data that
 * allows a human-readable message to be generated.
 *
 * @public
 */
export default class FailureReasonItem {
	#type;
	#data;

	/**
	 * @param {FailureType} type
	 * @param {object=} data
	 */
	constructor(type, data) {
		assert.argumentIsRequired(type, 'type', FailureType, 'FailureType');

		this.#type = type;
		this.#data = data || null;
	}

	/**
	 * The {@link FailureType} of the item.
	 *
	 * @public
	 * @returns {FailureType}
	 */
	get type() {
		return this.#type;
	}

	/**
	 * The data.
	 *
	 * @public
	 * @return {object}
	 */
	get data() {
		return this.#data;
	}

	/**
	 * Formats a human-readable message, describing the failure.
	 *
	 * @public
	 * @param {object=} root - Root data from the {@link FailureReason}.
	 * @returns {string}
	 */
	format(root) {
		return this.#type.template.replace(tokenRegex, (full, ignored, casing, token) => {
			let tokenToUse;
			let dataToRead;

			if (token.startsWith(rootPrefix)) {
				tokenToUse = token.slice(rootLength);
				dataToRead = root;
			} else {
				tokenToUse = token;
				dataToRead = this.#data;
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

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[FailureReasonItem]';
	}
}

const tokenRegex = /{(([U|L|l|u])\|)?([a-zA-Z.]*)}/g;

const rootPrefix = 'root.';
const rootLength = rootPrefix.length;
