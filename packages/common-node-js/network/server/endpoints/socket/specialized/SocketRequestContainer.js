import Container from './../../Container.js';
import SocketRequestEndpoint from './SocketRequestEndpoint.js';

export default class SocketRequestContainer extends Container {
	constructor(port, path, secure) {
		super(port, path, secure);
	}

	_getEndpointType() {
		return SocketRequestEndpoint;
	}

	toString() {
		return '[SocketRequestContainer]';
	}
}
