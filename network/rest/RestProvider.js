const http = require('http'),
	https = require('https'),
	querystring = require('querystring');

const promise = require('./../../lang/promise');

const RestProviderBase = require('./RestProviderBase');

module.exports = (() => {
	'use strict';

	/**
	 * Executes REST-ful action inside a Node.js server.
	 *
	 * @public
	 * @extends {RestProviderBase}
	 */
	class RestProvider extends RestProviderBase {
		constructor(host, port, secure) {
			super(host, port, secure);
		}

		_call(endpoint, data, host, port, secure, token) {
			return promise.build((resolveCallback, rejectCallback) => {
				let connector;

				if (secure) {
					connector = https;
				} else {
					connector = http;
				}

				let action = endpoint.getAction();
				let path = endpoint.getPath(data);
				let payload = endpoint.getPayload(data);

				if (action.getAllowQuerystring() && !endpoint.getSuppressQuerystring()) {
					const qs = querystring.stringify(payload);

					if (qs) {
						path = path + '?' + qs;
					}
				}

				let options = {
					method: action.getHttpVerb(),
					hostname: host,
					path: '/' + path,
					port: port,
					headers: {
						'Content-Type': 'application/json'
					}
				};

				if (token) {
					options.headers['COGNITO-IDENTITY-TOKEN'] = token;
				}

				const request = connector.request(options, (response) => {
					response.setEncoding('utf8');

					let responseText = '';

					response.on('error', (error) => {
						rejectCallback(error);
					});

					response.on('data', (chunk) => {
						responseText = responseText + chunk;
					});

					response.on('end', () => {
						let parsed;
						let error;

						try {
							parsed = endpoint.parseResponse(responseText);
							error = false;
						} catch (e) {
							parsed = null;
							error = true;
						}

						if (error) {
							rejectCallback(new Error('Unable to parse JSON response.'));
						} else {
							resolveCallback(parsed);
						}
					});
				});

				if (action.getAllowBody() && payload) {
					request.write(JSON.stringify(payload));
				}

				request.end();
			});
		}

		toString() {
			return '[RestProvider]';
		}
	}

	return RestProvider;
})();
