# @barchart/common-node-js

[![AWS CodeBuild](https://codebuild.us-east-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiMml2V3dLRC83RHBaTEw3WDNjN3JCUVRWLzJaVGQyZmJGbnk0SlByQ0hkbU5EMXNESHBrZTFVTHVtdmVvMFBpUlZORzRVUTBWbUltenBsaktqNUJWU0d3PSIsIml2UGFyYW1ldGVyU3BlYyI6IjRNVkVPZjU2STdjSnBBSE4iLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)](https://github.com/barchart/common-node-js)
[![NPM](https://img.shields.io/npm/v/@barchart/common-node-js)](https://www.npmjs.com/package/@barchart/common-node-js)

A *public* library of JavaScript utilities — suitable for use in both Node.js environments.

### Overview

#### Features

* Promise-based convenience wrappers for the AWS services (e.g. DynamoDB, S3, SES, SNS, SQS, more)
* Promise-based convenience wrappers for relational dB access (PostgreSQL, MySQL)
* Advanced utilities for working with Node.js streams
* A workflow engine based on a priority queue
* Pluggable asynchronous message bus for request-response (including an Amazon SQS implementation)
* Pluggable asynchronous message bus for publish-subscribe (including an Amazon SNS/SQS implementation)
* Abstraction for HTTP servers with REST and Socket.IO endpoints (using Express)
* Browse the code...

#### Companion Library

A companion library called [@barchart/common-js](https://github.com/barchart/barchart-common-js) contains a more general set of utilities which are suitable for either Node.js or browser environments.

### Development

#### Documentation

The code is documented with [JSDoc](http://usejsdoc.org/). This will be used as the basis for formal documentation (coming soon).

#### Package Managers

This library has been published as a *public* module to NPM as [@barchart/common-node-js](https://www.npmjs.com/package/@barchart/common-node-js).

```shell
npm install @barchart/common-node-js -S
```

#### License

This software is provided under the MIT license.