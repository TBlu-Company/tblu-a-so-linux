'use strict';

const osCPU = require('./actions/osCPU')

exports.run = (data) => new Promise((resolve, reject) => {
    switch (data.moduleFunction) {
        case "mOSCPU":
            osCPU(data).then(result => resolve(result)).catch(error => reject(error));
            break;
        default:
            reject(new Error('unknow funcition'));
            break;
    }
});
