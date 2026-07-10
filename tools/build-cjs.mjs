import fs from 'node:fs';
import path from 'node:path';

import { transformSync } from 'esbuild';

const packageRoot = process.cwd();
const distDirectory = path.join(packageRoot, 'dist');
const cjsDirectory = path.join(distDirectory, 'cjs');
const sourceExtension = '.js';
const defaultExportFooter = `
{
	const cjsExports = module.exports;
	const cjsDefaultExport = cjsExports && cjsExports.__esModule ? cjsExports.default : cjsExports;

	if (cjsDefaultExport && (typeof cjsDefaultExport === 'function' || typeof cjsDefaultExport === 'object')) {
		Object.keys(cjsExports).forEach((key) => {
			if (key !== 'default' && key !== '__esModule') {
				cjsDefaultExport[key] = cjsExports[key];
			}
		});
	}

	module.exports = cjsDefaultExport;
}
`;

const ignoredDirectories = new Set([
	'dist',
	'node_modules',
	'test',
	'types'
]);

const ignoredFiles = new Set([
	'eslint.config.js'
]);

function sourceFileEligible(filePath) {
	const relativePath = path.relative(packageRoot, filePath);
	const segments = relativePath.split(path.sep);

	if (segments.some((segment) => ignoredDirectories.has(segment))) {
		return false;
	}

	if (ignoredFiles.has(path.basename(filePath))) {
		return false;
	}

	return path.extname(filePath) === sourceExtension;
}

function walk(directory) {
	return fs.readdirSync(directory, { withFileTypes: true })
		.flatMap((entry) => {
			const entryPath = path.join(directory, entry.name);

			if (entry.isDirectory()) {
				if (ignoredDirectories.has(entry.name)) {
					return [ ];
				}

				return walk(entryPath);
			}

			return sourceFileEligible(entryPath) ? [ entryPath ] : [ ];
		});
}

function ensureDirectory(filePath) {
	fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function hasDefaultExport(source) {
	return /(^|\n)\s*export\s+default\b/.test(source) || /(^|\n)\s*export\s*\{[^}]*\bas\s+default\b[^}]*\}/.test(source);
}

function buildFile(sourceFile) {
	const relativePath = path.relative(packageRoot, sourceFile);
	const cjsFile = path.join(cjsDirectory, relativePath);
	const source = fs.readFileSync(sourceFile, 'utf8');
	const result = transformSync(source, {
		footer: hasDefaultExport(source) ? defaultExportFooter : '',
		format: 'cjs',
		loader: 'js',
		logLevel: 'silent',
		sourcefile: sourceFile,
		sourcemap: false,
		target: 'node20'
	});

	ensureDirectory(cjsFile);

	fs.writeFileSync(cjsFile, result.code + '\n');
}

fs.rmSync(distDirectory, { recursive: true, force: true });

walk(packageRoot).forEach(buildFile);

fs.writeFileSync(path.join(cjsDirectory, 'package.json'), JSON.stringify({ type: 'commonjs' }, null, 2) + '\n');
