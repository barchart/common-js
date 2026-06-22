import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';
import * as random from '@barchart/common-js/lang/random.js';

import Disposable from '@barchart/common-js/lang/Disposable.js';
import Scheduler from '@barchart/common-js/timing/Scheduler.js';
import EndpointBuilder from '@barchart/common-js/api/http/builders/EndpointBuilder.js';
import Gateway from '@barchart/common-js/api/http/Gateway.js';
import ProtocolType from '@barchart/common-js/api/http/definitions/ProtocolType.js';
import ResponseInterceptor from '@barchart/common-js/api/http/interceptors/ResponseInterceptor.js';
import VerbType from '@barchart/common-js/api/http/definitions/VerbType.js';

import Configuration from './Configuration.js';

const DEFAULT_REFRESH_INTERVAL_MILLISECONDS = 5 * 60 * 1000;

/**
 * Generates and caches a signed token (using a delegate). The cached token
 * is refreshed periodically. An instance of this class is required by
 * the {@link PushNotificationProvider} implementations.
 *
 * @public
 * @exported
 */
export default class JwtProvider extends Disposable {
	#refreshInterval;
	#refreshJitter;
	#refreshPending;
	#refreshTimestamp;
	#scheduler;
	#tokenGenerator;
	#tokenPromise;

	/**
	 * @param {JwtTokenGenerator} tokenGenerator - An anonymous function which returns a signed JWT token.
	 * @param {number=} refreshInterval - The number of milliseconds which must pass before a new JWT token is generated. A null or undefined value means the token is not cached.
	 */
	constructor(tokenGenerator, refreshInterval) {
		super();

		assert.argumentIsRequired(tokenGenerator, 'tokenGenerator', Function);
		assert.argumentIsOptional(refreshInterval, 'refreshInterval', Number);

		this.#tokenGenerator = tokenGenerator;

		this.#tokenPromise = null;

		this.#refreshTimestamp = null;
		this.#refreshPending = false;

		if (is.number(refreshInterval)) {
			this.#refreshInterval = Math.max(refreshInterval || 0, 0);
			this.#refreshJitter = random.range(0, Math.floor(this.#refreshInterval / 10));
		} else {
			this.#refreshInterval = null;
			this.#refreshJitter = null;
		}

		this.#scheduler = new Scheduler();
	}

	/**
	 * Reads the current token, refreshing if necessary.
	 *
	 * @public
	 * @async
	 * @returns {Promise<string>}
	 */
	async getToken() {
		if (this.#refreshPending) {
			return this.#tokenPromise;
		}

		if (this.#tokenPromise === null || this.#refreshInterval === null || (this.#refreshInterval > 0 && getTime() > (this.#refreshTimestamp + this.#refreshInterval + this.#refreshJitter))) {
			this.#refreshPending = true;

			this.#tokenPromise = (async () => {
				try {
					const token = await this.#scheduler.backoff(() => this.#tokenGenerator(), 100, 'Read JWT token', 3);

					this.#refreshTimestamp = getTime();
					this.#refreshPending = false;

					return token;
				} catch (e) {
					this.#tokenPromise = null;

					this.#refreshTimestamp = null;
					this.#refreshPending = false;

					throw e;
				}
			})();
		}

		return this.#tokenPromise;
	}

	/**
	 * A factory for {@link JwtProvider} which is an alternative to the constructor.
	 *
	 * @public
	 * @static
	 * @param {JwtTokenGenerator} tokenGenerator - An anonymous function which returns a signed JWT token.
	 * @param {number=} refreshInterval - The number of milliseconds which must pass before a new JWT token is generated. A zero value means the token should never be refreshed. A null or undefined value means the token is not cached.
	 * @returns {JwtProvider}
	 */
	static fromTokenGenerator(tokenGenerator, refreshInterval) {
		return new JwtProvider(tokenGenerator, refreshInterval);
	}

	/**
	 * Builds a {@link JwtProvider} which will generate tokens impersonating the specified
	 * user. The "admin" environment is for Barchart use only and access is restricted
	 * to Barchart's internal network.
	 *
	 * @public
	 * @static
	 * @param {string} userId - The user identifier to impersonate.
	 * @param {string} contextId - The context identifier of the user to impersonate.
	 * @param {number=} refreshInterval - The number of milliseconds which must pass before a new JWT token is generated. A null or undefined value means the token is not cached.
	 * @returns {JwtProvider}
	 */
	static forStage(userId, contextId, refreshInterval) {
		return getJwtProviderForImpersonation(Configuration.getJwtImpersonationHost, 'stage', userId, contextId, refreshInterval);
	}

	/**
	 * Builds a {@link JwtProvider} which will generate tokens impersonating the specified
	 * user. The "admin" environment is for Barchart use only and access is restricted
	 * to Barchart's internal network.
	 *
	 * @public
	 * @static
	 * @param {string} userId - The user identifier to impersonate.
	 * @param {string} contextId - The context identifier of the user to impersonate.
	 * @param {number=} refreshInterval - The number of milliseconds which must pass before a new JWT token is generated. A null or undefined value means the token is not cached.
	 * @returns {JwtProvider}
	 */
	static forProduction(userId, contextId, refreshInterval) {
		return getJwtProviderForImpersonation(Configuration.getJwtImpersonationHost, 'prod', userId, contextId, refreshInterval);
	}

	/**
	 * @protected
	 * @override
	 */
	_onDispose() {
		this.#scheduler.dispose();
		this.#scheduler = null;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[JwtProvider]';
	}
}

function getJwtProviderForImpersonation(host, environment, userId, contextId, refreshInterval) {
	assert.argumentIsRequired(host, 'host', String);
	assert.argumentIsRequired(environment, 'environment', String);
	assert.argumentIsRequired(userId, 'userId', String);
	assert.argumentIsRequired(contextId, 'contextId', String);
	assert.argumentIsOptional(refreshInterval, 'refreshInterval', Number);

	const tokenEndpoint = EndpointBuilder.for('generate-impersonation-jwt-for-test', 'generate JWT token for test environment')
		.withVerb(VerbType.POST)
		.withProtocol(ProtocolType.HTTPS)
		.withHost(host)
		.withPathBuilder((pb) =>
			pb.withLiteralParameter('version', 'v1')
				.withLiteralParameter('tokens', 'tokens')
				.withLiteralParameter('impersonate', 'impersonate')
				.withLiteralParameter('service', 'ens')
				.withLiteralParameter('environment', environment)
		)
		.withBody()
		.withResponseInterceptor(ResponseInterceptor.DATA)
		.endpoint;

	const payload = { };

	payload.userId = userId;
	payload.contextId = contextId;

	return new JwtProvider(() => Gateway.invoke(tokenEndpoint, payload), refreshInterval || DEFAULT_REFRESH_INTERVAL_MILLISECONDS);
}

function getTime() {
	return (new Date()).getTime();
}

/**
 * A callback used to generate a signed JWT token.
 *
 * @callback JwtTokenGenerator
 * @returns {Promise<*>}
 */
