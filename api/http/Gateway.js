const axios = require('axios');

const assert = require('./../../lang/assert'),
	attributes = require('./../../lang/attributes'),
	promise = require('./../../lang/promise');

const BodyType = require('./definitions/BodyType'),
	Endpoint = require('./definitions/Endpoint'),
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
			return Promise.resolve({ })
				.then(() => {
					assert.argumentIsRequired(endpoint, 'endpoint', Endpoint, 'Endpoint');

					return Promise.resolve({ endpoint: endpoint, options: { } })
						.then((context) => {
							const options = context.options;

							return Promise.resolve([ ])
								.then((url) => {
									url.push(endpoint.protocol.prefix);
									url.push(endpoint.host);

									if (endpoint.port !== endpoint.protocol.defaultPort) {
										url.push(':');
										url.push(endpoint.port);
									}

									url.push('/');

									return promise.pipeline(endpoint.path.parameters.map((parameter) => (previous) => {
										return parameter.extractor(payload)
											.then((value) => {
												previous.push(value);

												return previous;
											}).catch((e) => {
												const failure = getOrCreateRequestConstructionFailure(context)
													.addItem(FailureType)

												return previous;
											});
									}), [ ]).then((paths) => {
										url.push(paths.join('/'));

										return url.join('');
									});
								}).then((url) => {
									options.method = verbs.get(endpoint.verb);
									options.url = url;

									return context;
								});
						}).then((options) => {
							const headerParameters = endpoint.headers.parameters;

							if (headerParameters.length === 0) {
								return Promise.resolve(options);
							}

							return Promise.resolve({ })
								.then((headers) => {
									return promise.pipeline(headerParameters.map((parameter) => (previous) => {
										return parameter.extractor(payload)
											.then((value) => {
												if (value !== null) {
													previous[parameter.key] = value;
												} else if (!parameter.optional) {
													throw new Error(`Unable to extract header parameter [ ${parameter.key} ]`);
												}

												return previous;
											});
									}), headers);
								}).then((headers) => {
									options.headers = headers;

									return options;
								});
						}).then((options) => {
							const queryParameters = endpoint.query.parameters;

							if (queryParameters.length === 0) {
								return Promise.resolve(options);
							}

							return Promise.resolve({ })
								.then((query) => {
									return promise.pipeline(queryParameters.map((parameter) => (previous) => {
										return parameter.extractor(payload)
											.then((value) => {
												if (value !== null) {
													previous[parameter.key] = value;
												} else if (!parameter.optional) {
													throw new Error(`Unable to extract query parameter [ ${parameter.key} ]`);
												}

												return previous;
											});
									}), query);
								}).then((query) => {
									options.params = query;

									return options;
								});
						}).then((options) => {
							const body = endpoint.body;

							if (body.type === BodyType.ENTIRE) {
								options.data = payload;
							} else if (body.type === BodyType.VARIABLE) {
								if (attributes.has(payload, body.name)) {
									options.data = attributes.read(payload, body.name);
								} else {
									throw new Error(`Unable construct web service request, payload is missing variable [ ${body} ].`);
								}
							}

							return options;
						}).then((options) => {
							if (endpoint.requestInterceptor) {
								return endpoint.requestInterceptor.process(options);
							} else {
								return Promise.resolve(options);
							}
						}).then((options) => {
							return promise.build((resolve, reject) => {
								axios.request(options)
									.then((response) => {
										let responsePromise;

										if (endpoint.responseInterceptor) {
											responsePromise = endpoint.responseInterceptor.process(response);
										} else {
											responsePromise = resolve(response);
										}

										return responsePromise.then((response) => resolve(response));
									}).catch((e) => {
										reject(e);
									});
							});
						});
				});
		}

		toString() {
			return `[Gateway]`;
		}
	}

	function getOrCreateRequestConstructionFailure(context) {
		if (!context.failure) {
			context.failure = FailureReason.forRequest({ endpoint: context.endpoint })
				.addItem(FailureType.REQUEST_CONSTRUCTION_FAILURE, null, true);
		}

		return context.failure;
	}

	const verbs = new Map();

	verbs.set(VerbType.GET, 'get');
	verbs.set(VerbType.DELETE, 'delete');
	verbs.set(VerbType.POST, 'post');
	verbs.set(VerbType.PUT, 'put');

	return Gateway;
})();