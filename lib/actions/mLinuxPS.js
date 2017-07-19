'use strict';
const shellParser = require('./atom/nodeShell');
const child = require('child_process');
module.exports = (data) => new Promise((resolve, reject) => {
  try {
    let args = [];
    args.push('-ew')
    args.push('-o')
    args.push('pid:10,ppid:10,uname:30,args')
    let process = child.spawn('ps', args);
    let shellOutput = '';

    process.stdout.on('data', function(chunk) {
      shellOutput += chunk;
    });

    process.stdout.on('end', function() {
      resolve(shellParser(shellOutput));
    });
    // si.mem().then(result => {
    //   let retorno = {};
    //   retorno['memoryTotal'] = result.total;
    //   retorno['memoryFree'] = result.free;
    //   retorno['memoryActive'] = result.active;
    //   retorno['memoryAvailable'] = result.available;
    //   retorno['memoryBuffcache'] = result.buffcache;
    //   retorno['memoryUsed'] = result.used;
    //   retorno['swapTotal'] = result.swaptotal;
    //   retorno['swapUsed'] = result.swapused;
    //   retorno['swapFree'] = result.swapfree;
    //   resolve(retorno);
    // }).catch(err => reject(err));
  } catch (e) {
    reject(e);
  };
});
