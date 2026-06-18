import * as assert from './../lang/assert.js';
import * as is from './../lang/is.js';

import Disposable from './../lang/Disposable.js';
import Event from './../messaging/Event.js';

export default class Model extends Disposable {

	#propertyNames;
	#transactionCommit;
	#transactionOpen;
	#transactionData;
	#trackerOpen;
	#trackerData;
	#sequence;

	/**
	 * @param {string[]} propertyNames
	 * @param {object=} propertyObservers
	 * @param {object=} equalityPredicates
	 */
	constructor(propertyNames, propertyObservers, equalityPredicates) {
		super();

		this.#propertyNames = propertyNames;

		this.#transactionCommit = new Event(this);

		this.#transactionOpen = false;
		this.#transactionData = null;

		this.#trackerOpen = false;
		this.#trackerData = null;

		this.#sequence = 0;

		const observers = propertyObservers || { };
		const predicates = equalityPredicates || { };

		for (let i = 0; i < this.#propertyNames.length; i++) {
			const propertyName = propertyNames[i];

			this.#createProperty(propertyName, observers[propertyName] || emptyFunction, predicates[propertyName] || checkEquals);
		}
	}

	/**
	 * @public
	 */
	beginTransaction() {
		if (this.#transactionOpen) {
			return;
		}

		this.#transactionOpen = true;
	}

	/**
	 * @public
	 */
	endTransaction() {
		if (!this.#transactionOpen) {
			return;
		}

		if (this.disposed) {
			return;
		}

		this.#transactionOpen = false;

		if (this.#transactionData !== null) {
			this._formatTransactionData(this.#transactionData);

			this.#transactionData.sequence = this.#sequence++;

			if (this.#trackerOpen) {
				this.#trackerData = this.#trackerData || { };

				for (let propertyName in this.#transactionData) {
					this.#trackerData[propertyName] = this.#transactionData[propertyName];
				}
			}

			this.#transactionCommit.fire(this.#transactionData);

			this.#transactionData = null;
		}
	}

	/**
	 * @protected
	 * @param {object} transactionData
	 */
	_formatTransactionData(transactionData) {
		return;
	}

	/**
	 * @public
	 * @param {Function} processor
	 */
	executeTransaction(processor) {
		assert.argumentIsRequired(processor, 'processor', Function);

		this.beginTransaction();
		processor(this);
		this.endTransaction();
	}

	/**
	 * @public
	 * @param {Function} observer
	 * @returns {*}
	 */
	onTransactionCommitted(observer) {
		if (this.disposed) {
			return;
		}

		return this.#transactionCommit.register(observer);
	}

	/**
	 * @public
	 */
	startTracker() {
		if (this.#trackerOpen) {
			return;
		}

		this.#trackerOpen = true;
	}

	/**
	 * @public
	 * @returns {object|null}
	 */
	resetTracker() {
		if (!this.#trackerOpen) {
			return null;
		}

		if (this.disposed) {
			return null;
		}

		const returnRef = this.#trackerData;

		this.#trackerData = null;

		return returnRef;
	}

	/**
	 * @public
	 */
	stopTracking() {
		if (!this.#trackerOpen) {
			return;
		}

		if (this.disposed) {
			return;
		}

		this.#trackerOpen = false;
		this.#trackerData = null;
	}

	/**
	 * @public
	 * @returns {object}
	 */
	getSnapshot() {
		const snapshot = {};

		for (let i = 0; i < this.#propertyNames.length; i++) {
			const propertyName = this.#propertyNames[i];

			snapshot[propertyName] = this[propertyName];
		}

		snapshot.sequence = this.#sequence;

		return snapshot;
	}

	/**
	 * @protected
	 * @override
	 */
	_onDispose() {
		this.#transactionCommit.dispose();
		this.#transactionCommit = null;
	}

	#createProperty(propertyName, propertyObserver, equalityPredicate) {
		let propertyValue = null;

		Object.defineProperty(this, propertyName, {
			get: () => {
				return propertyValue;
			},
			set: (value) => {
				const valueToAssign = is.undef(value) ? null : value;

				if (equalityPredicate(propertyValue, valueToAssign)) {
					return;
				}

				propertyValue = valueToAssign;

				const implicit = !this.#transactionOpen;

				if (implicit) {
					this.beginTransaction();
				}

				this.#transactionData = this.#transactionData || {};
				this.#transactionData[propertyName] = propertyValue;

				propertyObserver(this);

				if (implicit) {
					this.endTransaction();
				}
			}
		});
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
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
