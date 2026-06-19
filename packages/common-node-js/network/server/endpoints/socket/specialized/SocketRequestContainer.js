import Container from './../../Container.js';
import SocketRequestEndpoint from './SocketRequestEndpoint.js';

export default class SocketRequestContainer extends Container {
	/**
	 * @param {number} port
	 * @param {string} path
	 * @param {boolean=} secure
	 */
	constructor(port, path, secure) {
		super(port, path, secure);
	}

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
