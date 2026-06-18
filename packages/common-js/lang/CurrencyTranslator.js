import * as assert from './assert.js';
import * as array from './array.js';
import * as comparators from './../collections/sorting/comparators.js';
import * as memoize from './memoize.js';

import Currency from './Currency.js';
import Decimal from './Decimal.js';
import Rate from './Rate.js';
import ComparatorBuilder from './../collections/sorting/ComparatorBuilder.js';
import Edge from './../collections/graph/Edge.js';
import Vertex from './../collections/graph/Vertex.js';

/**
 * A calculator that translates an amount of one currency into an amount
 * in another currency. The calculator prefers to use direct conversions;
 * however, it supports indirect conversions (which require conversions
 * to one or more intermediate currencies before translation to the final,
 * desired currency).
 *
 * @public
 */
export default class CurrencyTranslator {
	#translators;
	#maps;

	/**
	 * @param {string[]} symbols - Forex symbols which will be used for translations.
	 */
	constructor(symbols) {
		assert.argumentIsArray(symbols, 'symbols', String);

		this.#translators = solve(symbols);

		this.#maps = { };

		this.#maps.rates = new Map();
		this.#maps.translation = new Map();

		this.#translators.forEach((translator) => {
			const path = translator.path;

			path.forEach((edge) => {
				const from = edge.from.data;
				const to = edge.to.data;

				if (!this.#maps.rates.has(from)) {
					this.#maps.rates.set(from, new Map());
				}

				if (!this.#maps.rates.get(from).has(to)) {
					this.#maps.rates.get(from).set(to, { edge: edge, translators: [ ] });
				}

				this.#maps.rates.get(from).get(to).translators.push(translator);
			});
		});

		this.#translators.forEach((translator) => {
			const from = translator.from;
			const to = translator.to;

			if (!this.#maps.translation.has(from)) {
				this.#maps.translation.set(from, new Map());
			}

			this.#maps.translation.get(from).set(to, translator);
		});
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

		this.#updateRate(rate);
		this.#updateRate(rate.invert());
	}

	/**
	 * Performs a currency translation, using the rates previously supplied to
	 * the calculator.
	 *
	 * @public
	 * @param {number|Decimal} amount
	 * @param {Currency} current
	 * @param {Currency} desired
	 * @returns {number|Decimal}
	 */
	translate(amount, current, desired) {
		assert.argumentIsRequired(current, 'current', Currency, 'Currency');
		assert.argumentIsRequired(desired, 'desired', Currency, 'Currency');

		if (current === desired) {
			return amount;
		}

		return this.#maps.translation.get(current).get(desired).translate(amount);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[CurrencyTranslator]`;
	}

	#updateRate(rate) {
		const from = rate.base;
		const to = rate.quote;

		const data = this.#maps.rates.get(from).get(to);

		const current = data.edge.data.rate;

		if (current !== null && current === rate.float) {
			return;
		}

		data.edge.data.rate = rate.float;

		data.translators.forEach(t => t.clear());
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

const solve = (symbols) => {
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
};

/**
 * Translates values from a source currency to values in another currency.
 *
 * @private
 * @param {Edge[]} path
 */
class Translator {
	#path;
	#factors;

	constructor(path) {
		assert.argumentIsArray(path, 'path', Edge, 'Edge');

		this.#path = path;

		this.#factors = { };

		this.#factors.float = null;
		this.#factors.decimal = null;
	}

	/**
	 * The currency of the input value.
	 *
	 * @public
	 * @returns {Currency}
	 */
	get from() {
		return array.first(this.#path).from.data;
	}

	/**
	 * The currency of the output value.
	 *
	 * @public
	 * @returns {Currency}
	 */
	get to() {
		return array.last(this.#path).to.data;
	}

	/**
	 * The graph edges (steps) used to convert from the source
	 * currency to the desired currency.
	 *
	 * @public
	 * @returns {Edge[]}
	 */
	get path() {
		return this.#path.slice(0);
	}

	/**
	 * Clears the cached factor used to convert values.
	 *
	 * @public
	 */
	clear() {
		this.#factors.float = null;
		this.#factors.decimal = null;
	}

	/**
	 * Translates an amount in the source currency to the desired currency.
	 *
	 * @public
	 * @param {number|Decimal} amount
	 * @returns {number|Decimal}
	 */
	translate(amount) {
		const ready = this.#checkFactors();

		if (!ready) {
			throw new Error(`Unable to translate from [ ${this.from.code} ] to [ ${this.to.code} ], exchange rate is unknown.`);
		}

		if (amount instanceof Decimal) {
			return amount.multiply(this.#factors.decimal);
		} else {
			return amount * this.#factors.float;
		}
	}

	toString() {
		return `[Translator (path=${this.#path.map(edge => `${edge.from.code} > ${edge.to.code}`).join()})]`;
	}

	#checkFactors() {
		if (this.#factors.float !== null) {
			return true;
		}

		let factor = 1;

		for (let i = 0; i < this.#path.length; i++) {
			const edge = this.#path[i];

			if (edge.data.rate === null) {
				return false;
			}

			factor = factor * edge.data.rate;
		}

		this.#factors.float = factor;
		this.#factors.decimal = Decimal.parse(factor);

		return true;
	}
}

const pathComparator = ComparatorBuilder.startWith((a, b) => comparators.compareNumbers(a.length, b.length))
	.toComparator();
