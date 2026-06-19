import Container from './../Container.js';
import RelayEndpoint from './RelayEndpoint.js';

export default class RelayContainer extends Container {
	/**
	 * @param {number} port
	 * @param {string} path
	 * @param {boolean=} secure
	 */
	constructor(port, path, secure) {
		super(port, path, secure);
	}

	_getEndpointType() {
		return RelayEndpoint;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[RelayContainer]';
	}
}
