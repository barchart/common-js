const ReplaceResultProcessor = require('./../../../../data/processors/ReplaceResultProcessor');

describe('When a ReplaceResultProcessor is created with select and replace references', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new ReplaceResultProcessor({ propertyName: 'test', selectExpressionRef: 'select', replaceExpressionRef: 'replace'  });
	});

	describe('and an object with target property of "abcdef-ABCDEF-abcdef" is processed', () => {
		let result;
		let original;

		beforeEach((done) => {
			processor.process(original = { test: 'abcdef-ABCDEF-abcdef', select: '(abc)', replace: 'def' })
				.then((r) => {
					result = r;
					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the "test" property should be mutated', () => {
			expect(result.test).toEqual('defdef-ABCDEF-defdef');
		});
	});
});

describe('When a ReplaceResultProcessor is created to replace "abc" with "def"', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new ReplaceResultProcessor({ propertyName: 'test', selectExpression: "(abc)", replaceExpression: "def"  });
	});

	describe('and an object with target property of "abcdef-ABCDEF-abcdef" is processed', () => {
		let result;
		let original;

		beforeEach((done) => {
			processor.process(original = { test: 'abcdef-ABCDEF-abcdef' })
				.then((r) => {
					result = r;
					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the "test" property should be mutated', () => {
			expect(result.test).toEqual('defdef-ABCDEF-defdef');
		});
	});
});

describe('When a ReplaceResultProcessor in case-insensitive mode is created to replace "abc" with "def"', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new ReplaceResultProcessor({ propertyName: 'test', selectExpression: "(abc)", replaceExpression: "def", insensitive: true  });
	});

	describe('and an object with target property of "abcdef-ABCDEF-abcdef" is processed', () => {
		let result;
		let original;

		beforeEach((done) => {
			processor.process(original = { test: 'abcdef-ABCDEF-abcdef' })
				.then((r) => {
					result = r;
					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the "test" property should be mutated', () => {
			expect(result.test).toEqual('defdef-defDEF-defdef');
		});
	});
});

describe('When a ReplaceResultProcessor in non-global mode is created to replace "abc" with "def"', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new ReplaceResultProcessor({ propertyName: 'test', selectExpression: "(abc)", replaceExpression: "def", global: false  });
	});

	describe('and an object with target property of "abcdef-ABCDEF-abcdef" is processed', () => {
		let result;
		let original;

		beforeEach((done) => {
			processor.process(original = { test: 'abcdef-ABCDEF-abcdef' })
				.then((r) => {
					result = r;
					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the "test" property should be mutated', () => {
			expect(result.test).toEqual('defdef-ABCDEF-abcdef');
		});
	});
});

describe('When a ReplaceResultProcessor is created adding a dash to any "a" or "b" character', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new ReplaceResultProcessor({ propertyName: 'test', selectExpression: "([ab])", replaceExpression: "$1-"  });
	});

	describe('and an object with target property of "abcdef-ABCDEF-abcdef" is processed', () => {
		let result;
		let original;

		beforeEach((done) => {
			processor.process(original = { test: 'abcdef-ABCDEF-abcdef' })
				.then((r) => {
					result = r;
					done();
				});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the "test" property should be mutated', () => {
			expect(result.test).toEqual('a-b-cdef-ABCDEF-a-b-cdef');
		});
	});
});