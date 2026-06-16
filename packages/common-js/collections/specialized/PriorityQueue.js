import * as array from './../../lang/array.js';
import * as assert from './../../lang/assert.js';

import Queue from './../Queue.js';

/**
 * A queue that sorts items as they are inserted.
 *
 * @public
 * @extends {Queue}
 */
export default class PriorityQueue extends Queue {
	constructor(comparator) {
		super();

		assert.argumentIsRequired(comparator, 'comparator', Function);

		this._comparator = comparator;
	}

	enqueue(item) {
		array.insert(this._array, item, this._comparator);

		return item;
	}

	dequeue() {
		return super.dequeue();
	}

	peek() {
		return super.peek();
	}

	scan(action) {
		return super.scan(action);
	}

	toArray() {
		return super.toArray();
	}

	toString() {
		return '[PriorityQueue]';
	}
}
