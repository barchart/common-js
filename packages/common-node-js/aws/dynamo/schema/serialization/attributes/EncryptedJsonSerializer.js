const CompressedJsonSerializer = require('./CompressedJsonSerializer');

module.exports = (() => {
	'use strict';

	/**
	 * Converts an object into (and back from) the compressed and encrypted
	 * representation used on a DynamoDB record.
	 *
	 * @public
	 * @extends {CompressedJsonSerializer}
	 */
	class EncryptedJsonSerializer extends CompressedJsonSerializer {
		constructor(attribute) {
			super(attribute);
		}

		toString() {
			return '[EncryptedJsonSerializer]';
		}
	}

	return EncryptedJsonSerializer;
})();