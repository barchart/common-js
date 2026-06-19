import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';

/**
 * @typedef {import('./Endpoint.js').default} Endpoint
 */

export default class Container {
	#endpoints;
	#path;
	#port;
	#secure;

	/**
	 * @param {number} port
	 * @param {string} path
	 * @param {boolean=} secure
	 */
	constructor(port, path, secure) {
		assert.argumentIsOptional(port, 'port', Number);
		assert.argumentIsOptional(path, 'path', String);
		assert.argumentIsOptional(secure, 'secure', Boolean);

		this.#port = getEffectivePort(port);
		this.#path = path || null;
		this.#secure = secure || false;

		this.#endpoints = [];
	}

	/**
	 * Runs the add endpoint operation.
	 *
	 * @public
	 * @param {Endpoint} endpoint
	 */
	addEndpoint(endpoint) {
		assert.argumentIsRequired(endpoint, 'endpoint', this.getEndpointType(), this._getEndpointType().toString());

		this.#endpoints.push(endpoint);

		return this;
	}

	/**
	 * Returns the endpoints.
	 *
	 * @public
	 * @returns {Array}
	 */
	getEndpoints() {
		return this.#endpoints;
	}

	/**
	 * Returns the endpoint type.
	 *
	 * @public
	 * @returns {*}
	 */
	getEndpointType() {
		return this._getEndpointType();
	}

	_getEndpointType() {
		return null;
	}

	/**
	 * Returns the port.
	 *
	 * @public
	 * @returns {number}
	 */
	getPort() {
		return this.#port;
	}

	/**
	 * Returns the path.
	 *
	 * @public
	 * @returns {string}
	 */
	getPath() {
		return this.#path;
	}

	/**
	 * Returns the is secure.
	 *
	 * @public
	 * @returns {boolean}
	 */
	getIsSecure() {
		return this.#secure;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
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
