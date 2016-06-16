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

module.exports = API;

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

    if (!response.body)
      response.body = {};

    // Parse request_implementation_error
    if (!response || !response.headers || response.status === undefined)
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
        createError('response_error', 'Something wrong with your request')
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
    body: {},
  };

  // Overwrite headers
  if (query.headers)
    request.headers = query.headers;

  // Overwrite method
  if (query.method)
    request.method = query.method;

  if (query.body)
    request.body = query.body;

  // Create request uri
  request.uri = this._root+query.target;

  var uriQry = (query.query) ? query.query : {}
  if (query.page)
    uriQry.page = query.page
  if (query.limit)
    uriQry.per_page = query.limit

  var uriQryList = []
  for (var key in uriQry) {
    uriQryList.push(key+"="+uriQry[key])
  }
  if (uriQryList.length > 0) {
    request.uri += "?"+uriQryList.join("&")
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
      cb(err, data);
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

var supportedActions = {
  power_cycle: true,
  power_on: true,
  power_off: true,
  shutdown: true,
  enable_private_networking: true,
  enable_ipv6: true,
  enable_backups: true,
  disable_backups: true,
  snapshot: true,
}

API.prototype._taggedDropletAction = function(tagName, type, body, callback) {
  if (!supportedActions[type])
    return callback(new Error("API does not support tagged action "+type))

  if (!body)
    body = {};
  body.type = type;
  this.regularRequest({
    target: 'droplets/actions',
    query: {
      tag_name: tagName,
    },
    method: 'POST',
    body: body
  }, 'actions', callback);
}

API.prototype._singleDropletAction = function(id, type, body, callback) {
  if (!body)
    body = {};
  body.type = type;
  this.regularRequest({
    target: 'droplets/'+id+'/actions',
    method: 'POST',
    body: body
  }, 'action', callback);
};

API.prototype._dropletAction = function(id, type, body, tagged, callback) {
  if (tagged) {
    return this._taggedDropletAction(id, type, body, callback)
  } else if (!tagged && callback) {
    return this._singleDropletAction(id, type, body, callback)
  } else {
    return this._singleDropletAction(id, type, body, tagged)
  }
}

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

/******************************************************************************/
/******************************** Domains *************************************/
/******************************************************************************/

API.prototype.listDomains = function(callback) {
  return this.paginatedRequest({
    target: 'domains',
    method: 'GET'
  }, 'domains', callback);
};

API.prototype.createDomain = function(cfg, callback) {
  // cfg: {name: name,ip_address: ip,},
  this.regularRequest({
    target: 'domains',
    method: 'POST',
    body: cfg,
  }, 'domain', callback);
};

API.prototype.getDomain = function(id, callback) {
  return this.regularRequest({
    target:'domains/'+id+'/',
    method: 'GET'
  }, 'domain', callback);
};

API.prototype.deleteDomain = function(id, callback) {
  return this.request({
    target:'domains/'+id+'/',
    method: 'DELETE',
  }, function(err, res) {
    if (err)
      callback(err, false);
    else
      callback(null, true);
  });
};

/******************************************************************************/
/***************************** Domain Records *********************************/
/******************************************************************************/

API.prototype.listDomainRecords = function(domain, callback) {
  return this.paginatedRequest({
    target: 'domains/'+domain+'/records',
    method: 'GET'
  }, 'domain_records', callback);
};

API.prototype.createDomainRecord = function(domain,cfg, callback) {
  this.regularRequest({
    target: 'domains/'+domain+'/records',
    method: 'POST',
    body: cfg,
  }, 'domain_records', callback);
};

API.prototype.getDomainRecord = function(domain, id, callback) {
  this.regularRequest({
    target: 'domains/'+domain+'/records/'+id,
    method: 'GET'
  }, 'domain_record', callback);
};

API.prototype.updateDomainRecord = function(domain, id, cfg, callback) {
  this.regularRequest({
    target: 'domains/'+domain+'/records/'+id,
    method: 'PUT',
    body: cfg,
  }, 'domain_record', callback);
};

API.prototype.deleteDomainRecord = function(domain, id, callback) {
  this.request({
    target: 'domains/'+domain+'/records/'+id,
    method: 'DELETE'
  }, function(error, response) {
    if (error)
      callback(error, false);
    else
      callback(null, true);
  });
};


/******************************************************************************/
/******************************** Droplets *************************************/
/******************************************************************************/

API.prototype.listDroplets = function(callback) {
  return this.paginatedRequest({
    target: 'droplets',
    method: 'GET'
  }, 'droplets', callback);
};

API.prototype.listDropletsByTag = function(tagname, callback) {
  return this.paginatedRequest({
    target: 'droplets',
    method: 'GET',
    query: {
      tag_name: tagname,
    }
  }, 'droplets', callback);
};

API.prototype.listNeighbors = function(callback) {
  return this.paginatedRequest({
    target: 'reports/droplet_neighbors',
    method: 'GET'
  }, 'neighbors', callback);
};

API.prototype.listDropletNeighbors = function(id, callback) {
  return this.paginatedRequest({
    target: 'droplets/'+id+'/neighbors',
    method: 'GET'
  }, 'droplets', callback);
};

API.prototype.getDroplet = function(id, callback) {
  this.regularRequest({
    target:'droplets/'+id,
    method: 'GET'
  }, 'droplet', callback);
};

API.prototype.listAvailableKernels = function(id, callback) {
  this.paginatedRequest({
    target:'droplets/'+id+'/kernels',
    method: 'GET'
  }, 'kernels', callback);
};

API.prototype.listDropletSnapshots = function(id, callback) {
  this.paginatedRequest({
    target:'droplets/'+id+'/snapshots',
    method: 'GET'
  }, 'snapshots', callback);
};

API.prototype.listDropletBackups = function(id, callback) {
  this.paginatedRequest({
    target:'droplets/'+id+'/backups',
    method: 'GET'
  }, 'backups', callback);
};

API.prototype.listDropletActions = function(id, callback) {
  this.paginatedRequest({
    target:'droplets/'+id+'/actions',
    method: 'GET'
  }, 'actions', callback);
};

API.prototype.getDropletAction = function(id, actionId, callback) {
  this.regularRequest({
    target:'droplets/'+id+'/actions/'+actionId,
    method: 'GET'
  }, 'action', callback);
};

API.prototype.deleteDroplet = function(id, callback) {
  this.request({
    target: 'droplets/'+id,
    method: 'DELETE'
  }, function(error, response) {
    if (error)
      callback(error, false);
    else
      callback(null, true);
  });
};

API.prototype.deleteDropletsByTag = function(tagName, callback) {
  this.request({
    target: 'droplets',
    method: 'DELETE',
    query: {
      tag_name: tagName,
    }
  }, function(error, response) {
    if (error)
      callback(error, false);
    else
      callback(null, true);
  });
};

API.prototype.createDroplet = function(cfg, callback) {
  this.regularRequest({
    target: 'droplets/',
    method: 'POST',
    body: cfg
  }, 'droplet', callback);
  // name, region, size, image, (notrequired) ssh_keys, backups, ipv6,
  // private_networking, user_data
};


/******************************************************************************/
/**************************** Droplet Actions *********************************/
/******************************************************************************/

API.prototype.enableDropletBackups = function(id, tagged, callback) {
  this._dropletAction(id, 'enable_backups', {}, tagged, callback);
};

API.prototype.disableDropletBackups = function(id, tagged, callback) {
  this._dropletAction(id, 'disable_backups', {}, tagged, callback);
};

API.prototype.rebootDroplet = function(id, tagged, callback) {
  this._dropletAction(id, 'reboot', {}, tagged, callback);
};

API.prototype.powerCycleDroplet = function(id, tagged, callback) {
  this._dropletAction(id, 'power_cycle', {}, tagged, callback);
};

API.prototype.shutdownDroplet = function(id, tagged, callback) {
  this._dropletAction(id, 'shutdown', {}, tagged, callback);
};

API.prototype.powerOnDroplet = function(id, tagged, callback) {
  this._dropletAction(id, 'power_on', {}, tagged, callback);
};

API.prototype.powerOffDroplet = function(id, tagged, callback) {
  this._dropletAction(id, 'power_off', {}, tagged, callback);
};

API.prototype.restoreDroplet = function(id, image, tagged, callback) {
  this._dropletAction(id, 'restore', {
    image: image
  }, tagged, callback);
};

API.prototype.passwordResetDroplet = function(id, tagged, callback) {
  this._dropletAction(id, 'pw_reset', {}, tagged, callback);
};

API.prototype.resizeDroplet = function(id, size, tagged, callback) {
  this._dropletAction(id, 'resize', {
    size: size
  }, tagged, callback);
};

API.prototype.rebuildDroplet = function(id, image, tagged, callback) {
  this._dropletAction(id, 'rebuild', {
    image: image
  }, tagged, callback);
};

API.prototype.rebuildDroplet = function(id, name, tagged, callback) {
  this._dropletAction(id, 'rename', {
    name: name
  }, tagged, callback);
};

API.prototype.changeDropletKernel = function(id, kernel, tagged, callback) {
  this._dropletAction(id, 'change_kernel', {
    kernel: kernel
  }, tagged, callback);
};

API.prototype.enableIpv6Droplet = function(id, tagged, callback) {
  this._dropletAction(id, 'enable_ipv6', {}, tagged, callback);
};

API.prototype.enableDropletPrivateNetwork = function(id, tagged, callback) {
  this._dropletAction(id, 'enable_private_networking', {}, tagged, callback);
};

API.prototype.snapshotDroplet = function(id, name, tagged, callback) {
  this._dropletAction(id, 'snapshot', {
    name: name
  }, tagged, callback);
};


/******************************************************************************/
/********************************* Images *************************************/
/******************************************************************************/

API.prototype.listImages = function(callback) {
  return this.paginatedRequest({
    target: 'images',
    method: 'GET'
  }, 'images', callback);
};

API.prototype.listDistributionImages = function(callback) {
  return this.paginatedRequest({
    target: 'images?type=distribution',
    method: 'GET'
  }, 'images', callback);
};

API.prototype.listApplicationImages = function(callback) {
  return this.paginatedRequest({
    target: 'images?type=application',
    method: 'GET'
  }, 'images', callback);
};

API.prototype.getImage = function(id, callback) {
  this.regularRequest({
    target:'images/'+id,
    method: 'GET'
  }, 'image', callback);
};

API.prototype.getImageBySlug = function(slug, callback) {
  this.getImage(slug, callback);
};

API.prototype.updateImage = function(id, name, callback) {
  this.regularRequest({
    target:'images/'+id,
    method: 'POST',
    body: {
      name: name
    }
  }, 'image', callback);
};

API.prototype.deleteImage = function(id, callback) {
  this.request({
    target: 'images/'+id,
    method: 'DELETE'
  }, function(error, response) {
    if (error)
      callback(error, false);
    else
      callback(null, true);
  });
};

/******************************************************************************/
/******************************** SSHKeys *************************************/
/******************************************************************************/

API.prototype.listKeys = function(callback) {
  return this.paginatedRequest({
    target: 'account/keys',
    method: 'GET'
  }, 'ssh_keys', callback);
};


API.prototype.createKey = function(cfg, callback) {
  // cfg: {name: name,ip_address: ip,},
  this.regularRequest({
    target: 'account/keys',
    method: 'POST',
    body: cfg,
  }, 'ssh_key', callback);
};

API.prototype.getKey = function(id, callback) {
  return this.regularRequest({
    target: 'account/keys/'+id,
    method: 'GET'
  }, 'ssh_key', callback);
};

API.prototype.updateKey = function(id, cfg, callback) {
  return this.regularRequest({
    target:'account/keys/'+id+'/',
    method: 'PUT',
    body: cfg,
  }, 'ssh_key', callback);
};

API.prototype.deleteKey = function(id, callback) {
  return this.request({
    target:'account/keys/'+id+'/',
    method: 'DELETE',
  }, function(err, res) {
    if (err)
      callback(err, false);
    else
      callback(null, true);
  });
};


/******************************************************************************/
/******************************** Various *************************************/
/******************************************************************************/

API.prototype.listRegions = function(callback) {
  return this.paginatedRequest({
    target: 'regions',
    method: 'GET'
  }, 'regions', callback);
};

API.prototype.listSizes = function(callback) {
  return this.paginatedRequest({
    target: 'sizes',
    method: 'GET'
  }, 'sizes', callback);
};




/******************************************************************************/
/********************************* Tags ***************************************/
/******************************************************************************/

API.prototype.listTags = function(callback) {
  return this.paginatedRequest({
    target: 'tags',
    method: 'GET'
  }, 'tags', callback);
};

API.prototype.createTag = function(cfg, callback) {
  // cfg: {name: name,ip_address: ip,},
  this.regularRequest({
    target: 'tags',
    method: 'POST',
    body: cfg,
  }, 'tag', callback);
};

API.prototype.getTag = function(name, callback) {
  return this.regularRequest({
    target:'tags/'+name+'/',
    method: 'GET',
  }, 'tag', callback);
};

API.prototype.updateTag = function(name, cfg, callback) {
  return this.regularRequest({
    target:'tags/'+name+'/',
    method: 'PUT',
    body: cfg,
  }, 'tag', callback);
};

API.prototype.deleteTag = function(name, callback) {
  return this.request({
    target:'tags/'+name+'/',
    method: 'DELETE',
  }, function(err, res) {
    if (err)
      callback(err, false);
    else
      callback(null, true);
  });
};

API.prototype.tag = function(tag, resources, callback) {
  return this.regularRequest({
    target:'tags/'+tag+'/resources',
    method: 'POST',
    body: {
      "resources": resources,
    },
  }, 'resources', callback);
};

API.prototype.untag = function(tag, resources, callback) {
  return this.regularRequest({
    target:'tags/'+tag+'/resources',
    method: 'DELETE',
    body: {
      "resources": resources,
    },
  }, 'resources', callback);
};
