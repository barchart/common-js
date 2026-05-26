module.exports = (() => {
	'use strict';

	/**
	 * Converts a simple value (e.g. a number) into an object used to define
	 * the value in DynamoDB notation. Also performs the inverse.
	 *
	 * @public
	 * @interface
	 */
	class AttributeSerializer {
		constructor() {

		}

		/**
		 * Wraps up a value as the DynamoDB representation. For example,
		 * an implementation for numbers should serialize 19 as the
		 * following object: { "N": "19" }.
		 *
		 * @public
		 * @abstract
		 * @param {*} value - The value to serialize.
		 * @returns {Object}
		 */
		serialize(value) {
			return value;
		}

		/**
		 * Unwraps the DynamoDB representation and returns a single value. For
		 * example, an implementation for numbers should deserialize the object
		 * { "N": "19" } to the number 19. This operation is the inverse of
		 * {@link AttributeSerializer#serialize}.
		 *
		 * @public
		 * @abstract
		 * @param {Object} wrapper - The DynamoDB wrapper to extract a value from.
		 * @returns {Object}
		 */
		deserialize(wrapper) {
			return wrapper;
		}

		toString() {
			return '[AttributeSerializer]';
		}
	}

	return AttributeSerializer;
})();