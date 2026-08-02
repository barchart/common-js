import * as is from '@barchart/common-js/lang/is.js';
import * as string from '@barchart/common-js/lang/string.js';

import AssetClass from './../data/AssetClass.js';

/**
 * Static utilities for identifying, parsing, and normalizing market symbols.
 *
 * @public
 */
class SymbolParser {
	constructor() {

	}

	// PREDICATES THAT IDENTIFY A SYMBOL AS A SPECIFIC ASSET CLASS.

	/**
	 * Returns true when a symbol is listed on the BATS/BZX exchange.
	 *
	 * @public
	 * @static
	 * @param {string} symbol
	 * @returns {boolean}
	 */
	static getIsBats(symbol) {
		return is.string(symbol) && predicates.bats.test(symbol);
	}

	/**
	 * Returns true when a symbol represents a Commodity3 instrument.
	 *
	 * @public
	 * @static
	 * @param {string} symbol
	 * @returns {boolean}
	 */
	static getIsC3(symbol) {
		return is.string(symbol) && (types.c3.concrete.test(symbol) || types.c3.alias.test(symbol));
	}

	/**
	 * Returns true when a symbol represents a Canadian mutual fund.
	 *
	 * @public
	 * @static
	 * @param {string} symbol
	 * @returns {boolean}
	 */
	static getIsCanadianFund(symbol) {
		return is.string(symbol) && types.funds.canadian.test(symbol);
	}

	/**
	 * Returns true when a symbol represents a cmdty-branded instrument.
	 *
	 * @public
	 * @static
	 * @param {string} symbol
	 * @returns {boolean}
	 */
	static getIsCmdty(symbol) {
		return is.string(symbol) && (types.cmdty.stats.test(symbol) || types.cmdty.internal.test(symbol) || types.cmdty.external.test(symbol));
	}

	/**
	 * Returns true when a symbol represents a cmdtyStats instrument.
	 *
	 * @public
	 * @static
	 * @param {string} symbol
	 * @returns {boolean}
	 */
	static getIsCmdtyStats(symbol) {
		return is.string(symbol) && types.cmdty.stats.test(symbol);
	}

	/**
	 * Returns true when a symbol represents a cryptocurrency.
	 * Foreign exchange symbols can use the same pattern.
	 *
	 * @public
	 * @static
	 * @param {string} symbol
	 * @returns {boolean}
	 */
	static getIsCrypto(symbol) {
		return is.string(symbol) && types.crypto.test(symbol);
	}

	/**
	 * Returns true when a symbol represents an option on an equity or index.
	 *
	 * @public
	 * @static
	 * @param {string} symbol
	 * @returns {boolean}
	 */
	static getIsEquityOption(symbol) {
		return is.string(symbol) && types.equities.options.test(symbol);
	}

	/**
	 * Returns true when a symbol represents a futures contract.
	 *
	 * @public
	 * @static
	 * @param {string} symbol
	 * @returns {boolean}
	 */
	static getIsFuture(symbol) {
		return is.string(symbol) && (types.futures.concrete.test(symbol) || types.futures.alias.test(symbol));
	}

	/**
	 * Returns true when a symbol represents a cash futures contract.
	 *
	 * @public
	 * @static
	 * @param {string} symbol
	 * @returns {boolean}
	 */
	static getIsFutureCash(symbol) {
		return SymbolParser.getIsFuture(symbol) && types.futures.cash.test(symbol);
	}

	/**
	 * Returns true when a symbol represents an option on a futures contract.
	 *
	 * @public
	 * @static
	 * @param {string} symbol
	 * @returns {boolean}
	 */
	static getIsFutureOption(symbol) {
		return is.string(symbol) && (types.futures.options.short.test(symbol) || types.futures.options.long.test(symbol) || types.futures.options.historical.test(symbol));
	}

	/**
	 * Returns true when a symbol represents a futures spread.
	 *
	 * @public
	 * @static
	 * @param {string} symbol
	 * @returns {boolean}
	 */
	static getIsFutureSpread(symbol) {
		return is.string(symbol) && types.futures.spread.test(symbol);
	}

	/**
	 * Returns true when a symbol represents a foreign exchange currency pair.
	 * Cryptocurrency symbols can use the same pattern.
	 *
	 * @public
	 * @static
	 * @param {string} symbol
	 * @returns {boolean}
	 */
	static getIsForex(symbol) {
		return is.string(symbol) && types.forex.test(symbol);
	}

	/**
	 * Returns true when a symbol represents a grain bid instrument.
	 *
	 * @public
	 * @static
	 * @param {string} symbol
	 * @returns {boolean}
	 */
	static getIsGrainBid(symbol) {
		return is.string(symbol) && types.bids.test(symbol);
	}

	/**
	 * Returns true when a symbol represents an external index.
	 *
	 * @public
	 * @static
	 * @param {string} symbol
	 * @returns {boolean}
	 */
	static getIsIndex(symbol) {
		return is.string(symbol) && types.indicies.external.test(symbol);
	}

	/**
	 * Returns true when a symbol represents a Platts instrument.
	 *
	 * @public
	 * @static
	 * @param {string} symbol
	 * @returns {boolean}
	 */
	static getIsPlatts(symbol) {
		return is.string(symbol) && (types.platts.concrete.test(symbol) || types.platts.alias.test(symbol));
	}

	/**
	 * Returns true when a symbol represents a Barchart sector.
	 *
	 * @public
	 * @static
	 * @param {string} symbol
	 * @returns {boolean}
	 */
	static getIsSector(symbol) {
		return is.string(symbol) && types.indicies.sector.test(symbol);
	}

	// PREDICATES THAT IDENTIFY A SYMBOL AS HAVING AN ATTRIBUTE (BUT NOT NECESSARILY A SPECIFIC ASSET CLASS).

	/**
	 * Returns true when a symbol is not an alias.
	 *
	 * @public
	 * @static
	 * @param {string} symbol
	 * @returns {boolean}
	 */
	static getIsConcrete(symbol) {
		return is.string(symbol) && !SymbolParser.getIsReference(symbol);
	}

	/**
	 * Returns true when a symbol is an alias (e.g. ZC*1).
	 *
	 * @public
	 * @static
	 * @param {string} symbol
	 * @returns {boolean}
	 */
	static getIsReference(symbol) {
		return is.string(symbol) && types.futures.alias.test(symbol);
	}

	/**
	 * Returns true when a symbol appears to be expired (e.g. ZCZ6 or IBM).
	 *
	 * @public
	 * @static
	 * @param {string} symbol
	 * @returns {boolean}
	 */
	static getIsExpired(symbol) {
		const definition = SymbolParser.parseInstrumentType(symbol);

		if (!(definition !== null && definition.year && definition.month)) {
			return false;
		}

		const currentYear = getCurrentYear();

		if (definition.year < currentYear) {
			return true;
		}

		if (definition.year === currentYear && Object.hasOwn(futuresMonthNumbers, definition.month)) {
			return getCurrentMonth() > futuresMonthNumbers[definition.month];
		}

		return false;
	}

	/**
	 * Returns true when the name identifies a pit-traded instrument.
	 *
	 * @public
	 * @static
	 * @param {string} symbol
	 * @param {string} name
	 * @returns {boolean}
	 */
	static getIsPit(symbol, name) {
		return is.string(symbol) && is.string(name) && predicates.pit.test(name);
	}

	// OTHER NON-PREDICATE UTILITY FUNCTIONS.

	/**
	 * Returns a definition containing information inferred from the symbol.
	 *
	 * @public
	 * @static
	 * @param {string} symbol
	 * @returns {Object|null}
	 */
	static parseInstrumentType(symbol) {
		if (!is.string(symbol)) {
			return null;
		}

		for (const parser of parsers) {
			const definition = parser(symbol);

			if (definition !== null) {
				return definition;
			}
		}

		return null;
	}

	// SYMBOL CONVERSION FUNCTIONS.

	/**
	 * Returns the equivalent symbol recognized by internal quote producers.
	 *
	 * @public
	 * @static
	 * @param {string} symbol
	 * @returns {string|null}
	 */
	static getProducerSymbol(symbol) {
		if (!is.string(symbol)) {
			return null;
		}

		for (const converter of converters) {
			const converted = converter(symbol);

			if (converted !== null) {
				return converted;
			}
		}

		return null;
	}

	/**
	 * Converts a concrete futures symbol to a two-digit-year format.
	 *
	 * @public
	 * @static
	 * @param {string} symbol
	 * @returns {string|null}
	 */
	static getFuturesExplicitFormat(symbol) {
		if (SymbolParser.getIsFuture(symbol) && SymbolParser.getIsConcrete(symbol)) {
			const parsed = SymbolParser.parseInstrumentType(symbol);

			return `${parsed.root}${parsed.month}${string.padLeft(Math.floor(parsed.year % 100).toString(), 2, '0')}`;
		}

		return null;
	}

	/**
	 * Converts a futures option symbol from database format to pipeline format.
	 *
	 * @public
	 * @static
	 * @param {string} symbol
	 * @returns {string|null}
	 */
	static getFuturesOptionPipelineFormat(symbol) {
		const definition = SymbolParser.parseInstrumentType(symbol);

		if (definition.type === 'future_option') {
			const putCallCharacter = getPutCallCharacter(definition.option_type);

			return `${definition.root}${definition.month}${getYearDigits(definition.year, 1)}|${definition.strike}${putCallCharacter}`;
		}

		return null;
	}

	/**
	 * Determines the expiration year represented by a futures year and month code.
	 *
	 * @public
	 * @static
	 * @param {string} yearString
	 * @param {string=} monthCode
	 * @returns {number}
	 */
	static getFuturesYear(yearString, monthCode) {
		return getFuturesYear(yearString, monthCode);
	}

	/**
	 * Returns true when prices for a symbol should be displayed as percentages.
	 *
	 * @public
	 * @static
	 * @param {string} symbol
	 * @returns {boolean}
	 */
	static displayUsingPercent(symbol) {
		return is.string(symbol) && predicates.percent.test(symbol);
	}

	/**
	 * @returns {string}
	 */
	toString() {
		return '[SymbolParser]';
	}
}

const distantFuturesMonths = {
	F: 'A',
	G: 'B',
	H: 'C',
	J: 'D',
	K: 'E',
	M: 'I',
	N: 'L',
	Q: 'O',
	U: 'P',
	V: 'R',
	X: 'S',
	Z: 'T'
};

const alternateFuturesMonths = {
	A: 'F',
	B: 'G',
	C: 'H',
	D: 'J',
	E: 'K',
	I: 'M',
	L: 'N',
	O: 'Q',
	P: 'U',
	R: 'V',
	S: 'X',
	T: 'Z'
};

const futuresMonthNumbers = {
	F: 1,
	G: 2,
	H: 3,
	J: 4,
	K: 5,
	M: 6,
	N: 7,
	Q: 8,
	U: 9,
	V: 10,
	X: 11,
	Z: 12
};

const predicates = {
	bats: /^(.*)\.BZ$/i,
	percent: /(\.RT)$/,
	pit: /\(P(it)?\)/
};

const types = {
	bids: /^([A-Z]{2})([B|P])([A-Z\d]{3,4})-(\d+)-(\d+)(\.CM)$/i,
	c3: {
		alias: /^(C3:)(.*)$/i,
		concrete: /(\.C3)$/i
	},
	cmdty: {
		stats: /(\.CS)$/i,
		internal: /(\.CM)$/i,
		external: /(\.CP)$/i
	},
	crypto: /^\^([A-Z]{3})([A-Z]{3,4})$/i,
	equities: {
		options: /^([A-Z$][A-Z-]{0,}(\.[A-Z]{1})?)([0-9]?)(\.[A-Z]{2})?\|([0-9]{4})([0-9]{2})([0-9]{2})\|([0-9]+\.[0-9]+)[P|W]?(C|P)/i
	},
	forex: /^\^([A-Z]{3})([A-Z]{3})$/i,
	funds: {
		canadian: /(.*)(\.CF)$/i
	},
	futures: {
		alias: /^([A-Z][A-Z0-9$!.-]{0,2})(\*{1})([0-9]{1,2})$/i,
		concrete: /^([A-Z][A-Z0-9$!.-]{0,3})([A-Z]{1})([0-9]{4}|[0-9]{1,2})$/i,
		spread: /^_S_/i,
		cash: /(.*)(Y00)$/,
		options: {
			historical: /^([A-Z][A-Z0-9$!.-]{0,2})([A-Z])([0-9]{2})([0-9]{1,5})(C|P)$/i,
			long: /^([A-Z][A-Z0-9$!.-]{0,2})([A-Z])([0-9]{1,4})\|(-?[0-9]{1,5})(C|P)$/i,
			short: /^([A-Z][A-Z0-9$!.-]?)([A-Z])([0-9]{1,4})([A-Z])$/i
		}
	},
	indicies: {
		external: /^\$(.*)$/i,
		sector: /^-(.*)$/i
	},
	platts: {
		alias: /^(PLATTS:)(.*)$/i,
		concrete: /^(.*)(\.PT)$/i
	}
};

/**
 * @returns {number}
 */
function getCurrentMonth() {
	return new Date().getMonth() + 1;
}

/**
 * @returns {number}
 */
function getCurrentYear() {
	return new Date().getFullYear();
}

/**
 * @param {number} year
 * @param {number} digits
 * @returns {string}
 */
function getYearDigits(year, digits) {
	const yearString = year.toString();

	return yearString.substring(yearString.length - digits, yearString.length);
}

/**
 * @param {string} monthString
 * @returns {string}
 */
function getFuturesMonth(monthString) {
	return alternateFuturesMonths[monthString] || monthString;
}

/**
 * Determines the four-digit futures year represented by a symbol year.
 *
 * @param {string} yearString
 * @param {string=} monthCode
 * @returns {number}
 */
function getFuturesYear(yearString, monthCode) {
	const currentYear = getCurrentYear();

	let year = parseInt(yearString);

	if (year === 0 && monthCode === 'Y') {
		year = Math.floor(currentYear / 100) * 100 + 100;
	} else if (year < 10 && yearString.length === 1) {
		const bump = year < currentYear % 10 ? 1 : 0;

		year = Math.floor(currentYear / 10) * 10 + year + (bump * 10);
	} else if (year < 100) {
		year = Math.floor(currentYear / 100) * 100 + year;

		if (currentYear + 25 < year) {
			year = year - 100;
		}
	}

	return year;
}

/**
 * @param {string} optionType
 * @returns {string|null}
 */
function getPutCallCharacter(optionType) {
	if (optionType === 'call') {
		return 'C';
	} else if (optionType === 'put') {
		return 'P';
	}

	return null;
}

const parsers = [
	(symbol) => {
		if (types.futures.spread.test(symbol)) {
			return {
				symbol,
				type: 'future_spread'
			};
		}

		return null;
	},
	(symbol) => {
		const match = symbol.match(types.futures.concrete);

		if (match !== null) {
			return {
				symbol,
				type: 'future',
				asset: AssetClass.FUTURE,
				dynamic: false,
				root: match[1],
				month: match[2],
				year: getFuturesYear(match[3], match[2])
			};
		}

		return null;
	},
	(symbol) => {
		const match = symbol.match(types.futures.alias);

		if (match !== null) {
			return {
				symbol,
				type: 'future',
				asset: AssetClass.FUTURE,
				dynamic: true,
				root: match[1],
				dynamicCode: match[3]
			};
		}

		return null;
	},
	(symbol) => {
		if (types.forex.test(symbol)) {
			return {
				symbol,
				type: 'forex',
				asset: AssetClass.FOREX
			};
		}

		return null;
	},
	(symbol) => {
		const match = symbol.match(types.equities.options);

		if (match !== null) {
			const suffix = typeof match[4] !== 'undefined' ? match[4] : '';

			return {
				symbol,
				type: 'equity_option',
				asset: AssetClass.STOCK_OPTION,
				option_type: match[9] === 'C' ? 'call' : 'put',
				strike: parseFloat(match[8]),
				root: `${match[1]}${suffix}`,
				month: parseInt(match[6]),
				day: parseInt(match[7]),
				year: parseInt(match[5]),
				adjusted: match[3] !== ''
			};
		}

		return null;
	},
	(symbol) => {
		if (types.indicies.external.test(symbol)) {
			return {
				symbol,
				type: 'index'
			};
		}

		return null;
	},
	(symbol) => {
		if (types.indicies.sector.test(symbol)) {
			return {
				symbol,
				type: 'sector'
			};
		}

		return null;
	},
	(symbol) => {
		const match = symbol.match(types.futures.options.short);

		if (match !== null) {
			const putCallCharacterCode = match[4].charCodeAt(0);
			const putCharacterCode = 80;
			const callCharacterCode = 67;
			const call = putCallCharacterCode < putCharacterCode;

			return {
				symbol,
				type: 'future_option',
				asset: AssetClass.FUTURE_OPTION,
				option_type: call ? 'call' : 'put',
				strike: parseInt(match[3]),
				root: match[1],
				month: match[2],
				year: getCurrentYear() + putCallCharacterCode - (call ? callCharacterCode : putCharacterCode)
			};
		}

		return null;
	},
	(symbol) => {
		const match = symbol.match(types.futures.options.long) || symbol.match(types.futures.options.historical);

		if (match !== null) {
			return {
				symbol,
				type: 'future_option',
				asset: AssetClass.FUTURE_OPTION,
				option_type: match[5] === 'C' ? 'call' : 'put',
				strike: parseInt(match[4]),
				root: match[1],
				month: getFuturesMonth(match[2]),
				year: getFuturesYear(match[3])
			};
		}

		return null;
	},
	(symbol) => {
		if (types.cmdty.stats.test(symbol)) {
			return {
				symbol,
				type: 'cmdtyStats',
				asset: AssetClass.CMDTY_STATS
			};
		}

		return null;
	}
];

const converters = [
	(symbol) => {
		if (SymbolParser.getIsFuture(symbol) && SymbolParser.getIsConcrete(symbol)) {
			const matches = symbol.match(types.futures.concrete);

			if (matches !== null) {
				const root = matches[1];
				const month = matches[2];
				const year = getFuturesYear(matches[3], month);

				if (year > getCurrentYear() + 9) {
					const distant = distantFuturesMonths[month];

					if (distant) {
						return `${root}${distant}${getYearDigits(year, 1)}`;
					}
				}
			}
		}

		return null;
	},
	(symbol) => {
		if (SymbolParser.getIsFuture(symbol) && SymbolParser.getIsConcrete(symbol)) {
			return symbol.replace(/(.{1,4})([A-Z]{1})([0-9]{3}|[0-9]{1})?([0-9]{1})$/i, '$1$2$4') || null;
		}

		return null;
	},
	(symbol) => {
		if (SymbolParser.getIsFutureOption(symbol)) {
			const definition = SymbolParser.parseInstrumentType(symbol);
			const putCallCharacter = getPutCallCharacter(definition.option_type);

			if (definition.root.length < 3) {
				const putCallCharacterCode = putCallCharacter.charCodeAt(0);

				return `${definition.root}${definition.month}${definition.strike}${String.fromCharCode(putCallCharacterCode + definition.year - getCurrentYear())}`;
			}

			return `${definition.root}${definition.month}${getYearDigits(definition.year, 1)}|${definition.strike}${putCallCharacter}`;
		}

		return null;
	},
	(symbol) => types.c3.alias.test(symbol) ? symbol.replace(types.c3.alias, '$2.C3') : null,
	(symbol) => types.platts.alias.test(symbol) ? symbol.replace(types.platts.alias, '$2.PT') : null,
	(symbol) => symbol
];

export default SymbolParser;
