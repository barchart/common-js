const assert = require('./../lang/assert'),
	is = require('./../lang/is'),
	Disposable = require('./../lang/Disposable'),
	Event = require('./../messaging/Event');

module.exports = (() => {
	'use strict';

	class Model extends Disposable {
		constructor(propertyNames, propertyObservers, equalityPredicates) {
			super();

			this._propertyNames = propertyNames;

			this._transactionCommit = new Event(this);

			this._transactionOpen = false;
			this._transactionData = null;

			this._trackerOpen = false;
			this._trackerData = null;

			this._sequence = 0;

			const observers = propertyObservers || { };
			const predicates = equalityPredicates || { };

			for (let i = 0; i < this._propertyNames.length; i++) {
				const propertyName = propertyNames[i];

				createProperty.call(this, propertyName, observers[propertyName] || emptyFunction, predicates[propertyName] || checkEquals);
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

				if (this._trackerOpen) {
					this._trackerData = this._trackerData || { };

					for (let propertyName in this._transactionData) {
						this._trackerData[propertyName] = this._transactionData[propertyName];
					}
				}

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

		startTracker() {
			if (this._trackerOpen) {
				return;
			}

			this._trackerOpen = true;
		}

		resetTracker() {
			if (!this._trackerOpen) {
				return null;
			}

			if (this.getIsDisposed()) {
				return null;
			}

			const returnRef = this._trackerData;

			this._trackerData = null;

			return returnRef;
		}

		stopTracking() {
			if (!this._trackerOpen) {
				return;
			}

			if (this.getIsDisposed()) {
				return;
			}

			this._trackerOpen = false;
			this._trackerData = null;
		}

		getSnapshot() {
			const snapshot = {};

			for (let i = 0; i < this._propertyNames.length; i++) {
				const propertyName = this._propertyNames[i];

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

	function checkEquals(a, b) {
		return a === b;
	}

	function createProperty(propertyName, propertyObserver, equalityPredicate) {
		let propertyValue = null;

		Object.defineProperty(this, propertyName, {
			get: () => {
				return propertyValue;
			},
			set: (value) => {
				const valueToAssign = is.undefined(value) ? null : value;

				if (equalityPredicate(propertyValue, valueToAssign)) {
					return;
				}

				propertyValue = valueToAssign;

				const implicit = !this._transactionOpen;

				if (implicit) {
					this.beginTransaction();
				}

				this._transactionData = this._transactionData || {};
				this._transactionData[propertyName] = propertyValue;

				propertyObserver(this);

				if (implicit) {
					this.endTransaction();
				}
			}
		});
	}

	return Model;
})();