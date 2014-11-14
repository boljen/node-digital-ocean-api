var DummyRequest = function(responses) {
  if (!responses)
    responses= {};
  this.responses = {};
  this._root = 'https://api.digitalocean.com/v2/';
};

DummyRequest.prototype.add = function(uri, response) {
  this.responses[uri] = response;
};

DummyRequest.prototype.getClosure = function() {
  var self = this;

  return function(query, callback) {
    if (self.responses[query.uri]) {
    } else {
    }
  };
};

module.exports = DummyRequest;
