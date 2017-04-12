'use strict';

const linuxMemory = require('./actions/linuxMemory')
const linuxCPU = require('./actions/linuxCPU')
const linuxFSLogic = require('./actions/linuxFSLogic')
const linuxFSFisic = require('./actions/linuxFSFisic')
const linuxNetworkConnectionsListen = require('./actions/linuxNetworkConnectionsListen')
const linuxNetworkConnections = require('./actions/linuxNetworkConnections')
const linuxNetworkInterfaces = require('./actions/linuxNetworkInterfaces')
const linuxNetworkIO = require('./actions/linuxNetworkIO')
const linuxCPUInfo = require('./actions/linuxCPUInfo')
const linuxCPUTemperature = require('./actions/linuxCPUTemperature')

exports.run = (data, dBconfig) => new Promise((resolve, reject) => {
    switch (data.moduleFunction) {
        case "mLinuxMemory":
            linuxMemory(data).then(result => resolve(result)).catch(error => reject(error));
            break;
        case "mLinuxCPU":
            linuxCPU(data, dBconfig).then(result => resolve(result)).catch(error => reject(error));
            break;
        case "mLinuxFSLogic":
            linuxFSLogic(data).then(result => resolve(result)).catch(error => reject(error));
            break;
        case "mLinuxFSFisic":
            linuxFSFisic(data).then(result => resolve(result)).catch(error => reject(error));
            break;
        case "mLinuxNetworkConnectionsListen":
            linuxNetworkConnectionsListen(data).then(result => resolve(result)).catch(error => reject(error));
            break;
        case "mLinuxNetworkConnections":
            linuxNetworkConnections(data).then(result => resolve(result)).catch(error => reject(error));
            break;
        case "mLinuxNetworkIO":
            linuxNetworkIO(data, dBconfig).then(result => resolve(result)).catch(error => reject(error));
            break;
        case "mLinuxNetworkInterfaces":
            linuxNetworkInterfaces(data, dBconfig).then(result => resolve(result)).catch(error => reject(error));
            break;
        case "mLinuxCPUInfo":
            linuxCPUInfo(data).then(result => resolve(result)).catch(error => reject(error));
            break;
        case "mLinuxCPUTemperature":
            linuxCPUTemperature(data).then(result => resolve(result)).catch(error => reject(error));
            break;
        default:
            reject(new Error('unknow funcition'));
            break;
    }
});
