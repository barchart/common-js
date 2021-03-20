const assert = require('./assert'),
	is = require('./is');

module.exports = (() => {
	'use strict';

	const regex = { };

	regex.camel = { };
	regex.camel.violations = /\b[A-Z]/g;

	/**
	 * Utility functions for strings.
	 *
	 * @public
	 * @module lang/string
	 */
	return {
		/**
		 * Adjusts a string, replacing the first character of each word with an uppercase
		 * character and all subsequent characters in the word with lowercase characters.
		 *
		 * @public
		 * @static
		 * @param {String} s
		 * @returns {String}
		 */
		startCase(s) {
			return s.split(' ').reduce((phrase, word) => {
				if (word.length !== 0) {
					phrase.push(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
				}

				return phrase;
			}, [ ]).join(' ');
		},

		/**
		 * Adjust a string to use camel case, where the first letter of each word is replaced
		 * with a lower case character.
		 *
		 * @public
		 * @static
		 * @param {String} s
		 * @returns {String}
		 */
		camelCase(s) {
			assert.argumentIsRequired(s, 's', String);

			return s.replace(regex.camel.violations, m => m.toLocaleLowerCase());
		},

		/**
		 * If a string exceeds a desired length, it is truncated and a poor man's
		 * ellipsis (i.e. three periods) is appended. Otherwise, the original
		 * string is returned.
		 *
		 * @public
		 * @static
		 * @param {String} s
		 * @param {Number} length
		 * @returns {String}
		 */
		truncate(s, length) {
			if (is.string(s) && s.length > length) {
				return s.substring(0, length) + ' ...';
			} else {
				return s;
			}
		},

		/**
		 * Adds leading characters to a string, until the string length is a desired size.
		 *
		 * @public
		 * @static
		 * @param {String} s - The string to pad.
		 * @param {Number} length - The desired overall length of the string.
		 * @param {String} character - The character to use for padding.
		 * @returns {String}
		 */
		padLeft(s, length, character) {
			assert.argumentIsRequired(s, 's', String);
			assert.argumentIsRequired(length, 'length', Number);
			assert.argumentIsRequired(character, 'character', String);

			if (character.length !== 1) {
				throw new Error('The "character" argument must be one character in length.');
			}

			return character.repeat(length - s.length) + s;
		},

		/**
		 * Performs a simple token replacement on a string; where the tokens
		 * are braced numbers (e.g. {0}, {1}, {2}).
		 *
		 * @public
		 * @static
		 * @param {String} s - The string to format (e.g. 'my first name is {0} and my last name is {1}')
		 * @param {Array<String>} data - The replacement data
		 * @returns {String}
		 */
		format(s, ...data) {
			assert.argumentIsRequired(s, 's', String);

            return s.replace(/{(\d+)}/g, (match, i) => {
            	let replacement;

            	if (i < data.length) {
            		const item = data[i];

            		if (!is.undefined(item) && !is.null(item)) {
			            replacement = item.toString();
		            } else {
			            replacement = match;
		            }
				} else {
		            replacement = match;
				}

				return replacement;
            });
		}
	};
})();