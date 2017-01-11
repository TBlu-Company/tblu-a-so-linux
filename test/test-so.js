'use strict';
const Datastore = require('nedb');
const path = require('path');
const dirname = path.dirname(__filename);
const dBconfig = new Datastore(dirname + '/config.db');
dBconfig.loadDatabase();
const core = require('../index.js');

describe('mLinuxMemory', function() {
    it('get mLinuxMemory', function(done) {
        let data = {};
        data['moduleFunction'] = "mLinuxMemory";
        core.run(data).then(result => {
            console.log(result);
            done();
        }).catch(error => {
            done(error);
        });
    });
});

describe('mLinuxCPU', function() {
    it('get mLinuxCPU', function(done) {
        let data = {};
        data['moduleFunction'] = "mLinuxCPU";
        core.run(data, dBconfig).then(result => {
            console.log(JSON.stringify(result));
            done();
        }).catch(error => {
            done(error);
        });
    });
});

describe('mLinuxFSSize', function() {
    it('get mLinuxFSSize', function(done) {
        let data = {};
        data['moduleFunction'] = "mLinuxFSSize";
        core.run(data).then(result => {
            console.log(result);
            done();
        }).catch(error => {
            done(error);
        });
    });
});

describe('mLinuxFSSizeLogical', function() {
    it('get mLinuxFSSizeLogical', function(done) {
        let data = {};
        data['moduleFunction'] = "mLinuxFSSizeLogical";
        core.run(data).then(result => {
            console.log(result);
            done();
        }).catch(error => {
            done(error);
        });
    });
});

describe('mLinuxNetworkConnectionsListen', function() {
    it('get mLinuxNetworkConnectionsListen', function(done) {
        let data = {};
        data['moduleFunction'] = "mLinuxNetworkConnectionsListen";
        core.run(data).then(result => {
            console.log(result);
            done();
        }).catch(error => {
            done(error);
        });
    });
});

describe('mLinuxNetworkConnections', function() {
    it('get mLinuxNetworkConnections', function(done) {
        let data = {};
        data['moduleFunction'] = "mLinuxNetworkConnections";
        core.run(data).then(result => {
            console.log(result);
            done();
        }).catch(error => {
            done(error);
        });
    });
});

describe('mLinuxNetworkIO', function() {
    it('get mLinuxNetworkIO', function(done) {
        let data = {};
        data['moduleFunction'] = "mLinuxNetworkIO";
        core.run(data).then(result => {
            console.log(result);
            done();
        }).catch(error => {
            done(error);
        });
    });
});
