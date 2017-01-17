'use strict';
const si = require('systeminformation');
const exec = require('child_process').exec;
module.exports = (data) => new Promise((resolve, reject) => {
    try {
        exec("lscpu", function(err, data) {
            if (!err) {
                let lines = data.trim().split('\n');
                let j = {};
                lines.forEach(e => {
                    let a = e.split(':');
                    j[a[0].trim()] = a[1].trim();
                });
                delete j['CPU min MHz'];
                if (typeof j['CPU max MHz'] != 'undefined') {
                    j['CPU MHz'] = j['CPU max MHz'];
                    delete j['CPU max MHz'];
                }
                resolve(j);
            } else {
                reject(err);
            }
        })
    } catch (e) {
        reject(e);
    };
});
