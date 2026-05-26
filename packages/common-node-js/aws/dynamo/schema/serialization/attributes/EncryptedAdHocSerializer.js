const CompressedAdHocSerializer = require('./CompressedAdHocSerializer');

module.exports = (() => {
	'use strict';

	/**
	 * Converts an {@link AdHoc} instance into (and back from) the compressed
	 * and encrypted representation used on a DynamoDB record.
	 *
	 * @public
	 * @extends {CompressedAdHocSerializer}
	 */
	class EncryptedAdHocSerializer extends CompressedAdHocSerializer {
		constructor(attribute) {
			super(attribute);
		}

		toString() {
			return '[EncryptedAdHocSerializer]';
		}
	}

	return EncryptedAdHocSerializer;
})();