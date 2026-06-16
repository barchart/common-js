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

	toString() {
		return '[ActionBuilder]';
	}
}
