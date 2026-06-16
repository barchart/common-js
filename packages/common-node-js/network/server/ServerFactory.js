import * as assert from '@barchart/common-js/lang/assert.js';

import Disposable from '@barchart/common-js/lang/Disposable.js';

import ServerDefinition from './ServerDefinition.js';

export default class ServerFactory {
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
