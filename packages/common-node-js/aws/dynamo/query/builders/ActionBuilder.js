module.exports = (() => {
	'use strict';

	/**
	 * Base class for a fluent interface for building a {@link Action}.
	 *
	 * @public
	 * @interface
	 */
	class ActionBuilder {
		constructor() {
		}

		/**
		 * The target of the action.
		 *
		 * @public
		 * @returns {Action}
		 */
		get action() {
			return null;
		}

		toString() {
			return '[ActionBuilder]';
		}
	}

	return ActionBuilder;
})();