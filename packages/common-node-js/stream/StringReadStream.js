const assert = require('@barchart/common-js/lang/assert'),
	object = require('@barchart/common-js/lang/object');

const Stream = require('stream');

module.exports = (() => {
	'use strict';

	/**
	 * A super-simple Node.js {@link Stream.Readable} that emits a string.
	 * Please note, this stream has very limited use cases and
	 * in 99% of use cases, an actual streaming source should be used
	 * which does not require the entire stream to be pre-cached (in
	 * the form of an array).
	 *
	 * @public
	 * @extends {Steam.Readable}
	 * @param {Object=} options
	 */
	class StringReadStream extends Stream.Readable {
		constructor(data, options) {
			super(object.merge({ objectMode: true }, (options || { })));

			assert.argumentIsRequired(data, 'data', String);

			this._data = data;
			this._index = 0;
		}

		_read(size) {
			this.push(this._data);
			this.push(null);
		}

		toString() {
			return '[StringReadStream]';
		}
	}

	return StringReadStream;
})();