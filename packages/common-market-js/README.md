# @barchart/common-market-js

A public library of common JavaScript utilities for working with market data.

### Overview

#### Features

* Identify common Barchart symbol types
* Parse futures, futures options, equity options, foreign exchange, and other market symbols
* Normalize producer and futures symbol formats
* Classify parsed instruments by asset class

#### Companion Library

This package builds on [@barchart/common-js](https://www.npmjs.com/package/@barchart/common-js), which provides general-purpose utilities suitable for Node.js and browser environments.

### Development

#### Package Managers

This library is published to NPM as `@barchart/common-market-js`.

```shell
npm install @barchart/common-market-js -S
```

#### Type Declarations

TypeScript declarations are generated from JavaScript and JSDoc:

```shell
npm run types
```

The command writes declarations to `types/` using the same directory structure as the JavaScript source.

#### License

This software is provided under the MIT license.
