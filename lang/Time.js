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

        toString() {
            return '[Time]';
        }
    }

    function leftPad(value, digits, character) {
        const string = value.toString();
        const padding = digits - string.length;

        return `${character.repeat(padding)}${string}`;
    }

    return Time;
})();
