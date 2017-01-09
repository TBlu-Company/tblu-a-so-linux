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
