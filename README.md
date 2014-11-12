# Digital Ocean API (NodeJS/Javascript)

A thin wrapper for the Digital Ocean API (v2)

## Install

    npm install digital-ocean-api

## Setup

First load the class and helpers in your application:

    var DigitalOceanApi = require('digital-ocean-api');
    var request = require('request');

Next create your configuration:

    var cfg = {
      token: '...',       // Your access token
      requester: request, // function which executes HTTP requests
    };

Finally create an instance:

    var api = new DigitalOceanApi(cfg);

## Usage

### Regular usage

Every single method can be called by applying a callback as the final argument,
even the paginated resources (in which case all results will be retrieved) can
be called in such a way.

    api.doSomething(callback);

    api.doSomethingElse(arg1, arg2, callback);

The callback itself is passed 3 arguments:

    api.getSizes(function(error, sizes, responseObject) {
      // sizes is an array containing all sizes
      // responseObject is the object returned by the requester function
    });

### Paginated resources

A paginated resource will return an instance of 'Paginator' if you do not
provide a callback. This object facilitates handling multi-page resources.

    var paginator = api.getDroplets();

The paginator has it's own api

    // Get page 1
    paginator.getPage(1, function(err, data) {})

    // Get page 1 to 4, callback is called asynchronous
    paginator.getPageRange(1, 4, function(err, data, page) {});

    // Get all resources
    paginator.getAll(function(err, data) {});

You can also configure the paginator. You shouldn't touch these configurations
after you started using the object. If you need a different configuration, then
create a new paginator object.

    // Set the amount of entries retrieved per page.
    paginator.pageSize(10);

    // Same as above, applies to getAll method
    paginator.bulkSize(100);

**Under the hood**

If you provide a callback to a paginated resource

    api.getDroplets(function(err, res) {

    });

You basically are doing exactly the same as:

    var paginator = api.getDroplets();
    paginator.getAll(function(err, res) {

    });

## Methods

The striked-through methods are not yet implemented (or are implemented but
  have not had the opportunity to go through basic testing)

* [getUserInformation](USERINFO)
* ~~listActions~~
* ~~getAction~~
* ~~listDomains~~
* ~~createDomain~~
* ~~retrieveDomain~~
* ~~deleteDomain~~
* ~~listDomainRecords~~
* ~~retrieveDomainRecord~~
* ~~createDomainRecord~~
* ~~updateDomainRecord~~
* ~~deleteDomainRecord~~
* ~~createDroplet~~
* ~~getDropletById~~
* ~~listDroplets~~
* ~~listAvailableKernels~~
* ~~getDropletSnapshots~~
* ~~getDropletBackups~~
* ~~getDropletActions~~
* ~~deleteDroplet~~
* ~~disableDropletBackups~~
* ~~rebootDroplet~~
* ~~powerCycleDroplet~~
* ~~shutdownDroplet~~
* ~~powerOffDroplet~~
* ~~powerOnDroplet~~
* ~~restoreDroplet~~
* ~~passwordResetDroplet~~
* ~~resizeDroplet~~
* ~~rebuildDroplet~~
* ~~renameDroplet~~
* ~~changeDropletKernel~~
* ~~enableIpv6Droplet~~
* ~~enableDropletPrivateNetwork~~
* ~~snapshotDroplet~~
* ~~getDropletAction~~
* ~~listImages~~
* ~~listDistributionImages~~
* ~~listApplicationImages~~
* ~~getImage~~
* ~~getImageBySlug~~
* ~~updateImage~~
* ~~deleteImage~~
* ~~transferImage~~
* ~~getImageAction~~
* ~~listSSHKeys~~
* ~~createSSHKey~~
* ~~getSSHKey~~
* ~~updateSSHKey~~
* ~~destroyKey~~
* ~~listRegions~~
* ~~listSizes~~

### getUserInformation(cb)

    api.getUserInformation(function(e, info) {

    });

## Custom requester function

If you want to use your own requester function, then you must create one who's
API mirrors the npm [request](https://www.npmjs.org/package/request) package.

    var myRequester = function() {...};

The function will be called like this:

    myRequester({
      uri: 'https://api.example.com/actions',
      method: 'GET',
      headers: {
        'Content-Type': 'javascript/json',
      }
    }, function(error, result) {
      // result.body = "string"
      // result.header = {header:value, header2: value}
    })

CORS functionality should be built into this requester function.

## TODO

* Exhaustive unit testing with mock requester

## License

LGPLv3
