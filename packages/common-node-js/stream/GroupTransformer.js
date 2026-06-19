import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';
import * as object from '@barchart/common-js/lang/object.js';

import log4js from 'log4js';
import Stream from 'stream';

const logger = log4js.getLogger('common-node/stream/GroupTransformer');

/**
 * Groups items into arrays, based on key (selected by delegate). Stream must be sorted.
 *
 * @public
 * @extends {Stream.Transform}
 */
export default class GroupTransformer extends Stream.Transform {
	#batch;
	#counter;
	#description;
	#key;
	#keySelector;
	#silent;

	/**
	 * @param {Function} keySelector
	 * @param {string=} description
	 * @param {boolean=} silent
	 */
	constructor(keySelector, description, silent) {
		super({ objectMode: true });

		assert.argumentIsRequired(keySelector, 'keySelector', Function);
		assert.argumentIsOptional(description, 'description', String);
		assert.argumentIsOptional(silent, 'silent', Boolean);

		this.#keySelector = keySelector;

		this.#description = description || 'Group Transformer';
		this.#silent = is.boolean(silent) && silent;

		this.#counter = 0;

		this.#batch = null;
		this.#key = null;
	}

	_transform(chunk, encoding, callback) {
		this.#counter = this.#counter + 1;

		let error = null;

		if (is.object(chunk)) {
			let key;

			try {
				key = this.#keySelector(chunk);
			} catch (e) {
				error = e;
			}

			if (error === null) {
				if (!object.equals(this.#key, key)) {
					this.#publish();

					this.#key = key;
				}

				this.#batch.push(chunk);
			}
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

	_flush(callback) {
		this.#publish();

		callback();
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[GroupTransformer]';
	}


	#publish() {
		if (is.array(this.#batch) && this.#batch.length !== 0) {
			this.push(this.#batch);
			}

			this.#batch = [ ];
		}
}
