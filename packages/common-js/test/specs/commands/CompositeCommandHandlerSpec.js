import CommandHandler from './../../../commands/CommandHandler.js';
import CompositeCommandHandler from './../../../commands/CompositeCommandHandler.js';

describe('When a CompositeCommandHandler is created', () => {
	'use strict';

	let commandHandler;
	let spyOne;
	let spyTwo;

	let resultOne;
	let resultTwo;

	beforeEach(() => {
		resultOne = true;
		resultTwo = true;

		commandHandler = new CompositeCommandHandler
		(
			CommandHandler.fromFunction(spyOne = jasmine.createSpy('spyOne').and.callFake(() => {
				return resultOne;
			})),

			CommandHandler.fromFunction(spyTwo = jasmine.createSpy('spyTwo').and.callFake(() => {
				return resultTwo;
			}))
		);
	});

	describe('and the command is executed', () => {
		let commandData;
		let commandResult;

		beforeEach(() => {
			commandResult = commandHandler.process(commandData = {});
		});

		it('should invoke the wrapped functions', () => {
			expect({
				spyOne: spyOne.calls.allArgs(),
				spyTwo: spyTwo.calls.allArgs()
			}).toEqual({
				spyOne: [ [ commandData ] ],
				spyTwo: [ [ commandData ] ]
			});
		});
	});

	describe('and the command is executed, but the first command fails', () => {
		let commandData;
		let commandResult;

		beforeEach(() => {
			resultOne = false;
			resultTwo = false;

			commandResult = commandHandler.process(commandData = {});
		});

		it('should invoke the first command', () => {
			expect(spyOne).toHaveBeenCalledWith(commandData);
		});

		it('should not invoke the first command', () => {
			expect(spyTwo).not.toHaveBeenCalledWith(commandData);
		});
	});
});
