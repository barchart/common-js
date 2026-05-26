const log4js = require('log4js');

const is = require('@barchart/common-js/lang/is'),
	attributes = require('@barchart/common-js/lang/attributes');

const RestQueryProvider = require('./RestQueryProvider');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/providers/OnDemandQueryProvider');

	class OnDemandQueryProvider extends RestQueryProvider {
		constructor(configuration) {
			super(configuration);
		}

		_getCriteriaIsValid(criteria) {
			return super._getCriteriaIsValid(criteria) &&
				is.string(this._getModule()) &&
				is.string(this._getApiKey());
		}

		_getHostname() {
			return getConfigurationProperty(this._getConfiguration(), 'host', 'ondemand.websol.barchart.com');
		}

		_getPort() {
			return getConfigurationProperty(this._getConfiguration(), 'port', 80);
		}

		_parseResponse(responseText) {
			let response;

			try {
				response = JSON.parse(responseText);
			} catch(e) {
				logger.error('Unable to parse response as JSON', responseText);

				throw e;
			}

			const responseCode = response.status.code;

			let returnRef;

			if (responseCode === 200) {
				returnRef = response.results;
			} else if (responseCode === 204) {
				returnRef = [];
			} else {
				throw new Error('Unable to process response from Barchart OnDemand service.');
			}

			return returnRef;
		}

		_getModule() {
			return getConfigurationProperty(this._getConfiguration(), 'module', null);
		}

		_getApiKey() {
			return getConfigurationProperty(this._getConfiguration(), 'apiKey', null);
		}

		_getStaticCriteria() {
			const existing = super._getStaticCriteria();

			const module = this._getModule();
			const apiKey = this._getApiKey();

			return Object.assign({
				module: module,
				apikey: apiKey,
				output: 'json'
			}, existing);
		}

		toString() {
			return `[OnDemandQueryProvider (Module=${(this._getModule() || 'unknown')})]`;
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

	return OnDemandQueryProvider;
})();
