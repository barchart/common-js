# @barchart/common-market-js

A public library of common JavaScript utilities for working with market data.

### Overview

#### Features

* Functions for working with Barchart symbology.
* Unit-code metadata, tick calculations, and futures month lookups.
* Decimal, fractional, and product-specific price formatting.

#### Market Utilities

Import modules directly; the package supports ES modules, CommonJS, and generated TypeScript declarations.

| Module | Purpose |
| --- | --- |
| `data/AssetClass.js` | Instrument asset classes. |
| `data/UnitCode.js` | Unit/base codes, precision, fractional conventions, and tick calculations. |
| `data/monthCodes.js` | Copies of futures month-name and month-number maps, including cash (`Y`, `0`). |
| `convert/unitCodeToBaseCode.js` | Unit-to-base-code conversion; invalid inputs return zero. |
| `format/price.js` | Price formatting selected by unit code. |
| `format/fraction.js` | Fractional tick notation, including CME conventions. |
| `format/decimal.js` | Decimal formatting with market-data input validation. |
| `format/specialized/cmdtyView.js` | cmdtyView Treasury-option formatting rules. |

```js
import formatPrice from '@barchart/common-market-js/format/price.js';
import UnitCode from '@barchart/common-market-js/data/UnitCode.js';

formatPrice(110.34375, '4', '-'); // '110-11'
UnitCode.parse('4').getMinimumTick(1); // 0.03125
```

The `formatForCmdtyView` function accepts a `profile` object whose optional `asset` (an object with a numeric `id`) and `root` properties determine whether specialized Treasury-option formatting applies.

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
