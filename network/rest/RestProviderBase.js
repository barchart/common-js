const assert = require('./../../lang/assert');

const RestEndpoint = require('./RestEndpoint');

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
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(endpoint, endpoint, RestEndpoint, 'RestEndpoint');

					return this._call(endpoint, data, this._host, this._port, this._secure);
				});
		}

		_call(endpoint, data, host, port, secure) {
			return true;
		}
	}

	return RestProviderBase;
})();