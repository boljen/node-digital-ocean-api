var Paginator = require('./paginator');

var API = function(cfg) {
  if (!cfg.token)
    throw new Error("Expecting an access token");
  if (!cfg.request)
    this._request = require('./request');
  else
    this._request = cfg.request;

  this._token = cfg.token;
  this.ratelimit = null;
};

API.prototype._root = 'https://api.digitalocean.com/v2/';





/******************************************************************************/
/******************************************************************************/
/**************************** BASIC METHODS ***********************************/
/******************************************************************************/
/******************************************************************************/

function createError(code, error, original) {
  var e = new Error(error);
  e.code = code;
  if (original)
    e.original = original;
  return e;
}

API.prototype.request = function(qry, cb) {

  // Build the request object from the given query
  var request = this._buildRequest(qry);
  var self = this;
  // Call the requester
  this._request(request, function(error, response) {

    // Parse request_error
    if (error)
      return cb(createError('request_error', 'Request method Error', error));

    // Parse request_implementation_error
    if (!response || !response.headers || !response.body
                  || response.status === undefined)
        return cb(createError('request_implementation_error'
          , 'request method implementation did not return a valid response'));

    // Parse internal error
    if (response.status >= 500 && response.status < 600)
      return cb(
        createError('internal_server_error', 'Something went wrong with the')
        , response
      );

    // Parse 400-500 error range
    if (response.status >= 400 && response.status < 500)
      return cb(
        createError('response_error', 'Something wrong with your request')
        , response
      );

    // Parse rate limit
    self._parseRateLimit(response);

    // Call back
    cb(null, {
      body: response.body || {},
      headers: response.headers || {},
      status: response.status || 0,
    });

  });
};

API.prototype._buildRequest = function(query) {

  // Create boilerplate request
  var request = {
    method: 'GET',
    headers: {},
  };

  // Overwrite headers
  if (query.headers)
    request.headers = query.headers;

  // Overwrite method
  if (query.method)
    request.method = query.method;

  // Create request uri
  request.uri = this._root+query.target;

  // Page and limit
  if (query.page && query.limit) {
    request.uri += '?page='+query.page+'&per_page='+query.limit;
  } else if (query.page) {
    request.uri += '?page='+query.page;
  } else if (query.limit) {
    request.uri += "?per_page="+query.limit;
  }

  // Set content type
  request.headers['Content-Type'] = 'application/json';

  // Authenticate
  this._authenticateRequest(request);

  return request;
};

API.prototype._authenticateRequest = function(request) {
  request.headers['Authorization'] = 'Bearer '+this._token;
};

API.prototype._parseRateLimit = function(response) {
  if (!response.headers)
    return;

};





/******************************************************************************/
/******************************************************************************/
/*************************** UTILITY METHODS **********************************/
/******************************************************************************/
/******************************************************************************/

API.prototype.regularRequest = function(qry, key, cb) {
  this.request(qry, function(err, data) {
    if(err !== null)
      cb(err);
    else
      cb(null, data.body[key]);
  });
};

API.prototype.paginatedRequest = function(qry, key, cb) {

  var paginator = new Paginator({
    qry: qry,
    api: this,
    key: key,
  });

  if (cb) {
    paginator.getAll(cb);
    return;
  } else {
    return paginator;
  }
};

/******************************************************************************/
/******************************************************************************/
/***************************** API METHODS ************************************/
/******************************************************************************/
/******************************************************************************/


/******************************************************************************/
/******************************** Account *************************************/
/******************************************************************************/

API.prototype.getUserInfo = function(callback) {
  this.regularRequest({
    target: 'account',
    method: 'GET'
  }, 'account', callback);
};

/******************************************************************************/
/******************************** Actions *************************************/
/******************************************************************************/

API.prototype.listActions = function(callback) {
  return this.paginatedRequest({
    target: 'actions',
    method: 'GET'
  }, 'actions', callback);
};

API.prototype.getAction = function(id, callback) {
  this.regularRequest({
    target:'actions/'+id,
    method: 'GET'
  }, 'action', callback);
};

/**

API.prototype._parseRateLimit = function(rl){
  //console.log('remaining requests: ', rl.remaining);
  this.rateLimit = rl;
};






*/
module.exports = API;
