'use strict';
const shellParser = require('./atom/nodeShell');
const child = require('child_process');
module.exports = (data) => new Promise((resolve, reject) => {
  try {
    let args = [];
    args.push('-a')
    args.push('-o')
    args.push('pid:10,ppid:10,uname:30,uid:10,lstart:30,tty:10,comm:30,args')
    let process = child.spawn('ps', args);
    let shellOutput = '';
    let logError = '';

    process.stdout.on('data', function(chunk) {
      shellOutput += chunk;
    });

    process.stderr.on('data', (data) => {
      logError += data;
    });

    process.stderr.on('end', function() {
      reject(new Error(logError))
    })

    process.stdout.on('end', function() {
      let header = [{
        label: 'pid',
        start: 1,
        chars: 10,
        type: 'nummber'
      }, {
        label: 'ppid',
        start: 11,
        chars: 10,
        type: 'nummber'
      }, {
        label: 'user',
        start: 22,
        chars: 30,
        type: 'text'
      }, {
        label: 'uid',
        start: 53,
        chars: 10,
        type: 'nummber'
      }, {
        label: 'timeStartCommand',
        start: 64,
        chars: 30,
        type: 'date'
      }, {
        label: 'tty',
        start: 95,
        chars: 10,
        type: 'text'
      }, {
        label: 'nativeCommand',
        start: 106,
        chars: 30,
        type: 'text'
      }, {
        label: 'realCommand',
        start: 137,
        chars: undefined,
        type: 'text'
      }];
      resolve(shellParser(shellOutput, {
        removeHeader: true
      }, header));
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
