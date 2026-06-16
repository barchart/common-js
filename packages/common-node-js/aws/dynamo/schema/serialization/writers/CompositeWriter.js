import * as assert from '@barchart/common-js/lang/assert.js';

import Writer from './Writer.js';

/**
 * An implementation of {@link Writer} that delegates to an array
 * of {@link Writer} instances.
 *
 * @public
 * @extends {Writer}
 * @param {Writer[]} writers
 */
export default class CompositeWriter extends Writer {
	constructor(writers) {
		super();

		assert.argumentIsArray(writers, 'writers', Writer, 'Writer');

		this._writers = writers;
	}

	_write(source, target) {
		return this._writers.reduce((targetToUse, writer) => writer.write(source, targetToUse), target);
	}

	_canWrite(source, target) {
		return true;
	}

	toString() {
		return '[CompositeWriter]';
	}
}
