# barchart-common-js
## Common JavaScript classes, utilities, and functions

Utilities that can be used in a browser or Node.js environment.

## Documentation

The code is documented with [JSDoc](http://usejsdoc.org/). While the output hasn't been committed to source control, you can generate the documentation by using the following commands:

    > npm install
    > gulp document

## Development

Gulp is used to check "linting" and run unit tests, as follows:

    > npm install
    > gulp lint
    > gulp test

## Consumers

**Note: While the following is true, we're considering making this repository public, which will greatly simplify the consumer setup process.**

This library can be references as an NPM dependency, as follows:

	{
	  "name": "Your Node.js Application",
	  "dependencies": {
		"common": "git+ssh://github.com/barchart/barchart-common-js",
	  }
	}

Running "npm install" locally requires that you have a valid SSH key.

## Use with Elastic Beanstalk application

It is possible to deploy an application to Elastic Beanstalk which
requires this library. An SSH key was created for "deploy" purposes.
It has read-only access to the repository and is stored in an S3 bucket.
In S3, the SSH keys are located at:

	/barchart-deploy-keys/barchart-common-js.deploy
	/barchart-deploy-keys/barchart-common-js.deploy.pub

So, in your consuming application, take the following steps:

1. Ensure the "instance profile" for the application can access the S3 bucket.
2. When an Elastic Beanstalk deployment runs, use the "ebextensions" feature to:
	1. Get the SSH key from S3 and set the correct file permissions
	2. Write out a ".ssh/config" file so that our "deploy" key is used to talk to Github
	3. Write out a ".ssh/known_hosts" file for github
3. Now, when "npm install" runs, we can download a *private* repository from Github.

Please refer to https://github.com/barchart/aws-beanstalk-nodejs-job-manager for an
example of the "ebextension" files.


### Release

Use gulp to test, package, and tag a new release as follows:

    > npm install
    > gulp release

## License

This software is proprietary and intended for internal use by Barchart.com only (although, we are considering
making this repository public, and changing the license -- there is no proprietary code here).