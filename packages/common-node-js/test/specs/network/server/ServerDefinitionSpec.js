import ServerDefinition from './../../../../network/server/ServerDefinition.js';

describe('When a ServerDefinition is created', () => {
	'use strict';

	let serverDefinition;

	beforeEach(() => {
		serverDefinition = new ServerDefinition();
	});

	it('should have no containers', () => {
		expect(serverDefinition.getContainers().length).toEqual(0);
	});
});