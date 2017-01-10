'use strict';

const osCPU = require('./actions/osCPU')
const linuxMemory = require('./actions/linuxMemory')

exports.run = (data) => new Promise((resolve, reject) => {
    switch (data.moduleFunction) {
        case "mOSCPU":
            osCPU(data).then(result => resolve(result)).catch(error => reject(error));
            break;
        case "mLinuxMemory":
            linuxMemory(data).then(result => resolve(result)).catch(error => reject(error));
            break;
        default:
            reject(new Error('unknow funcition'));
            break;
    }
});
