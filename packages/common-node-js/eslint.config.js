import js from '@eslint/js';
import globals from 'globals';

export default [
	{
		ignores: [
			'node_modules/**',
			'dist/**',
			'test/dist/**',
			'types/**'
		]
	},
	js.configs.recommended,
	{
		files: ['**/*.js'],
		ignores: ['test/specs/**'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: globals.node
		},
		rules: {
			'no-empty': 'warn',
			'no-prototype-builtins': 'warn',
			'no-useless-escape': 'warn',
			'no-unused-vars': 'warn'
		}
	},
	{
		files: ['test/specs/**/*.js'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.node,
				...globals.jasmine
			}
		},
		rules: {
			'no-empty': 'off',
			'no-prototype-builtins': 'off',
			'no-useless-escape': 'off',
			'no-unused-vars': 'off'
		}
	}
];
