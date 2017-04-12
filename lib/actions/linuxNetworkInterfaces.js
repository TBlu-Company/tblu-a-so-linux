'use strict';
const si = require('systeminformation');
module.exports = (data) => new Promise((resolve, reject) => {
    try {
        let gather = {};
        si.networkInterfaces().then(result => {
            gather['interfaces'] = result;
            reject("Usar o de General pois eh a mesma informacao")
            // resolve(gather);
        }).catch(err => reject(err));
    } catch (e) {
        reject(e);
    };
});
