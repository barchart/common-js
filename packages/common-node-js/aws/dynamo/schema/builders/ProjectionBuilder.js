import * as assert from '@barchart/common-js/lang/assert.js';

import Attribute from './../definitions/Attribute.js';
import Projection from './../definitions/Projection.js';
import ProjectionType from './../definitions/ProjectionType.js';

/**
 * @typedef {import('./TableBuilder.js').default} TableBuilder
 */

/**
 * Fluent interface for building a {@link Projection}.
 *
 * @public
 */
export default class ProjectionBuilder {
	#parent;
	#projection;

	/**
	 * @param {ProjectionType} projectionType - The projection type.
	 * @param {TableBuilder} parent - The parent.
	 */
	constructor(projectionType, parent) {
		assert.argumentIsRequired(projectionType, 'projectionType', ProjectionType, 'ProjectionType');

		this.#projection = new Projection(projectionType, [ ]);
		this.#parent = parent;
	}

	/**
	 * The {@link Projection}, given all the information provided thus far.
	 *
	 * @public
	 * @returns {Projection}
	 */
	get projection() {
		return this.#projection;
	}

	/**
	 * Adds an {@link Attribute} to the projection and returns current instance.
	 *
	 * @public
	 * @param {string} attributeName
	 * @param {boolean} allowMissing
	 * @returns {ProjectionBuilder}
	 */
	withAttribute(attributeName, allowMissing) {
		assert.argumentIsRequired(attributeName, 'name', String);

		const attribute = getAttribute(attributeName, this.#parent, allowMissing);
		const attributes = this.#projection.attributes.filter(a => a.name !== attribute.name).concat(attribute);

		this.#projection = new Projection(this.#projection.type, attributes);

		return this;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[ProjectionBuilder]';
	}
}

function getAttribute(name, parent, allowMissing) {
	let attribute = parent.table.attributes.find(a => a.name === name) || null;

	if (attribute === null && allowMissing) {
		attribute = new Attribute(name);
	}

	return attribute;
}
