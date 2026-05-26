const log4js = require('log4js'),
	cluster = require('cluster'),
	process = require('process');

const assert = require('@barchart/common-js/lang/assert'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
	Event = require('@barchart/common-js/messaging/Event');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('common-node/cluster/MessageProvider');

	class MessageProvider {
		constructor() {
			this._started = false;
			this._startPromise = null;
		}

		start() {
			if (this._startPromise === null) {
				this._startPromise = Promise.all([ sender.start(), receiver.start() ])
					.then(() => {

					}).then(() => {
						this._started = true;

						return this;
					});
			}

			return this._startPromise;
		}

		send(type, payload, target) {
			if (!this._started) {
				throw new Error('The message provider has not been started.');
			}

			sender.send(type, payload, target);
		}

		broadcast(type, payload) {
			if (!this._started) {
				throw new Error('The message provider has not been started.');
			}

			sender.broadcast(type, payload);
		}

		handle(type, handler) {
			if (!this._started) {
				throw new Error('The message provider has not been started.');
			}

			return receiver.handle(type, handler);
		}

		registerPeerConnectedObserver(handler) {
			if (!this._started) {
				throw new Error('The message provider has not been started.');
			}

			return receiver.registerPeerConnectedObserver(handler);
		}

		toString() {
			return '[MessageProvider]';
		}
	}

	class Receiver {
		constructor() {
			this._handlers = { };

			this._peerConnected = new Event(this);

			this._startPromise = null;
		}

		start() {
			if (this._startPromise === null) {
				this._startPromise = Promise.resolve()
					.then(() => {
						return this._start();
					}).then(() => {
						return this;
					});
			}

			return this._startPromise;
		}

		_start() {
			return;
		}

		handle(type, handler) {
			assert.argumentIsRequired(type, 'type', String);
			assert.argumentIsRequired(handler, 'handler', Function);

			if (this._handlers.hasOwnProperty(type)) {
				throw new Error('Unable to add new handler for ' + type + ' to cluster receiver, a handler for that type already exists.');
			}

			this._handlers[type] = handler;

			return Disposable.fromAction(() => {
				delete this._handlers[type];
			});
		}

		registerPeerConnectedObserver(handler) {
			return this._peerConnected.register(handler);
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
					const handler = this._handlers[envelope.t];

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

				this._peerConnected.fire(s);
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
				const handler = this._handlers[envelope.t];

				if (handler) {
					handler(envelope.s, envelope.t, envelope.p);
				}
			});

			this._peerConnected.fire(0);
		}
	}

	class Sender {
		constructor(id) {
			this._id = id;

			this._startPromise = null;
		}

		start() {
			if (this._startPromise === null) {
				this._startPromise = Promise.resolve()
					.then(() => {
						return this._start();
					}).then(() => {
						return this;
					});
			}

			return this._startPromise;
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
			cluster.workers[target].send(Sender.getMessage(this._id, type, payload));
		}

		broadcast(type, payload) {
			const message = Sender.getMessage(this._id, type, payload);

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
			if (this._id === null) {
				throw new Error('Unable to send message without worker identifier.');
			}

			process.send(Sender.getMessage(this._id, type, payload));
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

	return MessageProvider;
})();