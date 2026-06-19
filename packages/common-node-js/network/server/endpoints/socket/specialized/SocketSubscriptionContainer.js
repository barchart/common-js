import Container from './../../Container.js';
import SocketSubscriptionEndpoint from './SocketSubscriptionEndpoint.js';

export default class SocketSubscriptionContainer extends Container {
	/**
	 * @param {number} port
	 * @param {string} path
	 * @param {boolean=} secure
	 */
	constructor(port, path, secure) {
		super(port, path, secure);
	}

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
