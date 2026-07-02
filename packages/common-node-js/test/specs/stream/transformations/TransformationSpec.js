import ArrayReadStream from './../../../../stream/ArrayReadStream.js';
import ObjectTransformer from './../../../../stream/ObjectTransformer.js';
import DelegateTransformation from './../../../../stream/transformations/DelegateTransformation.js';
import PropertyDelegateTransformation from './../../../../stream/transformations/PropertyDelegateTransformation.js';
import SelectTransformation from './../../../../stream/transformations/SelectTransformation.js';
import SelectiveTransformation from './../../../../stream/transformations/SelectiveTransformation.js';
import Transformation from './../../../../stream/transformations/Transformation.js';

class RejectingTransformation extends Transformation {
	constructor() {
		super('Rejecting Transformation');
	}

	_canTransform() {
		return false;
	}
}

async function collect(readable) {
	return new Promise((resolve, reject) => {
		const items = [ ];

		readable.on('data', item => items.push(item));
		readable.on('error', reject);
		readable.on('end', () => resolve(items));
	});
}

describe('When stream transformations are used', () => {
	'use strict';

	it('should report values that cannot be transformed', () => {
		const transformation = new RejectingTransformation();

		expect(transformation.canTransform({ })).toEqual(false);
	});

	it('should throw when rejected values are transformed', () => {
		const transformation = new RejectingTransformation();

		expect(() => transformation.transform({ })).toThrow();
	});

	it('should select and rename nested properties', () => {
		const transformation = new SelectTransformation([ 'symbol', 'quote.lastPrice' ], [ 'symbol', 'price.last' ]);

		expect(transformation.transform({
			symbol: 'AAPL',
			quote: {
				lastPrice: 200
			},
			ignored: true
		})).toEqual({
			symbol: 'AAPL',
			price: {
				last: 200
			}
		});
	});

	it('should transform object properties with delegates', () => {
		const transformation = new PropertyDelegateTransformation(
			'price',
			value => value * 2,
			'adjustedPrice',
			value => value > 0
		);

		expect({
			synchronous: transformation.synchronous,
			canTransform: transformation.canTransform({ price: 10 }),
			output: transformation.transform({ price: 10 })
		}).toEqual({
			synchronous: true,
			canTransform: true,
			output: {
				price: 10,
				adjustedPrice: 20
			}
		});
	});

	it('should run only the first matching selective transformation when configured', () => {
		const first = jasmine.createSpy('first').and.callFake(input => Object.assign({ }, input, { first: true }));
		const second = jasmine.createSpy('second').and.callFake(input => Object.assign({ }, input, { second: true }));
		const transformation = new SelectiveTransformation([
			new DelegateTransformation(first, () => true),
			new DelegateTransformation(second, () => true)
		], true);

		expect({
			output: transformation.transform({ value: 1 }),
			firstCalls: first.calls.count(),
			secondCalls: second.calls.count()
		}).toEqual({
			output: {
				value: 1,
				first: true
			},
			firstCalls: 1,
			secondCalls: 0
		});
	});

	it('should run all matching selective transformations by default', () => {
		const transformation = new SelectiveTransformation([
			new DelegateTransformation(input => Object.assign({ }, input, { first: true }), () => true),
			new DelegateTransformation(input => Object.assign({ }, input, { second: true }), () => true)
		]);

		expect(transformation.transform({ value: 1 })).toEqual({
			value: 1,
			first: true,
			second: true
		});
	});

	it('should transform stream objects synchronously and return a new transformer when extended', async () => {
		const transformer = ObjectTransformer
			.define('quotes')
			.addTransformation(new DelegateTransformation(input => Object.assign({ }, input, { symbol: input.symbol.toUpperCase() }), () => true));

		const extended = transformer.addTransformation(new SelectTransformation([ 'symbol' ]));
		const output = await collect(new ArrayReadStream([ { symbol: 'aapl', price: 200 } ]).pipe(extended));

		expect({
			originalCount: transformer.transformerCount,
			extendedCount: extended.transformerCount,
			output
		}).toEqual({
			originalCount: 1,
			extendedCount: 2,
			output: [
				{ symbol: 'AAPL' }
			]
		});
	});

	it('should transform stream objects asynchronously when needed', async () => {
		const transformer = ObjectTransformer.define('quotes').addTransformation(
			new DelegateTransformation(async input => Object.assign({ }, input, { price: input.price + 1 }), () => true, true)
		);

		const output = await collect(new ArrayReadStream([ { symbol: 'AAPL', price: 200 } ]).pipe(transformer));

		expect(output).toEqual([
			{ symbol: 'AAPL', price: 201 }
		]);
	});
});
