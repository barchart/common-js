const array = require('./../../lang/array'),
	assert = require('./../../lang/assert'),
	is = require('./../../lang/is');

const Tree = require('./../../collections/Tree');

const Attribute = require('./Attribute'),
	Component = require('./Component');

module.exports = (() => {
	'use strict';

	/**
	 * A schema definition, can be used for serialization and deserialization.
	 *
	 * @public
	 * @param {String} name - The name of the schema
	 * @param {Array<Attribute>} attributes
	 * @param {Array<Component>} components
	 * @param {Boolean=} strict
	 */
	class Schema {
		constructor(name, attributes, components, strict) {
			this._name = name;

			this._attributes = attributes || [ ];
			this._components = components || [ ];

			this._strict = is.boolean(strict) && strict;
		}

		/**
		 * Name of the table.
		 *
		 * @public
		 * @returns {String}
		 */
		get name() {
			return this._name;
		}

		/**
		 * The attributes of the table.
		 *
		 * @public
		 * @returns {Array<Attributes>}
		 */
		get attributes() {
			return [...this._attributes];
		}

		/**
		 * The components of the table.
		 *
		 * @public
		 * @returns {Array<Component>}
		 */
		get components() {
			return [...this._components];
		}

		/**
		 * If true, only the explicitly defined attributes and components will
		 * be serialized.
		 *
		 * @public
		 * @returns {*|boolean}
		 */
		get strict() {
			return this._strict;
		}

		/**
		 * Returns true, if an object complies with the schema.
		 *
		 * @param {*} candidate
		 */
		validate(candidate) {
			let returnVal = is.object(candidate);

			return returnVal;
		}

		/**
		 * Generates a function suitable for use by JSON.parse.
		 *
		 * @public
		 * @returns {Function}
		 */
		getReviver() {
			return buildCompositeReviver(this);
		}

		toString() {
			return `[Schema (name=${this._name})]`;
		}
	}

	class ReviverNode {
		constructor(name, reviver) {
			this._name = name;
			this._reviver = reviver || (x => x);
		}

		get name() {
			return this._name;
		}

		get reviver() {
			return this._reviver;
		}
	}

	function buildCompositeReviver(schema) {
		const root = new Tree(new ReviverNode(''));

		schema.attributes.forEach((attribute) => {
			const names = attribute.name.split('.');

			let node = root;

			names.forEach((name, i) => {
				if (names.length === i + 1) {
					node.addChild(new ReviverNode(name, attribute.dataType.reviver));
				} else {
					let child = node.findChild(rn => rn.name === name);

					if (!child) {
						child = node.addChild(new ReviverNode(name));
					}

					node = child;
				}
			});
		});

		const reviverData = [ ];

		root.walk(rn => reviverData.push(rn), true, true);

		let reviverIndex = 0;
		let reviverItem = reviverData[reviverIndex];

		return (key, value) => {
			if (key === reviverItem.name) {
				reviverItem = reviverData[++reviverIndex];

				return reviverItem.reviver.call(this, value);
			} else {
				return value;
			}
		};
	}

	return Schema;
})();