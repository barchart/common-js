import * as assert from '@barchart/common-js/lang/assert.js';
import * as object from '@barchart/common-js/lang/object.js';

import Stream from 'stream';

/**
 * Provides iterator read stream behavior.
 *
 * @public
 */
export default class IteratorReadStream extends Stream.Readable {
	#iterator;

	/**
	 * @param {*} iterator - The iterator.
	 * @param {object=} options - The options.
	 */
	constructor(iterator, options) {
		super(object.merge({ objectMode: true }, (options || { })));

		this.#iterator = iterator;
	}

	/**
	 * Reads data into the stream.
	 *
	 * @protected
	 */
	_read() {
		let next = this.#iterator.next();
		let value;

		if (next.done) {
			value = null;
		} else {
			value = next.value;
		}

		this.push(value);
	}

	/**
	 * @public
	 * @static
	 * @param {Array<object>} a
	 * @returns {IteratorReadStream}
	 */
	static fromArray(a) {
		assert.argumentIsArray(a, 'a');

		return new IteratorReadStream(a[Symbol.iterator]());
	}

	/**
	 * @static
	 * @public
	 * @param {Map} m
	 * @returns {IteratorReadStream}
	 */
	static fromMap(m) {
		assert.argumentIsRequired(m, 'm', Map, 'Map');

		return new IteratorReadStream(m.values());
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[IteratorReadStream]';
	}
}
