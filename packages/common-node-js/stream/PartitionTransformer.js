const log4js = require('log4js'),
	Stream = require('stream');

const array = require('@barchart/common-js/lang/array'),
	assert = require('@barchart/common-js/lang/assert'),
	is = require('@barchart/common-js/lang/is'),
	object = require('@barchart/common-js/lang/object');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('common-node/stream/PartitionTransformer');

	/**
	 * Partitions arrays into smaller arrays of a maximum size.
	 *
	 * @public
	 * @extends {Steam.Transform}
	 * @param {Number} size
	 * @param {String=} description
	 * @param {Boolean=} silent
	 */
	class PartitionTransformer extends Stream.Transform {
		constructor(size, description, silent) {
			super({ objectMode: true });

			assert.argumentIsRequired(size, 'size', Number);
			assert.argumentIsOptional(description, 'description', String);
			assert.argumentIsOptional(silent, 'silent', Boolean);

			this._size = size;

			this._description = description || 'Partition Transformer';
			this._silent = is.boolean(silent) && silent;

			this._counter = 0;
		}

		_transform(chunk, encoding, callback) {
			this._counter = this._counter + 1;

			let error = null;

			if (is.array(chunk)) {
				const partitions = array.partition(chunk, this._size);

				partitions.forEach(partition => this.push(partition));
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
			return '[PartitionTransformer]';
		}
	}

	return PartitionTransformer;
})();