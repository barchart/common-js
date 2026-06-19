import Container from './../../Container.js';
import SocketEmitterEndpoint from './SocketEmitterEndpoint.js';

export default class SocketEmitterContainer extends Container {
	/**
	 * @param {number} port
	 * @param {string} path
	 * @param {boolean=} secure
	 */
	constructor(port, path, secure) {
		super(port, path, secure);
	}

	_getEndpointType() {
		return SocketEmitterEndpoint;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[SocketEmitterContainer]';
	}
}
