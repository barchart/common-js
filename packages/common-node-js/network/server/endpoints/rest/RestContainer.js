import Container from './../Container.js';
import RestEndpoint from './RestEndpoint.js';

export default class RestContainer extends Container {
	/**
	 * @param {number} port
	 * @param {string} path
	 * @param {boolean=} secure
	 */
	constructor(port, path, secure) {
		super(port, path, secure);
	}

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
