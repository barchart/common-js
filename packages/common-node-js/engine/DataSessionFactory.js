const log4js = require('log4js');

const assert = require('@barchart/common-js/lang/assert'),
	is = require('@barchart/common-js/lang/is');

const FailureReason = require('@barchart/common-js/api/failures/FailureReason');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('common-node/engine/DataSessionFactory');

	/**
	 * A factory for creating {@link DataSession} instances.
	 *
	 * @public
	 */
	class DataSessionFactory {
		constructor() {
			this._started = false;
			this._startPromise = null;
		}

		async start() {
			if (this._startPromise === null) {
				this._startPromise = Promise.resolve()
					.then(() => {
						return this._start();
					}).then(() => {
						this._started = true;

						return this._started;
					});
			}

			return this._startPromise;
		}

		_start() {
			return;
		}

		/**
		 * Returns a new {@link DataSession} to the callback and processes
		 * it synchronously. The result of the session is returned via a
		 * promise.
		 *
		 * @public
		 * @async
		 * @param {DataSessionFactory~dataSessionCallback} callback - Provides the {@link DataSession}
		 * @param {Object=} options
		 * @returns {Promise}
		 */
		async startSession(callback, options) {
			return Promise.resolve()
				.then(() => {
					if (!this._started) {
						throw new Error('Unable to create session, the data session factory must be started.');
					}

					assert.argumentIsRequired(callback, 'callback', Function);

					return this._getSession();
				}).catch((e) => {
					logger.error('Session creation failed', e);

					return null;
				}).then((pendingSession) => {
					let completedSession;

					try {
						callback(pendingSession);

						completedSession = pendingSession;
					} catch(e) {
						logger.error('Session construction failed', e);

						completedSession = null;
					}

					return completedSession;
				}).then((session) => {
					let flushPromise;

					if (session) {
						flushPromise = this.getDataProvider(options)
							.then((dataProvider) => {
								return session.flush(dataProvider);
							});
					} else {
						flushPromise = Promise.resolve();
					}

					return flushPromise;
				}).catch((e) => {
					let errorPromise;

					if (is.object(options) && is.fn(options.handleError)) {
						errorPromise = Promise.resolve()
							.then(() => {
								try {
									return options.handleError(e, logger);
								} catch (e2) {
									logger.error('User-defined error handler threw an error', e2);

									return handleError(e);
								}
							});
					} else {
						errorPromise = handleError(e);
					}

					return errorPromise;
				});
		}

		/**
		 * Overridden in inheriting classes, allowing customization of the
		 * {@link DataSession} generated.
		 *
		 * @protected
		 * @returns {Promise<DataSession>|DataSession}
		 */
		_getSession() {
			return null;
		}

		/**
		 * Returns a {@link DataProvider} for use by a {@link DataSession}.
		 *
		 * @public
		 * @async
		 * @param {Object} options
		 * @return {Promise}
		 */
		async getDataProvider(options) {
			return Promise.resolve()
				.then(() => {
					if (!this._started) {
						throw new Error('Unable to create session, the data session factory must be started.');
					}

					return this._getDataProvider(options);
				});
		}

		/**
		 * Overridden in inheriting classes, allowing customization of the
		 * {@link DataProvider} used when flushing a {@link DataSession}.
		 *
		 * @protected
		 * @param {Object} options
		 * @returns {Promise<DataProvider>|DataProvider}
		 */
		_getDataProvider(options) {
			return null;
		}

		toString() {
			return '[DataSessionFactory]';
		}
	}

	function handleError(e) {
		if (e instanceof FailureReason) {
			try {
				if (e.getIsSevere()) {
					logger.error('Session flush failed', e.format());
				} else {
					logger.warn('Session flush failed', e.format());
				}
			} catch (ignored) {

			}
		} else {
			logger.error('Session flush failed', e);
		}

		return Promise.reject(e);
	}

	/**
	 * A callback used to return a {@link DataSession}.
	 *
	 * @public
	 * @callback DataSessionFactory~dataSessionCallback
	 * @param {DataSession} dataSession
	 */

	return DataSessionFactory;
})();
