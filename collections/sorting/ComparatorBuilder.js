var Class = require('class.extend');

var assert = require('./../../lang/assert');
var comparators = require('./comparators');

module.exports = function() {
    'use strict';

    var ComparatorBuilder = Class.extend({
        init: function(comparator, invert, previous) {
            assert.argumentIsRequired(comparator, 'comparator', Function);
            assert.argumentIsOptional(invert, 'invert', Boolean);

            this._comparator = comparator;
            this._invert = invert || false;
            this._previous = previous || null;
        },

        thenBy: function(comparator, invert) {
            assert.argumentIsRequired(comparator, 'comparator', Function);
            assert.argumentIsOptional(invert, 'invert', Boolean);

            return new ComparatorBuilder(comparator, invert, this);
        },

        invert: function() {
            var previous;

            if (this._previous) {
                previous = this._previous.invert();
            } else {
                previous = null;
            }

            return new ComparatorBuilder(this._comparator, !this._invert, previous);
        },

        toComparator: function() {
            var that = this;

            var previousComparator;

            if (that._previous) {
                previousComparator = that._previous.toComparator();
            } else {
                previousComparator = comparators.empty;
            }

            return function(a, b) {
                var result = previousComparator(a, b);

                if (result === 0) {
                    var sortA;
                    var sortB;

                    if (that._invert) {
                        sortA = b;
                        sortB = a;
                    } else {
                        sortA = a;
                        sortB = b;
                    }

                    result = that._comparator(sortA, sortB);
                }

                return result;
            };
        },

        toString: function() {
            return '[ComparatorBuilder]';
        }
    });

    ComparatorBuilder.startWith = function(comparator, invert) {
        return new ComparatorBuilder(comparator, invert);
    };

    return ComparatorBuilder;
}();