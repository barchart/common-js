var Tree = require('./../../../collections/Tree');

describe('When a Tree is constructed', function() {
	'use strict';

	var root;
	var one;

	beforeEach(function() {
		root = new Tree(one = { });
	});

	it('should be the root node', function() {
		expect(root.getIsRoot()).toEqual(true);
	});

	it('should be a leaf node', function() {
		expect(root.getIsLeaf()).toEqual(true);
	});

	it('should have to correct node value', function() {
		expect(root.getValue()).toBe(one);
	});

	describe('When a child is added', function() {
		var child;
		var two;

		beforeEach(function() {
			child = root.addChild(two = { });
		});

		it('should be a leaf node', function() {
			expect(child.getIsLeaf()).toEqual(true);
		});

		it('should have to correct node value', function() {
			expect(child.getValue()).toBe(two);
		});

		it('should should be the child of the root node', function() {
			expect(child.getParent()).toBe(root);
		});

		it('should not have a parent which is considered a leaf node', function() {
			expect(root.getIsLeaf()).toEqual(false);
		});

		it('should be in the parents collection of children', function() {
			expect(root.getChildren().find((c) => c === child)).toBe(child);
		});
	});
});