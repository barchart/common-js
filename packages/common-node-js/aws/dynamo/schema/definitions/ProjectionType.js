const Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
	'use strict';

	/**
	 * Defines a category of {@link Projection}. Currently, there are three types;
	 * projecting all table's attributes, projecting only the table's keys, and
	 * projecting a custom subset of the table's attributes.
	 *
	 * @public
	 * @extends {Enum}
	 */
	class ProjectionType extends Enum {
		constructor(code, description) {
			super(code, description);
		}

		get custom() {
			return this.code === ProjectionType.CUSTOM.code;
		}

		static get ALL() {
			return projectionTypeAll;
		}

		static get KEYS() {
			return projectionTypeKeys;
		}

		static get CUSTOM() {
			return projectionTypeCustom;
		}

		toString() {
			return `[ProjectionType (code=${this.code})]`;
		}
	}

	const projectionTypeAll = new ProjectionType('ALL', 'All');
	const projectionTypeKeys = new ProjectionType('KEYS_ONLY', 'Keys');
	const projectionTypeCustom = new ProjectionType('INCLUDE', 'Custom');

	return ProjectionType;
})();