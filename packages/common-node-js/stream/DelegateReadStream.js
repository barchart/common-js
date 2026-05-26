const process = require('process');

const log4js = require('log4js'),
	Stream = require('stream');

const assert = require('@barchart/common-js/lang/assert');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('common-node/aws/dynamo/stream/DelegateReadStream');

	/**
	 * 	A Node.js {@link Stream.Readable} that defers data generation to
	 * 	an external delegate.
	 *
	 * @public
	 * @extends {Stream.Readable}
	 * @param {DelegateReadStream~dataProvider} delegate
	 * @param {Number=} highWaterMark
	 * @param {Boolean=} discrete
	 */
	class DelegateReadStream extends Stream.Readable {
		constructor(delegate, highWaterMark, discrete) {
			super({ objectMode: true, highWaterMark: highWaterMark || 10 });

			assert.argumentIsRequired(delegate, 'delegate', Function);
			assert.argumentIsOptional(highWaterMark, 'highWaterMark', Number);
			assert.argumentIsOptional(discrete, 'discrete', Boolean);
			
			this._delegate = delegate;

			this._discrete = discrete || false;
			
			this._scanned = 0;
			this._batch = 0;

			this._started = false;
			this._stopping = false;
			this._reading = false;
			this._completed = false;

			this._error = false;

			this._readPromise = null;
		}

		/**
		 * Returns the number of items generated (so far).
		 *
		 * @public
		 * @returns {Number}
		 */
		get scanned() {
			return this._scanned;
		}

		/**
		 * Indicates if the {@link DelegateReadStream#stop} function has been
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
		 * Indicates if the reader has run to completion -- without being stopped --
		 * and all possible items have been enqueued.
		 *
		 * @public
		 * @return {Boolean}
		 */
		get completed() {
			return this._completed;
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
				logger.debug('Delegate stream resumed');
			} else {
				logger.debug('Delegate stream started');

				this._started = true;
			}

			this._reading = true;

			const generateChunkRecursive = async () => {
				if (this._stopping || this.completed) {
					this._reading = false;

					if (this._stopping) {
						logger.debug('Scan stream stopping, stream stopped');
					} else {
						logger.debug('Scan stream stopping, no more items');
					}

					this.push(null);
					
					return;
				}

				const currentBatch = this._batch = this._batch + 1;

				logger.debug(`Starting batch [ ${currentBatch} ]`);
				
				try {
					const items = await this._delegate();

					if (items === null) {
						this._completed = true;
					}
					
					if (items !== null && items.length !== 0) {
						this._scanned = this._scanned + items.length;

						if (this._discrete) {
							this._reading = items.reduce((accumulator, item) => {
								return this.push(item);
							}, this._reading);
						} else {
							this._reading = this.push(items);
						}
					}

					logger.debug(`Completed batch [ ${currentBatch} ]`);

					if (this._reading) {
						generateChunkRecursive();
					} else {
						logger.debug('Scan stream paused');
					}
				} catch (e) {
					this._readPromise = null;

					this._reading = false;
					this._error = true;

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
			return '[DelegateReadStream]';
		}
	}

	/**
	 * A callback that provides data for the stream. When the callback returns
	 * a null value, the no more data is available (and the stream ends).
	 *
	 * @public
	 * @async
	 * @callback DelegateReadStream~dataProvider
	 * @returns {Promise<Array|null>}
	 */

	return DelegateReadStream;
})();
