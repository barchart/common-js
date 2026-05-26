const log4js = require('log4js');

const assert = require('@barchart/common-js/lang/assert'),
	Disposable = require('@barchart/common-js/lang/Disposable');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('common-node/streams/Transformation');

	/**
	 * The base class for a logic package used by {@link ObjectTransformer}.
	 *
	 * @public
	 * @interface
	 * @extends {Disposable}
	 * @param {String=} description - Describes the transformation, intended for logging purposes.
	 */
	class Transformation extends Disposable {
		constructor(description) {
			super();

			assert.argumentIsRequired(description, 'description', String);

			this._description = description;
		}

		/**
		 * Indicates if the {@link Transformation#canTransform} and {@link Transformation#transform}
		 * functions will execute synchronously.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get synchronous() {
			return true;
		}

		/**
		 * Indicates if the proposed input can successfully be processed by the
		 * {@link Transformation#transform} function.
		 *
		 * @param {*} input
		 * @returns {Boolean}
		 */
		canTransform(input) {
			return this._canTransform(input);
		}

		/**
		 * @protected
		 * @abstract
		 * @param {*} input
		 * @returns {Boolean}
		 */
		_canTransform(input) {
			return true;
		}

		/**
		 * Transforms input (could mutate the input or return another object).
		 *
		 * @param {*} input
		 * @returns {*}
		 */
		transform(input) {
			if (!this._canTransform(input)) {
				logger.error(`Unable to perform transformation [ ${this._description} ]`);
				logger.error(input);

				throw new Error(`Unable to perform transformation [ ${this._description} ]`);
			}

			return this._transform(input);
		}

		/**
		 * @protected
		 * @abstract
		 * @param {*} input
		 * @returns {Boolean}
		 */
		_transform(input) {
			return input;
		}

		_onDispose() {
			return;
		}

		toString() {
			return '[Transformation]';
		}
	}

	return Transformation;
})();
