
var API = require('./')
  , Paginator = require('./lib/paginator');

var api = new API({
  token: require('./_token.js'),
  requester: require('request'),
});


///////// TEST REQUEST METHOD /////////
/*
api._request({
  target: 'actions',
  method: 'GET',
  limit: 10,
  page: 3,
}, function(e, b) {
  console.log(b);
});
*/

///////// TEST PAGINATOR METHOD /////////
/*
var paginator = new Paginator({
  qry: {
    target: 'actions',
    method: 'GET',
  },
  api: api,
  limit: 10,
  content: 'actions',
});
paginator.getPage(1, function(error, actions) {
  console.log(actions);
});
paginator.getAll(function(err, actions) {
  console.log(actions.length);
});
*/

///////// TEST METHODS /////////
/*
api.getUserInformation(function(e, info) {
  console.log(info);
});
*/

api.listActions().getAll(function(e, acts) {
  console.log(acts.length);
});



/*
api.listSizes(function(err, data) {
  console.log(data);
});

api.listRegions(function(e, d) {
  console.log(d);
});
*/
