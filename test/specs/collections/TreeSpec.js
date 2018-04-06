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

	describe('and the root node is retrieved from root node', function() {
		it('should be itself', function() {
			expect(root.getRoot()).toBe(root);
		});
	});

	describe('and a child is added', function() {
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

		describe('and a second child is added', function() {
			var secondChild;
			var three;

			beforeEach(function() {
				secondChild = root.addChild(three = { });
			});

			describe('and the second child is severed', function() {
				beforeEach(function() {
					secondChild.sever();
				});

				it('the severed tree should no longer have a parent', function() {
					expect(secondChild.getIsRoot()).toEqual(true);
				});

				it('the original tree should only contain one child', function() {
					expect(root.getChildren().length).toEqual(1);
				});

				it('the original tree should not be the severed node', function() {
					expect(root.getChildren()[0]).not.toBe(secondChild);
				});
			});

			describe('and the tree is converted to a JavaScript object', function() {
				var object;

				beforeEach(function() {
					object = root.toJSObj();
				});

				it('should have the correct root value', function() {
					expect(object.value).toBe(one);
				});

				it('should have two children', function() {
					expect(object.children.length).toEqual(2);
				});

				it('should have the correct value for the first child', function() {
					expect(object.children[0].value).toBe(two);
				});

				it('should have the correct value for the second child', function() {
					expect(object.children[1].value).toBe(three);
				});
			});
		});

		describe('and the root node is retrieved from the child', function() {
			it('should be the root node', function() {
				expect(child.getRoot()).toBe(root);
			});
		});
	});
});