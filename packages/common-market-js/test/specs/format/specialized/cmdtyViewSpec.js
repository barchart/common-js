import cmdtyView from './../../../../format/specialized/cmdtyView.js';
import SymbolParser from './../../../../symbology/SymbolParser.js';

const ZBM2_1500C = { ...SymbolParser.parseInstrumentType('ZBM2|1500C'), unitCode: '5' };
const ZNM2_1230C = { ...SymbolParser.parseInstrumentType('ZNM2|1230C'), unitCode: '5' };

const ZTM2_1060C = { ...SymbolParser.parseInstrumentType('ZTM2|1060C'), unitCode: '6' };
const ZFM2_1147C = { ...SymbolParser.parseInstrumentType('ZFM2|1147C'), unitCode: '6' };

describe('when formatting prices for a ZB options', () => {
	it('formats 0.5 as 0-32 (using sixty-fourths)', () => {
		expect(cmdtyView(0.5, ZBM2_1500C.unitCode, ZBM2_1500C)).toEqual('0-32');
	});

	it('formats 0.984375 as 0-63 (using sixty-fourths)', () => {
		expect(cmdtyView(0.984375, ZBM2_1500C.unitCode, ZBM2_1500C)).toEqual('0-63');
	});
});

describe('when formatting prices for a ZN option', () => {
	it('formats 0.5 as 0-32 (using sixty-fourths)', () => {
		expect(cmdtyView(0.5, ZNM2_1230C.unitCode, ZNM2_1230C)).toEqual('0-32');
	});

	it('formats 0.984375 as 0-63 (using sixty-fourths)', () => {
		expect(cmdtyView(0.984375, ZNM2_1230C.unitCode, ZNM2_1230C)).toEqual('0-63');
	});
});

describe('when formatting prices for a ZT options', () => {
	it('formats 0.5 as 0-320 (using halves of sixty-fourths)', () => {
		expect(cmdtyView(0.5, ZTM2_1060C.unitCode, ZTM2_1060C)).toEqual('0-320');
	});

	it('formats 0.9921875 as 0-635 (using halves of sixty-fourths)', () => {
		expect(cmdtyView(0.9921875, ZTM2_1060C.unitCode, ZTM2_1060C)).toEqual('0-635');
	});
});

describe('when formatting prices for a ZF options', () => {
	it('formats 0.5 as 0-320 (using halves of sixty-fourths)', () => {
		expect(cmdtyView(0.5, ZFM2_1147C.unitCode, ZFM2_1147C)).toEqual('0-320');
	});

	it('formats 0.9921875 as 0-635 (using halves of sixty-fourths)', () => {
		expect(cmdtyView(0.9921875, ZFM2_1147C.unitCode, ZFM2_1147C)).toEqual('0-635');
	});
});

describe('Independent instrument metadata', () => {
	it('recognizes legacy enum instances by their asset identifier', () => {
		expect(cmdtyView(0.984375, '5', { asset: { id: 12 }, root: 'ZB' })).toEqual('0-63');
	});

	it('applies Treasury rules to weekly option roots', () => {
		for (const root of ['BB1', 'BN2']) {
			expect(cmdtyView(0.984375, '5', { asset: { id: 12 }, root })).toEqual('0-63');
		}

		for (const root of ['BT1', 'BF2']) {
			expect(cmdtyView(0.9921875, '6', { asset: { id: 12 }, root })).toEqual('0-635');
		}
	});

	it('uses normal tick notation without a matching future-option asset', () => {
		for (const asset of [undefined, null, { id: 2 }]) {
			expect(cmdtyView(0.984375, '5', { asset, root: 'ZB' })).toEqual('0-315');
		}
	});
});
