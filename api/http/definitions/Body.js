const assert = require('./../../../lang/assert'),
	is = require('./../../../lang/is');

const BodyType = require('./BodyType');

module.exports = (() => {
	'use strict';

	/**
	 * The definition the body for an {@link Endpoint}.
	 *
	 * @public
	 * @param {String=} name
	 * @param {BodyType=} type
	 */
	class Body {
		constructor(name, type) {
			this._name = name || null;
			this._type = type || BodyType.NONE;
		}

		/**
		 * If necessary, the name of the variable (read from the payload) to
		 * use on the request body.
		 *
		 * @public
		 * @returns {String|null}
		 */
		get name() {
			return this._name;
		}

		/**
		 * The type of the parameter.
		 *
		 * @public
		 * @returns {BodyType}
		 */
		get type() {
			return this._type;
		}

		/**
		 * Throws an {@link Error} if the instance is invalid.
		 *
		 * @public
		 */
		validate() {
			if (this._name && !is.string(this._name)) {
				throw new Error('If present, the body name must be a non-zero-length string.');
			}

			if (!(this._type instanceof BodyType)) {
				throw new Error('Parameter type must be an instance of BodyType.');
			}
		}

		toString() {
			return `[Body]`;
		}
	}

	return Body;
})();