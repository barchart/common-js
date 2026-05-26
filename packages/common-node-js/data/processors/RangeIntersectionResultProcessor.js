const log4js = require('log4js'),
	moment = require('moment');

const attributes = require('@barchart/common-js/lang/attributes'),
	is = require('@barchart/common-js/lang/is');

const ResultProcessor = require('./../ResultProcessor');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('data/processors/RangeIntersectionResultProcessor');

	/**
	 * Generates a Boolean value, indicating if one range (or one of a set of
	 * ranges) intersects with another range.
	 *
	 * @public
	 * @extends ResultProcessor
	 * @param {object} configuration
	 * @param {number=} configuration.start
	 * @param {string=} configuration.startRef
	 * @param {number=} configuration.end
	 * @param {string=} configuration.endRef
	 * @param {Object[]} configuration.candidates
	 * @param {number=} configuration.candidates[].start
	 * @param {string=} configuration.candidates[].startRef
	 * @param {number=} configuration.candidates[].end
	 * @param {string=} configuration.candidates[].endRef
	 */
	class RangeIntersectionResultProcessor extends ResultProcessor {
		constructor(configuration) {
			super(configuration);
		}

		_process(results) {
			const configuration = this._getConfiguration();

			const range = getRange(configuration, results);
			const candidates = configuration.candidates;

			let returnRef;

			if (range && is.array(candidates)) {
				returnRef = candidates.some((candidateConfiguration) => {
					const candidate = getRange(candidateConfiguration, results);

					return candidate !== null && !(candidate.end < range.start || candidate.start > range.end);
				});
			} else {
				returnRef = false;
			}

			return returnRef;
		}

		toString() {
			return '[RangeIntersectionResultProcessor]';
		}
	}

	function getRange(configuration, source) {
		let start;

		if (is.number(configuration.start)) {
			start = configuration.start;
		} else if (is.string(configuration.startRef)) {
			start = attributes.read(source, configuration.startRef);
		} else {
			start = null;
		}

		let end;

		if (is.number(configuration.end)) {
			end = configuration.end;
		} else if (is.string(configuration.endRef)) {
			end = attributes.read(source, configuration.endRef);
		} else {
			end = null;
		}

		let returnRef;

		if (is.number(start) && is.number(end)) {
			const values = [start, end].sort();

			returnRef = {
				start: values[0],
				end: values[1]
			};
		} else {
			returnRef = null;
		}

		return returnRef;
	}

	return RangeIntersectionResultProcessor;
})();