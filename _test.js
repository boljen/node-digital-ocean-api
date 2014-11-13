
var API = require('./')
  , Paginator = require('./lib/paginator');

var api = new API({
  token: require('./_token.js'),
  requester: require('request'),
});

function display(err, res) {
  console.log(res);
}

var setup = {
  actionId: 35394395,
  dropletId: 3146194,
};


///////// INTERNAL /////////
/*
api._request({
  target: 'actions',
  method: 'GET',
  limit: 10,
  page: 3,
}, display);

var paginator = new Paginator({
  qry: {
    target: 'actions',
    method: 'GET',
  },
  api: api,
  limit: 10,
  content: 'actions',
});
paginator.getPage(1, display);
paginator.getAll(display);
*/

///////// TEST METHODS /////////
/*

api.getUserInformation(display;
api.listActions().getAll(display);
api.getAction(setup.actionId, display);
api.listDomains().getAll(display);

createDomain
retrieveDomain
deleteDomain
listDomainRecords
retrieveDomainRecord
createDomainRecord
updateDomainRecord
deleteDomainRecord

api.listDroplets().getAll(display);
api.getDroplet(setup.dropletId, display);
api.listAvailableKernels(setup.dropletId, display);

*/
/*getDropletSnapshots
getDropletBackups
getDropletActions
createDroplet
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

api.listRegions(display);
api.listSizes(display);
*/
