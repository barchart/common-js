import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';
import * as object from '@barchart/common-js/lang/object.js';
import * as promise from '@barchart/common-js/lang/promise.js';

import Transformation from './transformations/Transformation.js';

import log4js from 'log4js';
import Stream from 'stream';

const logger = log4js.getLogger('common-node/stream/ObjectTransformer');

/**
 * A Node.js stream transform that delegates work to one (or many) other
 * {@link Transformer} instances.
 *
 * @public
 * @extends {Stream.Transform}
 */
export default class ObjectTransformer extends Stream.Transform {
	#counter;
	#delegate;
	#description;
	#silent;
	#transformations;

	/**
	 * @param {Array<Transformation>} transformations - The transformations.
	 * @param {string=} description - The description.
	 * @param {boolean=} silent - The silent.
	 * @param {object=} options - The options.
	 */
	constructor(transformations, description, silent, options) {
		super(object.merge({ objectMode: true, highWaterMark: 1000 }, (options || { })));

		assert.argumentIsArray(transformations, 'transformations', Transformation);
		assert.argumentIsOptional(description, 'description', String);
		assert.argumentIsOptional(silent, 'silent', Boolean);
		assert.argumentIsOptional(options, 'options', Object);

		this.#transformations = transformations;

		this.#description = description || 'Object Transformer';
		this.#silent = is.boolean(silent) && silent;

		let delegate;

		if (transformations.every(t => t.synchronous)) {
			delegate = this.#processSynchronous.bind(this);
		} else {
			delegate = this.#processAsynchronous.bind(this);
		}

		this.#delegate = delegate;

		this.#counter = 0;
	}

	/**
	 * Returns the transformer count.
	 *
	 * @public
	 * @returns {number}
	 */
	get transformerCount() {
		return this.#transformations.length;
	}

	/**
	 * Transforms the input.
	 *
	 * @protected
	 * @param {*} chunk - The chunk.
	 * @param {string} encoding - The encoding.
	 * @param {Function} callback - The callback.
	 * @returns {*}
	 */
	_transform(chunk, encoding, callback) {
		this.#delegate(chunk, callback);
	}

	/**
	 * Adds a new {@link Transformer} instance.
	 *
	 * @public
	 * @param {Transformation} transformation
	 * @returns {ObjectTransformer}
	 */
	addTransformation(transformation) {
		assert.argumentIsRequired(transformation, 'transformation', Transformation, 'Transformation');

		return new ObjectTransformer(this.#transformations.concat([ transformation ]), this.#description, this.#silent);
	}

	/**
	 * Creates or returns define.
	 *
	 * @public
	 * @static
	 * @param {string} description
	 * @param {*} silent
	 * @param {object=} options
	 * @returns {*}
	 */
	static define(description, silent, options) {
		return new ObjectTransformer([ ], description, silent, options);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[ObjectTransformer]';
	}


	#processSynchronous(chunk, callback) {
		this.#counter = this.#counter + 1;

		let error = null;
		let transformed = chunk;

		this.#transformations.every((t) => {
			try {
				transformed = t.transform(transformed);
				} catch (e) {
					error = e;
				}

				return error === null;
			});

			if (error === null) {
				callback(null, transformed);
			} else {
				if (this.#silent) {
					logger.warn(`Transformation [ ${this.#counter} ] for [ ${this.#description} ] failed.`);

					if (logger.isTraceEnabled() && chunk) {
						logger.trace(chunk);
					}

					error = null;
				} else {
					logger.error(error);
				}

				callback(error, null);
			}
		}

		async #processAsynchronous(chunk, callback) {
			try {
				const transformed = await promise.pipeline(this.#transformations.map(t => t.transform.bind(t)), chunk);

				callback(null, transformed);
			} catch (e) {
				let error;

				if (this.#silent) {
					logger.warn(`Transformation [ ${this.#counter} ] for [ ${this.#description} ] failed.`);

					if (logger.isTraceEnabled() && chunk) {
						logger.trace(chunk);
					}

					error = null;
				} else {
					logger.error(e);

					error = e;
				}

				callback(error, null);
			}
		}
	}
