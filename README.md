# @barchart/common-js

[![AWS CodeBuild](https://codebuild.us-east-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiZk13ZThIVktsdFZGcXVCNERveTVJMjFnUytldjUzNDFpSGdxUXlGK3RsaTVmTnFEbmtkYXJxcUEwSmR6eFlDa3RobzNSMHl6K2ZCREJkMVc5YkNGanFNPSIsIml2UGFyYW1ldGVyU3BlYyI6IkpqVzNITHNVMHZ2YnE4UnUiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)](https://github.com/barchart/barchart-common-js)

A *public* library of shared JavaScript utilities. These utilities are agnostic to environment. They should be suitable for use in Node.js and web browsers.

### Overview

#### Features

* Simple utilities (type checking, assertions, bit masking, etc)
* Data structures (decimals, days, enumerations, etc)
* Simple collections (queues, stacks, trees, etc)
* Specialized collections (priority queues, evicting lists, evicting maps, etc)
* Browse the code...

#### Companion Library

A companion library called [@barchart/common-node-js](https://github.com/barchart/barchart-common-node-js) contains utilities for exclusive use in Node.js environments (i.e. not suitable for use in browsers).

### Development

#### Documentation

The code is documented with [JSDoc](http://usejsdoc.org/). While the output hasn't been committed to source control, you can generate the documentation by using the following commands:

    > npm install
    > gulp document

#### Package Managers

This library has been published as a *public* module to NPM as [@barchart/common-js](https://www.npmjs.com/package/@barchart/common-js).

    > npm install @barchart/common-js -S

#### Build

Modern JavaScript language features are used. Some browsers may still require polyfills.

#### License

This software is provided under the MIT license.