# Barchart Common JavaScript

[![AWS CodeBuild](https://codebuild.us-east-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiYjhPK3NyazNKNlo4QmQzblZnbFFuR2ljMUljdXlRWGp6MEtaWW1pREpBRndCSkk1MkZyUDJCdzZWcCsxbEU5NERuZFhTU0RKZG9NbStjbTFIa3JnRlI4PSIsIml2UGFyYW1ldGVyU3BlYyI6IkFtZFhHQ0NLV0lhUlBoaWUiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)](https://github.com/barchart/common-js)
[![Lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

Public JavaScript packages containing shared utilities for browser, market data, and Node.js applications.

### Packages

* [@barchart/common-js](./packages/common-js) — general-purpose utilities and data structures suitable for browser and Node.js environments — published to [NPM](https://www.npmjs.com/package/@barchart/common-js).
* [@barchart/common-market-js](./packages/common-market-js) — utilities for identifying, parsing, classifying, and normalizing market symbols — published to [NPM](https://www.npmjs.com/package/@barchart/common-market-js).
* [@barchart/common-node-js](./packages/common-node-js) — server-side utilities for AWS services, databases, streams, messaging, and HTTP applications — published to [NPM](https://www.npmjs.com/package/@barchart/common-node-js).

All packages support Node.js 20 or newer and publish generated TypeScript declarations and CommonJS builds alongside their ES modules.

### Development

[Yarn](https://classic.yarnpkg.com/) manages dependencies and [Lerna](https://lerna.js.org/) manages the workspaces and coordinated package versions.

Install dependencies:

```shell
yarn install
```

Run lint and tests for all packages:

```shell
yarn run lint
yarn run test
```

Generate TypeScript declarations for an individual package when needed:

```shell
yarn workspace @barchart/common-js types
yarn workspace @barchart/common-market-js types
yarn workspace @barchart/common-node-js types
```

### Release Process

Package versions are managed together. To prepare and publish a release:

1. Ensure the working tree is clean and dependencies are up to date.
2. Add and commit `.releases/<version>.md` using the format of the existing release notes.
3. Run lint and tests.
4. Run the release script to update package versions and create the signed commit and tag.
5. Create a [GitHub Release](https://github.com/barchart/common-js/releases) from the new tag and copy the release notes into it.
6. Publish the packages to NPM.

```shell
yarn install
yarn run lint
yarn run test
yarn run release
yarn run publish
```

The release and publish commands require the appropriate Git signing, GitHub, and NPM credentials.

### License

This software is provided under the MIT license.
