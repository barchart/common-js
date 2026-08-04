import js from '@eslint/js';
import globals from 'globals';

export default [
	{
		ignores: [
			'**/node_modules/**',
			'packages/*/dist/**',
			'packages/*/test/SpecRunner.js',
			'packages/*/test/dist/**',
			'packages/*/types/**'
		]
	},
	js.configs.recommended,
	{
		files: [
			'packages/common-js/**/*.js',
			'packages/common-market-js/**/*.js'
		],
		ignores: ['**/test/specs/**'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.node,
				...globals.browser
			}
		},
		rules: {
			'no-empty': 'off',
			'no-prototype-builtins': 'warn',
			'no-useless-escape': 'warn',
			'no-unused-vars': 'off'
		}
	},
	{
		files: ['packages/common-node-js/**/*.js'],
		ignores: ['**/test/specs/**'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: globals.node
		},
		rules: {
			'no-empty': 'off',
			'no-prototype-builtins': 'warn',
			'no-useless-escape': 'warn',
			'no-unused-vars': 'off'
		}
	},
	{
		files: ['packages/*/test/specs/**/*.js'],
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
