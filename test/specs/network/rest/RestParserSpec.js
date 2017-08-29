var RestParser = require('./../../../../network/rest/RestParser');

describe('Using a customized JSON REST parser is created', function() {
	'use strict';

	var parser;
	var spy;

	beforeEach(function () {
		function parserFactory() {
			return spy = jasmine.createSpy('spy').and.callFake(function (k, v) {
				return k === 'fizz' ? 3 : v;
			});
		}

		parser = RestParser.getJsonParser(parserFactory);
	});

	describe('and JSON string is parsed (that represents a simple object)', function () {
		var serialzied;
		var deserialzied;

		beforeEach(function () {
			deserialzied = parser.parse(serialzied = '{"fizz":"three","bang":5}');
		});

		it('the "reviver" function should have been called', function () {
			expect(spy).toHaveBeenCalled();
		});

		it('the resulting object should have a "fizz" property with value of 3 (an override)', function () {
			expect(deserialzied.fizz).toEqual(3);
		});

		it('the resulting object should have a "bang" property with a value of 5', function () {
			expect(deserialzied.bang).toEqual(5);
		});
	});
});

describe('Using another customized JSON REST parser is created', function() {
	'use strict';

	var parser;
	var spy;

	beforeEach(function () {
		function parserFactory() {
			return spy = jasmine.createSpy('spy').and.callFake(function (k, v) {
				return k === 'fizz' ? 3 : v;
			});
		}

		parser = RestParser.getJsonParser(parserFactory);
	});

	describe('and JSON string is parsed (that represents an array of simple objects)', function () {
		var serialzied;
		var deserialzied;

		beforeEach(function() {
			deserialzied = parser.parse(serialzied = '[{"fizz":"three","bang":5},{"fizz":"four","bang":6}]');
		});

		it('the "reviver" function should have been called', function() {
			expect(spy).toHaveBeenCalled();
		});

		it('the resulting object should be an array', function() {
			expect(Array.isArray(deserialzied)).toEqual(true);
		});

		it('the first object should have a "fizz" property with value of 3 (an override)', function () {
			expect(deserialzied[0].fizz).toEqual(3);
		});

		it('the first object should have a "bang" property with a value of 5', function () {
			expect(deserialzied[0].bang).toEqual(5);
		});

		it('the second object should have a "fizz" property with value of 3 (an override)', function () {
			expect(deserialzied[1].fizz).toEqual(3);
		});

		it('the second object should have a "bang" property with a value of 6', function () {
			expect(deserialzied[1].bang).toEqual(6);
		});
	});
});