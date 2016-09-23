var RestAction = require('./rest/RestAction');
var RestEndpoint = require('./rest/RestEndpoint');
var RestProvider = require('./rest/RestProvider');
var RestProviderBase = require('./rest/RestProviderBase');

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