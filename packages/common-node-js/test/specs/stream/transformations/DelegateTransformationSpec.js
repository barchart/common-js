const DelegateTransformation = require('./../../../../stream/transformations/DelegateTransformation');

describe('When a DelegateTransformation is created', () => {
	'use strict';

	describe('targeting the "letter" property', () => {
		describe('with a "canTransform" delegate that always succeeds', () => {
			let transformation;

			let canTransform;
			let transform;
			let output;

			beforeEach(() => {
				canTransform = jasmine.createSpy('canTransform').and.returnValue(true);
				transform = jasmine.createSpy('transform').and.returnValue(output = { });

				transformation = new DelegateTransformation(transform, canTransform, false);
			});

			describe('and the transformation is checked', () => {
				let target;
				let result;

				beforeEach(() => {
					result = transformation.canTransform(target = { });
				});

				it('should invoke the "canTransform" with the target', () => {
					expect(canTransform).toHaveBeenCalledWith(target);
				});

				it('should evaluate to true', () => {
					expect(result).toEqual(true);
				});
			});

			describe('and the transformation is invoked', () => {
				let target;
				let result;

				beforeEach(() => {
					result = transformation.transform(target = { });
				});

				it('should invoke the "transform" with the target', () => {
					expect(canTransform).toHaveBeenCalledWith(target);
				});

				it('should return the result of the "transform" delegate', () => {
					expect(result).toBe(output);
				});
			});
		});
	});
});