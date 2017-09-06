const assert = require('./../../lang/assert'),
	functions = require('./../../lang/functions'),
	is = require('./../../lang/is');

const LinkedList = require('./../../collections/LinkedList'),
	Tree = require('./../../collections/Tree');

const Component = require('./Component'),
	Field = require('./Field');

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

			this._revivers = getReviverItems(this._fields, this._components);
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
		 * @public
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
			let head = this._revivers;
			let node = null;

			const advance = (key) => {
				if (node === null) {
					node = head;
				} else {
					node = node.getNext();
				}

				let item = node.getValue();

				if (key !== item.name) {
					if (item.reset || (key === '' && node === head)) {
						node = null;
					} else if (item.optional) {
						item = advance(key);
					} else {
						throw new Error(`Schema parsing is using strict mode, unexpected key found [ ${key} / ${item.name} ]`);
					}
				}

				return item;
			};

			return (key, value) => {
				return advance(key).reviver(value);
			};
		}

		/**
		 * Returns a function that will generate a *new* reviver function
		 * (see {@link Schema#getReviver}.
		 *
		 * @public
		 * @returns {Function}
		 */
		getReviverFactory() {
			return () => this.getReviver();
		}

		toString() {
			return `[Schema (name=${this._name})]`;
		}
	}

	class ReviverItem {
		constructor(name, reviver, optional, reset) {
			this._name = name;
			this._reviver = reviver || functions.getTautology();
			this._optional = is.boolean(optional) && optional;
			this._reset = is.boolean(reset) && reset;
		}

		get name() {
			return this._name;
		}

		get reviver() {
			return this._reviver;
		}

		get optional() {
			return this._optional;
		}

		get reset() {
			return this._reset;
		}
	}

	function getReviverItems(fields, components) {
		const root = new Tree(new ReviverItem(null, null, false, true));

		// 2017/08/26, BRI. The Field and Component types could inherit a common
		// type, allowing the following duplication to be avoided with polymorphism.

		fields.forEach((field) => {
			const names = field.name.split('.');

			let node = root;

			names.forEach((name, i) => {
				if (names.length === i + 1) {
					node.addChild(new ReviverItem(name, field.dataType.reviver, field.optional));
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

		let head = null;
		let current = null;

		const addItemToList = (item, node) => {
			let itemToUse = item;

			if (!node.getIsLeaf()) {
				const required = node.search((i, n) => n.getIsLeaf() && !i.optional, true, false) !== null;

				if (!required) {
					itemToUse = new ReviverItem(item.name, item.reviver, true, item.reset);
				}
			} else {
				itemToUse = item;
			}

			if (current === null) {
				current = head = new LinkedList(itemToUse);
			} else {
				current = current.insert(itemToUse);
			}
		};

		root.walk(addItemToList, false, true);

		return head;
	}

	return Schema;
})();