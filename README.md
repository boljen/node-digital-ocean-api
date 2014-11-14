# Digital Ocean API (NodeJS/Javascript)

A thin wrapper for the Digital Ocean API (v2)

## Install

    npm install digital-ocean-api

## Quick Start

First you must create an instance of the DigitalOceanApi class

    var DigitalOceanApi = require('digital-ocean-api');

    var api = new DigitalOceanApi({
      token: 'yourAccessToken'
    });

Now, simply call the available methods:

    api.getDroplet(dropletId, function(error, droplet) {
        // droplet contains droplet metadata
    });

## Usage

This library is callback-oriented and a lot of methods share behavior with
each other. This chapter is mostly about the shared behavior. We have to start
first with the instantiation though.

### Callbacks

Every single API method can be called directly by providing a callback function.
The callback always has the same fundamental interface and are very node-esque;

    var callback = function(error, data) {

    };

By default, when a call doesn't do what it's supposed to do, it will return an
error object.



### Paginated resources

This is another big aspect of this library, as a lot of api calls are about
accessing paginated resources. While all the paginated methods can be called by
using the traditional callback, you can also go about it another way.

Since paginated resources can be substantial, and since providing a callback to
the method will exhaust the entire resource, it is recommended to actually
leverage the pagination functionality of the API.

More specifically, if you do not provide a callback to a paginated method, the
method will return an instance of 'PaginatedRequester'. This is a helper class
which gives you a lot more control over the retrieval of the data. It's a small
api in and on itself, which you can use to access the specific resource.

    var paginator = api.listDroplets();

The paginator has a couple of methods itself:

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

    paginator.getPageRange(1, 5, function(error, page, data) {

    });



### Errors

There are the errors which can be returned with the callback. This is not an
exhaustive list, as each method might have it's own custom error types, you
will need to check out the specific method documentation if you want to be
certain.

Typically, methods won't implement their own errors and the following list is
actually an exhaustive list.

* ***request_error***: This is an error returned by the request function. When
  this error pops up, something went wrong with the request. This error will
  contain the original error as returned by your request function.
* ***request_implementation_error***: WHen your implementation is flawed, this
  will most likely never occur. 
* ***internal_error***: When the server responds with an internal error status.
  This will be returned when digital ocean has issues on their end.
* ***rate_limit_exceeded***: When you have exceeded your rate
  limit, this error will be returned.
* ***authentication_failed***: When the authentication of your request failed.
* ***not_found***: When the server returns a 404 status because it did not find
  the resource.

An error is created internally with the following pattern. It's very straight
forward and is built to allow the developer to easily check for specific errors.

    var error = new Error('message');
    error.code = 'string_coded_error';
    error.original = errorObject; // if applicable






## Custom request function

HTTP requests aren't performed by this package. Rather, you must provide a
function which conforms to a predefined API explained in this chapter. This is
done inside the API constructor;

    var api = new Api({
      token: 'your..;token',
      request: myRequestFunction,
    });


### Before: built-in wrapper

There's a wrapper inside this package around the npm [request](https://www.npmjs.org/package/request)
package. It's a great method for server-side http requests but depending on
your requirements, or if you're using this library inside a browser, you might
need to pass on your own request execution function.

### Step 1: Writing the function

The function will receive a query object and a callback as arguments. It's your
job to turn the query object into useful data which can be passed on to the
callback.

The function definition looks like this:

    var myRequestFunction = function(request, callback) {

    };

Your job is to take the abstract request object and turn it into an actual http
request. After that request is done, you must then parse the returned data  

### Step 2: Turning the request object into an actual HTTP request

A request object might look like this:

    var request = {
      uri: 'https://api.digitalocean.com/v2/droplets?per_page=5',
      method: 'GET',
      headers: {
        'Content-Type': 'javascript/json',
        'Authorization': 'Bearer ...',
      },
    }



### Step 3: Execute HTTP request

### Step 4.A: Pass on the results through the callback

### Step 4.B: Call back a new error if things went wrong



The callback which is passed to your request function expects very specific
return values;

    callback(nativeError, response);

## License

LGPLv3
