/**
 * Base class for transforming data.
 *
 * @public
 * @interface
 */
export default class Writer {
	constructor() {

	}

	/**
	 * Reads a source object and transcribes it to the target object.
	 *
	 * @public
	 * @param {object} source
	 * @param {object} target
	 * @returns {object}
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
	 * @param {object} source
	 * @param {object} target
	 * @returns {object}
	 */
	_write(source, target) {
		return;
	}

	/**
	 * @public
	 * @param {object} source
	 * @param {object} target
	 * @return {boolean}
	 */
	canWrite(source, target) {
		return this._canWrite(source, target);
	}

	/**
	 * @protected
	 * @abstract
	 * @param {object} source
	 * @param {object} target
	 * @return {boolean}
	 */
	_canWrite(source, target) {
		return true;
	}

	/**
	 * Returns the separator.
	 *
	 * @public
	 * @static
	 * @returns {string}
	 */
	static get SEPARATOR() {
		return '.';
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Writer]';
	}
}
