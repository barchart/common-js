import * as object from '@barchart/common-js/lang/object.js';

import Stream from 'stream';

/**
 * A Node.js {@link Stream.Writable} that does nothing. By Default,
 * the "objectMode" option is set to true.
 *
 * @public
 * @extends {Stream.Writable}
 * @param {Object=} options
 */
export default class EmptyWriteStream extends Stream.Writable {
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
