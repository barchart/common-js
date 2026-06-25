import Container from './../Container.js';
import RelayEndpoint from './RelayEndpoint.js';

/**
 * Stores relay configuration.
 *
 * @public
 */
export default class RelayContainer extends Container {
	/**
	 * @param {number} port - The port.
	 * @param {string} path - The path.
	 * @param {boolean=} secure - The secure.
	 */
	constructor(port, path, secure) {
		super(port, path, secure);
	}

	/**
	 * Returns the endpoint type.
	 *
	 * @protected
	 * @returns {*}
	 */
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
