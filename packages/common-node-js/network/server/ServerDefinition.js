import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';

import Container from './endpoints/Container.js';

const staticPathTypes = {
	local: 'local',
	s3: 's3'
};

export default class ServerDefinition {
	#containers;
	#staticPaths;
	#templatePath;

	constructor() {
		this.#containers = [];

		this.#staticPaths = null;
		this.#templatePath = null;
	}

	/**
	 * Returns a copy with the container applied.
	 *
	 * @public
	 * @param {Container} container
	 * @returns {*}
	 */
	withContainer(container) {
		assert.argumentIsRequired(container, 'container', Container, 'Container');

		this.#containers.push(container);

		return this;
	}

	/**
	 * Returns a copy with the static path applied.
	 *
	 * @public
	 * @param {*} staticFilePath
	 * @param {*} staticServerPath
	 * @param {*} s3Configuration
	 * @returns {*}
	 */
	withStaticPath(staticFilePath, staticServerPath, s3Configuration) {
		assert.argumentIsRequired(staticFilePath, 'staticFilePath', String);
		assert.argumentIsRequired(staticServerPath, 'staticServerPath', String);
		assert.argumentIsOptional(s3Configuration, 's3Configuration', Object);

		this.#staticPaths = this.#staticPaths || {};

		if (this.#staticPaths.hasOwnProperty(staticServerPath)) {
			throw new Error('The path for serving static files has already been defined.');
		}

		let configuration;

		if (is.object(s3Configuration)) {
			configuration = {
				type: staticPathTypes.s3,
				keyPrefix: staticFilePath,
				s3: s3Configuration
			};
		} else {
			configuration = {
				type: staticPathTypes.local,
				filePath: staticFilePath
			};
		}

		this.#staticPaths[staticServerPath] = configuration;

		return this;
	}

	/**
	 * Returns a copy with the template path applied.
	 *
	 * @public
	 * @param {*} templatePath
	 * @returns {*}
	 */
	withTemplatePath(templatePath) {
		assert.argumentIsRequired(templatePath, 'templatePath', String);

		this.#templatePath = templatePath;

		return this;
	}

	/**
	 * Returns the containers.
	 *
	 * @public
	 * @returns {Array}
	 */
	getContainers() {
		return this.#containers;
	}

	/**
	 * Returns the static paths.
	 *
	 * @public
	 * @returns {Array}
	 */
	getStaticPaths() {
		return this.#staticPaths;
	}

	/**
	 * Returns the template path.
	 *
	 * @public
	 * @returns {string}
	 */
	getTemplatePath() {
		return this.#templatePath;
	}

	/**
	 * Returns a copy with the container applied.
	 *
	 * @public
	 * @static
	 * @param {Container} container
	 * @returns {*}
	 */
	static withContainer(container) {
		const serverDefinition = new ServerDefinition();

		return serverDefinition.withContainer(container);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[ServerDefinition]';
	}
}
