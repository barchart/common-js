var assert = require('./assert');

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
			if (isString(s) && s.length > length) {
				return s.substring(0, length) + ' ...';
			} else {
				return s;
			}
		}
	};
})();