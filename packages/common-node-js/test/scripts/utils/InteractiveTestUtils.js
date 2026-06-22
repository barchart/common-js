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
	return env('AWS_TEST_PREFIX', `common-node-js-interactive-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`);
}

export function value(name, defaultValue) {
	return env(name, defaultValue);
}

export function section(name) {
	console.log(`\n--- ${name} ---`);
}

export async function step(name, callback) {
	section(name);

	const result = await callback();

	if (result !== undefined) {
		console.log(result);
	}

	return result;
}

export async function pauseBeforeCleanup(message) {
	if (env('PAUSE_BEFORE_CLEANUP', 'false') !== 'true') {
		return;
	}

	return new Promise((resolve) => {
		const prompt = message || 'interactive verification pause before cleanup. Press Enter to continue cleanup.';

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
