import Container from './../../Container.js';
import SocketSubscriptionEndpoint from './SocketSubscriptionEndpoint.js';

/**
 * Stores socket subscription configuration.
 *
 * @public
 */
export default class SocketSubscriptionContainer extends Container {
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
		return SocketSubscriptionEndpoint;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[SocketSubscriptionContainer]';
	}
}
