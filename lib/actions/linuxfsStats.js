'use strict';
const exec = require('child_process').exec;
const _ = require('lodash');


const calcula = (item, oldItem, dBconfig) => new Promise((resolve, reject) => {
  item['rxDif'] = item.rx - oldItem.rx;
  item['wxDif'] = item.wx - oldItem.wx;
  item['totalDif'] = item['rxDif'] + item['wxDif'];
  resolve(item);
});

const enconta = (oldItemArray, dBconfig) => new Promise((resolve, reject) => {
  exec("lsblk -r | egrep '/|SWAP'", function(error, stdout) {
    let itens = [];
    let pALL = [];
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
              let index2 = _.findIndex(oldItemArray, function(o) {
                return o.disk == line[2];
              });
              let oldItem = {
                rx: 0,
                wx: 0
              };
              if (index2 >= 0) {
                oldItem = oldItemArray[index2];
              }
              pALL.push(calcula(itens[index1], oldItem, dBconfig));
            }
          })
          Promise.all(pALL).then(result => {
            resolve(result);
          }).catch(error => {
            reject(error);
          });
        } else {
          reject(error);
        }
      })
    } else {
      reject(error);
    }
  });
});

module.exports = (data, dBconfig) => new Promise((resolve, reject) => {
  try {
    let query = {
      name: "linuxFsStats"
    };
    dBconfig.findOne(query).exec(function(err, linuxFsStats) {
      if (err) {
        reject(err);
      } else {
        let oldItemArray;
        if (linuxFsStats == null) {
          oldItemArray = [];
        } else {
          oldItemArray = linuxFsStats.value;
        }
        enconta(oldItemArray, dBconfig).then(result => {
          let update = {
            name: "linuxFsStats",
            value: result
          };
          let options = {
            upsert: true
          };
          dBconfig.update(query, update, options, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        }).catch(error => reject(error));;
      };
    });
  } catch (e) {
    reject(e);
  };
});
