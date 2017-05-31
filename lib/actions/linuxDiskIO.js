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
      return o.disk == e.disk;
    });
    actions.push(calculaItem(e, oldI[index1]));
  });
  let results = Promise.all(actions);
  results.then(result => resolve(result)).catch(error => reject(error));

});

const getNew = () => new Promise((resolve, reject) => {
  exec("lsblk -r | egrep '/|SWAP'", function(error, stdout) {
    let itens = [];
    if (!error) {
      let lines = stdout.toString().split('\n');
      let fs_filter = [];
      lines.forEach(function(line) {
        if (line !== '') {
          line = line.trim().split(' ');
          if (fs_filter.indexOf(line[0]) === -1) {
            fs_filter.push(line[0])
            itens.push({
              mount: line[6],
              disk: line[0]
            });
          }
        }
      });
      let output = fs_filter.join('|');
      exec("cat /proc/diskstats | egrep '" + output + "'", function(error, stdout) {
        if (!error) {
          let lines = stdout.toString().split('\n');
          lines.forEach(function(line) {
            line = line.trim();
            if (line !== '') {
              line = line.replace(/ +/g, " ").split(' ');
              let index1 = _.findIndex(itens, function(o) {
                return o.disk == line[2];
              });
              itens[index1].rx = parseInt(line[5]) * 512;
              itens[index1].wx = parseInt(line[9]) * 512;
            }
          })
          resolve(itens);
        } else {
          reject(error);
        }
      })
    } else {
      reject(error);
    }
  });
});

const getOld = (tempDB) => new Promise((resolve, reject) => {
  let query = {
    name: "linuxFsStats"
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
    reject(new Error('restart'))
  } else {
    resolve(true);
  };

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
              name: "linuxFsStats"
            };
            let update = {
              name: "linuxFsStats",
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
        }).catch(error => {
          getNew().then((newI1) => {
            calcula(newI1, newI).then(result => {
              let query = {
                name: "linuxFsStats"
              };
              let update = {
                name: "linuxFsStats",
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
  };
});
