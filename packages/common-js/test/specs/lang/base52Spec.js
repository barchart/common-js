const base52 = require('./../../../lang/base52');

describe('when converting base ten numbers to base fifty-two strings', () => {
	'use strict';

	it('the value of 0 (in base ten) should convert to "a"', () => {
		expect(base52.fromBaseTen(0)).toEqual('a');
	});

	it('the value of 1 (in base ten) should convert to "b"', () => {
		expect(base52.fromBaseTen(1)).toEqual('b');
	});

	it('the value of 24 (in base ten) should convert to "y"', () => {
		expect(base52.fromBaseTen(24)).toEqual('y');
	});

	it('the value of 25 (in base ten) should convert to "z"', () => {
		expect(base52.fromBaseTen(25)).toEqual('z');
	});

	it('the value of 26 (in base ten) should convert to "A"', () => {
		expect(base52.fromBaseTen(26)).toEqual('A');
	});

	it('the value of 27 (in base ten) should convert to "B"', () => {
		expect(base52.fromBaseTen(27)).toEqual('B');
	});

	it('the value of 51 (in base ten) should convert to "Z"', () => {
		expect(base52.fromBaseTen(51)).toEqual('Z');
	});

	it('the value of 52 (in base ten) should convert to "ba"', () => {
		expect(base52.fromBaseTen(52)).toEqual('ba');
	});

	it('the value of 53 (in base ten) should convert to "bb"', () => {
		expect(base52.fromBaseTen(53)).toEqual('bb');
	});

	it('the value of 2703 (in base ten) should convert to "Za"', () => {
		expect(base52.fromBaseTen(2703)).toEqual('ZZ');
	});

	it('the value of 2704 (in base ten) should convert to "baa"', () => {
		expect(base52.fromBaseTen(2704)).toEqual('baa');
	});

	it('the value of 2705 (in base ten) should convert to "bab"', () => {
		expect(base52.fromBaseTen(2705)).toEqual('bab');
	});

	it('the value of 140608 (in base ten) should convert to "baaa"', () => {
		expect(base52.fromBaseTen(140608)).toEqual('baaa');
	});

	it('the value of -140608 (in base ten) should convert to "baaa"', () => {
		expect(base52.fromBaseTen(-140608)).toEqual('-baaa');
	});

	it('the value of 5427 (in base ten) should convert to "cat"', () => {
		expect(base52.fromBaseTen(5427)).toEqual('cat');
	});

	it('the value of 75731 (in base ten) should convert to "Cat"', () => {
		expect(base52.fromBaseTen(75731)).toEqual('Cat');
	});

	it('the value of 75731 (in base ten) should convert to "CAT"', () => {
		expect(base52.fromBaseTen(77109)).toEqual('CAT');
	});

	it('the value of 8846 (in base ten) should convert to "dog"', () => {
		expect(base52.fromBaseTen(8846)).toEqual('dog');
	});

	it('the value of 79150 (in base ten) should convert to "Dog"', () => {
		expect(base52.fromBaseTen(79150)).toEqual('Dog');
	});

	it('the value of 80528 (in base ten) should convert to "DOG"', () => {
		expect(base52.fromBaseTen(80528)).toEqual('DOG');
	});

	it('the value of 19770609663 (in base ten) should convert to "ZZZZZZ"', () => {
		expect(base52.fromBaseTen(19770609663)).toEqual('ZZZZZZ');
	});
});