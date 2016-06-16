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
  actionId: '35394395',
  dropletId: 17514664,
  image: 17154032, // ubuntu 14.04.4
  dropletAction: 1234,
};

/*
api.listKeys().getAll(display)
var dummyDomain = "ndoapi-example.com"
api.listDomains(display)
api.createDomain({
  name: dummyDomain,
  ip_address: "127.0.0.1",
}, display)
api.getDomain(dummyDomain, display)
api.deleteDomain(dummyDomain, display)

var dummyRecord = {
  "type": "A",
  "name": "www",
  "data": "127.0.0.1",
  "priority": null,
  "port": null,
  "weight": null
}

// Set this manually
var dummyRecordID = 0

api.listDomainRecords(dummyDomain, display)
api.listDomainRecords(dummyDomain).getAll(display);
api.createDomainRecord(dummyDomain, dummyRecord, display)
api.getDomainRecord(dummyDomain, dummyRecordID, display)
var updateConfig = {name: "www2"}
api.updateDomainRecord(dummyDomain, dummyRecordID, updateConfig, display)
api.deleteDomainRecord(dummyDomain, dummyRecordID, display)



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

api.paginatedRequest({
  target: 'actions',
  method: 'GET',
}, 'actions').getAll(display);

// METHODS //

api.getUserInfo(display);

api.listActions().getAll(display);
api.getAction(setup.actionId, display);

api.listDroplets().getAll(display);
api.listDropletsByTag("test").getAll(display);

api.getDroplet(setup.dropletId, display);
api.listAvailableKernels(setup.dropletId, display);
api.listDropletSnapshots(setup.dropletId, display);
api.listDropletBackups(setup.dropletId, display);
api.listDropletActions(setup.dropletId, display);
api.deleteDroplet(setup.dropletId, display);
api.deleteDropletsByTag("test", display);

api.enableDropletBackups(setup.dropletId, display)
api.powerOffDroplet(setup.dropletId, display);
api.powerOnDroplet(setup.dropletId, display);

api.createDroplet({
  name: 'test',
  image: setup.image,
  size: '512mb',
  region: 'ams2',
}, display);

api.listImages(display);
api.listDistributionImages(display)
api.listApplicationImages(display)

api.listRegions().getAll(display);
api.listSizes().getAll(display);



api.listKeys().getAll(display)
api.createKey({
  name: "dummy-key-name",
  public_key: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAAAQQDDHr/jh2Jy4yALcK4JyWbVkPRaWmhck3IgCoeOO3z1e2dBowLh64QAM+Qb72pxekALga2oi4GvT+TlWNhzPH4V example",
}, display)
var dummyKeyID = 0
api.getKey(dummyKeyID, display)
api.updateKey(dummyKeyID, {
  name: "new-dummy-key-name",
}, display)
api.deleteKey(dummyKeyID, display)




api.listTags(display)
api.createTag({name: "test_tag"}, display)
api.deleteTag("test_tag_2", display)
api.getTag("test_tag_2", display)
api.updateTag("test_tag", {name: "test_tag_2"}, display)

api.enableDropletBackups(setup.dropletId, display)
api.disableDropletBackups("test_tag", true, display)


api.listDropletsByTag("test_tag", display)

api.untag("test_tag", [{
  resource_id: setup.dropletId,
  resource_type: "droplet",
}], display)







api.disableDropletBackups
api.rebootDroplet
api.powerCycleDroplet
api.shutdownDroplet
api.restoreDroplet
api.passwordResetDroplet
api.resizeDroplet
api.rebuildDroplet
api.renameDroplet
api.changeDropletKernel
api.enableIpv6Droplet
api.enableDropletPrivateNetwork
api.snapshotDroplet

// Manually test:

api.getDropletAction
api.getImage
api.getImageBySlug
api.updateImage
api.deleteImage
api.transferImage
api.getImageAction

api.listDropletsByTag
api.deleteDropletsByTag



*/
