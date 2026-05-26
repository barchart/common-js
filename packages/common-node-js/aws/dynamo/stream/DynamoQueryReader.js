const process = require('process');

const log4js = require('log4js'),
	Stream = require('stream');

const assert = require('@barchart/common-js/lang/assert');

const DynamoProvider = require('./../../DynamoProvider'),
	Query = require('./../query/definitions/Query');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('common-node/aws/dynamo/stream/DynamoQueryReader');

	/**
	 * A Node.js {@link Stream.Readable} which returns results from a DynamoDB query.
	 *
	 * @public
	 * @extends {Stream.Readable}
	 * @param {Query} query
	 * @param {DynamoProvider} provider
	 * @param {Number=} highWaterMark
	 * @param {Boolean=} discrete
	 */
	class DynamoQueryReader extends Stream.Readable {
		constructor(query, provider, highWaterMark, discrete) {
			super({ objectMode: true, highWaterMark: 10 });

			assert.argumentIsRequired(query, 'query', Query, 'Query');
			assert.argumentIsRequired(provider, 'provider', DynamoProvider, 'DynamoProvider');

			this._query = query;
			this._provider = provider;

			this._discrete = discrete || false;

			this._previous = null;
			this._queried = 0;
			this._batch = 0;

			this._started = false;
			this._stopping = false;
			this._reading = false;

			this._capacityConsumed = 0;

			this._error = false;

			this._readPromise = null;
		}

		/**
		 * Returns the number of records queried (so far).
		 *
		 * @public
		 * @returns {Number}
		 */
		get queried() {
			return this._queried;
		}

		/**
		 * Indicates if the {@link DynamoScanReader#stop} function has been
		 * invoked. If true, the stream has stopped producing data or will
		 * stop producing data soon.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get stopping() {
			return this._stopping;
		}

		/**
		 * Indicates if the query has run to completion -- without being stopped --
		 * and all possible records have been enqueued.
		 *
		 * @public
		 * @return {Boolean}
		 */
		get completed() {
			return this._previous !== null && !this._previous.startKey;
		}

		/**
		 * Returns the RCU (read capacity units) consumed (so far).
		 */
		get capacityConsumed() {
			return this._capacityConsumed;
		}

		/**
		 * Gets the location, in the Dynamo table, at which the next read will
		 * begin. If the stream has not started, or the stream has completed,
		 * a null value is returned.
		 *
		 * @public
		 * @returns {Object|null} - An object with one or two properties -- table key names and values (see {@link TableContainer#getPagingKey})
		 */
		get startKey() {
			if (!this._previous || !this._previous.startKey) {
				return null;
			}

			return this._previous.startKey;
		}

		/**
		 * Sets the location, in the Dynamo table, at which the next read will
		 * begin.
		 *
		 * @public
		 * @param {Object} startKey - An object with one or two properties -- table key names and values (see {@link TableContainer#getPagingKey})
		 */
		set startKey(startKey) {
			assert.argumentIsRequired(startKey, 'startKey', Object);

			if (this._started) {
				throw new Error('Once the stream has started, the start key cannot be set.');
			}

			if (!this._previous) {
				this._previous = {};
			}

			this._previous.startKey = startKey;
		}

		_read(size) {
			if (this._reading) {
				return;
			}

			if (this._error) {
				logger.error('Unable to continue reading, an error was encountered.');
				return;
			}

			if (this._started) {
				logger.debug('Query stream resumed');
			} else {
				logger.debug('Query stream started');

				this._started = true;
			}

			this._reading = true;

			const queryChunkRecursive = () => {
				if (this._stopping || this.completed) {
					this._reading = false;

					if (this._stopping) {
						logger.debug('Query stream stopping, stream stopped');
					} else {
						logger.debug('Query stream stopping, no more results');
					}

					this.push(null);
				} else {
					let startKey;

					if (this._previous !== null && this._previous.startKey) {
						startKey = this._previous.startKey;
					} else {
						startKey = null;
					}

					const currentBatch = this._batch = this._batch + 1;

					logger.debug(`Starting batch [ ${currentBatch} ]`);

					this._readPromise = this._provider.queryChunk(this._query, startKey)
						.then((results) => {
							this._readPromise = null;

							this._previous = results;

							if (results.results.length !== 0) {
								this._queried = this._queried + results.results.length;

								if (results.capacityConsumed) {
									this._capacityConsumed = this._capacityConsumed + results.capacityConsumed;
								}

								if (this._discrete) {
									this._reading = results.results.reduce((accumulator, item) => {
										return this.push(item);
									}, this._reading);
								} else {
									this._reading = this.push(results.results);
								}
							}

							logger.debug(`Completed batch [ ${currentBatch} ]`);

							if (this._reading) {
								queryChunkRecursive();
							} else {
								logger.debug('Query stream paused');
							}
						}).catch((e) => {
							this._readPromise = null;

							this._reading = false;
							this._error = true;

							this.push(null);

							logger.error('Query stopping, error encountered', e);

							process.nextTick(() => this.emit('error', e));
						});
				}
			};

			queryChunkRecursive();
		}

		/**
		 * Gracefully interrupts reading. Any current reads will continue and their results
		 * will be placed onto the queue. However, once any reads, that are in progress complete,
		 * no further reading will occur and the stream will end normally. Once reading has actually
		 * stopped, and no more data will be produced, the returned promise resolves.
		 *
		 * @public
		 * @return {Promise<Object|null>}
		 */
		stop() {
			this._stopping = true;

			let readPromise;

			if (this._readPromise === null) {
				readPromise = Promise.resolve();
			} else {
				readPromise = this._readPromise;
			}

			return readPromise.then(() => {
				return this.startKey;
			});
		}

		toString() {
			return '[DynamoQueryReader]';
		}
	}

	return DynamoQueryReader;
})();