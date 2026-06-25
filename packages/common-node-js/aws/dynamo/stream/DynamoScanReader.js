import * as assert from '@barchart/common-js/lang/assert.js';

import DynamoProvider from './../../DynamoProvider.js';
import Scan from './../query/definitions/Scan.js';

import process from 'process';
import log4js from 'log4js';
import Stream from 'stream';

const logger = log4js.getLogger('common-node/aws/dynamo/stream/DynamoScanReader');

/**
 * A Node.js {@link Stream.Readable} which returns results from a DynamoDB scan.
 *
 * @public
 * @extends {Stream.Readable}
 */
export default class DynamoScanReader extends Stream.Readable {
	#batch;
	#capacityConsumed;
	#discrete;
	#error;
	#previous;
	#provider;
	#readPromise;
	#reading;
	#scan;
	#scanned;
	#started;
	#stopping;

	/**
	 * @param {Scan} scan - The scan.
	 * @param {DynamoProvider} provider - The provider.
	 * @param {number=} highWaterMark - The high water mark.
	 * @param {boolean=} discrete - The discrete.
	 */
	constructor(scan, provider, highWaterMark, discrete) {
		super({ objectMode: true, highWaterMark: highWaterMark || 10 });

		assert.argumentIsRequired(scan, 'scan', Scan, 'Scan');
		assert.argumentIsRequired(provider, 'provider', DynamoProvider, 'DynamoProvider');
		assert.argumentIsOptional(highWaterMark, 'highWaterMark', Number);
		assert.argumentIsOptional(discrete, 'discrete', Boolean);

		this.#scan = scan;
		this.#provider = provider;

		this.#discrete = discrete || false;

		this.#previous = null;
		this.#scanned = 0;
		this.#batch = 0;

		this.#started = false;
		this.#stopping = false;
		this.#reading = false;

		this.#capacityConsumed = 0;

		this.#error = false;

		this.#readPromise = null;
	}

	/**
	 * Returns the number of records scanned (so far).
	 *
	 * @public
	 * @returns {number}
	 */
	get scanned() {
		return this.#scanned;
	}

	/**
	 * Indicates if the {@link DynamoScanReader#stop} function has been
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
	 * Indicates if the scan has run to completion -- without being stopped --
	 * and all possible records have been enqueued.
	 *
	 * @public
	 * @returns {boolean}
	 */
	get completed() {
		 return this.#previous !== null && !this.#previous.startKey;
	}

	/**
	 * Returns the RCU (read capacity units) consumed (so far).
	 *
	 * @public
	 */
	get capacityConsumed() {
		return this.#capacityConsumed;
	}

	/**
	 * Gets the location, in the Dynamo table, at which the next read will
	 * begin. If the stream has not started, or the stream has completed,
	 * a null value is returned.
	 *
	 * @public
	 * @returns {object|null} - An object with one or two properties -- table key names and values (see {@link TableContainer#getPagingKey})
	 */
	get startKey() {
		if (!this.#previous) {
			return null;
		}

		return this.#previous.startKey;
	}

	/**
	 * Sets the location, in the Dynamo table, at which the next read will
	 * begin.
	 *
	 * @public
	 * @param {object} startKey - An object with one or two properties -- table key names and values (see {@link TableContainer#getPagingKey})
	 */
	set startKey(startKey) {
		assert.argumentIsRequired(startKey, 'startKey', Object);

		if (this.#started) {
			throw new Error('Once the stream has started, the start key cannot be set.');
		}

		if (!this.#previous) {
			this.#previous = {};
		}

		this.#previous.startKey = startKey;
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
			logger.debug('Scan stream resumed');
		} else {
			logger.debug('Scan stream started');

			this.#started = true;
		}

		this.#reading = true;

			const scanChunkRecursive = () => {
				if (this.#stopping || this.completed) {
					this.#reading = false;

					if (this.#stopping) {
						logger.debug('Scan stream stopping, stream stopped');
					} else {
						logger.debug('Scan stream stopping, no more results');
					}

					this.push(null);
				} else {
					let startKey;

					if (this.#previous !== null && this.#previous.startKey) {
						startKey = this.#previous.startKey;
					} else {
						startKey = null;
					}

					const currentBatch = this.#batch = this.#batch + 1;

					logger.debug(`Starting batch [ ${currentBatch} ]`);

					this.#readPromise = (async () => {
						try {
							const results = await this.#provider.scanChunk(this.#scan, startKey);

							this.#readPromise = null;

							this.#previous = results;

							if (results.results.length !== 0) {
								this.#scanned = this.#scanned + results.results.length;

								if (results.capacityConsumed) {
									this.#capacityConsumed = this.#capacityConsumed + results.capacityConsumed;
								}

								if (this.#discrete) {
									this.#reading = results.results.reduce((accumulator, item) => {
										return this.push(item);
									}, this.#reading);
								} else {
									this.#reading = this.push(results.results);
								}
							}

							logger.debug(`Completed batch [ ${currentBatch} ]`);

							if (this.#reading) {
								scanChunkRecursive();
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
					})();
				}
			};

		scanChunkRecursive();
	}

	/**
	 * Gracefully interrupts reading. Any current reads will continue and their results
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
		return '[DynamoScanReader]';
	}
}
