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
	 */
	class RestProvider extends RestProviderBase {
		constructor(host, port, secure) {
			super(host, port, secure);
		}

		_call(endpoint, data, host, port, secure) {
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

				if (action.getUseQuerystring()) {
					const qs = querystring.stringify(payload);

					if (qs) {
						path = path + '?' + qs;
					}
				}

				const options = {
					method: action.getHttpVerb(),
					hostname: host,
					path: '/' + path,
					port: port,
					headers: {
						'Content-Type': 'application/json'
					}
				};

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
						resolveCallback(JSON.parse(responseText));
					});
				});

				if (!action.getUseQuerystring() && payload) {
					request.write(JSON.stringify(payload));
				}

				request.end();
			});
		}
	}

	return RestProvider;
})();