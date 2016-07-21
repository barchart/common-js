var assert = require('./../../lang/assert');

var RestEndpoint = require('./RestEndpoint');

module.exports = (() => {
	'use strict';

	class RestProviderBase {
		constructor(host, port, secure) {
			assert.argumentIsRequired(host, 'host', String);
			assert.argumentIsRequired(port, 'port', Number);
			assert.argumentIsRequired(secure, 'secure', Boolean);

			this._host = host;
			this._port = port;
			this._secure = secure;
		}

		call(endpoint, data) {
			assert.argumentIsRequired(endpoint, endpoint, RestEndpoint, 'RestEndpoint');

			return Promise.resolve()
				.then(() => {
					return this._call(endpoint, data, this._host, this._port, this._secure);
				});
		}

		_call(endpoint, data, host, port, secure) {
			return true;
		}
	}

	return RestProviderBase;
})();