import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';

import FailureReason from '@barchart/common-js/api/failures/FailureReason.js';

import log4js from 'log4js';

/**
 * @typedef {import('./DataSession.js').default} DataSession
 */

/**
 * @typedef {import('./DataProvider.js').default} DataProvider
 */

const logger = log4js.getLogger('common-node/engine/DataSessionFactory');

/**
 * A factory for creating {@link DataSession} instances.
 *
 * @public
 */
export default class DataSessionFactory {
	#startPromise;
	#started;

	constructor() {
		this.#started = false;
		this.#startPromise = null;
	}

	/**
	 * Starts the component.
	 *
	 * @public
	 * @returns {Promise<*>}
	 */
	async start() {
		if (this.#startPromise === null) {
			this.#startPromise = Promise.resolve()
				.then(() => {
					return this._start();
				}).then(() => {
					this.#started = true;

					return this.#started;
				});
		}

		return this.#startPromise;
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
	 * @param {DataSessionCallback} callback - Provides the {@link DataSession}
	 * @param {object=} options
	 * @returns {Promise}
	 */
	async startSession(callback, options) {
		return Promise.resolve()
			.then(() => {
				if (!this.#started) {
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
	 * @param {object} options
	 * @return {Promise}
	 */
	async getDataProvider(options) {
		return Promise.resolve()
			.then(() => {
				if (!this.#started) {
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
	 * @param {object} options
	 * @returns {Promise<DataProvider>|DataProvider}
	 */
	_getDataProvider(options) {
		return null;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
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
 * @callback DataSessionCallback
 * @param {DataSession} dataSession
 */
