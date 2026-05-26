const log4js = require('log4js');

const is = require('@barchart/common-js/lang/is'),
	attributes = require('@barchart/common-js/lang/attributes');

const RestQueryProvider = require('./RestQueryProvider');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/providers/ApiQueryProvider');

	class ApiQueryProvider extends RestQueryProvider {
		constructor(configuration) {
			super(configuration);
		}

		_getCriteriaIsValid(criteria) {
			return super._getCriteriaIsValid(criteria) &&
				is.string(this._getApiKey());
		}

		_getProtocol() {
			return getConfigurationProperty(this._getConfiguration(), 'protocol', 'https');
		}

		_getHostname() {
			return getConfigurationProperty(this._getConfiguration(), 'host', 'core-api.barchart.com');
		}

		_getPort() {
			return getConfigurationProperty(this._getConfiguration(), 'port', 80);
		}

		_getApiKey() {
			return getConfigurationProperty(this._getConfiguration(), 'apiKey', null);
		}

		_getStaticCriteria() {
			const existing = super._getStaticCriteria();

			return Object.assign({ apiKey: this._getApiKey() }, existing);
		}

		toString() {
			return `[ApiQueryProvider (Module=${(this._getModule() || 'unknown')})]`;
		}
	}

	function getConfigurationProperty(configuration, propertyName, defaultValue) {
		let returnRef = defaultValue;

		if (attributes.has(configuration, propertyName)) {
			returnRef = attributes.read(configuration, propertyName);
		} else {
			returnRef = defaultValue;
		}

		return returnRef;
	}

	return ApiQueryProvider;
})();
