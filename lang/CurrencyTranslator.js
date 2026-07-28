const assert = require('./assert'),
	array = require('./array'),
	Currency = require('./Currency'),
	Decimal = require('./Decimal'),
	Rate = require('./Rate');

const comparators = require('./../collections/sorting/comparators'),
	ComparatorBuilder = require('./../collections/sorting/ComparatorBuilder');

const Edge = require('./../collections/graph/Edge'),
	Vertex = require('./../collections/graph/Vertex'),
	memoize = require('./memoize');

module.exports = (() => {
	'use strict';

	/**
	 * A calculator that translates an amount of one currency into an amount
	 * in another currency. The calculator prefers to use direct conversions;
	 * however, it supports indirect conversions (which require conversions
	 * to one or more intermediate currencies before translation to the final,
	 * desired currency).
	 *
	 * @public
	 * @param {String[]} symbols - Forex symbols which will be used for translations.
	 */
	class CurrencyTranslator {
		constructor(symbols) {
			assert.argumentIsArray(symbols, 'symbols', String);

			this._configuration = { };
			this._configuration.symbols = symbols;
			
			this._maps = { };

			this._maps.rates = new Map();
			this._maps.translation = new Map();

			reset.call(this);
		}

		/**
		 * Adds the ability to use forex symbol (rates) during translation.
		 *
		 * This is an expensive operation and should not be used frequently
		 * since it causes internal data structures which control which forex
		 * rates will be for translation to be regenerated. Whenever possible,
		 * supply all forex symbols when the instance is constructed.
		 *
		 * @public
		 * @param {string} symbol
		 */
		addSymbol(symbol) {
			assert.argumentIsRequired(symbol, 'symbol', String);

			this.addSymbols([ symbol ]);
		}

		/**
		 * Adds the ability to use forex symbols (rates) during translation.
		 *
		 * This is an expensive operation and should not be used frequently
		 * since it causes internal data structures which control which forex
		 * rates will be for translation to be regenerated. Whenever possible,
		 * supply all forex symbols when the instance is constructed.
		 *
		 * @public
		 * @param {string[]} symbols
		 */
		addSymbols(symbols) {
			assert.argumentIsArray(symbols, 'symbols', String);

			this._configuration.symbols = array.unique([ ...this._configuration.symbols, ...symbols ]);

			reset.call(this);
		}

		/**
		 * Indicates if a translation from one currency to another is supported. That said,
		 * even if a translation is supported, it may still fail if the required rates have
		 * not been set.
		 *
		 * @public
		 * @param {Currency} current
		 * @param {Currency} desired
		 * @returns {boolean}
		 */
		supportsTranslation(current, desired) {
			assert.argumentIsRequired(current, 'current', Currency, 'Currency');
			assert.argumentIsRequired(desired, 'desired', Currency, 'Currency');

			if (current === desired) {
				return true;
			}

			const first = this._maps.translation.get(current) || null;

			if (first === null) {
				return false;
			}

			const second = first.get(desired) || null;

			return second !== null;
		}

		/**
		 * Updates the calculator with new rates.
		 *
		 * @public
		 * @param {Rate[]} rates
		 */
		setRates(rates) {
			rates.forEach((rate) => {
				this.setRate(rate);
			});
		}

		/**
		 * Updates the calculator with a new rate.
		 *
		 * @public
		 * @param {Rate} rate
		 */
		setRate(rate) {
			assert.argumentIsRequired(rate, 'rate', Rate, 'Rate');

			if (updateRate.call(this, rate, true)) {
				updateRate.call(this, rate.invert(), false);
			}
		}

		/**
		 * Performs a currency translation, using the rates previously supplied to
		 * the calculator.
		 *
		 * @public
		 * @param {Number|Decimal} amount
		 * @param {Currency} current
		 * @param {Currency} desired
		 * @returns {Number|Decimal}
		 */
		translate(amount, current, desired) {
			assert.argumentIsRequired(current, 'current', Currency, 'Currency');
			assert.argumentIsRequired(desired, 'desired', Currency, 'Currency');

			if (current === desired) {
				return amount;
			}

			return this._maps.translation.get(current).get(desired).translate(amount);
		}

		toString() {
			return `[CurrencyTranslator]`;
		}
	}

	const pairExpression = /^\^?([A-Z]{3})([A-Z]{3})$/;

	const parsePair = memoize.simple((symbol) => {
		const match = symbol.match(pairExpression);

		if (match === null) {
			throw new Error('The "pair" argument cannot be parsed.');
		}

		return {
			quote: Currency.parse(match[1]),
			base: Currency.parse(match[2])
		};
	});

	function solve(symbols) {
		const vertices = new Map();

		const getVertex = (currency, create) => {
			if (create && !vertices.has(currency)) {
				vertices.set(currency, new Vertex(currency));
			}

			return vertices.get(currency) || null;
		};

		const graph = (currencyA, currencyB) => {
			const vertexA = getVertex(currencyA, true);
			const vertexB = getVertex(currencyB, true);

			if (!vertexA.hasEdge(vertexB)) {
				vertexA.addEdge(vertexB, { rate: null });
			}
		};

		const currencies = new Set();

		symbols.forEach((symbol) => {
			const pair = parsePair(symbol);

			currencies.add(pair.quote);
			currencies.add(pair.base);

			graph(pair.quote, pair.base);
			graph(pair.base, pair.quote);
		});

		const translators = [ ];

		currencies.forEach((currencyA) => {
			currencies.forEach((currencyB) => {
				if (currencyA === currencyB) {
					return;
				}

				const vertexA = getVertex(currencyA, false);
				const vertexB = getVertex(currencyB, false);

				const candidates = vertexA.getPaths(vertexB);

				if (candidates.length === 0) {
					console.warn(`Unable to find path for [ ${currencyA.code} ] to [ ${currencyB.code} ]`);

					return;
				}

				candidates.sort(pathComparator);

				translators.push(new Translator(candidates[0]));
			});
		});

		return translators;
	}

	function reset() {
		const existing = [ ];

		for (const first of this._maps.rates) {
			const base = first[0];
			const map = first[1];

			for (const second of map) {
				const quote = second[0];
				const data = second[1];

				if (data.edge.data.original) {
					existing.push(new Rate(data.edge.data.rate, quote, base));
				}
			}
		}

		this._maps = { };

		this._maps.rates = new Map();
		this._maps.translation = new Map();

		const translators = solve(this._configuration.symbols);

		translators.forEach((translator) => {
			const path = translator.path;

			path.forEach((edge) => {
				const from = edge.from.data;
				const to = edge.to.data;

				if (!this._maps.rates.has(from)) {
					this._maps.rates.set(from, new Map());
				}

				if (!this._maps.rates.get(from).has(to)) {
					this._maps.rates.get(from).set(to, { edge: edge, translators: [ ] });
				}

				this._maps.rates.get(from).get(to).translators.push(translator);
			});
		});

		translators.forEach((translator) => {
			const from = translator.from;
			const to = translator.to;

			if (!this._maps.translation.has(from)) {
				this._maps.translation.set(from, new Map());
			}

			this._maps.translation.get(from).set(to, translator);
		});

		this.setRates(existing);
	}

	function updateRate(rate, original) {
		const from = rate.base;
		const to = rate.quote;

		const data = this._maps.rates.get(from).get(to);

		const current = data.edge.data.rate;

		if (current !== null && current === rate.float) {
			return false;
		}

		data.edge.data.rate = rate.float;
		data.edge.data.original = original;

		data.translators.forEach(t => t.clear());

		return true;
	}

	/**
	 * Translates values from a source currency to values in another currency.
	 *
	 * @private
	 * @param {Edge[]} path
	 */
	class Translator {
		constructor(path) {
			assert.argumentIsArray(path, 'path', String);

			this._path = path;

			this._factors = { };

			this._factors.float = null;
			this._factors.decimal = null;
		}

		/**
		 * The currency of the input value.
		 *
		 * @public
		 * @returns {Currency}
		 */
		get from() {
			return array.first(this._path).from.data;
		}

		/**
		 * The currency of the output value.
		 *
		 * @public
		 * @returns {Currency}
		 */
		get to() {
			return array.last(this._path).to.data;
		}

		/**
		 * The graph edges (steps) used to convert from the source
		 * currency to the desired currency.
		 *
		 * @public
		 * @returns {Edge[]}
		 */
		get path() {
			return this._path.slice(0);
		}

		/**
		 * Clears the cached factor used to convert values.
		 *
		 * @public
		 */
		clear() {
			this._factors.float = null;
			this._factors.decimal = null;
		}

		/**
		 * Translates an amount in the source currency to the desired currency.
		 *
		 * @public
		 * @param {Number|Decimal} amount
		 * @returns {Number|Decimal}
		 */
		translate(amount) {
			const ready = checkFactors.call(this);

			if (!ready) {
				throw new Error(`Unable to translate from [ ${this.from.code} ] to [ ${this.to.code} ], exchange rate is unknown.`);
			}

			if (amount instanceof Decimal) {
				return amount.multiply(this._factors.decimal);
			} else {
				return amount * this._factors.float;
			}
		}

		toString() {
			return `[Translator (path=${this._path.map(edge => `${edge.from.code} > ${edge.to.code}`).join()})]`;
		}
	}

	function checkFactors() {
		if (this._factors.float !== null) {
			return true;
		}

		let factor = 1;

		for (let i = 0; i < this._path.length; i++) {
			const edge = this._path[i];

			if (edge.data.rate === null) {
				return false;
			}

			factor = factor * edge.data.rate;
		}

		this._factors.float = factor;
		this._factors.decimal = Decimal.parse(factor);

		return true;
	}

	const pathComparator = ComparatorBuilder.startWith((a, b) => comparators.compareNumbers(a.length, b.length))
		.toComparator();

	return CurrencyTranslator;
})();
