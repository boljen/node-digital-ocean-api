/**
 * Digital Ocean API wrapper (v2)
 *
 * @param {Object} config
 * @param {String} config.token - The access token to authenticate the requests
 * @param {Function} config.requester - The requester implementation to be used
 * by the API to make HTTP requests. The API is built using the npm 'request'
 * module and as such your requester implementation should copy that interface.
 */
var API = function(cfg) {

  if (!cfg.requester)
    throw new Error("Expecting a requester, e.g. the npm request module");
  if (!cfg.token)
    throw new Error("Expecting an access token");

  this._token = cfg.token;
  this._requester = cfg.requester;

  this.ratelimit = null;
};

API.prototype._root = 'https://api.digitalocean.com/v2/';

/**
 * This builds a query object from the given configuration
 */
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

/**
 * This adds some important headers to the request
 */
API.prototype._addHeaders = function(qry) {
  qry.headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer '+this._token
  };
};

/**
 * Whenever a header is returned containing information about the rate limit,
 * this function will be called.
 */
API.prototype._parseRateLimit = function(rl){
  console.log('remaining requests: ', rl.remaining);
  this.rateLimit = rl;
};

/**
 * This wraps around the given request implementation
 */
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
      cb(null, body[page] ? body[page] : undefined);
    }
  });
};

API.prototype.getUserInformation = function(cb) {
  this._regularRequest({
    method: 'GET',
    target: 'account'
  }, 'account', cb);
};

API.prototype.listActions = function(cb) {
  this._request({
    method: 'GET',
    target: 'actions'
  }, 'actions', cb);
};

API.prototype.getAction = function(id, cb) {
  this._request({
    method: 'GET',
    target: 'actions/'+id
  }, cb);
};

API.prototype.listDomains = function(cb) {
  this._request({
    method: 'GET',
    target: 'domains'
  }, key, cb);
};

API.prototype.createDomain = function(name, ip, cb) {
/*  this._request({
    method: 'POST',
    target: 'domains'
  }, cb);*/
};

API.prototype.retrieveDomain = function(name) {

};

API.prototype.deleteDomain = function(name) {

};

API.prototype.listDomainRecords = function(domain) {

};

API.prototype.createDomainRecord = function() {

};

API.prototype.retrieveDomainRecord = function() {

};

API.prototype.updateDomainRecord = function() {

};

API.prototype.deleteDomainRecord = function() {

};

API.prototype.createDroplet = function() {

};

API.prototype.getDropletById = function(id) {

};

API.prototype.listDroplets = function() {

};

API.prototype.listAvailableKernels = function() {

};

API.prototype.getDropletSnapshots = function() {

};

API.prototype.getDropletBackups = function() {

};

API.prototype.getDropletActions = function() {

};

API.prototype.deleteDroplet = function() {

};

API.prototype.disableDropletBackups = function() {

};

API.prototype.rebootDroplet = function() {

};

API.prototype.powerCycleDroplet = function() {

};

API.prototype.shutdownDroplet = function() {

};

API.prototype.powerOffDroplet = function() {

};

API.prototype.powerOnDroplet = function() {

};

API.prototype.restoreDroplet = function() {

};

API.prototype.passwordResetDroplet = function() {

};

API.prototype.resizeDroplet = function() {

};

API.prototype.rebuildDroplet = function() {

};

API.prototype.renameDroplet = function() {

};

API.prototype.changeDropletKernel = function() {

};

API.prototype.enableIpv6Droplet = function() {

};

API.prototype.enableDropletPrivateNetwork = function() {

};

API.prototype.snapshotDroplet = function() {

};

API.prototype.getDropletAction = function() {

};

API.prototype.listImages = function() {

};

API.prototype.listDistributionImages = function() {

};

API.prototype.listApplicationImages = function() {

};

API.prototype.getImage = function(id) {

};

API.prototype.getImageBySlug = function(slug) {

};

API.prototype.updateImage = function() {

};

API.prototype.deleteImage = function() {

};

API.prototype.transferImage = function() {

};

API.prototype.getImageAction = function() {

};

API.prototype.listSSHKeys = function() {

};

API.prototype.createSSHKey = function() {

};

API.prototype.getSSHKey = function() {

};

API.prototype.updateSSHKey = function() {

};

API.prototype.destroyKey = function() {

};

API.prototype.listRegions = function(c) {
  this._request({
    method: 'GET',
    target: 'regions'
  }, 'regions', cb);
};

API.prototype.listSizes = function(cb) {
  this._request({
    method: 'GET',
    target: 'sizes'
  }, 'sizes', cb);
};

module.exports = API;
