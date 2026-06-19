import * as object from '@barchart/common-js/lang/object.js';

import Stream from 'stream';

/**
 * A Node.js {@link Stream.Writable} that does nothing. By Default,
 * the "objectMode" option is set to true.
 *
 * @public
 * @extends {Stream.Writable}
 */
export default class EmptyWriteStream extends Stream.Writable {
	#counter;

	/**
	 * @param {object=} options
	 */
	constructor(options) {
		super(object.merge({ objectMode: true }, (options || { })));

		this.#counter = 0;
	}

	/**
	 * The number of empty "writes" which have been made.
	 *
	 * @public
	 * @returns {number}
	 */
	get count() {
		return this.#counter;
	}

	_write(chunk, encoding, callback) {
		this.#counter = this.#counter + 1;

		callback(null);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[EmptyWriteStream]';
	}
}
