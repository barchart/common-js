/**
 * @typedef {import('./Vertex.js').default} Vertex
 */

/**
 * One edge of a directed graph, describing the connection between
 * two vertices; where the edge has a direction.
 *
 * @public
 */
export default class Edge {
	#from;
	#to;
	#data;

	/**
	 * @param {Vertex} from
	 * @param {Vertex} to
	 * @param {*=} data
	 */
	constructor(from, to, data) {
		this.#from = from;
		this.#to = to;

		this.#data = data || null;
	}

	/**
	 * The starting vertex.
	 *
	 * @public
	 * @returns {Vertex}
	 */
	get from() {
		return this.#from;
	}

	/**
	 * The end vertex.
	 *
	 * @public
	 * @returns {Vertex}
	 */
	get to() {
		return this.#to;
	}

	/**
	 * Ad hoc data associated with the edge (in other words the "value"
	 * of the edge).
	 *
	 * @public
	 * @returns {*|null}
	 */
	get data() {
		return this.#data;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[Edge (from=${this.from.data.toString()}, to=${this.to.data.toString()}})]`;
	}
}
