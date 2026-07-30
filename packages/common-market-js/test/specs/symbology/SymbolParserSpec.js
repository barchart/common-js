import AssetClass from './../../../symbology/AssetClass.js';
import SymbolParser from './../../../symbology/SymbolParser.js';

describe('SymbolParser', () => {
	describe('parseInstrumentType', () => {
		it('parses concrete and reference futures', () => {
			expect(SymbolParser.parseInstrumentType('ESM08')).toEqual({
				symbol: 'ESM08',
				type: 'future',
				asset: AssetClass.FUTURE,
				dynamic: false,
				root: 'ES',
				month: 'M',
				year: 2008
			});

			expect(SymbolParser.parseInstrumentType('NG*13')).toEqual({
				symbol: 'NG*13',
				type: 'future',
				asset: AssetClass.FUTURE,
				dynamic: true,
				root: 'NG',
				dynamicCode: '13'
			});
		});

		it('parses futures with four-character roots', () => {
			expect(SymbolParser.parseInstrumentType('SAAPU26')).toEqual({
				symbol: 'SAAPU26',
				type: 'future',
				asset: AssetClass.FUTURE,
				dynamic: false,
				root: 'SAAP',
				month: 'U',
				year: 2026
			});
		});

		it('parses cash futures', () => {
			expect(SymbolParser.parseInstrumentType('SPY00')).toEqual({
				symbol: 'SPY00',
				type: 'future',
				asset: AssetClass.FUTURE,
				dynamic: false,
				root: 'SP',
				month: 'Y',
				year: 2100
			});
		});

		it('parses foreign exchange symbols', () => {
			expect(SymbolParser.parseInstrumentType('^EURUSD')).toEqual({
				symbol: '^EURUSD',
				type: 'forex',
				asset: AssetClass.FOREX
			});
		});

		it('parses indexes, sectors, and futures spreads', () => {
			expect(SymbolParser.parseInstrumentType('$DOWI')).toEqual({
				symbol: '$DOWI',
				type: 'index'
			});
			expect(SymbolParser.parseInstrumentType('-001A')).toEqual({
				symbol: '-001A',
				type: 'sector'
			});
			expect(SymbolParser.parseInstrumentType('_S_SP_ZCH7_ZCK7')).toEqual({
				symbol: '_S_SP_ZCH7_ZCK7',
				type: 'future_spread'
			});
		});

		it('parses futures options in database and pipeline formats', () => {
			expect(SymbolParser.parseInstrumentType('ESZ2660Q')).toEqual(jasmine.objectContaining({
				symbol: 'ESZ2660Q',
				type: 'future_option',
				asset: AssetClass.FUTURE_OPTION,
				option_type: 'put',
				strike: 2660,
				root: 'ES',
				month: 'Z'
			}));

			expect(SymbolParser.parseInstrumentType('ZWH9|470C')).toEqual(jasmine.objectContaining({
				symbol: 'ZWH9|470C',
				type: 'future_option',
				asset: AssetClass.FUTURE_OPTION,
				option_type: 'call',
				strike: 470,
				root: 'ZW',
				month: 'H',
				year: 2029
			}));
		});

		it('parses equity options', () => {
			expect(SymbolParser.parseInstrumentType('AAPL|20200515|250.00P')).toEqual({
				symbol: 'AAPL|20200515|250.00P',
				type: 'equity_option',
				asset: AssetClass.STOCK_OPTION,
				option_type: 'put',
				strike: 250,
				root: 'AAPL',
				month: 5,
				day: 15,
				year: 2020,
				adjusted: false
			});

			expect(SymbolParser.parseInstrumentType('HBM2.TO|20220121|1.00C')).toEqual(jasmine.objectContaining({
				type: 'equity_option',
				root: 'HBM.TO',
				adjusted: true
			}));
		});

		it('parses cmdtyStats instruments', () => {
			expect(SymbolParser.parseInstrumentType('AE030UBX.CS')).toEqual({
				symbol: 'AE030UBX.CS',
				type: 'cmdtyStats',
				asset: AssetClass.CMDTY_STATS
			});
		});

		it('returns null when the symbol type cannot be inferred', () => {
			expect(SymbolParser.parseInstrumentType('IBM')).toBeNull();
			expect(SymbolParser.parseInstrumentType(null)).toBeNull();
		});
	});

	describe('type predicates', () => {
		const cases = [
			['getIsConcrete', 'ESZ6', true],
			['getIsConcrete', 'ES*1', false],
			['getIsReference', 'ES*1', true],
			['getIsFuture', 'O!H2017', true],
			['getIsFuture', 'IBM', false],
			['getIsCash', 'ESY00', true],
			['getIsFutureSpread', '_S_SP_ZCH7_ZCK7', true],
			['getIsFutureOption', 'ZWH9|470C', true],
			['getIsForex', '^EURUSD', true],
			['getIsCrypto', '^BTCUSDT', true],
			['getIsIndex', '$DOWI', true],
			['getIsSector', '-001A', true],
			['getIsCanadianFund', 'VIC400.CF', true],
			['getIsCmdty', 'ZCPAUS.CM', true],
			['getIsCmdty', 'SCB001.CP', true],
			['getIsCmdtyStats', 'AE030UBX.CS', true],
			['getIsBats', 'AAPL.BZ', true],
			['getIsEquityOption', 'AAPL|20200515|250.00P', true],
			['getIsC3', 'C3:AL79MRM1', true],
			['getIsC3', 'AL79MRM1.C3', true],
			['getIsPlatts', 'PLATTS:AAVSV00', true],
			['getIsPlatts', 'AAVSV00.PT', true],
			['getIsGrainBid', 'USBCORN-123-456.CM', true]
		];

		cases.forEach(([method, symbol, expected]) => {
			it(`${method} identifies ${symbol}`, () => {
				expect(SymbolParser[method](symbol)).toEqual(expected);
			});
		});

		it('identifies pit instruments using their names', () => {
			expect(SymbolParser.getIsPit('ZCZ6', 'Corn (Pit)')).toEqual(true);
			expect(SymbolParser.getIsPit('ZCZ6', 'Corn')).toEqual(false);
		});

		it('identifies percentage symbols', () => {
			expect(SymbolParser.displayUsingPercent('US10Y.RT')).toEqual(true);
			expect(SymbolParser.displayUsingPercent('US10Y')).toEqual(false);
		});

		it('identifies expired symbols', () => {
			expect(SymbolParser.getIsExpired('ESM08')).toEqual(true);
			expect(SymbolParser.getIsExpired('ESZ47')).toEqual(false);
			expect(SymbolParser.getIsExpired('IBM')).toEqual(false);
		});
	});

	describe('normalization', () => {
		it('expands futures symbols to two-digit years', () => {
			expect(SymbolParser.getFuturesExplicitFormat('ESZ9')).toEqual('ESZ29');
			expect(SymbolParser.getFuturesExplicitFormat('ES*1')).toBeNull();
			expect(SymbolParser.getFuturesExplicitFormat('IBM')).toBeNull();
		});

		it('normalizes producer symbols', () => {
			expect(SymbolParser.getProducerSymbol('ESZ2029')).toEqual('ESZ9');
			expect(SymbolParser.getProducerSymbol('C3:AL79MRM1')).toEqual('AL79MRM1.C3');
			expect(SymbolParser.getProducerSymbol('PLATTS:AAVSV00')).toEqual('AAVSV00.PT');
			expect(SymbolParser.getProducerSymbol('IBM')).toEqual('IBM');
			expect(SymbolParser.getProducerSymbol(null)).toBeNull();
		});

		it('converts futures options to pipeline format', () => {
			expect(SymbolParser.getFuturesOptionPipelineFormat('ZWH29|470C')).toEqual('ZWH9|470C');
		});

		it('calculates full futures years', () => {
			spyOn(Date.prototype, 'getFullYear').and.returnValue(2022);

			expect(SymbolParser.getFuturesYear('29', 'Z')).toEqual(2029);
			expect(SymbolParser.getFuturesYear('48', 'Z')).toEqual(1948);
			expect(SymbolParser.getFuturesYear('2032', 'Z')).toEqual(2032);
		});
	});

	it('has a useful string representation', () => {
		expect(new SymbolParser().toString()).toEqual('[SymbolParser]');
	});
});
