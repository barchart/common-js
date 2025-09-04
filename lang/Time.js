const assert = require("./assert");

module.exports = (() => {
    'use strict';

    /**
     * A data structure that represents a time of day (hours, minutes, seconds),
     * without consideration for date or timezone.
     *
     * @public
     * @param {Number} hours
     * @param {Number} minutes
     * @param {Number} seconds
     */
    class Time {
        constructor(hours, minutes, seconds) {
            if (!Time.validate(hours, minutes, seconds)) {
                throw new Error(`Unable to instantiate [ Time ], input is invalid [ ${hours} ], [ ${minutes} ], [ ${seconds} ]`);
            }

            this._hours = hours;
            this._minutes = minutes;
            this._seconds = seconds;
        }

        /**
         * The hours (0–23).
         *
         * @public
         * @returns {Number}
         */
        get hours() {
            return this._hours;
        }

        /**
         * The minutes (0–59).
         *
         * @public
         * @returns {Number}
         */
        get minutes() {
            return this._minutes;
        }

        /**
         * The seconds (0–59).
         *
         * @public
         * @returns {Number}
         */
        get seconds() {
            return this._seconds;
        }

        /**
         * Indicates if the current {@link Time} instance is before another time.
         *
         * @public
         * @param {Time} other
         * @returns {boolean}
         */
        getIsBefore(other) {
            assert.argumentIsRequired(other, 'other', Time, 'Time');

            return this.hours < other.hours || (this.hours === other.hours && this.minutes < other.minutes) || (this.hours === other.hours && this.minutes === other.minutes && this.seconds < other.seconds);
        }

        /**
         * Indicates if the current {@link Time} instance is after another time.
         *
         * @public
         * @param {Time} other
         * @returns {boolean}
         */
        getIsAfter(other) {
            assert.argumentIsRequired(other, 'other', Time, 'Time');

            return !this.getIsBefore(other) && !this.getIsEqual(other);
        }

        /**
         * Indicates if the current {@link Time} instance is the same as another time.
         *
         * @public
         * @param {Time} other
         * @returns {boolean}
         */
        getIsEqual(other) {
            assert.argumentIsRequired(other, 'other', Time, 'Time');

            return this._hours === other.hours && this._minutes === other.minutes && this._seconds === other.seconds;
        }

        /**
         * Outputs the time as the formatted string: {hh}:{mm}:{ss}.
         *
         * @public
         * @returns {String}
         */
        format() {
            return `${leftPad(this._hours, 2, '0')}:${leftPad(this._minutes, 2, '0')}:${leftPad(this._seconds, 2, '0')}`;
        }

        /**
         * Returns the JSON representation.
         *
         * @public
         * @returns {String}
         */
        toJSON() {
            return this.format();
        }

        /**
         * Returns true if the hours, minutes, and seconds combination is valid.
         *
         * @public
         * @static
         * @param {Number} hours
         * @param {Number} minutes
         * @param {Number} seconds
         * @returns {Boolean}
         */
        static validate(hours, minutes, seconds) {
            return Number.isInteger(hours) &&
                Number.isInteger(minutes) &&
                Number.isInteger(seconds) &&
                hours >= 0 && hours < 24 &&
                minutes >= 0 && minutes < 60 &&
                seconds >= 0 && seconds < 60;
        }

        /**
         * Parses a string in the format "hh:mm:ss" and returns a Time instance.
         *
         * @public
         * @static
         * @param {String} time
         * @returns {Time}
         */
        static parse(time) {
            assert.argumentIsRequired(time, 'time', String);

            const match = time.match(regex);

            if (match === null) {
                throw new Error(`Unable to parse [ Time ], invalid format [ ${time} ]`);
            }

            const hours = parseInt(match[1]);
            const minutes = parseInt(match[2]);
            const seconds = match[4] ? parseInt(match[4]) : 0;

            return new Time(hours, minutes, seconds);
        }

        /**
         * Creates a {@link Time} from the hours, minutes, and seconds properties (in local time)
         * of the {@link Date} argument.
         *
         * @public
         * @static
         * @param {Date} date
         * @returns {Time}
         */
        static fromDate(date) {
            assert.argumentIsRequired(date, 'date', Date);

            return new Time(date.getHours(), date.getMinutes(), date.getSeconds());
        }

        /**
         * Creates a {@link Time} from the hours, minutes, and seconds properties (in UTC)
         * of the {@link Date} argument.
         *
         * @public
         * @static
         * @param {Date} date
         * @returns {Time}
         */
        static fromDateUtc(date) {
            assert.argumentIsRequired(date, 'date', Date);

            return new Time(date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
        }

        toString() {
            return '[Time]';
        }
    }

    const regex = /^([0-2]?[0-9]):([0-5][0-9])(:([0-5][0-9]))?$/i;

    function leftPad(value, digits, character) {
        const string = value.toString();
        const padding = digits - string.length;

        return `${character.repeat(padding)}${string}`;
    }

    return Time;
})();