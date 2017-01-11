'use strict';
const si = require('systeminformation');
module.exports = (data) => new Promise((resolve, reject) => {
    try {
        si.networkStats().then(result => {
            resolve(result);
        }).catch(err => reject(err));
    } catch (e) {
        reject(e);
    };
});
