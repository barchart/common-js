const assert = require('./../../lang/assert');

const Edge = require('./Edge');

module.exports = (() => {
	'use strict';

	/**
	 * One node (vertex) of a directed graph data structure.
	 *
	 * @public
	 * @param {*=} data
	 */
	class Vertex {
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
		 * @returns {Edge[]}
		 */
		getEdges() {
			return this._edges;
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

			this._edges.push(edge);

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
			return this._edges.find(e => e.to === other) || null;
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
			return `[Vertex (data=${this.data.toString()})]`;
		}
	}

	return Vertex;
})();