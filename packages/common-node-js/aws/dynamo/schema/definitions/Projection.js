const array = require('@barchart/common-js/lang/array'),
	is = require('@barchart/common-js/lang/is');

const Attribute = require('./Attribute'),
	ProjectionType = require('./ProjectionType');

module.exports = (() => {
	'use strict';

	/**
	 * The {@link Attribute} definitions that are included (i.e. projected) onto
	 * an {@link Index}.
	 *
	 * @public
	 */
	class Projection {
		constructor(type, attributes) {
			this._type = type;
			this._attributes = attributes || [ ];
		}

		/**
		 * The projection type.
		 *
		 * @public
		 * @returns {ProjectionType}
		 */
		get type() {
			return this._type;
		}

		/**
		 * The attributes that are "projected" (i.e. included) with an {@link Index}.
		 *
		 * @public
		 * @returns {Array<Attribute>}
		 */
		get attributes() {
			return [...this._attributes];
		}

		/**
		 * Throws an {@link Error} if the instance is invalid.
		 *
		 * @public
		 */
		validate() {
			if (!(this._type instanceof ProjectionType)) {
				throw new Error('Projection type is invalid.');
			}

			if (!is.array(this._attributes)) {
				throw new Error('Projection must have an array of attributes.');
			}

			if (!this._attributes.every(a => a instanceof Attribute)) {
				throw new Error('Projection attributes array can only contain attribute instances).');
			}

			if (array.uniqueBy(this._attributes, a => a.name).length !== this._attributes.length) {
				throw new Error('Projection attributes must be unique.');
			}

			if (this._type === ProjectionType.CUSTOM && this._attributes.length === 0) {
				throw new Error('Projection (custom) must have at least one attribute.');
			}

			if (this._type === ProjectionType.KEYS && this._attributes.length !== 0) {
				throw new Error('Projection (keys) cannot define any attributes.');
			}

			if (this._type === ProjectionType.ALL && this._attributes.length !== 0) {
				throw new Error('Projection (all) cannot define any attributes.');
			}

			this._attributes.forEach(a => a.validate());
		}

		/**
		 * Generates an object which is suitable for use by the AWS SDK.
		 *
		 * @public
		 * @returns {Object}
		 */
		toProjectionSchema() {
			this.validate();

			const schema = {
				ProjectionType: this._type.code
			};

			if (this._attributes.length > 0) {
				schema.NonKeyAttributes = this._attributes.map(a => a.name);
			}

			return schema;
		}


		/**
		 * Returns true of this projection shares the same property values as the other projection.
		 *
		 * @public
		 * @param {Projection} other - The index to compare.
		 * @param {Boolean=} relaxed - If true, the attributes are compared in "relaxed" mode.
		 * @returns {Boolean}
		 */
		equals(other, relaxed) {
			if (other === this) {
				return true;
			}

			let returnVal = other instanceof Projection;

			if (returnVal) {
				returnVal = returnVal = this._type === other.type;

				returnVal = returnVal && this._attributes.length === other.attributes.length;
				returnVal = returnVal && this._attributes.every(a => other.attributes.some(oa => oa.equals(a, relaxed)));
			}

			return returnVal;
		}

		toString() {
			return '[Projection]';
		}
	}

	return Projection;
})();