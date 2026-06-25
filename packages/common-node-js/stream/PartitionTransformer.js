import * as array from '@barchart/common-js/lang/array.js';
import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';

import log4js from 'log4js';
import Stream from 'stream';

const logger = log4js.getLogger('common-node/stream/PartitionTransformer');

/**
 * Partitions arrays into smaller arrays of a maximum size.
 *
 * @public
 * @extends {Stream.Transform}
 */
export default class PartitionTransformer extends Stream.Transform {
	#counter;
	#description;
	#silent;
	#size;

	/**
	 * @param {number} size - The size.
	 * @param {string=} description - The description.
	 * @param {boolean=} silent - The silent.
	 */
	constructor(size, description, silent) {
		super({ objectMode: true });

		assert.argumentIsRequired(size, 'size', Number);
		assert.argumentIsOptional(description, 'description', String);
		assert.argumentIsOptional(silent, 'silent', Boolean);

		this.#size = size;

		this.#description = description || 'Partition Transformer';
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
			const partitions = array.partition(chunk, this.#size);

			partitions.forEach(partition => this.push(partition));
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
		return '[PartitionTransformer]';
	}
}
