/* Contains basic integration testing */

var API = require('./');

var api = new API({
  token: require('./_token.js'),
});

function display(err, data) {
  if (err)
    return console.log('ERROR:', err, '\nBODY:', data);
  console.log(data);
}

var setup = {
  actionId: 35394395,
  dropletId: 3146914,
};

/*
api.request({
  target: 'actions',
  method: 'GET',
  limit: 10,
  page: 2,
}, display);

api.regularRequest({
  target: 'actions',
  method: 'GET',
}, 'actions', display);

var paginator = api.paginatedRequest({
  target: 'actions',
  method: 'GET',
}, 'actions');

paginator.getAll(display);

api.getUserInfo(display);
api.listActions().getAll(display);
*/

/*
api.getAction(setup.actionId, display);
api.listDomains().getAll(display);
api.createDomain
api.retrieveDomain
api.deleteDomain
api.listDomainRecords
api.retrieveDomainRecord
api.createDomainRecord
api.updateDomainRecord
api.deleteDomainRecord
api.listDroplets().getAll(display);
api.getDroplet(setup.dropletId, display);
api.listAvailableKernels(setup.dropletId, display);
api.getDropletSnapshots(setup.dropletId, display);
api.getDropletBackups(setup.dropletId, display);
api.getDropletActions(setup.dropletId, display);
api.createDroplet
api.deleteDroplet(setup.dropletId, display);
api.deleteDroplet
api.disableDropletBackups
api.rebootDroplet
api.powerCycleDroplet
api.shutdownDroplet
api.powerOffDroplet
api.powerOnDroplet
api.restoreDroplet
api.passwordResetDroplet
api.resizeDroplet
api.rebuildDroplet
api.renameDroplet
api.changeDropletKernel
api.enableIpv6Droplet
api.enableDropletPrivateNetwork
api.snapshotDroplet
api.getDropletAction
api.listImages
api.listDistributionImages
api.listApplicationImages
api.getImage
api.getImageBySlug
api.updateImage
api.deleteImage
api.transferImage
api.getImageAction
api.listSSHKeys
api.createSSHKey
api.getSSHKey
api.updateSSHKey
api.destroyKey
api.listRegions(display);
api.listSizes(display);
*/
