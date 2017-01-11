'use strict';
const si = require('systeminformation');
module.exports = (data) => new Promise((resolve, reject) => {
    try {
        let gather = {};
        si.networkStats().then(result => {
            gather['networkStats'] = result;
            resolve(gather);
        }).catch(err => reject(err));
    } catch (e) {
        reject(e);
    };
});
