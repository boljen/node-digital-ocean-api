var request = require('request');

module.exports = function(query, callback) {
  console.log(query);
  request({
    uri: query.uri,
    method: query.method,
    headers: query.headers,
  }, function(err, res) {
    if (err)
      return callback(err);

    var obj = {
      headers: res.headers,
      body: JSON.parse(res.body),
      status: res.statusCode,
    };

    callback(null, obj);
  });

};
