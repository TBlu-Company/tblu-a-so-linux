'use strict';
const exec = require('child_process').exec;
const _ = require('lodash');

module.exports = (data) => new Promise((resolve, reject) => {
  try {
    exec("cat /proc/cpuinfo", function(err, stdout) {
      if (!err) {
        let j = [];
        let arrayCPU = [];
        let lines = stdout.trim().split('\n');
        j.push({});
        lines.forEach(e => {
          let a = e.replace(/\t/g, '').split(':');
          let index = j.length - 1;
          // console.log(a + " - - " + a.length)
          if (a.length >= 2) {
            if (typeof a[0] != 'undefined') {
              let o = j[index];
              if (typeof a[1] != 'undefined') {
                o[a[0]] = a[1].trim();
              } else {
                o[a[0]] = "";
              }
            };
          } else {
            j.push({});
          };
        });
        j.forEach(e => {
          let index2 = _.findIndex(arrayCPU, function(o) {
            return o.socketID == Number(e['physical id']);
          });
          if (index2 <= -1) {
            let o = {};
            o['socketID'] = Number(e['physical id']);
            let flags = e['flags'].split(' ');
            if (flags.indexOf('lm') >= 0) {
              o['architecture'] = 64;
            } else {
              o['architecture'] = 32;
            }
            o['cores'] = Number(e['cpu cores']);
            o['thread'] = 0;
            o['vendor'] = e['vendor_id'];
            o['family'] = Number(e['cpu family']);
            o['model'] = Number(e['model']);
            o['stepping'] = Number(e['stepping']);
            o['name'] = e['model name'];
            o['flags'] = flags;
            arrayCPU.push(o);
            index2 = arrayCPU.length - 1;
          };
          let o = arrayCPU[index2];
          o['thread'] = o['thread'] + 1;
          // o['virtualization'] = e['physical id'];

        });
        // lscpu(arrayCPU).then(re => {
        //   resolve(re);
        // }).catch(e => {
        //   reject(e);
        // });
        resolve(arrayCPU);
      } else {
        reject(err);
      };
    });
  } catch (e) {
    reject(e);
  };
});
