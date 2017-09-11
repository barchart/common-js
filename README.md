# barchart-common-js
## Common JavaScript classes, utilities, and functions

Utilities that can be used in a browser or Node.js environment.

Features include:

* Simple utilities (type checking, assertions, bit masking, etc)
* Data structures (decimals, days, enumerations, etc)
* Simple collections (queues, stacks, trees, etc)
* Specialized collections (priority queues, evicting lists, evicting maps, etc)
* Timing utilities (wrappers for setTimeout and setInterval)
* More

## Documentation

The code is documented with [JSDoc](http://usejsdoc.org/). While the output hasn't been committed to source control, you can generate the documentation by using the following commands:

    > npm install
    > gulp document

## Development

Gulp is used to check "linting" and to run unit tests.

    > nvm use 6.10.1
    > npm install
    > gulp lint
    > gulp test

## Build

Polyfills for ES6 are required:

* Promise

## License

This software is provided under the MIT license.