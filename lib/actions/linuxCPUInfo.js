'use strict';
const si = require('systeminformation');
const exec = require('child_process').exec;
module.exports = (data) => new Promise((resolve, reject) => {
    try {
        exec("lscpu", function(err, data) {
            if (!err) {
                let lines = data.toString().trim().split('\n');
                resolve(lines);
            } else {
                reject(err);
            }
        })
    } catch (e) {
        reject(e);
    };
});
