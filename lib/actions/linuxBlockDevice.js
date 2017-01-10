'use strict';
const si = require('systeminformation');
module.exports = (data) => new Promise((resolve, reject) => {
    try {
        let gather = {};
        si.fsSize().then(result => {
            gather['linuxBlockDevice'] = result;
            resolve(gather);
        }).catch(err => reject(err));
    } catch (e) {
        reject(e);
    };
});
