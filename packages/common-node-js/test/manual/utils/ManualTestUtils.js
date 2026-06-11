const crypto = require('crypto');
const readline = require('readline');

function env(name, defaultValue) {
	const value = process.env[name];

	if (value === undefined || value === null || value.length === 0) {
		return defaultValue;
	}

	return value;
}

function requireEnv(name) {
	const value = env(name, null);

	if (value === null) {
		throw new Error(`Missing required environment variable [ ${name} ]`);
	}

	return value;
}

function region() {
	return env('AWS_REGION', env('AWS_DEFAULT_REGION', 'us-east-1'));
}

function prefix() {
	return env('AWS_TEST_PREFIX', `common-node-js-manual-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`);
}

function value(name, defaultValue) {
	return env(name, defaultValue);
}

function section(name) {
	console.log(`\n--- ${name} ---`);
}

function assert(condition, message) {
	if (!condition) {
		throw new Error(`Manual test assertion failed: ${message}`);
	}
}

function assertArray(value, message) {
	assert(Array.isArray(value), message);
}

function assertObject(value, message) {
	assert(value !== null && typeof value === 'object' && !Array.isArray(value), message);
}

function assertString(value, message) {
	assert(typeof value === 'string' && value.length > 0, message);
}

function assertEqual(actual, expected, message) {
	assert(actual === expected, `${message}. Expected [ ${expected} ], got [ ${actual} ]`);
}

function assertIncludes(values, expected, message) {
	assertArray(values, message);

	assert(values.includes(expected), `${message}. Expected array to include [ ${expected} ]`);
}

async function step(name, callback) {
	section(name);

	const result = await callback();

	if (result !== undefined) {
		console.log(result);
	}

	return result;
}

function pauseBeforeCleanup(message) {
	if (env('PAUSE_BEFORE_CLEANUP', 'false') !== 'true') {
		return Promise.resolve();
	}

	return new Promise((resolve) => {
		const prompt = message || 'Manual verification pause before cleanup. Press Enter to continue cleanup.';

		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});

		rl.question(`\n${prompt}\n`, () => {
			rl.close();
			resolve();
		});
	});
}

async function cleanup(name, callback) {
	try {
		await callback();

		console.log(`Cleanup complete: ${name}`);
	} catch (error) {
		console.warn(`Cleanup failed: ${name}`);
		console.warn(error);
	}
}

function sleep(milliseconds) {
	return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function run(name, callback) {
	try {
		section(name);

		await callback();

		console.log(`\n${name} complete`);
	} catch (error) {
		console.error(`\n${name} failed`);
		console.error(error);

		process.exitCode = 1;
	}
}

module.exports = {
	assert,
	assertArray,
	assertEqual,
	assertIncludes,
	assertObject,
	assertString,
	cleanup,
	env: value,
	pauseBeforeCleanup,
	prefix,
	region,
	requireEnv,
	run,
	section,
	sleep,
	step
};
