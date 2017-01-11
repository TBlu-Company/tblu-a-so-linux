'use strict';

const linuxMemory = require('./actions/linuxMemory')
const linuxCPU = require('./actions/linuxCPU')
const linuxFSSize = require('./actions/linuxFSSize')
const linuxFSSizeLogical = require('./actions/linuxFSSizeLogical')

exports.run = (data, dBconfig) => new Promise((resolve, reject) => {
    switch (data.moduleFunction) {
        case "mLinuxMemory":
            linuxMemory(data).then(result => resolve(result)).catch(error => reject(error));
            break;
        case "mLinuxCPU":
            linuxCPU(data, dBconfig).then(result => resolve(result)).catch(error => reject(error));
            break;
        case "mLinuxFSSize":
            linuxFSSize(data).then(result => resolve(result)).catch(error => reject(error));
            break;
        case "mLinuxFSSizeLogical":
            linuxFSSizeLogical(data).then(result => resolve(result)).catch(error => reject(error));
            break;
        default:
            reject(new Error('unknow funcition'));
            break;
    }
});
