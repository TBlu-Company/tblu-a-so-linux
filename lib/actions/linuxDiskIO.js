'use strict';
const exec = require('child_process').exec;
const _ = require('lodash');


const calculaItem = (newI, oldI) => new Promise((resolve, reject) => {
  newI['rxDif'] = newI.rx - oldI.rx;
  newI['wxDif'] = newI.wx - oldI.wx;
  newI['totalDif'] = newI['rxDif'] + newI['wxDif'];
  resolve(newI);
});

const calcula = (newI, oldI) => new Promise((resolve, reject) => {
  let actions = [];
  newI.forEach((e) => {
    let index1 = _.findIndex(oldI, function(o) {
      return o.name === e.name;
    });
    actions.push(calculaItem(e, oldI[index1]));
  });
  let results = Promise.all(actions);
  results.then(result => resolve(result)).catch(error => reject(error));
});

const getNew = () => new Promise((resolve, reject) => {
  exec('lsblk -r ', function(error, stdout) {
    let itens = [];
    if (!error) {
      let lines = stdout.toString().split('\n');
      lines.shift();
      lines.forEach(function(line) {
        if (line !== '') {
          line = line.trim().split(' ');
          itens.push({
            name: line[0],
            major: line[1].split(':')[0],
            minor: line[1].split(':')[1],
            type: line[5],
            mount: line[6]
          });
        }
      });
      exec('cat /proc/diskstats', function(error, stdout) {
        if (!error) {
          let lines = stdout.toString().split('\n');
          lines.forEach(function(line) {
            line = line.trim();
            if (line !== '') {
              line = line.replace(/ +/g, ' ').split(' ');
              let disk = _.find(itens, function(o) {
                return (o.major === line[0] && o.minor === line[1]);
              });
              if (disk) {
                disk.rx = parseInt(line[5]) * 512;
                disk.wx = parseInt(line[9]) * 512;
              }
            }
          });
          resolve(itens);
        } else {
          reject(error);
        }
      });
    } else {
      reject(error);
    }
  });
});

const getOld = (tempDB) => new Promise((resolve, reject) => {
  let query = {
    name: 'linuxFsStats'
  };
  tempDB.findOne(query).exec(function(err, linuxFsStats) {
    if (err) {
      reject(err);
    } else {
      if (linuxFsStats == null) {
        process.nextTick(() => {
          getNew().then((oldI1) => {
            resolve(oldI1);
          }).catch(error => reject(error));
        });
      } else {
        resolve(linuxFsStats.value);
      }
    }
  });
});

const testRestart = (newI, oldI) => new Promise((resolve, reject) => {
  if (newI.rx - oldI.rx < 0) {
    reject(new Error('restart'));
  } else {
    resolve(true);
  }
});

module.exports = (data, tempDB) => new Promise((resolve, reject) => {
  try {
    getOld(tempDB).then((oldI) => {
      getNew().then((newI) => {
        let actions = [];
        newI.forEach((e, i) => {
          actions.push(testRestart(e, oldI[i], i));
        });
        let results = Promise.all(actions);
        results.then(result => {
          calcula(newI, oldI).then(result => {
            let query = {
              name: 'linuxFsStats'
            };
            let update = {
              name: 'linuxFsStats',
              value: result
            };
            let options = {
              upsert: true
            };
            tempDB.update(query, update, options, (err, data) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            });
          }).catch(error => reject(error));
        }).catch(error1 => {
          getNew().then((newI1) => {
            calcula(newI1, newI).then(result => {
              let query = {
                name: 'linuxFsStats'
              };
              let update = {
                name: 'linuxFsStats',
                value: result
              };
              let options = {
                upsert: true
              };
              tempDB.update(query, update, options, (err, data) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(result);
                }
              });
            }).catch(error => reject(error));
          }).catch(error => reject(error));
        });
      }).catch(error => reject(error));
    }).catch(error => reject(error));
  } catch (e) {
    reject(e);
  }
});
