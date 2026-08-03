import * as assert from '@barchart/common-js/lang/assert.js';

import Disposable from '@barchart/common-js/lang/Disposable.js';
import Event from '@barchart/common-js/messaging/Event.js';

import log4js from 'log4js';
import cluster from 'cluster';
import process from 'process';

const logger = log4js.getLogger('common-node/cluster/MessageProvider');

/**
 * Provides message services.
 *
 * @public
 */
export default class MessageProvider {
	#startPromise;
	#started;

	constructor() {
		this.#started = false;
		this.#startPromise = null;
	}

	/**
	 * Starts the component.
	 *
	 * @public
	 * @async
	 * @returns {Promise<*>}
	 */
	async start() {
		if (this.#startPromise === null) {
			this.#startPromise = (async () => {
				await Promise.all([ sender.start(), receiver.start() ]);

				this.#started = true;

				return this;
			})();
		}

		return this.#startPromise;
	}

	/**
	 * Sends a message.
	 *
	 * @public
	 * @param {string} type
	 * @param {object} payload
	 * @param {object} target
	 */
	send(type, payload, target) {
		if (!this.#started) {
			throw new Error('The message provider has not been started.');
		}

		sender.send(type, payload, target);
	}

	/**
	 * Broadcasts a message.
	 *
	 * @public
	 * @param {string} type
	 * @param {object} payload
	 */
	broadcast(type, payload) {
		if (!this.#started) {
			throw new Error('The message provider has not been started.');
		}

		sender.broadcast(type, payload);
	}

	/**
	 * Registers a message handler.
	 *
	 * @public
	 * @param {string} type
	 * @param {Function} handler
	 * @returns {Disposable}
	 */
	handle(type, handler) {
		if (!this.#started) {
			throw new Error('The message provider has not been started.');
		}

		return receiver.handle(type, handler);
	}

	/**
	 * Runs the register peer connected observer operation.
	 *
	 * @public
	 * @param {Function} handler
	 * @returns {*}
	 */
	registerPeerConnectedObserver(handler) {
		if (!this.#started) {
			throw new Error('The message provider has not been started.');
		}

		return receiver.registerPeerConnectedObserver(handler);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[MessageProvider]';
	}
}

/**
 * Provides receiver behavior.
 */
class Receiver {
	#handlers;
	#peerConnected;
	#startPromise;

	constructor() {
		this.#handlers = { };

		this.#peerConnected = new Event(this);

		this.#startPromise = null;
	}

	/**
	 * Starts the component.
	 *
	 * @public
	 * @async
	 * @returns {Promise<*>}
	 */
	async start() {
		if (this.#startPromise === null) {
			this.#startPromise = (async () => {
				await this._start();

				return this;
			})();
		}

		return this.#startPromise;
	}

	/**
	 * Starts the component.
	 *
	 * @protected
	 * @returns {*}
	 */
	_start() {
		return;
	}

	/**
	 * Registers a handler.
	 *
	 * @public
	 * @param {string} type - The type.
	 * @param {Function} handler - The handler.
	 * @returns {*}
	 */
	handle(type, handler) {
		assert.argumentIsRequired(type, 'type', String);
		assert.argumentIsRequired(handler, 'handler', Function);

		if (Object.hasOwn(this.#handlers, type)) {
			throw new Error('Unable to add new handler for ' + type + ' to cluster receiver, a handler for that type already exists.');
		}

		this.#handlers[type] = handler;

		return Disposable.fromAction(() => {
			delete this.#handlers[type];
		});
	}

	/**
	 * Registers the peer connected observer.
	 *
	 * @public
	 * @param {Function} handler - The handler.
	 * @returns {*}
	 */
	registerPeerConnectedObserver(handler) {
		return this.#peerConnected.register(handler);
	}

	/**
	 * Returns the handler.
	 *
	 * @protected
	 * @param {string} type - The type.
	 * @returns {*}
	 */
	_getHandler(type) {
		return this.#handlers[type];
	}

	/**
	 * Runs the fire peer connected operation.
	 *
	 * @protected
	 * @param {*} peer - The peer.
	 * @returns {*}
	 */
	_firePeerConnected(peer) {
		this.#peerConnected.fire(peer);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Receiver]';
	}
}

/**
 * Provides master receiver behavior.
 */
class MasterReceiver extends Receiver {
	constructor() {
		super();
	}

	/**
	 * Starts the component.
	 *
	 * @protected
	 */
	_start() {
		const connectToWorker = (worker) => {
			logger.info('Master listening on IPC channel to messages from worker', worker.id);

			worker.on('message', (message) => {
				logger.trace('Master received message from worker process', worker.id, message);

				const envelope = message;
				const handler = this._getHandler(envelope.t);

				if (handler) {
					handler(envelope.s, envelope.t, envelope.p);
				}
			});
		};

		cluster.on('online', (worker) => {
			connectToWorker(worker);
		});

		Object.keys(cluster.workers).forEach((id) => {
			connectToWorker(cluster.workers[id]);
		});

		const readyBinding = this.handle('ready', (s, t, p) => {
			logger.info('Peer', s, 'signaled ready');

			this._firePeerConnected(s);
		});
	}
}

/**
 * Provides worker receiver behavior.
 */
class WorkerReceiver extends Receiver {
	constructor() {
		super();
	}

	/**
	 * Starts the component.
	 *
	 * @protected
	 */
	_start() {
		process.on('message', (message) => {
			logger.trace('Worker process', cluster.worker.id, 'received message from master process', message);

			const envelope = message;
			const handler = this._getHandler(envelope.t);

			if (handler) {
				handler(envelope.s, envelope.t, envelope.p);
			}
		});

		this._firePeerConnected(0);
	}
}

/**
 * Provides sender behavior.
 */
class Sender {
	#id;
	#startPromise;

	/**
	 * @param {number} id - The id.
	 */
	constructor(id) {
		this.#id = id;

		this.#startPromise = null;
	}

	/**
	 * Starts the component.
	 *
	 * @public
	 * @async
	 * @returns {Promise<*>}
	 */
	async start() {
		if (this.#startPromise === null) {
			this.#startPromise = (async () => {
				await this._start();

				return this;
			})();
		}

		return this.#startPromise;
	}

	/**
	 * Starts the component.
	 *
	 * @protected
	 * @returns {*}
	 */
	_start() {
		return;
	}

	/**
	 * Sends a message.
	 *
	 * @public
	 * @param {string} type - The type.
	 * @param {object} payload - The payload.
	 * @param {number} target - The target.
	 * @returns {*}
	 */
	send(type, payload, target) {
		return;
	}

	/**
	 * Broadcasts a message.
	 *
	 * @public
	 * @param {string} type - The type.
	 * @param {object} payload - The payload.
	 * @returns {*}
	 */
	broadcast(type, payload) {
		return;
	}

	/**
	 * Returns the id.
	 *
	 * @protected
	 * @returns {*}
	 */
	_getId() {
		return this.#id;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Sender]';
	}

	/**
	 * Returns the message.
	 *
	 * @public
	 * @static
	 * @param {string} sender - The sender.
	 * @param {string} type - The type.
	 * @param {object} payload - The payload.
	 * @returns {*}
	 */
	static getMessage(sender, type, payload) {
		return {
			s: sender,
			t: type,
			p: payload || { }
		};
	}
}

/**
 * Provides master sender behavior.
 */
class MasterSender extends Sender {
	constructor() {
		super(0);
	}

	/**
	 * Sends a message.
	 *
	 * @public
	 * @param {string} type - The type.
	 * @param {object} payload - The payload.
	 * @param {number} target - The target.
	 * @returns {*}
	 */
	send(type, payload, target) {
		cluster.workers[target].send(Sender.getMessage(this._getId(), type, payload));
	}

	/**
	 * Broadcasts a message.
	 *
	 * @public
	 * @param {string} type - The type.
	 * @param {object} payload - The payload.
	 * @returns {*}
	 */
	broadcast(type, payload) {
		const message = Sender.getMessage(this._getId(), type, payload);

		Object.keys(cluster.workers).forEach((id) => {
			cluster.workers[id].send(message);
		});
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[MasterSender]';
	}
}

/**
 * Provides worker sender behavior.
 */
class WorkerSender extends Sender {
	constructor() {
		super(cluster.worker.id);
	}

	/**
	 * Starts the component.
	 *
	 * @protected
	 * @returns {*}
	 */
	_start() {
		this.send('ready', { }, 0);
	}

	/**
	 * Sends a message.
	 *
	 * @public
	 * @param {string} type - The type.
	 * @param {object} payload - The payload.
	 * @param {number} target - The target.
	 * @returns {*}
	 */
	send(type, payload, target) {
		if (this._getId() === null) {
			throw new Error('Unable to send message without worker identifier.');
		}

		process.send(Sender.getMessage(this._getId(), type, payload));
	}

	/**
	 * Broadcasts a message.
	 *
	 * @public
	 * @param {string} type - The type.
	 * @param {object} payload - The payload.
	 * @returns {*}
	 */
	broadcast(type, payload) {
		this.send(type, payload, 0);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[WorkerSender]';
	}
}

const receiver = (() => {
	if (cluster.isWorker) {
		return new WorkerReceiver();
	} else {
		return new MasterReceiver();
	}
})();

const sender = (() => {
	if (cluster.isWorker) {
		return new WorkerSender();
	} else {
		return new MasterSender();
	}
})();
