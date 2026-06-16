import * as assert from '@barchart/common-js/lang/assert.js';
import * as object from '@barchart/common-js/lang/object.js';

import Stream from 'stream';

export default class IteratorReadStream extends Stream.Readable {
	constructor(iterator, options) {
		super(object.merge({ objectMode: true }, (options || { })));

		this._iterator = iterator;
	}

	_read() {
		let next = this._iterator.next();
		let value;

		if (next.done) {
			value = null;
		} else {
			value = next.value;
		}

		this.push(value);
	}

	/**
	 * @param {Array<Object>} a
	 * @returns {IteratorReadStream}
	 */
	static fromArray(a) {
		assert.argumentIsArray(a, 'a');

		return new IteratorReadStream(a[Symbol.iterator]());
	}

	/**
	 * @param {Map} m
	 * @returns {IteratorReadStream}
	 */
	static fromMap(m) {
		assert.argumentIsRequired(m, 'm', Map, 'Map');

		return new IteratorReadStream(m.values());
	}

	toString() {
		return '[IteratorReadStream]';
	}
}
