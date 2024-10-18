const Graph = require('./../../../../collections/graph/Graph');

describe('When graph is initialized', () => {
	'use strict';

	let graph;

	beforeEach(() => {
		graph = new Graph('doe');
	});

	describe('and "me" is added to "doe"', () => {
		let me;

		beforeEach(() => {
			me = doe.insert('me');
		});

		describe('and "ray" is inserted between "doe" and "me"', () => {
			let ray;

			beforeEach(() => {
				ray = doe.insert('ray');
			});

			it('the "ray" node should not be the the tail', () => {
				expect(me.getIsTail()).toEqual(true);
			});

			it('the "ray" node should have a value of "ray"', () => {
				expect(ray.getValue()).toEqual('ray');
			});

			it('the "me" node should still be the the tail', () => {
				expect(me.getIsTail()).toEqual(true);
			});

			it('the "doe" node should reference the "ray" node', () => {
				expect(doe.getNext()).toBe(ray);
			});

			it('the "ray" node should reference the "me" node', () => {
				expect(ray.getNext()).toBe(me);
			});
		});

		it('the "me" node should be the the tail', () => {
			expect(me.getIsTail()).toEqual(true);
		});

		it('the "me" node should have a value of "me"', () => {
			expect(me.getValue()).toEqual('me');
		});

		it('the "doe" node should not be the tail', () => {
			expect(doe.getIsTail()).toEqual(false);
		});

		it('the "doe" node should still have the correct value', () => {
			expect(doe.getValue()).toEqual('doe');
		});

		it('the "doe" node should reference the "me" node', () => {
			expect(doe.getNext()).toBe(me);
		});
	});

	it('should be the the tail', () => {
		expect(doe.getIsTail()).toEqual(true);
	});

	it('should have a value of "doe"', () => {
		expect(doe.getValue()).toEqual('doe');
	});
});