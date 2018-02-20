const axios = require('axios');

const array = require('./../../lang/array'),
	assert = require('./../../lang/assert'),
	attributes = require('./../../lang/attributes'),
	promise = require('./../../lang/promise');

const Endpoint = require('./definitions/Endpoint'),
	VerbType = require('./definitions/VerbType');

const FailureReason = require('./../failures/FailureReason'),
	FailureType = require('./../failures/FailureType');

module.exports = (() => {
	'use strict';

	/**
	 * Invokes web service calls using an {@link Endpoint} definition.
	 *
	 * @public
	 */
	class Gateway {
		constructor() {

		}

		/**
		 * Invokes a web service endpoint, given the payload supplied.
		 *
		 * @public
		 * @static
		 * @param {Endpoint} endpoint
		 * @param {*=} payload
		 * @returns {Promise.<Object>}
		 */
		static invoke(endpoint, payload) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(endpoint, 'endpoint', Endpoint, 'Endpoint');

					const pathParameters = endpoint.path.parameters;
					const headerParameters = endpoint.headers.parameters;
					const queryParameters = endpoint.query.parameters;
					const bodyParameters = endpoint.body.parameters;

					const extractParameter = (parameter) => {
						return parameter.extractor(payload)
							.catch((e) => {
								return null;
							});
					};

					return Promise.all([
						promise.map(pathParameters, extractParameter),
						promise.map(headerParameters, extractParameter),
						promise.map(queryParameters, extractParameter),
						promise.map(bodyParameters, extractParameter)
					]).then((groups) => {
						const pathValues = groups[0];
						const headerValues = groups[1];
						const queryValues = groups[2];
						const bodyValues = groups[3];
						
						const parameters = array.flatten([ pathParameters, headerParameters, queryParameters, bodyParameters ]);
						const values = array.flatten([ pathValues, headerValues, queryValues, bodyValues ]);

						const failure = values.reduce((accumulator, value, i) => {
							let failure = accumulator;

							const parameter = parameters[i];

							if (value === null && !parameter.optional) {
								if (accumulator === null) {
									failure = FailureReason.forRequest({ endpoint: endpoint })
										.addItem(FailureType.REQUEST_CONSTRUCTION_FAILURE, null, true);
								}

								failure.addItem(FailureType.REQUEST_PARAMETER_MISSING_FAILURE, { name: parameter.description });
							}

							return failure;
						}, null);

						if (failure !== null) {
							throw failure.format();
						}

						return Promise.resolve({ })
							.then((options) => {
								const url = [ ];

								url.push(endpoint.protocol.prefix);
								url.push(endpoint.host);

								if (endpoint.port !== endpoint.protocol.defaultPort) {
									url.push(':');
									url.push(endpoint.port);
								}

								url.push('/');

								return promise.pipeline(pathValues.map((value) => (previous) => {
									previous.push(value);

									return previous;
								}), [ ]).then((paths) => {
									url.push(paths.join('/'));

									return url.join('');
								}).then((url) => {
									options.method = verbs.get(endpoint.verb);
									options.url = url;

									return options;
								});
							}).then((options) => {
								if (headerParameters.length === 0) {
									return options;
								}

								return promise.pipeline(headerValues.map((value, i) => (accumulator) => {
									const parameter = headerParameters[i];

									accumulator[parameter.key] = value;

									return accumulator;
								}), {}).then((headers) => {
									if (headers.length !== 0) {
										options.headers = headers;
									}

									return options;
								});
							}).then((options) => {
								if (queryParameters.length === 0) {
									return options;
								}

								return promise.pipeline(queryValues.map((value, i) => (accumulator) => {
									const parameter = queryParameters[i];

									accumulator[parameter.key] = value;

									return accumulator;
								}), {}).then((query) => {
									if (query.length !== 0) {
										options.params = query;
									}

									return options;
								});
							}).then((options) => {
								if (bodyParameters.length === 0) {
									return options;
								}

								return promise.pipeline(bodyValues.map((value, i) => (accumulator) => {
									const parameter = bodyParameters[i];

									attributes.write(accumulator, parameter.key, value);

									return accumulator;
								}), { }).then((body) => {
									options.data = body.body;

									return options;
								});
							}).then((options) => {
								if (endpoint.requestInterceptor) {
									return endpoint.requestInterceptor.process(options, endpoint);
								} else {
									return options;
								}
							}).then((options) => {
								return axios.request(options)
									.then((response) => {
										let responsePromise;

										if (endpoint.responseInterceptor) {
											responsePromise = endpoint.responseInterceptor.process(response, endpoint);
										} else {
											responsePromise = Promise.resolve(response);
										}

										return Promise.resolve(responsePromise);
									});
							});
					});
				});
		}

		toString() {
			return `[Gateway]`;
		}
	}

	const verbs = new Map();

	verbs.set(VerbType.GET, 'get');
	verbs.set(VerbType.DELETE, 'delete');
	verbs.set(VerbType.POST, 'post');
	verbs.set(VerbType.PUT, 'put');

	return Gateway;
})();