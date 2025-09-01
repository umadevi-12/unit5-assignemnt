const EventEmitter = require('events');
const fs = require('fs');

const eventEmitter = new EventEmitter();


eventEmitter.on('log', (message) => {
    const timestamp = new Date().toISOString();
    
   
    console.log(`[${timestamp}] ${message}`);
    
   
    const logLine = `[${timestamp}] ${message}\n`;
    fs.appendFileSync('eventLogs.txt', logLine, 'utf8');
});

module.exports = eventEmitter;
