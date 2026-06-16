import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';

export default class Container {
	constructor(port, path, secure) {
		assert.argumentIsOptional(port, 'port', Number);
		assert.argumentIsOptional(path, 'path', String);
		assert.argumentIsOptional(secure, 'secure', Boolean);

		this._port = getEffectivePort(port);
		this._path = path || null;
		this._secure = secure || false;

		this._endpoints = [];
	}

	addEndpoint(endpoint) {
		assert.argumentIsRequired(endpoint, 'endpoint', this.getEndpointType(), this._getEndpointType().toString());

		this._endpoints.push(endpoint);

		return this;
	}

	getEndpoints() {
		return this._endpoints;
	}

	getEndpointType() {
		return this._getEndpointType();
	}

	_getEndpointType() {
		return null;
	}

	getPort() {
		return this._port;
	}

	getPath() {
		return this._path;
	}

	getIsSecure() {
		return this._secure;
	}

	toString() {
		return '[Container]';
	}
}

function getEffectivePort(port) {
	let returnVal;

	if (is.number(port)) {
		returnVal = port;
	} else {
		returnVal = parseInt(process.env.PORT);

		if (!is.number(returnVal)) {
			returnVal = 80;
		}
	}

	return returnVal;
}
