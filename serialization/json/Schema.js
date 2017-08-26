const array = require('./../../lang/array'),
	assert = require('./../../lang/assert'),
	is = require('./../../lang/is');

const Tree = require('./../../collections/Tree');

const Field = require('./Field'),
	Component = require('./Component');

module.exports = (() => {
	'use strict';

	/**
	 * A schema definition, can be used for serialization and deserialization.
	 *
	 * @public
	 * @param {String} name - The name of the schema
	 * @param {Array<Field>} fields
	 * @param {Array<Component>} components
	 * @param {Boolean=} strict
	 */
	class Schema {
		constructor(name, fields, components, strict) {
			this._name = name;

			this._fields = fields || [ ];
			this._components = components || [ ];

			this._strict = is.boolean(strict) && strict;

			this._reviverItems = getReviverItems(this._fields, this._components);
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
		 * The fields of the table.
		 *
		 * @public
		 * @returns {Array<Fields>}
		 */
		get fields() {
			return [...this._fields];
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
		 * If true, only the explicitly defined fields and components will
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

			return false;
		}

		/**
		 * Generates a function suitable for use by JSON.parse.
		 *
		 * @public
		 * @returns {Function}
		 */
		getReviver() {
			let reviverIndex = 0;

			return (key, value) => {
				const reviverItem = this._reviverItems[reviverIndex];

				if (key === reviverItem.name) {
					reviverIndex = reviverIndex + 1;

					return reviverItem.reviver(value);
				} else {
					return value;
				}
			};
		}

		toString() {
			return `[Schema (name=${this._name})]`;
		}
	}

	class ReviverItem {
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

	function getReviverItems(fields, components) {
		const root = new Tree(new ReviverItem(''));

		// 2017/08/26, BRI. The Field and Component types could inherit a common
		// type, allowing the following duplication to be avoided with polymorphism.

		fields.forEach((field) => {
			const names = field.name.split('.');

			let node = root;

			names.forEach((name, i) => {
				if (names.length === i + 1) {
					node.addChild(new ReviverItem(name, field.dataType.reviver));
				} else {
					let child = node.findChild(n => n.name === name);

					if (!child) {
						child = node.addChild(new ReviverItem(name));
					}

					node = child;
				}
			});
		});

		components.forEach((component) => {
			let node = root;

			const names = component.name.split('.');

			names.forEach((name, i) => {
				if (names.length === i + 1) {
					node = node.addChild(new ReviverItem(name, component.reviver));
				} else {
					let child = node.findChild(n => n.name === name);

					if (!child) {
						child = node.addChild(new ReviverItem(name));
					}

					node = child;
				}
			});

			component.fields.forEach((f) => node.addChild(new ReviverItem(f.name, f.dataType.reviver)));
		});

		const reviverItems = [ ];

		root.walk(n => reviverItems.push(n), false, true);

		return reviverItems;
	}

	return Schema;
})();