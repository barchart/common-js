const ComparatorBuilder = require('./../../../../collections/sorting/ComparatorBuilder');

describe('When a ComparatorBuilder is composed with two comparators', () => {
    'use strict';

    let comparatorBuilder;

    let comparatorOne;
    let comparatorTwo;

    let first = { x: 0, y: 0, toString: () => { return '[first]'; } };
    let second = { x: 1, y: 0, toString: () => { return '[second]'; } };
    let third = { x: 1, y: 1, toString: () => { return '[third]'; } };

    beforeEach(() => {
        comparatorOne = jasmine.createSpy('comparatorOne').and.callFake(function(a, b) {
            return a.x - b.x;
        });

        comparatorTwo = jasmine.createSpy('comparatorTwo').and.callFake(function(a, b) {
            return a.y - b.y;
        });

        comparatorBuilder = ComparatorBuilder.startWith(comparatorOne)
            .thenBy(comparatorTwo);
    });

    describe('and the ComparatorBuilder sorts an array (which requires both comparators)', () => {
        let arrayToSort;

        beforeEach(() => {
            arrayToSort = [ third, first, second ];

            arrayToSort.sort(comparatorBuilder.toComparator());
        });

        it('the first comparator should be invoked', () => {
            expect(comparatorOne).toHaveBeenCalled();
        });

        it('the second comparator should be invoked', () => {
            expect(comparatorTwo).toHaveBeenCalled();
        });

        it('the sorted array should be in the correct order', () => {
            expect(arrayToSort[0]).toBe(first);
            expect(arrayToSort[1]).toBe(second);
            expect(arrayToSort[2]).toBe(third);
        });
    });

    describe('and the ComparatorBuilder is inverted', () => {
        beforeEach(() => {
            comparatorBuilder = comparatorBuilder.invert();
        });

        describe('and the ComparatorBuilder sorts an array (which requires both comparators)', () => {
            let arrayToSort;

            beforeEach(() => {
                arrayToSort = [ third, first, second ];

                arrayToSort.sort(comparatorBuilder.toComparator());
            });

            it('the first comparator should be invoked', () => {
                expect(comparatorOne).toHaveBeenCalled();
            });

            it('the second comparator should be invoked', () => {
                expect(comparatorTwo).toHaveBeenCalled();
            });

            it('the sorted array should be in the correct order', () => {
                expect(arrayToSort[0]).toBe(third);
                expect(arrayToSort[1]).toBe(second);
                expect(arrayToSort[2]).toBe(first);
            });
        });
    });
});