const log4js = require('log4js'),
	Stream = require('stream');

const assert = require('@barchart/common-js/lang/assert'),
	is = require('@barchart/common-js/lang/is'),
	object = require('@barchart/common-js/lang/object'),
	promise = require('@barchart/common-js/lang/promise');

const Transformation = require('./transformations/Transformation');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('common-node/stream/ObjectTransformer');

	/**
	 * A Node.js stream transform that delegates work to one (or many) other
	 * {@link Transformer} instances.
	 *
	 * @public
	 * @extends {Steam.Transform}
	 * @param {Array<Transformation>} transformations
	 * @param {String=} description
	 * @param {Boolean=} silent
	 * @param {Object=} options
	 */
	class ObjectTransformer extends Stream.Transform {
		constructor(transformations, description, silent, options) {
			super(object.merge({ objectMode: true, highWaterMark: 1000 }, (options || { })));

			assert.argumentIsArray(transformations, 'transformations', Transformation);
			assert.argumentIsOptional(description, 'description', String);
			assert.argumentIsOptional(silent, 'silent', Boolean);
			assert.argumentIsOptional(options, 'options', Object);

			this._tranformations = transformations;

			this._description = description || 'Object Transformer';
			this._silent = is.boolean(silent) && silent;

			let delegate;

			if (transformations.every(t => t.synchronous)) {
				delegate = processSynchronous.bind(this);
			} else {
				delegate = processAsynchronous.bind(this);
			}

			this._delegate = delegate;

			this._counter = 0;
		}

		get transformerCount() {
			return this._tranformations.length;
		}

		_transform(chunk, encoding, callback) {
			this._delegate(chunk, callback);
		}

		/**
		 * Adds a new {@link Transformer} instance.
		 *
		 * @public
		 * @param {Transformation}
		 * @returns {ObjectTransformer}
		 */
		addTransformation(transformation) {
			assert.argumentIsRequired(transformation, 'transformation', Transformation, 'Transformation');

			return new ObjectTransformer(this._tranformations.concat([ transformation ]), this._description, this._silent);
		}

		static define(description, silent, options) {
			return new ObjectTransformer([ ], description, silent, options);
		}

		toString() {
			return '[ObjectTransformer]';
		}
	}

	function processSynchronous(chunk, callback) {
		this._counter = this._counter + 1;

		let error = null;
		let transformed = chunk;

		this._tranformations.every((t) => {
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
			if (this._silent) {
				logger.warn(`Transformation [ ${this._counter} ] for [ ${this._description} ] failed.`);

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

	function processAsynchronous(chunk, callback) {
		return promise.pipeline(this._tranformations.map(t => t.transform.bind(t)), chunk)
			.then((transformed) => {
				callback(null, transformed);
			}).catch((e) => {
				let error;

				if (this._silent) {
					logger.warn(`Transformation [ ${this._counter} ] for [ ${this._description} ] failed.`);

					if (logger.isTraceEnabled() && chunk) {
						logger.trace(chunk);
					}

					error = null;
				} else {
					logger.error(e);

					error = e;
				}

				callback(error, null);
			});
	}

	return ObjectTransformer;
})();