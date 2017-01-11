'use strict';
const si = require('systeminformation');
const exec = require('child_process').exec;
module.exports = (data) => new Promise((resolve, reject) => {
    try {
        let gather = [];
        si.blockDevices().then(result => {
            let t;
            result.forEach((t) => {
                if (t.type === 'lvm') {
                    gather.push(t);
                }
            })
            resolve(gather);
        }).catch(err => reject(err));
    } catch (e) {
        reject(e);
    };
});