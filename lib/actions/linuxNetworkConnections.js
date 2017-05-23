'use strict';
const childProcess = require('child_process');
const os = require('os');
const processaLinha = require('./atom/processaLinhaNetConnection');


const processa = (line) => new Promise((resolve, reject) => {
    if (line[5].toUpperCase() != 'LISTENING' && (line[0].toUpperCase() != 'UDP' || line[0].toUpperCase() != 'UDP6')) {
        resolve(processaLinha(line));
    } else {
        reject(undefined);
    }
});

module.exports = (data) => new Promise((resolve, reject) => {
    try {
        childProcess.exec('netstat -na | egrep -i "tcp|udp|tcp6|udp6"', (err, stdout) => {
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
