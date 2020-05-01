# UNMAINTAINED: Digital Ocean API (NodeJS/Javascript)

A thin wrapper for the Digital Ocean API (v2)

## ALTERNATIVES

This repository is not maintained anymore. For alternatives see the [library list](https://developers.digitalocean.com/libraries/) or one of the following:

* [do-wrapper](https://www.npmjs.com/package/do-wrapper)
* [dots](https://github.com/pjpimentel/dots)
* [digitalocean](https://www.npmjs.com/package/digitalocean)

## Table of Content

* [Installation](#install)
* [Usage](#usage)
  * [Callbacks](#callbacks)
  * [Errors](#errors)
  * [Paginated Resources](#paginated)
* [Methods](#methods)
* [Todo](#todo)
* [License](#license)

## <a id="install"></a>Install

First get the package through NPM

    npm install digital-ocean-api

Now set it up inside your application

    var DigitalOceanApi = require('digital-ocean-api');

    var api = new DigitalOceanApi({
      token: 'yourAccessToken'
    });

## <a id="usage"></a>Usage

### <a id="callbacks"></a>Callbacks

All the methods utilize the same callback interface, except for the Paginator
getPageRange method.

    function(error, data) {};

### <a id="errors"></a>Errors

Errors are created internally following the following pattern:

    var error = new Error('message');
    error.code = 'string_coded_error';
    error.original = errorObject; // if applicable

These are the top-level errors (every callback can be return these errors)

* ***request_error***: This is an error returned by the request function. When
  this error pops up, something went wrong with the request. This error will
  contain the original error as returned by your request function.
* ***request_implementation_error***: When your implementation is flawed, this
  will most likely never occur.
* ***internal_server_error***: When a status code between 500 and 599 is returned.
* ***response_error***: When a status code between 400 and 499 is returned

### <a id="paginated"></a>Paginated resources

When a method accesses a paginated resource, you can pass along a callback and
exhaust the entire resource, or you don't provide a callback in which you will
get an instance of Paginator, a helper utility to more easily work with multi-
page resources.

    var paginator = api.listDroplets();

The paginator implements the following methods:

* ***getPage(pageNumber, callback)***: will get the specified page.
* ***getPageRange(start, stop, callback)***: This will attempt to retrieve all
  the pages within the range.
* ***getAll(callback)***: will exhaust the entire resource.
* ***setLimit(limit)***: Set the maximum entries per page.
* ***setBulkLimit(limit)***: When calling getAll(), this is the items per page
  which will be used.

The getPageRange is the only method to access the api inside this library which
does not respect the same callback interface. Since it's an asynchronous
function it will call the callback whenver it gets back results from a page. The
order is rather random and as such it's important to provide an easy-to-use api
to find out which page it is.

    paginator.getPageRange(1, 5, function(error, data, page) {

    });

### <a id="tagged"></a>Tagged Droplet Actions

Droplet actions always have a boolean and callback as it's last two arguments.

    API.prototype.rebuildDroplet = function(id, image, tagged, callback)

If the tagged boolean is true, the id argument will be used as a tag instead
and the action will be performed against all droplets with the specified tag.
In that case, the result will be an array of actions.

The "tagged" argument is optional for the sake of backwards compatibility.

## <a id="methods"></a>Methods

Refer to the actual [API Documentation](https://developers.digitalocean.com/v2)
to learn what the returned values can be. Bear in mind that the returned data
is sanitized.

Methods marked with a star (*) are paginated methods.

* **Account**
  * [getUserInfo](#getUserInfo)
* **Actions**
  * [listActions (*)](#listActions)
  * [getAction](#getAction)
* **Domains**
  * listDomains (*)
  * createDomain
  * getDomain
  * deleteDomain
* **Domain Records**
  * listDomainRecords (*)
  * getDomainRecord
  * createDomainRecord
  * updateDomainRecord
  * deleteDomainRecord
* **Droplets**
  * [listDroplets (*)](#listDroplets)
  * [getDroplet](#getDroplet)
  * listAvailableKernels (*)
  * listDropletsByTag (*)
  * listDropletSnapshots (*)
  * listDropletBackups (*)
  * listDropletActions (*)
  * createDroplet
  * deleteDroplet
  * deleteDropletsByTag
  * listDropletNeighbors (*)
  * listNeighbors (*)
* **Droplet actions**
  * enableDropletBackups
  * disableDropletBackups
  * rebootDroplet
  * powerCycleDroplet
  * shutdownDroplet
  * powerOffDroplet
  * powerOnDroplet
  * restoreDroplet
  * passwordResetDroplet
  * resizeDroplet
  * rebuildDroplet
  * renameDroplet
  * changeDropletKernel
  * enableIpv6Droplet
  * enableDropletPrivateNetwork
  * snapshotDroplet
  * getDropletAction
* **Images**
  * listImages (*)
  * listDistributionImages
  * listApplicationImages
  * ~~listUserImages (*)~~
  * ~~listImageActions (*)~~
  * getImage
  * getImageBySlug
  * updateImage
  * deleteImage
* **Image Actions**
  * ~~transferImage~~
  * ~~imageToSnapshot~~
  * ~~getImageAction~~
* **SSH Keys**
  * listKeys (*)
  * createKey
  * getKey
  * updateKey
  * destroyKey
* **Regions**
  * [listRegions (*)](#listRegions)
* **Sizes**
  * [listSizes (*)](#listSizes)
* **Floating IPs**
  * ~~listFloatingIPs (*)~~
  * ~~createFloatingIP~~
  * ~~createUnassignedFloatingIP~~
  * ~~getFloatingIP~~
  * ~~deleteFloatingIP~~  
* **Floating IP Actions**
  * ~~assignFloatingIP~~
  * ~~unassignFloatingIP~~
  * ~~listFloatingIPActions (*)~~
  * ~~getFloatingIPAction~~
* **Tags**
  * listTags (*)
  * createTag
  * getTag
  * updateTag
  * tag
  * untag
  * deleteTag

### <a id="getUserInfo"></a>getUserInfo

    api.getUserInfo(function(err, info) {

    });

### <a id="listActions"></a>listActions*

    // Exhaustive call (not recommended here)
    api.listActions(function(err, actions) {

    });

    // Paginator object
    var paginator = api.listActions();

### <a id="getAction"></a>getAction

    api.getAction(id, function(err, action) {

    })

### <a id="listDroplets"></a>listDroplets*

    // Exhaustive call
    api.listDroplets(function(err, droplets) {

    });

    // Paginator object
    var paginator = api.listDroplets();

### <a id="listRegions"></a>listRegions*

    // Exhaustive call (recommended)
    api.listRegions(function(err, regions) {

    });

    // Paginator object
    var paginator = api.listRegions();

### <a id="listSizes"></a>listSizes*

    // Exhaustive call (recommended)
    api.listSizes(function(err, sizes) {

    });

    // Paginator object
    var paginator = api.listSizes();

## <a id="todo"></a>TODO

* Image list functions which filter on type are flawed
* Implement actual request/response testing using a local dummy server and hardcoded JSON responses.

## <a id="license"></a>License

MIT
