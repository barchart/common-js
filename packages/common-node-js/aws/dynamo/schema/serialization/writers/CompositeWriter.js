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
	 * @param {Writer[]} writers
	 */
	constructor(writers) {
		super();

		assert.argumentIsArray(writers, 'writers', Writer, 'Writer');

		this.#writers = writers;
	}

	_write(source, target) {
		return this.#writers.reduce((targetToUse, writer) => writer.write(source, targetToUse), target);
	}

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
