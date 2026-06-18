import * as attributes from './../../lang/attributes.js';
import * as functions from './../../lang/functions.js';
import * as is from './../../lang/is.js';

import LinkedList from './../../collections/LinkedList.js';
import Tree from './../../collections/Tree.js';

/**
 * @typedef {import('./Component.js').default} Component
 * @typedef {import('./Field.js').default} Field
 */

/**
 * A schema definition, can be used for serialization and deserialization.
 *
 * @public
 */
export default class Schema {
	#name;
	#fields;
	#components;
	#strict;
	#revivers;

	/**
	 * @param {string} name - The name of the schema
	 * @param {Field[]=} fields
	 * @param {Component[]=} components
	 * @param {boolean=} strict
	 */
	constructor(name, fields, components, strict) {
		this.#name = name;

		this.#fields = fields || [ ];
		this.#components = components || [ ];

		this.#strict = is.boolean(strict) && strict;

		this.#revivers = getReviverItems(this.#fields, this.#components);
	}

	/**
	 * Accepts data and returns a new object which (should) conform to
	 * the schema.
	 *
	 * @public
	 * @param {object} data
	 * @returns {object}
	 */
	format(data) {
		const returnRef = { };

		this.#fields.forEach((field) => {
			formatField(returnRef, field, data);
		});

		this.#components.forEach((component) => {
			component.fields.forEach((field) => {
				formatField(returnRef, field, data);
			});
		});

		return returnRef;
	}

	/**
	 * Name of the table.
	 *
	 * @public
	 * @returns {string}
	 */
	get name() {
		return this.#name;
	}

	/**
	 * The fields of the table.
	 *
	 * @public
	 * @returns {Array<Field>}
	 */
	get fields() {
		return [...this.#fields];
	}

	/**
	 * The components of the table.
	 *
	 * @public
	 * @returns {Array<Component>}
	 */
	get components() {
		return [...this.#components];
	}

	/**
	 * If true, only the explicitly defined fields and components will
	 * be serialized.
	 *
	 * @public
	 * @returns {boolean}
	 */
	get strict() {
		return this.#strict;
	}

	/**
	 * Returns true, if an object complies with the schema.
	 *
	 * @public
	 * @param {*} candidate
	 * @returns {boolean}
	 */
	validate(candidate) {
		return !getCandidateIsInvalid(candidate) && this.getInvalidFields(candidate).length === 0;
	}

	/**
	 * Returns an array of {@link Field} objects from the schema for which the
	 * candidate object does not comply with.
	 *
	 * @public
	 * @param {*} candidate
	 * @returns {Field[]}
	 */
	getInvalidFields(candidate) {
		if (getCandidateIsInvalid(candidate)) {
			return this.fields.filter(f => !f.optional);
		}

		return this.fields.reduce((problems, field) => {
			let check = !field.optional || attributes.has(candidate, field.name);

			if (check) {
				const valid = field.dataType.validator.call(this, attributes.read(candidate, field.name));

				if (!valid) {
					problems.push(field);
				}
			}

			return problems;
		}, [ ]);
	}

	/**
	 * Generates a function suitable for use by {@link JSON.parse}.
	 *
	 * @public
	 * @returns {Function}
	 */
	getReviver() {
		let head = this.#revivers;
		let node = null;

		const advance = (key) => {
			const previous = node;

			if (node === null) {
				node = head;
			} else {
				node = node.getNext();
			}

			const item = node.getValue();

			if (key === item.name) {
				return item;
			} else if (item.reset || (key === '' && node === head)) {
				node = null;

				return item;
			} else if (item.array && is.integer(parseInt(key))) {
				node = previous;

				return item;
			} else if (item.optional) {
				return advance(key);
			} else {
				throw new SchemaError(key, item.name, `Schema parsing is using strict mode, unexpected key found [ found: ${key}, expected: ${item.name} ]`);
			}
		};

		return (key, value) => {
			const item = advance(key);

			if (key === '' || (item.array && key === item.name)) {
				return value;
			} else {
				return item.reviver(value);
			}
		};
	}

	/**
	 * Returns a function that will generate a *new* reviver function
	 * (see {@link Schema#getReviver}).
	 *
	 * @public
	 * @returns {Function}
	 */
	getReviverFactory() {
		return () => this.getReviver();
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[Schema (name=${this.#name})]`;
	}
}

class SchemaError extends Error {
	constructor(key, name, message) {
		super(message);

		this.key = key;
		this.name = name;
	}

	toString() {
		return `[SchemaError]`;
	}
}

class ReviverItem {
	#name;
	#reviver;
	#optional;
	#reset;
	#array;

	constructor(name, reviver, optional, reset, array) {
		this.#name = name;
		this.#reviver = reviver || functions.getTautology();
		this.#optional = is.boolean(optional) && optional;
		this.#reset = is.boolean(reset) && reset;
		this.#array = is.boolean(array) && array;
	}

	get name() {
		return this.#name;
	}

	get reviver() {
		return this.#reviver;
	}

	get optional() {
		return this.#optional;
	}

	get reset() {
		return this.#reset;
	}

	get array() {
		return this.#array;
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
				node.addChild(new ReviverItem(name, field.dataType.reviver, field.optional, false, field.array));
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
				itemToUse = new ReviverItem(item.name, item.reviver, true, item.reset, item.array);
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

function formatField(target, field, data) {
	if (attributes.has(data, field.name)) {
		attributes.write(target, field.name, field.dataType.convert(attributes.read(data, field.name)));
	}
}

function getCandidateIsInvalid(candidate) {
	return is.undef(candidate) || is.nil(candidate) || !is.object(candidate);
}
