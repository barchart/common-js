import crypto from 'crypto';
import readline from 'readline';

export function env(name, defaultValue) {
	const value = process.env[name];

	if (value === undefined || value === null || value.length === 0) {
		return defaultValue;
	}

	return value;
}

export function requireEnv(name) {
	const value = env(name, null);

	if (value === null) {
		throw new Error(`Missing required environment variable [ ${name} ]`);
	}

	return value;
}

export function region() {
	return env('AWS_REGION', env('AWS_DEFAULT_REGION', 'us-east-1'));
}

export function prefix() {
	return env('AWS_TEST_PREFIX', `common-node-js-manual-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`);
}

export function value(name, defaultValue) {
	return env(name, defaultValue);
}

export function section(name) {
	console.log(`\n--- ${name} ---`);
}

export function assert(condition, message) {
	if (!condition) {
		throw new Error(`Manual test assertion failed: ${message}`);
	}
}

export function assertArray(value, message) {
	assert(Array.isArray(value), message);
}

export function assertObject(value, message) {
	assert(value !== null && typeof value === 'object' && !Array.isArray(value), message);
}

export function assertString(value, message) {
	assert(typeof value === 'string' && value.length > 0, message);
}

export function assertEqual(actual, expected, message) {
	assert(actual === expected, `${message}. Expected [ ${expected} ], got [ ${actual} ]`);
}

export function assertIncludes(values, expected, message) {
	assertArray(values, message);

	assert(values.includes(expected), `${message}. Expected array to include [ ${expected} ]`);
}

export async function step(name, callback) {
	section(name);

	const result = await callback();

	if (result !== undefined) {
		console.log(result);
	}

	return result;
}

export function pauseBeforeCleanup(message) {
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

export async function cleanup(name, callback) {
	try {
		await callback();

		console.log(`Cleanup complete: ${name}`);
	} catch (error) {
		console.warn(`Cleanup failed: ${name}`);
		console.warn(error);
	}
}

export function sleep(milliseconds) {
	return new Promise(resolve => setTimeout(resolve, milliseconds));
}

export async function run(name, callback) {
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

