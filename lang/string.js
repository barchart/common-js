const assert = require('./assert'),
	is = require('./is');

module.exports = (() => {
	'use strict';

	return {
		startCase(s) {
			return s.split(' ').reduce((phrase, word) => {
				if (word.length !== 0) {
					phrase.push(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
				}

				return phrase;
			}, [ ]).join(' ');
		},

		truncate(s, length) {
			if (is.string(s) && s.length > length) {
				return s.substring(0, length) + ' ...';
			} else {
				return s;
			}
		},

		padLeft(s, length, character) {
			assert.argumentIsRequired(s, 's', String);
			assert.argumentIsRequired(length, 'length', Number);
			assert.argumentIsRequired(character, 'character', String);

			if (character.length !== 1) {
				throw new Error('The "character" argument must be one character in length.');
			}

			return character.repeat(length - s.length) + s;
		}
	};
})();