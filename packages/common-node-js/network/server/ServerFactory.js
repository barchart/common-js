const assert = require('@barchart/common-js/lang/assert'),
	Disposable = require('@barchart/common-js/lang/Disposable');

const ServerDefinition = require('./ServerDefinition');

module.exports = (() => {
	'use strict';

	class ServerFactory {
		constructor() {

		}

		build(serverDefinition) {
			assert.argumentIsRequired(serverDefinition, 'serverDefinition', ServerDefinition, 'ServerDefinition');

			return Promise.resolve()
				.then(() => {
					return this._build(serverDefinition.getContainers(), serverDefinition.getStaticPaths(), serverDefinition.getTemplatePath());
				});
		}

		_build(containers, staticPath, templatePath) {
			return Disposable.fromAction(() => {
				return;
			});
		}

		toString() {
			return '[ServerFactory]';
		}
	}

	return ServerFactory;
})();