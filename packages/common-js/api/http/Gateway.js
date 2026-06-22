import axios from 'axios';

import * as array from './../../lang/array.js';
import * as assert from './../../lang/assert.js';
import * as attributes from './../../lang/attributes.js';
import * as is from './../../lang/is.js';
import * as promise from './../../lang/promise.js';

import Endpoint from './definitions/Endpoint.js';
import VerbType from './definitions/VerbType.js';

import FailureReason from './../failures/FailureReason.js';
import FailureType from './../failures/FailureType.js';

/**
 * Invokes web service calls using an {@link Endpoint} definition.
 *
 * @public
 */
export default class Gateway {
	constructor() {

	}

	/**
	 * Invokes a web service endpoint, given the payload supplied.
	 *
	 * @public
	 * @static
	 * @async
	 * @param {Endpoint} endpoint
	 * @param {*=} payload
	 * @returns {Promise<object>}
	 */
	static async invoke(endpoint, payload) {
		assert.argumentIsRequired(endpoint, 'endpoint', Endpoint, 'Endpoint');

		const pathParameters = endpoint.path.parameters;
		const headerParameters = endpoint.headers.parameters;
		const queryParameters = endpoint.query.parameters;
		const bodyParameters = endpoint.body.parameters;

		const extractParameter = async (parameter) => {
			try {
				const value = await parameter.extractor(payload);

				return value;
			} catch {
				return null;
			}
		};

		const groups = await Promise.all([
			promise.map(pathParameters, extractParameter),
			promise.map(headerParameters, extractParameter),
			promise.map(queryParameters, extractParameter),
			promise.map(bodyParameters, extractParameter)
		]);

		const pathValues = groups[0];
		const headerValues = groups[1];
		const queryValues = groups[2];
		const bodyValues = groups[3];

		const parameters = array.flatten([ pathParameters, headerParameters, queryParameters, bodyParameters ]);
		const values = array.flatten([ pathValues, headerValues, queryValues, bodyValues ]);

		const failure = values.reduce((accumulator, value, index) => {
			let updatedFailure = accumulator;

			const parameter = parameters[index];

			if (value === null && !parameter.optional) {
				if (accumulator === null) {
					updatedFailure = FailureReason.forRequest({ endpoint })
						.addItem(FailureType.REQUEST_CONSTRUCTION_FAILURE, null, true);
				}

				updatedFailure.addItem(FailureType.REQUEST_PARAMETER_MISSING, { name: parameter.description });
			}

			return updatedFailure;
		}, null);

		if (failure !== null) {
			throw failure.format();
		}

		const options = { };
		const url = [ ];

		url.push(endpoint.protocol.prefix);
		url.push(endpoint.host);

		if (endpoint.port !== endpoint.protocol.defaultPort) {
			url.push(':');
			url.push(endpoint.port);
		}

		url.push('/');

		const paths = await promise.pipeline(pathValues.map((value) => (previous) => {
			let encodedValue;

			if (is.nil(value) || is.undef(value)) {
				encodedValue = value;
			} else {
				encodedValue = value.toString().replace(/\//g, '%2F');
			}

			previous.push(encodedValue);

			return previous;
		}), [ ]);

		url.push(paths.join('/'));

		options.method = verbs.get(endpoint.verb);
		options.url = url.join('');

		if (headerParameters.length !== 0) {
			const headers = await promise.pipeline(headerValues.map((value, i) => (accumulator) => {
				const parameter = headerParameters[i];

				accumulator[parameter.key] = value;

				return accumulator;
			}), { });

			if (headers.length !== 0) {
				options.headers = headers;
			}
		}

		if (queryParameters.length !== 0) {
			const query = await promise.pipeline(queryValues.map((value, i) => (accumulator) => {
				const parameter = queryParameters[i];

				accumulator[parameter.key] = value;

				return accumulator;
			}), { });

			if (query.length !== 0) {
				options.params = query;
			}
		}

		if (bodyParameters.length !== 0) {
			const body = await promise.pipeline(bodyValues.map((value, i) => (accumulator) => {
				const parameter = bodyParameters[i];

				attributes.write(accumulator, parameter.key, value);

				return accumulator;
			}), { });

			options.data = body.body;
		}

		if (endpoint.credentials) {
			const credentials = await Promise.all([
				endpoint.credentials.usernameExtractor(payload),
				endpoint.credentials.passwordExtractor(payload)
			]);

			options.auth = {
				username: credentials[0],
				password: credentials[1]
			};
		}

		const request = endpoint.requestInterceptor ? await endpoint.requestInterceptor.process(options, endpoint) : options;

		try {
			const response = await axios.request(request);

			if (endpoint.responseInterceptor) {
				return endpoint.responseInterceptor.process(response, endpoint);
			}

			return response;
		} catch (error) {
			if (endpoint.errorInterceptor) {
				return endpoint.errorInterceptor.process(error, endpoint);
			}

			throw error;
		}
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Gateway]';
	}
}

const verbs = new Map();

verbs.set(VerbType.GET, 'get');
verbs.set(VerbType.DELETE, 'delete');
verbs.set(VerbType.POST, 'post');
verbs.set(VerbType.PUT, 'put');
verbs.set(VerbType.PATCH, 'patch');
