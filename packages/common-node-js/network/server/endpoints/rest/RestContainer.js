const Container = require('./../Container'),
	RestEndpoint = require('./RestEndpoint');

module.exports = (() => {
	'use strict';

	class RestContainer extends Container {
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

	return RestContainer;
})();