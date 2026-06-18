import Edge from './../../../../collections/graph/Edge.js';
import Vertex from './../../../../collections/graph/Vertex.js';

describe('When an Edge is constructed', () => {
	'use strict';

	let from;
	let to;
	let data;
	let edge;

	beforeEach(() => {
		from = new Vertex('from');
		to = new Vertex('to');
		data = { weight: 1 };

		edge = new Edge(from, to, data);
	});

	it('should expose the from vertex', () => {
		expect(edge.from).toBe(from);
	});

	it('should expose the to vertex', () => {
		expect(edge.to).toBe(to);
	});

	it('should expose the edge data', () => {
		expect(edge.data).toBe(data);
	});

	it('should default missing data to null', () => {
		expect(new Edge(from, to).data).toBeNull();
	});

	it('should have the expected string representation', () => {
		expect(edge.toString()).toEqual('[Edge (from=from, to=to})]');
	});
});
