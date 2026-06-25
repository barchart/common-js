import Container from './../../Container.js';
import SocketEmitterEndpoint from './SocketEmitterEndpoint.js';

/**
 * Stores socket emitter configuration.
 *
 * @public
 */
export default class SocketEmitterContainer extends Container {
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
