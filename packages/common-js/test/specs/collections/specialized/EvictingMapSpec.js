const EvictingMap = require('./../../../../collections/specialized/EvictingMap');

describe('When an EvictingMap is constructed (with no capacity)', () => {
	'use strict';

	let map;

	beforeEach(() => {
		map = new EvictingMap();
	});

	it('should be empty', () => {
		expect(map.empty()).toEqual(true);
	});

	it('should have a capacity of 10', () => {
		expect(map.getCapacity()).toEqual(10);
	});
});

describe('When an EvictingMap is constructed (with a capacity of 1)', () => {
	'use strict';

	let map;

	beforeEach(() => {
		map = new EvictingMap(1);
	});

	it('should be empty', () => {
		expect(map.empty()).toEqual(true);
	});

	it('should have a capacity of 1', () => {
		expect(map.getCapacity()).toEqual(1);
	});

	describe('when an item is added to the map', () => {
		let a;

		beforeEach(() => {
			a = { key: 'a' };

			map.put(a.key, a);
		});

		it('get should return the item', () => {
			expect(map.get(a.key)).toBe(a);
		});

		it('should not be empty',() => {
			expect(map.empty()).toEqual(false);
		});

		it('should have one item',() => {
			expect(map.getSize()).toEqual(1);
		});

		describe('when a second item is added to the map', () => {
			let b;

			beforeEach(() => {
				b = { key: 'b' };

				map.put(b.key, b);
			});

			it('get should return the second item', () => {
				expect(map.get(b.key)).toBe(b);
			});

			it('get should not return the first item', () => {
				expect(map.get(a.key)).toEqual(null);
			});

			it('should not be empty',() => {
				expect(map.empty()).toEqual(false);
			});

			it('should have one item',() => {
				expect(map.getSize()).toEqual(1);
			});

			describe('when a third item is added to the map', () => {
				let c;

				beforeEach(() => {
					c = { key: 'c' };

					map.put(c.key, c);
				});

				it('get should return the third item', () => {
					expect(map.get(c.key)).toBe(c);
				});

				it('get should not return the first item', () => {
					expect(map.get(a.key)).toEqual(null);
				});

				it('get should not return the second item', () => {
					expect(map.get(b.key)).toEqual(null);
				});

				it('should not be empty',() => {
					expect(map.empty()).toEqual(false);
				});

				it('should have one item',() => {
					expect(map.getSize()).toEqual(1);
				});
			});
		});

		describe('when the first item is removed from the map', () => {
			beforeEach(() => {
				map.remove('a');
			});

			it('should be empty',() => {
				expect(map.empty()).toEqual(true);
			});

			it('should have zero items',() => {
				expect(map.getSize()).toEqual(0);
			});

			describe('when the item is added to the map again', () => {
				beforeEach(() => {
					map.put(a.key, a);
				});

				it('get should return the item', () => {
					expect(map.get(a.key)).toBe(a);
				});

				it('should not be empty',() => {
					expect(map.empty()).toEqual(false);
				});

				it('should have one item',() => {
					expect(map.getSize()).toEqual(1);
				});
			});
		});
	});
});

describe('When an EvictingMap is constructed (with a capacity of 3)', () => {
	'use strict';

	let map;

	beforeEach(() => {
		map = new EvictingMap(3);
	});

	it('should be empty', () => {
		expect(map.empty()).toEqual(true);
	});

	it('should have a capacity of 3', () => {
		expect(map.getCapacity()).toEqual(3);
	});

	describe('when three items are added to the map', () => {
		let a;
		let b;
		let c;

		beforeEach(() => {
			a = { key: 'a' };
			b = { key: 'b' };
			c = { key: 'c' };

			map.put(a.key, a);
			map.put(b.key, b);
			map.put(c.key, c);
		});

		it('get "a" should return the first item', () => {
			expect(map.get(a.key)).toBe(a);
		});

		it('get "b" should return the second item', () => {
			expect(map.get(b.key)).toBe(b);
		});

		it('get "c" should return the third item', () => {
			expect(map.get(c.key)).toBe(c);
		});

		it('should not be empty',() => {
			expect(map.empty()).toEqual(false);
		});

		it('should have three items',() => {
			expect(map.getSize()).toEqual(3);
		});

		describe('when a fourth item is added to the map', () => {
			let d;

			beforeEach(() => {
				d = { key: 'd' };

				map.put(d.key, d);
			});

			it('get "a" should not return the first item', () => {
				expect(map.get(a.key)).toEqual(null);
			});

			it('get "b" should return the second item', () => {
				expect(map.get(b.key)).toBe(b);
			});

			it('get "c" should return the third item', () => {
				expect(map.get(c.key)).toBe(c);
			});

			it('get "d" should return the fourth item', () => {
				expect(map.get(d.key)).toBe(d);
			});

			it('should not be empty',() => {
				expect(map.empty()).toEqual(false);
			});

			it('should have three items',() => {
				expect(map.getSize()).toEqual(3);
			});

			describe('after getting item "b" from map', () => {
				beforeEach(() => {
					map.get(b.key);
				});

				describe('when a fifth item is added to the list', () => {
					let e;

					beforeEach(() => {
						e = { key: 'e' };

						map.put(e.key, e);
					});

					it('get "a" should not return the first item', () => {
						expect(map.get(a.key)).toEqual(null);
					});

					it('get "b" should return the second item', () => {
						expect(map.get(b.key)).toBe(b);
					});

					it('get "c" should not return the third item', () => {
						expect(map.get(c.key)).toEqual(null);
					});

					it('get "d" should return the fourth item', () => {
						expect(map.get(d.key)).toBe(d);
					});

					it('get "e" should return the fifth item', () => {
						expect(map.get(e.key)).toBe(e);
					});

					it('should not be empty',() => {
						expect(map.empty()).toEqual(false);
					});

					it('should have three items',() => {
						expect(map.getSize()).toEqual(3);
					});
				});
			});
		});
	});
});


describe('When an EvictingMap is constructed', () => {
	'use strict';

	let map;

	beforeEach(() => {
		map = new EvictingMap(3);
	});

	describe('and used in a write-read-write pattern', () => {
		let a;
		let b;
		let c;
		let x;
		let y;

		beforeEach(() => {
			a = {key: 'a'};
			b = {key: 'b'};
			c = {key: 'c'};
			x = {key: 'x'};
			y = {key: 'y'};

			map.put(a.key, a);
			map.put(b.key, b);
			map.put(c.key, c);

			map.get(c.key);
			map.get(a.key);
			map.get(c.key);

			map.put(a.key, a);
			map.put(b.key, b);
			map.put(c.key, c);

			map.put(x.key, x);
			map.put(y.key, y);
		});

		it('get "a" should not return the first item', () => {
			expect(map.get(a.key)).toEqual(null);
		});

		it('get "b" should not return the second item', () => {
			expect(map.get(b.key)).toEqual(null);
		});

		it('get "c" should return the third item', () => {
			expect(map.get(c.key)).toBe(c);
		});

		it('get "x" should return the fourth item', () => {
			expect(map.get(x.key)).toBe(x);
		});

		it('get "y" should return the fourth item', () => {
			expect(map.get(y.key)).toBe(y);
		});

		it('should not be empty',() => {
			expect(map.empty()).toEqual(false);
		});

		it('should have three items',() => {
			expect(map.getSize()).toEqual(3);
		});
	});
});