var CommandHandler = require('./../../../commands/CommandHandler');

describe('When a CommandHandler is created from a function', function() {
	'use strict';

	var commandHandler;
	var spy;
	var result;

	beforeEach(function() {
		commandHandler = CommandHandler.fromFunction(spy = jasmine.createSpy('spy').and.returnValue(result = 123));
	});

	it('returns a CommandHandler instance', function() {
		expect(commandHandler instanceof CommandHandler).toEqual(true);
	});

	describe('and the command is executed', function() {
		var commandData;
		var commandResult;

		beforeEach(function() {
			commandResult = commandHandler.process(commandData = {});
		});

		it('should invoke the wrapped function', function() {
			expect(spy).toHaveBeenCalledWith(commandData);
		});

		it('should return the wrapped function\'s result', function() {
			expect(commandResult).toEqual(result);
		});
	});

	describe('and the command processor is converted to a function', function() {
		var commandFunction;

		beforeEach(function() {
			commandFunction = CommandHandler.toFunction(commandHandler);
		});

		it('returns a function', function() {
			expect(typeof commandFunction).toEqual('function');
		});

		describe('and the converted function is invoked', function() {
			var commandData;
			var commandResult;

			beforeEach(function() {
				commandResult = commandFunction(commandData = {});
			});

			it('should invoke the wrapped function', function() {
				expect(spy).toHaveBeenCalledWith(commandData);
			});

			it('should return the wrapped function\'s result', function() {
				expect(commandResult).toEqual(result);
			});
		});
	});
});