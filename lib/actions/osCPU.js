'use strict';
const os = require('os');
const exec = require('child_process').exec;
module.exports = (data) => new Promise((resolve, reject) => {
    try {
        let gather = {};
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
                        user: parseInt(sline[1]),
                        nice: parseInt(sline[2]),
                        system: parseInt(sline[3]),
                        idle: parseInt(sline[4]),
                        iowait: parseInt(sline[5])
                    };
                    let totalTime = pline.user + pline.nice + pline.system + pline.idle + pline.iowait;
                    pline.user = Number((pline.user * 100) / totalTime).toFixed(3);
                    pline.nice = Number((pline.nice * 100) / totalTime).toFixed(3);
                    pline.system = Number((pline.system * 100) / totalTime).toFixed(3);
                    pline.idle = Number((pline.idle * 100) / totalTime).toFixed(3);
                    pline.iowait = Number((pline.iowait * 100) / totalTime).toFixed(3);
                    lines[index] = pline;
                });
                gather['osCPU'] = lines;
                resolve(gather);
            };
        });
    } catch (e) {
        reject(e);
    };
});
