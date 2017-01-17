'use strict';
const si = require('systeminformation');

const format = (item) => new Promise((resolve, reject) => {
    if (item.state != 'LISTEN') {
        resolve(item);
    } else {
        resolve(undefined);
    };
});

module.exports = (data) => new Promise((resolve, reject) => {
    try {
        si.networkConnections().then(result => {
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
