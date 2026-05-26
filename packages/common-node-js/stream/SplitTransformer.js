const log4js = require('log4js'),
	Stream = require('stream');

const assert = require('@barchart/common-js/lang/assert'),
	is = require('@barchart/common-js/lang/is'),
	object = require('@barchart/common-js/lang/object');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('common-node/stream/SplitTransformer');

	/**
	 * Splits arrays into items.
	 *
	 * @public
	 * @extends {Steam.Transform}
	 * @param {String=} description
	 * @param {Boolean=} silent
	 * @param {Object=} options
	 */
	class SplitTransformer extends Stream.Transform {
		constructor(description, silent, options) {
			super(object.merge({ objectMode: true }, (options || { })));

			assert.argumentIsOptional(description, 'description', String);
			assert.argumentIsOptional(silent, 'silent', Boolean);
			assert.argumentIsOptional(options, 'options', Object);

			this._description = description || 'Split Transformer';
			this._silent = is.boolean(silent) && silent;

			this._counter = 0;
		}

		_transform(chunk, encoding, callback) {
			this._counter = this._counter + 1;

			let error = null;

			if (is.array(chunk)) {
				chunk.forEach(item => this.push(item));
			} else {
				error = new Error(`Transformation [ ${this._counter} ] for [ ${this._description} ] failed, unexpected input type.`);
			}

			if (error === null) {
				callback();
			} else {
				if (this._silent) {
					logger.warn(`Transformation [ ${this._counter} ] for [ ${this._description} ] failed.`);

					if (logger.isTraceEnabled() && chunk) {
						logger.trace(chunk);
					}

					error = null;
				}

				callback(error, null);
			}
		}

		toString() {
			return '[SplitTransformer]';
		}
	}

	return SplitTransformer;
})();