
/**
 * @typedef {import('../definitions/Action.js').default} Action
 */
/**
 * Base class for a fluent interface for building a {@link Action}.
 *
 * @public
 * @interface
 */
export default class ActionBuilder {
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

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[ActionBuilder]';
	}
}
