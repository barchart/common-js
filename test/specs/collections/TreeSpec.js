const Tree = require('./../../../collections/Tree');

describe('When a Tree is constructed', () => {
	'use strict';

	let root;
	let one;

	beforeEach(() => {
		root = new Tree(one = { });
	});

	it('should be the root node', () => {
		expect(root.getIsRoot()).toEqual(true);
	});

	it('should not be an inner node', () => {
		expect(root.getIsInner()).toEqual(false);
	});

	it('should be a leaf node', () => {
		expect(root.getIsLeaf()).toEqual(true);
	});

	it('should have to correct node value', () => {
		expect(root.getValue()).toBe(one);
	});

	it('the (root) descendant count should be one', () => {
		expect(root.count()).toEqual(1);
	});

	describe('and the root node is retrieved from root node', () => {
		it('should be itself', () => {
			expect(root.getRoot()).toBe(root);
		});
	});

	describe('and a child is added', () => {
		let child;
		let two;

		beforeEach(() => {
			child = root.addChild(two = { });
		});

		it('should not be a leaf node', () => {
			expect(child.getIsInner()).toEqual(false);
		});

		it('should be a leaf node', () => {
			expect(child.getIsLeaf()).toEqual(true);
		});

		it('should have to correct node value', () => {
			expect(child.getValue()).toBe(two);
		});

		it('should should be the child of the root node', () => {
			expect(child.getParent()).toBe(root);
		});

		it('should not have a parent which is considered a leaf node', () => {
			expect(root.getIsLeaf()).toEqual(false);
		});

		it('should not a parent which is considered an inner node', () => {
			expect(root.getIsInner()).toEqual(true);
		});

		it('should be in the parents collection of children', () => {
			expect(root.getChildren().find((c) => c === child)).toBe(child);
		});

		it('the (root) descendant count should be two', () => {
			expect(root.count()).toEqual(2);
		});

		it('the (child) descendant count should be one', () => {
			expect(child.count()).toEqual(1);
		});

		describe('and a second child is added', () => {
			let secondChild;
			let three;

			beforeEach(() => {
				secondChild = root.addChild(three = { });
			});

			it('the (root) descendant count should be three', () => {
				expect(root.count()).toEqual(3);
			});

			it('the (child) descendant count should be one', () => {
				expect(secondChild.count()).toEqual(1);
			});

			describe('and the second child is severed', () => {
				beforeEach(() => {
					secondChild.sever();
				});

				it('the severed tree should no longer have a parent', () => {
					expect(secondChild.getIsRoot()).toEqual(true);
				});

				it('the original tree should only contain one child', () => {
					expect(root.getChildren().length).toEqual(1);
				});

				it('the original tree should not be the severed node', () => {
					expect(root.getChildren()[0]).not.toBe(secondChild);
				});
			});

			describe('and the tree is converted to a JavaScript object', () => {
				let object;

				beforeEach(() => {
					object = root.toJSObj();
				});

				it('should have the correct root value', () => {
					expect(object.value).toBe(one);
				});

				it('should have two children', () => {
					expect(object.children.length).toEqual(2);
				});

				it('should have the correct value for the first child', () => {
					expect(object.children[0].value).toBe(two);
				});

				it('should have the correct value for the second child', () => {
					expect(object.children[1].value).toBe(three);
				});
			});
		});

		describe('and the root node is retrieved from the child', () => {
			it('should be the root node', () => {
				expect(child.getRoot()).toBe(root);
			});
		});
	});
});

describe('When a binary tree, having three levels, is constructed', () => {
	let root;

	let rootLeft;
	let rootRight;

	let rootLeftLeft;
	let rootLeftRight;

	let rootRightLeft;
	let rootRightRight;

	beforeEach(() => {
		root = new Tree(1);

		rootLeft = root.addChild(2);
		rootRight = root.addChild(3);

		rootLeftLeft = rootLeft.addChild(4);
		rootLeftRight = rootLeft.addChild(5);

		rootRightLeft = rootRight.addChild(6);
		rootRightRight = rootRight.addChild(7);
	});

	describe('and searching for a value greater than zero', () => {
		it('using default options, the "rootLeftLeft"" node should be identified', () => {
			expect(root.search(v => v > 0)).toBe(rootLeftLeft);
		});

		it('using `parentFirst=true` and `includeCurrent=true`, the "root" node should be identified', () => {
			expect(root.search(v => v > 0, true, true)).toBe(root);
		});

		it('using `parentFirst=true` and `includeCurrent=false`, the "rootLeft" node should be identified', () => {
			expect(root.search(v => v > 0, true, false)).toBe(rootLeft);
		});

		it('using `parentFirst=false` and `includeCurrent=true`, the "rootLeftLeft" node should be identified', () => {
			expect(root.search(v => v > 0, false, true)).toBe(rootLeftLeft);
		});

		it('using `parentFirst=false` and `includeCurrent=false`, the "rootLeftLeft" node should be identified', () => {
			expect(root.search(v => v > 0, false, false)).toBe(rootLeftLeft);
		});
	});
});