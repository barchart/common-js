const assert = require('./../../lang/assert');

const RestEndpoint = require('./RestEndpoint'),
	RestParser = require('./RestParser');

module.exports = (() => {
	'use strict';

	/**
	 * Executes REST-ful actions.
	 *
	 * @public
	 * @param {String} host - The host name to call
	 * @param {Number=} port - The port
	 * @param {Boolean=} secure - If true, HTTPS is used; otherwise HTTP.
	 * @interface
	 */
	class RestProviderBase {
		constructor(host, port, secure, parser) {
			assert.argumentIsRequired(host, 'host', String);
			assert.argumentIsRequired(port, 'port', Number);
			assert.argumentIsRequired(secure, 'secure', Boolean);
			assert.argumentIsOptional(parser, 'parser', RestParser, 'RestParser');

			this._host = host;
			this._port = port;
			this._secure = secure;
			this._parser = parser || RestParser.DEFAULT;
		}

		/**
		 * Triggers a REST action targetting a {@link RestEndpoint}.
		 *
		 * @public
		 * @param {RestEndpoint} endpoint - The enpoint to call.
		 * @param {object} data - The data to pass to the endpoint.
 		 * @returns {Promise.<TResult>}
		 */
		call(endpoint, data) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(endpoint, endpoint, RestEndpoint, 'RestEndpoint');

					return this._call(endpoint, data, this._host, this._port, this._secure);
				});
		}

		/**
		 * @protected
		 * @abstract
		 * @ignore
		 */
		_call(endpoint, data, host, port, secure) {
			return true;
		}

		toString() {
			return '[RestProviderBase]';
		}
	}

	return RestProviderBase;
})();