'use strict';
const Datastore = require('nedb');
const path = require('path');
const dirname = path.dirname(__filename);
const dBconfig = new Datastore(dirname + '/config.db');
dBconfig.loadDatabase();

const core = require('../index.js');
describe('mLinuxCPUInfo', function() {
  it('get mLinuxCPUInfo', function(done) {
    let data = {};
    data['moduleFunction'] = "mLinuxCPUInfo";
    core.run(data).then(result => {
      console.log(result);
      done();
    }).catch(error => {
      done(error);
    });
  });
});
