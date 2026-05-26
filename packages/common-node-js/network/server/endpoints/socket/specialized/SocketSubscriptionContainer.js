const Container = require('./../../Container'),
	SocketSubscriptionEndpoint = require('./SocketSubscriptionEndpoint');

module.exports = (() => {
	'use strict';

	class SocketSubscriptionContainer extends Container {
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

	return SocketSubscriptionContainer;
})();