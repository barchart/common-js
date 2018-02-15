var Enum = require('./../../../../lang/Enum'),
	FailureReasonItem = require('./../../../../api/failures/FailureReasonItem'),
	FailureType = require('./../../../../api/failures/FailureType');

describe('When a FailureType is created with a template string that references root level data', function() {
	'use strict';

	var code;
	var template;
	var type;

	beforeEach(function() {
		code = 'TEST_ROOT';
		template = 'This is a test of the {root.system} system.';

		type = Enum.fromCode(FailureType, code) || new FailureType(code, template);
	});

	describe('and a FailureReasonItem is created using this FailureType', function() {
		var item;
		var root;

		beforeEach(function() {
			root = {
				system: 'Emergency Broadcast'
			};

			item = new FailureReasonItem(type, {});
		});

		describe('and the item is formatted', function() {
			var formatted;

			beforeEach(function () {
				formatted = item.format(root);
			});

			it('should match the expected output', function () {
				expect(formatted).toEqual('This is a test of the Emergency Broadcast system.');
			});
		});
	});
});

describe('When a FailureType is created with a template string that references with data points', function() {
	'use strict';

	var code;
	var template;
	var type;

	beforeEach(function() {
		code = 'TEST_MULTIPLE';
		template = 'I believe that "{argument.thesis}" is a {argument.conclusion} statement.';

		type = Enum.fromCode(FailureType, code) || new FailureType(code, template);
	});

	describe('and a FailureReasonItem is created using this FailureType', function() {
		var item;
		var root;
		var data;

		beforeEach(function() {
			root = {

			};

			data = {
				argument: {
					thesis: 'all cats are animals',
					conclusion: 'true'
				}
			};

			item = new FailureReasonItem(type, data);
		});

		describe('and the item is formatted', function() {
			var formatted;

			beforeEach(function () {
				formatted = item.format(root);
			});

			it('should match the expected output', function () {
				expect(formatted).toEqual('I believe that "all cats are animals" is a true statement.');
			});
		});
	});
});

describe('When a FailureType is created with a template string that references data points with casing changes', function() {
	'use strict';

	var code;
	var template;
	var type;

	beforeEach(function() {
		code = 'TEST_CASING';
		template = 'The first letter is lowercase: {l|name}. The first letter is uppercase: {u|name}. All letters are lowercase: {L|name}. All letters are uppercase: {U|name}.';

		type = Enum.fromCode(FailureType, code) || new FailureType(code, template);
	});

	describe('and a FailureReasonItem is created using this FailureType', function() {
		var item;
		var root;
		var data;

		beforeEach(function() {
			root = {

			};

			data = {
				name: 'Abraham Lincoln'
			};

			item = new FailureReasonItem(type, data);
		});

		describe('and the item is formatted', function() {
			var formatted;

			beforeEach(function () {
				formatted = item.format(root);
			});

			it('should match the expected output', function () {
				expect(formatted).toEqual('The first letter is lowercase: abraham Lincoln. The first letter is uppercase: Abraham Lincoln. All letters are lowercase: abraham lincoln. All letters are uppercase: ABRAHAM LINCOLN.');
			});
		});
	});
});