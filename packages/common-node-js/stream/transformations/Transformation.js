import * as assert from '@barchart/common-js/lang/assert.js';

import Disposable from '@barchart/common-js/lang/Disposable.js';

import log4js from 'log4js';

const logger = log4js.getLogger('common-node/streams/Transformation');

/**
 * The base class for a logic package used by {@link ObjectTransformer}.
 *
 * @public
 * @interface
 * @extends {Disposable}
 */
export default class Transformation extends Disposable {
	#description;

	/**
	 * @param {string} description - Describes the transformation, intended for logging purposes.
	 */
	constructor(description) {
		super();

		assert.argumentIsRequired(description, 'description', String);

		this.#description = description;
	}

	/**
	 * Indicates if the {@link Transformation#canTransform} and {@link Transformation#transform}
	 * functions will execute synchronously.
	 *
	 * @public
	 * @returns {boolean}
	 */
	get synchronous() {
		return true;
	}

	/**
	 * Indicates if the proposed input can successfully be processed by the
	 * {@link Transformation#transform} function.
	 *
	 * @public
	 * @param {*} input
	 * @returns {boolean}
	 */
	canTransform(input) {
		return this._canTransform(input);
	}

	/**
	 * @protected
	 * @abstract
	 * @param {*} input
	 * @returns {boolean}
	 */
	_canTransform(input) {
		return true;
	}

	/**
	 * Transforms input (could mutate the input or return another object).
	 *
	 * @public
	 * @param {*} input
	 * @returns {*}
	 */
	transform(input) {
		if (!this._canTransform(input)) {
			logger.error(`Unable to perform transformation [ ${this.#description} ]`);
			logger.error(input);

			throw new Error(`Unable to perform transformation [ ${this.#description} ]`);
		}

		return this._transform(input);
	}

	/**
	 * @protected
	 * @abstract
	 * @param {*} input
	 * @returns {*}
	 */
	_transform(input) {
		return input;
	}

	/**
	 * @protected
	 * @override
	 */
	_onDispose() {
		return;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Transformation]';
	}
}
