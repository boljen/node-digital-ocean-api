# Digital Ocean API (NodeJS/Javascript)

A thin wrapper for the Digital Ocean API (v2)

*Work in progress, currently 13/52 methods implemented*

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

The callback itself is passed 2 arguments:

    api.doSomething(function(error, data) {

    });

### Paginated resources

A paginated resource will return an instance of 'Paginator' if you do not
provide a callback. This object facilitates handling multi-page resources.

    var paginator = api.listDroplets();

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

    api.listDroplets(function(err, res) {

    });

You basically are doing exactly the same as:

    var paginator = api.listDroplets();
    paginator.getAll(function(err, res) {

    });

## Methods

The striked-through methods are not yet implemented (or are implemented but
  have not had the opportunity to go through basic testing)

(*) : paginated resource

* **Account**
  * [getUserInformation](#userInfo)
* **Actions**
  * [listActions (*)](#listActions)
  * [getAction](#getAction)
* **Domains**
  * [listDomains (*)](#listDomains)
  * ~~createDomain~~
  * ~~retrieveDomain~~
  * ~~deleteDomain~~
* **Domain Records**
  * ~~listDomainRecords~~
  * ~~retrieveDomainRecord~~
  * ~~createDomainRecord~~
  * ~~updateDomainRecord~~
  * ~~deleteDomainRecord~~
* **Droplets**
  * [listDroplets (*)](#listDroplets)
  * [getDroplet](#getDroplet)
  * [listAvailableKernels (*)](#availableKernels)
  * [getDropletSnapshots (*)](#dropletSnapshots)
  * [getDropletBackups (*)](#dropletBackups)
  * [getDropletActions (*)](#dropletActions)
  * ~~createDroplet~~
  * [deleteDroplet](#deleteDroplet)
* **Droplet actions**
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
* **Images**
  * ~~listImages~~
  * ~~listDistributionImages~~
  * ~~listApplicationImages~~
  * ~~getImage~~
  * ~~getImageBySlug~~
  * ~~updateImage~~
  * ~~deleteImage~~
* **Image Actions**
  * ~~transferImage~~
  * ~~getImageAction~~
* **SSH Keys**
  * ~~listSSHKeys~~
  * ~~createSSHKey~~
  * ~~getSSHKey~~
  * ~~updateSSHKey~~
  * ~~destroyKey~~
* **Regions**
  * [listRegions](#listRegions)
* **Sizes**
  * [listSizes](#listSizes)

### <a id="userInfo">getUserInformation(cb)</a>

    api.getUserInformation(function(err, info) {});

### <a id="listActions">listActions(cb) (*)</a>

    api.listActions(function(err, actions) {});

### <a id="getAction">getAction(id, cb)</a>

    api.getAction(id, function(err, action) {});

### <a id="listDomains">listDomains(cb) (*)</a>

    api.listDomains(function(err, actions) {});



### <a id="listDroplets">listDroplets(cb) (*)</a>

    api.listDroplets(function(err, droplets) {});

### <a id="getDroplet">getDroplet(id, cb)</a>

    api.getDroplet(id, function(err, droplet) {});

### <a id="availableKernels">listAvailableKernels(dropletId, cb) (*)</a>

    api.listAvailableKernels(function(err, kernels) {});

### <a id="dropletSnapshots">getDropletSnapshots(dropletId, cb) (*)</a>

    api.getDropletSnapshots(id, function(err, snapshots) {});

### <a id="dropletBackups">getDropletBackups(dropletId, cb) (*)</a>

    api.getDropletBackups(id, function(err, backups) {});

### <a id="dropletActions">getDropletActions(dropletId, cb) (*)</a>

    api.getDropletActions(id, function(err, actions) {});

### <a id="deleteDroplet">deleteDroplet(dropletId, cb)</a>

If the droplet has been successfully deleted, success will be true.

    api.deleteDroplet(id, function(err, success) {});

### <a id="listRegions">listRegions(cb)</a>

    api.listRegions(function(err, regions) {});

### <a id="listSizes">listSizes(cb)</a>

    api.listSizes(function(err, sizes) {});

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
* Verify success of deleteDroplet action

## License

LGPLv3
