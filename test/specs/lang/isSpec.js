var is = require('./../../../lang/is');

describe('When checking the number 3', function() {
	'use strict';

	var candidate;

	beforeEach(function() {
		candidate = 3;
	});

	it("it should be a number", function() {
		expect(is.number(candidate)).toEqual(true);
	});

	it("it should not be nan", function() {
		expect(is.nan(candidate)).toEqual(false);
	});

	it("it should be an integer", function() {
		expect(is.integer(candidate)).toEqual(true);
	});

	it("it should be an large integer", function() {
		expect(is.large(candidate)).toEqual(true);
	});

	it("it should be positive", function() {
		expect(is.positive(candidate)).toEqual(true);
	});

	it("it should not be negative", function() {
		expect(is.negative(candidate)).toEqual(false);
	});

	it("it should not be a string", function() {
		expect(is.string(candidate)).toEqual(false);
	});

	it("it should not be a Date", function() {
		expect(is.date(candidate)).toEqual(false);
	});

	it("it should not be a function", function() {
		expect(is.fn(candidate)).toEqual(false);
	});

	it("it should not be an array", function() {
		expect(is.array(candidate)).toEqual(false);
	});

	it("it should not be a boolean", function() {
		expect(is.boolean(candidate)).toEqual(false);
	});

	it("it should not be an object", function() {
		expect(is.object(candidate)).toEqual(false);
	});

	it("it should not be null", function() {
		expect(is.null(candidate)).toEqual(false);
	});

	it("it should not be undefined", function() {
		expect(is.undefined(candidate)).toEqual(false);
	});
});

describe('When checking the Math.PI', function() {
	'use strict';

	var candidate;

	beforeEach(function() {
		candidate = Math.PI;
	});

	it("it should be a number", function() {
		expect(is.number(candidate)).toEqual(true);
	});

	it("it should not be nan", function() {
		expect(is.nan(candidate)).toEqual(false);
	});

	it("it should not be an integer", function() {
		expect(is.integer(candidate)).toEqual(false);
	});

	it("it should not be an large integer", function() {
		expect(is.large(candidate)).toEqual(false);
	});

	it("it should be positive", function() {
		expect(is.positive(candidate)).toEqual(true);
	});

	it("it should not be negative", function() {
		expect(is.negative(candidate)).toEqual(false);
	});

	it("it should not be a string", function() {
		expect(is.string(candidate)).toEqual(false);
	});

	it("it should not be a Date", function() {
		expect(is.date(candidate)).toEqual(false);
	});

	it("it should not be a function", function() {
		expect(is.fn(candidate)).toEqual(false);
	});

	it("it should not be an array", function() {
		expect(is.array(candidate)).toEqual(false);
	});

	it("it should not be a boolean", function() {
		expect(is.boolean(candidate)).toEqual(false);
	});

	it("it should not be an object", function() {
		expect(is.object(candidate)).toEqual(false);
	});

	it("it should not be null", function() {
		expect(is.null(candidate)).toEqual(false);
	});

	it("it should not be undefined", function() {
		expect(is.undefined(candidate)).toEqual(false);
	});
});

describe('When checking the Number.NaN', function() {
	'use strict';

	var candidate;

	beforeEach(function() {
		candidate = Number.NaN;
	});

	it("it should not be a number", function() {
		expect(is.number(candidate)).toEqual(false);
	});

	it("it should be nan", function() {
		expect(is.nan(candidate)).toEqual(true);
	});

	it("it should not be an integer", function() {
		expect(is.integer(candidate)).toEqual(false);
	});

	it("it should not be an large integer", function() {
		expect(is.large(candidate)).toEqual(false);
	});

	it("it should not be positive", function() {
		expect(is.positive(candidate)).toEqual(false);
	});

	it("it should not be negative", function() {
		expect(is.negative(candidate)).toEqual(false);
	});

	it("it should not be a string", function() {
		expect(is.string(candidate)).toEqual(false);
	});

	it("it should not be a Date", function() {
		expect(is.date(candidate)).toEqual(false);
	});

	it("it should not be a function", function() {
		expect(is.fn(candidate)).toEqual(false);
	});

	it("it should not be an array", function() {
		expect(is.array(candidate)).toEqual(false);
	});

	it("it should not be a boolean", function() {
		expect(is.boolean(candidate)).toEqual(false);
	});

	it("it should not be an object", function() {
		expect(is.object(candidate)).toEqual(false);
	});

	it("it should not be null", function() {
		expect(is.null(candidate)).toEqual(false);
	});

	it("it should not be undefined", function() {
		expect(is.undefined(candidate)).toEqual(false);
	});
});

describe('When checking the string "3"', function() {
	'use strict';

	var candidate;

	beforeEach(function() {
		candidate = "3";
	});

	it("it should not be a number", function() {
		expect(is.number(candidate)).toEqual(false);
	});

	it("it should not be nan", function() {
		expect(is.nan(candidate)).toEqual(false);
	});

	it("it should not be an integer", function() {
		expect(is.integer(candidate)).toEqual(false);
	});

	it("it should not be an large integer", function() {
		expect(is.large(candidate)).toEqual(false);
	});

	it("it should not be positive", function() {
		expect(is.positive(candidate)).toEqual(false);
	});

	it("it should not be negative", function() {
		expect(is.negative(candidate)).toEqual(false);
	});

	it("it should be a string", function() {
		expect(is.string(candidate)).toEqual(true);
	});

	it("it should not be a Date", function() {
		expect(is.date(candidate)).toEqual(false);
	});

	it("it should not be a function", function() {
		expect(is.fn(candidate)).toEqual(false);
	});

	it("it should not be an array", function() {
		expect(is.array(candidate)).toEqual(false);
	});

	it("it should not be a boolean", function() {
		expect(is.boolean(candidate)).toEqual(false);
	});

	it("it should not be an object", function() {
		expect(is.object(candidate)).toEqual(false);
	});

	it("it should not be null", function() {
		expect(is.null(candidate)).toEqual(false);
	});

	it("it should not be undefined", function() {
		expect(is.undefined(candidate)).toEqual(false);
	});
});

describe('When checking the date 08/29/2016', function() {
	'use strict';

	var candidate;

	beforeEach(function() {
		candidate = new Date(2016, 7, 29);
	});

	it("it should not be a number", function() {
		expect(is.number(candidate)).toEqual(false);
	});

	it("it should not be nan", function() {
		expect(is.nan(candidate)).toEqual(false);
	});

	it("it should not be an integer", function() {
		expect(is.integer(candidate)).toEqual(false);
	});

	it("it should not be an large integer", function() {
		expect(is.large(candidate)).toEqual(false);
	});

	it("it should not be positive", function() {
		expect(is.positive(candidate)).toEqual(false);
	});

	it("it should not be negative", function() {
		expect(is.negative(candidate)).toEqual(false);
	});

	it("it should not be a string", function() {
		expect(is.string(candidate)).toEqual(false);
	});

	it("it should be a Date", function() {
		expect(is.date(candidate)).toEqual(true);
	});

	it("it should be an object", function() {
		expect(is.object(candidate)).toEqual(true);
	});

	it("it should not be a function", function() {
		expect(is.fn(candidate)).toEqual(false);
	});

	it("it should not be an array", function() {
		expect(is.array(candidate)).toEqual(false);
	});

	it("it should not be a boolean", function() {
		expect(is.boolean(candidate)).toEqual(false);
	});

	it("it should not be null", function() {
		expect(is.null(candidate)).toEqual(false);
	});

	it("it should not be undefined", function() {
		expect(is.undefined(candidate)).toEqual(false);
	});
});

describe('When checking the "expect" function', function() {
	'use strict';

	var candidate;

	beforeEach(function() {
		candidate = expect;
	});

	it("it should not be a number", function() {
		expect(is.number(candidate)).toEqual(false);
	});

	it("it should not be nan", function() {
		expect(is.nan(candidate)).toEqual(false);
	});

	it("it should not be an integer", function() {
		expect(is.integer(candidate)).toEqual(false);
	});

	it("it should not be an large integer", function() {
		expect(is.large(candidate)).toEqual(false);
	});

	it("it should not be positive", function() {
		expect(is.positive(candidate)).toEqual(false);
	});

	it("it should not be negative", function() {
		expect(is.negative(candidate)).toEqual(false);
	});

	it("it should not be a string", function() {
		expect(is.string(candidate)).toEqual(false);
	});

	it("it should not be a Date", function() {
		expect(is.date(candidate)).toEqual(false);
	});

	it("it should be a function", function() {
		expect(is.fn(candidate)).toEqual(true);
	});

	it("it should not be an array", function() {
		expect(is.array(candidate)).toEqual(false);
	});

	it("it should not be a boolean", function() {
		expect(is.boolean(candidate)).toEqual(false);
	});

	it("it should not be an object", function() {
		expect(is.object(candidate)).toEqual(false);
	});

	it("it should not be null", function() {
		expect(is.null(candidate)).toEqual(false);
	});

	it("it should not be undefined", function() {
		expect(is.undefined(candidate)).toEqual(false);
	});
});

describe('When checking an empty object', function() {
	'use strict';

	var candidate;

	beforeEach(function() {
		candidate = { };
	});

	it("it should not be a number", function() {
		expect(is.number(candidate)).toEqual(false);
	});

	it("it should not be nan", function() {
		expect(is.nan(candidate)).toEqual(false);
	});

	it("it should not be an integer", function() {
		expect(is.integer(candidate)).toEqual(false);
	});

	it("it should not be an large integer", function() {
		expect(is.large(candidate)).toEqual(false);
	});

	it("it should not be positive", function() {
		expect(is.positive(candidate)).toEqual(false);
	});

	it("it should not be negative", function() {
		expect(is.negative(candidate)).toEqual(false);
	});

	it("it should not be a string", function() {
		expect(is.string(candidate)).toEqual(false);
	});

	it("it should not be a Date", function() {
		expect(is.date(candidate)).toEqual(false);
	});

	it("it should not be a function", function() {
		expect(is.fn(candidate)).toEqual(false);
	});

	it("it should not be an array", function() {
		expect(is.array(candidate)).toEqual(false);
	});

	it("it should not be a boolean", function() {
		expect(is.boolean(candidate)).toEqual(false);
	});

	it("it should be an object", function() {
		expect(is.object(candidate)).toEqual(true);
	});

	it("it should not be null", function() {
		expect(is.null(candidate)).toEqual(false);
	});

	it("it should not be undefined", function() {
		expect(is.undefined(candidate)).toEqual(false);
	});
});

describe('When checking a null value', function() {
	'use strict';

	var candidate;

	beforeEach(function() {
		candidate = null;
	});

	it("it should not be a number", function() {
		expect(is.number(candidate)).toEqual(false);
	});

	it("it should not be nan", function() {
		expect(is.nan(candidate)).toEqual(false);
	});

	it("it should not be an integer", function() {
		expect(is.integer(candidate)).toEqual(false);
	});

	it("it should not be an large integer", function() {
		expect(is.large(candidate)).toEqual(false);
	});

	it("it should not be positive", function() {
		expect(is.positive(candidate)).toEqual(false);
	});

	it("it should not be negative", function() {
		expect(is.negative(candidate)).toEqual(false);
	});

	it("it should not be a string", function() {
		expect(is.string(candidate)).toEqual(false);
	});

	it("it should not be a Date", function() {
		expect(is.date(candidate)).toEqual(false);
	});

	it("it should not be a function", function() {
		expect(is.fn(candidate)).toEqual(false);
	});

	it("it should not be an array", function() {
		expect(is.array(candidate)).toEqual(false);
	});

	it("it should not be a boolean", function() {
		expect(is.boolean(candidate)).toEqual(false);
	});

	it("it should not be an object", function() {
		expect(is.object(candidate)).toEqual(false);
	});

	it("it should be null", function() {
		expect(is.null(candidate)).toEqual(true);
	});

	it("it should not be undefined", function() {
		expect(is.undefined(candidate)).toEqual(false);
	});
});

describe('When checking an undefined value', function() {
	'use strict';

	var candidate;

	beforeEach(function() {
		candidate = undefined;
	});

	it("it should not be a number", function() {
		expect(is.number(candidate)).toEqual(false);
	});

	it("it should not be nan", function() {
		expect(is.nan(candidate)).toEqual(false);
	});

	it("it should not be an integer", function() {
		expect(is.integer(candidate)).toEqual(false);
	});

	it("it should not be an large integer", function() {
		expect(is.large(candidate)).toEqual(false);
	});

	it("it should not be positive", function() {
		expect(is.positive(candidate)).toEqual(false);
	});

	it("it should not be negative", function() {
		expect(is.negative(candidate)).toEqual(false);
	});

	it("it should not be a string", function() {
		expect(is.string(candidate)).toEqual(false);
	});

	it("it should not be a Date", function() {
		expect(is.date(candidate)).toEqual(false);
	});

	it("it should not be a function", function() {
		expect(is.fn(candidate)).toEqual(false);
	});

	it("it should not be an array", function() {
		expect(is.array(candidate)).toEqual(false);
	});

	it("it should not be a boolean", function() {
		expect(is.boolean(candidate)).toEqual(false);
	});

	it("it should not be an object", function() {
		expect(is.object(candidate)).toEqual(false);
	});

	it("it should not be null", function() {
		expect(is.null(candidate)).toEqual(false);
	});

	it("it should be undefined", function() {
		expect(is.undefined(candidate)).toEqual(true);
	});
});

describe('When checking a large integer (exceeding 32-bits)', function() {
	'use strict';

	var candidate;

	beforeEach(function() {
		candidate = 1502373984424;
	});

	it("it should be a number", function() {
		expect(is.number(candidate)).toEqual(true);
	});

	it("it should not be nan", function() {
		expect(is.nan(candidate)).toEqual(false);
	});

	it("it should be an integer", function() {
		expect(is.integer(candidate)).toEqual(false);
	});

	it("it should be an large integer", function() {
		expect(is.large(candidate)).toEqual(true);
	});

	it("it should be positive", function() {
		expect(is.positive(candidate)).toEqual(true);
	});

	it("it should not be negative", function() {
		expect(is.negative(candidate)).toEqual(false);
	});

	it("it should not be a string", function() {
		expect(is.string(candidate)).toEqual(false);
	});

	it("it should not be a Date", function() {
		expect(is.date(candidate)).toEqual(false);
	});

	it("it should not be a function", function() {
		expect(is.fn(candidate)).toEqual(false);
	});

	it("it should not be an array", function() {
		expect(is.array(candidate)).toEqual(false);
	});

	it("it should not be a boolean", function() {
		expect(is.boolean(candidate)).toEqual(false);
	});

	it("it should not be an object", function() {
		expect(is.object(candidate)).toEqual(false);
	});

	it("it should not be null", function() {
		expect(is.null(candidate)).toEqual(false);
	});

	it("it should not be undefined", function() {
		expect(is.undefined(candidate)).toEqual(false);
	});
});