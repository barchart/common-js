import * as assert from '@barchart/common-js/lang/assert.js';

import Disposable from '@barchart/common-js/lang/Disposable.js';

import ServerDefinition from './ServerDefinition.js';

export default class ServerFactory {
	constructor() {

	}

	/**
	 * Runs the build operation.
	 *
	 * @public
	 * @async
	 * @param {*} serverDefinition
	 * @returns {*}
	 */
	async build(serverDefinition) {
		assert.argumentIsRequired(serverDefinition, 'serverDefinition', ServerDefinition, 'ServerDefinition');

		return this._build(serverDefinition.getContainers(), serverDefinition.getStaticPaths(), serverDefinition.getTemplatePath());
	}

	/**
	 * @protected
	 * @async
	 * @param containers
	 * @param staticPaths
	 * @param templatePath
	 * @return {Promise<*>}
	 */
	async _build(containers, staticPaths, templatePath) {
		return Disposable.fromAction(() => {
			return;
		});
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[ServerFactory]';
	}
}
