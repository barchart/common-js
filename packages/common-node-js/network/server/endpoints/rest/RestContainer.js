import Container from './../Container.js';
import RestEndpoint from './RestEndpoint.js';

export default class RestContainer extends Container {
	constructor(port, path, secure) {
		super(port, path, secure);
	}

	_getEndpointType() {
		return RestEndpoint;
	}

	toString() {
		return '[RestContainer]';
	}
}
