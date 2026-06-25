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
	#comparator;

	/**
	 * @param {(a: *, b: *) => number} comparator - The comparator used to sort items.
	 */
	constructor(comparator) {
		super();

		assert.argumentIsRequired(comparator, 'comparator', Function);

		this.#comparator = comparator;
	}

	/**
	 * Adds an item to the queue according to its priority.
	 *
	 * @public
	 * @param {*} item - The item to add.
	 * @returns {*} The item added to the queue.
	 */
	enqueue(item) {
		array.insert(this._getArray(), item, this.#comparator);

		return item;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[PriorityQueue]';
	}
}