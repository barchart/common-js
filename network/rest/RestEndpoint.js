var assert = require('./../../lang/assert');
var attributes = require('./../../lang/attributes');

var RestAction = require('./RestAction');

module.exports = (() => {
	'use strict';

	class RestEndpoint {
		constructor(action, pathProperties, payloadProperty) {
			assert.argumentIsRequired(action, 'action', RestAction, 'RestAction');
			assert.argumentIsArray(pathProperties, 'pathProperties', String);
			assert.argumentIsOptional(payloadProperty, 'payloadProperty', String);

			this._action = action;

			this._pathProperties = pathProperties;
			this._payloadProperty = payloadProperty || null;
		}

		getAction() {
			return this._action;
		}

		getUrl(data, host, port, secure) {
			assert.argumentIsOptional(host, 'host', String);
			assert.argumentIsOptional(port, 'port', Number);
			assert.argumentIsOptional(secure, 'secure', Boolean);

			const path = this.getPath(data);

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

				if (typeof(port) === 'number' && port !== 80) {
					url = url + ':' + port;
				}

				returnRef = encodeURI(url + '/' + path);
			}

			return returnRef;
		}

		getPath(data) {
			const path = this._pathProperties.map((pathProperty) => {
				let pathItem;

				if (attributes.has(data || {}, pathProperty)) {
					pathItem = attributes.read(data, pathProperty);
				} else {
					pathItem = pathProperty;
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

			if (this.getAction().getPayloadIsRequired() && !_.isObject(returnRef)) {
				throw new Error('Unable to generate REST payload.');
			}

			return returnRef;
		}
	}

	return RestEndpoint;
})();