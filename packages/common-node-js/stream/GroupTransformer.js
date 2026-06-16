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
 * @param {Function} keySelector
 * @param {String=} description
 * @param {Boolean=} silent
 */
export default class GroupTransformer extends Stream.Transform {
	constructor(keySelector, description, silent) {
		super({ objectMode: true });

		assert.argumentIsRequired(keySelector, 'keySelector', Function);
		assert.argumentIsOptional(description, 'description', String);
		assert.argumentIsOptional(silent, 'silent', Boolean);

		this._keySelector = keySelector;

		this._description = description || 'Group Transformer';
		this._silent = is.boolean(silent) && silent;

		this._counter = 0;

		this._batch = null;
		this._key = null;
	}

	_transform(chunk, encoding, callback) {
		this._counter = this._counter + 1;

		let error = null;

		if (is.object(chunk)) {
			let key;

			try {
				key = this._keySelector(chunk);
			} catch (e) {
				error = e;
			}

			if (error === null) {
				if (!object.equals(this._key, key)) {
					publish.call(this);

					this._key = key;
				}

				this._batch.push(chunk);
			}
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

	_flush(callback) {
		publish.call(this);

		callback();
	}

	toString() {
		return '[GroupTransformer]';
	}
}

function publish() {
	if (is.array(this._batch) && this._batch.length !== 0) {
		this.push(this._batch);
	}

	this._batch = [ ];
}
