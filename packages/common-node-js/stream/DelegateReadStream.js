import * as assert from '@barchart/common-js/lang/assert.js';

import process from 'process';
import log4js from 'log4js';
import Stream from 'stream';

const logger = log4js.getLogger('common-node/aws/dynamo/stream/DelegateReadStream');

/**
 * 	A Node.js {@link Stream.Readable} that defers data generation to
 * 	an external delegate.
 *
 * @public
 * @extends {Stream.Readable}
 */
export default class DelegateReadStream extends Stream.Readable {
	#batch;
	#completed;
	#delegate;
	#discrete;
	#error;
	#readPromise;
	#reading;
	#scanned;
	#started;
	#stopping;

	/**
	 * @param {DataProvider} delegate - The delegate.
	 * @param {number=} highWaterMark - The high water mark.
	 * @param {boolean=} discrete - The discrete.
	 */
	constructor(delegate, highWaterMark, discrete) {
		super({ objectMode: true, highWaterMark: highWaterMark || 10 });

		assert.argumentIsRequired(delegate, 'delegate', Function);
		assert.argumentIsOptional(highWaterMark, 'highWaterMark', Number);
		assert.argumentIsOptional(discrete, 'discrete', Boolean);

		this.#delegate = delegate;

		this.#discrete = discrete || false;

		this.#scanned = 0;
		this.#batch = 0;

		this.#started = false;
		this.#stopping = false;
		this.#reading = false;
		this.#completed = false;

		this.#error = false;

		this.#readPromise = null;
	}

	/**
	 * Returns the number of items generated (so far).
	 *
	 * @public
	 * @returns {number}
	 */
	get scanned() {
		return this.#scanned;
	}

	/**
	 * Indicates if the {@link DelegateReadStream#stop} function has been
	 * invoked. If true, the stream has stopped producing data or will
	 * stop producing data soon.
	 *
	 * @public
	 * @returns {boolean}
	 */
	get stopping() {
		return this.#stopping;
	}

	/**
	 * Indicates if the reader has run to completion -- without being stopped --
	 * and all possible items have been enqueued.
	 *
	 * @public
	 * @returns {boolean}
	 */
	get completed() {
		return this.#completed;
	}

	/**
	 * Reads data into the stream.
	 *
	 * @protected
	 * @param {number} size - The size.
	 */
	_read(size) {
		if (this.#reading) {
			return;
		}

		if (this.#error) {
			logger.error('Unable to continue reading, an error was encountered.');
			return;
		}

		if (this.#started) {
			logger.debug('Delegate stream resumed');
		} else {
			logger.debug('Delegate stream started');

			this.#started = true;
		}

		this.#reading = true;

		const generateChunkRecursive = async () => {
			if (this.#stopping || this.completed) {
				this.#reading = false;

				if (this.#stopping) {
					logger.debug('Scan stream stopping, stream stopped');
				} else {
					logger.debug('Scan stream stopping, no more items');
				}

				this.push(null);

				return;
			}

			const currentBatch = this.#batch = this.#batch + 1;

			logger.debug(`Starting batch [ ${currentBatch} ]`);

			try {
				const items = await this.#delegate();

				if (items === null) {
					this.#completed = true;
				}

				if (items !== null && items.length !== 0) {
					this.#scanned = this.#scanned + items.length;

					if (this.#discrete) {
						this.#reading = items.reduce((accumulator, item) => {
							return this.push(item);
						}, this.#reading);
					} else {
						this.#reading = this.push(items);
					}
				}

				logger.debug(`Completed batch [ ${currentBatch} ]`);

				if (this.#reading) {
					generateChunkRecursive();
				} else {
					logger.debug('Scan stream paused');
				}
			} catch (e) {
				this.#readPromise = null;

				this.#reading = false;
				this.#error = true;

				this.push(null);

				logger.error('Scan stopping, error encountered', e);

				process.nextTick(() => this.emit('error', e));
			}
		};

		generateChunkRecursive();
	}

	/**
	 * Gracefully interrupts reading. Any current reads will continue and their items
	 * will be placed onto the queue. However, once any reads, that are in progress complete,
	 * no further reading will occur and the stream will end normally. Once reading has actually
	 * stopped, and no more data will be produced, the returned promise resolves.
	 *
	 * @public
	 * @async
	 * @returns {Promise<object|null>}
	 */
	async stop() {
		this.#stopping = true;

		if (this.#readPromise !== null) {
			await this.#readPromise;
		}

		return this.startKey;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[DelegateReadStream]';
	}
}

/**
 * A callback that provides data for the stream. When the callback returns
 * a null value, the no more data is available (and the stream ends).
 *
 * @public
 * @async
 * @callback DataProvider
 * @returns {Promise<Array|null>}
 */
