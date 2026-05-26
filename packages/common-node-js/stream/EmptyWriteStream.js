const object = require('@barchart/common-js/lang/object');

const Stream = require('stream');

module.exports = (() => {
	'use strict';

	/**
	 * A Node.js {@link Stream.Writable} that does nothing. By Default,
	 * the "objectMode" option is set to true.
	 *
	 * @public
	 * @extends {Steam.Writable}
	 * @param {Object=} options
	 */
	class EmptyWriteStream extends Stream.Writable {
		constructor(options) {
			super(object.merge({ objectMode: true }, (options || { })));

			this._counter = 0;
		}

		/**
		 * The number of empty "writes" which have been made.
		 *
		 * @public
		 * @returns {Number}
		 */
		get count() {
			return this._counter;
		}

		_write(chunk, encoding, callback) {
			this._counter = this._counter + 1;

			callback(null);
		}

		toString() {
			return '[EmptyWriteStream]';
		}
	}

	return EmptyWriteStream;
})();