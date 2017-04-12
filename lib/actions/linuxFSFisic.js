'use strict';
const si = require('systeminformation');

const format = (item) => new Promise((resolve, reject) => {
    if (item.type === 'lvm') {
        delete item['model'];
        delete item['serial'];
        delete item['protocol'];
        resolve(item);
    } else {
        resolve(item);
    };
});

module.exports = (data) => new Promise((resolve, reject) => {
    try {
        si.blockDevices().then(result => {
            let actions = result.map(format);
            Promise.all(actions).then(res =>
                resolve(res.filter(function(n) {
                    return n != undefined
                })));
        }).catch(err => reject(err));
    } catch (e) {
        reject(e);
    };
});