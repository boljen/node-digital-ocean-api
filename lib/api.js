var Paginator = require('./paginator')
  , defaults = require('./defaults');

function createError(code, error, original) {
  var e = new Error(error);
  e.code = code;
  if (original)
    e.original = original;
  return e;
}

var API = function(cfg) {
  if (!cfg.token)
    throw new Error("Expecting an access token");
  if (!cfg.request)
    this._requester = require('./request');
  else
    this._requester = cfg.request;

  this._token = cfg.token;
  this.ratelimit = null;
};

API.prototype._root = 'https://api.digitalocean.com/v2/';

API.prototype._request = function(qry, cb) {

  // Build the request object from the given query
  var request = this._buildRequest(qry);
  var self = this;
  // Call the requester
  this._requester(request, function(error, response) {

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
        , response.body
      );

    // Parse 400-500 error range
    if (response.status >= 400 && response.status < 500)
      return cb(
        createError('call_error', 'Something wrong with your request')
        , response.body
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

/**


API.prototype._buildQuery = function(cfg) {
  var qry = {};
  qry.uri = this._root+cfg.target;
  qry.method = cfg.method;

  if (cfg.page&& cfg.limit) {
    qry.uri += '?page='+cfg.page+'&per_page='+cfg.limit;
  } else if (cfg.page) {
    qry.uri += '?page='+cfg.page;
  } else if (cfg.limit) {
    qry.uri += "?per_page="+cfg.limit;
  }

  this._addHeaders(qry);
  return qry;
};



API.prototype._parseRateLimit = function(rl){
  //console.log('remaining requests: ', rl.remaining);
  this.rateLimit = rl;
};

API.prototype._request = function(qry, cb) {
  qry = this._buildQuery(qry);
  var self = this;
  this._requester(qry, function(err, res) {
      if (err) {
        var e = new Error('internal error');
        e.orig = err;
        cb(e);
      } else if (res.statusCode === 401) {
        var e = new Error('Access Denied');
        cb(e);
      } else if (res.statusCode === 404) {
        var e = new Error('not found');
        cb(e);
      } else {
        var rl = {
          'limit': res.headers['ratelimit-limit'],
          'remaining': res.headers['ratelimit-remaining'],
          'reset': res.headers['ratelimit-reset']
        };
        if (res.body)
          res.body = JSON.parse(res.body);
        self._parseRateLimit(rl);
        cb(err, res.body, res);
      }
  });
};

API.prototype._regularRequest = function(qry, page, cb) {
  this._request(qry, function(err, body, response) {
    if(err) {
      cb(err);
    } else {
      cb(null, body[page] ? body[page] : undefined, response);
    }
  });
};

API.prototype._paginatedRequest = function(qry, caller, cb) {
  var paginator = new Paginator({
    qry: qry,
    api: this,
    limit: (defaults[caller] && defaults[caller].limit) ? defaults[caller].limit : null,
    bulkLimit: (defaults[caller] && defaults[caller].bulkLimit) ? defaults[caller].bulkLimit : null,
    content: (defaults[caller] && defaults[caller].content)
              ? defaults[caller].content : caller,

  });
  if (cb) {
    paginator.getAll(cb);
    return;
  } else {
    return paginator;
  }
};

*/
module.exports = API;
