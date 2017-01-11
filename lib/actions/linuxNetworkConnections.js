'use strict';
const si = require('systeminformation');
module.exports = (data) => new Promise((resolve, reject) => {
    try {
        let gather = [];
        si.networkConnections().then(result => {
            let obj;
            result.forEach(obj => {
                if (obj.state != 'LISTEN') {
                    gather.push(obj);
                }
            });
            resolve(gather);
        }).catch(err => reject(err));
    } catch (e) {
        reject(e);
    };
});
