const is = require('./../../../lang/is');

describe('When checking the number 3', () => {
	'use strict';

	let candidate;

	beforeEach(() => {
		candidate = 3;
	});

	it("it should be a number", () => {
		expect(is.number(candidate)).toEqual(true);
	});

	it("it should not be nan", () => {
		expect(is.nan(candidate)).toEqual(false);
	});

	it("it should be an integer", () => {
		expect(is.integer(candidate)).toEqual(true);
	});

	it("it should be an large integer", () => {
		expect(is.large(candidate)).toEqual(true);
	});

	it("it should be positive", () => {
		expect(is.positive(candidate)).toEqual(true);
	});

	it("it should not be negative", () => {
		expect(is.negative(candidate)).toEqual(false);
	});

	it('it should not be iterable', () => {
		expect(is.iterable(candidate)).toEqual(false);
	});

	it("it should not be a string", () => {
		expect(is.string(candidate)).toEqual(false);
	});

	it("it should not be a Date", () => {
		expect(is.date(candidate)).toEqual(false);
	});

	it("it should not be a function", () => {
		expect(is.fn(candidate)).toEqual(false);
	});

	it("it should not be an array", () => {
		expect(is.array(candidate)).toEqual(false);
	});

	it("it should not be a boolean", () => {
		expect(is.boolean(candidate)).toEqual(false);
	});

	it("it should not be an object", () => {
		expect(is.object(candidate)).toEqual(false);
	});

	it("it should not be null", () => {
		expect(is.null(candidate)).toEqual(false);
	});

	it("it should not be undefined", () => {
		expect(is.undefined(candidate)).toEqual(false);
	});

	it("it should not be a zero-length string", () => {
		expect(is.zeroLengthString(candidate)).toEqual(false);
	});
});

describe('When checking the Math.PI', () => {
	'use strict';

	let candidate;

	beforeEach(() => {
		candidate = Math.PI;
	});

	it("it should be a number", () => {
		expect(is.number(candidate)).toEqual(true);
	});

	it("it should not be nan", () => {
		expect(is.nan(candidate)).toEqual(false);
	});

	it("it should not be an integer", () => {
		expect(is.integer(candidate)).toEqual(false);
	});

	it("it should not be an large integer", () => {
		expect(is.large(candidate)).toEqual(false);
	});

	it("it should be positive", () => {
		expect(is.positive(candidate)).toEqual(true);
	});

	it("it should not be negative", () => {
		expect(is.negative(candidate)).toEqual(false);
	});

	it('it should not be iterable', () => {
		expect(is.iterable(candidate)).toEqual(false);
	});

	it("it should not be a string", () => {
		expect(is.string(candidate)).toEqual(false);
	});

	it("it should not be a Date", () => {
		expect(is.date(candidate)).toEqual(false);
	});

	it("it should not be a function", () => {
		expect(is.fn(candidate)).toEqual(false);
	});

	it("it should not be an array", () => {
		expect(is.array(candidate)).toEqual(false);
	});

	it("it should not be a boolean", () => {
		expect(is.boolean(candidate)).toEqual(false);
	});

	it("it should not be an object", () => {
		expect(is.object(candidate)).toEqual(false);
	});

	it("it should not be null", () => {
		expect(is.null(candidate)).toEqual(false);
	});

	it("it should not be undefined", () => {
		expect(is.undefined(candidate)).toEqual(false);
	});

	it("it should not be a zero-length string", () => {
		expect(is.zeroLengthString(candidate)).toEqual(false);
	});
});

describe('When checking the Number.NaN', () => {
	'use strict';

	let candidate;

	beforeEach(() => {
		candidate = Number.NaN;
	});

	it("it should not be a number", () => {
		expect(is.number(candidate)).toEqual(false);
	});

	it("it should be nan", () => {
		expect(is.nan(candidate)).toEqual(true);
	});

	it("it should not be an integer", () => {
		expect(is.integer(candidate)).toEqual(false);
	});

	it("it should not be an large integer", () => {
		expect(is.large(candidate)).toEqual(false);
	});

	it("it should not be positive", () => {
		expect(is.positive(candidate)).toEqual(false);
	});

	it("it should not be negative", () => {
		expect(is.negative(candidate)).toEqual(false);
	});

	it('it should not be iterable', () => {
		expect(is.iterable(candidate)).toEqual(false);
	});

	it("it should not be a string", () => {
		expect(is.string(candidate)).toEqual(false);
	});

	it("it should not be a Date", () => {
		expect(is.date(candidate)).toEqual(false);
	});

	it("it should not be a function", () => {
		expect(is.fn(candidate)).toEqual(false);
	});

	it("it should not be an array", () => {
		expect(is.array(candidate)).toEqual(false);
	});

	it("it should not be a boolean", () => {
		expect(is.boolean(candidate)).toEqual(false);
	});

	it("it should not be an object", () => {
		expect(is.object(candidate)).toEqual(false);
	});

	it("it should not be null", () => {
		expect(is.null(candidate)).toEqual(false);
	});

	it("it should not be undefined", () => {
		expect(is.undefined(candidate)).toEqual(false);
	});

	it("it should not be a zero-length string", () => {
		expect(is.zeroLengthString(candidate)).toEqual(false);
	});
});

describe('When checking the string "3"', () => {
	'use strict';

	let candidate;

	beforeEach(() => {
		candidate = "3";
	});

	it("it should not be a number", () => {
		expect(is.number(candidate)).toEqual(false);
	});

	it("it should not be nan", () => {
		expect(is.nan(candidate)).toEqual(false);
	});

	it("it should not be an integer", () => {
		expect(is.integer(candidate)).toEqual(false);
	});

	it("it should not be an large integer", () => {
		expect(is.large(candidate)).toEqual(false);
	});

	it("it should not be positive", () => {
		expect(is.positive(candidate)).toEqual(false);
	});

	it("it should not be negative", () => {
		expect(is.negative(candidate)).toEqual(false);
	});

	it('it should be iterable', () => {
		expect(is.iterable(candidate)).toEqual(true);
	});

	it("it should be a string", () => {
		expect(is.string(candidate)).toEqual(true);
	});

	it("it should not be a Date", () => {
		expect(is.date(candidate)).toEqual(false);
	});

	it("it should not be a function", () => {
		expect(is.fn(candidate)).toEqual(false);
	});

	it("it should not be an array", () => {
		expect(is.array(candidate)).toEqual(false);
	});

	it("it should not be a boolean", () => {
		expect(is.boolean(candidate)).toEqual(false);
	});

	it("it should not be an object", () => {
		expect(is.object(candidate)).toEqual(false);
	});

	it("it should not be null", () => {
		expect(is.null(candidate)).toEqual(false);
	});

	it("it should not be undefined", () => {
		expect(is.undefined(candidate)).toEqual(false);
	});

	it("it should not be a zero-length string", () => {
		expect(is.zeroLengthString(candidate)).toEqual(false);
	});
});

describe('When checking the date 08/29/2016', () => {
	'use strict';

	let candidate;

	beforeEach(() => {
		candidate = new Date(2016, 7, 29);
	});

	it("it should not be a number", () => {
		expect(is.number(candidate)).toEqual(false);
	});

	it("it should not be nan", () => {
		expect(is.nan(candidate)).toEqual(false);
	});

	it("it should not be an integer", () => {
		expect(is.integer(candidate)).toEqual(false);
	});

	it("it should not be an large integer", () => {
		expect(is.large(candidate)).toEqual(false);
	});

	it("it should not be positive", () => {
		expect(is.positive(candidate)).toEqual(false);
	});

	it("it should not be negative", () => {
		expect(is.negative(candidate)).toEqual(false);
	});

	it('it should not be iterable', () => {
		expect(is.iterable(candidate)).toEqual(false);
	});

	it("it should not be a string", () => {
		expect(is.string(candidate)).toEqual(false);
	});

	it("it should be a Date", () => {
		expect(is.date(candidate)).toEqual(true);
	});

	it("it should be an object", () => {
		expect(is.object(candidate)).toEqual(true);
	});

	it("it should not be a function", () => {
		expect(is.fn(candidate)).toEqual(false);
	});

	it("it should not be an array", () => {
		expect(is.array(candidate)).toEqual(false);
	});

	it("it should not be a boolean", () => {
		expect(is.boolean(candidate)).toEqual(false);
	});

	it("it should not be null", () => {
		expect(is.null(candidate)).toEqual(false);
	});

	it("it should not be undefined", () => {
		expect(is.undefined(candidate)).toEqual(false);
	});

	it("it should not be a zero-length string", () => {
		expect(is.zeroLengthString(candidate)).toEqual(false);
	});
});

describe('When checking the "expect" function', () => {
	'use strict';

	let candidate;

	beforeEach(() => {
		candidate = expect;
	});

	it("it should not be a number", () => {
		expect(is.number(candidate)).toEqual(false);
	});

	it("it should not be nan", () => {
		expect(is.nan(candidate)).toEqual(false);
	});

	it("it should not be an integer", () => {
		expect(is.integer(candidate)).toEqual(false);
	});

	it("it should not be an large integer", () => {
		expect(is.large(candidate)).toEqual(false);
	});

	it("it should not be positive", () => {
		expect(is.positive(candidate)).toEqual(false);
	});

	it('it should not be iterable', () => {
		expect(is.iterable(candidate)).toEqual(false);
	});

	it("it should not be negative", () => {
		expect(is.negative(candidate)).toEqual(false);
	});

	it("it should not be a string", () => {
		expect(is.string(candidate)).toEqual(false);
	});

	it("it should not be a Date", () => {
		expect(is.date(candidate)).toEqual(false);
	});

	it("it should be a function", () => {
		expect(is.fn(candidate)).toEqual(true);
	});

	it("it should not be an array", () => {
		expect(is.array(candidate)).toEqual(false);
	});

	it("it should not be a boolean", () => {
		expect(is.boolean(candidate)).toEqual(false);
	});

	it("it should not be an object", () => {
		expect(is.object(candidate)).toEqual(false);
	});

	it("it should not be null", () => {
		expect(is.null(candidate)).toEqual(false);
	});

	it("it should not be undefined", () => {
		expect(is.undefined(candidate)).toEqual(false);
	});

	it("it should not be a zero-length string", () => {
		expect(is.zeroLengthString(candidate)).toEqual(false);
	});
});

describe('When checking an empty object', () => {
	'use strict';

	let candidate;

	beforeEach(() => {
		candidate = { };
	});

	it("it should not be a number", () => {
		expect(is.number(candidate)).toEqual(false);
	});

	it("it should not be nan", () => {
		expect(is.nan(candidate)).toEqual(false);
	});

	it("it should not be an integer", () => {
		expect(is.integer(candidate)).toEqual(false);
	});

	it("it should not be an large integer", () => {
		expect(is.large(candidate)).toEqual(false);
	});

	it("it should not be positive", () => {
		expect(is.positive(candidate)).toEqual(false);
	});

	it("it should not be negative", () => {
		expect(is.negative(candidate)).toEqual(false);
	});

	it('it should not be iterable', () => {
		expect(is.iterable(candidate)).toEqual(false);
	});

	it("it should not be a string", () => {
		expect(is.string(candidate)).toEqual(false);
	});

	it("it should not be a Date", () => {
		expect(is.date(candidate)).toEqual(false);
	});

	it("it should not be a function", () => {
		expect(is.fn(candidate)).toEqual(false);
	});

	it("it should not be an array", () => {
		expect(is.array(candidate)).toEqual(false);
	});

	it("it should not be a boolean", () => {
		expect(is.boolean(candidate)).toEqual(false);
	});

	it("it should be an object", () => {
		expect(is.object(candidate)).toEqual(true);
	});

	it("it should not be null", () => {
		expect(is.null(candidate)).toEqual(false);
	});

	it("it should not be undefined", () => {
		expect(is.undefined(candidate)).toEqual(false);
	});

	it("it should not be a zero-length string", () => {
		expect(is.zeroLengthString(candidate)).toEqual(false);
	});
});

describe('When checking an empty array', () => {
	'use strict';

	let candidate;

	beforeEach(() => {
		candidate = [ ];
	});

	it("it should not be a number", () => {
		expect(is.number(candidate)).toEqual(false);
	});

	it("it should not be nan", () => {
		expect(is.nan(candidate)).toEqual(false);
	});

	it("it should not be an integer", () => {
		expect(is.integer(candidate)).toEqual(false);
	});

	it("it should not be an large integer", () => {
		expect(is.large(candidate)).toEqual(false);
	});

	it("it should not be positive", () => {
		expect(is.positive(candidate)).toEqual(false);
	});

	it("it should not be negative", () => {
		expect(is.negative(candidate)).toEqual(false);
	});

	it('it should be iterable', () => {
		expect(is.iterable(candidate)).toEqual(true);
	});

	it("it should not be a string", () => {
		expect(is.string(candidate)).toEqual(false);
	});

	it("it should not be a Date", () => {
		expect(is.date(candidate)).toEqual(false);
	});

	it("it should not be a function", () => {
		expect(is.fn(candidate)).toEqual(false);
	});

	it("it should be an array", () => {
		expect(is.array(candidate)).toEqual(true);
	});

	it("it should not be a boolean", () => {
		expect(is.boolean(candidate)).toEqual(false);
	});

	it("it should be an object", () => {
		expect(is.object(candidate)).toEqual(true);
	});

	it("it should not be null", () => {
		expect(is.null(candidate)).toEqual(false);
	});

	it("it should not be undefined", () => {
		expect(is.undefined(candidate)).toEqual(false);
	});

	it("it should not be a zero-length string", () => {
		expect(is.zeroLengthString(candidate)).toEqual(false);
	});
});

describe('When checking a null value', () => {
	'use strict';

	let candidate;

	beforeEach(() => {
		candidate = null;
	});

	it("it should not be a number", () => {
		expect(is.number(candidate)).toEqual(false);
	});

	it("it should not be nan", () => {
		expect(is.nan(candidate)).toEqual(false);
	});

	it("it should not be an integer", () => {
		expect(is.integer(candidate)).toEqual(false);
	});

	it("it should not be an large integer", () => {
		expect(is.large(candidate)).toEqual(false);
	});

	it("it should not be positive", () => {
		expect(is.positive(candidate)).toEqual(false);
	});

	it("it should not be negative", () => {
		expect(is.negative(candidate)).toEqual(false);
	});

	it('it should not be iterable', () => {
		expect(is.iterable(candidate)).toEqual(false);
	});

	it("it should not be a string", () => {
		expect(is.string(candidate)).toEqual(false);
	});

	it("it should not be a Date", () => {
		expect(is.date(candidate)).toEqual(false);
	});

	it("it should not be a function", () => {
		expect(is.fn(candidate)).toEqual(false);
	});

	it("it should not be an array", () => {
		expect(is.array(candidate)).toEqual(false);
	});

	it("it should not be a boolean", () => {
		expect(is.boolean(candidate)).toEqual(false);
	});

	it("it should not be an object", () => {
		expect(is.object(candidate)).toEqual(false);
	});

	it("it should be null", () => {
		expect(is.null(candidate)).toEqual(true);
	});

	it("it should not be undefined", () => {
		expect(is.undefined(candidate)).toEqual(false);
	});

	it("it should not be a zero-length string", () => {
		expect(is.zeroLengthString(candidate)).toEqual(false);
	});
});

describe('When checking an undefined value', () => {
	'use strict';

	let candidate;

	beforeEach(() => {
		candidate = undefined;
	});

	it("it should not be a number", () => {
		expect(is.number(candidate)).toEqual(false);
	});

	it("it should not be nan", () => {
		expect(is.nan(candidate)).toEqual(false);
	});

	it("it should not be an integer", () => {
		expect(is.integer(candidate)).toEqual(false);
	});

	it("it should not be an large integer", () => {
		expect(is.large(candidate)).toEqual(false);
	});

	it("it should not be positive", () => {
		expect(is.positive(candidate)).toEqual(false);
	});

	it("it should not be negative", () => {
		expect(is.negative(candidate)).toEqual(false);
	});

	it('it should not be iterable', () => {
		expect(is.iterable(candidate)).toEqual(false);
	});

	it("it should not be a string", () => {
		expect(is.string(candidate)).toEqual(false);
	});

	it("it should not be a Date", () => {
		expect(is.date(candidate)).toEqual(false);
	});

	it("it should not be a function", () => {
		expect(is.fn(candidate)).toEqual(false);
	});

	it("it should not be an array", () => {
		expect(is.array(candidate)).toEqual(false);
	});

	it("it should not be a boolean", () => {
		expect(is.boolean(candidate)).toEqual(false);
	});

	it("it should not be an object", () => {
		expect(is.object(candidate)).toEqual(false);
	});

	it("it should not be null", () => {
		expect(is.null(candidate)).toEqual(false);
	});

	it("it should be undefined", () => {
		expect(is.undefined(candidate)).toEqual(true);
	});

	it("it should not be a zero-length string", () => {
		expect(is.zeroLengthString(candidate)).toEqual(false);
	});
});

describe('When checking a large integer (exceeding 32-bits)', () => {
	'use strict';

	let candidate;

	beforeEach(() => {
		candidate = 1502373984424;
	});

	it("it should be a number", () => {
		expect(is.number(candidate)).toEqual(true);
	});

	it("it should not be nan", () => {
		expect(is.nan(candidate)).toEqual(false);
	});

	it("it should not be an integer", () => {
		expect(is.integer(candidate)).toEqual(false);
	});

	it("it should be an large integer", () => {
		expect(is.large(candidate)).toEqual(true);
	});

	it("it should be positive", () => {
		expect(is.positive(candidate)).toEqual(true);
	});

	it("it should not be negative", () => {
		expect(is.negative(candidate)).toEqual(false);
	});

	it('it should not be iterable', () => {
		expect(is.iterable(candidate)).toEqual(false);
	});

	it("it should not be a string", () => {
		expect(is.string(candidate)).toEqual(false);
	});

	it("it should not be a Date", () => {
		expect(is.date(candidate)).toEqual(false);
	});

	it("it should not be a function", () => {
		expect(is.fn(candidate)).toEqual(false);
	});

	it("it should not be an array", () => {
		expect(is.array(candidate)).toEqual(false);
	});

	it("it should not be a boolean", () => {
		expect(is.boolean(candidate)).toEqual(false);
	});

	it("it should not be an object", () => {
		expect(is.object(candidate)).toEqual(false);
	});

	it("it should not be null", () => {
		expect(is.null(candidate)).toEqual(false);
	});

	it("it should not be undefined", () => {
		expect(is.undefined(candidate)).toEqual(false);
	});

	it("it should not be a zero-length string", () => {
		expect(is.zeroLengthString(candidate)).toEqual(false);
	});
});

describe('When checking a zero-length string', () => {
	'use strict';

	let candidate;

	beforeEach(() => {
		candidate = '';
	});

	it("it should not be a number", () => {
		expect(is.number(candidate)).toEqual(false);
	});

	it("it should not be nan", () => {
		expect(is.nan(candidate)).toEqual(false);
	});

	it("it should not be an integer", () => {
		expect(is.integer(candidate)).toEqual(false);
	});

	it("it should not be an large integer", () => {
		expect(is.large(candidate)).toEqual(false);
	});

	it("it should not be positive", () => {
		expect(is.positive(candidate)).toEqual(false);
	});

	it("it should not be negative", () => {
		expect(is.negative(candidate)).toEqual(false);
	});

	it('it should be iterable', () => {
		expect(is.iterable(candidate)).toEqual(true);
	});

	it("it should be a string", () => {
		expect(is.string(candidate)).toEqual(true);
	});

	it("it should not be a Date", () => {
		expect(is.date(candidate)).toEqual(false);
	});

	it("it should not be a function", () => {
		expect(is.fn(candidate)).toEqual(false);
	});

	it("it should not be an array", () => {
		expect(is.array(candidate)).toEqual(false);
	});

	it("it should not be a boolean", () => {
		expect(is.boolean(candidate)).toEqual(false);
	});

	it("it should not be an object", () => {
		expect(is.object(candidate)).toEqual(false);
	});

	it("it should not be null", () => {
		expect(is.null(candidate)).toEqual(false);
	});

	it("it should not be undefined", () => {
		expect(is.undefined(candidate)).toEqual(false);
	});

	it("it should be a zero-length string", () => {
		expect(is.zeroLengthString(candidate)).toEqual(true);
	});
});

describe('When checking inheritance', () => {
	class Grandparent {
		constructor() {

		}
	}

	class Parent extends Grandparent {
		constructor() {
			super();
		}
	}

	class Child extends Parent {
		constructor() {
			super();
		}
	}

	class Uncle extends Grandparent {
		constructor() {
			super();
		}
	}

	class Unrelated {
		constructor() {

		}
	}

	it('it should indicate that "Child" extends "Parent"', () => {
		expect(is.extension(Parent, Child)).toEqual(true);
	});

	it('it should indicate that "Child" extends "Grandparent"', () => {
		expect(is.extension(Grandparent, Child)).toEqual(true);
	});

	it('it should not indicate that "Child" extends "Uncle"', () => {
		expect(is.extension(Uncle, Child)).toEqual(false);
	});

	it('it should not indicate that "Child" extends "Unrelated"', () => {
		expect(is.extension(Unrelated, Child)).toEqual(false);
	});

	it('it should not indicate that "Parent" extends "Child"', () => {
		expect(is.extension(Child, Parent)).toEqual(false);
	});
});