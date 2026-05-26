const Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
	'use strict';

	/**
	 * Specifies the streaming behavior of a DynamoDB table.
	 *
	 * @public
	 * @extends {Enum}
	 */
	class StreamViewType extends Enum {
		constructor(schemaName, description) {
			super(schemaName, description);
		}

		/**
		 * @returns {String}
		 */
		get schemaName() {
			return this.code;
		}

		/**
		 * @returns {StreamViewType}
		 */
		static get NEW_IMAGE() {
			return streamTypeNewImage;
		}

		/**
		 * @returns {StreamViewType}
		 */
		static get OLD_IMAGE() {
			return streamTypeOldImage;
		}

		/**
		 * @returns {StreamViewType}
		 */
		static get BOTH_IMAGES() {
			return streamTypeBothImages;
		}

		/**
		 * @returns {StreamViewType}
		 */
		static get KEYS_ONLY() {
			return streamTypeKeysOnly;
		}

		toString() {
			return `[StreamViewType (description=${this.code})]`;
		}
	}

	const streamTypeNewImage = new StreamViewType('NEW_IMAGE', 'New Image');
	const streamTypeOldImage = new StreamViewType('OLD_IMAGE', 'Old Image');
	const streamTypeBothImages = new StreamViewType('NEW_AND_OLD_IMAGES', 'Both Images');
	const streamTypeKeysOnly = new StreamViewType('KEYS_ONLY', 'Keys Only');

	return StreamViewType;
})();