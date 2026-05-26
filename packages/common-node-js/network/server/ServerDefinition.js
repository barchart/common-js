const assert = require('@barchart/common-js/lang/assert'),
	is = require('@barchart/common-js/lang/is');

const Container = require('./endpoints/Container');

module.exports = (() => {
	'use strict';

	const staticPathTypes = {
		local: 'local',
		s3: 's3'
	};

	class ServerDefinition {
		constructor() {
			this._containers = [];

			this._staticPaths = null;
			this._templatePath = null;
		}

		withContainer(container) {
			assert.argumentIsRequired(container, 'container', Container, 'Container');

			this._containers.push(container);

			return this;
		}

		withStaticPath(staticFilePath, staticServerPath, s3Configuration) {
			assert.argumentIsRequired(staticFilePath, 'staticFilePath', String);
			assert.argumentIsRequired(staticServerPath, 'staticServerPath', String);
			assert.argumentIsOptional(s3Configuration, 's3Configuration', Object);

			this._staticPaths = this._staticPaths || {};

			if (this._staticPaths.hasOwnProperty(staticServerPath)) {
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

			this._staticPaths[staticServerPath] = configuration;

			return this;
		}

		withTemplatePath(templatePath) {
			assert.argumentIsRequired(templatePath, 'templatePath', String);

			this._templatePath = templatePath;

			return this;
		}

		getContainers() {
			return this._containers;
		}

		getStaticPaths() {
			return this._staticPaths;
		}

		getTemplatePath() {
			return this._templatePath;
		}

		static withContainer(container) {
			const serverDefinition = new ServerDefinition();

			return serverDefinition.withContainer(container);
		}

		toString() {
			return '[ServerDefinition]';
		}
	}

	return ServerDefinition;
})();