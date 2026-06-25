import Container from './../Container.js';
import RestEndpoint from './RestEndpoint.js';

/**
 * Stores rest configuration.
 *
 * @public
 */
export default class RestContainer extends Container {
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
		return RestEndpoint;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[RestContainer]';
	}
}
