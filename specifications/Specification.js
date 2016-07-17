module.exports = (() => {
	class Specification {
		constructor() {

		}

		evaluate(data) {
			return this._evaluate(data);
		}

		_evaluate(data) {
			return false;
		}

		toString() {
			return '[Specification]';
		}
	}

	return Specification;
})();