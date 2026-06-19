import * as assert from '@barchart/common-js/lang/assert.js';

import Disposable from '@barchart/common-js/lang/Disposable.js';
import Event from '@barchart/common-js/messaging/Event.js';

import log4js from 'log4js';
import cluster from 'cluster';
import process from 'process';

const logger = log4js.getLogger('common-node/cluster/MessageProvider');

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
	 * @returns {Promise<*>}
	 */
	start() {
		if (this.#startPromise === null) {
			this.#startPromise = Promise.all([ sender.start(), receiver.start() ])
				.then(() => {

				}).then(() => {
					this.#started = true;

					return this;
				});
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

class Receiver {
	#handlers;
	#peerConnected;
	#startPromise;

	constructor() {
		this.#handlers = { };

		this.#peerConnected = new Event(this);

		this.#startPromise = null;
	}

	start() {
		if (this.#startPromise === null) {
			this.#startPromise = Promise.resolve()
				.then(() => {
					return this._start();
				}).then(() => {
					return this;
				});
		}

		return this.#startPromise;
	}

	_start() {
		return;
	}

	handle(type, handler) {
		assert.argumentIsRequired(type, 'type', String);
		assert.argumentIsRequired(handler, 'handler', Function);

		if (this.#handlers.hasOwnProperty(type)) {
			throw new Error('Unable to add new handler for ' + type + ' to cluster receiver, a handler for that type already exists.');
		}

		this.#handlers[type] = handler;

		return Disposable.fromAction(() => {
			delete this.#handlers[type];
		});
	}

	registerPeerConnectedObserver(handler) {
		return this.#peerConnected.register(handler);
	}

	_getHandler(type) {
		return this.#handlers[type];
	}

	_firePeerConnected(peer) {
		this.#peerConnected.fire(peer);
	}

	toString() {
		return '[Receiver]';
	}
}

class MasterReceiver extends Receiver {
	constructor() {
		super();
	}

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

class WorkerReceiver extends Receiver {
	constructor() {
		super();
	}

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

class Sender {
	#id;
	#startPromise;

	constructor(id) {
		this.#id = id;

		this.#startPromise = null;
	}

	start() {
		if (this.#startPromise === null) {
			this.#startPromise = Promise.resolve()
				.then(() => {
					return this._start();
				}).then(() => {
					return this;
				});
		}

		return this.#startPromise;
	}

	_start() {
		return;
	}

	send(type, payload, target) {
		return;
	}

	broadcast(type, payload) {
		return;
	}

	_getId() {
		return this.#id;
	}

	toString() {
		return '[Sender]';
	}

	static getMessage(sender, type, payload) {
		return {
			s: sender,
			t: type,
			p: payload || { }
		};
	}
}

class MasterSender extends Sender {
	constructor() {
		super(0);
	}

	send(type, payload, target) {
		cluster.workers[target].send(Sender.getMessage(this._getId(), type, payload));
	}

	broadcast(type, payload) {
		const message = Sender.getMessage(this._getId(), type, payload);

		Object.keys(cluster.workers).forEach((id) => {
			cluster.workers[id].send(message);
		});
	}

	toString() {
		return '[MasterSender]';
	}
}

class WorkerSender extends Sender {
	constructor() {
		super(cluster.worker.id);
	}

	_start() {
		this.send('ready', { }, 0);
	}

	send(type, payload, target) {
		if (this._getId() === null) {
			throw new Error('Unable to send message without worker identifier.');
		}

		process.send(Sender.getMessage(this._getId(), type, payload));
	}

	broadcast(type, payload) {
		this.send(type, payload, 0);
	}

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
