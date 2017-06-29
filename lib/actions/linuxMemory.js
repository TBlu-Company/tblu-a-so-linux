'use strict';
const si = require('systeminformation');
module.exports = (data) => new Promise((resolve, reject) => {
  try {
    si.mem().then(result => {
      let retorno = {};
      retorno['memoryTotal'] = result.total;
      retorno['memoryFree'] = result.free;
      retorno['memoryActive'] = result.active;
      retorno['memoryAvailable'] = result.available;
      retorno['memoryBuffcache'] = result.buffcache;
      retorno['memoryUsed'] = result.used;
      retorno['swapTotal'] = result.swaptotal;
      retorno['swapUsed'] = result.swapused;
      retorno['swapFree'] = result.swapfree;
      resolve(retorno);
    }).catch(err => reject(err));
  } catch (e) {
    reject(e);
  };
});
