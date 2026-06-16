import * as assert from './assert.js';
import * as is from './is.js';

export function getEmpty() {
	return 0;
}

export function add(existing, itemToAdd) {
	assert.argumentIsRequired(existing, 'existing', Number);
	assert.argumentIsRequired(itemToAdd, 'itemToAdd', Number);

	if (checkItem(itemToAdd)) {
		return existing | itemToAdd;
	} else {
		return existing;
	}
}

export function remove(existing, itemToRemove) {
	assert.argumentIsRequired(existing, 'existing', Number);
	assert.argumentIsRequired(itemToRemove, 'itemToRemove', Number);

	if (checkItem(itemToRemove)) {
		return existing & ~itemToRemove;
	} else {
		return existing;
	}
}

export function has(existing, itemToCheck) {
	assert.argumentIsRequired(existing, 'existing', Number);
	assert.argumentIsRequired(itemToCheck, 'itemToCheck', Number);

	return checkItem(itemToCheck) && (existing & itemToCheck) === itemToCheck;
}

export function checkItem(itemToCheck) {
	return is.number(itemToCheck) && (itemToCheck === 0 || ((itemToCheck & (~itemToCheck + 1)) === itemToCheck));
}
