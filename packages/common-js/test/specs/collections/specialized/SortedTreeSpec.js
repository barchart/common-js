import SortedTree from './../../../../collections/specialized/SortedTree.js';

describe('When a SortedTree is constructed', () => {
	'use strict';

	let tree;

	beforeEach(() => {
		tree = new SortedTree('root', null, (a, b) => a.getValue() - b.getValue());
	});

	it('should require a comparator for the root node', () => {
		expect(() => new SortedTree('root')).toThrow();
	});

	it('should insert children in sorted order', () => {
		const three = tree.addChild(3);
		const one = tree.addChild(1);
		const two = tree.addChild(2);

		expect(tree.getChildren()).toEqual([ one, two, three ]);
	});

	it('should allow descendants to reuse the root comparator', () => {
		const child = tree.addChild(2);
		const nestedThree = child.addChild(3);
		const nestedOne = child.addChild(1);

		expect(child.getChildren()).toEqual([ nestedOne, nestedThree ]);
	});

	it('should return SortedTree child instances', () => {
		expect(tree.addChild(1) instanceof SortedTree).toEqual(true);
	});

	it('should have the expected string representation', () => {
		expect(tree.toString()).toEqual('[SortedTree]');
	});
});
