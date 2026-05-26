const assert = require('@barchart/common-js/lang/assert'),
	is = require('@barchart/common-js/lang/is'),
	object = require('@barchart/common-js/lang/object');

const Stream = require('stream');

module.exports = (() => {
	'use strict';

	/**
	 * A Node.js {@link Stream.Writable} that defers its work to a delegate. By
	 * default, the "objectMode" option is set to true.
	 *
	 * @public
	 * @extends {Steam.Writable}
	 * @param {Function} delegate
	 * @param {Object=} options
	 * @param {Boolean=} asynchronous
	 */
	class DelegateWriteStream extends Stream.Writable {
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

	return DelegateWriteStream;
})();