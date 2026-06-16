import * as assert from '@barchart/common-js/lang/assert.js';
import * as object from '@barchart/common-js/lang/object.js';

import Stream from 'stream';

/**
 * A super-simple Node.js {@link Stream.Readable} that emits an array's
 * items. Please note, this stream has very limited use cases and
 * in 99% of use cases, an actual streaming source should be used
 * which does not require the entire stream to be pre-cached (in
 * the form of an array).
 *
 * @public
 * @extends {Stream.Readable}
 * @param {Object=} options
 */
export default class ArrayReadStream extends Stream.Readable {
	constructor(data, options) {
		super(object.merge({ objectMode: true }, (options || { })));

		assert.argumentIsArray(data, 'data');

		this._data = data;
		this._index = 0;
	}

	_read(size) {
		let item;

		if (this._index < this._data.length) {
			item = this._data[this._index];

			this._index = this._index + 1;
		} else {
			item = null;
		}

		this.push(item);
	}

	toString() {
		return '[ArrayReadStream]';
	}
}
