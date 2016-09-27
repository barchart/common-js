var xhr = require('xhr');

var assert = require('./../../../lang/is');

var RestProviderBase = require('./../RestProviderBase');

module.exports = (() => {
	'use strict';

	class XhrRestProvider extends RestProviderBase {
		constructor(baseUrl, port, secure) {
			super(baseUrl, port, secure);
		}

		_call(endpoint, data, host, port, secure) {
			return new Promise((resolveCallback, rejectCallback) => {
				const options = {
					url: endpoint.getUrl(data, host, port, secure),
					method: endpoint.getAction().getHttpVerb(),
					json: endpoint.getPayload(data)
				};

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
						resolveCallback(body);
					}
				});
			});
		}
	}

	return XhrRestProvider;
})();