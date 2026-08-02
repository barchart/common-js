import AssetClass from './../../../data/AssetClass.js';

describe('AssetClass', () => {
	it('exposes the stock asset class', () => {
		expect(AssetClass.STOCK.code).toEqual('STK');
	});

	it('exposes the stock option asset class', () => {
		expect(AssetClass.STOCK_OPTION.code).toEqual('STKOPT');
	});

	it('exposes the future asset class', () => {
		expect(AssetClass.FUTURE.code).toEqual('FUT');
	});

	it('exposes the future option asset class', () => {
		expect(AssetClass.FUTURE_OPTION.code).toEqual('FUTOPT');
	});

	it('exposes the foreign exchange asset class', () => {
		expect(AssetClass.FOREX.code).toEqual('FOREX');
	});

	it('exposes the cmdtyStats asset class', () => {
		expect(AssetClass.CMDTY_STATS.code).toEqual('CMDTY');
	});

	it('looks up an asset class by code', () => {
		expect(AssetClass.parse('FUT')).toBe(AssetClass.FUTURE);
	});

	it('looks up an asset class by id', () => {
		expect(AssetClass.fromId(12)).toBe(AssetClass.FUTURE_OPTION);
	});

	it('returns null for an unknown code', () => {
		expect(AssetClass.parse('UNKNOWN')).toBeNull();
	});

	it('returns null for an unknown id', () => {
		expect(AssetClass.fromId(-1)).toBeNull();
	});

	it('exposes the Barchart numeric id', () => {
		expect(AssetClass.STOCK_OPTION.id).toEqual(34);
	});

	it('serializes to the Barchart numeric id', () => {
		expect(AssetClass.STOCK_OPTION.toJSON()).toEqual(34);
	});
});
