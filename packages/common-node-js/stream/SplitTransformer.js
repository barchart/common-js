import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';
import * as object from '@barchart/common-js/lang/object.js';

import log4js from 'log4js';
import Stream from 'stream';

const logger = log4js.getLogger('common-node/stream/SplitTransformer');

/**
 * Splits arrays into items.
 *
 * @public
 * @extends {Stream.Transform}
 */
export default class SplitTransformer extends Stream.Transform {
	#counter;
	#description;
	#silent;

	/**
	 * @param {string=} description - The description.
	 * @param {boolean=} silent - The silent.
	 * @param {object=} options - The options.
	 */
	constructor(description, silent, options) {
		super(object.merge({ objectMode: true }, (options || { })));

		assert.argumentIsOptional(description, 'description', String);
		assert.argumentIsOptional(silent, 'silent', Boolean);
		assert.argumentIsOptional(options, 'options', Object);

		this.#description = description || 'Split Transformer';
		this.#silent = is.boolean(silent) && silent;

		this.#counter = 0;
	}

	/**
	 * Transforms the input.
	 *
	 * @protected
	 * @param {*} chunk - The chunk.
	 * @param {string} encoding - The encoding.
	 * @param {Function} callback - The callback.
	 */
	_transform(chunk, encoding, callback) {
		this.#counter = this.#counter + 1;

		let error = null;

		if (is.array(chunk)) {
			chunk.forEach(item => this.push(item));
		} else {
			error = new Error(`Transformation [ ${this.#counter} ] for [ ${this.#description} ] failed, unexpected input type.`);
		}

		if (error === null) {
			callback();
		} else {
			if (this.#silent) {
				logger.warn(`Transformation [ ${this.#counter} ] for [ ${this.#description} ] failed.`);

				if (logger.isTraceEnabled() && chunk) {
					logger.trace(chunk);
				}

				error = null;
			}

			callback(error, null);
		}
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[SplitTransformer]';
	}
}
