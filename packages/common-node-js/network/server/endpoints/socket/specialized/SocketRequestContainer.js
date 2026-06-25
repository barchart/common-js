import Container from './../../Container.js';
import SocketRequestEndpoint from './SocketRequestEndpoint.js';

/**
 * Stores socket request configuration.
 *
 * @public
 */
export default class SocketRequestContainer extends Container {
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
		return SocketRequestEndpoint;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[SocketRequestContainer]';
	}
}
