var LinkedList = require('./../../../collections/LinkedList');

describe('When "doe" is used to start a linked list', function() {
	'use strict';

	var doe;

	beforeEach(function() {
		doe = new LinkedList('doe');
	});

	describe('and "me" is added to "doe"', function() {
		var me;

		beforeEach(function() {
			me = doe.insert('me');
		});

		describe('and "ray" is inserted between "doe" and "me"', function() {
			var ray;

			beforeEach(function() {
				ray = doe.insert('ray');
			});

			it('the "ray" node should not be the the tail', function() {
				expect(me.getIsTail()).toEqual(true);
			});

			it('the "ray" node should have a value of "ray"', function() {
				expect(me.getValue()).toEqual('me');
			});

			it('the "me" node should still be the the tail', function() {
				expect(me.getIsTail()).toEqual(true);
			});

			it('the "doe" node should reference the "ray" node', function() {
				expect(doe.getNext()).toBe(ray);
			});

			it('the "ray" node should reference the "me" node', function() {
				expect(ray.getNext()).toBe(me);
			});
		});

		it('the "me" node should be the the tail', function() {
			expect(me.getIsTail()).toEqual(true);
		});

		it('the "me" node should have a value of "me"', function() {
			expect(me.getValue()).toEqual('me');
		});

		it('the "doe" node should not be the tail', function() {
			expect(doe.getIsTail()).toEqual(false);
		});

		it('the "doe" node should still have the correct value', function() {
			expect(doe.getValue()).toEqual('doe');
		});

		it('the "doe" node should reference the "me" node', function() {
			expect(doe.getNext()).toBe(me);
		});
	});

	it('should be the the tail', function() {
		expect(doe.getIsTail()).toEqual(true);
	});

	it('should have a value of "doe"', function() {
		expect(doe.getValue()).toEqual('doe');
	});
});