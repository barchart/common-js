(() => {
  // ../common-js/lang/is.js
  function number(candidate) {
    return typeof candidate === "number" && !isNaN(candidate);
  }
  function integer(candidate) {
    return typeof candidate === "number" && !isNaN(candidate) && (candidate | 0) === candidate;
  }
  function string(candidate) {
    return typeof candidate === "string";
  }
  function date(candidate) {
    return candidate instanceof Date;
  }
  function regexp(candidate) {
    return candidate instanceof RegExp;
  }
  function fn(candidate) {
    return typeof candidate === "function";
  }
  function array(candidate) {
    return Array.isArray(candidate);
  }
  function boolean(candidate) {
    return typeof candidate === "boolean";
  }

  // ../common-js/lang/assert.js
  function checkArgumentType(variable, variableName, type, typeDescription, index) {
    if (type === String) {
      if (!string(variable)) {
        throwInvalidTypeError(variableName, "string", index);
      }
    } else if (type === Number) {
      if (!number(variable)) {
        throwInvalidTypeError(variableName, "number", index);
      }
    } else if (type === Function) {
      if (!fn(variable)) {
        throwInvalidTypeError(variableName, "function", index);
      }
    } else if (type === Boolean) {
      if (!boolean(variable)) {
        throwInvalidTypeError(variableName, "boolean", index);
      }
    } else if (type === Date) {
      if (!date(variable)) {
        throwInvalidTypeError(variableName, "date", index);
      }
    } else if (type === RegExp) {
      if (!regexp(variable)) {
        throwInvalidTypeError(variableName, "RegExp", index);
      }
    } else if (type === Array) {
      if (!array(variable)) {
        throwInvalidTypeError(variableName, "array", index);
      }
    } else if (!(variable instanceof (type || Object))) {
      throwInvalidTypeError(variableName, typeDescription, index);
    }
  }
  function throwInvalidTypeError(variableName, typeDescription, index) {
    let message;
    if (typeof index === "number") {
      message = `The argument [ ${variableName || "unspecified"} ], at index [ ${index.toString()} ] must be a [ ${typeDescription || "unknown"} ]`;
    } else {
      message = `The argument [ ${variableName || "unspecified"} ] must be a [ ${typeDescription || "Object"} ]`;
    }
    throw new Error(message);
  }
  function throwCustomValidationError(variableName, predicateDescription) {
    throw new Error(`The argument [ ${variableName || "unspecified"} ] failed a validation check [ ${predicateDescription || "No description available"} ]`);
  }
  function argumentIsRequired(variable, variableName, type, typeDescription) {
    checkArgumentType(variable, variableName, type, typeDescription);
  }
  function argumentIsOptional(variable, variableName, type, typeDescription, predicate, predicateDescription) {
    if (variable === null || variable === void 0) {
      return;
    }
    checkArgumentType(variable, variableName, type, typeDescription);
    if (fn(predicate) && !predicate(variable)) {
      throwCustomValidationError(variableName, predicateDescription);
    }
  }
  function argumentIsValid(variable, variableName, predicate, predicateDescription) {
    if (!predicate(variable)) {
      throwCustomValidationError(variableName, predicateDescription);
    }
  }

  // ../common-js/lang/Enum.js
  var types = /* @__PURE__ */ new Map();
  var Enum = class _Enum {
    #code;
    #description;
    #mapping;
    /**
     * @param {string} code - The unique code of the enumeration item.
     * @param {string} description - A description of the enumeration item.
     * @param {number=} mapping - An alternate key value (used when external systems identify enumeration items using integer values).
     */
    constructor(code, description, mapping) {
      argumentIsRequired(code, "code", String);
      argumentIsRequired(description, "description", String);
      argumentIsOptional(mapping, "mapping", Number);
      if (number(mapping)) {
        argumentIsValid(mapping, "mapping", integer, "must be an integer");
      }
      this.#code = code;
      this.#description = description;
      if (number(mapping)) {
        this.#mapping = mapping;
      } else {
        this.#mapping = null;
      }
      const c = this.constructor;
      if (!types.has(c)) {
        types.set(c, []);
      }
      const valid = _Enum.fromCode(c, this.#code) === null && (this.#mapping === null || _Enum.fromMapping(c, this.#mapping) === null);
      if (valid) {
        types.get(c).push(this);
      }
    }
    /**
     * The unique code.
     *
     * @public
     * @returns {string}
     */
    get code() {
      return this.#code;
    }
    /**
     * The description.
     *
     * @public
     * @returns {string}
     */
    get description() {
      return this.#description;
    }
    /**
     * An alternate key value (used when external systems identify enumeration items
     * using numeric values). This value will not be present for all enumerations.
     *
     * @public
     * @returns {number|null}
     */
    get mapping() {
      return this.#mapping;
    }
    /**
     * Returns true if the provided {@link Enum} argument is equal
     * to the instance.
     *
     * @public
     * @param {Enum} other
     * @returns {boolean}
     */
    equals(other) {
      return other === this || other instanceof _Enum && other.constructor === this.constructor && other.code === this.code;
    }
    /**
     * Returns the JSON representation.
     *
     * @public
     * @returns {string}
     */
    toJSON() {
      return this.code;
    }
    /**
     * Looks up an enumeration item; given the enumeration type and the enumeration
     * item's value. If no matching item can be found, a null value is returned.
     *
     * @public
     * @static
     * @param {Function} type - The enumeration type.
     * @param {string} code - The enumeration item's code.
     * @returns {Enum|null}
     */
    static fromCode(type, code) {
      return _Enum.getItems(type).find((x) => x.code === code) || null;
    }
    /**
     * Looks up an enumeration item; given the enumeration type and the enumeration
     * item's value. If no matching item can be found, a null value is returned.
     *
     * @public
     * @static
     * @param {Function} type - The enumeration type.
     * @param {number} mapping - The enumeration item's mapping value.
     * @returns {Enum|null}
     */
    static fromMapping(type, mapping) {
      if (mapping === null) {
        return null;
      }
      return _Enum.getItems(type).find((x) => x.mapping === mapping) || null;
    }
    /**
     * Returns the enumeration's items (given an enumeration type).
     *
     * @public
     * @static
     * @param {Function} type - The enumeration to list.
     * @returns {Array}
     */
    static getItems(type) {
      return types.get(type) || [];
    }
    /**
     * Returns a string representation.
     *
     * @public
     * @returns {string}
     */
    toString() {
      return "[Enum]";
    }
  };

  // symbology/AssetClass.js
  var AssetClass = class _AssetClass extends Enum {
    #id;
    /**
     * @param {string} code
     * @param {string} description
     * @param {number} id
     */
    constructor(code, description, id) {
      super(code, description);
      this.#id = id;
    }
    /**
     * A unique numeric identifier assigned by Barchart.
     *
     * @public
     * @returns {number}
     */
    get id() {
      return this.#id;
    }
    /**
     * @returns {number}
     */
    toJSON() {
      return this.#id;
    }
    /**
     * Converts a string-based identifier into an enumeration item.
     *
     * @public
     * @static
     * @param {string} code
     * @returns {AssetClass|null}
     */
    static parse(code) {
      return (
        /** @type {AssetClass|null} */
        Enum.fromCode(_AssetClass, code)
      );
    }
    /**
     * Converts a numeric identifier into an enumeration item.
     *
     * @public
     * @static
     * @param {number} id
     * @returns {AssetClass|null}
     */
    static fromId(id) {
      return (
        /** @type {AssetClass|null} */
        Enum.getItems(_AssetClass).find((x) => x.id === id) || null
      );
    }
    /** @returns {AssetClass} */
    static get STOCK() {
      return STOCK;
    }
    /** @returns {AssetClass} */
    static get STOCK_OPTION() {
      return STOCK_OPTION;
    }
    /** @returns {AssetClass} */
    static get FUTURE() {
      return FUTURE;
    }
    /** @returns {AssetClass} */
    static get FUTURE_OPTION() {
      return FUTURE_OPTION;
    }
    /** @returns {AssetClass} */
    static get FOREX() {
      return FOREX;
    }
    /** @returns {AssetClass} */
    static get CMDTY_STATS() {
      return CMDTY_STATS;
    }
    /**
     * @returns {string}
     */
    toString() {
      return `[AssetClass (id=${this.id}, code=${this.code})]`;
    }
  };
  var STOCK = new AssetClass("STK", "U.S. Equity", 1);
  var STOCK_OPTION = new AssetClass("STKOPT", "Equity Option", 34);
  var FUTURE = new AssetClass("FUT", "Future", 2);
  var FUTURE_OPTION = new AssetClass("FUTOPT", "Future Option", 12);
  var FOREX = new AssetClass("FOREX", "FOREX", 10);
  var CMDTY_STATS = new AssetClass("CMDTY", "cmdtyStats", 24);

  // test/specs/symbology/AssetClassSpec.js
  describe("AssetClass", () => {
    it("exposes the asset classes used by parsed symbols", () => {
      expect(AssetClass.STOCK.code).toEqual("STK");
      expect(AssetClass.STOCK_OPTION.code).toEqual("STKOPT");
      expect(AssetClass.FUTURE.code).toEqual("FUT");
      expect(AssetClass.FUTURE_OPTION.code).toEqual("FUTOPT");
      expect(AssetClass.FOREX.code).toEqual("FOREX");
      expect(AssetClass.CMDTY_STATS.code).toEqual("CMDTY");
    });
    it("looks up asset classes by code and id", () => {
      expect(AssetClass.parse("FUT")).toBe(AssetClass.FUTURE);
      expect(AssetClass.fromId(12)).toBe(AssetClass.FUTURE_OPTION);
      expect(AssetClass.parse("UNKNOWN")).toBeNull();
      expect(AssetClass.fromId(-1)).toBeNull();
    });
    it("serializes to the Barchart numeric id", () => {
      expect(AssetClass.STOCK_OPTION.id).toEqual(34);
      expect(AssetClass.STOCK_OPTION.toJSON()).toEqual(34);
    });
  });

  // ../common-js/lang/string.js
  var regex = {};
  regex.camel = {};
  regex.camel.violations = /\b[A-Z]/g;
  function padLeft(s, length, character) {
    argumentIsRequired(s, "s", String);
    argumentIsRequired(length, "length", Number);
    argumentIsRequired(character, "character", String);
    if (character.length !== 1) {
      throw new Error('The "character" argument must be one character in length.');
    }
    return character.repeat(length - s.length) + s;
  }

  // symbology/SymbolParser.js
  var distantFuturesMonths = {
    F: "A",
    G: "B",
    H: "C",
    J: "D",
    K: "E",
    M: "I",
    N: "L",
    Q: "O",
    U: "P",
    V: "R",
    X: "S",
    Z: "T"
  };
  var alternateFuturesMonths = {
    A: "F",
    B: "G",
    C: "H",
    D: "J",
    E: "K",
    I: "M",
    L: "N",
    O: "Q",
    P: "U",
    R: "V",
    S: "X",
    T: "Z"
  };
  var futuresMonthNumbers = {
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
  var predicates = {
    bats: /^(.*)\.BZ$/i,
    percent: /(\.RT)$/,
    pit: /\(P(it)?\)/
  };
  var types2 = {
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
      concrete: /^([A-Z][A-Z0-9$!.-]{0,2})([A-Z]{1})([0-9]{4}|[0-9]{1,2})$/i,
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
  function getCurrentMonth() {
    return (/* @__PURE__ */ new Date()).getMonth() + 1;
  }
  function getCurrentYear() {
    return (/* @__PURE__ */ new Date()).getFullYear();
  }
  function getYearDigits(year, digits) {
    const yearString = year.toString();
    return yearString.substring(yearString.length - digits, yearString.length);
  }
  function getFuturesMonth(monthString) {
    return alternateFuturesMonths[monthString] || monthString;
  }
  function getFuturesYear(yearString, monthCode) {
    const currentYear = getCurrentYear();
    let year = parseInt(yearString);
    if (year === 0 && monthCode === "Y") {
      year = Math.floor(currentYear / 100) * 100 + 100;
    } else if (year < 10 && yearString.length === 1) {
      const bump = year < currentYear % 10 ? 1 : 0;
      year = Math.floor(currentYear / 10) * 10 + year + bump * 10;
    } else if (year < 100) {
      year = Math.floor(currentYear / 100) * 100 + year;
      if (currentYear + 25 < year) {
        year = year - 100;
      }
    }
    return year;
  }
  function getPutCallCharacter(optionType) {
    if (optionType === "call") {
      return "C";
    } else if (optionType === "put") {
      return "P";
    }
    return null;
  }
  var SymbolParser = class _SymbolParser {
    /**
     * Returns true when a symbol is not an alias.
     *
     * @public
     * @static
     * @param {string} symbol
     * @returns {boolean}
     */
    static getIsConcrete(symbol) {
      return string(symbol) && !_SymbolParser.getIsReference(symbol);
    }
    /**
     * Returns true when a symbol is an alias.
     *
     * @public
     * @static
     * @param {string} symbol
     * @returns {boolean}
     */
    static getIsReference(symbol) {
      return string(symbol) && types2.futures.alias.test(symbol);
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
      return string(symbol) && (types2.futures.concrete.test(symbol) || types2.futures.alias.test(symbol));
    }
    /**
     * Returns true when a symbol represents a cash futures contract.
     *
     * @public
     * @static
     * @param {string} symbol
     * @returns {boolean}
     */
    static getIsCash(symbol) {
      return _SymbolParser.getIsFuture(symbol) && types2.futures.cash.test(symbol);
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
      return string(symbol) && types2.futures.spread.test(symbol);
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
      return string(symbol) && (types2.futures.options.short.test(symbol) || types2.futures.options.long.test(symbol) || types2.futures.options.historical.test(symbol));
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
      return string(symbol) && types2.forex.test(symbol);
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
      return string(symbol) && types2.crypto.test(symbol);
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
      return string(symbol) && types2.indicies.external.test(symbol);
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
      return string(symbol) && types2.indicies.sector.test(symbol);
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
      return string(symbol) && types2.funds.canadian.test(symbol);
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
      return string(symbol) && (types2.cmdty.stats.test(symbol) || types2.cmdty.internal.test(symbol) || types2.cmdty.external.test(symbol));
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
      return string(symbol) && types2.cmdty.stats.test(symbol);
    }
    /**
     * Returns true when a symbol is listed on the BATS exchange.
     *
     * @public
     * @static
     * @param {string} symbol
     * @returns {boolean}
     */
    static getIsBats(symbol) {
      return string(symbol) && predicates.bats.test(symbol);
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
      return string(symbol) && types2.equities.options.test(symbol);
    }
    /**
     * Returns true when a dated symbol appears to be expired.
     *
     * @public
     * @static
     * @param {string} symbol
     * @returns {boolean}
     */
    static getIsExpired(symbol) {
      const definition = _SymbolParser.parseInstrumentType(symbol);
      if (definition !== null && definition.year && definition.month) {
        const currentYear = getCurrentYear();
        if (definition.year < currentYear) {
          return true;
        }
        if (definition.year === currentYear && Object.hasOwn(futuresMonthNumbers, definition.month)) {
          return getCurrentMonth() > futuresMonthNumbers[definition.month];
        }
      }
      return false;
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
      return string(symbol) && (types2.c3.concrete.test(symbol) || types2.c3.alias.test(symbol));
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
      return string(symbol) && (types2.platts.concrete.test(symbol) || types2.platts.alias.test(symbol));
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
      return string(symbol) && string(name) && predicates.pit.test(name);
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
      return string(symbol) && types2.bids.test(symbol);
    }
    /**
     * Returns a definition containing information inferred from the symbol.
     *
     * @public
     * @static
     * @param {string} symbol
     * @returns {Object|null}
     */
    static parseInstrumentType(symbol) {
      if (!string(symbol)) {
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
    /**
     * Returns the equivalent symbol recognized by internal quote producers.
     *
     * @public
     * @static
     * @param {string} symbol
     * @returns {string|null}
     */
    static getProducerSymbol(symbol) {
      if (!string(symbol)) {
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
     * Converts a futures option symbol from database format to pipeline format.
     *
     * @public
     * @static
     * @param {string} symbol
     * @returns {string|null}
     */
    static getFuturesOptionPipelineFormat(symbol) {
      const definition = _SymbolParser.parseInstrumentType(symbol);
      if (definition.type === "future_option") {
        const putCallCharacter = getPutCallCharacter(definition.option_type);
        return `${definition.root}${definition.month}${getYearDigits(definition.year, 1)}|${definition.strike}${putCallCharacter}`;
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
      if (_SymbolParser.getIsFuture(symbol) && _SymbolParser.getIsConcrete(symbol)) {
        const parsed = _SymbolParser.parseInstrumentType(symbol);
        return `${parsed.root}${parsed.month}${padLeft(Math.floor(parsed.year % 100).toString(), 2, "0")}`;
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
      return string(symbol) && predicates.percent.test(symbol);
    }
    /**
     * @returns {string}
     */
    toString() {
      return "[SymbolParser]";
    }
  };
  var parsers = [
    (symbol) => {
      if (types2.futures.spread.test(symbol)) {
        return {
          symbol,
          type: "future_spread"
        };
      }
      return null;
    },
    (symbol) => {
      const match = symbol.match(types2.futures.concrete);
      if (match !== null) {
        return {
          symbol,
          type: "future",
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
      const match = symbol.match(types2.futures.alias);
      if (match !== null) {
        return {
          symbol,
          type: "future",
          asset: AssetClass.FUTURE,
          dynamic: true,
          root: match[1],
          dynamicCode: match[3]
        };
      }
      return null;
    },
    (symbol) => {
      if (types2.forex.test(symbol)) {
        return {
          symbol,
          type: "forex",
          asset: AssetClass.FOREX
        };
      }
      return null;
    },
    (symbol) => {
      const match = symbol.match(types2.equities.options);
      if (match !== null) {
        const suffix = typeof match[4] !== "undefined" ? match[4] : "";
        return {
          symbol,
          type: "equity_option",
          asset: AssetClass.STOCK_OPTION,
          option_type: match[9] === "C" ? "call" : "put",
          strike: parseFloat(match[8]),
          root: `${match[1]}${suffix}`,
          month: parseInt(match[6]),
          day: parseInt(match[7]),
          year: parseInt(match[5]),
          adjusted: match[3] !== ""
        };
      }
      return null;
    },
    (symbol) => {
      if (types2.indicies.external.test(symbol)) {
        return {
          symbol,
          type: "index"
        };
      }
      return null;
    },
    (symbol) => {
      if (types2.indicies.sector.test(symbol)) {
        return {
          symbol,
          type: "sector"
        };
      }
      return null;
    },
    (symbol) => {
      const match = symbol.match(types2.futures.options.short);
      if (match !== null) {
        const putCallCharacterCode = match[4].charCodeAt(0);
        const putCharacterCode = 80;
        const callCharacterCode = 67;
        const call = putCallCharacterCode < putCharacterCode;
        return {
          symbol,
          type: "future_option",
          asset: AssetClass.FUTURE_OPTION,
          option_type: call ? "call" : "put",
          strike: parseInt(match[3]),
          root: match[1],
          month: match[2],
          year: getCurrentYear() + putCallCharacterCode - (call ? callCharacterCode : putCharacterCode)
        };
      }
      return null;
    },
    (symbol) => {
      const match = symbol.match(types2.futures.options.long) || symbol.match(types2.futures.options.historical);
      if (match !== null) {
        return {
          symbol,
          type: "future_option",
          asset: AssetClass.FUTURE_OPTION,
          option_type: match[5] === "C" ? "call" : "put",
          strike: parseInt(match[4]),
          root: match[1],
          month: getFuturesMonth(match[2]),
          year: getFuturesYear(match[3])
        };
      }
      return null;
    },
    (symbol) => {
      if (types2.cmdty.stats.test(symbol)) {
        return {
          symbol,
          type: "cmdtyStats",
          asset: AssetClass.CMDTY_STATS
        };
      }
      return null;
    }
  ];
  var converters = [
    (symbol) => {
      if (SymbolParser.getIsFuture(symbol) && SymbolParser.getIsConcrete(symbol)) {
        const matches = symbol.match(types2.futures.concrete);
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
        return symbol.replace(/(.{1,3})([A-Z]{1})([0-9]{3}|[0-9]{1})?([0-9]{1})$/i, "$1$2$4") || null;
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
    (symbol) => types2.c3.alias.test(symbol) ? symbol.replace(types2.c3.alias, "$2.C3") : null,
    (symbol) => types2.platts.alias.test(symbol) ? symbol.replace(types2.platts.alias, "$2.PT") : null,
    (symbol) => symbol
  ];

  // test/specs/symbology/SymbolParserSpec.js
  describe("SymbolParser", () => {
    describe("parseInstrumentType", () => {
      it("parses concrete and reference futures", () => {
        expect(SymbolParser.parseInstrumentType("ESM08")).toEqual({
          symbol: "ESM08",
          type: "future",
          asset: AssetClass.FUTURE,
          dynamic: false,
          root: "ES",
          month: "M",
          year: 2008
        });
        expect(SymbolParser.parseInstrumentType("NG*13")).toEqual({
          symbol: "NG*13",
          type: "future",
          asset: AssetClass.FUTURE,
          dynamic: true,
          root: "NG",
          dynamicCode: "13"
        });
      });
      it("parses cash futures", () => {
        expect(SymbolParser.parseInstrumentType("SPY00")).toEqual({
          symbol: "SPY00",
          type: "future",
          asset: AssetClass.FUTURE,
          dynamic: false,
          root: "SP",
          month: "Y",
          year: 2100
        });
      });
      it("parses foreign exchange symbols", () => {
        expect(SymbolParser.parseInstrumentType("^EURUSD")).toEqual({
          symbol: "^EURUSD",
          type: "forex",
          asset: AssetClass.FOREX
        });
      });
      it("parses indexes, sectors, and futures spreads", () => {
        expect(SymbolParser.parseInstrumentType("$DOWI")).toEqual({
          symbol: "$DOWI",
          type: "index"
        });
        expect(SymbolParser.parseInstrumentType("-001A")).toEqual({
          symbol: "-001A",
          type: "sector"
        });
        expect(SymbolParser.parseInstrumentType("_S_SP_ZCH7_ZCK7")).toEqual({
          symbol: "_S_SP_ZCH7_ZCK7",
          type: "future_spread"
        });
      });
      it("parses futures options in database and pipeline formats", () => {
        expect(SymbolParser.parseInstrumentType("ESZ2660Q")).toEqual(jasmine.objectContaining({
          symbol: "ESZ2660Q",
          type: "future_option",
          asset: AssetClass.FUTURE_OPTION,
          option_type: "put",
          strike: 2660,
          root: "ES",
          month: "Z"
        }));
        expect(SymbolParser.parseInstrumentType("ZWH9|470C")).toEqual(jasmine.objectContaining({
          symbol: "ZWH9|470C",
          type: "future_option",
          asset: AssetClass.FUTURE_OPTION,
          option_type: "call",
          strike: 470,
          root: "ZW",
          month: "H",
          year: 2029
        }));
      });
      it("parses equity options", () => {
        expect(SymbolParser.parseInstrumentType("AAPL|20200515|250.00P")).toEqual({
          symbol: "AAPL|20200515|250.00P",
          type: "equity_option",
          asset: AssetClass.STOCK_OPTION,
          option_type: "put",
          strike: 250,
          root: "AAPL",
          month: 5,
          day: 15,
          year: 2020,
          adjusted: false
        });
        expect(SymbolParser.parseInstrumentType("HBM2.TO|20220121|1.00C")).toEqual(jasmine.objectContaining({
          type: "equity_option",
          root: "HBM.TO",
          adjusted: true
        }));
      });
      it("parses cmdtyStats instruments", () => {
        expect(SymbolParser.parseInstrumentType("AE030UBX.CS")).toEqual({
          symbol: "AE030UBX.CS",
          type: "cmdtyStats",
          asset: AssetClass.CMDTY_STATS
        });
      });
      it("returns null when the symbol type cannot be inferred", () => {
        expect(SymbolParser.parseInstrumentType("IBM")).toBeNull();
        expect(SymbolParser.parseInstrumentType(null)).toBeNull();
      });
    });
    describe("type predicates", () => {
      const cases = [
        ["getIsConcrete", "ESZ6", true],
        ["getIsConcrete", "ES*1", false],
        ["getIsReference", "ES*1", true],
        ["getIsFuture", "O!H2017", true],
        ["getIsFuture", "IBM", false],
        ["getIsCash", "ESY00", true],
        ["getIsFutureSpread", "_S_SP_ZCH7_ZCK7", true],
        ["getIsFutureOption", "ZWH9|470C", true],
        ["getIsForex", "^EURUSD", true],
        ["getIsCrypto", "^BTCUSDT", true],
        ["getIsIndex", "$DOWI", true],
        ["getIsSector", "-001A", true],
        ["getIsCanadianFund", "VIC400.CF", true],
        ["getIsCmdty", "ZCPAUS.CM", true],
        ["getIsCmdty", "SCB001.CP", true],
        ["getIsCmdtyStats", "AE030UBX.CS", true],
        ["getIsBats", "AAPL.BZ", true],
        ["getIsEquityOption", "AAPL|20200515|250.00P", true],
        ["getIsC3", "C3:AL79MRM1", true],
        ["getIsC3", "AL79MRM1.C3", true],
        ["getIsPlatts", "PLATTS:AAVSV00", true],
        ["getIsPlatts", "AAVSV00.PT", true],
        ["getIsGrainBid", "USBCORN-123-456.CM", true]
      ];
      cases.forEach(([method, symbol, expected]) => {
        it(`${method} identifies ${symbol}`, () => {
          expect(SymbolParser[method](symbol)).toEqual(expected);
        });
      });
      it("identifies pit instruments using their names", () => {
        expect(SymbolParser.getIsPit("ZCZ6", "Corn (Pit)")).toEqual(true);
        expect(SymbolParser.getIsPit("ZCZ6", "Corn")).toEqual(false);
      });
      it("identifies percentage symbols", () => {
        expect(SymbolParser.displayUsingPercent("US10Y.RT")).toEqual(true);
        expect(SymbolParser.displayUsingPercent("US10Y")).toEqual(false);
      });
      it("identifies expired symbols", () => {
        expect(SymbolParser.getIsExpired("ESM08")).toEqual(true);
        expect(SymbolParser.getIsExpired("ESZ47")).toEqual(false);
        expect(SymbolParser.getIsExpired("IBM")).toEqual(false);
      });
    });
    describe("normalization", () => {
      it("expands futures symbols to two-digit years", () => {
        expect(SymbolParser.getFuturesExplicitFormat("ESZ9")).toEqual("ESZ29");
        expect(SymbolParser.getFuturesExplicitFormat("ES*1")).toBeNull();
        expect(SymbolParser.getFuturesExplicitFormat("IBM")).toBeNull();
      });
      it("normalizes producer symbols", () => {
        expect(SymbolParser.getProducerSymbol("ESZ2029")).toEqual("ESZ9");
        expect(SymbolParser.getProducerSymbol("C3:AL79MRM1")).toEqual("AL79MRM1.C3");
        expect(SymbolParser.getProducerSymbol("PLATTS:AAVSV00")).toEqual("AAVSV00.PT");
        expect(SymbolParser.getProducerSymbol("IBM")).toEqual("IBM");
        expect(SymbolParser.getProducerSymbol(null)).toBeNull();
      });
      it("converts futures options to pipeline format", () => {
        expect(SymbolParser.getFuturesOptionPipelineFormat("ZWH29|470C")).toEqual("ZWH9|470C");
      });
      it("calculates full futures years", () => {
        spyOn(Date.prototype, "getFullYear").and.returnValue(2022);
        expect(SymbolParser.getFuturesYear("29", "Z")).toEqual(2029);
        expect(SymbolParser.getFuturesYear("48", "Z")).toEqual(1948);
        expect(SymbolParser.getFuturesYear("2032", "Z")).toEqual(2032);
      });
    });
    it("has a useful string representation", () => {
      expect(new SymbolParser().toString()).toEqual("[SymbolParser]");
    });
  });
})();
