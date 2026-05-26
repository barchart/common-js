const log4js = require('log4js'),
	uuid = require('uuid');

const assert = require('@barchart/common-js/lang/assert'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
	DisposableStack = require('@barchart/common-js/collections/specialized/DisposableStack'),
	is = require('@barchart/common-js/lang/is'),
	promise = require('@barchart/common-js/lang/promise');

const Router = require('./Router'),
	SqsProvider = require('./../../aws/SqsProvider');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('common-node/messaging/routers/AwsRouter');

	/**
	 * A {@link Router} that provides request-response messaging via AWS SQS.
	 *
	 * @public
	 * @extends {Router}
	 * @param {SqsProvider} sqsProvider
	 * @param {RexExp[]=} suppressExpressions
	 * @param {Object=} tags
	 * @param {String=} identifier
	 */
	class AwsRouter extends Router {
		constructor(sqsProvider, suppressExpressions, tags, identifier) {
			super(suppressExpressions);

			assert.argumentIsRequired(sqsProvider, 'sqsProvider', SqsProvider, 'SqsProvider');
			assert.argumentIsOptional(tags, 'tags', Object);
			assert.argumentIsOptional(identifier, 'identifier', String);

			this._sqsProvider = sqsProvider;

			this._pendingRequests = { };
			this._routerId = identifier || uuid.v4();

			this._requestHandlers = { };

			this._createOptions = null;

			if (tags) {
				this._createOptions = { };
				this._createOptions.tags = tags;
			}

			this._disposeStack = new DisposableStack();
		}

		_start() {
			logger.debug('AWS router starting');

			return Promise.resolve()
				.then(() => {
					return this._sqsProvider.start();
				}).then(() => {
					const responseQueueName = getResponseChannel(this._routerId);

					const responseObserver = this._sqsProvider.observe(responseQueueName, (message) => {
						if (is.string(message.id) && this._pendingRequests.hasOwnProperty(message.id)) {
							const callbacks = this._pendingRequests[message.id];

							if (is.boolean(message.success) && !message.success) {
								callbacks.reject('Request failed');
							} else if (is.object(message.payload)) {
								callbacks.resolve(message.payload);
							}
						}
					}, 100, 20000, 10, this._createOptions);

					const responseQueueBinding = Disposable.fromAction(() => {
						this._sqsProvider.deleteQueue(responseQueueName);
					});

					this._disposeStack.push(responseQueueBinding);
					this._disposeStack.push(responseObserver);

					logger.debug('AWS router started');
				});
		}

		_canRoute(messageType) {
			return true;
		}

		_route(messageType, payload, timeout, forget) {
			logger.debug('Routing message to AWS [', messageType, ']');
			logger.trace(payload);

			const messageId = uuid.v4();

			let senderToUse;

			if (forget) {
				senderToUse = null;
			} else {
				senderToUse = this._routerId;
			}

			const envelope = {
				id: messageId,
				sender: senderToUse,
				payload: payload
			};

			const routePromise = promise.build((resolveCallback, rejectCallback) => {
				if (forget) {
					resolveCallback(null);

					return;
				}

				this._pendingRequests[messageId] = {
					resolve: resolveCallback,
					reject: rejectCallback
				};
			});

			const sendPromise = this._sqsProvider.send(messageType, envelope, null, this._createOptions)
				.catch((e) => {
					logger.error('Request routing failed. Unable to enqueue request message.', e);

					throw e;
				}).then(() => {
					return routePromise;
				});

			return promise.timeout(sendPromise, timeout)
				.then((response) => {
					delete this._pendingRequests[messageId];

					return response;
				}).catch((e) => {
					delete this._pendingRequests[messageId];

					throw e;
				});
		}

		_register(messageType, handler) {
			logger.debug('Registering AWS handler for [', messageType, ']');

			const registerObserver = this._sqsProvider.observe(messageType, (message) => {
				if (!is.string(message.id) || !is.object(message.payload) || !(is.string(message.sender) || message.sender === null)) {
					logger.warn(`Dropping malformed request received from SQS queue [ ${messageType} ]`);

					return;
				}

				let handlerPromise = Promise.resolve()
					.then(() => {
						return handler(message.payload);
					});

				if (message.sender !== null) {
					const respond = (success, response) => {
						const responseQueueName = getResponseChannel(message.sender);

						const envelope = {
							id: message.id,
							success: success,
							payload: response || {}
						};

						return this._sqsProvider.send(responseQueueName, envelope, null, this._createOptions);
					};

					handlerPromise = handlerPromise.then((response) => {
						return respond(true, response);
					}).catch((e) => {
						logger.error('Request processing failed. Responding with failure message.', e);

						return respond(false);
					});
				} else {
					handlerPromise = handlerPromise.catch((e) => {
						logger.error('Request processing failed.', e);
					});
				}

				return handlerPromise;
			}, 100, 20000, 10, this._createOptions);

			this._requestHandlers[messageType] = registerObserver;

			return registerObserver;
		}

		_onDispose() {
			this._disposeStack.dispose();

			logger.debug('AWS router disposed');
		}

		toString() {
			return '[AwsRouter]';
		}
	}

	function getResponseChannel(routerId) {
		return `response-${routerId}`;
	}

	return AwsRouter;
})();
