'use strict';
const si = require('systeminformation');

const calcula = (n, dBconfig) => new Promise((resolve, reject) => {

  let query = {
    iface: n.iface
  };
  dBconfig.findOne(query).exec(function(err, o) {
    if (err) {
      reject(err);
    } else {
      if (o == null || o.value.rx > n.rx || o.value.tx > n.tx) {
        o = {};
        o['value'] = {
          rx: 0,
          tx: 0,
        };
      };
      si.networkStats(n.iface).then(n => {
        n['rxDif'] = n.rx - o.value.rx;
        n['txDif'] = n.tx - o.value.tx;
        n['totalDif'] = n['rxDif'] + n['txDif'];
        let update = {
          iface: n.iface,
          value: n
        };
        let options = {
          upsert: true
        };
        dBconfig.update(query, update, options, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(n);
          }
        });
      }).catch(err => reject(err));
    };
  });
});



module.exports = (data, dBconfig) => new Promise((resolve, reject) => {
  try {
    si.networkInterfaces().then(iface => {
      let actions = iface.map((n) => {
        return calcula(n, dBconfig);
      });
      Promise.all(actions).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err)
      });
    }).catch(err => {
      reject(err)
    });
  } catch (e) {
    reject(e);
  };
});
