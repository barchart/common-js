var CommandHandler = require('./../../../commands/CommandHandler');
var CompositeCommandHandler = require('./../../../commands/CompositeCommandHandler');

describe('When a CompositeCommandHandler is created', function() {
	'use strict';

	var commandHandler;
	var spyOne;
	var spyTwo;

	var resultOne;
	var resultTwo;

	beforeEach(function() {
		resultOne = true;
		resultTwo = true;

		commandHandler = new CompositeCommandHandler
		(
			CommandHandler.fromFunction(spyOne = jasmine.createSpy('spyOne').and.callFake(function() {
				return resultOne;
			})),
			CommandHandler.fromFunction(spyTwo = jasmine.createSpy('spyTwo').and.callFake(function() {
				return resultTwo;
			}))
		);
	});

	describe('and the command is executed', function() {
		var commandData;
		var commandResult;

		beforeEach(function() {
			commandResult = commandHandler.process(commandData = {});
		});

		it('should invoke the wrapped functions', function() {
			expect(spyOne).toHaveBeenCalledWith(commandData);
			expect(spyTwo).toHaveBeenCalledWith(commandData);
		});
	});

	describe('and the command is executed, but the first command fails', function() {
		var commandData;
		var commandResult;

		beforeEach(function() {
			resultOne = false;
			resultTwo = false;

			commandResult = commandHandler.process(commandData = {});
		});

		it('should invoke the first command', function() {
			expect(spyOne).toHaveBeenCalledWith(commandData);
		});

		it('should not invoke the first command', function() {
			expect(spyTwo).not.toHaveBeenCalledWith(commandData);
		});
	});
});