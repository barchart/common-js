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
     * @param {(a: any, b: any) => number} comparator
     */
	constructor(comparator) {
		super();

		assert.argumentIsRequired(comparator, 'comparator', Function);

		this.#comparator = comparator;
	}

	/**
	 * @public
	 * @param {*} item
	 * @returns {PriorityQueue}
	 */
	enqueue(item) {
		array.insert(this._getArray(), item, this.#comparator);

		return item;
	}

	/**
	 * @public
	 * @returns {*}
	 */
	dequeue() {
		return super.dequeue();
	}

	/**
	 * @public
	 * @returns {*}
	 */
	peek() {
		return super.peek();
	}

	/**
	 * @public
	 * @param {*} action
	 */
	scan(action) {
		super.scan(action);
	}

	/**
	 * @public
	 * @returns {Array}
	 */
	toArray() {
		return super.toArray();
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
