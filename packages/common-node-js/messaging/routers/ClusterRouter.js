const log4js = require('log4js'),
	uuid = require('uuid');

const assert = require('@barchart/common-js/lang/assert'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
	DisposableStack = require('@barchart/common-js/collections/specialized/DisposableStack'),
	promise = require('@barchart/common-js/lang/promise'),
	random = require('@barchart/common-js/lang/random');

const MessageProvider = require('./../../cluster/MessageProvider'),
	Router = require('./Router');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('common-node/messaging/routers/ClusterRouter');

	const REGISTER = 'r.r';
	const UNREGISTER = 'r.u';
	const REQUEST = 'r.q';
	const RESPONSE = 'r.s';

	class ClusterRouter extends Router {
		constructor(messageProvider, suppressExpressions) {
			super(suppressExpressions);

			assert.argumentIsRequired(messageProvider, 'messageProvider', MessageProvider);

			this._requestHandlers = { };
			this._requestRegistrations = { };
			this._pendingCallbacks = { };

			this._messageProvider = messageProvider;

			this._disposeStack = new DisposableStack();
		}

		_start() {
			return this._messageProvider.start()
				.then(() => {
					this._disposeStack.push(
						this._messageProvider.registerPeerConnectedObserver((source) => {
							const messageTypes = Object.keys(this._requestHandlers);

							if (messageTypes.length !== 0) {
								logger.debug('Sending registrations to newly connected IPC peer', source);

								messageTypes.forEach((messageTypes) => {
									this._messageProvider.send(REGISTER, getRegistrationEnvelope(messageTypes), source);
								});
							}
						})
					);
				}).then(() => {
					this._disposeStack.push(
						this._messageProvider.handle(REGISTER, (source, type, payload) => {
							const messageType = payload.t;

							logger.debug('Processing registration to', messageType, 'from IPC peer', source);

							if (!this._requestRegistrations.hasOwnProperty(messageType)) {
								this._requestRegistrations[messageType] = [ ];
							}

							const registrations = this._requestRegistrations[messageType];

							if (!registrations.some((registration) => registration === source)) {
								registrations.push(source);
							} else {
								logger.warn('A registration for', messageType, 'already exists for worker', source);
							}
						})
					);

					this._disposeStack.push(
						this._messageProvider.handle(UNREGISTER, (source, type, payload) => {
							const messageType = payload.t;

							logger.debug('Processing registration cancel to', messageType, 'from IPC peer', source);

							if (this._requestRegistrations.hasOwnProperty(messageType)) {
								this._requestRegistrations[messageType] = this._requestRegistrations[messageType].filter((item) => {
									return item !== source;
								});

								if (this._requestRegistrations[messageType].length === 0) {
									delete this._requestRegistrations[messageType];
								}
							}
						})
					);

					this._disposeStack.push(
						this._messageProvider.handle(REQUEST, (source, type, payload) => {
							const messageId = payload.id;
							const messageType = payload.t;
							const messagePayload = payload.p;

							Promise.resolve()
								.then(() => {
									const handler = this._requestHandlers[messageType];

									return handler(messagePayload);
								}).then((result) => {
									return getResponseEnvelope(payload, true, result);
								}).catch((e) => {
									logger.error('Request', messageId, 'failed. Sending reject message.', e);

									return getResponseEnvelope(payload, false, null);
								}).then((envelope) => {
									this._messageProvider.send(RESPONSE, envelope, source);
								});
						})
					);

					this._disposeStack.push(
						this._messageProvider.handle(RESPONSE, (source, type, payload) => {
							const requestId = payload.id;
							const callbacks = this._pendingCallbacks[requestId];

							if (callbacks) {
								const responseSuccess = payload.s;
								const responsePayload = payload.p;

								if (responseSuccess) {
									callbacks.resolve(responsePayload);
								} else {
									callbacks.reject();
								}

								delete this._pendingCallbacks[requestId];
							}
						})
					);
				});

		}

		_canRoute(messageType) {
			return this._requestRegistrations.hasOwnProperty(messageType);
		}

		_route(messageType, payload, timeout, forget) {
			return promise.build((resolveCallback, rejectCallback) => {
				const envelope = getRequestEnvelope(messageType, payload);
				const messageId = envelope.id;

				this._pendingCallbacks[messageId] = {
					resolve: resolveCallback,
					reject: rejectCallback
				};

				const registrations = this._requestRegistrations[messageType];

				let index;

				if (registrations.length === 1) {
					index = 0;
				} else {
					index = random.range(0, registrations.length);
				}

				this._messageProvider.send(REQUEST, envelope, registrations[index]);
			});
		}

		_register(messageType, handler) {
			logger.debug('Registering', messageType,'request handler over cluster IPC');

			this._requestHandlers[messageType] = handler;

			this._messageProvider.broadcast(REGISTER, getRegistrationEnvelope(messageType));

			return Disposable.fromAction(() => {
				this._messageProvider.broadcast(UNREGISTER, getRegistrationEnvelope(messageType));

				delete this._requestHandlers[messageType];
			});
		}

		_onDispose() {
			this._disposeStack.dispose();
			this._disposeStack = null;

			this._requestHandlers = null;
			this._requestRegistrations = null;
			this._pendingCallbacks = null;

			logger.debug('Cluster router disposed');
		}

		toString() {
			return '[ClusterRouter]';
		}
	}

	function getRegistrationEnvelope(type) {
		return {
			t: type
		};
	}

	function getRequestEnvelope(type, payload) {
		return {
			id: uuid.v4(),
			t: type,
			p: payload || null
		};
	}

	function getResponseEnvelope(request, success, response) {
		return {
			id: request.id,
			s: success,
			p: response || null
		};
	}

	return ClusterRouter;
})();