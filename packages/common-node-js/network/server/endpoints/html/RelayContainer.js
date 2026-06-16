import Container from './../Container.js';
import RelayEndpoint from './RelayEndpoint.js';

export default class RelayContainer extends Container {
	constructor(port, path, secure) {
		super(port, path, secure);
	}

	_getEndpointType() {
		return RelayEndpoint;
	}

	toString() {
		return '[RelayContainer]';
	}
}
