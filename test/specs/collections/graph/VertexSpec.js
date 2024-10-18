const Vertex = require('./../../../../collections/graph/Vertex');

describe('When graph vertex (a) is initialized', () => {
	'use strict';

	let vertexA;
	let vertexDataA;

	beforeEach(() => {
		vertexA = new Vertex(vertexDataA = 'a');
	});

	it('the data for vertex (a) matches the data passed at construction', () => {
		expect(vertexA.data).toEqual(vertexDataA);
	});

	it('the vertex (a) has no connected edges', () => {
		expect(vertexA.getEdges().length).toEqual(0);
	});
	
	describe('and vertex (b) is attached', () => {
		let vertexB;
		let vertexDataB;

		let edgeAB;
		let edgeDataAB;

		beforeEach(() => {
			edgeAB = vertexA.addEdge(vertexB = new Vertex(vertexDataB = 'b'), edgeDataAB = 'a-to-b');
		});

		it ('the data for edge (between a and b) matches the data passed at construction', () => {
			expect(edgeAB.data).toEqual(edgeDataAB);
		});

		it ('the new edge starts at vertex (a)', () => {
			expect(edgeAB.from).toEqual(vertexA);
		});

		it ('the new edge ends at vertex (a)', () => {
			expect(edgeAB.to).toEqual(vertexB);
		});

		it('the vertex (a) has one edge', () => {
			expect(vertexA.getEdges().length).toEqual(1);
		});

		it('the vertex (a) has an edge to vertex (b)', () => {
			expect(vertexA.getEdge(vertexB)).toEqual(edgeAB);
		});

		it('the vertex (b) has no edges', () => {
			expect(vertexB.getEdges().length).toEqual(0);
		});

		describe('and the paths between vertex (a) and vertex (b) are calculated', () => {
			let paths;

			beforeEach(() => {
				paths = vertexA.getPaths(vertexB);
			});

			it('only one path should exist', () => {
				expect(paths.length).toEqual(1);
			});

			it('the path should have one edge', () => {
				expect(paths[0].length).toEqual(1);
			});

			it('the path should start at vertex (a)', () => {
				expect(paths[0][0].from).toEqual(vertexA);
			});

			it('the path should end at vertex (B)', () => {
				expect(paths[0][0].to).toEqual(vertexB);
			});
		});

		describe('and vertex (b) is attached (again)', () => {
			it('an error should be thrown', () => {
				expect(() => {
					vertexA.addEdge(vertexB);
				}).toThrow();
			});
		});

		describe('and a path from vertex (a) to vertex (b) is added through a new vertex (x)', () => {
			let vertexX;

			beforeEach(() => {
				vertexX = new Vertex();

				vertexA.addEdge(vertexX);
				vertexX.addEdge(vertexB);
			});

			describe('and the paths between vertex (a) and vertex (b) are calculated', () => {
				let paths;

				beforeEach(() => {
					paths = vertexA.getPaths(vertexB);
				});

				it('only two paths should exist', () => {
					expect(paths.length).toEqual(2);
				});

				it ('a direct path from vertex (a) to vertex (b) should exist', () => {
					expect(paths.some((path) => {
						return path.length === 1 &&
							path[0].from === vertexA && path[0].to === vertexB;
					})).toBeTrue();
				});

				it ('an indirect path from vertex (a) to vertex (b) through vertex (x) should exist', () => {
					expect(paths.some((path) => {
						return path.length === 2 &&
							path[0].from === vertexA && path[0].to === vertexX &&
							path[1].from === vertexX && path[1].to === vertexB;
					})).toBeTrue();
				});
			});
		});
	});

	describe('and vertex (a) is attached to itself', () => {
		it('an error should be thrown', () => {
			expect(() => {
				vertexA.addEdge(vertexA);
			}).toThrow();
		});
	});
});