'use strict';
const si = require('systeminformation');
module.exports = (data) => new Promise((resolve, reject) => {
    try {
      let gather = {};
      si.mem().then(result => {
        gather['linuxMemory'] = result;
        resolve(gather);
      }).catch(err => reject(err));
    } catch (e) {
        reject(e);
    };
});
