import AssetClass from './../../../symbology/AssetClass.js';

describe('AssetClass', () => {
	it('exposes the asset classes used by parsed symbols', () => {
		expect(AssetClass.STOCK.code).toEqual('STK');
		expect(AssetClass.STOCK_OPTION.code).toEqual('STKOPT');
		expect(AssetClass.FUTURE.code).toEqual('FUT');
		expect(AssetClass.FUTURE_OPTION.code).toEqual('FUTOPT');
		expect(AssetClass.FOREX.code).toEqual('FOREX');
		expect(AssetClass.CMDTY_STATS.code).toEqual('CMDTY');
	});

	it('looks up asset classes by code and id', () => {
		expect(AssetClass.parse('FUT')).toBe(AssetClass.FUTURE);
		expect(AssetClass.fromId(12)).toBe(AssetClass.FUTURE_OPTION);
		expect(AssetClass.parse('UNKNOWN')).toBeNull();
		expect(AssetClass.fromId(-1)).toBeNull();
	});

	it('serializes to the Barchart numeric id', () => {
		expect(AssetClass.STOCK_OPTION.id).toEqual(34);
		expect(AssetClass.STOCK_OPTION.toJSON()).toEqual(34);
	});
});
