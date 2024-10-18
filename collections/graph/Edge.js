module.exports = (() => {
	'use strict';

	/**
	 * One edge of a directed graph, describing the connection between
	 * two vertices; where the edge has a direction.
	 *
	 * @public
	 * @param {Vertex} from
	 * @param {Vertex} to
	 * @param {*=} data
	 */
	class Edge {
		constructor(from, to, data) {
			this._from = from;
			this._to = to;

			this._data = data || null;
		}

		/**
		 * The starting vertex.
		 *
		 * @public
		 * @returns {Vertex}
		 */
		get from() {
			return this._from;
		}

		/**
		 * The end vertex.
		 *
		 * @public
		 * @returns {Vertex}
		 */
		get to() {
			return this._to;
		}

		/**
		 * Ad hoc data associated with the edge (in other words the "value"
		 * of the edge).
		 *
		 * @public
		 * @returns {*|null}
		 */
		get data() {
			return this._data;
		}

		toString() {
			return `[Edge (from=${this.from.data.toString()}, to=${this.to.data.toString()}})]`;
		}
	}

	return Edge;
})();
