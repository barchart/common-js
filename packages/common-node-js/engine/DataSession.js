import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';
import * as array from '@barchart/common-js/lang/array.js';

import PriorityQueue from '@barchart/common-js/collections/specialized/PriorityQueue.js';

import DataProvider from './DataProvider.js';
import DataOperation from './DataOperation.js';
import DataOperationContainer from './DataOperationContainer.js';
import DataOperationComparators from './DataOperationComparators.js';
import DataOperationResult from './DataOperationResult.js';

import log4js from 'log4js';
import * as uuid from 'uuid';

const logger = log4js.getLogger('common-node/engine/DataSession');

let instance = 0;

/**
 * The manager for {@link DataOperation} execution. This should be a very short-lived
 * object -- quickly adding operations, then flushing, then discarding.
 *
 * @public
 */
export default class DataSession {
	#enqueueCounter;
	#flushed;
	#instanceCounter;
	#instanceId;
	#name;
	#pending;
	#processed;
	#resultTypes;
	#userEnqueued;

	/**
	 * @param {Function=} comparator - The comparator used to sort {@link DataOperation} instances in a {@link PriorityQueue}.
	 */
	constructor(comparator) {
		assert.argumentIsOptional(comparator, 'comparator', Function);

		this.#name = null;

		this.#instanceCounter = ++instance;
		this.#instanceId = uuid.v4();

		this.#enqueueCounter = 0;

		this.#pending = new PriorityQueue(comparator || DataOperationComparators.DEFAULT);
		this.#processed = [ ];
		this.#userEnqueued = [ ];

		this.#resultTypes = [ ];

		this.#flushed = false;
	}

	/**
	 * Returns a description of the session.
	 *
	 * @public
	 * @returns {string|null}
	 */
	get name() {
		return this.#name;
	}

	/**
	 * Sets a name for the session.
	 *
	 * @public
	 * @param {string} name
	 * @returns {DataSession}
	 */
	withName(name) {
		assert.argumentIsRequired(name, 'name', String);

		this.#name = name;

		return this;
	}

	/**
	 * Overrides default behavior for flush results. If supplied, the result of
	 * any {@link DataOperation} with the matching type will be returned when
	 * the session flushes.
	 *
	 * @public
	 * @param {Function} type
	 * @returns {DataSession}
	 */
	withResultType(type) {
		assert.argumentIsValid(type, 'type', x => is.extension(DataOperation, type), 'inherits DataOperation');

		this.#resultTypes.push(type);
		this.#resultTypes = array.unique(this.#resultTypes);

		return this;
	}

	/**
	 * Adds a new {@link DataOperation} and returns the current instance.
	 *
	 * @public
	 * @param {DataOperation} operation
	 * @returns {DataSession}
	 */
	withOperation(operation) {
		assert.argumentIsRequired(operation, 'operation', DataOperation, 'DataOperation');

		if (this.#flushed) {
			throw new Error('Unable to add operation to session, it has been flushed.');
		}

		this.#enqueue(new DataOperationContainer(operation, operation.stage, operation.adjustment));

		return this;
	}

	/**
	 * Processes all the {@link DataOperation} instances held within the session.
	 *
	 * @public
	 * @async
	 * @param {DataProvider} dataProvider
	 * @returns {Promise}
	 */
	async flush(dataProvider) {
		assert.argumentIsRequired(dataProvider, 'dataProvider', DataProvider, 'DataProvider');

		if (this.#flushed) {
			throw new Error(`Session [ ${this.#instanceCounter}  has already been flushed.`);
		}

		this.#flushed = true;

		logger.info('Session [', this.#instanceCounter, '] flush starting [', this.#instanceId, ']');

		if (this.#pending.empty()) {
			logger.warn('Session [', this.#instanceCounter, '] has no operations');
		}

		let operationCounter = 0;

		const results = [ ];

		let outputIndicies;

		if (this.#resultTypes.length === 0) {
			outputIndicies = [ ];
		} else {
			outputIndicies = this.#resultTypes.map(() => [ ]);
		}

		const flushRecursive = async (previousResult) => {
			if (this.#pending.empty()) {
				return previousResult;
			}

			let operation = null;
			let operationCount;

			while (operation === null && !this.#pending.empty()) {
				const candidate = this.#pending.dequeue().operation;

				operationCount = ++operationCounter;

				if (candidate.equals(previousResult.operation)) {
					logger.debug('Session [', this.#instanceCounter, '] operation [', operationCount, '][', candidate.toString() ,'] discarded as duplicate');
				} else {
					operation = candidate;
				}
			}

			if (operation === null) {
				return previousResult;
			}

			this.#processed.push(operation);

			logger.debug('Session [', this.#instanceCounter, '] operation [', operationCount, '][', operation.toString() ,'] starting');

			const result = await operation.process(dataProvider, this.#instanceId, this.#name);

			logger.debug('Session [', this.#instanceCounter, '] operation [', operationCount, '][', operation.toString() ,'] complete');

			results.push(result);

			const operationIndex = results.length - 1;

			if (this.#resultTypes.length === 0) {
				const resultIndex = this.#userEnqueued.findIndex(o => o === result.operation);

				if (!(resultIndex < 0)) {
					outputIndicies[resultIndex] = operationIndex;
				}
			} else {
				const resultIndex = this.#resultTypes.findIndex(t => operation instanceof t);

				if (!(resultIndex < 0)) {
					outputIndicies[resultIndex].push(operationIndex);
				}
			}

			result.children.forEach(container => this.#enqueue(container));

			return flushRecursive(result);
		};

		await flushRecursive(DataOperationResult.getInitial());

		const transformedResults = results.reduceRight((resolvedResults, result) => {
			const spawnResults = result.children.map((spawnContainer) => {
				return resolvedResults.find((previousResult) => previousResult.operation === spawnContainer.operation);
			});

			resolvedResults.push(result.operation.transformResult(result, spawnResults));

			return resolvedResults;
		}, [ ]);

		const resolveOutput = (outputIndex) => {
			const reversedIndex = results.length - outputIndex - 1;

			return transformedResults[reversedIndex].result;
		};

		const output = outputIndicies.map((i) => {
			if (is.array(i)) {
				return i.map(j => resolveOutput(j));
			} else {
				return resolveOutput(i);
			}
		});

		logger.info('Session [', this.#instanceCounter, '] flush finished [', this.#instanceId, ']');

		if (output.length === 1) {
			return output[0];
		} else {
			return output;
		}
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[DataSession]';
	}


	#enqueue(container) {
		container.order = ++this.#enqueueCounter;

		this.#pending.enqueue(container);

		if (!this.#flushed) {
			this.#userEnqueued.push(container.operation);
			}
		}
}
