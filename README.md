# Digital Ocean API (NodeJS/Javascript)

A thin wrapper for the Digital Ocean API (v2)

## Install

First get the package through NPM

    npm install digital-ocean-api

Now set it up inside your application

    var DigitalOceanApi = require('digital-ocean-api');

    var api = new DigitalOceanApi({
      token: 'yourAccessToken'
    });

## Usage

### Callbacks

All the methods utilize the same callback interface, except for the Paginator
getPageRange method.

    function(error, data) {};

### Errors

Errors are created internally thgouh the following pattern:

    var error = new Error('message');
    error.code = 'string_coded_error';
    error.original = errorObject; // if applicable

It's very straight forward and is built to allow the developer to easily check
wheter errors, and which errors, have occurred.

These are the top-level errors (every callback can be given these errors)

* ***request_error***: This is an error returned by the request function. When
  this error pops up, something went wrong with the request. This error will
  contain the original error as returned by your request function.
* ***request_implementation_error***: When your implementation is flawed, this
  will most likely never occur.
* ***internal_server_error***: When a status code between 500 and 599 is returned.
* ***response_error***: When a status code between 400 and 499 is returned

Some methods might add additional possible errors and in the future we'd like to
further differentiate between all the errors (e.g. ratelimit exceeded, auth
  failed, ...)

### Paginated resources

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


## Methods




## TODO

* Errors can be dealt with more gracefully..
* There aren't all that many unit tests either

## License

LGPLv3
