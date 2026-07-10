import fs from 'node:fs';
import path from 'node:path';

import esbuild from 'esbuild';

const packageRoot = process.cwd();
const specsDirectory = path.join(packageRoot, 'test', 'specs');
const outfile = path.join(packageRoot, 'test', 'SpecRunner.js');

function walk(directory) {
	if (!fs.existsSync(directory)) {
		return [ ];
	}

	return fs.readdirSync(directory, { withFileTypes: true })
		.flatMap((entry) => {
			const entryPath = path.join(directory, entry.name);

			if (entry.isDirectory()) {
				return walk(entryPath);
			}

			return path.extname(entryPath) === '.js' ? [ entryPath ] : [ ];
		});
}

const entryPoints = walk(specsDirectory)
	.sort()
	.map((file) => {
		const relativePath = './' + path.relative(packageRoot, file).replaceAll(path.sep, '/');

		return `import ${JSON.stringify(relativePath)};`;
	})
	.join('\n');

await esbuild.build({
	bundle: true,
	format: 'iife',
	outfile,
	platform: 'browser',
	stdin: {
		contents: entryPoints,
		resolveDir: packageRoot,
		sourcefile: 'test/specs/index.js'
	}
});

const bundle = fs.readFileSync(outfile, 'utf8');

fs.writeFileSync(outfile, bundle.replace(/[ \t]+$/gm, ''));
