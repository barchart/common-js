var ComparatorBuilder = require('./../../../../collections/sorting/ComparatorBuilder');

describe('When a ComparatorBuilder is composed with two comparators', function() {
    'use strict';

    var comparatorBuilder;

    var comparatorOne;
    var comparatorTwo;

    var first = { x: 0, y: 0, toString: function() { return '[first]'; } };
    var second = { x: 1, y: 0, toString: function() { return '[second]'; } };
    var third = { x: 1, y: 1, toString: function() { return '[third]'; } };

    beforeEach(function() {
        comparatorOne = jasmine.createSpy('comparatorOne').and.callFake(function(a, b) {
            return a.x - b.x;
        });

        comparatorTwo = jasmine.createSpy('comparatorTwo').and.callFake(function(a, b) {
            return a.y - b.y;
        });

        comparatorBuilder = ComparatorBuilder.startWith(comparatorOne)
            .thenBy(comparatorTwo);
    });

    describe('and the ComparatorBuilder sorts an array (which requires both comparators)', function() {
        var arrayToSort;

        beforeEach(function() {
            arrayToSort = [ third, first, second ];

            arrayToSort.sort(comparatorBuilder.toComparator());
        });

        it('the first comparator should be invoked', function() {
            expect(comparatorOne).toHaveBeenCalled();
        });

        it('the second comparator should be invoked', function() {
            expect(comparatorTwo).toHaveBeenCalled();
        });

        it('the sorted array should be in the correct order', function() {
            expect(arrayToSort[0]).toBe(first);
            expect(arrayToSort[1]).toBe(second);
            expect(arrayToSort[2]).toBe(third);
        });
    });

    describe('and the ComparatorBuilder is inverted', function() {
        beforeEach(function() {
            comparatorBuilder = comparatorBuilder.invert();
        });

        describe('and the ComparatorBuilder sorts an array (which requires both comparators)', function() {
            var arrayToSort;

            beforeEach(function() {
                arrayToSort = [ third, first, second ];

                arrayToSort.sort(comparatorBuilder.toComparator());
            });

            it('the first comparator should be invoked', function() {
                expect(comparatorOne).toHaveBeenCalled();
            });

            it('the second comparator should be invoked', function() {
                expect(comparatorTwo).toHaveBeenCalled();
            });

            it('the sorted array should be in the correct order', function() {
                expect(arrayToSort[0]).toBe(third);
                expect(arrayToSort[1]).toBe(second);
                expect(arrayToSort[2]).toBe(first);
            });
        });
    });
});