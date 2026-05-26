const configurator = require('node-yaml-config'),
	path = require('path');

const assert = require('@barchart/common-js/lang/assert'),
	 is = require('@barchart/common-js/lang/is'),
	 object = require('@barchart/common-js/lang/object');

module.exports = (() => {
	'use strict';

	let instance = null;

	/**
	 * An object that is used to store environment variables for the current process.
	 *
	 * @public
	 * @deprecated
	 * @param {string} environmentName - The name of the environment mode (e.g. "development" or "production").
	 * @param {Object} configuration - The application's configuration data.
	 * @param {string} version - The version of the application.
	 */
	class Environment {
		constructor(environmentName, configuration, version) {
			assert.argumentIsRequired(environmentName, 'environmentName', String);
			assert.argumentIsRequired(configuration, 'configuration', Object);
			assert.argumentIsRequired(version, 'version', String);

			this._name = environmentName;
			this._configuration = configuration;
			this._version = version;
		}

		/**
		 * The environment's name (e.g. "development" or "production").
		 *
		 * @public
		 * @returns {string}
		 */
		getName() {
			return this._name;
		}

		/**
		 * The application's configuration data.
		 *
		 * @public
		 * @returns {Object}
		 */
		getConfiguration() {
			return object.clone(this._configuration);
		}

		/**
		 * The application's version.
		 *
		 * @public
		 * @returns {string}
		 */
		getVersion() {
			return this._version;
		}

		/**
		 * True if the {@link Environment#getName} is "production" -- otherwise false.
		 *
		 * @public
		 * @returns {boolean}
		 */
		getIsProduction() {
			return this._name === 'production' || this._name === 'prod';
		}

		readConfigurationFile(filePath) {
			return readConfigurationFile(this._configuration.server.path, filePath, this._name);
		}

		/**
		 * Builds the a singleton instance of the {@link Environment} class; accessible
		 * from the {@link Environment.getInstance} function.
		 *
		 * @public
		 * @static
		 * @param {string} applicationPath - The root application directory, which must contain a "config" folder with a "config.yml" file.
		 * @param {string} version - The version of the application.
		 * @returns {Environment}
		 */
		static initialize(applicationPath, version) {
			assert.argumentIsRequired(applicationPath, 'applicationPath', String);
			assert.argumentIsRequired(version, 'version', String);

			let name;

			if (is.object(process) && is.object(process.env) && is.string(process.env.ENV_NAME)) {
				name = process.env.ENV_NAME;
			} else if (is.object(process) && is.object(process.env) && is.string(process.env.NODE_ENV)) {
				name = process.env.NODE_ENV;
			} else {
				name = 'development';
			}

			const configuration = readConfigurationFile(applicationPath, 'config/config.yml', name);

			configuration.server = configuration.server || {};
			configuration.server.path = configuration.server.path || applicationPath;

			instance = new Environment(name, configuration, version);

			return instance;
		}

		/**
		 * Returns the singleton instance of the {@link Environment} class. The
		 * {@link Environment.initialize} function must be called before using
		 * this function.
		 *
		 * @public
		 * @static
		 * @returns {Environment}
		 */
		static getInstance() {
			if (instance === null) {
				throw new Error('The environment has not been initialized.');
			}

			return instance;
		}

		/**
		 * Parses the process arguments, looking for key/value pairs. Each
		 * key must be have a dash prefix, and each value cannot use a dash
		 * prefix. For the following invocation -- "node app.js -a 1 -b 2" --
		 * a map with keys, "a" and "b" would be returned having values 1 and 2,
		 * respectively.
		 *
		 * @public
		 * @static
		 * @returns {object}
		 */
		static parseProcessArguments() {
			const a = process.argv;

			return a.reduce((map, key, i) => {
				const j = i + 1;

				if (is.string(key) && key.startsWith('-') && i > 0 && a.length > j) {
					const value = a[j];

					if (is.string(value) && !value.startsWith('-')) {
						map[key.substr(1)] = value;
					}
				}

				return map;
			}, { });
		}
	}

	function readConfigurationFile(applicationPath, filePath, name) {
		return configurator.load(path.resolve(applicationPath, filePath), name);
	}

	return Environment;
})();