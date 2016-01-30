var CommandHandler = require('./../../../commands/CommandHandler');
var MappedCommandHandler = require('./../../../commands/MappedCommandHandler');

describe('When a MappedCommandHandler is created with two mapped commands', function() {
	'use strict';

	var commandHandler;

	var spyOne;
	var spyTwo;

	var selectorOne;
	var selectorTwo;

	var resultOne;
	var resultTwo;

	beforeEach(function() {
		selectorOne = 'one';
		selectorTwo = 'two';

		resultOne = 'a';
		resultTwo = 'b';

		commandHandler = new MappedCommandHandler(function(data) {
			return data.commandType || null;
		});

		commandHandler.addCommandHandler(selectorOne, CommandHandler.fromFunction(spyOne = jasmine.createSpy('spyOne').and.callFake(function() {
			return resultOne;
		})));
		commandHandler.addCommandHandler(selectorTwo, CommandHandler.fromFunction(spyTwo = jasmine.createSpy('spyTwo').and.callFake(function() {
			return resultTwo;
		})));
	});

	describe('and the command is process with data for the first handler', function() {
		var commandData;
		var commandResult;

		beforeEach(function() {
			commandResult = commandHandler.process(commandData = {commandType: selectorOne});
		});

		it('should invoke wrapped function for the first handler', function() {
			expect(spyOne).toHaveBeenCalledWith(commandData);
		});

		it('should return the result from the first handler', function() {
			expect(commandResult).toEqual(resultOne);
		});

		it('should not invoke wrapped function for the secoond handler', function() {
			expect(spyTwo).not.toHaveBeenCalledWith(commandData);
		});
	});

	describe('and the command is process with data for the second handler', function() {
		var commandData;
		var commandResult;

		beforeEach(function() {
			commandResult = commandHandler.process(commandData = {commandType: selectorTwo});
		});

		it('should invoke wrapped function for the second handler', function() {
			expect(spyTwo).toHaveBeenCalledWith(commandData);
		});

		it('should return the result from the second handler', function() {
			expect(commandResult).toEqual(resultTwo);
		});

		it('should not invoke wrapped function for the first handler', function() {
			expect(spyOne).not.toHaveBeenCalledWith(commandData);
		});
	});
});