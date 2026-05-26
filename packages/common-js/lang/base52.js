const assert = require('./assert'),
	is = require('./is');

module.exports = (() => {
	'use strict';

	const BASE = 52;

	const characters = [ ];

	for (let c = 97; c < 123; c++) {
		characters.push(String.fromCharCode(c));
	}

	for (let c = 65; c < 91; c++) {
		characters.push(String.fromCharCode(c));
	}

	/**
	 * Utilities for working with numbers in base 52.
	 *
	 * @public
	 * @module lang/base64
	 */
	return  {
		/**
		 * Converts a number from base ten to base fifty-two (where a=0, b=1, y=24 z=25, A=26,
		 * and Z=51).
		 *
		 * @public
		 * @param {Number} value
		 * @param {Number=} places
		 * @returns {String}
		 */
		fromBaseTen(value, places) {
			assert.argumentIsValid(value, 'value', is.large, 'must be an integer');

			if (places) {
				assert.argumentIsValid(places, 'places', is.integer, 'must be an integer');
				assert.argumentIsValid(places, 'places', is.positive, 'must be positive');
			}

			const absolute = Math.abs(value);
			const negative = value < 0;

			let placesToUse;

			if (places) {
				placesToUse = places;
			} else {
				placesToUse = 1;

				while (true) {
					if (absolute < Math.pow(BASE, placesToUse)) {
						break;
					}

					placesToUse = placesToUse + 1;
				}
			}

			const builder = [ ];

			if (negative) {
				builder.push('-');
			}

			let remaining = absolute;

			for (let place = placesToUse; place > 0; place--) {
				const magnitude = Math.pow(BASE, place - 1);

				const multiples = Math.floor(remaining / magnitude);
				const character = characters[multiples];
				
				remaining = remaining - (multiples * magnitude);

				builder.push(character);
			}

			return builder.join('');
		}
	};
})();