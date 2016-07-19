var _ = require('lodash');

var assert = require('./../lang/assert');
var Disposable = require('./../lang/Disposable');
var Event = require('./../messaging/Event');

module.exports = function() {
	var Model = Disposable.extend({
		init: function(propertyNames, propertyObservers) {
			this._propertyNames = propertyNames;

			this._transactionCommit = new Event(this);

			this._transactionOpen = false;
			this._transactionData = null;

			this._trackerOpen = false;
			this._trackerData = null;

			this._sequence = 0;

			var observers = propertyObservers || { };

			for (var i = 0; i < this._propertyNames.length; i++) {
				var propertyName = propertyNames[i];

				createProperty.call(this, propertyName, observers[propertyName] || emptyFunction);
			}
		},

		beginTransaction: function() {
			if (this._transactionOpen) {
				return;
			}

			this._transactionOpen = true;
		},

		endTransaction: function() {
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

					for (var propertyName in this._transactionData) {
						this._trackerData[propertyName] = this._transactionData[propertyName];
					}
				}

				this._transactionCommit.fire(this._transactionData);

				this._transactionData = null;
			}
		},

		_formatTransactionData: function(transactionData) {
			return;
		},

		executeTransaction: function(processor) {
			assert.argumentIsRequired(processor, 'processor', Function);

			this.beginTransaction();
			processor(this);
			this.endTransaction();
		},

		onTransactionCommitted: function(observer) {
			if (this.getIsDisposed()) {
				return;
			}

			return this._transactionCommit.register(observer);
		},

		startTracker: function() {
			if (this._trackerOpen) {
				return;
			}

			this._trackerOpen = true;
		},

		resetTracker: function() {
			if (!this._trackerOpen) {
				return null;
			}

			if (this.getIsDisposed()) {
				return null;
			}

			var returnRef = this._trackerData;

			this._trackerData = null;

			return returnRef;
		},

		stopTracking: function() {
			if (!this._trackerOpen) {
				return;
			}

			if (this.getIsDisposed()) {
				return;
			}

			this._trackerOpen = false;
			this._trackerData = null;
		},

		getSnapshot: function() {
			var snapshot = {};

			for (var i = 0; i < this._propertyNames.length; i++) {
				var propertyName = this._propertyNames[i];

				snapshot[propertyName] = this[propertyName];
			}

			snapshot.sequence = this._sequence;

			return snapshot;
		},

		_onDispose: function() {
			this._transactionCommit.dispose();
			this._transactionCommit = null;
		},

		toString: function() {
			return '[Model]';
		}
	});

	function emptyFunction() {
		return;
	}

	function createProperty(propertyName, propertyObserver) {
		var that = this;

		var propertyValue;

		Object.defineProperty(that, propertyName, {
			get: function() {
				return propertyValue;
			},
			set: function(value) {
				if (propertyValue === value) {
					return;
				}

				propertyValue = value;

				var implicit = !this._transactionOpen;

				if (implicit) {
					that.beginTransaction();
				}

				that._transactionData = that._transactionData || {};
				that._transactionData[propertyName] = propertyValue;

				propertyObserver();

				if (implicit) {
					that.endTransaction();
				}
			}
		});
	}

	return Model;
}();