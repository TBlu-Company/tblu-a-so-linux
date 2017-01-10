'use strict';
const os = require('os');
const exec = require('child_process').exec;


const calculaCore = (newCore, oldCore, index) => new Promise((resolve, reject) => {
    if (typeof oldCore == 'undefined') {
        console.log('---------------- Fodeu ----------')
        oldCore = {
            times: {
                user: 0,
                nice: 0,
                sys: 0,
                idle: 0,
                iowait: 0,
                irq: 0
            },
            totalTimes: 0,
        };
    };
    let totalN = newCore.times.user + newCore.times.nice + newCore.times.sys + newCore.times.idle + newCore.times.iowait + newCore.times.irq;
    let userAvg = newCore.times.user - oldCore.times.user;
    let niceAvg = newCore.times.nice - oldCore.times.nice;
    let sysAvg = newCore.times.sys - oldCore.times.sys;
    let idleAvg = newCore.times.idle - oldCore.times.idle;
    let iowaitAvg = newCore.times.iowait - oldCore.times.iowait;
    let irqAvg = newCore.times.irq - oldCore.times.irq;
    let totalAvg = totalN - oldCore.totalTimes;

    let userPerc = ((userAvg * 100) / totalAvg).toFixed(3);
    let nicePerc = ((niceAvg * 100) / totalAvg).toFixed(3);
    let sysPerc = ((sysAvg * 100) / totalAvg).toFixed(3);
    let idlePerc = ((idleAvg * 100) / totalAvg).toFixed(3);
    let iowaitPerc = ((iowaitAvg * 100) / totalAvg).toFixed(3);
    let irqPerc = ((irqAvg * 100) / totalAvg).toFixed(3);

    let result = {
        cpu: index,
        times: {
            user: newCore.times.user,
            nice: newCore.times.nice,
            sys: newCore.times.sys,
            idle: newCore.times.idle,
            iowait: newCore.times.iowait,
            irq: newCore.times.irq
        },
        avg: {
            user: userPerc,
            nice: nicePerc,
            sys: sysPerc,
            idle: idlePerc,
            iowait: iowaitPerc,
            irq: irqPerc
        },
        totalTimes: totalN
    };
    resolve(result);
});

const calculaCPU = (newCPU, oldCPU) => new Promise((resolve, reject) => {
    let actions = [];
    newCPU.forEach((e, i) => {
        actions.push(calculaCore(e, oldCPU[i], i));
    });
    let results = Promise.all(actions);
    results.then(result => resolve(result)).catch(error => reject(error));

});


const getCPU = () => new Promise((resolve, reject) => {
    try {
        exec("cat /proc/stat | grep cpu", function(error, stdout) {
            if (error) {
                reject(error)
            } else {
                let lines = stdout.toString().trim().split('\n');
                lines.splice(0, 1);
                lines.forEach(function(line, index) {
                    let sline = line.split('\ ')
                    let pline = {
                        core: sline[0],
                        times: {
                            user: parseInt(sline[1]),
                            nice: parseInt(sline[2]),
                            sys: parseInt(sline[3]),
                            idle: parseInt(sline[4]),
                            iowait: parseInt(sline[5]),
                            irq: parseInt(sline[6]),
                        }
                    };
                    pline['totalTimes'] = pline.times.user + pline.times.nice + pline.times.sys + pline.times.idle + pline.times.iowait + pline.times.irq;
                    lines[index] = pline;
                });
                resolve(lines);
            };
        });
    } catch (e) {
        reject(e);
    };

});

module.exports = (data, dBconfig) => new Promise((resolve, reject) => {

    try {
        let gather = {};
        let query = {
            name: "linuxCPU"
        };
        dBconfig.findOne(query).exec(function(err, oldCPU) {
            if (err) {
                reject(err);
            } else {
                if (oldCPU == null) {
                    oldCPU = {};
                    oldCPU['value'] = [];
                }
                let newCPU = getCPU().then(result => {
                    newCPU = result;
                    calculaCPU(newCPU, oldCPU.value).then(result => {
                        gather['cpu'] = result;
                        let update = {
                            name: "linuxCPU",
                            value: result
                        };
                        let options = {
                            upsert: true
                        };
                        dBconfig.update(query, update, options, (err, data) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(gather);
                            }
                        });
                    }).catch(error => reject(error));
                }).catch(error => reject(error));;
            };
        });
    } catch (e) {
        reject(e);
    };
});
