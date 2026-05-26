const log4js = require('log4js');

const array = require('@barchart/common-js/lang/array'),
	attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is'),
	object = require('@barchart/common-js/lang/object');

const ResultProcessor = require('./../ResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/TreeResultProcessor');

	/**
	 * Takes an array and generates a tree structure.
	 *
	 * @public
	 * @extends ResultProcessor
	 * @param {object} configuration
	 * @param {string=} configuration.pathPropertyName - The name of the item property that contains it's proper location in the tree structure (e.g. [ 'Animals', 'Mammals', 'Cat' ])
	 * @param {boolean=} configuration.itemizeInnerNodes - If true, each tree node will have an "items" array. Otherwise, only the leaf nodes will have an "items" array.
	 */
	class TreeResultProcessor extends ResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_process(results) {
			const configuration = this._getConfiguration();

			const pathPropertyName = configuration.pathPropertyName;
			const pathPropertyNames = configuration.pathPropertyNames;

			let pathExtractor;

			if (is.string(configuration.pathPropertyName)) {
				pathExtractor = item => attributes.read(item, pathPropertyName);
			} else if (is.array(pathPropertyNames)) {
				pathExtractor = item => pathPropertyNames.map((pathPropertyName) => attributes.read(item, pathPropertyName));
			} else {
				pathExtractor = null;
			}
			
			const itemizeInnerNodes = configuration.itemizeInnerNodes || false;

			const root = {
				children: [ ],
				parent: null
			};

			if (pathExtractor) {
				if (itemizeInnerNodes) {
					root.items = results;
				}

				results.forEach((item) => {
					let names = pathExtractor(item);

					names.reduce((parent, name, index) => {
						const children = parent.children;

						let child = children.find(group => object.equals(group.name, name));

						if (!is.object(child)) {
							child = {
								parent: parent,
								name: name,
								children: []
							};

							children.push(child);
						}

						if (itemizeInnerNodes || names.length === index + 1) {
							child.items = child.items || [];
							child.items.push(item);
						}

						return child;
					}, root);
				}, []);
			}

			return root;
		}

		toString() {
			return '[TreeResultProcessor]';
		}
	}

	return TreeResultProcessor;
})();