
var API = require('./')
  , Paginator = require('./lib/paginator');

var api = new API({
  token: require('./_token.js'),
  requester: require('request'),
});

var setup = {
  actionId: 35394395
};

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

api.listActions().getAll(function(e, acts) {
  console.log(acts.length);
});

api.getAction(setup.actionId, function(err, res) {
  console.log(res);
});

api.listDomains().getAll(function(err, list) {
  console.log(list);
});
createDomain
retrieveDomain
deleteDomain
listDomainRecords
retrieveDomainRecord
createDomainRecord
updateDomainRecord
deleteDomainRecord
createDroplet
getDropletById
*/
api.listDroplets().getAll(function(err, list) {
  console.log(list);
});

/*listAvailableKernels
getDropletSnapshots
getDropletBackups
getDropletActions
deleteDroplet
disableDropletBackups
rebootDroplet
powerCycleDroplet
shutdownDroplet
powerOffDroplet
powerOnDroplet
restoreDroplet
passwordResetDroplet
resizeDroplet
rebuildDroplet
renameDroplet
changeDropletKernel
enableIpv6Droplet
enableDropletPrivateNetwork
snapshotDroplet
getDropletAction
listImages
listDistributionImages
listApplicationImages
getImage
getImageBySlug
updateImage
deleteImage
transferImage
getImageAction
listSSHKeys
createSSHKey
getSSHKey
updateSSHKey
destroyKey
listRegions
listSizes
*/
