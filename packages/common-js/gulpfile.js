import { exec } from 'node:child_process';
import fs from 'node:fs';

import babelify from 'babelify';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import git from 'gulp-git';
import gitStatus from 'git-get-status';
import gulp from 'gulp';
import { globSync } from 'glob';
import prompt from 'gulp-prompt';
import source from 'vinyl-source-stream';

let bump;

function getVersionFromPackage() {
	return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
}

gulp.task('ensure-clean-working-directory', (cb) => {
	gitStatus((error, status) => {
		if (error) {
			return cb(error);
		}

		if (!status.clean) {
			return cb(new Error('Unable to proceed, your working directory is not clean.'));
		}

		cb();
	});
});

gulp.task('bump-choice', (cb) => {
	const processor = prompt.prompt({
		type: 'list',
		name: 'bump',
		message: 'What type of bump would you like to do?',
		choices: ['patch', 'minor', 'major'],
	}, (result) => {
		bump = result.bump;

		return cb();
	});

	return gulp.src(['./package.json']).pipe(processor);
});

gulp.task('bump-version', (cb) => {
	exec(`npm version ${bump || 'patch'} --no-git-tag-version`, {
		cwd: './'
	}, (error) => {
		if (error) {
			return cb(error);
		}

		cb();
	});
});

gulp.task('commit-changes', () => {
	return gulp.src([ './', './test/', './package.json' ])
		.pipe(git.add())
		.pipe(git.commit('Release. Bump version number'));
});

gulp.task('push-changes', (cb) => {
	git.push('origin', 'master', cb);
});

gulp.task('create-tag', (cb) => {
	const version = getVersionFromPackage();

	git.tag(version, 'Release ' + version, (error) => {
		if (error) {
			return cb(error);
		}

		git.push('origin', 'master', { args: '--tags' }, cb);
	});
});

gulp.task('build-test-bundle', () => {
	return browserify({ entries: globSync('test/specs/**/*.js') })
		.transform(babelify.configure({
			presets: [[ '@babel/preset-env', { modules: 'commonjs' } ]]
		}))
		.bundle()
		.pipe(source('SpecRunner.js'))
		.pipe(buffer())
		.pipe(gulp.dest('test'));
});

gulp.task('execute-browser-tests', (cb) => {
	cb();
});

gulp.task('execute-node-tests', (cb) => {
	exec('npm test', { cwd: './' }, (error) => {
		if (error) {
			return cb(error);
		}

		cb();
	});
});

gulp.task('execute-tests', gulp.series(
	'build-test-bundle',
	'execute-browser-tests',
	'execute-node-tests')
);

gulp.task('release', gulp.series(
	'ensure-clean-working-directory',
	'execute-tests',
	'bump-choice',
	'bump-version',
	'commit-changes',
	'push-changes',
	'create-tag')
);

gulp.task('lint', (cb) => {
	exec('eslint .', { cwd: './' }, (error) => {
		if (error) {
			return cb(error);
		}

		cb();
	});
});

gulp.task('test', gulp.series('execute-tests'));

gulp.task('default', gulp.series('lint'));
