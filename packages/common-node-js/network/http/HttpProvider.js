const log4js = require('log4js'),
	querystring = require('querystring');

const assert = require('@barchart/common-js/lang/assert'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
	is = require('@barchart/common-js/lang/is'),
	promise = require('@barchart/common-js/lang/promise'),
	Scheduler = require('@barchart/common-js/timing/Scheduler');

const http = require('http'),
	https = require('https');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('http/HttpProvider');

	/**
	 * Provides a simple, promise-based mechanism for executing HTTP/HTTPS
	 * requests.
	 *
	 * @public
	 * @extends {Disposable}
	 * @interface
	 */
	class HttpProvider extends Disposable {
		constructor(configuration) {
			super();

			this._configuration = configuration;

			this._startPromise = null;
			this._started = false;

			this._counter = 0;

			this._scheduler = new Scheduler();
		}

		/**
		 * Initializes the provider. Do not call other functions until
		 * this function is invoked and the resulting promise resolves.
		 *
		 * @returns {Promise}
		 */
		start() {
			return Promise.resolve()
				.then(() => {
					if (this.disposed) {
						throw new Error('The HTTP Provider has been disposed.');
					}

					if (this._startPromise === null) {
						this._startPromise = Promise.resolve()
						.then(() => {
							logger.info('HTTP Provider started');

							this._started = true;

							return this._started;
						}).catch((e) => {
							logger.error('HTTP Provider failed to start', e);

							throw e;
						});
					}

					return this._startPromise;
				});
		}

		/**
		 * Executes an HTTP (or HTTPS) request and returns a promise.
		 *
		 * @param {String} host
		 * @param {String=} path
		 * @param {String=} query
		 * @param {String=} method
		 * @param {Boolean=} secure
		 * @param {Number=} port
		 * @param {Object=} data
		 * @param {Object=} headers
		 * @returns {Promise<String>}
		 */
		callEndpoint(host, path, query, method, secure, port, data, headers) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(host, 'host', String);
					assert.argumentIsOptional(path, 'path', String);
					assert.argumentIsOptional(query, 'query', String);
					assert.argumentIsOptional(method, 'method', String);
					assert.argumentIsOptional(secure, 'secure', Boolean);
					assert.argumentIsOptional(port, 'port', Number);

					if (this.disposed) {
						throw new Error('The HTTP Provider has been disposed.');
					}

					if (!this._started) {
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

					if (!headersToUse.hasOwnProperty('Context-Type')) {
						headersToUse['Content-Type'] = 'application/json';
					}

					options.headers = headersToUse;

					const counter = this._counter = this._counter + 1;

					logger.info('Beginning HTTP request', counter);

					return this._scheduler.backoff(() => {
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
				});
		}

		/**
		 * Executes an HTTP (or HTTPS) request and returns a promise.
		 *
		 * @param {String} uri
		 * @param {String=} method
		 * @param {Object=} data
		 * @returns {Promise<String>}
		 */
		callEndpointUri(uri, method, data, headers) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(uri, 'uri', String);
					assert.argumentIsRequired(method, 'method', String);

					const components = parseUri(uri);

					if (is.null(components)) {
						throw new Error('Unable to call HTTP endpoint, the URI is invalid.');
					}

					let port = components[4] || null;

					if (port) {
						port = parseInt(port);
					}

					return this.callEndpoint(components[2], components[5], components[7], method, components[1].toLowerCase() === 'https', port, data, headers);
				});
		}

		_onDispose() {
			this._scheduler.dispose();

			logger.debug('HTTP Provider disposed');
		}

		toString() {
			return '[HttpProvider]';
		}
	}

	const uriRegex = /^(http|https):\/\/([^\/\:]*)(\:([0-9]*))?([^?]*)?(\?(.*))?/i;

	function parseUri(uri) {
		return uri.match(uriRegex);
	}

	return HttpProvider;
})();