const assert = require('./../../lang/assert'),
	attributes = require('./../../lang/attributes'),
	is = require('./../../lang/is');

const RestAction = require('./RestAction');

module.exports = (() => {
	'use strict';

	/**
	 * Defines a REST-ful endpoint and allows construction of valid
	 * URI that can be used to call the endpoint.
	 *
	 * @public
	 */
	class RestEndpoint {
		/**
		 *
		 * @param {RestAction} action - The action supported by the endpoint
		 * @param {Array<String>} pathProperties - The parameters required by the endpoint
		 * @param {String=} payloadProperty - The property name of the object to use as a payload for the REST action
		 */
		constructor(action, pathProperties, payloadProperty) {
			assert.argumentIsRequired(action, 'action', RestAction, 'RestAction');
			assert.argumentIsArray(pathProperties, 'pathProperties', String);
			assert.argumentIsOptional(payloadProperty, 'payloadProperty', String);

			this._action = action;

			this._pathProperties = pathProperties;
			this._payloadProperty = payloadProperty || null;
		}

		/**
		 * The {@link RestAction} the endpoint supports.
		 *
		 * @public
		 * @returns {RestAction}
		 */
		getAction() {
			return this._action;
		}

		/**
		 * Constructs the URI used to trigger the REST action.
		 *
		 * @public
		 * @param {Object} data - The data which will be passed to the endpoint
		 * @param {String} host - The host name to call
		 * @param {Number=} port - The port
		 * @param {Boolean=} secure - If true, HTTPS is used; otherwise HTTP.
		 * @returns {*}
		 */
		getUrl(data, host, port, secure) {
			assert.argumentIsOptional(host, 'host', String);
			assert.argumentIsOptional(port, 'port', Number);
			assert.argumentIsOptional(secure, 'secure', Boolean);

			const path = this.getPath(data, true);

			if (this.getAction().getQueryIsRequired() && path.length === 0) {
				throw new Error('Unable to generate REST query path.');
			}

			let returnRef;

			if (host.length !== 0) {
				let url;

				if (secure) {
					url = 'https://';
				} else {
					url = 'http://';
				}

				url = url + host;

				if (is.number(port) && port !== 80) {
					url = url + ':' + port;
				}

				returnRef = encodeURI(url + '/' + path);
			}

			return returnRef;
		}

		getPath(data, skipEncoding) {
			const path = this._pathProperties.map((pathProperty) => {
				let pathItem;

				if (attributes.has(data || {}, pathProperty)) {
					pathItem = attributes.read(data, pathProperty);
				} else {
					pathItem = pathProperty;
				}

				if (!skipEncoding) {
					pathItem = encodeURIComponent(pathItem);
				}

				return pathItem;
			});

			return path.join('/');
		}

		getPayload(data) {
			let returnRef;

			if (this._payloadProperty !== null) {
				returnRef = attributes.read(data, this._payloadProperty);
			} else {
				returnRef = data;
			}

			if (this.getAction().getPayloadIsRequired() && !is.object(returnRef)) {
				throw new Error('Unable to generate REST payload.');
			}

			return returnRef;
		}
	}

	return RestEndpoint;
})();