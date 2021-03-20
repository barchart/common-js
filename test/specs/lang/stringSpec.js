const string = require('./../../../lang/string');

describe('When converting a sentence to "start" casing', () => {
	'use strict';

	let result;

	beforeEach(() => {
		result = string.startCase('The quick brown Fox');
	});

	it('should convert the first character (after each space) to an uppercase letter', () => {
		expect(result).toEqual('The Quick Brown Fox');
	});
});

describe('When converting a sentence to "camel" casing', () => {
	'use strict';

	let result;

	beforeEach(() => {
		result = string.camelCase('The quick brown Fox');
	});

	it('should convert the first character (after each space) to a lowercase letter', () => {
		expect(result).toEqual('the quick brown fox');
	});
});

describe('When converting a word to "start" casing', () => {
	'use strict';

	let result;

	beforeEach(() => {
		result = string.startCase('myLittlePony');
	});

	it('should convert the first character (after each space) to a uppercase letter', () => {
		expect(result).toEqual('Mylittlepony');
	});
});

describe('When converting a word to "camel" casing', () => {
	'use strict';

	let result;

	beforeEach(() => {
		result = string.camelCase('MyLittlePony');
	});

	it('should convert the first character (after each space) to a lowercase letter', () => {
		expect(result).toEqual('myLittlePony');
	});
});

describe('When truncating a string', () => {
	'use strict';

	let base;

	beforeEach(() => {
		base = '1234567890';
	});

	describe('to more characters than the base string', () => {
		let result;

		beforeEach(() => {
			result = string.truncate(base, base.length + 1);
		});

		it('should return the base string', () => {
			expect(result).toEqual(base);
		});
	});

	describe('to the same number of characters than the base string', () => {
		let result;

		beforeEach(() => {
			result = string.truncate(base, base.length);
		});

		it('should return the base string', () => {
			expect(result).toEqual(base);
		});
	});

	describe('to fewer characters than the base string', () => {
		let result;
		let length;

		beforeEach(() => {
			result = string.truncate(base, length = 2);
		});

		it('the result should be the correct number of characters', () => {
			expect(result.length).toEqual(length + 4);
		});

		it('the first characters should be from the base string', () => {
			for (let i = 0; i < length; i++) {
				expect(result.substring(i, i + 1)).toEqual(base.substring(i, i + 1));
			}
		});

		it('the final characters should be the base string', () => {
			expect(result.substring(result.length - 4, result.length)).toEqual(' ...');
		});
	});
});

describe('When left padding a string', () => {
	'use strict';

	let base;

	beforeEach(() => {
		base = 'base';
	});

	describe('with fewer characters than the base string', () => {
		let result;

		beforeEach(() => {
			result = string.padLeft(base, base.length, 'x');
		});

		it('should return the base string', () => {
			expect(result).toEqual(base);
		});
	});

	describe('with one more character than the base string', () => {
		let result;
		let repeat;

		beforeEach(() => {
			result = string.padLeft(base, base.length + 1, repeat = 'x');
		});

		it('the result should be the correct number of characters', () => {
			expect(result.length).toEqual(base.length + 1);
		});

		it('the first character should be the repeating character', () => {
			expect(result.substring(0, 1)).toEqual(repeat);
		});

		it('the final characters should be the base string', () => {
			expect(result.substring(1, result.length)).toEqual(base);
		});
	});

	describe('with many more character than the base string', () => {
		let result;
		let repeat;
		let count;

		beforeEach(() => {
			result = string.padLeft(base, count = 10, repeat = 'x');
		});

		it('the result should be the correct number of characters', () => {
			expect(result.length).toEqual(count);
		});

		it('the first characters should be the repeating character', () => {
			let prefix = count - base.length;

			for (let i = 0; i < prefix; i++) {
				expect(result.substring(i, i + 1)).toEqual(repeat);
			}
		});

		it('the final characters should be the base string', () => {
			expect(result.substring(count - base.length, result.length)).toEqual(base);
		});
	});
});

describe('When a formattable string ("&startDate={0}&endDate={1}"', () => {
	'use strict';

	let stringToFormat;

	beforeEach(() => {
        stringToFormat = '&startDate={0}&endDate={1}';
    });

	it('formatted with ("2017-08-31" and  "2017-09-30")', () => {
		expect(string.format(stringToFormat, '2017-08-31', '2017-09-30')).toEqual('&startDate=2017-08-31&endDate=2017-09-30');
	});

	it('formatted with ("0" and  "0")', () => {
		expect(string.format(stringToFormat, 0, 0)).toEqual('&startDate=0&endDate=0');
	});

	it('formatted with ("hello")', () => {
		expect(string.format(stringToFormat, 'hello')).toEqual('&startDate=hello&endDate={1}');
	});

	it('formatted with ("xin" and "bryan" and "dave")', () => {
		expect(string.format(stringToFormat, 'xin', 'bryan', 'dave')).toEqual('&startDate=xin&endDate=bryan');
	});

	it('formatted with nothing', () => {
		expect(string.format(stringToFormat)).toEqual('&startDate={0}&endDate={1}');
	});
});