import * as assert from '@barchart/common-js/lang/assert.js';
import * as object from '@barchart/common-js/lang/object.js';

import Stream from 'stream';

/**
 * A super-simple Node.js {@link Stream.Readable} that emits a string.
 * Please note, this stream has very limited use cases and
 * in 99% of use cases, an actual streaming source should be used
 * which does not require the entire stream to be pre-cached (in
 * the form of an array).
 *
 * @public
 * @extends {Stream.Readable}
 */
export default class StringReadStream extends Stream.Readable {
	#data;

	/**
     * @param {string} data
     * @param {object=} options
     */
	constructor(data, options) {
		super(object.merge({ objectMode: true }, (options || { })));

		assert.argumentIsRequired(data, 'data', String);

		this.#data = data;
	}

	_read(size) {
		this.push(this.#data);
		this.push(null);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[StringReadStream]';
	}
}
