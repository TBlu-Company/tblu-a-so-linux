'use strict';
const childProcess = require('child_process');
const os = require('os');
const processaLinha = require('./atom/processaLinhaNetConnection');



function testaLinha(line) {
  if (line[5].toUpperCase() == 'LISTENING') {
    return true;
  } else if (line[5].toUpperCase() == 'LISTEN') {
    return true;
  } else if (line[0].toUpperCase() == 'UDP' || line[0].toUpperCase() == 'UDP6') {
    if (typeof line[5] == 'undefined') {
      return true;
    } else {
      if (line[5] == '') {
        return true;
      }
    }
  }
  return false;
}

const processa = (line) => new Promise((resolve, reject) => {
  if (testaLinha(line)) {
    resolve(processaLinha(line));
  } else {
    reject(undefined);
  }
});

module.exports = (data) => new Promise((resolve, reject) => {
  try {
    childProcess.exec('netstat -na | egrep -i "tcp|udp|tcp6|udp6" | egrep -iv "ESTABLISHED|SYN_SENT|SYN_RECV|FIN_WAIT1|FIN_WAIT2|TIME_WAIT|CLOSE|CLOSE_WAIT|LAST_ACK|CLOSING|UNKNOWN"', {
      maxBuffer: 1000 * 1024
    }, (err, stdout) => {
      if (err) {
        reject(err);
      }
      let result = [];
      let lines = stdout.trim().split(os.EOL);
      lines.forEach((line) => {
        line = line.replace(/ +/g, " ").split(' ');
        processa(line).then((resultline) => {
          result.push(resultline);
        }).catch((e) => {});
      });
      resolve(result);
    });
  } catch (e) {
    reject(e);
  };
});
