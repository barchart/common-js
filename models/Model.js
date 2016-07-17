var assert = require('./../lang/assert');
var Disposable = require('./../lang/Disposable');
var Event = require('./../messaging/Event');

module.exports = (() => {
	class Model extends Disposable {
		constructor(propertyNames, propertyObservers) {
			super();

			this._propertyNames = propertyNames;

			this._transactionCommit = new Event(this);

			this._transactionOpen = false;
			this._transactionData = null;

			this._sequence = 0;

			var observers = propertyObservers || { };

			for (let i = 0; i < this._propertyNames.length; i++) {
				var propertyName = propertyNames[i];

				createProperty.call(this, propertyName, observers[propertyName] || emptyFunction);
			}
		}

		beginTransaction() {
			if (this._transactionOpen) {
				return;
			}

			this._transactionOpen = true;
		}

		endTransaction() {
			if (!this._transactionOpen) {
				return;
			}

			if (this.getIsDisposed()) {
				return;
			}

			this._transactionOpen = false;

			if (this._transactionData !== null) {
				this._formatTransactionData(this._transactionData);

				this._transactionData.sequence = this._sequence++;

				this._transactionCommit.fire(this._transactionData);

				this._transactionData = null;
			}
		}

		_formatTransactionData(transactionData) {
			return;
		}

		executeTransaction(processor) {
			assert.argumentIsRequired(processor, 'processor', Function);

			this.beginTransaction();
			processor(this);
			this.endTransaction();
		}

		onTransactionCommitted(observer) {
			if (this.getIsDisposed()) {
				return;
			}

			return this._transactionCommit.register(observer);
		}

		getSnapshot() {
			const snapshot = {};

			for (let i = 0; i < this._propertyNames.length; i++) {
				var propertyName = this._propertyNames[i];

				snapshot[propertyName] = this[propertyName];
			}

			snapshot.sequence = this._sequence;

			return snapshot;
		}

		_onDispose() {
			this._transactionCommit.dispose();
			this._transactionCommit = null;
		}

		toString() {
			return '[Model]';
		}
	}

	function emptyFunction() {
		return;
	}

	function createProperty(propertyName, propertyObserver) {
		var propertyValue;

		Object.defineProperty(this, propertyName, {
			get: () => {
				return propertyValue;
			},
			set: (value) => {
				if (propertyValue === value) {
					return;
				}

				propertyValue = value;

				const implicit = !this._transactionOpen;

				if (implicit) {
					this.beginTransaction();
				}

				this._transactionData = this._transactionData || {};
				this._transactionData[propertyName] = propertyValue;

				propertyObserver();

				if (implicit) {
					this.endTransaction();
				}
			}
		});
	}

	return Model;
})();