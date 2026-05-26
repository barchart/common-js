module.exports = (() => {
	'use strict';

	/**
	 * Base class for transforming data.
	 *
	 * @public
	 * @interface
	 */
	class Writer {
		constructor() {

		}

		/**
		 * Reads a source object and transcribes it to the target object.
		 *
		 * @public
		 * @param {Object} source
		 * @param {Object} target
		 * @returns {Object}
		 */
		write(source, target) {
			if (this.canWrite(source, target)) {
				this._write(source, target);
			}

			return target;
		}

		/**
		 * @protected
		 * @abstract
		 * @param {Object} source
		 * @param {Object} target
		 * @returns {Object}
		 */
		_write(source, target) {
			return;
		}

		/**
		 * @public
		 * @param {Object} source
		 * @param {Object} target
		 * @return {Boolean}
		 */
		canWrite(source, target) {
			return this._canWrite(source, target);
		}

		/**
		 * @protected
		 * @abstract
		 * @param {Object} source
		 * @param {Object} target
		 * @return {Boolean}
		 */
		_canWrite(source, target) {
			return true;
		}

		static get SEPARATOR() {
			return '.';
		}

		toString() {
			return '[Writer]';
		}
	}

	return Writer;
})();