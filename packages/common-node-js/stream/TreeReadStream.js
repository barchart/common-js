import * as assert from '@barchart/common-js/lang/assert.js';
import * as object from '@barchart/common-js/lang/object.js';

import Tree from '@barchart/common-js/collections/Tree.js';

import Stream from 'stream';

/**
 * A {@link Stream.Readable} that emits {@link Tree} items.
 *
 * @public
 * @extends {Stream.Readable}
 */
export default class TreeReadStream extends Stream.Readable {
    #generator;

    /**
     * @param {Tree} tree
     * @param {object=} options
     */
    constructor(tree, options) {
        super(object.merge({ objectMode: true }, (options || { })));

        assert.argumentIsRequired(tree, 'tree', Tree, 'Tree');
        assert.argumentIsOptional(options, 'options', Object);

        this.#generator = walk(tree);
    }

    _read(size) {
        let item;

        const next = this.#generator.next();

        if (next.done) {
            item = null;
        } else {
            item = next.value;
        }

        this.push(item);
    }

    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
        return '[TreeReadStream]';
    }
}

function* walk(node) {
    yield node;

    const children = node.getChildren();

    for (let i = 0; i < children.length; i++) {
        const child = children[i];

        yield* walk(child);
    }
}
