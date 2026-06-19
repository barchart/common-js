import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';
import * as object from '@barchart/common-js/lang/object.js';

import Stream from 'stream';

/**
 * A Node.js {@link Stream.Writable} that defers its work to a delegate. By
 * default, the "objectMode" option is set to true.
 *
 * @public
 * @extends {Stream.Writable}
 */
export default class DelegateWriteStream extends Stream.Writable {
	#asynchronous;
	#delegate;

	/**
	 * @param {Function} delegate
	 * @param {object=} options
	 * @param {boolean=} asynchronous
	 */
	constructor(delegate, options, asynchronous) {
		super(object.merge({ objectMode: true }, (options || { })));

		assert.argumentIsRequired(delegate, 'delegate', Function);
		assert.argumentIsOptional(asynchronous, 'asynchronous', Boolean);

		this.#delegate = delegate;
		this.#asynchronous = is.boolean(asynchronous) && asynchronous;
	}

	_write(chunk, encoding, callback) {
		if (this.#asynchronous) {
			processAsynchronous(this.#delegate, chunk, callback);
		} else {
			processSynchronous(this.#delegate, chunk, callback);
		}
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[DelegateWriteStream]';
	}
}

function processSynchronous(delegate, chunk, callback) {
	let result = null;

	try {
		delegate(chunk);
	} catch (e) {
		result = e;
	}

	callback(result);
}

function processAsynchronous(delegate, chunk, callback) {
	Promise.resolve()
		.then(() => {
			return delegate(chunk);
		}).then(() => {
			return null;
		}).catch((e) => {
			return e;
		}).then((result) => {
			callback(result);
		});
}
