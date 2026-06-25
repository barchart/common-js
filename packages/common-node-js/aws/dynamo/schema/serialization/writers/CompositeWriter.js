import * as assert from '@barchart/common-js/lang/assert.js';

import Writer from './Writer.js';

/**
 * An implementation of {@link Writer} that delegates to an array
 * of {@link Writer} instances.
 *
 * @public
 * @extends {Writer}
 */
export default class CompositeWriter extends Writer {
	#writers;

	/**
	 * @param {Writer[]} writers - The writers.
	 */
	constructor(writers) {
		super();

		assert.argumentIsArray(writers, 'writers', Writer, 'Writer');

		this.#writers = writers;
	}

	/**
	 * Writes data from the stream.
	 *
	 * @protected
	 * @param {object} source - The source.
	 * @param {object} target - The target.
	 * @returns {*}
	 */
	_write(source, target) {
		return this.#writers.reduce((targetToUse, writer) => writer.write(source, targetToUse), target);
	}

	/**
	 * Indicates if the write can be performed.
	 *
	 * @protected
	 * @param {object} source - The source.
	 * @param {object} target - The target.
	 * @returns {boolean}
	 */
	_canWrite(source, target) {
		return true;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[CompositeWriter]';
	}
}
