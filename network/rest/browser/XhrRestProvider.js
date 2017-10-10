const xhr = require('xhr');

const is = require('./../../../lang/is'),
	promise = require('./../../../lang/promise');

const RestProviderBase = require('./../RestProviderBase');

module.exports = (() => {
	'use strict';

	/**
	 * Executes REST-ful actions the "xhr" module. Intended for browser use.
	 *
	 * @public
	 * @extends {RestProviderBase}
	 */
	class XhrRestProvider extends RestProviderBase {
		constructor(baseUrl, port, secure) {
			super(baseUrl, port, secure);
		}

		_call(endpoint, data, host, port, secure, token) {
			return promise.build((resolveCallback, rejectCallback) => {
				const action = endpoint.getAction();

				const options = {
					url: endpoint.getUrl(data, host, port, secure),
					method: action.getHttpVerb(),
					headers: {
						'Content-Type': 'application/json'
					}
				};

				if (token) {
					options.headers['COGNITO-IDENTITY-TOKEN'] = token;
				}

				if (action.getAllowBody() || (action.getAllowQuerystring() && !endpoint.getSuppressQuerystring())) {
					options.body = JSON.stringify(endpoint.getPayload(data));
				}

				xhr(options, (error, response, body) => {
					if (error) {
						rejectCallback(error);
					} else if (response.statusCode !== 200) {
						let message;

						if (is.object(body) && is.string(body.message)) {
							message = body.message;
						} else {
							message = 'The server returned an HTTP ' + response.statusCode + ' error.';
						}

						rejectCallback(new Error(message));
					} else {
						let parsed;
						let error;

						try {
							parsed = endpoint.parseResponse(body);
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
					}
				});
			});
		}

		toString() {
			return '[XhrRestProvider]';
		}
	}

	return XhrRestProvider;
})();
