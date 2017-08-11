var attributes = require('./../../../lang/attributes');

describe('When "attributes.has" is used to check a top-level property', function() {
	'use strict';

	var target;

	beforeEach(function() {
		target = {
			test: 123
		};
	});

	describe("and the property exists", function() {
		it("should return true", function() {
			expect(attributes.has(target, "test")).toEqual(true);
		});
	});

	describe("and the property does not exist", function() {
		it("should return true", function() {
			expect(attributes.has(target, "name")).toEqual(false);
		});
	});
});

describe('When "attributes.has" is used to check a top-level property (with an array)', function() {
	'use strict';

	var target;

	beforeEach(function() {
		target = {
			test: 123
		};
	});

	describe("and the property exists", function() {
		it("should return true", function() {
			expect(attributes.has(target, [ "test" ])).toEqual(true);
		});
	});

	describe("and the property does not exist", function() {
		it("should return true", function() {
			expect(attributes.has(target, [ "name" ])).toEqual(false);
		});
	});
});

describe('When "attributes.has" is used to check a second-level property', function() {
	'use strict';

	var target;

	beforeEach(function() {
		target = {
			nested: {
				test: 123
			},
			a: undefined,
			b: null
		};
	});

	describe("and the property exists", function() {
		it("should return true", function() {
			expect(attributes.has(target, "nested.test")).toEqual(true);
		});
	});

	describe("and the property does not exist", function() {
		it("should return true", function() {
			expect(attributes.has(target, "nested.name")).toEqual(false);
		});
	});

	describe("and the top-level property does not exist", function() {
		it("should return true", function() {
			expect(attributes.has(target, "wrong.name")).toEqual(false);
		});
	});

	describe("and the top-level property exists, but is undefined", function() {
		it("should return true", function() {
			expect(attributes.has(target, "a.name")).toEqual(false);
		});
	});

	describe("and the top-level property exists, but is null", function() {
		it("should return true", function() {
			expect(attributes.has(target, "b.name")).toEqual(false);
		});
	});
});

describe('When "attributes.has" is used to check a second-level property (with an array)', function() {
	'use strict';

	var target;

	beforeEach(function() {
		target = {
			nested: {
				test: 123
			}
		};
	});

	describe("and the property exists", function() {
		it("should return true", function() {
			expect(attributes.has(target, [ "nested", "test" ])).toEqual(true);
		});
	});

	describe("and the property does not exist", function() {
		it("should return true", function() {
			expect(attributes.has(target, [ "nested", "name" ])).toEqual(false);
		});
	});

	describe("and the top-level property does not exist", function() {
		it("should return true", function() {
			expect(attributes.has(target, [ "wrong", "name" ])).toEqual(false);
		});
	});
});

describe('When "attributes.has" is called with an empty string', function() {
	'use strict';

	var target;

	beforeEach(function() {
		target = {
			test: 123
		};
	});

	it("should return false", function() {
		expect(attributes.has(target, "")).toEqual(false);
	});
});

describe('When "attributes.has" is called with a zero-length array', function() {
	'use strict';

	var target;

	beforeEach(function() {
		target = {
			test: 123
		};
	});

	it("should return false", function() {
		expect(attributes.has(target, [ ])).toEqual(false);
	});
});

describe('When "attributes.read" is used to get a top-level property', function() {
	'use strict';

	var target;

	beforeEach(function() {
		target = {
			nested: {
				test: 123
			}
		};
	});


	describe("and the property exists", function() {
		it("should return the property value", function() {
			expect(attributes.read(target, "nested.test")).toEqual(123);
		});
	});

	describe("and the property does not exist", function() {
		it("should be undefined", function() {
			expect(attributes.read(target, "nested.name")).toBe(undefined);
		});
	});
});

describe('When "attributes.read" is used to get a top-level property (with an array)', function() {
	'use strict';

	var target;

	beforeEach(function() {
		target = {
			nested: {
				test: 123
			}
		};
	});


	describe("and the property exists", function() {
		it("should return the property value", function() {
			expect(attributes.read(target, [ "nested", "test" ])).toEqual(123);
		});
	});

	describe("and the property does not exist", function() {
		it("should be undefined", function() {
			expect(attributes.read(target, [ "nested", "name" ])).toBe(undefined);
		});
	});
});

describe('When "attributes.read" is used to get a second-level property', function() {
	'use strict';

	var target;

	beforeEach(function() {
		target = {
			nested: {
				test: 123
			}
		};
	});

	describe("and the property exists", function() {
		it("should return the property value", function() {
			expect(attributes.read(target, "nested.test")).toEqual(123);
		});
	});

	describe("and the property does not exist", function() {
		it("should be undefined", function() {
			expect(attributes.read(target, "nested.name")).toBe(undefined);
		});
	});

	describe("and the top-level property does not exist", function() {
		it("should be undefined", function() {
			expect(attributes.read(target, "wrong.name")).toBe(undefined);
		});
	});
});

describe('When "attributes.read" is used to get a second-level property (with an array)', function() {
	'use strict';

	var target;

	beforeEach(function() {
		target = {
			nested: {
				test: 123
			}
		};
	});

	describe("and the property exists", function() {
		it("should return the property value", function() {
			expect(attributes.read(target, [ "nested", "test" ])).toEqual(123);
		});
	});

	describe("and the property does not exist", function() {
		it("should be undefined", function() {
			expect(attributes.read(target, [ "nested", "name" ])).toBe(undefined);
		});
	});

	describe("and the top-level property does not exist", function() {
		it("should be undefined", function() {
			expect(attributes.read(target, [ "wrong", "name" ])).toBe(undefined);
		});
	});
});

describe('When "attributes.read" is called with an empty string', function() {
	'use strict';

	var target;

	beforeEach(function() {
		target = {
			test: 123
		};
	});

	it("should return an undefined value", function() {
		expect(attributes.read(target, "")).toBe(undefined);
	});
});

describe('When "attributes.read" is called with a zero-length array', function() {
	'use strict';

	var target;

	beforeEach(function() {
		target = {
			test: 123
		};
	});

	it("should return an undefined value", function() {
		expect(attributes.read(target, [ ])).toBe(undefined);
	});
});

describe('When "attributes.write" is used to set a top-level property', function() {
	'use strict';

	var target;

	beforeEach(function() {
		target = {
			test: 123
		};
	});

	describe("and the property exists", function() {
		beforeEach(function() {
			attributes.write(target, "test", "four-five-six");
		});

		it("the property value should be overwritten", function() {
			expect(target.test).toEqual("four-five-six");
		});
	});

	describe("and the property does not exist", function() {
		beforeEach(function() {
			attributes.write(target, "name", "Alice");
		});

		it("the property value should be created and set", function() {
			expect(target.name).toEqual("Alice");
		});
	});
});

describe('When "attributes.write" is used to set a top-level property (with an array)', function() {
	'use strict';

	var target;

	beforeEach(function() {
		target = {
			test: 123
		};
	});

	describe("and the property exists", function() {
		beforeEach(function() {
			attributes.write(target, [ "test" ], "four-five-six");
		});

		it("the property value should be overwritten", function() {
			expect(target.test).toEqual("four-five-six");
		});
	});

	describe("and the property does not exist", function() {
		beforeEach(function() {
			attributes.write(target, [ "name" ], "Alice");
		});

		it("the property value should be created and set", function() {
			expect(target.name).toEqual("Alice");
		});
	});
});

describe('When "attributes.write" is used to set a second-level property', function() {
	'use strict';

	var target;

	beforeEach(function() {
		target = {
			nested: {
				test: 123
			}
		};
	});

	describe("and the property exists", function() {
		beforeEach(function() {
			attributes.write(target, "nested.test", "four-five-six");
		});

		it("the property value should be overwritten", function() {
			expect(target.nested.test).toEqual("four-five-six");
		});
	});

	describe("and the second-level property does not exist", function() {
		beforeEach(function() {
			attributes.write(target, "nested.name", "Alice");
		});

		it("the property value should be created and set", function() {
			expect(target.nested.name).toEqual("Alice");
		});
	});

	describe("and the top-level property does not exist", function() {
		beforeEach(function() {
			attributes.write(target, "x.y", "z");
		});

		it("the top-level and second properties value should be created and set", function() {
			expect(target.x.y).toEqual("z");
		});
	});
});

describe('When "attributes.write" is used to set a second-level property (using an array)', function() {
	'use strict';

	var target;

	beforeEach(function() {
		target = {
			nested: {
				test: 123
			}
		};
	});

	describe("and the property exists", function() {
		beforeEach(function() {
			attributes.write(target, [ "nested", "test" ], "four-five-six");
		});

		it("the property value should be overwritten", function() {
			expect(target.nested.test).toEqual("four-five-six");
		});
	});

	describe("and the second-level property does not exist", function() {
		beforeEach(function() {
			attributes.write(target, [ "nested", "name" ], "Alice");
		});

		it("the property value should be created and set", function() {
			expect(target.nested.name).toEqual("Alice");
		});
	});

	describe("and the top-level property does not exist", function() {
		beforeEach(function() {
			attributes.write(target, [ "x", "y" ], "z");
		});

		it("the top-level and second properties value should be created and set", function() {
			expect(target.x.y).toEqual("z");
		});
	});
});

describe('When "attributes.erase" is used to remove a top-level property', function() {
	'use strict';

	var target;

	beforeEach(function() {
		target = {
			test: 123
		};
	});

	describe("and the property exists", function() {
		beforeEach(function() {
			attributes.erase(target, "test");
		});

		it("the property value not exist", function() {
			expect(target.hasOwnProperty("test")).toEqual(false);
		});
	});

	describe("and the property does not exist", function() {
		beforeEach(function() {
			attributes.erase(target, "name");
		});

		it("the target should be unaffected", function() {
			expect(target.hasOwnProperty("test")).toEqual(true);
		});
	});
});

describe('When "attributes.erase" is used to remove a top-level property (using an array)', function() {
	'use strict';

	var target;

	beforeEach(function() {
		target = {
			test: 123
		};
	});

	describe("and the property exists", function() {
		beforeEach(function() {
			attributes.erase(target, [ "test" ]);
		});

		it("the property value not exist", function() {
			expect(target.hasOwnProperty("test")).toEqual(false);
		});
	});

	describe("and the property does not exist", function() {
		beforeEach(function() {
			attributes.erase(target, [ "name" ]);
		});

		it("the target should be unaffected", function() {
			expect(target.hasOwnProperty("test")).toEqual(true);
		});
	});
});

describe('When "attributes.erase" is used to remove a second-level property', function() {
	'use strict';

	var target;

	beforeEach(function() {
		target = {
			nested: {
				test: 123
			}
		};
	});


	describe("and the property exists", function() {
		beforeEach(function() {
			attributes.erase(target, "nested.test");
		});

		it("the property value not exist", function() {
			expect(target.hasOwnProperty("nested")).toEqual(true);
			expect(target.nested.hasOwnProperty("test")).toEqual(false);
		});
	});

	describe("and the second-level property does not exist", function() {
		beforeEach(function() {
			attributes.erase(target, "nested.name");
		});

		it("the target should be unaffected", function() {
			expect(target.hasOwnProperty("nested")).toEqual(true);
			expect(target.nested.hasOwnProperty("test")).toEqual(true);
		});
	});

	describe("and the top-level property does not exist", function() {
		beforeEach(function() {
			attributes.erase(target, "x.y");
		});

		it("the target should be unaffected", function() {
			expect(target.hasOwnProperty("nested")).toEqual(true);
			expect(target.nested.hasOwnProperty("test")).toEqual(true);
		});
	});
});


describe('When "attributes.erase" is used to remove a second-level property (using an array)', function() {
	'use strict';

	var target;

	beforeEach(function() {
		target = {
			nested: {
				test: 123
			}
		};
	});

	describe("and the property exists", function() {
		beforeEach(function() {
			attributes.erase(target, [ "nested", "test" ]);
		});

		it("the property value not exist", function() {
			expect(target.hasOwnProperty("nested")).toEqual(true);
			expect(target.nested.hasOwnProperty("test")).toEqual(false);
		});
	});

	describe("and the second-level property does not exist", function() {
		beforeEach(function() {
			attributes.erase(target, [ "nested", "name" ]);
		});

		it("the target should be unaffected", function() {
			expect(target.hasOwnProperty("nested")).toEqual(true);
			expect(target.nested.hasOwnProperty("test")).toEqual(true);
		});
	});

	describe("and the top-level property does not exist", function() {
		beforeEach(function() {
			attributes.erase(target, [ "x", "y" ]);
		});

		it("the target should be unaffected", function() {
			expect(target.hasOwnProperty("nested")).toEqual(true);
			expect(target.nested.hasOwnProperty("test")).toEqual(true);
		});
	});
});


describe('When "attributes.read" is used with a null separator', function() {
	'use strict';

	var target;

	beforeEach(function() {
		target = {
			'some.key' : 1
		};
	});

	describe("and the property exists", function() {
		it("should return the property value", function() {
			expect(attributes.read(target, 'some.key', null)).toEqual(1);
		});
	});

	describe("and the property does not exist", function() {
		it("should be undefined", function() {
			expect(attributes.read(target, 'another.key', null)).toEqual(undefined);
		});
	});

});


describe('When "attributes.read" is used with a non-default separator', function() {
	'use strict';

	var target;

	beforeEach(function() {
		target = {
			nested : {
				test: 1
			}
		};
	});

	describe("and the property exists", function() {
		it("should return the property value", function() {
			expect(attributes.read(target, 'nested|test', '|')).toEqual(1);
		});
	});

	describe("and the property does not exist", function() {
		it("should be undefined", function() {
			expect(attributes.read(target, 'another|key', '|')).toEqual(undefined);
		});
	});
});