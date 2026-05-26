const digest = require('http-digest-client'),
	http = require('http'),
	https = require('https'),
	log4js = require('log4js'),
	querystring = require('querystring'),
	xmlParser = require('xml2js').parseString,
	attributes = require('@barchart/common-js/lang/attributes');

const is = require('@barchart/common-js/lang/is'),
	promise = require('@barchart/common-js/lang/promise');

const QueryProvider = require('./../QueryProvider');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/providers/RestQueryProvider');

	let counter = 0;

	class RestQueryProvider extends QueryProvider {
		constructor(configuration) {
			super(configuration);
		}

		_runQuery(criteria) {
			return promise.build((resolveCallback, rejectCallback) => {
				const protocol = this._getProtocol().toUpperCase();
				const secure = protocol === 'HTTPS';

				const requestOptions = this._getRequestOptions(criteria);
				const authenticationOptions = this._getAuthenticationOptions(criteria);

				const queryId = ++counter;

				logger.debug('Executing', protocol, 'query', queryId);
				logger.trace(requestOptions);

				const handleResponse = (response) => {
					response.setEncoding('utf8');

					let responseText = '';

					response.on('error', (e) => {
						logger.error('Failed', protocol, 'query', queryId, e);

						rejectCallback(e);
					});

					response.on('data', (chunk) => {
						responseText = responseText + chunk;
					});

					response.on('end', () => {
						logger.debug('Completed', protocol, 'query', queryId);

						try {
							const parsedResponse = this._parseResponse(responseText);

							resolveCallback(parsedResponse);
						} catch (e) {
							logger.error('Unable to parse response', criteria, e);

							rejectCallback(e);
						}
					});
				};

				if (authenticationOptions !== null && authenticationOptions.type === 'digest') {
					const digestClient = digest(authenticationOptions.username, authenticationOptions.password, secure);

					digestClient.request(requestOptions, handleResponse);
				} else {
					const configuration = this._getConfiguration();

					let connector;

					if (secure) {
						connector = https;
					} else {
						connector = http;
					}

					const request = connector.request(requestOptions, handleResponse);

					request.on('error', (e) => {
						logger.error('An error occurred while processing', protocol, 'query', queryId, e);

						rejectCallback(e);
					});

					const requestBody = this._getRequestBody(criteria);

					if (requestBody !== null) {
						request.write(requestBody);
					}

					request.end();
				}
			});
		}

		_getCriteriaIsValid(criteria) {
			const dynamicCriteria = this._getDynamicCriteria();

			return Object.keys(dynamicCriteria)
				.every((key) => {
					const defaultValue = dynamicCriteria[key];

					let valueToUse;

					if (criteria.hasOwnProperty(key)) {
						valueToUse = criteria[key];
					}

					if (is.undefined(valueToUse)) {
						valueToUse = defaultValue;
					}

					if (is.number(valueToUse)) {
						valueToUse = valueToUse.toString();
					}

					if (is.array(valueToUse) && valueToUse.length !== 0) {
						valueToUse = valueToUse.join();
					}

					return is.string(valueToUse) && valueToUse.length !== 0;
				});
		}

		_getBaseCriteria(criteria) {
			const configuration = this._getConfiguration();
			const criteriaContext = configuration.criteriaContext;

			let returnRef;

			if (is.boolean(criteriaContext) && criteriaContext) {
				returnRef = criteria;
			} else {
				returnRef = {};
			}

			return returnRef;
		}

		_getStaticCriteria() {
			const configuration = this._getConfiguration();

			let returnRef;

			if (is.object(configuration.staticCriteria) || is.object(configuration.criteria)) {
				returnRef = Object.assign({ }, configuration.staticCriteria || configuration.criteria);
			} else {
				returnRef = {};
			}

			return returnRef;
		}

		_getDynamicCriteria() {
			const configuration = this._getConfiguration();

			let returnRef;

			if (is.object(configuration.dynamicCriteria)) {
				returnRef = Object.assign({ }, configuration.dynamicCriteria);
			} else {
				returnRef = {};
			}

			return returnRef;
		}

		_getProtocol() {
			const configuration = this._getConfiguration();

			return configuration.protocol || 'http';
		}

		_getHostname() {
			const configuration = this._getConfiguration();

			return configuration.hostname;
		}

		_getPort() {
			const configuration = this._getConfiguration();

			return configuration.port || 80;
		}

		_getRequestOptions(criteria) {
			const configuration = this._getConfiguration();

			const hostname = this._getHostname();
			const path = (configuration.path || '').replace(/:([^\/]*)/g, (fullString, match) => attributes.read(criteria, match));
			const port = this._getPort();
			const method = configuration.method || 'GET';
			const auth = configuration.auth || '';
			const headers = configuration.headers;

			let returnRef;

			if (!is.string(hostname) || hostname.length === 0) {
				throw new Error(`Request options for ${this.toString()} require a hostname`);
			}

			const baseCriteria = this._getBaseCriteria(criteria);
			const staticCriteria = this._getStaticCriteria();
			const dynamicCriteria = this._getDynamicCriteria();

			const query = Object.assign(baseCriteria, staticCriteria);

			Object.keys(dynamicCriteria)
				.forEach((key) => {
					const defaultValue = dynamicCriteria[key];

					let valueToUse;

					if (attributes.has(criteria, key)) {
						valueToUse = attributes.read(criteria, key);
					}

					if (is.undefined(valueToUse)) {
						valueToUse = defaultValue;
					}

					query[key] = valueToUse;
				});

			Object.keys(query)
				.forEach((key) => {
					const value = query[key];

					let stringValue;

					if (is.array(value)) {
						stringValue = value.join();
					} else if (is.object(value)) {
						stringValue = JSON.stringify(value);
					} else {
						stringValue = value.toString();
					}

					query[key] = stringValue;
				});

			returnRef = {
				method: method,
				host: hostname,
				path: '/' + path + '?' + querystring.stringify(query),
				port: port,
				auth: auth
			};

			if (is.object(headers)) {
				returnRef.headers = headers;
			}

			return returnRef;
		}

		_getAuthenticationOptions(criteria) {
			const configuration = this._getConfiguration();

			let returnRef;

			if (is.object(configuration.authentication)) {
				returnRef = configuration.authentication;
			} else {
				returnRef = null;
			}

			return returnRef;
		}

		_getRequestBody(criteria) {
			const configuration = this._getConfiguration();

			return configuration.body ? JSON.stringify(configuration.body) : null;
		}

		_parseResponse(responseText) {
			const configuration = this._getConfiguration();

			let response;

			if (configuration.responseParser === 'xml') {
				response = this._parseXmlResponse(responseText);
			} else {
				try {
					response = JSON.parse(responseText);
				} catch (e) {
					logger.error('Unable to parse response as JSON', responseText);

					throw e;
				}
			}

			return response;
		}

		_parseXmlResponse(responseText) {
			return promise.build((resolve, reject) => {
				xmlParser(responseText, (err, result) => {
					if (err) {
						logger.error('Unable to parse response as XML');

						reject(err);
					} else {
						resolve(result);
					}
				});
			});
		}

		toString() {
			return '[RestQueryProvider]';
		}
	}

	return RestQueryProvider;
})();