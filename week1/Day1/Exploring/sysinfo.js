const os = require('os');

function getSystemInfo(){
    const architecture = os.arch();

    const cpus = os.cpus();
    const cpuCores = cpus.length;
    const cpuModel = cpus[0].model;
    const cpuSpeed = cpus[0].speed;

    const totalMemory = os.totalmem;
    const freeMemory = os.freemem();

    const heapMemory = process.memoryUsage();
    const heapUsed = heapMemory.heapUsed;
    const heapTotal = heapMemory.heapTotal;

    const hostname = os.hostname();
    const osType = os.type();

    const bytesToGB =(bytes) => (bytes / (1024 ** 3)).toFixed(2);
    const bytesToMB = (bytes) => (bytes / (1024 ** 2)).toFixed(2);

  console.log("System Information:");
  console.log("-------------------------");
  console.log(`Architecture: ${architecture}`);
  console.log(`CPU Cores: ${cpuCores}`);
  console.log(`CPU Model: ${cpuModel}`);
  console.log(`CPU Speed: ${(cpuSpeed / 1000).toFixed(2)} GHz`);
  console.log(`Total Memory: ${bytesToGB(totalMemory)} GB`);
  console.log(`Free Memory: ${bytesToGB(freeMemory)} GB`);
  console.log(`Heap Memory Used: ${bytesToMB(heapUsed)} MB`);
  console.log(`Heap Memory Total: ${bytesToMB(heapTotal)} MB`);
  console.log(`Hostname: ${hostname}`);
  console.log(`OS Type: ${osType}`);
}


module.exports = { getSystemInfo };

