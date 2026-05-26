const EvictingList = require('./../../../../collections/specialized/EvictingList');

describe('When an EvictingList is constructed (with no capacity)', () => {
	'use strict';

	let list;

	beforeEach(() => {
		list = new EvictingList();
	});

	it('should be empty', () => {
		expect(list.empty()).toEqual(true);
	});

	it('should have a capacity of 10', () => {
		expect(list.getCapacity()).toEqual(10);
	});

	describe('when dumped to an array', () => {
		let array;

		beforeEach(() => {
			array = list.toArray();
		});

		it('should be empty',() => {
			expect(array.length).toEqual(0);
		});
	});
});

describe('When an EvictingList is constructed (with a capacity of 1)', () => {
	'use strict';

	let list;

	beforeEach(() => {
		list = new EvictingList(1);
	});

	it('should be empty', () => {
		expect(list.empty()).toEqual(true);
	});

	it('should have a capacity of 1', () => {
		expect(list.getCapacity()).toEqual(1);
	});

	describe('when dumped to an array', () => {
		let array;

		beforeEach(() => {
			array = list.toArray();
		});

		it('should be empty',() => {
			expect(array.length).toEqual(0);
		});
	});

	describe('when the an item is added to the list', () => {
		let a;

		beforeEach(() => {
			list.add(a = { });
		});

		it('peek should return the item', () => {
			expect(list.peek()).toBe(a);
		});

		it('should not be empty',() => {
			expect(list.empty()).toEqual(false);
		});

		describe('when dumped to an array', () => {
			let array;

			beforeEach(() => {
				array = list.toArray();
			});

			it('should contain one item',() => {
				expect(array.length).toEqual(1);
			});

			it('the first item should be the item added',() => {
				expect(array[0]).toEqual(a);
			});
		});

		describe('when a second item is added to the list', () => {
			let b;

			beforeEach(() => {
				list.add(b = { });
			});

			it('should not be empty',() => {
				expect(list.empty()).toEqual(false);
			});

			it('peek should return the second item', () => {
				expect(list.peek()).toBe(b);
			});

			describe('when dumped to an array', () => {
				let array;

				beforeEach(() => {
					array = list.toArray();
				});

				it('should contain one item',() => {
					expect(array.length).toEqual(1);
				});

				it('the first item in the array should be the most recent item',() => {
					expect(array[0]).toBe(b);
				});
			});
		});
	});
});

describe('When an EvictingList is constructed (with a capacity of 3)', () => {
	'use strict';

	let list;

	beforeEach(() => {
		list = new EvictingList(3);
	});

	it('should be empty', () => {
		expect(list.empty()).toEqual(true);
	});

	it('should have a capacity of 3', () => {
		expect(list.getCapacity()).toEqual(3);
	});

	describe('and five items are added to the list', () => {
		let a;
		let b;
		let c;
		let d;
		let e;

		beforeEach(() => {
			list.add(a = { });
			list.add(b = { });
			list.add(c = { });
			list.add(d = { });
			list.add(e = { });
		});

		it('should not be empty',() => {
			expect(list.empty()).toEqual(false);
		});

		describe('when dumped to an array', () => {
			let array;

			beforeEach(() => {
				array = list.toArray();
			});

			it('should contain three items',() => {
				expect(array.length).toEqual(3);
			});

			it('the first item should be the most recent item added',() => {
				expect(array[0]).toBe(e);
			});

			it('the second item should be the second most recent item added',() => {
				expect(array[1]).toBe(d);
			});

			it('the third item should be the third most recent item addedd',() => {
				expect(array[2]).toBe(c);
			});
		});

		describe('and 100 more items are added to the list', () => {
			let items = [ ];

			beforeEach(() => {
				for (let i = 0; i < 100; i++) {
					list.add(items[i] = { });
				}
			});

			describe('when dumped to an array', () => {
				let array;

				beforeEach(() => {
					array = list.toArray();
				});

				it('should contain three items',() => {
					expect(array.length).toEqual(3);
				});

				it('the first item should be the most recent item added',() => {
					expect(array[0]).toBe(items[99]);
				});

				it('the second item should be the second most recent item added',() => {
					expect(array[1]).toBe(items[98]);
				});

				it('the third item should be the third most recent item addedd',() => {
					expect(array[2]).toBe(items[97]);
				});
			});
		});
	});
});