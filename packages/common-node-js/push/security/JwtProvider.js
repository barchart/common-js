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
 * @param {Callbacks.JwtTokenGenerator} tokenGenerator - An anonymous function which returns a signed JWT token.
 * @param {Number=} refreshInterval - The number of milliseconds which must pass before a new JWT token is generated. A null or undefined value means the token is not cached.
 */
export default class JwtProvider extends Disposable {
	constructor(tokenGenerator, refreshInterval) {
		super();

		assert.argumentIsRequired(tokenGenerator, 'tokenGenerator', Function);
		assert.argumentIsOptional(refreshInterval, 'refreshInterval', Number);

		this._tokenGenerator = tokenGenerator;

		this._tokenPromise = null;

		this._refreshTimestamp = null;
		this._refreshPending = false;

		if (is.number(refreshInterval)) {
			this._refreshInterval = Math.max(refreshInterval || 0, 0);
			this._refreshJitter = random.range(0, Math.floor(this._refreshInterval / 10));
		} else {
			this._refreshInterval = null;
			this._refreshJitter = null;
		}

		this._scheduler = new Scheduler();
	}

	/**
	 * Reads the current token, refreshing if necessary.
	 *
	 * @public
	 * @returns {Promise<String>}
	 */
	getToken() {
		return Promise.resolve()
			.then(() => {
				if (this._refreshPending) {
					return this._tokenPromise;
				}

				if (this._tokenPromise === null || this._refreshInterval === null || (this._refreshInterval > 0 && getTime() > (this._refreshTimestamp + this._refreshInterval + this._refreshJitter))) {
					this._refreshPending = true;

					this._tokenPromise = this._scheduler.backoff(() => this._tokenGenerator(), 100, 'Read JWT token', 3)
						.then((token) => {
							this._refreshTimestamp = getTime();
							this._refreshPending = false;

							return token;
						}).catch((e) => {
							this._tokenPromise = null;

							this._refreshTimestamp = null;
							this._refreshPending = false;

							return Promise.reject(e);
						});
				}

				return this._tokenPromise;
			});
	}

	/**
	 * A factory for {@link JwtProvider} which is an alternative to the constructor.
	 *
	 * @public
	 * @static
	 * @param {Callbacks.JwtTokenGenerator} tokenGenerator - An anonymous function which returns a signed JWT token.
	 * @param {Number=} refreshInterval - The number of milliseconds which must pass before a new JWT token is generated. A zero value means the token should never be refreshed. A null or undefined value means the token is not cached.
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
	 * @param {String} userId - The user identifier to impersonate.
	 * @param {String} contextId - The context identifier of the user to impersonate.
	 * @param {Number=} refreshInterval - The number of milliseconds which must pass before a new JWT token is generated. A null or undefined value means the token is not cached.
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
	 * @param {String} userId - The user identifier to impersonate.
	 * @param {String} contextId - The context identifier of the user to impersonate.
	 * @param {Number=} refreshInterval - The number of milliseconds which must pass before a new JWT token is generated. A null or undefined value means the token is not cached.
	 * @returns {JwtProvider}
	 */
	static forProduction(userId, contextId, refreshInterval) {
		return getJwtProviderForImpersonation(Configuration.getJwtImpersonationHost, 'prod', userId, contextId, refreshInterval);
	}
	
	_onDispose() {
		this._scheduler.dispose();
		this._scheduler = null;
	}

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
