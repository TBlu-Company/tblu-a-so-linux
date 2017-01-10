'use strict';

const core = require('../index.js');

describe('mOSCPU', function() {
    it('get mOSCPU', function(done) {
        let data = {};
        data['moduleFunction'] = "mOSCPU";
        core.run(data).then(result => {
            console.log(result);
            done();
        }).catch(error => {
            done(error);
        });
    });
});

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

describe('mLinuxBlockDevice', function() {
    it('get mLinuxBlockDevice', function(done) {
        let data = {};
        data['moduleFunction'] = "mLinuxBlockDevice";
        core.run(data).then(result => {
            console.log(result);
            done();
        }).catch(error => {
            done(error);
        });
    });
});
