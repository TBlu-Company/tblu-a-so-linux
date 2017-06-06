'use strict';
const Datastore = require('nedb');
const path = require('path');
const dirname = path.dirname(__filename);
const tempDB = new Datastore(dirname + '/tempDB.db');
tempDB.loadDatabase();
const core = require('../index.js');

// describe('mLinuxMemory', function() {
//   it('get mLinuxMemory', function(done) {
//     let data = {};
//     data['moduleFunction'] = "mLinuxMemory";
//     core.run(data).then(result => {
//       console.log(result);
//       done();
//     }).catch(error => {
//       done(error);
//     });
//   });
// });
//
//
// describe('mLinuxFSFisic', function() {
//   it('get mLinuxFSFisic', function(done) {
//     let data = {};
//     data['moduleFunction'] = "mLinuxFSFisic";
//     core.run(data).then(result => {
//       console.log(result);
//       done();
//     }).catch(error => {
//       done(error);
//     });
//   });
// });
//
// describe('mLinuxFSLogic', function() {
//   it('get mLinuxFSLogic', function(done) {
//     let data = {};
//     data['moduleFunction'] = "mLinuxFSLogic";
//     core.run(data).then(result => {
//       console.log(result);
//       done();
//     }).catch(error => {
//       done(error);
//     });
//   });
// });

// describe('mLinuxNetworkConnectionsListen', function() {
//   it('get mLinuxNetworkConnectionsListen', function(done) {
//     let data = {};
//     data['moduleFunction'] = "mLinuxNetworkConnectionsListen";
//     core.run(data).then(result => {
//       console.log(result);
//       done();
//     }).catch(error => {
//       done(error);
//     });
//   });
// });
//
// describe('mLinuxNetworkConnections', function() {
//   it('get mLinuxNetworkConnections', function(done) {
//     let data = {};
//     data['moduleFunction'] = "mLinuxNetworkConnections";
//     core.run(data).then(result => {
//       console.log(result);
//       done();
//     }).catch(error => {
//       done(error);
//     });
//   });
// });

// describe('mLinuxNetworkIO', function() {
//   it('get mLinuxNetworkIO', function(done) {
//     let data = {};
//     data['moduleFunction'] = "mLinuxNetworkIO";
//     core.run(data, tempDB).then(result => {
//       console.log(result);
//       done();
//     }).catch(error => {
//       done(error);
//     });
//   });
// });
// describe('mLinuxNetworkInterfaces', function() {
//   it('get mLinuxNetworkInterfaces', function(done) {
//     let data = {};
//     data['moduleFunction'] = "mLinuxNetworkInterfaces";
//     core.run(data, tempDB).then(result => {
//       console.log(result);
//       done();
//     }).catch(error => {
//       done(error);
//     });
//   });
// });
//
//
//
// describe('mLinuxCPUInfo', function() {
//   it('get mLinuxCPUInfo', function(done) {
//     let data = {};
//     data['moduleFunction'] = "mLinuxCPUInfo";
//     core.run(data).then(result => {
//       console.log(result);
//       done();
//     }).catch(error => {
//       done(error);
//     });
//   });
// });
//
// describe('mLinuxCPUTemperature', function() {
//   it('get mLinuxCPUTemperature', function(done) {
//     let data = {};
//     data['moduleFunction'] = "mLinuxCPUTemperature";
//     core.run(data).then(result => {
//       console.log(result);
//       done();
//     }).catch(error => {
//       done(error);
//     });
//   });
// });
//
// describe('mlinuxDiskIO', function() {
//   it('get mlinuxDiskIO', function(done) {
//     let data = {};
//     data['moduleFunction'] = "mlinuxDiskIO";
//     core.run(data, tempDB).then(result => {
//       console.log(result);
//       done();
//     }).catch(error => {
//       done(error);
//     });
//   });
describe('mLinuxSysctl', function() {
  it('get mLinuxSysctl', function(done) {
    let data = {};
    data['moduleFunction'] = "mLinuxSysctl";
    core.run(data, tempDB).then(result => {
      // console.log(result);
      console.log(JSON.stringify(result));
      done();
    }).catch(error => {
      done(error);
    });
  });
});
