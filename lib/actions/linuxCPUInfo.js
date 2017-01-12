'use strict';
const si = require('systeminformation');
const exec = require('child_process').exec;
module.exports = (data) => new Promise((resolve, reject) => {
    try {
        let gather = {};
        si.cpu().then(result => {
            return (result);
        }).then(result => {
            exec("lscpu", function(err, data) {
                if (!err) {
                    gather['cpu'] = result;
                    let lines = data.toString().split('\n');
                    gather['exec'] = lines;
                    resolve(gather);
                } else {
                    reject(err);
                }
            })
        }).catch(err => {
            reject(err)
        });
    } catch (e) {
        reject(e);
    };
});
