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

describe('When "attributes.has" is used to check a second-level property', function() {
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