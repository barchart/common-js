const Time = require('./../../../lang/Time');

describe('When "12:34:56" is parsed as a Time', () => {
    'use strict';

    let time;

    beforeEach(() => {
        time = Time.parse('12:34:56');
    });

    it('the hours should be 12', () => {
        expect(time.hours).toEqual(12);
    });

    it('the minutes should be 34', () => {
        expect(time.minutes).toEqual(34);
    });

    it('the seconds should be 56', () => {
        expect(time.seconds).toEqual(56);
    });

    describe('and the Time instance is formatted', () => {
        it('should output be "12:34:56"', () => {
            expect(time.format()).toEqual('12:34:56');
        });
    });
});

describe('When "07:05:09" is parsed as a Time', () => {
    'use strict';

    let time;

    beforeEach(() => {
        time = Time.parse('07:05:09');
    });

    it('the hours should be 7', () => {
        expect(time.hours).toEqual(7);
    });

    it('the minutes should be 5', () => {
        expect(time.minutes).toEqual(5);
    });

    it('the seconds should be 9', () => {
        expect(time.seconds).toEqual(9);
    });

    describe('and the Time instance is formatted', () => {
        it('should output be "07:05:09"', () => {
            expect(time.format()).toEqual('07:05:09');
        });
    });
});

describe('When an invalid string is parsed as a Time', () => {
    function expectError(value) {
        expect(() => { Time.parse(value); }).toThrow();
    }

    it('should throw on null', () => {
        expectError(null);
    });

    it('should throw on undefined', () => {
        expectError(undefined);
    });

    it('should throw on object', () => {
        expectError({});
    });

    it('should throw on number', () => {
        expectError(12345);
    });

    it('should throw on "25:00:00" (invalid hour)', () => {
        expectError('25:00:00');
    });

    it('should throw on "12:60:00" (invalid minute)', () => {
        expectError('12:60:00');
    });

    it('should throw on "12:30:60" (invalid second)', () => {
        expectError('12:30:60');
    });
});

describe('When checking if a Time is valid', () => {
    it('should consider 00:00:00 valid', () => {
        expect(Time.validate(0, 0, 0)).toEqual(true);
    });

    it('should consider 23:59:59 valid', () => {
        expect(Time.validate(23, 59, 59)).toEqual(true);
    });

    it('should not consider 24:00:00 valid', () => {
        expect(Time.validate(24, 0, 0)).toEqual(false);
    });

    it('should not consider 12:60:00 valid', () => {
        expect(Time.validate(12, 60, 0)).toEqual(false);
    });

    it('should not consider 12:30:60 valid', () => {
        expect(Time.validate(12, 30, 60)).toEqual(false);
    });
});