const GraphEdge = require('./GraphEdge');

module.exports = (() => {
	'use strict';

	/**
	 * One node (vertex) of a graph data structure including all
	 * edges (connections) of the node.
	 *
	 * @public
	 * @param {*=} data
	 */
	class GraphVertex {
		constructor(data) {
			this._data = data || null;

			this._edges = [ ];
		}

		/**
		 * Ad hoc data associated with the vertex (in other words the "value"
		 * of the vertex).
		 *
		 * @public
		 * @returns {*}
		 */
		get data() {
			return this._data;
		}

		/**
		 * Returns all edges from this vertex to other vertices.
		 *
		 * @public
		 * @returns {GraphEdge[]}
		 */
		getEdges() {
			return this._edges;
		}

		/**
		 * Adds an edge.
		 *
		 * @public
		 * @param {GraphVertex} other
		 * @param {*} data
		 * @returns {GraphEdge}
		 */
		addEdge(other, data) {
			if (this.hasEdge(data)) {
				throw new Error(`Graph already has edge between [ ${this.data.toString()} ] and [ ${other.data.toString()} ]`);
			}

			const edge = new GraphEdge(this, other, data);

			this._edges.push(edge);

			return edge;
		}

		/**
		 * Locates an edge.
		 *
		 * @public
		 * @param {GraphVertex} other
		 * @returns {GraphEdge|null}
		 */
		getEdge(other) {
			return this._edges.find(e => e.to === other) || null;
		}

		/**
		 * Indicates if this vertex has an edge.
		 *
		 * @public
		 * @param {GraphVertex} other
		 * @returns {boolean}
		 */
		hasEdge(other) {
			return this.getEdge(other) !== null;
		}

		/**
		 * Finds all possible paths from this vertex (node) to another vertex (node).
		 *
		 * @public
		 * @param {*} other
		 * @param {GraphEdge[]=} walk
		 * @returns {GraphEdge[][]}
		 */
		getPaths(other, walk) {
			if (walk && this._data === other) {
				return [ walk ];
			}

			if (walk && walk.some(edge => edge.from === this)) {
				return [ ];
			}

			let paths = [ ];

			this._edges.forEach((edge) => {
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

		toString() {
			return `[GraphVertex (data=${this.data.toString()})]`;
		}
	}

	return GraphVertex;
})();