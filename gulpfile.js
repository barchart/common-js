const gulp = require('gulp');

const babelify = require('babelify'),
	browserify = require('browserify'),
	buffer = require('vinyl-buffer'),
	bump = require('gulp-bump'),
	exec = require('child_process').exec,
	git = require('gulp-git'),
	gitStatus = require('git-get-status'),
	glob = require('glob'),
	jasmine = require('gulp-jasmine'),
	jshint = require('gulp-jshint'),
	rename = require('gulp-rename'),
	runSequence = require('run-sequence'),
	source = require('vinyl-source-stream'),
	util = require('gulp-util');

const fs = require('fs');

function getVersionFromPackage() {
    return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
}

gulp.task('ensure-clean-working-directory', () => {
	gitStatus(function(err, status) {
		if (err, !status.clean) {
			throw new Error('Unable to proceed, your working directory is not clean.');
		}
	});
});

gulp.task('bump-version', () => {
    return gulp.src([ './package.json' ])
        .pipe(bump({ type: 'patch' }).on('error', util.log))
        .pipe(gulp.dest('./'));
});

gulp.task('document', function (cb) {
	exec('jsdoc . -c jsdoc.json -r -d docs', (error, stdout, stderr) => {
		console.log(stdout);
		console.log(stderr);

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

    git.tag(version, 'Release ' + version, function (error) {
        if (error) {
            return cb(error);
        }

        git.push('origin', 'master', { args: '--tags' }, cb);
    });
});

gulp.task('build-test-bundle', () => {
	return browserify({ entries: glob.sync('test/specs/**/*.js') })
		.bundle()
		.pipe(source('SpecRunner.js'))
		.pipe(buffer())
		.pipe(gulp.dest('test'));
});

gulp.task('execute-browser-tests', () => {
    return gulp.src('test/SpecRunner.js')
        .pipe(jasmine());
});

gulp.task('execute-node-tests', () => {
    return gulp.src(['test/specs/**/*.js'])
        .pipe(jasmine());
});

gulp.task('execute-tests', (cb) => {
    runSequence(
        'build-test-bundle',
        'execute-browser-tests',
        'execute-node-tests',

        function (error) {
            if (error) {
                console.log(error.message);
            }

            cb(error);
        });
});

gulp.task('release', (cb) => {
    runSequence(
        'ensure-clean-working-directory',
        'execute-tests',
		'document',
        'bump-version',
        'commit-changes',
        'push-changes',
        'create-tag',

        function (error) {
            if (error) {
                console.log(error.message);
            } else {
                console.log('Release complete');
            }

            cb(error);
        });
});

gulp.task('lint', () => {
    return gulp.src([ './**/*.js', './test/specs/**/*.js', '!./node_modules/**', '!./docs/**', '!./test/SpecRunner.js' ])
        .pipe(jshint({'esversion': 6}))
        .pipe(jshint.reporter('default'));
});

gulp.task('test', [ 'execute-tests' ]);

gulp.task('default', [ 'lint' ]);