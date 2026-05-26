const Stream = require('stream');

const assert = require('@barchart/common-js/lang/assert'),
    object = require('@barchart/common-js/lang/object'),
    Tree = require('@barchart/common-js/collections/Tree');

module.exports = (() => {
    'use strict';

    /**
     * A {@link Stream.Readable} that emits {@link Tree} items.
     *
     * @public
     * @extends {Steam.Readable}
     * @param {Tree} tree
     * @param {Object=} options
     */
    class TreeReadStream extends Stream.Readable {
        constructor(tree, options) {
            super(object.merge({ objectMode: true }, (options || { })));

            assert.argumentIsRequired(tree, 'tree', Tree, 'Tree');
            assert.argumentIsOptional(options, 'options', Object);

            this._generator = walk(tree);
        }

        _read(size) {
            let item;

            const next = this._generator.next();

            if (next.done) {
                item = null;
            } else {
                item = next.value;
            }

            this.push(item);
        }

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

    return TreeReadStream;
})();
