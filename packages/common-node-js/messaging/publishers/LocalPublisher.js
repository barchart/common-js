const log4js = require('log4js');

const Event = require('@barchart/common-js/messaging/Event');

const Publisher = require('./Publisher');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('common-node/messaging/publishers/LocalPublisher');

	class LocalPublisher extends Publisher {
		constructor(suppressExpressions) {
			super(suppressExpressions);

			this._subscriptions = {};
		}

		_publish(messageType, payload) {
			if (this._subscriptions.hasOwnProperty(messageType)) {
				this._subscriptions[messageType].fire(payload);
			}
		}

		_subscribe(messageType, handler) {
			if (!this._subscriptions.hasOwnProperty(messageType)) {
				this._subscriptions[messageType] = new Event(this);
			}

			return this._subscriptions[messageType].register(getEventHandlerForSubscription(handler));
		}

		_onDispose() {
			Object.keys(this._subscriptions).forEach((key) => {
				const event = this._subscriptions[key];

				event.dispose();
			});

			this._subscriptions = null;

			logger.debug('Local publisher disposed');
		}

		toString() {
			return '[LocalPublisher]';
		}
	}

	function getEventHandlerForSubscription(handler) {
		return (data, ignored) => {
			handler(data);
		};
	}

	return LocalPublisher;
})();
