import Container from './../../Container.js';
import SocketSubscriptionEndpoint from './SocketSubscriptionEndpoint.js';

export default class SocketSubscriptionContainer extends Container {
	constructor(port, path, secure) {
		super(port, path, secure);
	}

	_getEndpointType() {
		return SocketSubscriptionEndpoint;
	}

	toString() {
		return '[SocketSubscriptionContainer]';
	}
}
