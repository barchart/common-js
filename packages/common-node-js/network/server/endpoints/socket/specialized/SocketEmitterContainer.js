import Container from './../../Container.js';
import SocketEmitterEndpoint from './SocketEmitterEndpoint.js';

export default class SocketEmitterContainer extends Container {
	constructor(port, path, secure) {
		super(port, path, secure);
	}

	_getEndpointType() {
		return SocketEmitterEndpoint;
	}

	toString() {
		return '[SocketEmitterContainer]';
	}
}
