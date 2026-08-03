import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';
import * as promise from '@barchart/common-js/lang/promise.js';

import Disposable from '@barchart/common-js/lang/Disposable.js';
import Scheduler from '@barchart/common-js/timing/Scheduler.js';

import log4js from 'log4js';
import querystring from 'querystring';
import http from 'http';
import https from 'https';

const logger = log4js.getLogger('http/HttpProvider');

/**
 * Provides a simple, promise-based mechanism for executing HTTP/HTTPS
 * requests.
 *
 * @public
 * @extends {Disposable}
 * @interface
 */
export default class HttpProvider extends Disposable {
	#counter;
	#scheduler;
	#startPromise;
	#started;

	/**
	 * @param {object} configuration - The configuration.
	 */
	constructor(configuration) {
		super();

		assert.argumentIsOptional(configuration, 'configuration', Object);

		this.#startPromise = null;
		this.#started = false;

		this.#counter = 0;

		this.#scheduler = new Scheduler();
	}

	/**
	 * Initializes the provider. Do not call other functions until
	 * this function is invoked and the resulting promise resolves.
	 *
	 * @public
	 * @async
	 * @returns {Promise}
	 */
	async start() {
		if (this.disposed) {
			throw new Error('The HTTP Provider has been disposed.');
		}

		if (this.#startPromise === null) {
			this.#startPromise = (async () => {
				try {
					logger.info('HTTP Provider started');

					this.#started = true;

					return this.#started;
				} catch (e) {
					logger.error('HTTP Provider failed to start', e);

					throw e;
				}
			})();
		}

		return this.#startPromise;
	}

	/**
	 * Executes an HTTP (or HTTPS) request and returns a promise.
	 *
	 * @public
	 * @async
	 * @param {string} host
	 * @param {string=} path
	 * @param {string=} query
	 * @param {string=} method
	 * @param {boolean=} secure
	 * @param {number=} port
	 * @param {object=} data
	 * @param {object=} headers
	 * @returns {Promise<string>}
	 */
	async callEndpoint(host, path, query, method, secure, port, data, headers) {
		assert.argumentIsRequired(host, 'host', String);
		assert.argumentIsOptional(path, 'path', String);
		assert.argumentIsOptional(query, 'query', String);
		assert.argumentIsOptional(method, 'method', String);
		assert.argumentIsOptional(secure, 'secure', Boolean);
		assert.argumentIsOptional(port, 'port', Number);

		if (this.disposed) {
			throw new Error('The HTTP Provider has been disposed.');
		}

		if (!this.#started) {
			throw new Error('The HTTP Provider has not been started.');
		}

		let connector;

		if (secure) {
			connector = https;
		} else {
			connector = http;
		}

		const pathBuilder = [ ];

		if (path) {
			if (!path.startsWith('/')) {
				pathBuilder.push('/');
			}

			pathBuilder.push(path);
		}

		if (query) {
			pathBuilder.push('?');

			if (is.object(query)) {
				pathBuilder.push(querystring.stringify(query));
			} else if (is.string(query)) {
				pathBuilder.push(querystring.escape(query));
			}
		}

		const options = {
			method: method,
			hostname: host,
			path: pathBuilder.join(''),
			port: port || (secure ? 443 : 80 )
		};

		const headersToUse = Object.assign({ }, headers || { });

		if (!Object.hasOwn(headersToUse, 'Context-Type')) {
			headersToUse['Content-Type'] = 'application/json';
		}

		options.headers = headersToUse;

		const counter = this.#counter = this.#counter + 1;

		logger.info('Beginning HTTP request', counter);

		return this.#scheduler.backoff(() => {
			return promise.build((resolveCallback, rejectCallback) => {
				const request = connector.request(options, (response) => {
					response.setEncoding('utf8');

					let responseText = '';

					response.on('error', (error) => {
						logger.info('HTTP request', counter, 'failed');

						rejectCallback(error);
					});

					response.on('data', (chunk) => {
						responseText = responseText + chunk;
					});

					response.on('end', () => {
						logger.info('HTTP request', counter, 'completed');

						resolveCallback(responseText || 'OK');
					});
				});

				if (data && method !== 'GET') {
					request.write(JSON.stringify(data));
				}

				request.end();

				logger.info('HTTP request', counter, 'in flight');
			});
		}, 100, 'Call HTTP endpoint', 3);
	}

	/**
     * Executes an HTTP (or HTTPS) request and returns a promise.
     *
	 * @public
     * @async
     * @param {string} uri
     * @param {string=} method
     * @param {object=} data
     * @param {object=} headers
     * @returns {Promise<string>}
     */
	async callEndpointUri(uri, method, data, headers) {
		assert.argumentIsRequired(uri, 'uri', String);
		assert.argumentIsRequired(method, 'method', String);

		const components = parseUri(uri);

		if (is.nil(components)) {
			throw new Error('Unable to call HTTP endpoint, the URI is invalid.');
		}

		let port = components[4] || null;

		if (port) {
			port = parseInt(port);
		}

		return this.callEndpoint(components[2], components[5], components[7], method, components[1].toLowerCase() === 'https', port, data, headers);
	}

	/**
	 * @protected
	 * @override
	 */
	_onDispose() {
		this.#scheduler.dispose();

		logger.debug('HTTP Provider disposed');
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[HttpProvider]';
	}
}

const uriRegex = /^(http|https):\/\/([^\/\:]*)(\:([0-9]*))?([^?]*)?(\?(.*))?/i;

function parseUri(uri) {
	return uri.match(uriRegex);
}
