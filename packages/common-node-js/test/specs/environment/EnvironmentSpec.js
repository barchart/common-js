import Environment from './../../../environment/Environment.js';

describe('When environment values are used', () => {
	'use strict';

	let argv;

	beforeEach(() => {
		argv = process.argv;
	});

	afterEach(() => {
		process.argv = argv;
	});

	it('should return environment metadata and cloned configuration', () => {
		const configuration = {
			server: {
				path: '/tmp/app'
			}
		};
		const environment = new Environment('production', configuration, '1.2.3');
		const clone = environment.getConfiguration();

		clone.server.path = '/changed';

		expect({
			name: environment.getName(),
			version: environment.getVersion(),
			production: environment.getIsProduction(),
			configuration: environment.getConfiguration()
		}).toEqual({
			name: 'production',
			version: '1.2.3',
			production: true,
			configuration: {
				server: {
					path: '/tmp/app'
				}
			}
		});
	});

	it('should parse process argument key value pairs', () => {
		process.argv = [ 'node', 'app.js', '-env', 'dev', '-debug', '-port', '8080' ];

		expect(Environment.parseProcessArguments()).toEqual({
			env: 'dev',
			port: '8080'
		});
	});

	it('should require initialization before reading singleton instance', () => {
		expect(() => Environment.getInstance()).toThrow();
	});
});
