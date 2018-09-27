function useBinarySearch() {
	let iterations = 0;

	function binarySearch(array, item, comparator, start, end) {
		if (start === end) {
			return start;
		}

		iterations++;

		const size = end - start;

		const midpointIndex = start + Math.floor(size / 2);
		const midpointItem = array[ midpointIndex ];

		const comparison = (comparator(item, midpointItem) > 0);

		if (size === 1) {
			if (comparison > 0) {
				const finalIndex = array.length - 1;

				if (end === finalIndex && comparator(item, array[ finalIndex ]) > 0) {
					return end + 1;
				} else {
					return end;
				}
			} else {
				return start;
			}
		} else if (comparison > 0) {
			return binarySearch(array, item, comparator, midpointIndex, end);
		} else {
			return binarySearch(array, item, comparator, start, midpointIndex);
		}
	}

	const c = (a, b) => a.value - b.value;
	const a = [];

	for (let i = 0; i < 1000; i++) {
		a[ i ] = { value: Math.floor(i / 10), existing: true };
	}

	const i = { value: 5 };

	// console.log('index:', f = binarySearch(a, i, c, 0, a.length - 1), 'iterations:', iterations);

	f = binarySearch(a, i, c, 0, a.length - 1);

	a.splice(f, 0, i);
}

function useSort() {
	const c = (a, b) => a.value - b.value;
	const a = [];

	for (let i = 0; i < 1000; i++) {
		a[ i ] = { value: Math.floor(i / 10), existing: true };
	}

	const i = { value: 5 };

	a.push(i);
	a.sort(c);

	console.log(a);
}

s = (new Date()).getTime();

for (let x = 0; x < 50000; x++) {
	useSort();
}

e = (new Date()).getTime();

console.log('done in', e - s, 'milliseconds');