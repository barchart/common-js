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
 */
export default class ArrayReadStream extends Stream.Readable {
	#data;
	#index;

	/**
	 * @param {Array} data
	 * @param {object=} options
	 */
	constructor(data, options) {
		super(object.merge({ objectMode: true }, (options || { })));

		assert.argumentIsArray(data, 'data');

		this.#data = data;
		this.#index = 0;
	}

	_read(size) {
		let item;

		if (this.#index < this.#data.length) {
			item = this.#data[this.#index];

			this.#index = this.#index + 1;
		} else {
			item = null;
		}

		this.push(item);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[ArrayReadStream]';
	}
}
