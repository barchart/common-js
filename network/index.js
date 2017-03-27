const RestAction = require('./rest/RestAction'),
	RestEndpoint = require('./rest/RestEndpoint'),
	RestProvider = require('./rest/RestProvider'),
	RestProviderBase = require('./rest/RestProviderBase');

module.exports = (() => {
	'use strict';

	return {
		rest: {
			RestAction: RestAction,
			RestEndpoint: RestEndpoint,
			RestProvider: RestProvider,
			RestProviderBase: RestProviderBase
		}
	};
})();