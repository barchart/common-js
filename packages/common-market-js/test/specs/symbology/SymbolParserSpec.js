import AssetClass from './../../../data/AssetClass.js';
import SymbolParser from './../../../symbology/SymbolParser.js';

describe('SymbolParser', () => {
	describe('parseInstrumentType', () => {
		it('parses concrete futures', () => {
			expect(SymbolParser.parseInstrumentType('ESM08')).toEqual({
				symbol: 'ESM08',
				type: 'future',
				asset: AssetClass.FUTURE,
				dynamic: false,
				root: 'ES',
				month: 'M',
				year: 2008
			});
		});

		it('parses reference futures', () => {
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

		it('parses indexes', () => {
			expect(SymbolParser.parseInstrumentType('$DOWI')).toEqual({
				symbol: '$DOWI',
				type: 'index'
			});
		});

		it('parses sectors', () => {
			expect(SymbolParser.parseInstrumentType('-001A')).toEqual({
				symbol: '-001A',
				type: 'sector'
			});
		});

		it('parses futures spreads', () => {
			expect(SymbolParser.parseInstrumentType('_S_SP_ZCH7_ZCK7')).toEqual({
				symbol: '_S_SP_ZCH7_ZCK7',
				type: 'future_spread'
			});
		});

		it('parses futures options in database format', () => {
			expect(SymbolParser.parseInstrumentType('ESZ2660Q')).toEqual(jasmine.objectContaining({
				symbol: 'ESZ2660Q',
				type: 'future_option',
				asset: AssetClass.FUTURE_OPTION,
				option_type: 'put',
				strike: 2660,
				root: 'ES',
				month: 'Z'
			}));
		});

		it('parses futures options in pipeline format', () => {
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
		});

		it('parses adjusted equity options', () => {
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

		it('returns null when a symbol type cannot be inferred', () => {
			expect(SymbolParser.parseInstrumentType('IBM')).toBeNull();
		});

		it('returns null for a non-string symbol', () => {
			expect(SymbolParser.parseInstrumentType(null)).toBeNull();
		});
	});

	describe('type predicates', () => {
		it('identifies concrete symbols', () => {
			expect(SymbolParser.getIsConcrete('ESZ6')).toEqual(true);
		});

		it('rejects reference symbols as concrete', () => {
			expect(SymbolParser.getIsConcrete('ES*1')).toEqual(false);
		});

		it('identifies reference symbols', () => {
			expect(SymbolParser.getIsReference('ES*1')).toEqual(true);
		});

		it('identifies futures', () => {
			expect(SymbolParser.getIsFuture('O!H2017')).toEqual(true);
		});

		it('rejects non-futures', () => {
			expect(SymbolParser.getIsFuture('IBM')).toEqual(false);
		});

		it('identifies cash futures', () => {
			expect(SymbolParser.getIsFutureCash('ESY00')).toEqual(true);
		});

		it('identifies futures spreads', () => {
			expect(SymbolParser.getIsFutureSpread('_S_SP_ZCH7_ZCK7')).toEqual(true);
		});

		it('identifies futures options', () => {
			expect(SymbolParser.getIsFutureOption('ZWH9|470C')).toEqual(true);
		});

		it('identifies foreign exchange symbols', () => {
			expect(SymbolParser.getIsForex('^EURUSD')).toEqual(true);
		});

		it('identifies cryptocurrency symbols', () => {
			expect(SymbolParser.getIsCrypto('^BTCUSDT')).toEqual(true);
		});

		it('identifies indexes', () => {
			expect(SymbolParser.getIsIndex('$DOWI')).toEqual(true);
		});

		it('identifies sectors', () => {
			expect(SymbolParser.getIsSector('-001A')).toEqual(true);
		});

		it('identifies Canadian funds', () => {
			expect(SymbolParser.getIsCanadianFund('VIC400.CF')).toEqual(true);
		});

		it('identifies internal cmdty symbols', () => {
			expect(SymbolParser.getIsCmdty('ZCPAUS.CM')).toEqual(true);
		});

		it('identifies external cmdty symbols', () => {
			expect(SymbolParser.getIsCmdty('SCB001.CP')).toEqual(true);
		});

		it('identifies cmdtyStats symbols', () => {
			expect(SymbolParser.getIsCmdtyStats('AE030UBX.CS')).toEqual(true);
		});

		it('identifies BATS symbols', () => {
			expect(SymbolParser.getIsBats('AAPL.BZ')).toEqual(true);
		});

		it('identifies equity options', () => {
			expect(SymbolParser.getIsEquityOption('AAPL|20200515|250.00P')).toEqual(true);
		});

		it('identifies Commodity3 aliases', () => {
			expect(SymbolParser.getIsC3('C3:AL79MRM1')).toEqual(true);
		});

		it('identifies concrete Commodity3 symbols', () => {
			expect(SymbolParser.getIsC3('AL79MRM1.C3')).toEqual(true);
		});

		it('identifies Platts aliases', () => {
			expect(SymbolParser.getIsPlatts('PLATTS:AAVSV00')).toEqual(true);
		});

		it('identifies concrete Platts symbols', () => {
			expect(SymbolParser.getIsPlatts('AAVSV00.PT')).toEqual(true);
		});

		it('identifies grain bid symbols', () => {
			expect(SymbolParser.getIsGrainBid('USBCORN-123-456.CM')).toEqual(true);
		});

		it('identifies pit instruments using their names', () => {
			expect(SymbolParser.getIsPit('ZCZ6', 'Corn (Pit)')).toEqual(true);
		});

		it('rejects non-pit instruments using their names', () => {
			expect(SymbolParser.getIsPit('ZCZ6', 'Corn')).toEqual(false);
		});

		it('identifies percentage symbols', () => {
			expect(SymbolParser.displayUsingPercent('US10Y.RT')).toEqual(true);
		});

		it('rejects non-percentage symbols', () => {
			expect(SymbolParser.displayUsingPercent('US10Y')).toEqual(false);
		});

		it('identifies expired symbols', () => {
			expect(SymbolParser.getIsExpired('ESM08')).toEqual(true);
		});

		it('identifies unexpired symbols', () => {
			expect(SymbolParser.getIsExpired('ESZ47')).toEqual(false);
		});

		it('does not identify undated symbols as expired', () => {
			expect(SymbolParser.getIsExpired('IBM')).toEqual(false);
		});
	});

	describe('normalization', () => {
		it('converts futures to explicit format', () => {
			expect(SymbolParser.getFuturesExplicitFormat('ESZ9')).toEqual('ESZ29');
		});

		it('does not convert reference futures to explicit format', () => {
			expect(SymbolParser.getFuturesExplicitFormat('ES*1')).toBeNull();
		});

		it('does not convert non-futures to explicit format', () => {
			expect(SymbolParser.getFuturesExplicitFormat('IBM')).toBeNull();
		});

		it('normalizes producer symbols with four-digit years', () => {
			expect(SymbolParser.getProducerSymbol('ESZ2029')).toEqual('ESZ9');
		});

		it('normalizes four-character producer symbols with four-digit years', () => {
			expect(SymbolParser.getProducerSymbol('SAAPU2026')).toEqual('SAAPU6');
		});

		it('normalizes four-character producer symbols with two-digit years', () => {
			expect(SymbolParser.getProducerSymbol('SAAPU26')).toEqual('SAAPU6');
		});

		it('preserves normalized producer symbols', () => {
			expect(SymbolParser.getProducerSymbol('SAAPU6')).toEqual('SAAPU6');
		});

		it('normalizes Commodity3 aliases', () => {
			expect(SymbolParser.getProducerSymbol('C3:AL79MRM1')).toEqual('AL79MRM1.C3');
		});

		it('normalizes Platts aliases', () => {
			expect(SymbolParser.getProducerSymbol('PLATTS:AAVSV00')).toEqual('AAVSV00.PT');
		});

		it('preserves symbols without a specialized producer format', () => {
			expect(SymbolParser.getProducerSymbol('IBM')).toEqual('IBM');
		});

		it('returns null when normalizing a non-string producer symbol', () => {
			expect(SymbolParser.getProducerSymbol(null)).toBeNull();
		});

		it('converts futures options to pipeline format', () => {
			expect(SymbolParser.getFuturesOptionPipelineFormat('ZWH29|470C')).toEqual('ZWH9|470C');
		});

		it('calculates a future year from a two-digit year', () => {
			spyOn(Date.prototype, 'getFullYear').and.returnValue(2022);

			expect(SymbolParser.getFuturesYear('29', 'Z')).toEqual(2029);
		});

		it('calculates a past year from a two-digit year', () => {
			spyOn(Date.prototype, 'getFullYear').and.returnValue(2022);

			expect(SymbolParser.getFuturesYear('48', 'Z')).toEqual(1948);
		});

		it('preserves a four-digit futures year', () => {
			spyOn(Date.prototype, 'getFullYear').and.returnValue(2022);

			expect(SymbolParser.getFuturesYear('2032', 'Z')).toEqual(2032);
		});
	});

	it('has a useful string representation', () => {
		expect(new SymbolParser().toString()).toEqual('[SymbolParser]');
	});
});
