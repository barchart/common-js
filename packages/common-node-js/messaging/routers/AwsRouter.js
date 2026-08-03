import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';
import * as promise from '@barchart/common-js/lang/promise.js';

import Disposable from '@barchart/common-js/lang/Disposable.js';
import DisposableStack from '@barchart/common-js/collections/specialized/DisposableStack.js';

import Router from './Router.js';
import SqsProvider from './../../aws/SqsProvider.js';

import log4js from 'log4js';
import * as uuid from 'uuid';

const logger = log4js.getLogger('common-node/messaging/routers/AwsRouter');

/**
 * A {@link Router} that provides request-response messaging via AWS SQS.
 *
 * @public
 * @extends {Router}
 */
export default class AwsRouter extends Router {
	#createOptions;
	#disposeStack;
	#pendingRequests;
	#requestHandlers;
	#routerId;
	#sqsProvider;

	/**
	 * @param {SqsProvider} sqsProvider - The sqs provider.
	 * @param {RegExp[]=} suppressExpressions - The suppress expressions.
	 * @param {object=} tags - The tags.
	 * @param {string=} identifier - The identifier.
	 */
	constructor(sqsProvider, suppressExpressions, tags, identifier) {
		super(suppressExpressions);

		assert.argumentIsRequired(sqsProvider, 'sqsProvider', SqsProvider, 'SqsProvider');
		assert.argumentIsOptional(tags, 'tags', Object);
		assert.argumentIsOptional(identifier, 'identifier', String);

		this.#sqsProvider = sqsProvider;

		this.#pendingRequests = { };
		this.#routerId = identifier || uuid.v4();

		this.#requestHandlers = { };

		this.#createOptions = null;

		if (tags) {
			this.#createOptions = { };
			this.#createOptions.tags = tags;
		}

		this.#disposeStack = new DisposableStack();
	}

	/**
	 * @protected
	 * @override
	 * @async
	 * @returns {Promise<boolean>}
	 */
	async _start() {
		logger.debug('AWS router starting');

		await this.#sqsProvider.start();

		const responseQueueName = getResponseChannel(this.#routerId);

		const responseObserver = this.#sqsProvider.observe(responseQueueName, (message) => {
			if (is.string(message.id) && Object.hasOwn(this.#pendingRequests, message.id)) {
				const callbacks = this.#pendingRequests[message.id];

				if (is.boolean(message.success) && !message.success) {
					callbacks.reject('Request failed');
				} else if (is.object(message.payload)) {
					callbacks.resolve(message.payload);
				}
			}
		}, 100, 20000, 10, this.#createOptions);

		const responseQueueBinding = Disposable.fromAction(() => {
			this.#sqsProvider.deleteQueue(responseQueueName);
		});

		this.#disposeStack.push(responseQueueBinding);
		this.#disposeStack.push(responseObserver);

		logger.debug('AWS router started');

		return true;
	}

	/**
	 * @protected
	 * @override
	 * @param {string} messageType
	 * @returns {boolean}
	 */
	_canRoute(messageType) {
		return true;
	}

	/**
	 * @protected
	 * @override
	 * @async
	 * @param {string} messageType
	 * @param {*} payload
	 * @param {number} timeout
	 * @param {boolean} forget
	 * @returns {Promise<*>}
	 */
	async _route(messageType, payload, timeout, forget) {
		logger.debug('Routing message to AWS [', messageType, ']');
		logger.trace(payload);

		const messageId = uuid.v4();

		let senderToUse;

		if (forget) {
			senderToUse = null;
		} else {
			senderToUse = this.#routerId;
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

			this.#pendingRequests[messageId] = {
				resolve: resolveCallback,
				reject: rejectCallback
			};
		});

		const sendPromise = (async () => {
			try {
				await this.#sqsProvider.send(messageType, envelope, null, this.#createOptions);

				return routePromise;
			} catch (e) {
				logger.error('Request routing failed. Unable to enqueue request message.', e);

				throw e;
			}
		})();

		try {
			const response = await promise.timeout(sendPromise, timeout);

			delete this.#pendingRequests[messageId];

			return response;
		} catch (e) {
			delete this.#pendingRequests[messageId];

			throw e;
		}
	}

	/**
	 * @protected
	 * @override
	 * @async
	 * @param {string} messageType
	 * @param {Function} handler
	 * @returns {Promise<Disposable>}
	 */
	async _register(messageType, handler) {
		logger.debug('Registering AWS handler for [', messageType, ']');

		const registerObserver = this.#sqsProvider.observe(messageType, async (message) => {
			if (!is.string(message.id) || !is.object(message.payload) || !(is.string(message.sender) || message.sender === null)) {
				logger.warn(`Dropping malformed request received from SQS queue [ ${messageType} ]`);

				return;
			}

			if (message.sender !== null) {
				const respond = (success, response) => {
					const responseQueueName = getResponseChannel(message.sender);

					const envelope = {
						id: message.id,
						success: success,
						payload: response || {}
					};

					return this.#sqsProvider.send(responseQueueName, envelope, null, this.#createOptions);
				};

				try {
					const response = await handler(message.payload);

					return respond(true, response);
				} catch (e) {
					logger.error('Request processing failed. Responding with failure message.', e);

					return respond(false);
				}
			}

			try {
				await handler(message.payload);
			} catch (e) {
				logger.error('Request processing failed.', e);
			}
		}, 100, 20000, 10, this.#createOptions);

		this.#requestHandlers[messageType] = registerObserver;

		return registerObserver;
	}

	/**
	 * @protected
	 * @override
	 */
	_onDispose() {
		this.#disposeStack.dispose();

		logger.debug('AWS router disposed');
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[AwsRouter]';
	}
}

function getResponseChannel(routerId) {
	return `response-${routerId}`;
}
