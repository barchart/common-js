# @barchart/common-js

A *public* library of shared JavaScript utilities. These utilities are agnostic to environment. They should be suitable for use in Node.js and web browsers.

### Overview

Features include:

* Simple utilities (type checking, assertions, bit masking, etc)
* Data structures (decimals, days, enumerations, etc)
* Simple collections (queues, stacks, trees, etc)
* Specialized collections (priority queues, evicting lists, evicting maps, etc)
* More...

## Documentation

The code is documented with [JSDoc](http://usejsdoc.org/). While the output hasn't been committed to source control, you can generate the documentation by using the following commands:

    > npm install
    > gulp document

## Development

    > nvm use 12.13.1
    > npm install
    > gulp lint
    > gulp test

## Build

Modern JavaScript language features are used. Some browsers may still require polyfills.

## License

This software is provided under the MIT license.