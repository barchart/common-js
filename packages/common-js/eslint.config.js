import js from '@eslint/js';

const globals = {
	Buffer: 'readonly',
	clearInterval: 'readonly',
	clearTimeout: 'readonly',
	console: 'readonly',
	document: 'readonly',
	global: 'readonly',
	process: 'readonly',
	setInterval: 'readonly',
	setTimeout: 'readonly',
	window: 'readonly',

	afterAll: 'readonly',
	afterEach: 'readonly',
	beforeAll: 'readonly',
	beforeEach: 'readonly',
	describe: 'readonly',
	expect: 'readonly',
	fail: 'readonly',
	it: 'readonly',
	jasmine: 'readonly',
	spyOn: 'readonly'
};

export default [
	{
		ignores: [
			'node_modules/**',
			'test/SpecRunner.js',
			'types/**'
		]
	},
	js.configs.recommended,
	{
		files: [ '**/*.js' ],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals
		},
		rules: {
			'no-empty': 'off',
			'no-prototype-builtins': 'off',
			'no-undef': 'off',
			'no-unused-vars': 'off',
			'no-useless-escape': 'off'
		}
	}
];
