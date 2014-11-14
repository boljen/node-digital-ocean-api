var request = require('request');

module.exports = function(query, callback) {

  request({
    uri: query.uri,
    method: query.method,

  }, function(err, res) {
    if (err)
      return callback(err);

    var obj = {
      headers: res.headers,
      body: res.body,
      status: res.statusCode,
    };

    callback(null, obj);
  });

};
