import * as assert from './../../lang/assert.js';

import Edge from './Edge.js';

/**
 * One node (vertex) of a directed graph data structure.
 *
 * @public
 */
export default class Vertex {
	#data;
	#edges;

	/**
	 * @param {*=} data
	 */
	constructor(data) {
		this.#data = data || null;

		this.#edges = [ ];
	}

	/**
	 * Ad hoc data associated with the vertex (in other words the "value"
	 * of the vertex).
	 *
	 * @public
	 * @returns {*}
	 */
	get data() {
		return this.#data;
	}

	/**
	 * Returns all edges from this vertex to other vertices.
	 *
	 * @public
	 * @returns {Edge[]}
	 */
	getEdges() {
		return this.#edges;
	}

	/**
	 * Adds an edge.
	 *
	 * @public
	 * @param {Vertex} other
	 * @param {*=} data
	 * @returns {Edge}
	 */
	addEdge(other, data) {
		assert.argumentIsRequired(other, 'other', Vertex, 'Vertex');

		if (other === this) {
			throw new Error('Graph vertex cannot connect to itself.');
		}

		if (this.hasEdge(other)) {
			throw new Error(`Graph already has edge between [ ${this.data.toString()} ] and [ ${other.data.toString()} ]`);
		}

		const edge = new Edge(this, other, data);

		this.#edges.push(edge);

		return edge;
	}

	/**
	 * Locates an edge.
	 *
	 * @public
	 * @param {Vertex} other
	 * @returns {Edge|null}
	 */
	getEdge(other) {
		return this.#edges.find(e => e.to === other) || null;
	}

	/**
	 * Indicates if this vertex has an edge.
	 *
	 * @public
	 * @param {Vertex} other
	 * @returns {boolean}
	 */
	hasEdge(other) {
		return this.getEdge(other) !== null;
	}

	/**
	 * Finds all possible paths from this vertex (node) to another vertex (node).
	 *
	 * @public
	 * @param {Vertex} other
	 * @param {Edge[]=} walk
	 * @returns {Edge[][]}
	 */
	getPaths(other, walk) {
		if (walk && this === other) {
			return [ walk ];
		}

		if (walk && walk.some(edge => edge.from === this)) {
			return [ ];
		}

		let paths = [ ];

		this.#edges.forEach((edge) => {
			let current;

			if (walk) {
				current = walk.slice(0);
			} else {
				current = [ ];
			}

			current.push(edge);

			paths = paths.concat(edge.to.getPaths(other, current));
		});

		return paths;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[Vertex (data=${this.data.toString()})]`;
	}
}
