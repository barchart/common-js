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
 * @param {Function} delegate
 * @param {Object=} options
 * @param {Boolean=} asynchronous
 */
export default class DelegateWriteStream extends Stream.Writable {
	constructor(delegate, options, asynchronous) {
		super(object.merge({ objectMode: true }, (options || { })));

		assert.argumentIsRequired(delegate, 'delegate', Function);
		assert.argumentIsOptional(asynchronous, 'asynchronous', Boolean);

		this._delegate = delegate;
		this._asynchronous = is.boolean(asynchronous) && asynchronous;
	}

	_write(chunk, encoding, callback) {
		if (this._asynchronous) {
			processAsynchronous(this._delegate, chunk, callback);
		} else {
			processSynchronous(this._delegate, chunk, callback);
		}
	}

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
