'use strict';
const si = require('systeminformation');
const getOld = (iface, tempDB) => new Promise((resolve, reject) => {
  let query = {
    iface: iface
  };
  tempDB.findOne(query).exec((err, o) => {
    if (err) {
      reject(err);
    } else {
      if (o == null) {
        process.nextTick(() => {
          getNew(iface).then(n => {
            resolve(n);
          }).catch(err => reject(err));
        });
      } else {
        resolve(o.value);
      }
    }
  });
});

const getNew = (iface) => new Promise((resolve, reject) => {
  si.networkStats(iface).then(n => {
    resolve(n);
  }).catch(err => reject(err));
});

const calculaNewOld = (newI, oldI, tempDB) => new Promise((resolve, reject) => {
  newI['rxDif'] = newI.rx - oldI.rx;
  newI['txDif'] = newI.tx - oldI.tx;
  newI['totalDif'] = newI['rxDif'] + newI['txDif'];
  let query = {
    iface: newI.iface
  };
  let update = {
    iface: newI.iface,
    value: newI
  };
  let options = {
    upsert: true
  };
  tempDB.update(query, update, options, (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(newI);
    }
  });
});

const calcula = (n, tempDB) => new Promise((resolve, reject) => {
  getOld(n.iface, tempDB).then(oldI => {
    getNew(n.iface).then(newI => {
      if (oldI.rx > newI.rx || oldI.tx > newI.tx) {
        process.nextTick(() => {
          getNew(n.iface).then(newI1 => {
            calculaNewOld(newI1, newI, tempDB).then(result => {
              resolve(result);
            }).catch(err => reject(err));
          }).catch(err => reject(err));
        });
      } else {
        calculaNewOld(newI, oldI, tempDB).then(result => {
          resolve(result);
        }).catch(err => reject(err));
      };
    }).catch(err => reject(err));
  }).catch(err => reject(err));
});

module.exports = (data, tempDB) => new Promise((resolve, reject) => {
  try {
    si.networkInterfaces().then(iface => {
      let actions = iface.map((n) => {
        return calcula(n, tempDB);
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
